import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import { GithubIcon } from "../../components/ui/SocialIcons";
import {
  FolderGit2,
  Search,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Categories
  const { data: catRes } = useQuery({
    queryKey: ["project-categories"],
    queryFn: () => api.get("/api/categories?type=project"),
  });

  // Projects list
  const { data: projectsRes, isLoading } = useQuery({
    queryKey: ["projects-list", selectedCategory, search, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (search.trim()) params.append("search", search.trim());
      params.append("page", page);
      params.append("limit", limit);
      return api.get(`/api/projects?${params.toString()}`);
    },
    keepPreviousData: true,
  });

  const categories = catRes?.data || [];
  const projects = projectsRes?.data || [];
  const pagination = projectsRes?.pagination || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-accent-secondary uppercase tracking-wider font-semibold">
          <FolderGit2 size={14} />
          <span>Full-Stack & Frontend Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F0FDF4] tracking-tight">
          Engineering Projects
        </h1>
        <p className="text-sm sm:text-base text-content-secondary leading-relaxed">
          Explore complete production-grade applications, database architectures, and developer tooling.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#0D1B14] border border-[#20382B]">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              selectedCategory === "all"
                ? "bg-accent-primary text-bg-primary font-bold shadow-glow-sm"
                : "bg-[#12251A] text-content-secondary hover:text-[#F0FDF4] border border-[#243A2C]"
            }`}
          >
            All Projects
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.slug);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-accent-primary text-bg-primary font-bold shadow-glow-sm"
                  : "bg-[#12251A] text-content-secondary hover:text-[#F0FDF4] border border-[#243A2C]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F0FDF4] placeholder:text-content-muted focus:outline-none focus:border-accent-primary font-mono"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-xl bg-[#0D1B14] border border-[#20382B] animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-xl bg-[#0D1B14] border border-[#20382B]">
          <FolderGit2 size={36} className="mx-auto text-content-muted mb-3" />
          <h3 className="text-base font-bold text-[#F0FDF4] mb-1">No projects matched your query</h3>
          <p className="text-xs text-content-secondary">
            Try adjusting your search terms or selecting a different category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="flex flex-col justify-between rounded-xl bg-[#0D1B14] border border-[#20382B] overflow-hidden hover:border-accent-primary/40 transition-all hover:shadow-glow-sm group"
            >
              {/* Thumbnail */}
              {proj.thumbnailUrl ? (
                <div className="relative h-44 overflow-hidden bg-[#102019]">
                  <img
                    src={proj.thumbnailUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B14] via-transparent to-transparent opacity-80" />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#07110D]/90 border border-[#20382B] text-[10px] font-mono text-accent-secondary">
                    {proj.category?.name || "Project"}
                  </span>
                </div>
              ) : (
                <div className="h-28 bg-[#102019] border-b border-[#20382B] flex items-center justify-center text-content-muted font-mono text-xs">
                  {proj.category?.name || "Full-Stack"}
                </div>
              )}

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#F0FDF4] group-hover:text-accent-primary transition-colors mb-2">
                    <Link to={`/projects/${proj.slug}`}>{proj.title}</Link>
                  </h3>
                  <p className="text-xs text-content-secondary line-clamp-3 leading-relaxed mb-4">
                    {proj.summary}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.techStack?.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#12251A] text-content-secondary border border-[#243A2C]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-[#20382B]/60 text-xs font-mono">
                  <Link
                    to={`/projects/${proj.slug}`}
                    className="text-accent-primary hover:text-accent-hover font-semibold inline-flex items-center gap-1"
                  >
                    <span>View Detail</span>
                    <ArrowRight size={13} />
                  </Link>

                  <div className="flex items-center gap-3">
                    {proj.repoUrl && (
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-content-muted hover:text-[#F0FDF4] transition-colors"
                        title="Repository"
                      >
                        <GithubIcon size={15} />
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-content-muted hover:text-accent-primary transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-[#20382B] text-xs font-mono">
          <span className="text-content-muted">
            Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} Total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 rounded-lg border border-[#20382B] bg-[#0D1B14] disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent-primary transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 rounded-lg border border-[#20382B] bg-[#0D1B14] disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent-primary transition-colors flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
