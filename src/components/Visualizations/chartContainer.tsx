import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Visualization, DataRow } from '../../types';
import { FallbackTable } from './FallbackTable';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ChartErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Chart Error Caught:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface ChartContainerProps {
  visualization: Visualization;
  data: DataRow[];
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ visualization, data }) => {
  const COLORS = ['#00E0C6', '#00BFA5', '#7D5FFF', '#2ECC71', '#FF4757', '#FF3E6C'];

  // Build chart data — handle both formats
  const buildChartData = (): DataRow[] => {
    // Format 1: data array already has rows
    if (data && data.length > 0) return data;

    // Format 2: visualization has values/labels (from n8n)
    if (visualization.values?.length) {
      return visualization.values.map((v, i) => ({
        [visualization.x_label || 'label']: 
          visualization.labels?.[i] || `Item ${i + 1}`,
        [visualization.y_label || 'value']: v
      }));
    }
    return [];
  };

  // Get axis keys — handle both formats
  const getXKey = (): string => {
    if (data && data.length > 0) {
      const firstRow = data[0];
      const stringCol = Object.keys(firstRow).find(k =>
        typeof firstRow[k] === 'string'
      );
      return visualization.index || stringCol || Object.keys(firstRow)[0];
    }
    return visualization.index || visualization.x_label || 'label';
  };

  const getValueKeys = (): string[] => {
    if (data && data.length > 0) {
      const firstRow = data[0];
      const excludeKeys = [xKey, 'MonthNumber', 'MonthName', 'Quarter', 'DateKey', 'index'];
      const numericCols = Object.keys(firstRow).filter(k =>
        typeof firstRow[k] === 'number' && !excludeKeys.includes(k)
      );
      if (numericCols.length > 0) return numericCols;
    }
    return visualization.keys?.slice(1) ||
          [visualization.y_label || 'value'];
  };

  const chartData = buildChartData();
  const xKey = getXKey();
  const valueKeys = getValueKeys();

  const renderChart = () => {
    const { type, title, x_label, y_label } = visualization;

  const chartHeight = data.length > 6 ? 320 : 260;
  const chartTitle = visualization.title || visualization.y_label || 'Data Visualization';

    // Guard — no data
    if (!chartData || chartData.length === 0) {
      return <p className="text-gray-400 text-sm text-center py-4">No data available for chart</p>;
    }

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E3A59" opacity={0.3} />
              <XAxis 
                dataKey={xKey} 
                stroke="#ffffff80" 
                tick={{ fontSize: 10 }}
                label={x_label ? { value: x_label, position: 'insideBottom', offset: -5, fill: '#ffffff80', fontSize: 11 } : undefined}
                interval={chartData.length > 10 ? 0 : 'preserveEnd'}
                angle={chartData.length > 10 ? -45 : 0}
                textAnchor={chartData.length > 10 ? 'end' : 'middle'}
                height={60}
              />
              <YAxis 
                stroke="#ffffff80" 
                tick={{ fontSize: 10 }}
                label={y_label ? { value: y_label, angle: -90, position: 'insideLeft', fill: '#ffffff80', fontSize: 11 } : undefined}
              />
              <Tooltip contentStyle={{ backgroundColor: '#151923', borderColor: '#2E3A59', borderRadius: '12px' }} itemStyle={{ color: '#F3F4F6' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {valueKeys.map((key, i) => (
                <Line
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={COLORS[i % COLORS.length]} 
                  strokeWidth={3} 
                  dot={{ r: 4, stroke: '#151923', strokeWidth: 1 }} 
                  activeDot={{ r: 6 }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={chartData} layout="horizontal" margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E3A59" opacity={0.3} />
              <XAxis dataKey={xKey} stroke="#ffffff80" tick={{ fontSize: 10 }} interval={chartData.length > 5 ? 0 : 'preserveEnd'} angle={chartData.length > 5 ? -45 : 0} textAnchor={chartData.length > 5 ? 'end' : 'middle'} height={80} />
              <YAxis stroke="#ffffff80" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#151923', borderColor: '#2E3A59', borderRadius: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {valueKeys.map((key, i) => (
                <Bar 
                  key={key} 
                  dataKey={key}
                  radius={[4, 4, 0, 0]}
                  fill={COLORS[i % COLORS.length]} 
                  barSize={chartData.length > 5 ? 20 : 30} 
                  >
                  {chartData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                  </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie 
                data={chartData} 
                cx="50%" 
                cy="45%" 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={5} 
                dataKey={valueKeys[0]} 
                nameKey={xKey}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                <>
                  {chartData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </>
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#151923', borderColor: '#2E3A59', borderRadius: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <FallbackTable data={chartData} />;
    }
  };

  return (
    <ChartErrorBoundary fallback={<FallbackTable data={chartData} />}>
      <div className="w-full bg-[#151923] border border-[#2E3A59] p-4 rounded-2xl shadow-inner mt-4">
        {visualization.title && (
          <h4 className="text-sm font-bold text-[#00E0C6] mb-3 tracking-wide uppercase text-center">
            {visualization.title}
          </h4>
        )}
        {renderChart()}
      </div>
    </ChartErrorBoundary>
  );
};