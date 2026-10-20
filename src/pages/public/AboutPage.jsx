import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import { siteConfig } from "../../config/site";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  ExternalLink,
} from "lucide-react";

export function AboutPage() {
  const { data: profileRes } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/api/profile"),
  });

  const { data: expRes } = useQuery({
    queryKey: ["experiences"],
    queryFn: () => api.get("/api/experiences"),
  });

  const { data: eduRes } = useQuery({
    queryKey: ["educations"],
    queryFn: () => api.get("/api/educations"),
  });

  const profile = profileRes?.data || siteConfig.developer;
  const paragraphs = profile.aboutParagraphs?.length > 0 ? profile.aboutParagraphs : siteConfig.about.paragraphs;
  const highlights = profile.highlights?.length > 0 ? profile.highlights : siteConfig.about.highlights;
  const experiences = expRes?.data || [];
  const educations = eduRes?.data?.educations || [];
  const certifications = eduRes?.data?.certifications || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* 1. HEADER & INTRO */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Avatar & Bio */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-accent-secondary uppercase tracking-wider font-semibold">
            <User size={14} />
            <span>Developer Profile</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F0FDF4] tracking-tight">
            About {profile.name}
          </h1>

          <p className="text-lg text-accent-primary font-medium leading-relaxed">
            {profile.aboutLead || siteConfig.about.lead}
          </p>

          <div className="space-y-4 text-sm text-content-secondary leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* Right: Highlights Box & Photo */}
        <div className="lg:col-span-5 space-y-6">
          {profile.avatarUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-[#20382B] shadow-card-dark bg-[#0D1B14] max-w-sm mx-auto">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-80 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07110D] via-transparent to-transparent opacity-60" />
            </div>
          )}

          <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
              Specialization Highlights
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {highlights.map((h, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#12251A] border border-[#243A2C]">
                  <span className="text-xs font-mono text-content-muted block">{h.label}</span>
                  <span className="text-sm font-semibold text-[#F0FDF4]">{h.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. WORK EXPERIENCE TIMELINE */}
      <section className="space-y-8">
        <div className="border-b border-[#20382B] pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-accent-secondary uppercase tracking-wider mb-1 font-semibold">
            <Briefcase size={14} />
            <span>Career History</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F0FDF4]">Professional Experience</h2>
        </div>

        <div className="relative border-l border-[#20382B] ml-4 sm:ml-6 pl-6 space-y-10">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Dot on timeline */}
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-accent-primary border-4 border-[#07110D] group-hover:scale-125 transition-transform" />

              <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] group-hover:border-accent-primary/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#F0FDF4]">{exp.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-accent-secondary">
                    <Calendar size={13} />
                    <span>
                      {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-content-muted mb-4">
                  <span className="text-content-secondary font-semibold">{exp.company}</span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {exp.location}
                    </span>
                  )}
                  {exp.employmentType && (
                    <span className="px-2 py-0.5 rounded bg-[#12251A] border border-[#243A2C]">
                      {exp.employmentType}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-content-secondary leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}

          {experiences.length === 0 && (
            <p className="text-xs font-mono text-content-muted">No experience entries recorded yet.</p>
          )}
        </div>
      </section>

      {/* 3. EDUCATION & CERTIFICATIONS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Education */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-accent-secondary uppercase tracking-wider font-semibold border-b border-[#20382B] pb-3">
            <GraduationCap size={16} />
            <span>Formal Education</span>
          </div>

          <div className="space-y-4">
            {educations.map((edu) => (
              <div key={edu.id} className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B]">
                <h3 className="text-base font-bold text-[#F0FDF4] mb-1">{edu.degree}</h3>
                <div className="text-xs font-mono text-content-secondary mb-2">{edu.institution}</div>
                <div className="flex items-center gap-3 text-xs font-mono text-content-muted mb-3">
                  <span>{edu.startDate} — {edu.isCurrent ? "Present" : edu.endDate}</span>
                  {edu.gradeOrHonors && (
                    <span className="text-accent-secondary font-semibold">{edu.gradeOrHonors}</span>
                  )}
                </div>
                {edu.description && (
                  <p className="text-xs text-content-secondary leading-relaxed">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-accent-secondary uppercase tracking-wider font-semibold border-b border-[#20382B] pb-3">
            <Award size={16} />
            <span>Verified Certifications</span>
          </div>

          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B]">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-base font-bold text-[#F0FDF4]">{cert.name}</h3>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-content-muted hover:text-accent-primary transition-colors"
                      title="Verify credential"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                <div className="text-xs font-mono text-content-secondary mb-2">
                  {cert.issuingOrganization}
                </div>
                <div className="text-xs font-mono text-content-muted">
                  Issued: {cert.issueDate}
                  {cert.credentialId && ` • ID: ${cert.credentialId}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
