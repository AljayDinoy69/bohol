"use client";

import { useState, useEffect, useCallback } from 'react';

interface UseDynamicDataOptions {
  refetchInterval?: number;
  immediate?: boolean;
}

export function useDynamicData<T>(
  url: string,
  options: UseDynamicDataOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refetchInterval, immediate = true } = options;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data');
      }
      
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    if (refetchInterval) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, immediate, refetchInterval]);

  return { data, loading, error, refetch: fetchData };
}

export function useSites() {
  return useDynamicData<any[]>('/api/sites', { refetchInterval: 30000 });
}

export function useAnalytics() {
  return useDynamicData<any>('/api/analytics', { refetchInterval: 60000 });
}

export function useConfig() {
  return useDynamicData<any>('/api/config', { immediate: true });
}
