import React, { useState } from 'react';
import { DataRow } from '../../types';
import { Download } from 'lucide-react';

interface DataTableProps {
  data: DataRow[];
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [limit, setLimit] = useState(20);
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  const exportToCSV = () => {
    const csvRows = [columns.join(',')];

    for (const row of data) {
      const values = columns.map((col) => {
        const val = row[col];
        const escaped = ('' + (val ?? '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `exported_data_${new Date().toISOString().slice(0,19).replace(/[:T]/g, '-')}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full mt-4 bg-[#151923] border border-[#2E3A59] rounded-2xl overflow-hidden shadow-lg">
      <div className="p-3 bg-[#1F2433] flex justify-between items-center border-b border-[#2E3A59]">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Data Snapshot ({data.length} rows)</span>
        <button onClick={exportToCSV} className="flex items-center gap-1.5 px-3 py-1 bg-[#2E3440] hover:bg-[#00BFA5] text-white hover:text-[#151923] text-xs font-semibold rounded-full transition-all duration-200">
          <Download size={14} />
          Export CSV
        </button>
      </div>
      <div className="w-full overflow-x-auto custom-scrollbar max-h-96">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#1F2433] text-[#00E0C6] font-bold sticky top-0 z-10 shadow-sm">
              {columns.map((col) => (
                <th key={col} className="p-3 whitespace-nowrap bg-[#1F2433] border-b border-[#2E3A59]">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, limit).map((row, idx) => (
              <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#151923]' : 'bg-[#1F2433]/40'} hover:bg-[#2E3A59]/20 transition-colors`}>
                {columns.map((col) => (
                  <td key={col} className="p-3 text-gray-300 whitespace-nowrap border-b border-[#2E3A59]/40">
                    {String(row[col] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > limit && (
        <div className="p-3 text-center bg-[#1F2433]/50 border-t border-[#2E3A59]">
          <button onClick={() => setLimit((prev) => prev + 20)} className="text-xs font-bold text-[#00E0C6] hover:text-[#00BFA5] transition-colors">
            Show More Rows
          </button>
        </div>
      )}
    </div>
  );
};