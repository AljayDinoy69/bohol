import { useState, useEffect, useCallback } from 'react';

export interface ActivityLog {
  _id: string;
  id: string;
  action: string;
  description: string;
  type: 'site' | 'personnel' | 'system' | 'other';
  userId?: string;
  entity?: string;
  entityId?: string;
  timestamp?: Date;
  details?: Record<string, any>;
}

export function useActivityLogs(type?: string, entity?: string) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let queryString = '';
      const params = [];
      
      if (type && type !== 'all') params.push(`type=${type}`);
      if (entity && entity !== 'all') params.push(`entity=${entity}`);
      
      if (params.length > 0) {
        queryString = '?' + params.join('&');
      }

      const response = await fetch(`/api/activity-logs${queryString}`);
      const data = await response.json();

      if (data.success && data.data) {
        setLogs(data.data);
      } else {
        setError(data.error || 'Failed to fetch activity logs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  }, [type, entity]);

  useEffect(() => {
    refetch();
    
    // Refresh every 10 seconds
    const interval = setInterval(refetch, 10000);
    return () => clearInterval(interval);
  }, [refetch]);

  const logActivity = async (logData: Omit<ActivityLog, '_id' | 'id'>) => {
    try {
      setError(null);
      const response = await fetch('/api/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to log activity');
      }

      setLogs(prev => [data.data, ...prev]);
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to log activity';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteLog = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/activity-logs?id=${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete activity log');
      }

      setLogs(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete activity log';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    logs,
    loading,
    error,
    refetch,
    logActivity,
    deleteLog
  };
}
