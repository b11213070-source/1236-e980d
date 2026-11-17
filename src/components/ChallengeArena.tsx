import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Eye,
  HelpCircle,
  Loader2,
  Play,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { CODING_CHALLENGES } from '../data/pythonContent';
import { runChallengeTests } from '../services/pyodideRunner';
import { ChallengeDifficulty, ChallengeRunResult } from '../types/python';
import { CodeEditor } from './CodeEditor';

interface ChallengeArenaProps {
  solvedChallengeIds: string[];
  onChallengeSolved: (challengeId: string) => void;
}

type DifficultyFilter = '全部' | ChallengeDifficulty;

const FILTER_OPTIONS: DifficultyFilter[] = ['全部', '基礎入門', '資料處理', '邏輯演算法'];

export const ChallengeArena: React.FC<ChallengeArenaProps> = ({
  solvedChallengeIds,
  onChallengeSolved,
}) => {
  const [filter, setFilter] = useState<DifficultyFilter>('全部');
  const [selectedId, setSelectedId] = useState<string>(CODING_CHALLENGES[0].id);
  const [codeByChallenge, setCodeByChallenge] = useState<Record<string, string>>(() =>
    Object.fromEntries(CODING_CHALLENGES.map((c) => [c.id, c.starterCode]))
  );
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [runResult, setRunResult] = useState<ChallengeRunResult | null>(null);

  const filteredChallenges =
    filter === '全部'
      ? CODING_CHALLENGES
      : CODING_CHALLENGES.filter((c) => c.difficulty === filter);

  const activeChallenge =
    CODING_CHALLENGES.find((c) => c.id === selectedId) ?? CODING_CHALLENGES[0];

  const currentCode = codeByChallenge[activeChallenge.id] ?? activeChallenge.starterCode;

  const handleSelectChallenge = (id: string) => {
    setSelectedId(id);
    setShowHint(false);
    setShowSolution(false);
    setRunResult(null);
  };

  const handleCodeChange = (nextCode: string) => {
    setCodeByChallenge((prev) => ({
      ...prev,
      [activeChallenge.id]: nextCode,
    }));
  };

  const handleResetStarter = () => {
    handleCodeChange(activeChallenge.starterCode);
    setRunResult(null);
  };

  const handleRunTests = async () => {
    if (isTesting) return;
    setIsTesting(true);
    try {
      const result = await runChallengeTests(currentCode, activeChallenge.testCases);
      setRunResult(result);
      if (result.allPassed) {
        onChallengeSolved(activeChallenge.id);
      }
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <section id="challenges" className="py-12 sm:py-16 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              03. 實戰題庫與自動評測
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5">
              撰寫符合規格的 Python 函式，點擊執行後系統將以真實單元測試驗證所有邊界條件。
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start md:self-auto">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFilter(opt)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === opt
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Challenge List */}
          <div className="lg:col-span-4 space-y-2.5">
            {filteredChallenges.map((item) => {
              const isSelected = item.id === activeChallenge.id;
              const isSolved = solvedChallengeIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectChallenge(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors flex items-start gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    isSelected
                      ? 'bg-white border-blue-600 shadow-sm'
                      : 'bg-white/70 border-slate-200 hover:bg-white'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {isSolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-900">{item.title}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 tabular-nums">
                      <span>{item.difficulty}</span>
                      <span aria-hidden="true">·</span>
                      <span>約 {item.estimatedMinutes} 分鐘</span>
                      {isSolved && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 font-medium">已通過</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Active Challenge Workspace */}
          <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {/* Challenge Description Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 tabular-nums">
                  <span>{activeChallenge.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeChallenge.testCases.length} 組驗證測試</span>
                </div>
                {solvedChallengeIds.includes(activeChallenge.id) && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>已完成評測</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {activeChallenge.title}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                {activeChallenge.prompt}
              </p>

              <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 overflow-x-auto">
                {activeChallenge.functionSignature}
              </div>

              {/* Optional Hint & Solution Toggles */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? '隱藏解題提示' : '查看解題提示'}</span>
                </button>

                <span aria-hidden="true" className="text-slate-300">
                  |
                </span>

                <button
                  type="button"
                  onClick={() => setShowSolution((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showSolution ? '隱藏參考解法' : '檢視參考解法'}</span>
                </button>
              </div>

              {showHint && (
                <div className="mt-3 p-3.5 rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-900 leading-relaxed">
                  {activeChallenge.hint}
                </div>
              )}

              {showSolution && (
                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-900 overflow-hidden">
                  <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-800 text-xs text-slate-400">
                    <span>參考解答</span>
                    <button
                      type="button"
                      onClick={() => {
                        handleCodeChange(activeChallenge.solutionCode);
                        setShowSolution(false);
                      }}
                      className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                    >
                      套用至編輯區
                    </button>
                  </div>
                  <pre className="p-3.5 font-mono text-xs text-slate-100 overflow-x-auto">
                    {activeChallenge.solutionCode}
                  </pre>
                </div>
              )}
            </div>

            {/* Editor Toolbar & CodeEditor */}
            <div className="bg-[#0F172A]">
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                <span className="font-mono text-xs text-slate-400">solution.py</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetStarter}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重設範本</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRunTests}
                    disabled={isTesting}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isTesting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isTesting ? '評測中' : '執行自動測試'}</span>
                  </button>
                </div>
              </div>

              <CodeEditor
                value={currentCode}
                onChange={handleCodeChange}
                onRun={handleRunTests}
                minHeightClass="min-h-[240px]"
                ariaLabel={`${activeChallenge.title} 作答編輯器`}
              />
            </div>

            {/* Test Cases & Automated Judge Results */}
            <div className="p-5 bg-slate-50 border-t border-slate-200">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h4 className="text-xs font-semibold text-slate-700">單元測試案例</h4>
                {runResult && (
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      runResult.allPassed ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {runResult.allPassed
                      ? `全部通過 (${runResult.results.length}/${runResult.results.length}) · ${runResult.durationMs} ms`
                      : `部分未通過 (${
                          runResult.results.filter((r) => r.passed).length
                        }/${runResult.results.length}) · ${runResult.durationMs} ms`}
                  </span>
                )}
              </div>

              {runResult?.compileError && (
                <div className="mb-3 p-3 rounded-lg border border-red-200 bg-red-50 font-mono text-xs text-red-800">
                  {runResult.compileError}
                </div>
              )}

              <div className="space-y-2">
                {activeChallenge.testCases.map((tc, index) => {
                  const tcRes = runResult?.results.find((r) => r.id === tc.id);
                  return (
                    <div
                      key={tc.id}
                      className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                        !tcRes
                          ? 'bg-white border-slate-200 text-slate-700'
                          : tcRes.passed
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : 'bg-red-50 border-red-200 text-red-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {!tcRes ? (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        ) : tcRes.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                        <span className="font-mono truncate">
                          測試 {index + 1}：{tc.description}
                        </span>
                      </div>

                      {tcRes && (
                        <span className="font-semibold shrink-0">
                          {tcRes.passed ? '通過' : tcRes.errorMessage || '未通過'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
