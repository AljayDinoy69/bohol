"use client";

import { useState, useEffect } from "react";
import { Clock, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import SidebarAndNavbar from "../components/SidebarAndNavbar";
import { useActivityLogs } from "../hooks/useActivityLogs";
import { useAuth } from "../hooks/useAuth";
import { ActivityLog } from "../hooks/useActivityLogs";

export default function ActivityLogsPage() {
  const { permissions } = useAuth();
  const [typeFilter, setTypeFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const { logs, deleteLog } = useActivityLogs(
    typeFilter !== 'all' ? typeFilter : undefined,
    entityFilter !== 'all' ? entityFilter : undefined
  );
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    site: 0,
    personnel: 0
  });

  // Calculate stats when logs change
  useEffect(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayLogs = logs.filter((log: any) => 
      log.timestamp && new Date(log.timestamp) >= todayStart
    );
    
    const siteLogs = logs.filter((log: any) => 
      log.type === "site"
    );

    const personnelLogs = logs.filter((log: any) => 
      log.type === "personnel"
    );
    
    setStats({
      total: logs.length,
      today: todayLogs.length,
      site: siteLogs.length,
      personnel: personnelLogs.length
    });
  }, [logs]);

  const handleDeleteLog = async (log: ActivityLog) => {
    if (!confirm(`Delete this activity log?`)) return;

    try {
      await deleteLog(log._id);
    } catch (error) {
      console.error('Failed to delete log:', error);
      alert('Failed to delete log. Please try again.');
    }
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('Created') || action.includes('created')) return 'bg-emerald-500/20 text-emerald-300';
    if (action.includes('Updated') || action.includes('updated')) return 'bg-blue-500/20 text-blue-300';
    if (action.includes('Deleted') || action.includes('deleted')) return 'bg-red-500/20 text-red-300';
    if (action.includes('Assigned') || action.includes('assigned')) return 'bg-purple-500/20 text-purple-300';
    return 'bg-amber-500/20 text-amber-300';
  };

  const getTypeBadgeColor = (type: string) => {
    if (type === 'site') return 'bg-blue-500/20 text-blue-300';
    if (type === 'personnel') return 'bg-purple-500/20 text-purple-300';
    if (type === 'system') return 'bg-amber-500/20 text-amber-300';
    return 'bg-gray-500/20 text-gray-300';
  };

  return (
    <SidebarAndNavbar activePage="Activity Logs">
      <div className="flex h-full">
        <div className="flex-1 overflow-auto relative">
          {/* Background image with dark overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/free.jpg")' }}
          >
            <div className="absolute inset-0 bg-black/70" />
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <motion.header
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between border-b border-white/10 bg-black/20 px-6 py-4 text-white backdrop-blur-lg"
            >
              <div>
                <div className="text-xl font-semibold tracking-tight">Activity Logs</div>
                <div className="text-xs font-medium text-white/60">Monitor actions, updates, and access history for accountability.</div>
                
              </div>
            </motion.header>

            <div className="p-6 space-y-6">
              {/* Filter Controls */}
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3 flex-wrap"
              >
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  <option value="all">All Types</option>
                  <option value="site">Site</option>
                  <option value="personnel">Personnel</option>
                  <option value="system">System</option>
                </select>

                <select
                  value={entityFilter}
                  onChange={(e) => setEntityFilter(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  <option value="all">All Entities</option>
                  <option value="site">Sites</option>
                  <option value="personnel">Personnel</option>
                </select>
              </motion.div>

              {/* Summary Cards */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, staggerChildren: 0.1 }}
              >
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="text-xs text-white/60 mb-1">Total Activities</div>
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="rounded-xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="text-xs text-white/60 mb-1">Today</div>
                  <div className="text-2xl font-bold text-emerald-400">{stats.today}</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="text-xs text-white/60 mb-1">Site Activities</div>
                  <div className="text-2xl font-bold text-blue-400">{stats.site}</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="rounded-xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="text-xs text-white/60 mb-1">Personnel Activities</div>
                  <div className="text-2xl font-bold text-purple-400">{stats.personnel}</div>
                </motion.div>
              </motion.div>

              {/* Activity Logs Table */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-xl border border-white/10 bg-black/30"
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-white">Activity Timeline</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-white/60">Timestamp</th>
                        <th className="px-4 py-3 text-left text-white/60">Type</th>
                        <th className="px-4 py-3 text-left text-white/60">Action</th>
                        <th className="px-4 py-3 text-left text-white/60">Description</th>
                        <th className="px-4 py-3 text-left text-white/60">Entity</th>
                        <th className="px-4 py-3 text-left text-white/60">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.length > 0 ? (
                        logs.map((log, index) => (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5"
                          >
                            <td className="px-4 py-3 text-white/60 text-xs">
                              {log.timestamp ? new Date(log.timestamp).toLocaleString('en-US', {
                                month: '2-digit',
                                day: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                              }) : 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`rounded px-2 py-1 text-xs font-medium ${getTypeBadgeColor(log.type)}`}>
                                {log.type}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`rounded px-2 py-1 text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-white/80 max-w-xs truncate">
                              {log.description}
                            </td>
                            <td className="px-4 py-3 text-white/60 text-xs">
                              {log.entity || 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 + index * 0.05 }}
                                className="flex items-center gap-2"
                              >
                                {permissions.canModifyPersonnel && (
                                  <motion.button
                                    onClick={() => handleDeleteLog(log)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </motion.button>
                                )}
                              </motion.div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                            >
                              <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                                <Clock className="h-8 w-8 text-white/40" />
                              </div>
                              <h3 className="text-lg font-medium text-white mb-2">No activity logs found</h3>
                              <p className="text-white/60">Activities will appear here when actions are performed</p>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </SidebarAndNavbar>
  );
}
