import React from 'react';
import ReactMarkdown from 'react-markdown';
import { DataRow, Message } from '../../types';
import { ChartContainer } from '../Visualizations/chartContainer';
import { DataTable } from '../Visualizations/DataTable';
import { RefreshCw, Terminal } from 'lucide-react';
import { FallbackTable } from '../Visualizations/FallbackTable';

interface MessageBubbleProps {
  message: Message;
  onRetry?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onRetry }) => {
  const isAI = message.role === 'assistant';

  const downloadCSV = (data: Record<string, any>[]) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((h) => {
            const val = row[h];
            return typeof val === 'string' && val.includes(',')
              ? `"${val}"`
              : val;
          })
          .join(',')
      )
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex items-start gap-3 mb-6 animate-fade-in ${isAI ? 'justify-start' : 'justify-end'}`} role="article">
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-[#7D5FFF] flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-md">
          AI
        </div>
      )}
      
      <div className={`flex flex-col max-w-[85%] ${isAI ? 'items-start' : 'items-end'}`}>
        <div className={`p-4 rounded-2xl border transition-all shadow-md ${
          isAI 
            ? message.isError 
              ? 'bg-[#151923] border-[#FF4757]/50 text-gray-200 rounded-tl-none' 
              : 'bg-[#151923] border-[#2E3A59]/40 text-gray-200 rounded-tl-none'
            : 'bg-[#2E3440] border-[#2E3A59]/60 text-gray-100 rounded-tr-none'
        }`}>
          {isAI && (
            <span className={`text-[10px] font-bold tracking-wider uppercase block mb-1 ${message.isError ? 'text-[#FF4757]' : 'text-[#7D5FFF]'}`}>
              {message.isError ? 'System Error' : 'AI Analyst'}
            </span>
          )}
          
          <div className="prose prose-invert text-sm max-w-none break-words leading-relaxed">
            <ReactMarkdown>
              {message.content.replace(/\\n/g, ' \n')}
            </ReactMarkdown>
          </div>

          {/* Render SQL snippet safely if present */}
          {message.sql && (
            <div className="mt-3 bg-[#1F2433] rounded-xl p-3 border border-[#2E3A59] font-mono text-[11px] text-[#00E0C6] overflow-x-auto custom-scrollbar">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                <Terminal size={12} /> Generated Query
              </div>
              <code>{message.sql}</code>
            </div>
          )}

          {/* Handle Action/Retry mechanics */}
          {message.isError && onRetry && (
            <button onClick={onRetry} className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-[#FF4757]/20 border border-[#FF4757]/40 hover:bg-[#FF4757] text-white text-xs font-bold rounded-full transition-all">
              <RefreshCw size={12} /> Retry Workflow
            </button>
          )}
        </div>

        {/* Embedded visualization elements when applicable */}
        {isAI && message.visualization && message.data && Array.isArray(message.data) && message.data.length > 0 && (
          <div className="w-full max-w-full mt-3">
            <ChartContainer visualization={message.visualization} data={message.data} />
          </div>
        )}

        {/* Download table button — only when data exists */}
        {isAI && Array.isArray(message.data) && message.data.length > 0 && (
          <button
          onClick={() => downloadCSV(message.data!)}
          className="mt-3 flex items-center gap-2 px-3 py-1.5 text-xs bg-[#1F2433] border border-[#2E3A59] text-[#00E0C6] rounded-lg hover:bg-[#2E3A59] transition-all"
          >
            ⬇️ Download Data as CSV
             </button>
            )}
            </div>

      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-[#2E3440] border border-[#2E3A59] flex items-center justify-center text-gray-300 shrink-0 font-medium text-xs">
          ME
        </div>
      )}
    </div>
  );
};