"use client";

import { useEffect, useState, useCallback } from 'react';

export interface RealTimeData {
  sites: any[];
  analytics: any;
  lastUpdated: string;
}

export function useRealTimeData() {
  const [data, setData] = useState<RealTimeData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [sitesResponse, analyticsResponse] = await Promise.all([
        fetch('/api/sites'),
        fetch('/api/analytics')
      ]);

      if (!sitesResponse.ok || !analyticsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const sitesResult = await sitesResponse.json();
      const analyticsResult = await analyticsResponse.json();

      if (!sitesResult.success || !analyticsResult.success) {
        throw new Error('Invalid data format');
      }

      setData({
        sites: sitesResult.data,
        analytics: analyticsResult.data,
        lastUpdated: new Date().toISOString()
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  useEffect(() => {
    fetchData();
    setIsConnected(true);

    const interval = setInterval(fetchData, 10000); // Update every 10 seconds

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isConnected, error, refresh };
}
