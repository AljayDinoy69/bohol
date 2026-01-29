"use client";

import { useState, useEffect, useCallback } from 'react';

export interface BoholTown {
  _id?: string;
  name: string;
  lat: number;
  lng: number;
  district: number;
  createdAt?: string;
  updatedAt?: string;
}

export function useBoholTowns() {
  const [towns, setTowns] = useState<BoholTown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTowns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/towns');
      const data = await response.json();
      
      if (data.success) {
        setTowns(data.data);
      } else {
        setError(data.error || 'Failed to fetch towns');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTown = useCallback(async (townData: Omit<BoholTown, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/towns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(townData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchTowns(); // Refresh the list
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [fetchTowns]);

  const updateTown = useCallback(async (id: string, townData: Partial<BoholTown>) => {
    try {
      const response = await fetch('/api/towns', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...townData })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchTowns(); // Refresh the list
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [fetchTowns]);

  const deleteTown = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/towns?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchTowns(); // Refresh the list
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [fetchTowns]);

  useEffect(() => {
    fetchTowns();
  }, [fetchTowns]);

  return {
    towns,
    loading,
    error,
    refetch: fetchTowns,
    addTown,
    updateTown,
    deleteTown
  };
}
