import React, { useState } from 'react';
import { ArrowRight, Code2 } from 'lucide-react';

interface HeroSectionProps {
  onStartCoding: () => void;
  completedLessonsCount: number;
  totalLessonsCount: number;
  solvedChallengesCount: number;
  totalChallengesCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartCoding,
  completedLessonsCount,
  totalLessonsCount,
  solvedChallengesCount,
  totalChallengesCount,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-slate-200 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Editorial Introduction */}
          <div className="lg:col-span-7 flex flex-col justify-between py-2">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-3">
                瀏覽器原生 CPython 3.12 互動學習平台
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 leading-[1.22] text-balance mb-5">
                在瀏覽器寫下第一行 Python，即時看見程式邏輯的運作
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-[1.65] max-w-2xl mb-8">
                免安裝開發環境，開啟網頁即可執行真實 Python 程式碼、檢視變數記憶體狀態，並透過自動化單元測試逐步累積實戰能力。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onStartCoding}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <span>立即開啟演練場</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#curriculum"
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                瀏覽系統課程
              </a>
            </div>
          </div>

          {/* Right Column: Technical Architecture Illustration */}
          <div className="lg:col-span-5">
            <div className="h-full min-h-[240px] rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
              {!imgError ? (
                <img
                  src="/src/assets/images/hero_python_workbench_1794900680148.jpg"
                  alt="Python 模組化程式架構與資料管線示意圖"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full lg:h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[240px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-100 to-blue-50">
                  <Code2 className="w-10 h-10 text-blue-600 mb-3" />
                  <p className="text-sm font-semibold text-slate-800">Python 互動執行工作台</p>
                  <p className="text-xs text-slate-500 mt-1">即時直譯 · 變數檢視 · 自動測試</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Summary Strip Below Hero Split */}
        <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">執行核心</div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">CPython 3.12</div>
            <div className="text-xs text-slate-500 mt-0.5">WebAssembly 瀏覽器端沙盒</div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">課程單元進度</div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {completedLessonsCount} / {totalLessonsCount} 堂課
            </div>
            <div className="text-xs text-slate-500 mt-0.5">涵蓋基礎語法至物件導向</div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">實戰題庫通過數</div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {solvedChallengesCount} / {totalChallengesCount} 題
            </div>
            <div className="text-xs text-slate-500 mt-0.5">即時 Assert 單元測試評測</div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">開發除錯輔助</div>
            <div className="text-lg font-bold text-slate-900">即時變數檢視</div>
            <div className="text-xs text-slate-500 mt-0.5">執行後同步顯示型別與數值</div>
          </div>
        </div>
      </div>
    </section>
  );
};
