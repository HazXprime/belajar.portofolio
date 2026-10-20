import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Cpu, Plus, Edit2, Trash2, X } from "lucide-react";

export function AdminSkillsPage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [filterCat, setFilterCat] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "frontend",
    proficiencyLevel: "established",
    description: "",
    iconName: "",
    sortOrder: 0,
    isFeatured: false,
  });

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-skills"],
    queryFn: () => api.get("/api/admin/skills"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editingSkill
        ? api.put(`/api/admin/skills/${editingSkill.id}`, data)
        : api.post("/api/admin/skills", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-skills"]);
      queryClient.invalidateQueries(["skills"]);
      showSuccess(editingSkill ? "Skill updated." : "Skill added.");
      closeModal();
    },
    onError: (err) => {
      showError(err.message || "Failed to save skill.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/skills/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-skills"]);
      queryClient.invalidateQueries(["skills"]);
      showSuccess("Skill deleted.");
    },
    onError: (err) => {
      showError(err.message || "Failed to delete skill.");
    },
  });

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      category: "frontend",
      proficiencyLevel: "established",
      description: "",
      iconName: "",
      sortOrder: 0,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sk) => {
    setEditingSkill(sk);
    setFormData({
      name: sk.name,
      category: sk.category,
      proficiencyLevel: sk.proficiencyLevel || "established",
      description: sk.description || "",
      iconName: sk.iconName || "",
      sortOrder: sk.sortOrder || 0,
      isFeatured: sk.isFeatured === 1,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      showError("Skill name required.");
      return;
    }
    saveMutation.mutate(formData);
  };

  const skills = (res?.data || []).filter(
    (s) => filterCat === "all" || s.category === filterCat
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20382B] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0FDF4] mb-1">Skills Management</h1>
          <p className="text-xs text-content-secondary font-mono">
            Organize technical competencies, proficiency statuses, and display orders.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs font-mono transition-colors shadow-glow-sm"
        >
          <Plus size={15} />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-[#0D1B14] border border-[#20382B]">
        {["all", "frontend", "backend", "databases", "tools", "deployment"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-colors ${
              filterCat === cat
                ? "bg-accent-primary text-bg-primary font-bold shadow-glow-sm"
                : "text-content-secondary hover:text-[#F0FDF4]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Table */}
      {isLoading ? (
        <div className="h-64 rounded-xl bg-[#0D1B14] border border-[#20382B] animate-pulse" />
      ) : skills.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0D1B14] border border-[#20382B]">
          <Cpu size={32} className="mx-auto text-content-muted mb-2" />
          <h3 className="text-sm font-bold text-[#F0FDF4]">No skills in this category</h3>
        </div>
      ) : (
        <div className="rounded-xl bg-[#0D1B14] border border-[#20382B] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#20382B] text-content-muted font-mono uppercase tracking-wider text-[11px] bg-[#07110D]/40">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20382B]/60 font-mono">
              {skills.map((sk) => (
                <tr key={sk.id} className="hover:bg-[#12251A]/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#F0FDF4]">{sk.name}</td>
                  <td className="py-3 px-4 text-content-secondary capitalize">{sk.category}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        sk.proficiencyLevel === "learning"
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                          : "bg-accent-primary/10 text-accent-primary border-accent-primary/20"
                      }`}
                    >
                      {sk.proficiencyLevel || "established"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {sk.isFeatured === 1 ? (
                      <span className="text-accent-primary font-bold">Yes</span>
                    ) : (
                      <span className="text-content-muted">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-content-muted truncate max-w-xs font-sans">
                    {sk.description || "—"}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(sk)}
                      className="p-1 text-content-secondary hover:text-accent-primary"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete skill '${sk.name}'?`)) {
                          deleteMutation.mutate(sk.id);
                        }
                      }}
                      className="p-1 text-content-muted hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0D1B14] border border-[#20382B] space-y-4">
            <div className="flex items-center justify-between border-b border-[#20382B] pb-3">
              <h3 className="text-base font-bold text-[#F0FDF4]">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h3>
              <button onClick={closeModal} className="text-content-muted hover:text-[#F0FDF4]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-content-secondary block">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-content-secondary block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="databases">Databases</option>
                    <option value="tools">Tools</option>
                    <option value="deployment">Deployment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-content-secondary block">Proficiency</label>
                  <select
                    value={formData.proficiencyLevel}
                    onChange={(e) => setFormData({ ...formData, proficiencyLevel: e.target.value })}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
                  >
                    <option value="established">Established</option>
                    <option value="learning">Learning</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-content-secondary block">Description / Context</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-content-secondary block">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="featuredSkill"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-accent-primary bg-[#12251A] border-[#243A2C]"
                  />
                  <label htmlFor="featuredSkill" className="text-content-secondary cursor-pointer">
                    Show in Core Strip
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
                  {saveMutation.isPending ? "Saving..." : "Save Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
