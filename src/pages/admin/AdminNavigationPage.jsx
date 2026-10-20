import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Compass, Plus, Edit2, Trash2, X } from "lucide-react";

export function AdminNavigationPage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    label: "",
    path: "/",
    sortOrder: 1,
    isExternal: false,
    isActive: true,
  });

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-navigation"],
    queryFn: () => api.get("/api/admin/navigation"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editingItem
        ? api.put(`/api/admin/navigation/${editingItem.id}`, data)
        : api.post("/api/admin/navigation", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-navigation"]);
      queryClient.invalidateQueries(["navigation"]);
      showSuccess(editingItem ? "Navigation updated." : "Menu item added.");
      closeModal();
    },
    onError: (err) => showError(err.message || "Failed to save menu item."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/navigation/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-navigation"]);
      queryClient.invalidateQueries(["navigation"]);
      showSuccess("Menu item deleted.");
    },
    onError: (err) => showError(err.message || "Failed to delete item."),
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ label: "", path: "/", sortOrder: 1, isExternal: false, isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      path: item.path,
      sortOrder: item.sortOrder || 0,
      isExternal: item.isExternal === 1,
      isActive: item.isActive === 1,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.label || !formData.path) {
      showError("Label and Path required.");
      return;
    }
    saveMutation.mutate(formData);
  };

  const items = res?.data || [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20382B] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0FDF4] mb-1">Navigation Menu Manager</h1>
          <p className="text-xs text-content-secondary font-mono">
            Control links, sort order, and visibility of the public navigation bar.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs font-mono transition-colors shadow-glow-sm"
        >
          <Plus size={15} />
          <span>Add Nav Item</span>
        </button>
      </div>

      {isLoading ? (
        <div className="h-64 rounded-xl bg-[#0D1B14] border border-[#20382B] animate-pulse" />
      ) : items.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0D1B14] border border-[#20382B]">
          <Compass size={32} className="mx-auto text-content-muted mb-2" />
          <h3 className="text-sm font-bold text-[#F0FDF4]">No navigation items defined</h3>
        </div>
      ) : (
        <div className="rounded-xl bg-[#0D1B14] border border-[#20382B] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[#20382B] text-content-muted uppercase tracking-wider text-[11px] bg-[#07110D]/40">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Label</th>
                <th className="py-3 px-4">Target Path</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20382B]/60">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#12251A]/50 transition-colors">
                  <td className="py-3 px-4 text-content-muted">{item.sortOrder}</td>
                  <td className="py-3 px-4 font-bold text-[#F0FDF4]">{item.label}</td>
                  <td className="py-3 px-4 text-content-secondary">
                    {item.path}
                    {item.isExternal === 1 && (
                      <span className="ml-1 text-[10px] text-content-muted">(external)</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        item.isActive === 1
                          ? "bg-accent-primary/10 text-accent-primary border-accent-primary/20"
                          : "bg-content-muted/10 text-content-muted border-border"
                      }`}
                    >
                      {item.isActive === 1 ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 text-content-secondary hover:text-accent-primary"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete menu item '${item.label}'?`)) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      className="p-1 text-content-muted hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0D1B14] border border-[#20382B] space-y-4">
            <div className="flex items-center justify-between border-b border-[#20382B] pb-3">
              <h3 className="text-base font-bold text-[#F0FDF4]">
                {editingItem ? "Edit Navigation Item" : "Add Navigation Item"}
              </h3>
              <button onClick={closeModal} className="text-content-muted hover:text-[#F0FDF4]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-content-secondary block">Menu Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Projects, Blog, About"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-content-secondary block">Path URL *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /projects, /blog, https://..."
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-content-secondary block">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
                  />
                </div>

                <div className="space-y-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-accent-primary bg-[#12251A] border-[#243A2C]"
                    />
                    <span className="text-content-secondary">Is Active</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#20382B]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-[#20382B] text-content-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-5 py-2 rounded-lg bg-accent-primary text-bg-primary font-bold shadow-glow-sm"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
