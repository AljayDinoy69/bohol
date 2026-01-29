"use client";

import { useActivityStats } from "../hooks/useActivityStats";
import { motion } from "framer-motion";
import { Activity, AlertCircle } from "lucide-react";

export default function ActivitySummary() {
  const { stats, loading } = useActivityStats();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/30 p-4">
        <div className="h-32 flex items-center justify-center">
          <div className="text-white/50">Loading activity stats...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-white/10 bg-black/30 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Activity Summary</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="rounded-lg bg-white/5 p-3 border border-white/5">
          <div className="text-xs text-white/60 mb-1">Total Activities</div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="rounded-lg bg-white/5 p-3 border border-white/5">
          <div className="text-xs text-white/60 mb-1">Today</div>
          <div className="text-2xl font-bold text-emerald-400">{stats.today}</div>
        </div>
        <div className="rounded-lg bg-white/5 p-3 border border-white/5">
          <div className="text-xs text-white/60 mb-1">Sites</div>
          <div className="text-2xl font-bold text-blue-400">{stats.site}</div>
        </div>
        <div className="rounded-lg bg-white/5 p-3 border border-white/5">
          <div className="text-xs text-white/60 mb-1">Personnel</div>
          <div className="text-2xl font-bold text-purple-400">{stats.personnel}</div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="border-t border-white/5 pt-4">
        <h4 className="text-xs font-semibold text-white/70 mb-3">Recent Activities</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {stats.recent.length > 0 ? (
            stats.recent.map((activity, index) => (
              <motion.div
                key={`${activity._id || index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="text-xs p-2 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-white/80 font-medium">{activity.action}</div>
                    <div className="text-white/50 text-xs mt-0.5">{activity.description}</div>
                  </div>
                  <div className="text-white/40 whitespace-nowrap text-xs">
                    {activity.timestamp
                      ? new Date(activity.timestamp).toLocaleTimeString()
                      : 'N/A'}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-4 text-white/40 text-xs">
              No recent activities
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
