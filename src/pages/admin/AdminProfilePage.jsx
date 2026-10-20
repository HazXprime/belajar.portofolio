import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Save, Plus, Trash2 } from "lucide-react";

export function AdminProfilePage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data: profileRes, isLoading } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: () => api.get("/api/admin/profile"),
  });

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    handle: "",
    bioShort: "",
    aboutLead: "",
    aboutParagraphs: [],
    highlights: [],
    avatarUrl: "",
    location: "",
    isAvailable: true,
    availabilityStatus: "",
    contactEmail: "",
    githubUrl: "",
    linkedinUrl: "",
    resumeUrl: "",
  });

  useEffect(() => {
    if (profileRes?.data) {
      const d = profileRes.data;
      setFormData({
        name: d.name || "",
        title: d.title || "",
        handle: d.handle || "",
        bioShort: d.bioShort || "",
        aboutLead: d.aboutLead || "",
        aboutParagraphs: Array.isArray(d.aboutParagraphs) ? d.aboutParagraphs : [],
        highlights: Array.isArray(d.highlights) ? d.highlights : [],
        avatarUrl: d.avatarUrl || "",
        location: d.location || "",
        isAvailable: d.isAvailable === 1 || d.isAvailable === true,
        availabilityStatus: d.availabilityStatus || "",
        contactEmail: d.contactEmail || "",
        githubUrl: d.githubUrl || "",
        linkedinUrl: d.linkedinUrl || "",
        resumeUrl: d.resumeUrl || "",
      });
    }
  }, [profileRes]);

  const updateMutation = useMutation({
    mutationFn: (data) => api.put("/api/admin/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-profile"]);
      queryClient.invalidateQueries(["profile"]);
      showSuccess("Profile updated successfully!");
    },
    onError: (err) => {
      showError(err.message || "Failed to update profile.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleParagraphChange = (index, value) => {
    const updated = [...formData.aboutParagraphs];
    updated[index] = value;
    setFormData({ ...formData, aboutParagraphs: updated });
  };

  const addParagraph = () => {
    setFormData({
      ...formData,
      aboutParagraphs: [...formData.aboutParagraphs, ""],
    });
  };

  const removeParagraph = (index) => {
    setFormData({
      ...formData,
      aboutParagraphs: formData.aboutParagraphs.filter((_, i) => i !== index),
    });
  };

  const handleHighlightChange = (index, field, value) => {
    const updated = [...formData.highlights];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, highlights: updated });
  };

  const addHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...formData.highlights, { label: "", value: "" }],
    });
  };

  const removeHighlight = (index) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index),
    });
  };

  if (isLoading) {
    return <div className="text-xs font-mono text-content-muted p-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between border-b border-[#20382B] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0FDF4] mb-1">Developer Profile</h1>
          <p className="text-xs text-content-secondary font-mono">
            Manage your personal biographical details and social URLs.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Personal Details */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
            Core Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Professional Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Handle / Monogram</label>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Avatar Image URL</label>
              <input
                type="text"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-secondary">Short Hero Bio</label>
            <textarea
              rows={2}
              value={formData.bioShort}
              onChange={(e) => setFormData({ ...formData, bioShort: e.target.value })}
              className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
            />
          </div>
        </div>

        {/* Availability & Status */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
            Status & Availability
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Availability Status Text</label>
              <input
                type="text"
                value={formData.availabilityStatus}
                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-4 h-4 rounded text-accent-primary bg-[#12251A] border-[#243A2C]"
              />
              <label htmlFor="isAvailable" className="text-xs font-mono text-content-secondary cursor-pointer">
                Available for New Roles & Contracts
              </label>
            </div>
          </div>
        </div>

        {/* About Page Story */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
              About Page Paragraphs
            </h3>
            <button
              type="button"
              onClick={addParagraph}
              className="text-xs font-mono text-accent-primary hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-secondary">About Lead</label>
            <input
              type="text"
              value={formData.aboutLead}
              onChange={(e) => setFormData({ ...formData, aboutLead: e.target.value })}
              className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
            />
          </div>

          <div className="space-y-3">
            {formData.aboutParagraphs.map((para, i) => (
              <div key={i} className="flex items-start gap-2">
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => handleParagraphChange(i, e.target.value)}
                  className="flex-1 bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
                  placeholder={`Paragraph ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeParagraph(i)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
              Specialization Highlights
            </h3>
            <button
              type="button"
              onClick={addHighlight}
              className="text-xs font-mono text-accent-primary hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Add Highlight
            </button>
          </div>

          <div className="space-y-2">
            {formData.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g. Focus)"
                  value={h.label}
                  onChange={(e) => handleHighlightChange(i, "label", e.target.value)}
                  className="w-1/3 bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={h.value}
                  onChange={(e) => handleHighlightChange(i, "value", e.target.value)}
                  className="flex-1 bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono"
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(i)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Social & Contact URLs */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
            Social Profiles & URLs
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">GitHub Profile URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">LinkedIn Profile URL</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Resume URL (Optional)</label>
              <input
                type="url"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs font-mono transition-colors shadow-glow-sm flex items-center gap-2"
          >
            <Save size={15} />
            <span>{updateMutation.isPending ? "Saving changes..." : "Save Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
