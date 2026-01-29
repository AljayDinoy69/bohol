"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export type UserRole = "admin" | "personnel";

interface User {
  email: string;
  role: UserRole;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
  bio?: string;
  avatar?: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to load user from localStorage and database
  const loadUser = useCallback(async () => {
    const authData = localStorage.getItem("bohol_auth");
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        
        // If we have email, fetch latest profile from database
        if (parsedData.email) {
          try {
            const response = await fetch(`/api/profile?email=${encodeURIComponent(parsedData.email)}`);
            const data = await response.json();
            
            if (data.success && data.data) {
              // Merge database data with localStorage data (preserve role from localStorage)
              const mergedUser = {
                ...parsedData,
                ...data.data,
                role: parsedData.role // Preserve role from auth
              };
              setUser(mergedUser);
              // Update localStorage with merged data
              localStorage.setItem("bohol_auth", JSON.stringify(mergedUser));
              return;
            }
          } catch (error) {
            console.error('Failed to fetch profile from database:', error);
            // Fall back to localStorage data
          }
        }
        
        setUser(parsedData);
      } catch {
        // Handle legacy auth (just a string "1")
        if (authData === "1") {
          setUser({ email: "admin@bohol.com", role: "admin" });
        }
      }
    }
  }, []);

  useEffect(() => {
    // Initial load
    const initializeUser = async () => {
      await loadUser();
      setIsLoading(false);
    };
    
    initializeUser();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "bohol_auth") {
        loadUser();
      }
    };

    // Listen for custom events from same tab
    const handleCustomChange = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("bohol_auth_updated", handleCustomChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("bohol_auth_updated", handleCustomChange);
    };
  }, [loadUser]);

  const login = (email: string, role: UserRole, userData?: Partial<User>) => {
    const userDataToStore: User = { 
      email, 
      role, 
      ...userData
    };
    localStorage.setItem("bohol_auth", JSON.stringify(userDataToStore));
    setUser(userDataToStore);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("bohol_auth_updated"));
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...profileData };
    
    try {
      // Save to database
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          ...profileData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update localStorage and state
        localStorage.setItem("bohol_auth", JSON.stringify(updatedUser));
        setUser(updatedUser);
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event("bohol_auth_updated"));
      } else {
        console.error('Failed to update profile in database:', data.error);
        // Still update localStorage even if database fails
        localStorage.setItem("bohol_auth", JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new Event("bohol_auth_updated"));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Still update localStorage even if database fails
      localStorage.setItem("bohol_auth", JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event("bohol_auth_updated"));
    }
  };

  const logout = () => {
    localStorage.removeItem("bohol_auth");
    setUser(null);
    router.push("/");
  };

  const isAdmin = user?.role === "admin";
  const isPersonnel = user?.role === "personnel";

  const canViewDashboard = true;
  const canModifyPersonnel = isAdmin;
  const canModifySites = isAdmin;
  const canUpdateSiteStatus = true;
  const canViewReports = true;
  const canManageSystem = isAdmin;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
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
