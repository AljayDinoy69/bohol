"use client";

import Image from "next/image";
import MapPanel from "../components/MapPanel";
import { useState, useEffect, useCallback } from "react";
import { Users, MapPin, Shield, Eye, EyeOff } from "lucide-react";
import SidebarAndNavbar from "../components/SidebarAndNavbar";
import { useAuth } from "../hooks/useAuth";
import { useSites, useAnalytics } from "../hooks/useDynamicData";
import { useRealTimeData } from "../hooks/useRealTime";
import { useBoholTowns } from "../hooks/useBoholTowns";
import { exportMapToWord } from "../lib/exportMap";

export default function DashboardPage() {
  const { user, isAdmin, isPersonnel, permissions } = useAuth();
  const { data: sites, loading: sitesLoading } = useSites();
  const { data: analytics, loading: analyticsLoading } = useAnalytics();
  const { data: realTimeData, isConnected, error, refresh } = useRealTimeData();
  const { towns, loading: townsLoading } = useBoholTowns();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedTown, setSearchedTown] = useState<[number, number] | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mapActions, setMapActions] = useState<{
    zoomIn: () => void;
    zoomOut: () => void;
    setView: (center: [number, number], zoom?: number) => void;
  } | null>(null);

  const handleMapReady = useCallback((actions: {
    zoomIn: () => void;
    zoomOut: () => void;
    setView: (center: [number, number], zoom?: number) => void;
  }) => {
    setMapActions(actions);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If search is empty, reset to default view
    if (!searchQuery.trim()) {
      if (mapActions) {
        mapActions.setView([9.8, 124.2], 8);
        setSearchedTown(null);
      }
      setShowDropdown(false);
      return;
    }
    
    const town = towns.find((t: any) => t.name.toLowerCase() === searchQuery.toLowerCase());
    
    if (town && mapActions) {
      // Center the map on the searched town with appropriate zoom
      mapActions.setView([town.lat, town.lng], 12);
      setSearchedTown([town.lat, town.lng]);
      setShowDropdown(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowDropdown(value.trim().length > 0);
    
    // If search is cleared, reset to default view
    if (!value.trim() && mapActions) {
      mapActions.setView([9.8, 124.30], 10);
      setSearchedTown(null);
    }
  };

  // Filter towns based on first letter
  const filteredTowns = searchQuery.trim().length > 0 
    ? towns.filter((town: any) => town.name.toLowerCase().startsWith(searchQuery.toLowerCase()))
    : [];

  const handleTownSelect = (town: any) => {
    setSearchQuery(town.name);
    if (mapActions) {
      mapActions.setView([town.lat, town.lng], 12);
      setSearchedTown([town.lat, town.lng]);
    }
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <SidebarAndNavbar activePage="Dashboard">
      <div className="flex h-full">
        <div className="flex-1 p-6 space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <div className="text-xl font-semibold tracking-tight text-white">Dashboard Overview</div>
              <div className="text-xs font-medium text-white/60">Visual overview of all monitored sites location across Bohol.</div>
            </div>
            
            {/* User role indicator and admin controls */}
            <div className="flex items-center gap-3">
              {/* Role Badge */}
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                <Shield className={`h-4 w-4 ${isAdmin ? "text-emerald-400" : "text-blue-400"}`} />
                <span className="text-sm font-medium text-white/80">
                  {user?.name || user?.email} ({isAdmin ? "Admin" : "Personnel"})
                </span>
              </div>
              
              {/* Admin-only controls */}
              {isAdmin && (
                <div className="hidden items-center gap-2 md:flex">
                  <button 
                    onClick={() => exportMapToWord({ mapElementId: 'map-container' })}
                    data-export-btn
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                  >
                    Export
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/25 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] h-[750px]" id="map-container">
            <MapPanel onMapReady={handleMapReady} searchedTown={searchedTown} sites={sites} />

            <div className="absolute left-4 top-4 right-4 flex items-center gap-3 md:right-auto md:w-[420px]">
              <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 relative search-container">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-white/80 backdrop-blur-md">
                  <svg className="h-4 w-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                    placeholder="Search location (e.g. Tagbilaran)"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setShowDropdown(searchQuery.trim().length > 0)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchedTown(null);
                        setShowDropdown(false);
                        if (mapActions) {
                          mapActions.setView([9.8, 124.30], 10);
                        }
                      }}
                      className="text-white/60 hover:text-white/80 transition-colors"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Custom Grid Dropdown */}
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-white/10 rounded-xl backdrop-blur-lg z-50 max-h-80 overflow-y-auto">
                    <div className="grid grid-cols-5 gap-1 p-2">
                      {filteredTowns.map((town: any) => (
                        <button
                          key={town._id || town.name}
                          type="button"
                          onClick={() => handleTownSelect(town)}
                          className="text-xs text-white/80 hover:bg-white/10 hover:text-white px-2 py-1 rounded transition-colors text-left"
                        >
                          {town.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <button type="submit" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Search
                </button>
              </form>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={() => mapActions?.zoomIn()}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Zoom in"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              </button>
              <button
                onClick={() => mapActions?.zoomOut()}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Zoom out"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
                </svg>
              </button>
            </div>

            {/* Top-right overlay container */}
            <div className="absolute top-4 right-4 w-80 space-y-4">
              {/* Legend */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <h3 className="mb-2 text-sm font-medium text-white/70">Legend</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span>Unstable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                    <span>Unavailable</span>
                  </div>
                </div>
              </div>

              {/* Signal Status */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white/70">Signal Status</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                      {isConnected ? '🟢 Live' : '🔴 Offline'}
                    </span>
                    <button
                      onClick={refresh}
                      className="text-xs text-white/60 hover:text-white/80 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                    <div className="text-xs text-white/60">Active</div>
                    <div className="mt-1 text-lg font-semibold text-emerald-300">
                      {analytics?.activeSites || realTimeData?.analytics?.activeSites || 0}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                    <div className="text-xs text-white/60">Unstable</div>
                    <div className="mt-1 text-lg font-semibold text-amber-200">
                      {analytics?.unstableSites || realTimeData?.analytics?.unstableSites || 0}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                    <div className="text-xs text-white/60">Unavailable</div>
                    <div className="mt-1 text-lg font-semibold text-rose-200">
                      {analytics?.unavailableSites || realTimeData?.analytics?.unavailableSites || 0}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                    <div className="text-xs text-white/60">Uptime</div>
                    <div className="mt-1 text-lg font-semibold text-white">
                      {analytics?.totalSites ? 
                        `${Math.round((analytics.activeSites / analytics.totalSites) * 100)}%` : '0%'}
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="mt-2 text-xs text-red-400">
                    Error: {error}
                  </div>
                )}
              </div>

              {/* Signal Strength Distribution */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <h3 className="mb-3 text-sm font-medium text-white/70">Distribution</h3>
                <div className="w-full rounded-xl border border-white/10 bg-black/40 p-3">
                  <svg viewBox="0 0 240 120" className="h-40 w-full">
                    <defs>
                      <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgba(34,197,94,0.35)" />
                        <stop offset="55%" stopColor="rgba(245,158,11,0.18)" />
                        <stop offset="100%" stopColor="rgba(244,63,94,0.10)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 95 C 30 75, 55 78, 80 62 C 105 45, 130 52, 155 40 C 180 28, 200 38, 240 20 L 240 120 L 0 120 Z"
                      fill="url(#chartFill)"
                    />
                    <path
                      d="M0 95 C 30 75, 55 78, 80 62 C 105 45, 130 52, 155 40 C 180 28, 200 38, 240 20"
                      fill="none"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          </div>
      </div>
    </SidebarAndNavbar>
  );
}
