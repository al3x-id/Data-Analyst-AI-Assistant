import React, { useRef, useEffect } from 'react';
import { Message } from '../../types';
import { MessageBubble } from './MessageBubble';
import { SampleChips } from './SampleChips';
import { LoadingBubble } from '../UI/LoadingBubble';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onChipClick: (prompt: string) => void;
  onRetry: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading, onChipClick, onRetry }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar min-h-[500px] max-h-[70vh] bg-[#151923]/40 rounded-2xl border border-[#2E3A59]/20" role="log" aria-label="Conversation log">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center mb-6 max-w-md">
            <h3 className="text-xl font-bold text-white mb-2">Welcome, how can I help you?</h3>
            <p className="text-xs text-gray-400">Ask me questions about your sales, inventory or pharmacy data. I will help you visualize the information you need.</p>
          </div>
          <SampleChips onChipClick={onChipClick} />
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onRetry={onRetry} />
        ))
      )}
      {isLoading && <LoadingBubble />}
      <div ref={bottomRef} />
    </div>
  );
};