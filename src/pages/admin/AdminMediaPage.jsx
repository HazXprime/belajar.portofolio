import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  Trash2,
} from "lucide-react";

export function AdminMediaPage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [selectedFile, setSelectedFile] = useState(null);
  const [folder, setFolder] = useState("portfolio/media");
  const [altText, setAltText] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: () => api.get("/api/admin/media"),
  });

  const uploadMutation = useMutation({
    mutationFn: (formData) => api.post("/api/admin/media/upload", formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-media"]);
      showSuccess("Asset uploaded to Cloudinary successfully!");
      setSelectedFile(null);
      setAltText("");
    },
    onError: (err) => showError(err.message || "Failed to upload asset."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-media"]);
      showSuccess("Media asset removed.");
    },
    onError: (err) => showError(err.message || "Failed to delete media asset."),
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showError("Please choose a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folder", folder);
    if (altText.trim()) {
      formData.append("altText", altText.trim());
    }

    uploadMutation.mutate(formData);
  };

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showSuccess("Asset URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const assets = res?.data || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20382B] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0FDF4] mb-1">Media Assets & Cloudinary</h1>
          <p className="text-xs text-content-secondary font-mono">
            Secure asset repository with automatic Cloudinary responsive delivery and CDN caching.
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold flex items-center gap-2">
          <Upload size={14} />
          <span>Upload Asset to Cloudinary</span>
        </h3>

        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-1">
              <label className="text-content-secondary block">Select File (Max 5MB)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg p-2 text-content-secondary file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-accent-primary file:text-bg-primary file:font-bold file:text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-content-secondary block">Cloudinary Folder</label>
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
              >
                <option value="portfolio/projects">portfolio/projects</option>
                <option value="portfolio/blog">portfolio/blog</option>
                <option value="portfolio/profile">portfolio/profile</option>
                <option value="portfolio/media">portfolio/media</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-content-secondary block">Alt Text (Optional)</label>
              <input
                type="text"
                placeholder="Description of image"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploadMutation.isPending || !selectedFile}
              className="px-5 py-2 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-bold shadow-glow-sm disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <Upload size={14} />
              <span>{uploadMutation.isPending ? "Uploading to Cloudinary..." : "Upload Asset"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Media Assets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-[#0D1B14] border border-[#20382B]" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0D1B14] border border-[#20382B]">
          <ImageIcon size={32} className="mx-auto text-content-muted mb-2" />
          <h3 className="text-sm font-bold text-[#F0FDF4]">No media assets uploaded</h3>
          <p className="text-xs text-content-secondary mt-1">
            Upload images to store them in your authenticated Cloudinary media library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-xl bg-[#0D1B14] border border-[#20382B] overflow-hidden flex flex-col justify-between group hover:border-accent-primary/40 transition-colors"
            >
              <div className="relative h-40 bg-[#102019] overflow-hidden">
                <img
                  src={asset.secureUrl}
                  alt={asset.altText || asset.publicId}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#07110D]/90 border border-[#20382B] text-[10px] font-mono text-accent-secondary uppercase">
                  {asset.format || "img"}
                </span>
              </div>

              <div className="p-3.5 space-y-2">
                <div className="text-[11px] font-mono text-[#F0FDF4] truncate" title={asset.publicId}>
                  {asset.publicId}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-content-muted">
                  <span>{asset.bytes ? `${(asset.bytes / 1024).toFixed(1)} KB` : "Asset"}</span>
                  <span>{asset.folder}</span>
                </div>

                <div className="pt-2 border-t border-[#20382B] flex items-center justify-between">
                  <button
                    onClick={() => copyToClipboard(asset.secureUrl, asset.id)}
                    className="flex items-center gap-1 text-[11px] font-mono text-accent-primary hover:text-accent-hover transition-colors"
                    title="Copy Image URL"
                  >
                    {copiedId === asset.id ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedId === asset.id ? "Copied" : "Copy URL"}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete media asset '${asset.publicId}'?`)) {
                        deleteMutation.mutate(asset.id);
                      }
                    }}
                    className="text-content-muted hover:text-red-400 p-1"
                    title="Delete media asset"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
