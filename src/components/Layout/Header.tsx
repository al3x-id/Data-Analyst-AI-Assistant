import React from 'react';
import { Database, History, PlusCircle } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onNewSession: () => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, onNewSession }) => {
  return (
    <header className="w-full bg-[#151923]/90 backdrop-blur-md border-b border-[#2E3A59]/40 sticky top-0 z-30 px-4 py-3 shadow-lg">
      <div className="max-width-[1200px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-[#1F2433] hover:bg-[#2E3A59] border border-[#2E3A59]/60 text-gray-300 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-[#00E0C6]" aria-label="Toggle history mapping" aria-expanded={sidebarOpen}>
            <History size={16} />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#00BFA5]/20 rounded-xl text-[#00E0C6]">
              <Database size={18} />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-wide uppercase leading-none mb-0.5">Idowu Aluko AI Data Analyst Assistant</h1>
              <p className="text-[10px] text-gray-400 font-medium">Pharmacy Analytics Sandbox</p>
            </div>
          </div>
        </div>

        <button onClick={onNewSession} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#00E0C6] to-[#00BFA5] text-[#151923] text-xs font-bold rounded-full shadow-md hover:brightness-110 active:scale-95 transition-all">
          <PlusCircle size={14} />
          New Chat
        </button>
      </div>
    </header>
  );
};