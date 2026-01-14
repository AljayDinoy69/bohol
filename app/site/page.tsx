"use client";

import { useState, useEffect } from "react";
import { MapPin, Search, Plus, Edit, Trash2, Activity, Eye } from "lucide-react";
import { motion } from "framer-motion";
import SidebarAndNavbar from "../components/SidebarAndNavbar";
import { useAuth } from "../hooks/useAuth";

const boholTowns = [
  // First District
  { name: "Tagbilaran City", lat: 9.6399, lng: 123.8543 },
  { name: "Alburquerque", lat: 9.6081, lng: 123.9575 },
  { name: "Antequera", lat: 9.7828, lng: 123.8997 },
  { name: "Baclayon", lat: 9.6222, lng: 123.9111 },
  { name: "Balilihan", lat: 9.7547, lng: 123.9694 },
  { name: "Calape", lat: 9.8911, lng: 123.8825 },
  { name: "Catigbian", lat: 9.8294, lng: 124.0225 },
  { name: "Corella", lat: 9.6869, lng: 123.9222 },
  { name: "Cortes", lat: 9.6911, lng: 123.8825 },
  { name: "Dauis", lat: 9.6283, lng: 123.8689 },
  { name: "Loon", lat: 9.7997, lng: 123.8017 },
  { name: "Maribojoc", lat: 9.7431, lng: 123.8422 },
  { name: "Panglao", lat: 9.5806, lng: 123.7486 },
  { name: "Sikatuna", lat: 9.6914, lng: 123.9725 },
  { name: "Tubigon", lat: 9.9514, lng: 123.9639 },

  // Second District
  { name: "Bien Unido", lat: 10.1692, lng: 124.3311 },
  { name: "Buenavista", lat: 10.0822, lng: 124.1106 },
  { name: "Clarin", lat: 9.9614, lng: 124.0253 },
  { name: "Dagohoy", lat: 9.9239, lng: 124.2697 },
  { name: "Danao", lat: 10.0019, lng: 124.2014 },
  { name: "Getafe", lat: 10.1472, lng: 124.1528 },
  { name: "Inabanga", lat: 10.0039, lng: 124.0725 },
  { name: "Pres. Carlos P. Garcia", lat: 10.1206, lng: 124.4842 },
  { name: "Sagbayan", lat: 9.9208, lng: 124.1086 },
  { name: "San Isidro", lat: 9.8894, lng: 123.9931 },
  { name: "San Miguel", lat: 9.9889, lng: 124.3456 },
  { name: "Talibon", lat: 10.1489, lng: 124.3325 },
  { name: "Trinidad", lat: 10.0889, lng: 124.3344 },
  { name: "Ubay", lat: 10.0572, lng: 124.4719 },

  // Third District
  { name: "Alicia", lat: 9.8978, lng: 124.4419 },
  { name: "Anda", lat: 9.7444, lng: 124.5761 },
  { name: "Batuan", lat: 9.7864, lng: 124.1503 },
  { name: "Bilar", lat: 9.7153, lng: 124.1136 },
  { name: "Candijay", lat: 9.8411, lng: 124.5458 },
  { name: "Carmen", lat: 9.8214, lng: 124.1950 },
  { name: "Dimiao", lat: 9.6053, lng: 124.1683 },
  { name: "Duero", lat: 9.6881, lng: 124.3700 },
  { name: "Garcia Hernandez", lat: 9.6136, lng: 124.2344 },
  { name: "Guindulman", lat: 9.7522, lng: 124.4858 },
  { name: "Jagna", lat: 9.6517, lng: 124.3683 },
  { name: "Lila", lat: 9.5911, lng: 124.0989 },
  { name: "Loay", lat: 9.6031, lng: 124.0117 },
  { name: "Loboc", lat: 9.6414, lng: 124.0353 },
  { name: "Mabini", lat: 9.8631, lng: 124.5222 },
  { name: "Pilar", lat: 9.8169, lng: 124.3353 },
  { name: "Sevilla", lat: 9.7156, lng: 124.0531 },
  { name: "Sierra Bullones", lat: 9.7844, lng: 124.2881 },
  { name: "Valencia", lat: 9.6097, lng: 124.2036 }
];

