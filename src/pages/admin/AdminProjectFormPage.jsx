import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function AdminProjectFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    description: "",
    content: "",
    featured: false,
    status: "draft",
    repoUrl: "",
    liveUrl: "",
    thumbnailUrl: "",
    features: [],
    techStack: [],
    sortOrder: 0,
    categoryId: "",
    previewType: "dashboard",
    images: [],
  });

  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [autoSlug, setAutoSlug] = useState(!isEditing);

  // Fetch categories
  const { data: catRes } = useQuery({
    queryKey: ["project-categories"],
    queryFn: () => api.get("/api/admin/categories?type=project"),
  });

  // Fetch project if editing
  const { data: projectRes, isLoading: isProjectLoading } = useQuery({
    queryKey: ["admin-project-detail", id],
    queryFn: () => api.get(`/api/admin/projects/${id}`),
    enabled: isEditing,
  });

  useEffect(() => {
    if (projectRes?.data) {
      const p = projectRes.data;
      setFormData({
        title: p.title || "",
        slug: p.slug || "",
        summary: p.summary || "",
        description: p.description || "",
        content: p.content || "",
        featured: p.featured === 1,
        status: p.status || "draft",
        repoUrl: p.repoUrl || "",
        liveUrl: p.liveUrl || "",
        thumbnailUrl: p.thumbnailUrl || "",
        features: Array.isArray(p.features) ? p.features : [],
        techStack: Array.isArray(p.techStack) ? p.techStack : [],
        sortOrder: p.sortOrder || 0,
        categoryId: p.categoryId || "",
        previewType: p.previewType || "dashboard",
        images: Array.isArray(p.images) ? p.images : [],
      });
      setAutoSlug(false);
    }
  }, [projectRes]);

  const saveMutation = useMutation({
    mutationFn: (data) =>
      isEditing ? api.put(`/api/admin/projects/${id}`, data) : api.post("/api/admin/projects", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-projects-list"]);
      queryClient.invalidateQueries(["projects"]);
      showSuccess(isEditing ? "Project updated successfully!" : "Project created successfully!");
      navigate("/admin/projects");
    },
    onError: (err) => {
      showError(err.message || "Failed to save project.");
    },
  });

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: autoSlug ? slugify(title) : prev.slug,
    }));
  };

  const addTechStack = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTechStack = (tech) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((t) => t !== tech),
    });
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const addGalleryImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: "", caption: "" }],
    });
  };

  const updateGalleryImage = (index, field, value) => {
    const updated = [...formData.images];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, images: updated });
  };

  const removeGalleryImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.summary || !formData.description) {
      showError("Please fill in Title, Summary, and Description.");
      return;
    }
    saveMutation.mutate(formData);
  };

  const categories = catRes?.data || [];

  if (isEditing && isProjectLoading) {
    return <div className="text-xs font-mono text-content-muted p-8">Loading project data...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#20382B] pb-4">
        <div>
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-content-muted hover:text-accent-primary mb-2 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Projects</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#F0FDF4]">
            {isEditing ? `Edit Project: ${formData.title}` : "Create New Project"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Metadata */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
            General Project Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Project Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-content-secondary">URL Slug *</label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[10px] font-mono text-content-muted hover:text-accent-primary"
                >
                  {autoSlug ? "Auto-generating" : "Manual override"}
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormData({ ...formData, slug: slugify(e.target.value) });
                }}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Publication Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              >
                <option value="draft">Draft (Hidden from public)</option>
                <option value="published">Published (Visible on site)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Sort Order</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featuredProj"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-accent-primary bg-[#12251A] border-[#243A2C]"
            />
            <label htmlFor="featuredProj" className="text-xs font-mono text-content-secondary cursor-pointer">
              Mark as Featured Project on Homepage
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-secondary">Summary (Card Blurb) *</label>
            <textarea
              rows={2}
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-secondary">Full Overview Description *</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-secondary">Architecture Content (Markdown Deep Dive)</label>
            <textarea
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary font-mono"
            />
          </div>
        </div>

        {/* Media & URLs */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
            Media & Repository Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Thumbnail Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">GitHub Repository URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={formData.repoUrl}
                onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Live Demo URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
            Tech Stack Tags
          </h3>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. React, Node.js, Turso, Tailwind CSS"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTechStack();
                }
              }}
              className="flex-1 bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
            />
            <button
              type="button"
              onClick={addTechStack}
              className="px-4 py-2 rounded-lg bg-[#12251A] border border-[#243A2C] text-xs font-mono text-accent-primary hover:border-accent-primary"
            >
              Add Tag
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {formData.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md bg-[#12251A] border border-[#243A2C] text-xs font-mono text-[#F0FDF4] flex items-center gap-1.5"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => removeTechStack(tech)}
                  className="text-content-muted hover:text-red-400"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Features Highlights */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
            Key Feature Bullets
          </h3>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. Real-time latency metrics visualized via clean SVG charts"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              className="flex-1 bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 rounded-lg bg-[#12251A] border border-[#243A2C] text-xs font-mono text-accent-primary hover:border-accent-primary"
            >
              Add Bullet
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {formData.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-[#12251A] border border-[#243A2C] text-xs text-[#F0FDF4]"
              >
                <span>{feat}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Images */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
              Interface Gallery Images
            </h3>
            <button
              type="button"
              onClick={addGalleryImage}
              className="text-xs font-mono text-accent-primary hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Add Image
            </button>
          </div>

          <div className="space-y-3">
            {formData.images.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={img.url}
                  onChange={(e) => updateGalleryImage(i, "url", e.target.value)}
                  className="flex-1 bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono"
                />
                <input
                  type="text"
                  placeholder="Caption (optional)"
                  value={img.caption || ""}
                  onChange={(e) => updateGalleryImage(i, "caption", e.target.value)}
                  className="w-1/3 bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#20382B]">
          <Link
            to="/admin/projects"
            className="px-5 py-2.5 rounded-lg border border-[#20382B] bg-[#12251A] text-xs font-mono text-content-secondary hover:text-[#F0FDF4]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="px-6 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs font-mono transition-colors shadow-glow-sm flex items-center gap-2"
          >
            <Save size={15} />
            <span>{saveMutation.isPending ? "Saving..." : "Save Project"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
