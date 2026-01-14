"use client";

import { X } from "lucide-react";
import { useState } from "react";
import SignOutConfirmModal from "./SignOutConfirmModal";
import SettingsModal from "./SettingsModal";
import EditProfileModal from "./EditProfileModal";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const openSignOutModal = () => setIsSignOutModalOpen(true);
  const closeSignOutModal = () => setIsSignOutModalOpen(false);
  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);
  const openEditProfileModal = () => setIsEditProfileModalOpen(true);
  const closeEditProfileModal = () => setIsEditProfileModalOpen(false);
  const handleSignOut = () => {
    closeSignOutModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-black/90 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5 text-white/80" />
        </button>
        
        {/* Modal content */}
        <div className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Profile image */}
            <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center font-bold text-3xl text-white">
              U
            </div>
            
            {/* User info */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Admin User</h2>
              <div className="flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span className="text-green-400 text-sm">Online</span>
              </div>
            </div>
            
            {/* Additional profile details */}
            <div className="w-full space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Role</span>
                <span className="text-white">Administrator</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Department</span>
                <span className="text-white">IT Services</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Email</span>
                <span className="text-white">admin@bohol.gov</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Last Login</span>
                <span className="text-white">2 hours ago</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="w-full space-y-3 pt-4">
              <button 
                onClick={openEditProfileModal}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Edit Profile
              </button>
              <button 
                onClick={openSettingsModal}
                className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
              >
                Settings
              </button>
              <button 
                onClick={openSignOutModal}
                className="w-full py-2 px-4 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmModal 
        isOpen={isSignOutModalOpen} 
        onClose={closeSignOutModal} 
        onSignOut={handleSignOut}
      />
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={closeSettingsModal}
      />
      
      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditProfileModalOpen} 
        onClose={closeEditProfileModal}
      />
    </div>
  );
}
