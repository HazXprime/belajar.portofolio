import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import {
  FolderGit2,
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-projects-list", status, search, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (status !== "all") params.append("status", status);
      if (search.trim()) params.append("search", search.trim());
      params.append("page", page);
      params.append("limit", 15);
      return api.get(`/api/admin/projects?${params.toString()}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-projects-list"]);
      queryClient.invalidateQueries(["projects"]);
      showSuccess("Project deleted successfully.");
      setDeleteConfirmId(null);
    },
    onError: (err) => {
      showError(err.message || "Failed to delete project.");
    },
  });

  const projects = res?.data || [];
  const pagination = res?.pagination || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20382B] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0FDF4] mb-1">Projects Management</h1>
          <p className="text-xs text-content-secondary font-mono">
            Create, edit, sort, and publish portfolio project showcases.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs font-mono transition-colors shadow-glow-sm"
        >
          <Plus size={15} />
          <span>Add New Project</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0D1B14] border border-[#20382B]">
        <div className="flex items-center gap-2">
          {["all", "published", "draft"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatus(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-colors ${
                status === st
                  ? "bg-accent-primary text-bg-primary font-bold"
                  : "bg-[#12251A] text-content-secondary hover:text-[#F0FDF4] border border-[#243A2C]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F0FDF4] placeholder:text-content-muted focus:border-accent-primary font-mono"
          />
        </div>
      </div>

      {/* Projects Table */}
      {isLoading ? (
        <div className="h-64 rounded-xl bg-[#0D1B14] border border-[#20382B] animate-pulse" />
      ) : projects.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0D1B14] border border-[#20382B]">
          <FolderGit2 size={32} className="mx-auto text-content-muted mb-2" />
          <h3 className="text-sm font-bold text-[#F0FDF4]">No projects found</h3>
          <p className="text-xs text-content-secondary mt-1">
            Click &quot;Add New Project&quot; to create your first portfolio project.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-[#0D1B14] border border-[#20382B] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#20382B] text-content-muted font-mono uppercase tracking-wider text-[11px] bg-[#07110D]/40">
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20382B]/60 font-mono">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-[#12251A]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-sans font-bold text-[#F0FDF4] text-sm">{p.title}</div>
                    <div className="text-[11px] text-content-muted font-mono">/{p.slug}</div>
                  </td>
                  <td className="py-3.5 px-4 text-content-secondary">
                    {p.category?.name || "Uncategorized"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        p.status === "published"
                          ? "bg-accent-primary/10 text-accent-primary border-accent-primary/20"
                          : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {p.featured === 1 ? (
                      <span className="text-accent-primary font-bold">Yes</span>
                    ) : (
                      <span className="text-content-muted">No</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-content-muted">{p.sortOrder}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      to={`/admin/projects/${p.id}/edit`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#12251A] border border-[#243A2C] text-content-secondary hover:text-accent-primary hover:border-accent-primary transition-colors"
                      title="Edit project"
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </Link>

                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#20382B] text-xs font-mono">
          <span className="text-content-muted">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} Total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 rounded-lg border border-[#20382B] bg-[#0D1B14] disabled:opacity-40 hover:border-accent-primary transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 rounded-lg border border-[#20382B] bg-[#0D1B14] disabled:opacity-40 hover:border-accent-primary transition-colors flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0D1B14] border border-red-500/40 space-y-4">
            <h3 className="text-base font-bold text-[#F0FDF4]">Confirm Project Deletion</h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Are you sure you want to permanently delete this project? This will remove its gallery images and database records. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg border border-[#20382B] bg-[#12251A] text-xs font-mono text-content-secondary hover:text-[#F0FDF4]"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs font-mono transition-colors"
              >
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