export default function SitePage() {
  const { permissions } = useAuth();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInspectModal, setShowInspectModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false); // For personnel to update status
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sites, setSites] = useState<any[]>([]);
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    siteName: "",
    town: "",
    assignedPersonnel: "",
    status: "active" as "active" | "warning" | "offline"
  });

  // Load sites and personnel from localStorage
  useEffect(() => {
    const loadSites = () => {
      const storedSites = JSON.parse(localStorage.getItem("bohol_sites") || "[]");
      setSites(storedSites);
    };

    const loadPersonnel = () => {
      const storedPersonnel = JSON.parse(localStorage.getItem("personnel") || "[]");
      setPersonnel(storedPersonnel);
    };

    loadSites();
    loadPersonnel();
    
    // Listen for updates
    const handleSiteUpdate = () => {
      loadSites();
    };
    
    const handlePersonnelUpdate = () => {
      loadPersonnel();
    };
    
    window.addEventListener('bohol_sites_updated', handleSiteUpdate);
    window.addEventListener('personnel_updated', handlePersonnelUpdate);
    window.addEventListener('storage', handleSiteUpdate);
    window.addEventListener('storage', handlePersonnelUpdate);
    
    return () => {
      window.removeEventListener('bohol_sites_updated', handleSiteUpdate);
      window.removeEventListener('personnel_updated', handlePersonnelUpdate);
      window.removeEventListener('storage', handleSiteUpdate);
      window.removeEventListener('storage', handlePersonnelUpdate);
    };
  }, []);

  const filtered = sites.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  // Function to check if assigned personnel still exists
  const getPersonnelDisplay = (assignedPersonnel: string) => {
    if (!assignedPersonnel) return null;
    
    const personnelExists = personnel.some(p => p.name === assignedPersonnel);
    if (personnelExists) {
      return assignedPersonnel;
    } else {
      return "No assigned personnel";
    }
  };

  const handleOpenModal = () => {
    setIsLoading(true);
    // Reset form
    setFormData({ siteName: "", town: "", assignedPersonnel: "", status: "active" });
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(true);
    }, 800);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ siteName: "", town: "", assignedPersonnel: "", status: "active" });
  };

  const handleEdit = (site: any) => {
    setIsLoading(true);
    setSelectedSite(site);
    setFormData({
      siteName: site.name,
      town: site.location,
      assignedPersonnel: site.assignedPersonnel || "",
      status: site.status.toLowerCase() === "active" ? "active" : 
              site.status.toLowerCase() === "warning" ? "warning" : "offline"
    });
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      setShowEditModal(true);
    }, 800);
  };

  const handleDelete = (site: any) => {
    setIsLoading(true);
    setSelectedSite(site);
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      setShowDeleteModal(true);
    }, 800);
  };

  const handleInspect = (site: any) => {
    setIsLoading(true);
    setSelectedSite(site);
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      setShowInspectModal(true);
    }, 800);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.siteName || !formData.town || !selectedSite) {
      return;
    }

    // Check for duplicate site name (excluding current site)
    const existingSites = JSON.parse(localStorage.getItem("bohol_sites") || "[]");
    const duplicateName = existingSites.some((site: any) => 
      site.name.toLowerCase() === formData.siteName.toLowerCase() && site.id !== selectedSite.id
    );
    
    // Check for duplicate town assignment (excluding current site)
    const duplicateTown = existingSites.some((site: any) => 
      site.location.toLowerCase() === formData.town.toLowerCase() && site.id !== selectedSite.id
    );

    if (duplicateName) {
      alert('A site with this name already exists!');
      return;
    }

    if (duplicateTown) {
      alert('A site is already assigned to this town!');
      return;
    }

    // Get coordinates for selected town
    const selectedTown = boholTowns.find(town => town.name === formData.town);
    if (!selectedTown) {
      return;
    }

    // Update site
    const updatedSite = {
      ...selectedSite,
      name: formData.siteName,
      location: formData.town,
      assignedPersonnel: formData.assignedPersonnel,
      status: formData.status === "active" ? "Active" : formData.status === "warning" ? "Warning" : "Offline",
      lat: selectedTown.lat,
      lng: selectedTown.lng,
      lastCheck: new Date().toLocaleString("en-US", { 
        year: "numeric", 
        month: "2-digit", 
        day: "2-digit", 
        hour: "2-digit", 
        minute: "2-digit" 
      }).replace(",", ""),
      signal: formData.status === "active" ? "Strong" : formData.status === "warning" ? "Moderate" : "Weak"
    };

    // Update in localStorage
    const updatedSites = existingSites.map((site: any) => 
      site.id === selectedSite.id ? updatedSite : site
    );
    localStorage.setItem("bohol_sites", JSON.stringify(updatedSites));
    
    // Update personnel assignments
    const personnelAssignments = JSON.parse(localStorage.getItem("personnel_assignments") || "{}");
    Object.keys(personnelAssignments).forEach(personnel => {
      personnelAssignments[personnel] = personnelAssignments[personnel].map((assignment: any) => 
        assignment.siteId === selectedSite.id ? {
          ...assignment,
          siteName: updatedSite.name,
          location: updatedSite.location,
          status: updatedSite.status
        } : assignment
      );
    });
    localStorage.setItem("personnel_assignments", JSON.stringify(personnelAssignments));
    
    // Dispatch events to update pages immediately
    window.dispatchEvent(new Event('bohol_sites_updated'));
    window.dispatchEvent(new Event('personnel_assignments_updated'));

    // Close modal
    setShowEditModal(false);
    setSelectedSite(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedSite) return;

    // Delete from localStorage
    const existingSites = JSON.parse(localStorage.getItem("bohol_sites") || "[]");
    const updatedSites = existingSites.filter((site: any) => site.id !== selectedSite.id);
    localStorage.setItem("bohol_sites", JSON.stringify(updatedSites));
    
    // Remove from personnel assignments
    const personnelAssignments = JSON.parse(localStorage.getItem("personnel_assignments") || "{}");
    Object.keys(personnelAssignments).forEach(personnel => {
      personnelAssignments[personnel] = personnelAssignments[personnel].filter((assignment: any) => 
        assignment.siteId !== selectedSite.id
      );
    });
    localStorage.setItem("personnel_assignments", JSON.stringify(personnelAssignments));
    
    // Dispatch events to update pages immediately
    window.dispatchEvent(new Event('bohol_sites_updated'));
    window.dispatchEvent(new Event('personnel_assignments_updated'));

    // Close modal
    setShowDeleteModal(false);
    setSelectedSite(null);
  };

  const handleStatusUpdate = (site: any) => {
    setSelectedSite(site);
    setFormData({
      siteName: site.name,
      town: site.location,
      assignedPersonnel: site.assignedPersonnel || "",
      status: site.status.toLowerCase() === "active" ? "active" : 
              site.status.toLowerCase() === "warning" ? "warning" : "offline"
    });
    setShowStatusModal(true);
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSite) return;

    // Update only the status
    const existingSites = JSON.parse(localStorage.getItem("bohol_sites") || "[]");
    const updatedSites = existingSites.map((site: any) => 
      site.id === selectedSite.id 
        ? { 
            ...site, 
            status: formData.status === "active" ? "Active" : 
                    formData.status === "warning" ? "Warning" : "Offline",
            signal: formData.status === "active" ? "Strong" : 
                    formData.status === "warning" ? "Moderate" : "Weak",
            lastCheck: new Date().toLocaleString("en-US", { 
              year: "numeric", 
              month: "2-digit", 
              day: "2-digit", 
              hour: "2-digit", 
              minute: "2-digit" 
            }).replace(",", "")
          }
        : site
    );
    
    localStorage.setItem("bohol_sites", JSON.stringify(updatedSites));
    
    // Dispatch event to update pages immediately
    window.dispatchEvent(new Event('bohol_sites_updated'));

    // Close modal
    setShowStatusModal(false);
    setSelectedSite(null);
    setFormData({ siteName: "", town: "", assignedPersonnel: "", status: "active" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.siteName || !formData.town || !formData.assignedPersonnel) {
      return;
    }

    // Check for duplicate site name
    const existingSites = JSON.parse(localStorage.getItem("bohol_sites") || "[]");
    const duplicateName = existingSites.some((site: any) => 
      site.name.toLowerCase() === formData.siteName.toLowerCase() && site.id !== selectedSite?.id
    );
    
    // Check for duplicate town assignment
    const duplicateTown = existingSites.some((site: any) => 
      site.location.toLowerCase() === formData.town.toLowerCase() && site.id !== selectedSite?.id
    );

    if (duplicateName) {
      alert('A site with this name already exists!');
      return;
    }

    if (duplicateTown) {
      alert('A site is already assigned to this town!');
      return;
    }

    // Get coordinates for selected town
    const selectedTown = boholTowns.find(town => town.name === formData.town);
    if (!selectedTown) {
      return;
    }

    // Create new site with coordinates
    const newSite = {
      id: Date.now().toString(), // Use timestamp string for unique ID to match personnel IDs
      name: formData.siteName,
      location: formData.town,
      assignedPersonnel: formData.assignedPersonnel,
      status: formData.status === "active" ? "Active" : formData.status === "warning" ? "Warning" : "Offline",
      lastCheck: new Date().toLocaleString("en-US", { 
        year: "numeric", 
        month: "2-digit", 
        day: "2-digit", 
        hour: "2-digit", 
        minute: "2-digit" 
      }).replace(",", ""),
      signal: formData.status === "active" ? "Strong" : formData.status === "warning" ? "Moderate" : "Weak",
      lat: selectedTown.lat,
      lng: selectedTown.lng
    };

    // Add site to local storage to sync with map
    existingSites.push(newSite);
    localStorage.setItem("bohol_sites", JSON.stringify(existingSites));
    
    // Update personnel assignments
    const personnelAssignments = JSON.parse(localStorage.getItem("personnel_assignments") || "{}");
    if (!personnelAssignments[formData.assignedPersonnel]) {
      personnelAssignments[formData.assignedPersonnel] = [];
    }
    personnelAssignments[formData.assignedPersonnel].push({
      siteId: newSite.id,
      siteName: newSite.name,
      location: newSite.location,
      status: newSite.status
    });
    localStorage.setItem("personnel_assignments", JSON.stringify(personnelAssignments));
    
    // Dispatch events to update pages immediately
    window.dispatchEvent(new Event('bohol_sites_updated'));
    window.dispatchEvent(new Event('personnel_assignments_updated'));

    // Close modal
    handleCloseModal();
  };

  return (
    <SidebarAndNavbar activePage="Site">
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
                <div className="text-xs font-medium text-white/60">Site</div>
                <div className="text-xl font-semibold tracking-tight">Site Management</div>
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
                {permissions.canModifySites && (
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
                        Add Site
                      </>
                    )}
                  </motion.button>
                )}
            </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filtered.length > 0 ? (
                  filtered.map((site, index) => (
                    <motion.div
                      key={`${site.id}-${site.name?.replace(/\s+/g, '-') || 'unknown'}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                      className="rounded-xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-base font-semibold text-white">{site.name}</h3>
                          <p className="text-xs text-white/60 mt-1">{site.location}</p>
                          {(site as any).assignedPersonnel && (
                            <p className="text-xs mt-1">
                              <span className={
                                personnel.some(p => p.name === (site as any).assignedPersonnel)
                                  ? "text-blue-400"
                                  : "text-rose-400"
                              }>
                                Assigned: {getPersonnelDisplay((site as any).assignedPersonnel)}
                              </span>
                            </p>
                          )}
                        </div>
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium ${
                            site.status === "Active"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : site.status === "Warning"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-rose-500/20 text-rose-300"
                          }`}
                        >
                          {site.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Signal</span>
                          <span
                            className={`font-medium ${
                              site.signal === "Strong"
                                ? "text-emerald-400"
                                : site.signal === "Moderate"
                                ? "text-amber-400"
                                : "text-rose-400"
                            }`}
                          >
                            {site.signal}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                      {/* Inspect button - All users */}
                      <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleInspect(site)}
                        className="text-emerald-400 hover:text-emerald-300"
                        title="Inspect"
                      >
                        <Activity className="h-4 w-4" />
                      </motion.button>
                      
                      {/* Edit button - Admin only */}
                      {permissions.canModifySites && (
                        <motion.button 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(site)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                      )}
                      
                      {/* Status Update button - Personnel only or Admin */}
                      {permissions.canUpdateSiteStatus && !permissions.canModifySites && (
                        <motion.button 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleStatusUpdate(site)}
                          className="text-amber-400 hover:text-amber-300"
                          title="Update Status"
                        >
                          <Eye className="h-4 w-4" />
                        </motion.button>
                      )}
                      
                      {/* Delete button - Admin only */}
                      {permissions.canModifySites && (
                        <motion.button 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(site)}
                          className="text-rose-400 hover:text-rose-300"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="col-span-full text-center py-12"
                >
                    <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                      <MapPin className="h-8 w-8 text-white/40" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No sites found</h3>
                    <p className="text-white/60 mb-6">
                      {search ? "Try adjusting your search terms" : "Get started by adding your first site"}
                    </p>
                    {!search && permissions.canModifySites && (
                      <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleOpenModal}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                        Add Your First Site
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
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
                <h2 className="text-xl font-semibold text-white">Add New Site</h2>
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
              
              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                onSubmit={handleSubmit} 
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                    placeholder="Enter site name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Assigned Personnel</label>
                  <select
                    value={formData.assignedPersonnel}
                    onChange={(e) => setFormData({...formData, assignedPersonnel: e.target.value})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                    required
                  >
                    <option value="">Select personnel</option>
                    {personnel
                      .filter(p => p.status === "Active")
                      .map((person) => (
                        <option key={person.id} value={person.name}>
                          {person.name} - {person.role}
                        </option>
                      ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Town</label>
                  <select
                    value={formData.town}
                    onChange={(e) => setFormData({...formData, town: e.target.value})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                    required
                  >
                    <option value="">Select a town</option>
                    {boholTowns.map((town) => (
                      <option key={town.name} value={town.name}>
                        {town.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as "active" | "warning" | "offline"})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                  >
                    <option value="active">Active</option>
                    <option value="warning">Warning</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex items-center gap-3 pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-white/10 text-white/80 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Site
                  </motion.button>
                </motion.div>
              </motion.form>
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
      
      {/* Edit Modal */}
      {showEditModal && selectedSite && (
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
                <h2 className="text-xl font-semibold text-white">Edit Site</h2>
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
              
              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                onSubmit={handleEditSubmit} 
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                    placeholder="Enter site name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Assigned Personnel</label>
                  <select
                    value={formData.assignedPersonnel}
                    onChange={(e) => setFormData({...formData, assignedPersonnel: e.target.value})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                    required
                  >
                    <option value="">Select personnel</option>
                    {personnel
                      .filter(p => p.status === "Active")
                      .map((person) => (
                        <option key={person.id} value={person.name}>
                          {person.name} - {person.role}
                        </option>
                      ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Town</label>
                  <select
                    value={formData.town}
                    onChange={(e) => setFormData({...formData, town: e.target.value})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                    required
                  >
                    <option value="">Select a town</option>
                    {boholTowns.map((town) => (
                      <option key={town.name} value={town.name}>
                        {town.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as "active" | "warning" | "offline"})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                  >
                    <option value="active">Active</option>
                    <option value="warning">Warning</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex items-center gap-3 pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-white/10 text-white/80 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Site
                  </motion.button>
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedSite && (
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
                <h3 className="text-lg font-semibold text-white mb-2">Delete Site</h3>
                <p className="text-white/60 mb-6">
                  Are you sure you want to delete "<span className="text-white font-medium">{selectedSite.name}</span>"? This action cannot be undone.
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

      {/* Inspect Modal */}
      {showInspectModal && selectedSite && (
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
            onClick={() => setShowInspectModal(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-50 w-full max-w-md mx-4"
          >
            <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Site Details</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowInspectModal(false)}
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
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedSite.name}</h3>
                    <p className="text-sm text-white/60">{selectedSite.location}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Status</label>
                    <span className={`inline-flex rounded px-2 py-1 text-xs font-medium ${
                      selectedSite.status === "Active"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : selectedSite.status === "Warning"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-rose-500/20 text-rose-300"
                    }`}>
                      {selectedSite.status}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Signal</label>
                    <span className={`font-medium ${
                      selectedSite.signal === "Strong"
                        ? "text-emerald-400"
                        : selectedSite.signal === "Moderate"
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}>
                      {selectedSite.signal}
                    </span>
                  </div>
                </div>
                
                {selectedSite.assignedPersonnel && (
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Assigned Personnel</label>
                    <p className="text-white">{selectedSite.assignedPersonnel}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Last Check</label>
                  <p className="text-white/80">{selectedSite.lastCheck}</p>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex items-center gap-3 pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowInspectModal(false)}
                    className="flex-1 px-4 py-2 border border-white/10 text-white/80 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Close
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Status Update Modal - For Personnel */}
      {showStatusModal && selectedSite && (
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
            onClick={() => setShowStatusModal(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-50 w-full max-w-md mx-4"
          >
            <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Update Site Status</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowStatusModal(false)}
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
                  <label className="block text-sm font-medium text-white/80 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={selectedSite.name}
                    disabled
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white/60"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Location</label>
                  <input
                    type="text"
                    value={selectedSite.location}
                    disabled
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white/60"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as "active" | "warning" | "offline"})}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                  >
                    <option value="active">Active</option>
                    <option value="warning">Warning</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center gap-3 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 border border-white/10 text-white/80 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStatusSubmit}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Update Status
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </SidebarAndNavbar>
  );
}
