"use client";

import { useState } from "react";
import { X, Camera, Upload } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@bohol.gov",
    department: "IT Services",
    role: "Administrator",
    phone: "+63 912 345 6789",
    bio: "System administrator for Bohol Signal Map monitoring system."
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic here
    console.log("Profile updated:", formData);
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
                  <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center font-bold text-3xl text-white">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </div>
                  <button
                    type="button"
                    className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </button>
                </div>
                <button
                  type="button"
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
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter email address"
                  />
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
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
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
