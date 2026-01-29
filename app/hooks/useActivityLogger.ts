import { useCallback } from 'react';

export type ActivityType = 'site' | 'personnel' | 'system' | 'other';

export interface ActivityLogData {
  action: string;
  description: string;
  type: ActivityType;
  entity?: string;
  entityId?: string;
  userId?: string;
  details?: Record<string, any>;
}

/**
 * Hook for logging activities
 * Usage: const { logActivity } = useActivityLogger();
 */
export const useActivityLogger = () => {
  const logActivity = useCallback(async (data: ActivityLogData): Promise<boolean> => {
    try {
      const response = await fetch('/api/activity-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(`Failed to log activity: ${response.statusText}`);
        return false;
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  }, []);

  return { logActivity };
};
