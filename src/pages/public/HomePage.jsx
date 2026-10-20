import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import { siteConfig } from "../../config/site";
import { GithubIcon } from "../../components/ui/SocialIcons";
import {
  ArrowRight,
  Mail,
  ExternalLink,
  Code2,
  Cpu,
  ShieldCheck,
} from "lucide-react";

export function HomePage() {
  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/api/profile"),
    staleTime: 5 * 60 * 1000,
  });

  const { data: featuredProjects } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: () => api.get("/api/projects?featured=true&limit=4"),
    staleTime: 5 * 60 * 1000,
  });

  const { data: skillsData } = useQuery({
    queryKey: ["skills"],
    queryFn: () => api.get("/api/skills"),
    staleTime: 5 * 60 * 1000,
  });

  const profile = profileData?.data || siteConfig.developer;
  const projects = featuredProjects?.data || [];
  const topSkills = (skillsData?.data || []).filter((s) => s.isFeatured === 1).slice(0, 8);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 pb-12 overflow-hidden">
        {/* Subtle radial ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#102019] border border-[#20382B] mb-6 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
              <span className="text-xs font-mono text-accent-secondary">
                {profile.availabilityStatus || "Available for Opportunities"}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F0FDF4] leading-[1.1] mb-6">
              Engineering reliable, secure, and performant{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-emerald-400 to-accent-hover">
                full-stack web systems.
              </span>
            </h1>

            {/* Short Bio */}
            <p className="text-base sm:text-lg text-content-secondary leading-relaxed mb-8 max-w-2xl">
              {profile.bioShort || siteConfig.developer.bioShort}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-sm transition-all shadow-glow-sm hover:scale-[1.02]"
              >
                <span>Explore Projects</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#20382B] bg-[#102019] hover:border-accent-primary/50 text-[#F0FDF4] font-medium text-sm transition-all"
              >
                <span>Get in Touch</span>
                <Mail size={16} className="text-content-muted" />
              </Link>
            </div>

            {/* Socials & Location */}
            <div className="flex items-center gap-6 pt-6 border-t border-[#20382B]/60 text-xs font-mono text-content-muted">
              <div className="flex items-center gap-2">
                <span className="text-accent-secondary">Location:</span>
                <span className="text-content-secondary">{profile.location || "Cilacap, Indonesia"}</span>
              </div>
              <div className="flex items-center gap-3">
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent-primary transition-colors"
                  >
                    GitHub
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent-primary transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE TECHNICAL STACK STRIP */}
      {topSkills.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] shadow-lg">
            <div className="flex items-center gap-2 mb-4 text-xs font-mono text-accent-secondary uppercase tracking-wider font-semibold">
              <Cpu size={14} />
              <span>Core Technologies & Tooling</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {topSkills.map((sk) => (
                <span
                  key={sk.id}
                  className="px-3 py-1.5 rounded-lg bg-[#12251A] border border-[#243A2C] text-xs font-mono text-content-primary flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                  {sk.name}
                </span>
              ))}
              <Link
                to="/skills"
                className="px-3 py-1.5 rounded-lg border border-dashed border-[#243A2C] text-xs font-mono text-content-muted hover:text-accent-primary hover:border-accent-primary transition-colors"
              >
                + View all skills
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED PROJECTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent-secondary uppercase tracking-wider mb-2 font-semibold">
              <Code2 size={14} />
              <span>Portfolio Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F0FDF4]">
              Featured Engineering Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-primary hover:text-accent-hover transition-colors font-semibold"
          >
            <span>View All Projects</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="flex flex-col justify-between rounded-xl bg-[#0D1B14] border border-[#20382B] overflow-hidden hover:border-accent-primary/40 transition-all hover:shadow-glow-sm group"
            >
              {/* Thumbnail Header */}
              {proj.thumbnailUrl && (
                <div className="relative h-48 overflow-hidden bg-[#102019]">
                  <img
                    src={proj.thumbnailUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B14] via-transparent to-transparent opacity-80" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#07110D]/90 border border-[#20382B] text-[11px] font-mono text-accent-secondary">
                    {proj.category?.name || "Full-Stack"}
                  </span>
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#F0FDF4] group-hover:text-accent-primary transition-colors mb-2">
                    <Link to={`/projects/${proj.slug}`}>{proj.title}</Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-content-secondary line-clamp-2 leading-relaxed mb-4">
                    {proj.summary}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.techStack?.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#12251A] text-content-secondary border border-[#243A2C]"
                      >
                        {tech}
                      </span>
                    ))}
                    {proj.techStack?.length > 4 && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono text-content-muted">
                        +{proj.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-[#20382B]/60 text-xs font-mono">
                  <Link
                    to={`/projects/${proj.slug}`}
                    className="text-accent-primary hover:text-accent-hover font-semibold inline-flex items-center gap-1"
                  >
                    <span>View Architecture</span>
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
      </section>

      {/* 4. ENGINEERING PHILOSOPHY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-accent-secondary uppercase tracking-wider mb-2 font-semibold">
            <ShieldCheck size={14} />
            <span>Development Principles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F0FDF4] mb-3">
            Mindset & Standards
          </h2>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
            Prioritizing architectural clarity, defensive security, and long-term maintainability over transient buzzwords.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteConfig.philosophy.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-accent-primary/15 text-accent-primary border border-accent-primary/30 inline-block mb-3">
                  {item.badge}
                </span>
                <h3 className="text-base font-bold text-[#F0FDF4] mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CONTACT CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-[#0D1B14] to-[#07110D] border border-accent-primary/30 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F0FDF4] mb-3">
              Ready to engineer your next web project?
            </h2>
            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
              Whether you are hiring for full-stack engineering roles or need consulting on system architecture, my inbox is open.
            </p>
          </div>

          <Link
            to="/contact"
            className="px-6 py-3 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-sm transition-all shadow-glow-md shrink-0 flex items-center gap-2"
          >
            <span>Start a Conversation</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
