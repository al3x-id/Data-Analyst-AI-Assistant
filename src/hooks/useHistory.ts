import { useState, useEffect } from 'react';
import { QueryHistoryItem, Message } from '../types';

const HISTORY_KEY = 'ai-data-analyst-history';

export function useHistory() {
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  const saveHistoryItem = (query: string, messagesSnapshot: Message[], lastResponse: Message) => {
    let type: 'text' | 'table' | 'chart' = 'text';
    if (lastResponse.visualization) {
      type = 'chart';
    } else if (lastResponse.data && lastResponse.data.length > 0) {
      type = 'table';
    }

    const newItem: QueryHistoryItem = {
      id: lastResponse.id,
      query,
      timestamp: Date.now(),
      type,
      messagesSnapshot,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev.filter((item) => item.query !== query)].slice(0, 20);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return { history, saveHistoryItem, clearHistory };
}