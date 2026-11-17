import React, { useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (nextValue: string) => void;
  onRun?: () => void;
  minHeightClass?: string;
  ariaLabel?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  onRun,
  minHeightClass = 'min-h-[380px]',
  ariaLabel = 'Python 程式碼編輯器',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);

  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 1);

  const syncScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun?.();
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const currentLinePrefix = value.slice(lineStart, lineStart + 4);
        if (currentLinePrefix === '    ') {
          const updated = value.slice(0, lineStart) + value.slice(lineStart + 4);
          onChange(updated);
          requestAnimationFrame(() => {
            textarea.selectionStart = Math.max(lineStart, start - 4);
            textarea.selectionEnd = Math.max(lineStart, end - 4);
          });
        }
      } else {
        const updated = value.slice(0, start) + '    ' + value.slice(end);
        onChange(updated);
        requestAnimationFrame(() => {
          textarea.selectionStart = start + 4;
          textarea.selectionEnd = start + 4;
        });
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.slice(lineStart, start);
      const indentMatch = currentLine.match(/^\s*/);
      let indent = indentMatch ? indentMatch[0] : '';
      if (currentLine.trimEnd().endsWith(':')) {
        indent += '    ';
      }
      const insertion = '\n' + indent;
      const updated = value.slice(0, start) + insertion + value.slice(end);
      onChange(updated);
      requestAnimationFrame(() => {
        const nextPos = start + insertion.length;
        textarea.selectionStart = nextPos;
        textarea.selectionEnd = nextPos;
      });
    }
  };

  return (
    <div
      className={`relative flex bg-[#0F172A] text-slate-100 rounded-b-xl overflow-hidden ${minHeightClass}`}
    >
      <div
        ref={gutterRef}
        aria-hidden="true"
        className="select-none py-4 px-3 text-right font-mono text-xs leading-[1.65] text-slate-500 bg-slate-950/60 border-r border-slate-800 overflow-hidden shrink-0 w-12 tabular-nums"
      >
        {Array.from({ length: lineCount }, (_, idx) => (
          <div key={idx}>{idx + 1}</div>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        aria-label={ariaLabel}
        className="code-editor code-scroll flex-1 w-full bg-transparent text-slate-100 py-4 px-4 font-mono text-[13.5px] leading-[1.65] resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/70 whitespace-pre overflow-auto"
      />
    </div>
  );
};
