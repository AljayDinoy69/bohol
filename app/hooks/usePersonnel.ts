"use client";

import { useState, useEffect, useCallback, Key } from 'react';

export interface Personnel {
  _id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export function usePersonnel() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonnel = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/personnel');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch personnel');
      }
      
      setPersonnel(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPersonnel = useCallback(async (data: Omit<Personnel, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/personnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create personnel');
      }
      
      const newPersonnel: Personnel = {
        _id: result.data._id,
        name: result.data.name,
        role: result.data.role,
        email: result.data.email,
        status: result.data.status,
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt
      };
      
      setPersonnel(prev => [...prev, newPersonnel]);
      return newPersonnel;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw new Error(err instanceof Error ? err.message : 'Failed to create personnel');
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePersonnel = useCallback(async (id: string, data: Partial<Personnel>) => {
    try {
      const response = await fetch(`/api/personnel/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update personnel');
      }
      
      setPersonnel(prev => prev.map(p => p._id === id ? { ...p, ...result.data } : p));
      return result.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update personnel');
    }
  }, []);

  const deletePersonnel = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/personnel/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete personnel');
      }
      
      setPersonnel(prev => prev.filter(p => p._id !== id));
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete personnel');
    }
  }, []);

  useEffect(() => {
    fetchPersonnel();
  }, [fetchPersonnel]);

  return {
    personnel,
    loading,
    error,
    refetch: fetchPersonnel,
    createPersonnel,
    updatePersonnel,
    deletePersonnel
  };
}
