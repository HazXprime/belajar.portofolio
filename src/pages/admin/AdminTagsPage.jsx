import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Hash, Plus, X } from "lucide-react";

export function AdminTagsPage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [tagName, setTagName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-tags"],
    queryFn: () => api.get("/api/admin/tags"),
  });

  const createMutation = useMutation({
    mutationFn: (name) => api.post("/api/admin/tags", { name }),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-tags"]);
      queryClient.invalidateQueries(["tags"]);
      showSuccess("Tag added successfully.");
      setTagName("");
      setIsModalOpen(false);
    },
    onError: (err) => showError(err.message || "Failed to create tag."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/tags/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-tags"]);
      queryClient.invalidateQueries(["tags"]);
      showSuccess("Tag deleted.");
    },
    onError: (err) => showError(err.message || "Failed to delete tag."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tagName.trim()) {
      showError("Tag name is required.");
      return;
    }
    createMutation.mutate(tagName.trim());
  };

  const tags = res?.data || [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20382B] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0FDF4] mb-1">Tags Management</h1>
          <p className="text-xs text-content-secondary font-mono">
            Create and maintain topic tags for blog articles and project categorizations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs font-mono transition-colors shadow-glow-sm"
        >
          <Plus size={15} />
          <span>Add Tag</span>
        </button>
      </div>

      {isLoading ? (
        <div className="h-48 rounded-xl bg-[#0D1B14] border border-[#20382B] animate-pulse" />
      ) : tags.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0D1B14] border border-[#20382B]">
          <Hash size={32} className="mx-auto text-content-muted mb-2" />
          <h3 className="text-sm font-bold text-[#F0FDF4]">No tags recorded yet</h3>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B]">
          <div className="flex flex-wrap gap-2.5">
            {tags.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12251A] border border-[#243A2C] text-xs font-mono text-[#F0FDF4] group hover:border-accent-primary/40 transition-colors"
              >
                <span>#{t.name}</span>
                <span className="text-[10px] text-content-muted font-normal">({t.slug})</span>
                <button
                  onClick={() => {
                    if (confirm(`Delete tag '#${t.name}'?`)) {
                      deleteMutation.mutate(t.id);
                    }
                  }}
                  className="text-content-muted hover:text-red-400 p-0.5 ml-1 transition-colors"
                  title="Delete tag"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full p-6 rounded-2xl bg-[#0D1B14] border border-[#20382B] space-y-4">
            <div className="flex items-center justify-between border-b border-[#20382B] pb-3">
              <h3 className="text-base font-bold text-[#F0FDF4]">Add New Tag</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-content-muted hover:text-[#F0FDF4]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-content-secondary block">Tag Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, GraphQL, Redis"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#20382B]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#20382B] text-content-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 rounded-lg bg-accent-primary text-bg-primary font-bold shadow-glow-sm"
                >
                  {createMutation.isPending ? "Adding..." : "Add Tag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
