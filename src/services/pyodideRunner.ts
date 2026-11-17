import {
  ChallengeRunResult,
  ChallengeTestCase,
  EngineStatus,
  ExecutionResult,
  PythonVariable,
  TestCaseResult,
} from '../types/python';

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: {
    set: (name: string, value: unknown) => void;
    get: (name: string) => unknown;
  };
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

const PYODIDE_VERSION = 'v0.27.2';
const PYODIDE_BASE_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;
const PYODIDE_SCRIPT_URL = `${PYODIDE_BASE_URL}pyodide.js`;

const ERROR_HINTS: Record<string, string> = {
  SyntaxError: '語法錯誤：請檢查是否遺漏冒號 (:)、括號未成對關閉，或字串引號未閉合。',
  IndentationError: '縮排錯誤：Python 使用統一的 4 個空白縮排區分程式區塊，請確認上下行縮排一致。',
  NameError: '名稱未定義：使用了尚未宣告的變數或函式名稱，請檢查拼寫與大小寫。',
  TypeError: '型別錯誤：對不相容的型別執行了運算（例如將字串與整數直接相加）。',
  ValueError: '數值錯誤：傳入函式的資料型別正確但數值無效（例如 int("abc")）。',
  IndexError: '索引超出範圍：串列或字串的索引位置超過現有長度。',
  KeyError: '鍵值不存在：字典中找不到該鍵，建議改用 dict.get(key, default) 安全取值。',
  ZeroDivisionError: '除以零錯誤：分母不可為 0，請先檢查除數條件或使用 try/except。',
  AttributeError: '屬性或方法錯誤：該物件型別不具備你嘗試呼叫的方法或屬性。',
  EOFError: '輸入結束錯誤：程式呼叫了 input()，但「標準輸入 stdin」分頁中已無更多資料行。',
};

let pyodideInstance: PyodideInterface | null = null;
let initPromise: Promise<PyodideInterface> | null = null;
let currentStatus: EngineStatus = 'idle';
const statusListeners = new Set<(status: EngineStatus) => void>();

function setStatus(next: EngineStatus) {
  currentStatus = next;
  statusListeners.forEach((listener) => listener(next));
}

export function getEngineStatus(): EngineStatus {
  return currentStatus;
}

export function subscribeEngineStatus(listener: (status: EngineStatus) => void): () => void {
  statusListeners.add(listener);
  listener(currentStatus);
  return () => {
    statusListeners.delete(listener);
  };
}

function loadPyodideScript(): Promise<void> {
  if (typeof window.loadPyodide === 'function') {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PYODIDE_SCRIPT_URL}"]`
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('無法載入 Python 執行環境腳本')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = PYODIDE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('無法連線至 Pyodide CDN，請檢查網路狀態。'));
    document.head.appendChild(script);
  });
}

export async function ensurePyodideReady(): Promise<PyodideInterface> {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  setStatus('loading');

  initPromise = (async () => {
    try {
      await loadPyodideScript();
      if (!window.loadPyodide) {
        throw new Error('Pyodide 初始化函式不存在');
      }
      const py = await window.loadPyodide({
        indexURL: PYODIDE_BASE_URL,
      });
      pyodideInstance = py;
      setStatus('ready');
      return py;
    } catch (error) {
      initPromise = null;
      setStatus('error');
      throw error;
    }
  })();

  return initPromise;
}

