import { useState, useEffect } from 'react';

export interface ActivityStats {
  total: number;
  today: number;
  site: number;
  personnel: number;
  recent: any[];
}

export const useActivityStats = () => {
  const [stats, setStats] = useState<ActivityStats>({
    total: 0,
    today: 0,
    site: 0,
    personnel: 0,
    recent: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/activity-logs?limit=1000');
        const data = await response.json();

        if (data.success && data.data) {
          const logs = data.data;
          const now = new Date();
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          const todayLogs = logs.filter((log: any) => 
            log.timestamp && new Date(log.timestamp) >= todayStart
          );
          
          const siteLogs = logs.filter((log: any) => log.type === 'site');
          const personnelLogs = logs.filter((log: any) => log.type === 'personnel');

          setStats({
            total: logs.length,
            today: todayLogs.length,
            site: siteLogs.length,
            personnel: personnelLogs.length,
            recent: logs.slice(0, 10)
          });
        }
      } catch (error) {
        console.error('Error fetching activity stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { stats, loading };
};
