import React from 'react';

interface FooterProps {
  onResetProgress: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onResetProgress }) => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span className="font-semibold text-slate-800">PyCraft 互動學院</span>
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          <span>瀏覽器端 CPython 3.12 互動教學與演練平台</span>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <a href="#playground" className="hover:text-slate-900 transition-colors">
            互動演練場
          </a>
          <a href="#curriculum" className="hover:text-slate-900 transition-colors">
            課程路徑
          </a>
          <a href="#challenges" className="hover:text-slate-900 transition-colors">
            實戰題庫
          </a>
          <a href="#cheatsheet" className="hover:text-slate-900 transition-colors">
            語法速查
          </a>
          <button
            type="button"
            onClick={onResetProgress}
            className="text-slate-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            重設本機學習紀錄
          </button>
        </div>
      </div>
    </footer>
  );
};
