import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Circle, Play } from 'lucide-react';
import { LESSON_MODULES, PLAYGROUND_PRESETS } from '../data/pythonContent';
import { LessonItem, PythonPreset } from '../types/python';

interface CurriculumSectionProps {
  completedLessonIds: string[];
  onToggleLessonComplete: (lessonId: string) => void;
  onLoadCodeToPlayground: (code: string, label: string, stdin?: string) => void;
  onLoadPresetToPlayground: (preset: PythonPreset) => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({
  completedLessonIds,
  onToggleLessonComplete,
  onLoadCodeToPlayground,
  onLoadPresetToPlayground,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState(LESSON_MODULES[0].id);
  const [selectedLessonId, setSelectedLessonId] = useState(
    LESSON_MODULES[0].lessons[0].id
  );
  const [dsImgErr, setDsImgErr] = useState(false);
  const [algoImgErr, setAlgoImgErr] = useState(false);

  const activeModule =
    LESSON_MODULES.find((m) => m.id === selectedModuleId) ?? LESSON_MODULES[0];
  const activeLesson: LessonItem =
    activeModule.lessons.find((l) => l.id === selectedLessonId) ??
    activeModule.lessons[0];

  const totalLessons = LESSON_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = completedLessonIds.length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isLessonDone = completedLessonIds.includes(activeLesson.id);

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    const mod = LESSON_MODULES.find((m) => m.id === moduleId);
    if (mod && mod.lessons.length > 0) {
      setSelectedLessonId(mod.lessons[0].id);
    }
  };

  const dataSciencePreset =
    PLAYGROUND_PRESETS.find((p) => p.id === 'data-statistics') ?? PLAYGROUND_PRESETS[0];
  const algorithmPreset =
    PLAYGROUND_PRESETS.find((p) => p.id === 'prime-sieve') ?? PLAYGROUND_PRESETS[0];

  return (
    <section
      id="curriculum"
      className="py-12 sm:py-16 bg-white border-y border-slate-200 scroll-mt-16"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header + Progress */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              02. 系統化 Python 課程路徑
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5">
              循序漸進掌握資料型別、流程控制、推導式與物件導向設計，每堂課皆可一鍵載入演練場實作。
            </p>
          </div>

          <div className="w-full md:w-64 shrink-0">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5 tabular-nums">
              <span>學習進度</span>
              <span>
                {completedCount} / {totalLessons} 堂 ({progressPercent}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Module Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {LESSON_MODULES.map((mod) => {
            const isActive = mod.id === activeModule.id;
            const modDone = mod.lessons.filter((l) =>
              completedLessonIds.includes(l.id)
            ).length;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => handleSelectModule(mod.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>
                  {mod.indexLabel}：{mod.title}
                </span>
                <span
                  className={`ml-2 tabular-nums ${
                    isActive ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {modDone}/{mod.lessons.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Module Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Module Overview & Lesson Selector */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span>{activeModule.indexLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{activeModule.level}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {activeModule.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              {activeModule.description}
            </p>

            <div className="space-y-2 border-t border-slate-200 pt-4">
              {activeModule.lessons.map((lesson, idx) => {
                const isSelected = lesson.id === activeLesson.id;
                const done = completedLessonIds.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors flex items-start gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      isSelected
                        ? 'bg-white border-blue-600 shadow-sm'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900">
                        {idx + 1}. {lesson.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                        約 {lesson.durationMinutes} 分鐘{done ? ' · 已完成' : ''}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Lesson Concept & Interactive Example */}
          <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 tabular-nums">
                  <span>{activeModule.title}</span>
                  <span aria-hidden="true">·</span>
                  <span>預計閱讀 {activeLesson.durationMinutes} 分鐘</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{activeLesson.title}</h3>
              </div>

              <button
                type="button"
                onClick={() => onToggleLessonComplete(activeLesson.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[38px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isLessonDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isLessonDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
                <span>{isLessonDone ? '已完成此單元' : '標記為已完成'}</span>
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mt-5 mb-5">
              {activeLesson.summary}
            </p>

            {/* Key Concept List */}
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-slate-500 mb-2.5">核心觀念重點</h4>
              <ul className="space-y-2">
                {activeLesson.conceptPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="font-mono text-xs font-semibold text-blue-600 mt-1 tabular-nums">
                      0{i + 1}.
                    </span>
                    <span className="leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Syntax Note */}
            <div className="mb-5 px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 overflow-x-auto">
              <span className="text-slate-500 mr-2 font-sans font-medium">常用語法：</span>
              {activeLesson.syntaxNote}
            </div>

            {/* Code Preview + Load CTA */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-[#0F172A]">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                <span className="font-mono text-xs text-slate-400">lesson_example.py</span>
                <button
                  type="button"
                  onClick={() =>
                    onLoadCodeToPlayground(
                      activeLesson.code,
                      activeLesson.title,
                      activeLesson.stdin
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>載入演練場並執行</span>
                </button>
              </div>
              <pre className="p-4 font-mono text-[13px] leading-[1.6] text-slate-100 overflow-x-auto code-scroll">
                {activeLesson.code}
              </pre>
            </div>
          </div>
        </div>

        {/* Applied Tracks Preview */}
        <div className="mt-10 pt-10 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch">
            <div className="sm:col-span-5 bg-slate-100 min-h-[160px]">
              {!dsImgErr ? (
                <img
                  src="/src/assets/images/track_data_science_1794900680825.jpg"
                  alt="資料科學與統計分析學習路徑"
                  referrerPolicy="no-referrer"
                  onError={() => setDsImgErr(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[160px] flex items-center justify-center bg-blue-50 text-blue-700 text-xs font-semibold">
                  資料分析視覺圖表
                </div>
              )}
            </div>
            <div className="sm:col-span-7 p-5 flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-500 mb-1">延伸專題 · 資料科學</div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">
                  統計運算與數據清洗
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  運用 Python 內建 statistics 模組與串列推導式，實作平均數、中位數與標準差分析。
                </p>
              </div>
              <button
                type="button"
                onClick={() => onLoadPresetToPlayground(dataSciencePreset)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 cursor-pointer self-start"
              >
                <span>載入資料分析範例</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch">
            <div className="sm:col-span-5 bg-slate-100 min-h-[160px]">
              {!algoImgErr ? (
                <img
                  src="/src/assets/images/track_algorithms_1794900680665.jpg"
                  alt="演算法思維與質數篩選學習路徑"
                  referrerPolicy="no-referrer"
                  onError={() => setAlgoImgErr(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[160px] flex items-center justify-center bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  演算法結構圖
                </div>
              )}
            </div>
            <div className="sm:col-span-7 p-5 flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-500 mb-1">延伸專題 · 演算法邏輯</div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">
                  質數篩選與複雜度思維
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  透過布林陣列與迴圈步長控制，體驗埃拉托斯特尼篩選法在時間效率上的優勢。
                </p>
              </div>
              <button
                type="button"
                onClick={() => onLoadPresetToPlayground(algorithmPreset)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 cursor-pointer self-start"
              >
                <span>載入質數篩選範例</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
