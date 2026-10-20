import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Briefcase, Plus, Edit2, Trash2, X } from "lucide-react";

export function AdminExperiencePage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    employmentType: "Full-time",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    sortOrder: 0,
  });

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-experiences"],
    queryFn: () => api.get("/api/admin/experiences"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editingExp
        ? api.put(`/api/admin/experiences/${editingExp.id}`, data)
        : api.post("/api/admin/experiences", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-experiences"]);
      queryClient.invalidateQueries(["experiences"]);
      showSuccess(editingExp ? "Experience updated." : "Experience added.");
      closeModal();
    },
    onError: (err) => {
      showError(err.message || "Failed to save experience.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/experiences/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-experiences"]);
      queryClient.invalidateQueries(["experiences"]);
      showSuccess("Experience deleted.");
    },
    onError: (err) => {
      showError(err.message || "Failed to delete experience.");
    },
  });

  const openAddModal = () => {
    setEditingExp(null);
    setFormData({
      title: "",
      company: "",
      location: "",
      employmentType: "Full-time",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      sortOrder: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExp(exp);
    setFormData({
      title: exp.title,
      company: exp.company,
      location: exp.location || "",
      employmentType: exp.employmentType || "Full-time",
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      isCurrent: exp.isCurrent === 1,
      description: exp.description,
      sortOrder: exp.sortOrder || 0,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExp(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.startDate || !formData.description) {
      showError("Please fill in Title, Company, Start Date, and Description.");
      return;
    }
    saveMutation.mutate(formData);
  };

  const experiences = res?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20382B] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0FDF4] mb-1">Experience Timeline</h1>
          <p className="text-xs text-content-secondary font-mono">
            Manage work history, company roles, dates, and responsibilities.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs font-mono transition-colors shadow-glow-sm"
        >
          <Plus size={15} />
          <span>Add Experience</span>
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="h-64 rounded-xl bg-[#0D1B14] border border-[#20382B] animate-pulse" />
      ) : experiences.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0D1B14] border border-[#20382B]">
          <Briefcase size={32} className="mx-auto text-content-muted mb-2" />
          <h3 className="text-sm font-bold text-[#F0FDF4]">No experiences recorded yet</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-5 rounded-xl bg-[#0D1B14] border border-[#20382B] flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-accent-primary/40 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#F0FDF4]">{exp.title}</h3>
                  {exp.isCurrent === 1 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-accent-primary/10 text-accent-primary border border-accent-primary/30">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-content-secondary">
                  <span className="text-accent-secondary font-semibold">{exp.company}</span>
                  {exp.location && <span>• {exp.location}</span>}
                  <span>• {exp.employmentType}</span>
                  <span className="text-content-muted">
                    ({exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate})
                  </span>
                </div>

                <p className="text-xs text-content-secondary leading-relaxed pt-2 max-w-3xl whitespace-pre-line font-sans">
                  {exp.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                <button
                  onClick={() => openEditModal(exp)}
                  className="p-1.5 rounded bg-[#12251A] border border-[#243A2C] text-content-secondary hover:text-accent-primary"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete experience at '${exp.company}'?`)) {
                      deleteMutation.mutate(exp.id);
                    }
                  }}
                  className="p-1.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 rounded-2xl bg-[#0D1B14] border border-[#20382B] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#20382B] pb-3">
              <h3 className="text-base font-bold text-[#F0FDF4]">
                {editingExp ? "Edit Experience" : "Add Experience"}
              </h3>
              <button onClick={closeModal} className="text-content-muted hover:text-[#F0FDF4]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-content-secondary block">Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-content-secondary block">Company *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-content-secondary block">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-content-secondary block">Employment Type</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Apprenticeship">Apprenticeship</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-content-secondary block">Start Date *</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM (e.g. 2024-01)"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-content-secondary block">End Date</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM"
                    disabled={formData.isCurrent}
                    value={formData.isCurrent ? "" : formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="currentRole"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="w-4 h-4 rounded text-accent-primary bg-[#12251A] border-[#243A2C]"
                />
                <label htmlFor="currentRole" className="text-content-secondary cursor-pointer">
                  Currently working here
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-content-secondary block">Job Responsibilities *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary font-sans"
                />
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
                  {saveMutation.isPending ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
