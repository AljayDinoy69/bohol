"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, MapPin, FileText } from "lucide-react";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import { useAuth } from "../hooks/useAuth";

export default function SidebarAndNavbar({ activePage, children }: { activePage: string; children: React.ReactNode }) {
  const { user, isAdmin, permissions } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  // Get dynamic user display info
  const firstName = user?.firstName || "Admin";
  const lastName = user?.lastName || "User";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const avatar = user?.avatar || null;

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ) },
    { label: "Personnel", href: "/personnel", icon: <Users className="h-5 w-5" />, requiredPermission: permissions.canModifyPersonnel },
    { label: "Manage Sites", href: "/site", icon: <MapPin className="h-5 w-5" />, requiredPermission: permissions.canModifySites },
    { label: "Activity Logs", href: "/activity-logs", icon: <FileText className="h-5 w-5" />, requiredPermission: permissions.canViewReports }
  ].filter(item => !item.requiredPermission || item.requiredPermission);

  return (
    <div className="theme-scope min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 border-r border-white/10 bg-black/30 text-white backdrop-blur-xl md:block">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 border-b border-white/8 px-6 py-5">
              <div className="h-9 w-9 overflow-hidden rounded-lg border border-white/15 bg-white/5">
                <img src="/wifi.jpg" alt="Bohol" className="h-full w-full object-cover" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Bohol Signal Map</span>
            </div>
            <nav className="flex-1 px-3 py-6">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        activePage === item.label
                          ? "bg-white/15 text-white backdrop-blur-sm hover:bg-white/20 shadow-lg"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-white/8 p-4">
              <div className="flex items-center gap-3">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={openProfileModal}
                    title="Click to view profile"
                  />
                ) : (
                  <div 
                    className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors text-white text-sm"
                    onClick={openProfileModal}
                    title="Click to view profile"
                  >
                    {initials}
                  </div>
                )}
                <div 
                  className="flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={openProfileModal}
                  title="Click to view profile"
                >
                  <div className="text-sm font-medium text-white">{firstName} {lastName}</div>
                  <div className="text-xs text-green-400">● Online</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      
      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
    </div>
  );
}
