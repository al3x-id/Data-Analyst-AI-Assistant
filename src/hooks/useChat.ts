import { useState, useCallback } from 'react';
import { Message } from '../types';
import { sendMessage as apiSendMessage } from '../utils/api';
import { v4 as uuidv4 } from 'uuid';

export function useChat(
  sessionId: string,
  onSuccessCallback: (query: string, fullSnapshot: Message[], lastMessage: Message) => void
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');

  const sendPrompt = useCallback(async (text: string, isRetry = false) => {
    if (!text.trim() || !sessionId) return;

    if (!isRetry) {
      setLastQuery(text);
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    let updatedMessages = isRetry ? [...messages] : [...messages, userMessage];
    if (isRetry) {
      // Clear previous error if retrying
      setError(null);
    } else {
      setMessages(updatedMessages);
    }

    setIsLoading(true);

    try {
      const response = await apiSendMessage({ message: text, session_id: sessionId });
      
      console.log('response.content:', response.content);
      const aiMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response.content || 'No response content.',
        timestamp: Date.now(),
        data: Array.isArray(response.data) ? response.data : [],
        visualization: response.visualization ?? undefined,
        sql: response.sql || "",
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      onSuccessCallback(text, finalMessages, aiMessage);
    } catch (err: any) {
      const errorMessage = err.message || 'Sorry, I encountered an error. Please try again.';
      setError(errorMessage);
      
      const aiErrorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: errorMessage,
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, messages, onSuccessCallback]);

  const retryLastMessage = useCallback(() => {
    if (lastQuery) {
      // Remove last AI error message before retrying
      setMessages((prev) => prev.filter((_, i) => i !== prev.length - 1));
      sendPrompt(lastQuery, true);
    }
  }, [lastQuery, sendPrompt]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setLastQuery('');
  }, []);

  const loadSnapshot = useCallback((snapshot: Message[]) => {
    setMessages(snapshot);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendPrompt,
    retryLastMessage,
    resetChat,
    loadSnapshot,
  };
}