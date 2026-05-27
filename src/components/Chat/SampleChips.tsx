import React from 'react';

interface SampleChipsProps {
  onChipClick: (prompt: string) => void;
}

const SAMPLE_CHIPS = [
  "What are the top 10 pharmacies by revenue?",
  "What is the total revenue for year 2024 and 2025 respectively?",
  "Show me a breakdown of monthly revenue trend using a line chart.",
  "Use table to show recent transactions statuses and metrics.",
  "Use pie chart to analyze regional performance breakdowns by product category."
];

export const SampleChips: React.FC<SampleChipsProps> = ({ onChipClick }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Suggested Explorations</p>
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {SAMPLE_CHIPS.map((chip, idx) => (
          <button key={idx} onClick={() => onChipClick(chip)} className="px-4 py-2 bg-[#1F2433] border border-[#2E3A59]/60 hover:border-[#00E0C6] text-gray-300 text-xs rounded-full transition-all duration-200 transform hover:-translate-y-0.5 text-left shadow-sm">
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};