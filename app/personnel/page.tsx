"use client";

import { useState, useEffect } from "react";
import { Users, Search, Plus, Edit, Trash2, MapPin, X, Minus } from "lucide-react";
import { motion } from "framer-motion";
import SidebarAndNavbar from "../components/SidebarAndNavbar";
import { useAuth } from "../hooks/useAuth";
import { usePersonnel, Personnel } from "../hooks/usePersonnel";

export default function PersonnelPage() {
  const { permissions } = useAuth();
  const { personnel, loading, error, createPersonnel, updatePersonnel, deletePersonnel, refetch } = usePersonnel();
  const [search, setSearch] = useState("");
  const [sites, setSites] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    status: "Active"
  });

  const filtered = personnel.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  // Function to get assigned sites for a personnel from sites collection
  const getAssignedSites = (personnelName: string) => {
    return sites.filter(site => site.assignedPersonnel === personnelName);
  };

  const handleOpenModal = () => {
    setIsLoading(true);
    // Reset form
    setFormData({ name: "", role: "", email: "", status: "Active" });
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(true);
    }, 800);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", role: "", email: "", status: "Active" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (person: Personnel) => {
    setSelectedPersonnel(person);
    setFormData({
      name: person.name,
      role: person.role,
      email: person.email,
      status: person.status
    });
    setShowEditModal(true);
  };

  const handleDelete = (person: Personnel) => {
    setSelectedPersonnel(person);
    setShowDeleteModal(true);
  };

  const handleEditConfirm = async () => {
    if (!selectedPersonnel) return;

    try {
      setIsLoading(true);
      await updatePersonnel(selectedPersonnel._id, formData);
      setShowEditModal(false);
      setSelectedPersonnel(null);
    } catch (error) {
      console.error('Failed to update personnel:', error);
      // Show user-friendly error message
      alert('Failed to update personnel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPersonnel) return;

    try {
      setIsLoading(true);
      await deletePersonnel(selectedPersonnel._id);
      setShowDeleteModal(false);
      setSelectedPersonnel(null);
    } catch (error) {
      console.error('Failed to delete personnel:', error);
      // Show user-friendly error message
      alert('Failed to delete personnel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to remove site assignment from personnel
  const removeSiteAssignment = async (siteId: string, personnelName: string) => {
    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedPersonnel: '' // Clear the assignment
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh sites to update the UI
        const loadSites = async () => {
          try {
            const response = await fetch('/api/sites');
            const data = await response.json();
            if (data.success && data.data) {
              setSites(data.data);
            }
          } catch (error) {
            console.error('Error loading sites:', error);
          }
        };
        loadSites();
      } else {
        console.error('Failed to remove site assignment:', data.error);
        alert('Failed to remove site assignment. Please try again.');
      }
    } catch (error) {
      console.error('Error removing site assignment:', error);
      alert('Error removing site assignment. Please try again.');
    }
  };

  const handleAddPersonnel = async () => {
    try {
      setIsLoading(true);
      await createPersonnel(formData);
      setIsModalOpen(false);
      setFormData({ name: "", role: "", email: "", status: "Active" });
    } catch (error) {
      console.error('Failed to create personnel:', error);
      // Show user-friendly error message
      alert('Failed to create personnel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load sites from database API
    const loadSites = async () => {
      try {
        const response = await fetch('/api/sites');
        const data = await response.json();
        if (data.success && data.data) {
          setSites(data.data);
        }
      } catch (error) {
        console.error('Error loading sites:', error);
      }
    };

    loadSites();
    
    // Refresh sites every 10 seconds to keep in sync
    const interval = setInterval(loadSites, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarAndNavbar activePage="Personnel">
      <div className="flex h-full">
        <div className="flex-1 overflow-auto relative">
          {/* Background image with dark overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/free.jpg")' }}
          >
            <div className="absolute inset-0 bg-black/70" />
          </div>
          
          {/* Content with backdrop blur for header */}
          <div className="relative z-10">
            <motion.header
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between border-b border-white/10 bg-black/20 px-6 py-4 text-white backdrop-blur-lg"
            >
              <div>
                <div className="text-xl font-semibold tracking-tight">Manage Personnel</div>
                <div className="text-xs font-medium text-white/60">Manage personnel records, roles, and assignments.</div>
                
              </div>
            </motion.header>

            <div className="p-6">
              <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center justify-between mb-6"
            >
                
                {/* Search bar (left) */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search personnel..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                </motion.div>

                {/* Add button (right) - Admin only */}
                {permissions.canModifyPersonnel && (
                  <motion.button 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleOpenModal}
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add Personnel
                      </>
                    )}
                  </motion.button>
                )}
            </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-xl border border-white/10 bg-black/30 overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-white/60">Name</th>
                        <th className="px-4 py-3 text-left text-white/60">Role</th>
                        <th className="px-4 py-3 text-left text-white/60">Status</th>
                        <th className="px-4 py-3 text-left text-white/60">Assigned Sites</th>
                        <th className="px-4 py-3 text-left text-white/60">Email</th>
                        <th className="px-4 py-3 text-left text-white/60">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length > 0 ? (
                        filtered.map((p, index) => (
                          <motion.tr
                            key={p._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5"
                          >
                            <td className="px-4 py-3 text-white">{p.name}</td>
                            <td className="px-4 py-3 text-white/80">{p.role}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded px-2 py-1 text-xs font-medium ${
                                  p.status === "Active"
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : "bg-amber-500/20 text-amber-300"
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                {getAssignedSites(p.name).length > 0 ? (
                                  getAssignedSites(p.name).map((site, index) => (
                                    <div key={site._id || index} className="flex items-center gap-1 text-xs">
                                      <MapPin className="h-3 w-3 text-blue-400" />
                                      <span className="text-white/70">
                                        {site.name}
                                      </span>
                                      <span className="text-white/50">({site.locationName})</span>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-white/40">No sites assigned</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-white/60">{p.email}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {/* Edit button - Admin only */}
                                {permissions.canModifyPersonnel && (
                                  <motion.button 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 + index * 0.05 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleEdit(p)}
                                    className="text-blue-400 hover:text-blue-300"
                                    title="Edit"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </motion.button>
                                )}
                                
                                {/* Delete button - Admin only */}
                                {permissions.canModifyPersonnel && (
                                  <motion.button 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 + index * 0.05 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDelete(p)}
                                    className="text-rose-400 hover:text-rose-300"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </motion.button>
                                )}
                                
                                {/* Show restricted badge for personnel */}
                                {!permissions.canModifyPersonnel && (
                                  <span className="text-xs text-white/40 italic">Read-only</span>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.5 }}
                            >
                              <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                                <Users className="h-8 w-8 text-white/40" />
                              </div>
                              <h3 className="text-lg font-medium text-white mb-2">No personnel found</h3>
                              <p className="text-white/60 mb-6">
                                {search ? "Try adjusting your search terms" : "Get started by adding your first team member"}
                              </p>
                              {!search && permissions.canModifyPersonnel && (
                                <motion.button 
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={handleOpenModal}
                                  disabled={isLoading}
                                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                  {isLoading ? (
                                    <>
                                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                                      </svg>
                                      Loading...
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="h-4 w-4" />
                                      Add Personnel
                                    </>
                                  )}
                                </motion.button>
                              )}
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Personnel Modal */}
      {isModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Blurry background overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          
          {/* Modal content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-50 w-full max-w-md mx-4"
          >
            <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Add New Personnel</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseModal}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                    placeholder="Enter job role"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center gap-3 pt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-white/10 text-white/80 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddPersonnel}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Personnel
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Edit Modal */}
      {showEditModal && selectedPersonnel && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-50 w-full max-w-md mx-4"
          >
            <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Edit Personnel</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                    placeholder="Enter job role"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Assigned Sites Section */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Assigned Sites</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedPersonnel && getAssignedSites(selectedPersonnel.name).length > 0 ? (
                      getAssignedSites(selectedPersonnel.name).map((site) => (
                        <div key={site._id} className="flex items-center justify-between p-2 bg-black/20 border border-white/10 rounded">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-blue-400" />
                            <span className="text-xs text-white/80">{site.name}</span>
                            <span className="text-xs text-white/50">({site.locationName})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSiteAssignment(site._id, selectedPersonnel.name)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Remove site assignment"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-white/40 italic">No sites assigned to this personnel</div>
                    )}
                  </div>
                  <p className="text-xs text-white/50 mt-1">
                    Remove sites by clicking the red minus button. Sites can be reassigned from the Sites management page.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center gap-3 pt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-white/10 text-white/80 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditConfirm}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Personnel
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedPersonnel && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-50 w-full max-w-sm mx-4"
          >
            <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-6 shadow-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-center"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mb-4">
                  <Trash2 className="h-6 w-6 text-rose-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Delete Personnel</h3>
                <p className="text-white/60 mb-6">
                  Are you sure you want to delete "<span className="text-white font-medium">{selectedPersonnel.name}</span>"? This action cannot be undone.
                </p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 border border-white/10 text-white/80 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Delete
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-50 flex flex-col items-center">
            <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="mt-4 text-white/80 text-sm">Loading...</p>
          </div>
        </div>
      )}
    </SidebarAndNavbar>
  );
}
