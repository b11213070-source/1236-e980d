import React, { useMemo, useState } from 'react';
import { Check, Copy, Play, Search } from 'lucide-react';
import { CHEATSHEET_ITEMS } from '../data/pythonContent';
import { CheatsheetCategory } from '../types/python';

interface CheatsheetSectionProps {
  onLoadSnippetToPlayground: (code: string, label: string) => void;
}

const CATEGORIES: CheatsheetCategory[] = [
  '全部',
  '基礎與型別',
  '字串操作',
  '串列與字典',
  '函式與推導式',
  '內建工具',
];

export const CheatsheetSection: React.FC<CheatsheetSectionProps> = ({
  onLoadSnippetToPlayground,
}) => {
  const [category, setCategory] = useState<CheatsheetCategory>('全部');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CHEATSHEET_ITEMS.filter((item) => {
      const matchCat = category === '全部' || item.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [category, query]);

  const handleCopy = async (id: string, snippet: string) => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedId(id);
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1800);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <section
      id="cheatsheet"
      className="py-12 sm:py-16 bg-white border-t border-slate-200 scroll-mt-16"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              04. Python 語法速查手冊
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5">
              常用內建函式、格式化模板與資料轉換片段，可即時搜尋並載入至演練場測試。
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋語法、方法或關鍵字..."
              aria-label="搜尋 Python 語法速查"
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 min-h-[40px]"
            />
          </div>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer ${
                category === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Cheatsheet Cards */}
        {filteredItems.length === 0 ? (
          <div className="py-12 px-6 text-center rounded-xl border border-slate-200 bg-slate-50">
            <p className="text-sm font-medium text-slate-700">
              找不到符合「{query}」的語法片段
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('全部');
              }}
              className="mt-3 px-4 py-2 text-xs font-semibold text-blue-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              顯示全部語法
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 pb-4">
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    {item.category}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="bg-[#0F172A] border-t border-slate-200">
                  <pre className="p-4 font-mono text-xs leading-relaxed text-slate-100 overflow-x-auto code-scroll">
                    {item.snippet}
                  </pre>
                  <div className="flex items-center justify-end gap-2 px-4 py-2.5 bg-slate-900 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.snippet)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {copiedId === item.id ? (
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
                      onClick={() => onLoadSnippetToPlayground(item.snippet, item.title)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>在演練場執行</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
