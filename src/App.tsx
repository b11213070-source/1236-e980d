import { useCallback, useEffect, useRef, useState } from 'react';
import { ChallengeArena } from './components/ChallengeArena';
import { CheatsheetSection } from './components/CheatsheetSection';
import { CurriculumSection } from './components/CurriculumSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { PythonPlayground } from './components/PythonPlayground';
import {
  CODING_CHALLENGES,
  LESSON_MODULES,
  PLAYGROUND_PRESETS,
} from './data/pythonContent';
import {
  ensurePyodideReady,
  runPythonCode,
  subscribeEngineStatus,
} from './services/pyodideRunner';
import { EngineStatus, ExecutionResult, PythonPreset } from './types/python';

const STORAGE_LESSONS_KEY = 'pycraft_completed_lessons_v1';
const STORAGE_CHALLENGES_KEY = 'pycraft_solved_challenges_v1';

function readStoredIds(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [code, setCode] = useState<string>(PLAYGROUND_PRESETS[0].code);
  const [stdinText, setStdinText] = useState<string>(PLAYGROUND_PRESETS[0].stdin ?? '');
  const [activeLabel, setActiveLabel] = useState<string>(PLAYGROUND_PRESETS[0].title);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [engineStatus, setEngineStatus] = useState<EngineStatus>('idle');
  const [result, setResult] = useState<ExecutionResult | null>(null);

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() =>
    readStoredIds(STORAGE_LESSONS_KEY)
  );
  const [solvedChallengeIds, setSolvedChallengeIds] = useState<string[]>(() =>
    readStoredIds(STORAGE_CHALLENGES_KEY)
  );

  const runningRef = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeEngineStatus(setEngineStatus);
    // Pre-warm Pyodide runtime quietly in the background
    ensurePyodideReady().catch(() => {
      // Handled by status subscription and on-demand retry on run
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_LESSONS_KEY,
        JSON.stringify(completedLessonIds)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [completedLessonIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_CHALLENGES_KEY,
        JSON.stringify(solvedChallengeIds)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [solvedChallengeIds]);

  const executeCode = useCallback(async (targetCode: string, targetStdin: string) => {
    if (runningRef.current) return;
    runningRef.current = true;
    setIsRunning(true);
    try {
      const execResult = await runPythonCode(targetCode, targetStdin);
      setResult(execResult);
    } finally {
      runningRef.current = false;
      setIsRunning(false);
    }
  }, []);

  const handleRunPlayground = useCallback(() => {
    void executeCode(code, stdinText);
  }, [code, stdinText, executeCode]);

  const scrollToPlayground = useCallback(() => {
    const el = document.getElementById('playground');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectPreset = useCallback(
    (preset: PythonPreset) => {
      const nextStdin = preset.stdin ?? '';
      setCode(preset.code);
      setStdinText(nextStdin);
      setActiveLabel(preset.title);
      setResult(null);
      void executeCode(preset.code, nextStdin);
    },
    [executeCode]
  );

  const handleLoadCodeToPlayground = useCallback(
    (nextCode: string, label: string, nextStdin = '') => {
      setCode(nextCode);
      setStdinText(nextStdin);
      setActiveLabel(label);
      setResult(null);
      scrollToPlayground();
      void executeCode(nextCode, nextStdin);
    },
    [scrollToPlayground, executeCode]
  );

  const handleLoadPresetAndScroll = useCallback(
    (preset: PythonPreset) => {
      scrollToPlayground();
      handleSelectPreset(preset);
    },
    [scrollToPlayground, handleSelectPreset]
  );

  const handleToggleLessonComplete = useCallback((lessonId: string) => {
    setCompletedLessonIds((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  }, []);

  const handleChallengeSolved = useCallback((challengeId: string) => {
    setSolvedChallengeIds((prev) =>
      prev.includes(challengeId) ? prev : [...prev, challengeId]
    );
  }, []);

  const handleResetProgress = useCallback(() => {
    setCompletedLessonIds([]);
    setSolvedChallengeIds([]);
    try {
      window.localStorage.removeItem(STORAGE_LESSONS_KEY);
      window.localStorage.removeItem(STORAGE_CHALLENGES_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const totalLessonsCount = LESSON_MODULES.reduce(
    (acc, mod) => acc + mod.lessons.length,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <Navbar onStartCoding={scrollToPlayground} />

      <main className="flex-1">
        <HeroSection
          onStartCoding={scrollToPlayground}
          completedLessonsCount={completedLessonIds.length}
          totalLessonsCount={totalLessonsCount}
          solvedChallengesCount={solvedChallengeIds.length}
          totalChallengesCount={CODING_CHALLENGES.length}
        />

        <PythonPlayground
          code={code}
          onCodeChange={setCode}
          stdinText={stdinText}
          onStdinChange={setStdinText}
          activeLabel={activeLabel}
          onSelectPreset={handleSelectPreset}
          onRun={handleRunPlayground}
          isRunning={isRunning}
          engineStatus={engineStatus}
          result={result}
        />

        <CurriculumSection
          completedLessonIds={completedLessonIds}
          onToggleLessonComplete={handleToggleLessonComplete}
          onLoadCodeToPlayground={handleLoadCodeToPlayground}
          onLoadPresetToPlayground={handleLoadPresetAndScroll}
        />

        <ChallengeArena
          solvedChallengeIds={solvedChallengeIds}
          onChallengeSolved={handleChallengeSolved}
        />

        <CheatsheetSection
          onLoadSnippetToPlayground={(snippet, label) =>
            handleLoadCodeToPlayground(snippet, label)
          }
        />
      </main>

      <Footer onResetProgress={handleResetProgress} />
    </div>
  );
}
