import React from 'react';
import { QueryHistoryItem } from '../../types';
import { MessageSquare, BarChart2, Table, Trash2, X } from 'lucide-react';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: QueryHistoryItem[];
  onSelectHistoryItem: (item: QueryHistoryItem) => void;
  onClearHistory: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onSelectHistoryItem, onClearHistory }) => {
  
  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'chart': return <BarChart2 size={14} className="text-[#00E0C6]" />;
      case 'table': return <Table size={14} className="text-[#2ECC71]" />;
      default: return <MessageSquare size={14} className="text-[#7D5FFF]" />;
    }
  };

  return (
    <>
      {/* Overlay backdrop for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />
      )}
      
      <aside aria-label="Query history panel" role="complementary" className={`fixed md:sticky top-0 left-0 h-full md:h-[calc(100vh-120px)] w-72 bg-[#151923] border-r md:border border-[#2E3A59]/40 z-50 md:z-0 transform transition-transform duration-300 ease-in-out flex flex-col rounded-r-2xl md:rounded-2xl shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:hidden'
      }`}>
        <div className="p-4 border-b border-[#2E3A59] flex justify-between items-center bg-[#1F2433]/40 rounded-tr-2xl">
          <span className="text-xs font-bold text-[#00E0C6] tracking-wider uppercase">Chat History</span>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
          {history.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">No cached historical items.</div>
          ) : (
            history.map((item) => (
              <button key={item.id} onClick={() => { onSelectHistoryItem(item); onClose(); }} className="w-full text-left p-2.5 rounded-xl bg-[#1F2433]/20 border border-transparent hover:border-[#2E3A59]/60 hover:bg-[#1F2433]/70 transition-all group flex flex-col gap-1.5">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>
                  <span className="text-xs font-medium text-gray-300 line-clamp-2 break-all group-hover:text-white transition-colors">
                    {item.query}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium self-end">{formatTime(item.timestamp)}</span>
              </button>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-3 border-t border-[#2E3A59] bg-[#1F2433]/20 rounded-br-2xl">
            <button onClick={onClearHistory} className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#FF4757]/10 hover:bg-[#FF4757] border border-[#FF4757]/30 text-[#FF4757] hover:text-white text-xs font-bold rounded-full transition-all duration-200">
              <Trash2 size={14} />
              Clear History
            </button>
          </div>
        )}
      </aside>
    </>
  );
};