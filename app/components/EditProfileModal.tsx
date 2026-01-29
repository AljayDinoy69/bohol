"use client";

import { useState, useEffect } from "react";
import { X, Camera, Upload } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { useToast } from "@/app/hooks/useToast";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@bohol.gov",
    department: "IT Services",
    role: "Administrator",
    phone: "+63 912 345 6789",
    bio: "System administrator for Bohol Signal Map monitoring system."
  });

  // Load user data when modal opens
  useEffect(() => {
    if (isOpen && user?.email) {
      setFormData({
        firstName: user.firstName || "Admin",
        lastName: user.lastName || "User",
        email: user.email,
        department: user.department || "IT Services",
        role: user.role === "admin" ? "Administrator" : "Operator",
        phone: user.phone || "+63 912 345 6789",
        bio: user.bio || "System administrator for Bohol Signal Map monitoring system."
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [isOpen, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      addToast("Please upload an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast("File size must be less than 5MB", "error");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    setIsLoading(true);

    try {
      // First, handle avatar upload if changed
      if (avatarPreview && avatarPreview !== user?.avatar) {
        // Upload avatar
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput?.files?.[0]) {
          const formDataObj = new FormData();
          formDataObj.append('file', fileInput.files[0]);
          formDataObj.append('email', formData.email);

          const avatarResponse = await fetch('/api/profile/avatar', {
            method: 'POST',
            body: formDataObj
          });

          const avatarData = await avatarResponse.json();

          if (!avatarData.success) {
            addToast(`Failed to upload avatar: ${avatarData.error}`, "error");
            setIsLoading(false);
            return;
          }
        }
      }

      // Update profile
      const profileUpdateData: any = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.role,
        department: formData.department,
        bio: formData.bio
      };

      if (avatarPreview) {
        profileUpdateData.avatar = avatarPreview;
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileUpdateData)
      });

      const data = await response.json();

      if (data.success) {
        // Update local auth state (now async)
        const updateData: any = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          role: formData.role === "Administrator" ? "admin" : "personnel",
          department: formData.department,
          bio: formData.bio
        };

        if (avatarPreview) {
          updateData.avatar = avatarPreview;
        }

        await updateProfile(updateData);

        addToast("Profile updated successfully!", "success");
        onClose();
      } else {
        addToast(`Failed to update profile: ${data.error || 'Unknown error'}`, "error");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      addToast(`Error updating profile: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
    } finally {
      setIsLoading(false);
    }
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
      <div className="relative w-full max-w-2xl mx-4 bg-black/90 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl max-h-[90vh] overflow-y-auto">
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
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
              <p className="text-white/60 text-sm">Update your personal information</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center font-bold text-3xl text-white">
                      {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => document.getElementById('avatar-input')?.click()}
                    className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </button>
                </div>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('avatar-input')?.click()}
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter first name"
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter last name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white/60 placeholder:text-white/40 focus:border-blue-500 focus:outline-none cursor-not-allowed"
                    placeholder="Enter email address"
                  />
                  <p className="text-xs text-white/50">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Manager">Manager</option>
                    <option value="Operator">Operator</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="IT Services">IT Services</option>
                    <option value="Operations">Operations</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Management">Management</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Tell us about yourself"
                />
              </div>

              {/* Action buttons */}
              <div className="w-full space-y-3 pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
