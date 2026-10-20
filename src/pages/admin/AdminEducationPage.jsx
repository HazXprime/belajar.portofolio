import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { GraduationCap, Award, Plus, Edit2, Trash2, X } from "lucide-react";

export function AdminEducationPage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [editingCert, setEditingCert] = useState(null);

  const [eduForm, setEduForm] = useState({
    degree: "",
    institution: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    gradeOrHonors: "",
    description: "",
    sortOrder: 0,
  });

  const [certForm, setCertForm] = useState({
    name: "",
    issuingOrganization: "",
    issueDate: "",
    expirationDate: "",
    credentialId: "",
    credentialUrl: "",
    sortOrder: 0,
  });

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-educations"],
    queryFn: () => api.get("/api/admin/educations"),
  });

  // Education mutations
  const saveEduMutation = useMutation({
    mutationFn: (data) =>
      editingEdu
        ? api.put(`/api/admin/educations/${editingEdu.id}`, data)
        : api.post("/api/admin/educations", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-educations"]);
      queryClient.invalidateQueries(["educations"]);
      showSuccess(editingEdu ? "Education updated." : "Education added.");
      setEduModalOpen(false);
      setEditingEdu(null);
    },
    onError: (err) => showError(err.message || "Failed to save education."),
  });

  const deleteEduMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/educations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-educations"]);
      queryClient.invalidateQueries(["educations"]);
      showSuccess("Education deleted.");
    },
    onError: (err) => showError(err.message || "Failed to delete education."),
  });

  // Certification mutations
  const saveCertMutation = useMutation({
    mutationFn: (data) =>
      editingCert
        ? api.put(`/api/admin/certifications/${editingCert.id}`, data)
        : api.post("/api/admin/certifications", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-educations"]);
      queryClient.invalidateQueries(["educations"]);
      showSuccess(editingCert ? "Certification updated." : "Certification added.");
      setCertModalOpen(false);
      setEditingCert(null);
    },
    onError: (err) => showError(err.message || "Failed to save certification."),
  });

  const deleteCertMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/certifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-educations"]);
      queryClient.invalidateQueries(["educations"]);
      showSuccess("Certification deleted.");
    },
    onError: (err) => showError(err.message || "Failed to delete certification."),
  });

  const openAddEdu = () => {
    setEditingEdu(null);
    setEduForm({
      degree: "",
      institution: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      gradeOrHonors: "",
      description: "",
      sortOrder: 0,
    });
    setEduModalOpen(true);
  };

  const openEditEdu = (edu) => {
    setEditingEdu(edu);
    setEduForm({
      degree: edu.degree,
      institution: edu.institution,
      fieldOfStudy: edu.fieldOfStudy || "",
      startDate: edu.startDate,
      endDate: edu.endDate || "",
      isCurrent: edu.isCurrent === 1,
      gradeOrHonors: edu.gradeOrHonors || "",
      description: edu.description || "",
      sortOrder: edu.sortOrder || 0,
    });
    setEduModalOpen(true);
  };

  const openAddCert = () => {
    setEditingCert(null);
    setCertForm({
      name: "",
      issuingOrganization: "",
      issueDate: "",
      expirationDate: "",
      credentialId: "",
      credentialUrl: "",
      sortOrder: 0,
    });
    setCertModalOpen(true);
  };

  const openEditCert = (c) => {
    setEditingCert(c);
    setCertForm({
      name: c.name,
      issuingOrganization: c.issuingOrganization,
      issueDate: c.issueDate,
      expirationDate: c.expirationDate || "",
      credentialId: c.credentialId || "",
      credentialUrl: c.credentialUrl || "",
      sortOrder: c.sortOrder || 0,
    });
    setCertModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 rounded-xl bg-[#0D1B14] border border-[#20382B]" />
        <div className="h-48 rounded-xl bg-[#0D1B14] border border-[#20382B]" />
      </div>
    );
  }

  const educations = res?.educations || [];
  const certifications = res?.certifications || [];

  return (
    <div className="space-y-10">
      {/* 1. Formal Education */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#20382B] pb-3">
          <div>
            <h2 className="text-xl font-bold text-[#F0FDF4] flex items-center gap-2">
              <GraduationCap size={18} className="text-accent-primary" />
              <span>Formal Education</span>
            </h2>
            <p className="text-xs text-content-secondary font-mono">
              University degrees, schools, and academic distinctions.
            </p>
          </div>
          <button
            onClick={openAddEdu}
            className="px-3.5 py-1.5 rounded-lg bg-accent-primary text-bg-primary font-semibold text-xs font-mono shadow-glow-sm flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Education
          </button>
        </div>

        <div className="space-y-3">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="p-4 rounded-xl bg-[#0D1B14] border border-[#20382B] flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-sm font-bold text-[#F0FDF4]">{edu.degree}</h3>
                <div className="text-xs font-mono text-content-secondary">
                  {edu.institution} {edu.fieldOfStudy ? `• ${edu.fieldOfStudy}` : ""}
                </div>
                <div className="text-[11px] font-mono text-content-muted">
                  {edu.startDate} — {edu.isCurrent ? "Present" : edu.endDate}
                  {edu.gradeOrHonors && ` • ${edu.gradeOrHonors}`}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditEdu(edu)}
                  className="p-1.5 rounded bg-[#12251A] border border-[#243A2C] text-content-secondary hover:text-accent-primary"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete education record '${edu.degree}'?`)) {
                      deleteEduMutation.mutate(edu.id);
                    }
                  }}
                  className="p-1.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {educations.length === 0 && (
            <p className="text-xs font-mono text-content-muted py-4">No education records found.</p>
          )}
        </div>
      </div>

      {/* 2. Certifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#20382B] pb-3">
          <div>
            <h2 className="text-xl font-bold text-[#F0FDF4] flex items-center gap-2">
              <Award size={18} className="text-accent-secondary" />
              <span>Verified Certifications</span>
            </h2>
            <p className="text-xs text-content-secondary font-mono">
              Professional credentials, issuing authorities, and verification links.
            </p>
          </div>
          <button
            onClick={openAddCert}
            className="px-3.5 py-1.5 rounded-lg bg-accent-secondary text-bg-primary font-semibold text-xs font-mono shadow-glow-sm flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Certification
          </button>
        </div>

        <div className="space-y-3">
          {certifications.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-[#0D1B14] border border-[#20382B] flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-sm font-bold text-[#F0FDF4]">{c.name}</h3>
                <div className="text-xs font-mono text-content-secondary">
                  {c.issuingOrganization} • Issued {c.issueDate}
                </div>
                {c.credentialId && (
                  <div className="text-[11px] font-mono text-content-muted">ID: {c.credentialId}</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditCert(c)}
                  className="p-1.5 rounded bg-[#12251A] border border-[#243A2C] text-content-secondary hover:text-accent-primary"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete certification '${c.name}'?`)) {
                      deleteCertMutation.mutate(c.id);
                    }
                  }}
                  className="p-1.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {certifications.length === 0 && (
            <p className="text-xs font-mono text-content-muted py-4">No certifications found.</p>
          )}
        </div>
      </div>

      {/* Education Modal */}
      {eduModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0D1B14] border border-[#20382B] space-y-4">
            <div className="flex items-center justify-between border-b border-[#20382B] pb-3">
              <h3 className="text-base font-bold text-[#F0FDF4]">
                {editingEdu ? "Edit Education" : "Add Education"}
              </h3>
              <button onClick={() => setEduModalOpen(false)} className="text-content-muted hover:text-[#F0FDF4]">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEduMutation.mutate(eduForm);
              }}
              className="space-y-3 text-xs font-mono"
            >
              <div className="space-y-1">
                <label className="text-content-secondary block">Degree Title *</label>
                <input
                  type="text"
                  required
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-content-secondary block">Institution / University *</label>
                <input
                  type="text"
                  required
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-content-secondary block">Start Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="YYYY-MM"
                    value={eduForm.startDate}
                    onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-content-secondary block">End Date</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM"
                    disabled={eduForm.isCurrent}
                    value={eduForm.isCurrent ? "" : eduForm.endDate}
                    onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-content-secondary block">Grade / Honors</label>
                <input
                  type="text"
                  placeholder="e.g. GPA 3.8 / 4.0, Cum Laude"
                  value={eduForm.gradeOrHonors}
                  onChange={(e) => setEduForm({ ...eduForm, gradeOrHonors: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#20382B]">
                <button
                  type="button"
                  onClick={() => setEduModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#20382B] text-content-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveEduMutation.isPending}
                  className="px-5 py-2 rounded-lg bg-accent-primary text-bg-primary font-bold shadow-glow-sm"
                >
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certification Modal */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0D1B14] border border-[#20382B] space-y-4">
            <div className="flex items-center justify-between border-b border-[#20382B] pb-3">
              <h3 className="text-base font-bold text-[#F0FDF4]">
                {editingCert ? "Edit Certification" : "Add Certification"}
              </h3>
              <button onClick={() => setCertModalOpen(false)} className="text-content-muted hover:text-[#F0FDF4]">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveCertMutation.mutate(certForm);
              }}
              className="space-y-3 text-xs font-mono"
            >
              <div className="space-y-1">
                <label className="text-content-secondary block">Certification Name *</label>
                <input
                  type="text"
                  required
                  value={certForm.name}
                  onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-content-secondary block">Issuing Organization *</label>
                <input
                  type="text"
                  required
                  value={certForm.issuingOrganization}
                  onChange={(e) => setCertForm({ ...certForm, issuingOrganization: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-content-secondary block">Issue Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="YYYY-MM"
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-content-secondary block">Credential ID</label>
                  <input
                    type="text"
                    placeholder="Optional ID"
                    value={certForm.credentialId}
                    onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-content-secondary block">Credential Verification URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={certForm.credentialUrl}
                  onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#20382B]">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#20382B] text-content-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveCertMutation.isPending}
                  className="px-5 py-2 rounded-lg bg-accent-secondary text-bg-primary font-bold shadow-glow-sm"
                >
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
