import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Tags, Plus, Edit2, Trash2, X } from "lucide-react";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [filterType, setFilterType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    type: "project",
  });

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => api.get("/api/admin/categories"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editingCategory
        ? api.put(`/api/admin/categories/${editingCategory.id}`, data)
        : api.post("/api/admin/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-categories"]);
      queryClient.invalidateQueries(["categories"]);
      showSuccess(editingCategory ? "Category updated." : "Category created.");
      closeModal();
    },
    onError: (err) => showError(err.message || "Failed to save category."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-categories"]);
      queryClient.invalidateQueries(["categories"]);
      showSuccess("Category deleted.");
    },
    onError: (err) => showError(err.message || "Failed to delete category."),
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "", type: "project" });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      type: cat.type,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      showError("Category name required.");
      return;
    }
    saveMutation.mutate(formData);
  };

  const categories = (res?.data || []).filter(
    (c) => filterType === "all" || c.type === filterType
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20382B] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0FDF4] mb-1">Categories Management</h1>
          <p className="text-xs text-content-secondary font-mono">
            Manage classification taxonomy for projects and engineering blog articles.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs font-mono transition-colors shadow-glow-sm"
        >
          <Plus size={15} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0D1B14] border border-[#20382B] w-fit">
        {["all", "project", "blog"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-colors ${
              filterType === t
                ? "bg-accent-primary text-bg-primary font-bold shadow-glow-sm"
                : "text-content-secondary hover:text-[#F0FDF4]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="h-64 rounded-xl bg-[#0D1B14] border border-[#20382B] animate-pulse" />
      ) : categories.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0D1B14] border border-[#20382B]">
          <Tags size={32} className="mx-auto text-content-muted mb-2" />
          <h3 className="text-sm font-bold text-[#F0FDF4]">No categories found</h3>
        </div>
      ) : (
        <div className="rounded-xl bg-[#0D1B14] border border-[#20382B] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#20382B] text-content-muted font-mono uppercase tracking-wider text-[11px] bg-[#07110D]/40">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Domain Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20382B]/60 font-mono">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#12251A]/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#F0FDF4]">{cat.name}</td>
                  <td className="py-3 px-4 text-content-muted">/{cat.slug}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#12251A] text-accent-secondary border border-[#243A2C]">
                      {cat.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-content-secondary truncate max-w-xs font-sans">
                    {cat.description || "—"}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1 text-content-secondary hover:text-accent-primary"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category '${cat.name}'?`)) {
                          deleteMutation.mutate(cat.id);
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
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button onClick={closeModal} className="text-content-muted hover:text-[#F0FDF4]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-content-secondary block">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: editingCategory ? formData.slug : slugify(e.target.value),
                    })
                  }
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-content-secondary block">URL Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-content-secondary block">Category Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
                >
                  <option value="project">Project Category</option>
                  <option value="blog">Blog Category</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-content-secondary block">Description</label>
                <textarea
                  rows={2}
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
