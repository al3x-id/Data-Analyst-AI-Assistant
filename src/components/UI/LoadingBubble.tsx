import React from 'react';

export const LoadingBubble: React.FC = () => {
  return (
    <div className="flex items-start gap-3 justify-start animate-pulse mb-4">
      <div className="w-8 h-8 rounded-full bg-[#7D5FFF] flex items-center justify-center text-white shrink-0 font-bold text-xs">
        AI
      </div>
      <div className="flex flex-col max-w-[80%]">
        <div className="bg-[#151923] text-gray-300 p-4 rounded-2xl rounded-tl-none border border-[#2E3A59]/40 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7D5FFF] font-bold tracking-wider uppercase block mb-1">AI is thinking</span>
            <div className="flex space-x-1 items-center">
              <div className="w-1.5 h-1.5 bg-[#00E0C6] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-[#00E0C6] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-[#00E0C6] rounded-full animate-bounce"></div>
            </div>
          </div>
          <div className="h-4 bg-[#1F2433] rounded w-48 mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};