export async function runPythonCode(code: string, stdinText = ''): Promise<ExecutionResult> {
  const startTime = performance.now();
  try {
    const py = await ensurePyodideReady();
    py.globals.set('__pycraft_user_code__', code);
    py.globals.set('__pycraft_user_stdin__', stdinText);

    const runnerScript = `
import sys, io, json, traceback

_stdout_buf = io.StringIO()
_stderr_buf = io.StringIO()
_stdin_buf = io.StringIO(__pycraft_user_stdin__)

_old_stdout, _old_stderr, _old_stdin = sys.stdout, sys.stderr, sys.stdin
sys.stdout = _stdout_buf
sys.stderr = _stderr_buf
sys.stdin = _stdin_buf

_ns = {"__name__": "__main__"}
_success = True
_error_type = ""

try:
    _compiled = compile(__pycraft_user_code__, "<playground.py>", "exec")
    exec(_compiled, _ns)
except Exception as exc:
    _success = False
    _error_type = type(exc).__name__
    traceback.print_exc(file=_stderr_buf)
finally:
    sys.stdout = _old_stdout
    sys.stderr = _old_stderr
    sys.stdin = _old_stdin

_vars = []
for _k, _v in _ns.items():
    if _k.startswith("_"):
        continue
    if callable(_v) or type(_v).__name__ == "module":
        continue
    try:
        _repr = repr(_v)
    except Exception:
        _repr = "<無法顯示>"
    if len(_repr) > 120:
        _repr = _repr[:117] + "..."
    _vars.append({
        "name": str(_k),
        "type": type(_v).__name__,
        "value": _repr,
    })

json.dumps({
    "success": _success,
    "stdout": _stdout_buf.getvalue(),
    "stderr": _stderr_buf.getvalue(),
    "errorType": _error_type,
    "variables": _vars,
})
`;

    const rawJson = (await py.runPythonAsync(runnerScript)) as string;
    const parsed = JSON.parse(rawJson) as {
      success: boolean;
      stdout: string;
      stderr: string;
      errorType: string;
      variables: PythonVariable[];
    };

    const durationMs = Math.round(performance.now() - startTime);
    const errorHint = parsed.errorType ? ERROR_HINTS[parsed.errorType] : undefined;

    return {
      success: parsed.success,
      stdout: parsed.stdout,
      stderr: parsed.stderr,
      errorType: parsed.errorType || undefined,
      errorHint,
      durationMs,
      variables: parsed.variables || [],
    };
  } catch (err) {
    const durationMs = Math.round(performance.now() - startTime);
    const message = err instanceof Error ? err.message : '執行 Python 時發生未預期錯誤';
    return {
      success: false,
      stdout: '',
      stderr: message,
      errorType: 'RuntimeError',
      errorHint: '請確認網路連線正常，並再次點擊「執行程式」。',
      durationMs,
      variables: [],
    };
  }
}

export async function runChallengeTests(
  userCode: string,
  testCases: ChallengeTestCase[]
): Promise<ChallengeRunResult> {
  const startTime = performance.now();
  try {
    const py = await ensurePyodideReady();
    py.globals.set('__pycraft_challenge_code__', userCode);
    py.globals.set(
      '__pycraft_challenge_tests__',
      JSON.stringify(testCases.map((tc) => ({ id: tc.id, assertionCode: tc.assertionCode })))
    );

    const testRunnerScript = `
import sys, io, json, traceback

_stdout_buf = io.StringIO()
_old_stdout = sys.stdout
sys.stdout = _stdout_buf

_ns = {"__name__": "__main__"}
_compile_error = ""
_results = []

try:
    _compiled = compile(__pycraft_challenge_code__, "<solution.py>", "exec")
    exec(_compiled, _ns)
except Exception as exc:
    _compile_error = f"{type(exc).__name__}: {exc}"

if not _compile_error:
    _tests = json.loads(__pycraft_challenge_tests__)
    for _t in _tests:
        try:
            exec(_t["assertionCode"], _ns)
            _results.append({"id": _t["id"], "passed": True, "errorMessage": ""})
        except AssertionError:
            _results.append({"id": _t["id"], "passed": False, "errorMessage": "輸出結果與預期不符"})
        except Exception as exc:
            _results.append({"id": _t["id"], "passed": False, "errorMessage": f"{type(exc).__name__}: {exc}"})

sys.stdout = _old_stdout

json.dumps({
    "compileError": _compile_error,
    "stdout": _stdout_buf.getvalue(),
    "results": _results,
})
`;

    const rawJson = (await py.runPythonAsync(testRunnerScript)) as string;
    const parsed = JSON.parse(rawJson) as {
      compileError: string;
      stdout: string;
      results: Array<{ id: string; passed: boolean; errorMessage: string }>;
    };

    const durationMs = Math.round(performance.now() - startTime);

    if (parsed.compileError) {
      return {
        allPassed: false,
        stdout: parsed.stdout,
        compileError: parsed.compileError,
        durationMs,
        results: testCases.map((tc) => ({
          id: tc.id,
          description: tc.description,
          passed: false,
          errorMessage: '程式語法或載入錯誤，未能執行測試',
        })),
      };
    }

    const resultMap = new Map(parsed.results.map((r) => [r.id, r]));
    const mergedResults: TestCaseResult[] = testCases.map((tc) => {
      const r = resultMap.get(tc.id);
      return {
        id: tc.id,
        description: tc.description,
        passed: Boolean(r?.passed),
        errorMessage: r?.errorMessage || undefined,
      };
    });

    return {
      allPassed: mergedResults.length > 0 && mergedResults.every((r) => r.passed),
      stdout: parsed.stdout,
      durationMs,
      results: mergedResults,
    };
  } catch (err) {
    const durationMs = Math.round(performance.now() - startTime);
    return {
      allPassed: false,
      stdout: '',
      compileError: err instanceof Error ? err.message : '測試環境載入失敗',
      durationMs,
      results: testCases.map((tc) => ({
        id: tc.id,
        description: tc.description,
        passed: false,
        errorMessage: '測試環境連線異常',
      })),
    };
  }
}
