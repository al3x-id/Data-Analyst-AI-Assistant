export interface DataRow {
  [key: string]: string | number | boolean | null;
}

export interface Visualization {
  type: 'line' | 'bar' | 'pie';
  x_label: string;
  y_label: string;
  title?: string;
  keys?: string[]; // keys to plot on Y-axis
  labels?: string[]; // labels for the legend
  values?: number[]; // values for the chart (used for pie charts)
  index: string;  // key for X-axis
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  data?: DataRow[];
  visualization?: Visualization;
  sql?: string;
  isError?: boolean;
}

export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  type: 'text' | 'table' | 'chart';
  messagesSnapshot: Message[];
}

export interface ApiRequest {
  message: string;
  session_id: string;
}

export interface ApiResponse {
  content: string;
  data?: DataRow[];
  visualization?: Visualization;
  sql?: string;
}