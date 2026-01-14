"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Filter } from "lucide-react";
import { motion } from "framer-motion";
import SidebarAndNavbar from "../components/SidebarAndNavbar";

export default function ReportsPage() {
  const [filter, setFilter] = useState("all");
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    critical: 0
  });

  useEffect(() => {
    // Load reports from localStorage
    const loadReports = () => {
      const storedReports = JSON.parse(localStorage.getItem("reports") || "[]");
      setReports(storedReports);
      
      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const thisWeekReports = storedReports.filter((r: any) => 
        new Date(r.time) >= weekAgo
      );
      
      const criticalReports = storedReports.filter((r: any) => 
        r.status === "Critical"
      );
      
      setStats({
        total: storedReports.length,
        thisWeek: thisWeekReports.length,
        critical: criticalReports.length
      });
    };

    loadReports();
    
    const handleStorageChange = () => {
      loadReports();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <SidebarAndNavbar activePage="Reports">
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
                <div className="text-xs font-medium text-white/60">Reports</div>
                <div className="text-xl font-semibold tracking-tight">Signal Reports</div>
              </div>
            </motion.header>

            <div className="p-6 space-y-6">
              {/* Filter and Export buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-lg bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-200 ring-1 ring-emerald-500/30 hover:bg-emerald-500/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </motion.button>
              </motion.div>

              {/* Summary Cards */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
                  <div className="text-xs text-white/60 mb-1">Total Reports</div>
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="rounded-xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="text-xs text-white/60 mb-1">This Week</div>
                  <div className="text-2xl font-bold text-emerald-400">{stats.thisWeek}</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="text-xs text-white/60 mb-1">Critical</div>
                  <div className="text-2xl font-bold text-rose-400">{stats.critical}</div>
                </motion.div>
              </motion.div>

              {/* Reports Table */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-xl border border-white/10 bg-black/30"
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-white">Recent Reports</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-white/60">ID</th>
                        <th className="px-4 py-3 text-left text-white/60">Site</th>
                        <th className="px-4 py-3 text-left text-white/60">Status</th>
                        <th className="px-4 py-3 text-left text-white/60">Time</th>
                        <th className="px-4 py-3 text-left text-white/60">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.length > 0 ? (
                        reports.map((r, index) => (
                          <motion.tr
                            key={r.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5"
                          >
                            <td className="px-4 py-3 text-white/80">{r.id}</td>
                            <td className="px-4 py-3 text-white">{r.site}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded px-2 py-1 text-xs font-medium ${
                                  r.status === "Critical"
                                    ? "bg-rose-500/20 text-rose-300"
                                    : r.status === "Warning"
                                    ? "bg-amber-500/20 text-amber-300"
                                    : "bg-emerald-500/20 text-emerald-300"
                                }`}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-white/60">{r.time}</td>
                            <td className="px-4 py-3">
                              <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 + index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                View
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-12 text-center">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                            >
                              <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                                <FileText className="h-8 w-8 text-white/40" />
                              </div>
                              <h3 className="text-lg font-medium text-white mb-2">No reports found</h3>
                              <p className="text-white/60">Reports will appear here when signal issues are detected</p>
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