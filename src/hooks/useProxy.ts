import { useState, useCallback } from 'react';
import { proxyApi, ProxyResponse, isValidUrl, formatUrl, getSearchUrl } from '@/lib/api/proxy';

export interface ProxyState {
  isLoading: boolean;
  error: string | null;
  content: ProxyResponse | null;
  currentUrl: string;
  history: string[];
  historyIndex: number;
}

export const useProxy = () => {
  const [state, setState] = useState<ProxyState>({
    isLoading: false,
    error: null,
    content: null,
    currentUrl: '',
    history: [],
    historyIndex: -1,
  });

  const navigate = useCallback(async (input: string) => {
    if (!input.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Determine if input is URL or search query
    const url = isValidUrl(input) ? formatUrl(input) : getSearchUrl(input);

    try {
      const response = await proxyApi.fetch(url);

      if (response.success) {
        setState(prev => {
          const newHistory = [...prev.history.slice(0, prev.historyIndex + 1), url];
          return {
            ...prev,
            isLoading: false,
            content: response,
            currentUrl: url,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Failed to load page',
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'An error occurred',
      }));
    }
  }, []);

  const goBack = useCallback(() => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const url = state.history[newIndex];
      setState(prev => ({ ...prev, historyIndex: newIndex, currentUrl: url }));
      proxyApi.fetch(url).then(response => {
        if (response.success) {
          setState(prev => ({ ...prev, content: response }));
        }
      });
    }
  }, [state.historyIndex, state.history]);

  const goForward = useCallback(() => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const url = state.history[newIndex];
      setState(prev => ({ ...prev, historyIndex: newIndex, currentUrl: url }));
      proxyApi.fetch(url).then(response => {
        if (response.success) {
          setState(prev => ({ ...prev, content: response }));
        }
      });
    }
  }, [state.historyIndex, state.history]);

  const refresh = useCallback(() => {
    if (state.currentUrl) {
      navigate(state.currentUrl);
    }
  }, [state.currentUrl, navigate]);

  const canGoBack = state.historyIndex > 0;
  const canGoForward = state.historyIndex < state.history.length - 1;

  return {
    ...state,
    navigate,
    goBack,
    goForward,
    refresh,
    canGoBack,
    canGoForward,
  };
};
