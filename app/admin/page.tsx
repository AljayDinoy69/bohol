"use client";

import { useState } from "react";
import { useSites, useAnalytics, useConfig } from "../hooks/useDynamicData";
import SidebarAndNavbar from "../components/SidebarAndNavbar";

export default function AdminPage() {
  const { data: sites, loading: sitesLoading, refetch: refetchSites } = useSites();
  const { data: analytics, loading: analyticsLoading } = useAnalytics();
  const { data: config, loading: configLoading } = useConfig();
  
  const [activeTab, setActiveTab] = useState<'sites' | 'config' | 'analytics'>('sites');
  const [editingSite, setEditingSite] = useState<any>(null);
  const [editingConfig, setEditingConfig] = useState<any>(null);

  const handleSiteUpdate = async (siteId: string, updates: any) => {
    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        refetchSites();
        setEditingSite(null);
      }
    } catch (error) {
      console.error('Failed to update site:', error);
    }
  };

  const handleConfigUpdate = async (updates: any) => {
    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update config:', error);
    }
  };

  if (sitesLoading || analyticsLoading || configLoading) {
    return (
      <SidebarAndNavbar activePage="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-white/70">Loading admin panel...</div>
        </div>
      </SidebarAndNavbar>
    );
  }

  return (
    <SidebarAndNavbar activePage="Dashboard">
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-white/60">Manage sites, configuration, and analytics</p>
        </header>

        <div className="flex gap-4 border-b border-white/10">
          {['sites', 'config', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'sites' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Site Management</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add New Site
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-white/60 text-sm">Name</th>
                    <th className="text-left p-4 text-white/60 text-sm">Status</th>
                    <th className="text-left p-4 text-white/60 text-sm">Signal</th>
                    <th className="text-left p-4 text-white/60 text-sm">Municipality</th>
                    <th className="text-left p-4 text-white/60 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sites?.map((site: any) => (
                    <tr key={site.id} className="border-t border-white/10">
                      <td className="p-4 text-white">{site.name}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          site.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          site.status === 'unstable' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {site.status}
                        </span>
                      </td>
                      <td className="p-4 text-white/70">{site.signalStrength || 0}%</td>
                      <td className="p-4 text-white/70">{site.municipality}</td>
                      <td className="p-4">
                        <button
                          onClick={() => setEditingSite(site)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Configuration</h2>
            
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Site Title</label>
                <input
                  type="text"
                  value={editingConfig?.site?.title || config?.site?.title || ''}
                  onChange={(e) => setEditingConfig({
                    ...config,
                    site: { ...config?.site, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                <textarea
                  value={editingConfig?.site?.description || config?.site?.description || ''}
                  onChange={(e) => setEditingConfig({
                    ...config,
                    site: { ...config?.site, description: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={editingConfig?.contact?.email || config?.contact?.email || ''}
                  onChange={(e) => setEditingConfig({
                    ...config,
                    contact: { ...config?.contact, email: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleConfigUpdate(editingConfig || config)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingConfig(null)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Analytics Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-white/60 text-sm mb-2">Total Sites</h3>
                <p className="text-2xl font-bold text-white">{analytics?.totalSites || 0}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-white/60 text-sm mb-2">Active Sites</h3>
                <p className="text-2xl font-bold text-green-400">{analytics?.activeSites || 0}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-white/60 text-sm mb-2">Unstable Sites</h3>
                <p className="text-2xl font-bold text-yellow-400">{analytics?.unstableSites || 0}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-white/60 text-sm mb-2">Avg Signal Strength</h3>
                <p className="text-2xl font-bold text-white">{analytics?.averageSignalStrength || 0}%</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Trends</h3>
              <div className="space-y-2">
                {analytics?.trends?.slice(-7).map((trend: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70">{trend.date}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-400">Active: {trend.active}</span>
                      <span className="text-yellow-400">Unstable: {trend.unstable}</span>
                      <span className="text-red-400">Unavailable: {trend.unavailable}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarAndNavbar>
  );
}
