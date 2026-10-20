import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import { BookOpen, Search, Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export function BlogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data: catRes } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => api.get("/api/categories?type=blog"),
  });

  const { data: blogRes, isLoading } = useQuery({
    queryKey: ["blog-list", selectedCategory, search, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (search.trim()) params.append("search", search.trim());
      params.append("page", page);
      params.append("limit", limit);
      return api.get(`/api/blog?${params.toString()}`);
    },
    keepPreviousData: true,
  });

  const categories = catRes?.data || [];
  const posts = blogRes?.data || [];
  const pagination = blogRes?.pagination || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-accent-secondary uppercase tracking-wider font-semibold">
          <BookOpen size={14} />
          <span>Technical Journal & Insights</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F0FDF4] tracking-tight">
          Engineering Articles
        </h1>
        <p className="text-sm sm:text-base text-content-secondary leading-relaxed">
          Deep dives into software architecture, edge database scaling, security hardening, and modern full-stack workflows.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#0D1B14] border border-[#20382B]">
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
            All Articles
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

        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F0FDF4] placeholder:text-content-muted focus:outline-none focus:border-accent-primary font-mono"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 rounded-xl bg-[#0D1B14] border border-[#20382B]" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-xl bg-[#0D1B14] border border-[#20382B]">
          <BookOpen size={36} className="mx-auto text-content-muted mb-3" />
          <h3 className="text-base font-bold text-[#F0FDF4] mb-1">No articles found</h3>
          <p className="text-xs text-content-secondary">
            Check back soon for new articles or try adjusting your search filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col justify-between rounded-xl bg-[#0D1B14] border border-[#20382B] overflow-hidden hover:border-accent-primary/40 transition-all hover:shadow-glow-sm group"
            >
              {post.featuredImage && (
                <div className="relative h-44 overflow-hidden bg-[#102019]">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B14] via-transparent to-transparent opacity-80" />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#07110D]/90 border border-[#20382B] text-[10px] font-mono text-accent-secondary">
                    {post.category?.name || "Architecture"}
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-content-muted mb-2">
                    <Calendar size={12} />
                    <span>{post.publishedAt ? post.publishedAt.split("T")[0] : "Recent"}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#F0FDF4] group-hover:text-accent-primary transition-colors mb-3 leading-snug">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs text-content-secondary line-clamp-3 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#20382B]/60 flex items-center justify-between text-xs font-mono">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-accent-primary hover:text-accent-hover font-semibold inline-flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-[#20382B] text-xs font-mono">
          <span className="text-content-muted">
            Page {pagination.page} of {pagination.totalPages}
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
