"use client";

import { X, Bell, Shield, Palette, Globe, HelpCircle } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-black/90 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="h-5 w-5 text-white/80" />
        </button>
        
        {/* Modal content */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <p className="text-white/60 text-sm">Manage your application preferences</p>
            </div>
            
            {/* Settings sections */}
            <div className="space-y-6">
              {/* Notifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Notifications</h3>
                </div>
                <div className="space-y-3 pl-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">Email Notifications</div>
                      <div className="text-xs text-white/60">Receive updates via email</div>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">Push Notifications</div>
                      <div className="text-xs text-white/60">Receive browser notifications</div>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/20 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">Signal Alerts</div>
                      <div className="text-xs text-white/60">Get notified about signal changes</div>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Privacy</h3>
                </div>
                <div className="space-y-3 pl-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">Profile Visibility</div>
                      <div className="text-xs text-white/60">Make your profile visible to others</div>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">Activity Status</div>
                      <div className="text-xs text-white/60">Show when you're online</div>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Appearance</h3>
                </div>
                <div className="space-y-3 pl-8">
                  <div>
                    <div className="text-sm font-medium text-white mb-3">Theme</div>
                    <div className="grid grid-cols-3 gap-2">
                      <button className="py-2 px-3 bg-blue-600 text-white rounded-lg text-sm font-medium">Dark</button>
                      <button className="py-2 px-3 bg-white/10 text-white/70 rounded-lg text-sm font-medium hover:bg-white/20">Light</button>
                      <button className="py-2 px-3 bg-white/10 text-white/70 rounded-lg text-sm font-medium hover:bg-white/20">Auto</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">Compact View</div>
                      <div className="text-xs text-white/60">Use more compact layout</div>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/20 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Language & Region</h3>
                </div>
                <div className="space-y-3 pl-8">
                  <div>
                    <div className="text-sm font-medium text-white mb-3">Language</div>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                      <option value="en">English</option>
                      <option value="fil">Filipino</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white mb-3">Timezone</div>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                      <option value="PST">Philippines Time (PST)</option>
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="w-full space-y-3 pt-4 border-t border-white/10">
              <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                Save Changes
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
