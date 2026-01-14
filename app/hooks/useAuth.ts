"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type UserRole = "admin" | "personnel";

interface User {
  email: string;
  role: UserRole;
  name?: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on mount
    const authData = localStorage.getItem("bohol_auth");
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        setUser(parsedData);
      } catch {
        // Handle legacy auth (just a string "1")
        if (authData === "1") {
          // Default to admin for legacy auth
          setUser({ email: "admin@bohol.com", role: "admin" });
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, role: UserRole, name?: string) => {
    const userData: User = { email, role, name };
    localStorage.setItem("bohol_auth", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("bohol_auth");
    setUser(null);
    router.push("/");
  };

  const isAdmin = user?.role === "admin";
  const isPersonnel = user?.role === "personnel";

  const canViewDashboard = true; // Both roles can view dashboard
  const canModifyPersonnel = isAdmin; // Only admin can modify personnel
  const canModifySites = isAdmin; // Only admin can modify sites
  const canUpdateSiteStatus = true; // Both roles can update site status
  const canViewReports = true; // Both roles can view reports
  const canManageSystem = isAdmin; // Only admin can manage system settings

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    isAdmin,
    isPersonnel,
    permissions: {
      canViewDashboard,
      canModifyPersonnel,
      canModifySites,
      canUpdateSiteStatus,
      canViewReports,
      canManageSystem,
    },
  };
}
