import React from 'react';

const MarkdownText = ({ content }) => {
  if (!content) return null;

  // Split content by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        // Handle Code Blocks
        if (part.startsWith('```')) {
          const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
          const lang = match?.[1] || 'text';
          const code = match?.[2] || '';
          
          return (
            <div key={index} className="relative group my-4">
              <div className="absolute right-3 top-3 text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-50 group-hover:opacity-100 transition-opacity">
                {lang}
              </div>
              <pre className="bg-slate-900 text-slate-100 p-5 rounded-2xl overflow-x-auto text-[13px] font-mono leading-relaxed border border-white/5 shadow-2xl custom-scrollbar">
                <code>{code.trim()}</code>
              </pre>
            </div>
          );
        }

        // Handle Inline Formatting
        // Split by newlines and handle bold/inline-code
        return part.split('\n').map((line, lineIdx) => {
          if (!line.trim() && lineIdx !== 0) return <div key={`br-${lineIdx}`} className="h-2" />;
          
          return (
            <p key={`line-${lineIdx}`} className="leading-relaxed">
              {line.split(/(\*\*.*?\*\*|`.*?`)/g).map((segment, segIdx) => {
                if (segment.startsWith('**') && segment.endsWith('**')) {
                  return <strong key={segIdx} className="font-black text-indigo-600 dark:text-indigo-400">{segment.slice(2, -2)}</strong>;
                }
                if (segment.startsWith('`') && segment.endsWith('`')) {
                  return <code key={segIdx} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-lg text-indigo-600 dark:text-indigo-400 font-mono text-[0.9em] border border-slate-200 dark:border-slate-700">{segment.slice(1, -1)}</code>;
                }
                return segment;
              })}
            </p>
          );
        });
      })}
    </div>
  );
};

export default MarkdownText;
