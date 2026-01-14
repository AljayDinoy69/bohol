"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface SignOutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

export default function SignOutConfirmModal({ isOpen, onClose, onSignOut }: SignOutConfirmModalProps) {
  const router = useRouter();

  const handleSignOut = () => {
    onSignOut();
    router.push("/");
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
      <div className="relative w-full max-w-sm mx-4 bg-black/90 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
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
            {/* Warning icon */}
            <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <svg className="h-8 w-8 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            {/* Message */}
            <div className="text-center space-y-3">
              <h2 className="text-xl font-bold text-white">Confirm Sign Out</h2>
              <p className="text-white/70 text-sm">
                Are you sure you want to sign out? You'll need to log in again to access your account.
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="w-full space-y-3 pt-2">
              <button
                onClick={handleSignOut}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Sign Out
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
