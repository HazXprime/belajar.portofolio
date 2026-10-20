import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import DOMPurify from "dompurify";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
} from "lucide-react";

export function BlogPostDetailPage() {
  const { slug } = useParams();

  const { data: res, isLoading, isError } = useQuery({
    queryKey: ["blog-detail", slug],
    queryFn: () => api.get(`/api/blog/${slug}`),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-[#102019] rounded" />
        <div className="h-10 w-3/4 bg-[#102019] rounded" />
        <div className="h-96 w-full bg-[#102019] rounded-xl" />
      </div>
    );
  }

  if (isError || !res?.data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#F0FDF4]">Article Not Found</h2>
        <p className="text-xs text-content-secondary">
          The requested article may have been unpublished or removed.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-primary text-bg-primary font-semibold text-xs"
        >
          <ArrowLeft size={14} />
          <span>Back to Articles</span>
        </Link>
      </div>
    );
  }

  const post = res.data;
  const tags = post.tags || [];

  // Calculate approximate read time (200 words per minute)
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Sanitize content with DOMPurify
  const sanitizedContent = DOMPurify.sanitize(post.content || "");

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-content-muted hover:text-accent-primary transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to all articles</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4 border-b border-[#20382B] pb-8">
        <div className="flex flex-wrap items-center gap-3">
          {post.category && (
            <span className="px-2.5 py-1 rounded bg-[#102019] border border-[#20382B] text-xs font-mono text-accent-secondary">
              {post.category.name}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-xs font-mono text-content-muted">
            <Calendar size={13} />
            <span>{post.publishedAt ? post.publishedAt.split("T")[0] : "Recent"}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs font-mono text-content-muted">
            <Clock size={13} />
            <span>{readTime} min read</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F0FDF4] tracking-tight leading-[1.15]">
          {post.title}
        </h1>

        <p className="text-base text-content-secondary leading-relaxed font-sans">
          {post.excerpt}
        </p>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="rounded-2xl overflow-hidden border border-[#20382B] bg-[#0D1B14] shadow-card-dark max-h-[480px]">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Render Sanitized Content */}
      <div className="p-8 rounded-xl bg-[#0D1B14] border border-[#20382B]">
        <div
          className="prose prose-invert max-w-none text-content-secondary text-sm sm:text-base leading-relaxed space-y-4 font-sans whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>

      {/* Tags & Footer Metadata */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#20382B]">
          <span className="text-xs font-mono text-content-muted flex items-center gap-1.5 mr-2">
            <Tag size={13} />
            <span>Tags:</span>
          </span>
          {tags.map((t) => (
            <span
              key={t.id}
              className="px-2.5 py-1 rounded-md bg-[#102019] border border-[#20382B] text-xs font-mono text-content-secondary"
            >
              #{t.name}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
