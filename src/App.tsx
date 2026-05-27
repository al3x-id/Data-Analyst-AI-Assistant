import React, { useState, useEffect, useRef } from 'react';
import { useSession } from './hooks/useSession';
import { useHistory } from './hooks/useHistory';
import { useChat } from './hooks/useChat';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { HistorySidebar } from './components/Sidebar/HistorySidebar';
import { ChatContainer } from './components/Chat/ChatContainer';
const Send = ({ size }: { size?: number }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size ?? 14,
      height: size ?? 14,
      fontSize: size ? size - 2 : 12,
    }}
  >
    ➤
  </span>
);

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputText, setInputText] = useState<string>('');

  const { sessionId, regenerateSession } = useSession();
  const { history, saveHistoryItem, clearHistory } = useHistory();

  const handleSuccess = (query: string, fullSnapshot: any[], lastMessage: any) => {
    saveHistoryItem(query, fullSnapshot, lastMessage);
  };

  const { messages, isLoading, sendPrompt, retryLastMessage, resetChat, loadSnapshot } = useChat(sessionId, handleSuccess);

  useEffect(() => {
    // Initial scaling visibility checks based on user window boundaries
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    inputRef.current?.focus();
  }, []);

  const handleDispatch = () => {
    if (!inputText.trim() || isLoading) return;
    sendPrompt(inputText);
    setInputText('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDispatch();
    }
  };

  const handleNewSession = () => {
    regenerateSession();
    resetChat();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-gray-100 selection:bg-[#00E0C6]/30">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onNewSession={handleNewSession} />

      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 flex gap-6 relative items-start">
        <HistorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} history={history} onSelectHistoryItem={(item) => loadSnapshot(item.messagesSnapshot)} onClearHistory={clearHistory} />

        <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto bg-[#151923] rounded-2xl border border-[#2E3A59]/30 shadow-2xl overflow-hidden min-h-[600px]">
          <ChatContainer messages={messages} isLoading={isLoading} onChipClick={(p) => sendPrompt(p)} onRetry={retryLastMessage} />

          {/* Prompt Entry Input Dock */}
          <div className="p-4 border-t border-[#2E3A59]/40 bg-[#1F2433]/50">
            <div className="relative flex items-end bg-[#1F2433] border border-[#2E3A59]/60 focus-within:border-[#00E0C6] rounded-2xl p-2 transition-all shadow-inner">
              <textarea ref={inputRef} rows={1} value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown} disabled={isLoading} placeholder={isLoading ? "Please wait for response data execution..." : "Ask question about your data..."} className="flex-1 max-h-32 min-h-[24px] bg-transparent text-sm text-gray-200 placeholder-gray-500 resize-none px-2 py-1 focus:outline-none custom-scrollbar disabled:opacity-50" />
              <button onClick={handleDispatch} disabled={isLoading || !inputText.trim()} className="p-2.5 bg-gradient-to-r from-[#00E0C6] to-[#00BFA5] disabled:from-[#2E3440] disabled:to-[#2E3440] text-[#151923] disabled:text-gray-500 rounded-xl transition-all shadow-md active:scale-95 focus:outline-none" aria-label="Transmit Prompt">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}