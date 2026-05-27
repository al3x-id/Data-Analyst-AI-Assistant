import React from 'react';
import { DataRow } from '../../types';

interface FallbackTableProps {
  data: DataRow[];
}

export const FallbackTable: React.FC<FallbackTableProps> = ({ data }) => {
  if (!data || data.length === 0) return null;
  if (typeof data[0] !== 'object' || data[0] === null) return null;
  const columns = Object.keys(data[0]);

  return (
    <div className="w-full overflow-x-auto bg-[#151923] border border-[#2E3A59] rounded-xl custom-scrollbar mt-3">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-[#1F2433] text-[#00E0C6] font-bold uppercase tracking-wider border-b border-[#2E3A59]">
            {columns.map((col) => (
              <th key={col} className="p-2 whitespace-nowrap">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(data) ? data.slice(0, 20) : []).map((row, idx) => (
            <tr key={idx} className="border-b border-[#2E3A59]/40 hover:bg-[#1F2433]/50 transition-colors">
              {columns.map((col) => (
                <td key={col} className="p-2 text-gray-300 max-w-[150px] truncate">
                  {String(row[col] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 20 && (
        <div className="p-1.5 text-center text-[10px] text-gray-500 bg-[#1F2433]/30">
          Showing fallback rendering of first 20 rows.
        </div>
      )}
    </div>
  );
};