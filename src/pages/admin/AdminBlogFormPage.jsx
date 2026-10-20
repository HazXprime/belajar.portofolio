import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import DOMPurify from "dompurify";
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
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

export function AdminBlogFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const [previewMode, setPreviewMode] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEditing);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    status: "draft",
    categoryId: "",
    seoTitle: "",
    seoDescription: "",
    tagIds: [],
  });

  // Categories & Tags
  const { data: catRes } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => api.get("/api/admin/categories?type=blog"),
  });

  const { data: tagsRes } = useQuery({
    queryKey: ["admin-tags"],
    queryFn: () => api.get("/api/admin/tags"),
  });

  // Post detail if editing
  const { data: postRes, isLoading } = useQuery({
    queryKey: ["admin-blog-detail", id],
    queryFn: () => api.get(`/api/admin/blog/${id}`),
    enabled: isEditing,
  });

  useEffect(() => {
    if (postRes?.data) {
      const p = postRes.data;
      setFormData({
        title: p.title || "",
        slug: p.slug || "",
        excerpt: p.excerpt || "",
        content: p.content || "",
        featuredImage: p.featuredImage || "",
        status: p.status || "draft",
        categoryId: p.categoryId || "",
        seoTitle: p.seoTitle || "",
        seoDescription: p.seoDescription || "",
        tagIds: Array.isArray(p.tagIds) ? p.tagIds : [],
      });
      setAutoSlug(false);
    }
  }, [postRes]);

  const saveMutation = useMutation({
    mutationFn: (data) =>
      isEditing ? api.put(`/api/admin/blog/${id}`, data) : api.post("/api/admin/blog", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-blog-list"]);
      queryClient.invalidateQueries(["blog"]);
      showSuccess(isEditing ? "Article updated." : "Article created.");
      navigate("/admin/blog");
    },
    onError: (err) => showError(err.message || "Failed to save article."),
  });

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: autoSlug ? slugify(title) : prev.slug,
    }));
  };

  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const exists = prev.tagIds.includes(tagId);
      return {
        ...prev,
        tagIds: exists ? prev.tagIds.filter((t) => t !== tagId) : [...prev.tagIds, tagId],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.content) {
      showError("Please fill in Title, Excerpt, and Article Content.");
      return;
    }
    saveMutation.mutate(formData);
  };

  const categories = catRes?.data || [];
  const allTags = tagsRes?.data || [];

  if (isEditing && isLoading) {
    return <div className="text-xs font-mono text-content-muted p-8">Loading article...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#20382B] pb-4">
        <div>
          <Link
            to="/admin/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-content-muted hover:text-accent-primary mb-2 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Articles</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#F0FDF4]">
            {isEditing ? `Edit Article: ${formData.title}` : "Write New Article"}
          </h1>
        </div>

        {/* Preview / Edit Toggle */}
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#20382B] bg-[#12251A] text-xs font-mono text-content-secondary hover:text-accent-primary transition-colors"
        >
          {previewMode ? <Edit3 size={14} /> : <Eye size={14} />}
          <span>{previewMode ? "Return to Editor" : "Live Preview"}</span>
        </button>
      </div>

      {previewMode ? (
        /* Live Preview Mode */
        <div className="p-8 rounded-2xl bg-[#0D1B14] border border-[#20382B] space-y-6">
          <div className="space-y-2 border-b border-[#20382B] pb-4">
            <span className="text-[10px] font-mono uppercase bg-accent-primary/10 text-accent-primary border border-accent-primary/20 px-2 py-0.5 rounded">
              Live Preview
            </span>
            <h1 className="text-3xl font-extrabold text-[#F0FDF4]">{formData.title}</h1>
            <p className="text-xs text-content-muted font-mono">{formData.excerpt}</p>
          </div>

          {formData.featuredImage && (
            <img
              src={formData.featuredImage}
              alt="Preview header"
              className="w-full h-64 object-cover rounded-xl"
            />
          )}

          <div
            className="prose prose-invert max-w-none text-content-secondary text-xs sm:text-sm leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formData.content) }}
          />
        </div>
      ) : (
        /* Edit Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Metadata */}
          <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
              Article Metadata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-content-secondary">Title *</label>
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
                  <label className="text-xs font-mono text-content-secondary">SEO Slug *</label>
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
                <label className="text-xs font-mono text-content-secondary">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
                >
                  <option value="draft">Draft (Internal)</option>
                  <option value="published">Published (Public)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-content-secondary">Featured Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary">Excerpt (Short summary) *</label>
              <textarea
                rows={2}
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono focus:border-accent-primary font-sans"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
              Tags Association
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const isChecked = formData.tagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-md text-xs font-mono border transition-colors ${
                      isChecked
                        ? "bg-accent-primary text-bg-primary border-accent-primary font-bold"
                        : "bg-[#12251A] text-content-secondary border-[#243A2C] hover:text-[#F0FDF4]"
                    }`}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
                Article Body Content (Markdown / HTML) *
              </h3>
              <span className="text-[10px] font-mono text-content-muted">
                Sanitized automatically with DOMPurify on render
              </span>
            </div>

            <textarea
              rows={14}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg p-4 text-xs sm:text-sm text-[#F0FDF4] font-mono focus:border-accent-primary leading-relaxed resize-y"
              placeholder="Write your article in Markdown or HTML..."
            />
          </div>

          {/* SEO Meta */}
          <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
              Search Engine Optimization (SEO)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-content-secondary">Meta Title</label>
                <input
                  type="text"
                  placeholder="Custom SEO Title"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-content-secondary">Meta Description</label>
                <input
                  type="text"
                  placeholder="Custom Meta Description"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-xs text-[#F0FDF4] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#20382B]">
            <Link
              to="/admin/blog"
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
              <span>{saveMutation.isPending ? "Saving..." : "Save Article"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
