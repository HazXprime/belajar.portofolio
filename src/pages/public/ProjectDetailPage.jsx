import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import { GithubIcon } from "../../components/ui/SocialIcons";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Layers,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

export function ProjectDetailPage() {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: res, isLoading, isError } = useQuery({
    queryKey: ["project-detail", slug],
    queryFn: () => api.get(`/api/projects/${slug}`),
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-[#102019] rounded" />
        <div className="h-10 w-3/4 bg-[#102019] rounded" />
        <div className="h-80 w-full bg-[#102019] rounded-xl" />
      </div>
    );
  }

  if (isError || !res?.data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#F0FDF4]">Project Not Found</h2>
        <p className="text-xs text-content-secondary">
          The requested project might have been moved or is currently in draft status.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-primary text-bg-primary font-semibold text-xs"
        >
          <ArrowLeft size={14} />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  const project = res.data;
  const images = project.images || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-content-muted hover:text-accent-primary transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to all projects</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-4 border-b border-[#20382B] pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2.5 py-1 rounded bg-[#102019] border border-[#20382B] text-xs font-mono text-accent-secondary">
            {project.category?.name || "Full-Stack"}
          </span>
          {project.publishedAt && (
            <span className="flex items-center gap-1.5 text-xs font-mono text-content-muted">
              <Calendar size={13} />
              <span>Published {project.publishedAt.split("T")[0]}</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F0FDF4] tracking-tight">
          {project.title}
        </h1>

        <p className="text-base text-content-secondary leading-relaxed max-w-3xl">
          {project.description}
        </p>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs transition-all shadow-glow-sm"
            >
              <span>Launch Live Application</span>
              <ExternalLink size={14} />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#20382B] bg-[#102019] hover:border-accent-primary text-[#F0FDF4] text-xs font-mono transition-colors"
            >
              <GithubIcon size={14} />
              <span>Source Code</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Thumbnail Showcase */}
      {project.thumbnailUrl && (
        <div className="rounded-2xl overflow-hidden border border-[#20382B] bg-[#0D1B14] shadow-card-dark max-h-[500px]">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Tech Stack Matrix */}
      {project.techStack?.length > 0 && (
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B]">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold mb-3 flex items-center gap-2">
            <Layers size={14} />
            <span>Technologies & Frameworks Utilized</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-[#12251A] border border-[#243A2C] text-xs font-mono text-[#F0FDF4]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Features & Architectural Highlights */}
      {project.features?.length > 0 && (
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B]">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold mb-4">
            Key Engineering Features & Capabilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-[#12251A] border border-[#243A2C]"
              >
                <CheckCircle2 size={16} className="text-accent-primary shrink-0 mt-0.5" />
                <span className="text-xs text-content-secondary leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Architectural Content */}
      {project.content && (
        <div className="p-8 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4 prose prose-invert max-w-none">
          <h3 className="text-lg font-bold text-[#F0FDF4] border-b border-[#20382B] pb-3">
            System Design & Architecture Deep Dive
          </h3>
          <div className="text-xs sm:text-sm text-content-secondary leading-relaxed whitespace-pre-line font-sans">
            {project.content}
          </div>
        </div>
      )}

      {/* Gallery Images (if any) */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold flex items-center gap-2">
            <ImageIcon size={14} />
            <span>Project Interface Gallery</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className="rounded-xl overflow-hidden border border-[#20382B] bg-[#102019] cursor-pointer hover:border-accent-primary transition-all aspect-video group"
              >
                <img
                  src={img.url}
                  alt={img.caption || project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border border-[#20382B]">
            <img src={selectedImage} alt="Expanded gallery view" className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
