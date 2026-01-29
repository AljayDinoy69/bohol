"use client";

import { useState } from "react";
import { BoholTown, useBoholTowns } from "@/app/hooks/useBoholTowns";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

export default function TownsManager() {
  const { towns, loading, error, addTown, updateTown, deleteTown } = useBoholTowns();
  const [isAddingTown, setIsAddingTown] = useState(false);
  const [editingTown, setEditingTown] = useState<BoholTown | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    lat: "",
    lng: "",
    district: "1"
  });

  const resetForm = () => {
    setFormData({ name: "", lat: "", lng: "", district: "1" });
    setIsAddingTown(false);
    setEditingTown(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const townData = {
      name: formData.name,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      district: parseInt(formData.district)
    };

    if (editingTown) {
      const result = await updateTown(editingTown._id!, townData);
      if (result.success) {
        resetForm();
      }
    } else {
      const result = await addTown(townData);
      if (result.success) {
        resetForm();
      }
    }
  };

  const handleEdit = (town: BoholTown) => {
    setEditingTown(town);
    setFormData({
      name: town.name,
      lat: town.lat.toString(),
      lng: town.lng.toString(),
      district: town.district.toString()
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this town?")) {
      await deleteTown(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white/70">Loading towns...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Manage Bohol Towns</h2>
        <button
          onClick={() => setIsAddingTown(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Town
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAddingTown || editingTown) && (
        <div className="mb-6 p-4 bg-black/40 border border-white/10 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">
            {editingTown ? "Edit Town" : "Add New Town"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Town Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  District
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="1">First District</option>
                  <option value="2">Second District</option>
                  <option value="3">Third District</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" />
                {editingTown ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Towns List */}
      <div className="space-y-2">
        {towns.map((town) => (
          <div
            key={town._id}
            className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg"
          >
            <div>
              <div className="font-medium text-white">{town.name}</div>
              <div className="text-sm text-white/60">
                District {town.district} • {town.lat.toFixed(4)}, {town.lng.toFixed(4)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(town)}
                className="p-2 text-blue-400 hover:bg-white/10 rounded transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(town._id!)}
                className="p-2 text-red-400 hover:bg-white/10 rounded transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {towns.length === 0 && (
        <div className="text-center py-8">
          <div className="text-white/60">No towns found. Add your first town to get started.</div>
        </div>
      )}
    </div>
  );
}
