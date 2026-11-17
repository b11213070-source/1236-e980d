import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Play,
  RotateCcw,
  Terminal,
  Trash2,
} from 'lucide-react';
import { PLAYGROUND_PRESETS } from '../data/pythonContent';
import { EngineStatus, ExecutionResult, PythonPreset } from '../types/python';
import { CodeEditor } from './CodeEditor';

interface PythonPlaygroundProps {
  code: string;
  onCodeChange: (nextCode: string) => void;
  stdinText: string;
  onStdinChange: (nextStdin: string) => void;
  activeLabel: string;
  onSelectPreset: (preset: PythonPreset) => void;
  onRun: () => void;
  isRunning: boolean;
  engineStatus: EngineStatus;
  result: ExecutionResult | null;
}

type ConsoleTab = 'output' | 'variables' | 'stdin';

export const PythonPlayground: React.FC<PythonPlaygroundProps> = ({
  code,
  onCodeChange,
  stdinText,
  onStdinChange,
  activeLabel,
  onSelectPreset,
  onRun,
  isRunning,
  engineStatus,
  result,
}) => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>('output');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const handleResetDefault = () => {
    onSelectPreset(PLAYGROUND_PRESETS[0]);
  };

  const renderEngineStatus = () => {
    if (engineStatus === 'loading' || isRunning) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 whitespace-nowrap shrink-0">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{isRunning ? '程式執行中' : '載入 Python 3.12 中'}</span>
        </span>
      );
    }
    if (engineStatus === 'ready') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 whitespace-nowrap shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Python 3.12 就緒</span>
        </span>
      );
    }
    if (engineStatus === 'error') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 whitespace-nowrap shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>引擎連線失敗</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 whitespace-nowrap shrink-0">
        <Terminal className="w-3.5 h-3.5" />
        <span>按下執行即啟動 Python</span>
      </span>
    );
  };

  return (
    <section id="playground" className="py-12 sm:py-16 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              01. 互動式 Python 演練場
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5">
              支援完整 Python 3 語法、標準函式庫與 Ctrl+Enter 快捷執行，並在右側同步檢視變數狀態。
            </p>
          </div>

          <div className="flex items-center gap-4">{renderEngineStatus()}</div>
        </div>

        {/* Preset Selector Bar */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 whitespace-nowrap shrink-0">
            範例範本：
          </span>
          {PLAYGROUND_PRESETS.map((preset) => {
            const isSelected = activeLabel === preset.title;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {preset.title}
              </button>
            );
          })}
        </div>

        {/* Two-Zone Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Zone (60%): Editor Panel */}
          <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-200 bg-[#0F172A] shadow-sm overflow-hidden">
            {/* Editor Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-xs font-medium text-slate-300 truncate max-w-[200px] sm:max-w-[260px]">
                  main.py
                </span>
                <span aria-hidden="true" className="text-slate-600">
                  ·
                </span>
                <span className="text-xs text-slate-400 truncate max-w-[180px]">
                  {activeLabel}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopy}
                  title="複製程式碼"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 min-h-[34px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>已複製</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>複製</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onCodeChange('')}
                  title="清空編輯器"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 min-h-[34px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>清空</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefault}
                  title="恢復初始範例"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 min-h-[34px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重設</span>
                </button>

                <button
                  type="button"
                  onClick={onRun}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-70 rounded-md transition-colors whitespace-nowrap shrink-0 min-h-[34px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  {isRunning ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>{isRunning ? '執行中' : '執行程式'}</span>
                </button>
              </div>
            </div>

            <CodeEditor
              value={code}
              onChange={onCodeChange}
              onRun={onRun}
              minHeightClass="min-h-[380px] lg:min-h-[430px] flex-1"
            />
          </div>

          {/* Right Zone (40%): Console, Variable Inspector & Stdin */}
          <div className="lg:col-span-5 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Console Tabs */}
            <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('output')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'output'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  執行結果
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('variables')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                    activeTab === 'variables'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  變數檢視{result ? ` (${result.variables.length})` : ''}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('stdin')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'stdin'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  標準輸入 stdin
                </button>
              </div>

              {result && (
                <span className="text-xs text-slate-500 tabular-nums whitespace-nowrap shrink-0">
                  {result.durationMs} ms
                </span>
              )}
            </div>

            {/* Tab Body */}
            <div className="flex-1 flex flex-col min-h-[340px] lg:min-h-[430px] overflow-hidden">
              {activeTab === 'output' && (
                <div className="flex-1 flex flex-col p-4 overflow-auto code-scroll">
                  {!result && !isRunning && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10">
                      <Terminal className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="text-sm font-medium text-slate-700">
                        準備好執行 Python 程式碼
                      </p>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                        點擊右上角「執行程式」或按下 Ctrl + Enter，即時查看標準輸出與變數狀態。
                      </p>
                    </div>
                  )}

                  {isRunning && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10">
                      <Loader2 className="w-7 h-7 text-blue-600 animate-spin mb-3" />
                      <p className="text-sm font-medium text-slate-700">
                        正在編譯並執行 Python 腳本...
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        首次啟動需初始化 WebAssembly 直譯環境，請稍候數秒。
                      </p>
                    </div>
                  )}

                  {result && !isRunning && (
                    <div className="space-y-4">
                      {/* Status Header */}
                      <div
                        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${
                          result.success
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {result.success ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                          )}
                          <span>
                            {result.success
                              ? '執行完成（無錯誤）'
                              : `執行失敗：${result.errorType || 'Error'}`}
                          </span>
                        </span>
                        <span className="tabular-nums text-slate-500">
                          耗時 {result.durationMs} ms
                        </span>
                      </div>

                      {/* Error Diagnostic Hint */}
                      {!result.success && result.errorHint && (
                        <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-900 leading-relaxed">
                          <span className="font-semibold block mb-1">除錯提示</span>
                          {result.errorHint}
                        </div>
                      )}

                      {/* Stdout Block */}
                      {result.stdout ? (
                        <div>
                          <div className="text-xs font-medium text-slate-500 mb-1.5">
                            標準輸出 (stdout)
                          </div>
                          <pre className="p-3.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words overflow-x-auto">
                            {result.stdout}
                          </pre>
                        </div>
                      ) : (
                        result.success && (
                          <p className="text-xs text-slate-500 py-2">
                            程式已順利執行完畢，沒有產生 print() 輸出內容。可切換至「變數檢視」查看變數數值。
                          </p>
                        )
                      )}

                      {/* Stderr Traceback Block */}
                      {result.stderr && (
                        <div>
                          <div className="text-xs font-medium text-red-600 mb-1.5">
                            錯誤追蹤訊息 (stderr)
                          </div>
                          <pre className="p-3.5 rounded-lg bg-red-950 text-red-100 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words overflow-x-auto">
                            {result.stderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'variables' && (
                <div className="flex-1 flex flex-col p-4 overflow-auto code-scroll">
                  {!result || result.variables.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10">
                      <p className="text-sm font-medium text-slate-700">尚無可檢視的變數</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                        執行程式後，全域作用域中的字串、數字、串列與字典變數會自動列於此處。
                      </p>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <th className="py-2.5 px-3 font-semibold">變數名稱</th>
                            <th className="py-2.5 px-3 font-semibold">型別</th>
                            <th className="py-2.5 px-3 font-semibold">目前值</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-mono">
                          {result.variables.map((item) => (
                            <tr key={item.name} className="hover:bg-slate-50/70">
                              <td className="py-2.5 px-3 font-medium text-slate-900">
                                {item.name}
                              </td>
                              <td className="py-2.5 px-3 text-blue-700">{item.type}</td>
                              <td className="py-2.5 px-3 text-slate-700 break-all">
                                {item.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'stdin' && (
                <div className="flex-1 flex flex-col p-4">
                  <label
                    htmlFor="stdin-textarea"
                    className="text-xs font-medium text-slate-700 mb-1.5"
                  >
                    模擬鍵盤輸入內容（每行對應一次 input() 呼叫）
                  </label>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                    當程式碼中使用 input() 要求輸入時，Python 會依序從下方讀取每一行文字。
                  </p>
                  <textarea
                    id="stdin-textarea"
                    value={stdinText}
                    onChange={(e) => onStdinChange(e.target.value)}
                    placeholder="例如：&#10;林小美&#10;2026"
                    className="flex-1 w-full p-3 rounded-lg border border-slate-200 bg-slate-50 font-mono text-xs text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
