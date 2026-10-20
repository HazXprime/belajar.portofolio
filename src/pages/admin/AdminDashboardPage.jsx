import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import {
  FolderGit2,
  BookOpen,
  Inbox,
  Cpu,
  Plus,
  ArrowRight,
  Activity,
} from "lucide-react";

export function AdminDashboardPage() {
  const { data: dashboardRes, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get("/api/admin/dashboard"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 rounded-2xl bg-[#0D1B14] border border-[#20382B]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-[#0D1B14] border border-[#20382B]" />
          ))}
        </div>
      </div>
    );
  }

  const stats = dashboardRes?.stats || {
    totalProjects: 0,
    draftProjects: 0,
    totalArticles: 0,
    draftArticles: 0,
    unreadMessages: 0,
    totalSkills: 0,
  };

  const recentLogs = dashboardRes?.recentLogs || [];
  const recentMessages = dashboardRes?.recentMessages || [];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0D1B14] border border-[#20382B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F0FDF4] mb-1">
            System Overview & CMS Dashboard
          </h1>
          <p className="text-xs text-content-secondary font-mono">
            Turso database connected • Production-ready CMS active
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs font-mono transition-colors shadow-glow-sm"
          >
            <Plus size={14} />
            <span>New Project</span>
          </Link>
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#20382B] bg-[#12251A] hover:border-accent-primary text-xs font-mono text-[#F0FDF4] transition-colors"
          >
            <Plus size={14} />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects */}
        <div className="p-5 rounded-xl bg-[#0D1B14] border border-[#20382B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-content-muted mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Projects</span>
            <FolderGit2 size={18} className="text-accent-primary" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#F0FDF4] mb-1">
              {stats.totalProjects}
            </div>
            <span className="text-xs font-mono text-content-muted">
              {stats.draftProjects} Draft • {stats.totalProjects - stats.draftProjects} Published
            </span>
          </div>
          <Link
            to="/admin/projects"
            className="mt-4 pt-3 border-t border-[#20382B] text-xs font-mono text-accent-primary hover:text-accent-hover inline-flex items-center gap-1"
          >
            <span>Manage Projects</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Blog Posts */}
        <div className="p-5 rounded-xl bg-[#0D1B14] border border-[#20382B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-content-muted mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Blog Articles</span>
            <BookOpen size={18} className="text-accent-secondary" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#F0FDF4] mb-1">
              {stats.totalArticles}
            </div>
            <span className="text-xs font-mono text-content-muted">
              {stats.draftArticles} Draft • {stats.totalArticles - stats.draftArticles} Published
            </span>
          </div>
          <Link
            to="/admin/blog"
            className="mt-4 pt-3 border-t border-[#20382B] text-xs font-mono text-accent-primary hover:text-accent-hover inline-flex items-center gap-1"
          >
            <span>Manage Articles</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Messages */}
        <div className="p-5 rounded-xl bg-[#0D1B14] border border-[#20382B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-content-muted mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Inquiries</span>
            <Inbox size={18} className="text-amber-400" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#F0FDF4] mb-1">
              {stats.unreadMessages}
            </div>
            <span className="text-xs font-mono text-content-muted">
              Unread client inquiries
            </span>
          </div>
          <Link
            to="/admin/messages"
            className="mt-4 pt-3 border-t border-[#20382B] text-xs font-mono text-accent-primary hover:text-accent-hover inline-flex items-center gap-1"
          >
            <span>Open Inbox</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Skills */}
        <div className="p-5 rounded-xl bg-[#0D1B14] border border-[#20382B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-content-muted mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Skills Catalog</span>
            <Cpu size={18} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#F0FDF4] mb-1">
              {stats.totalSkills}
            </div>
            <span className="text-xs font-mono text-content-muted">
              Technical proficiencies
            </span>
          </div>
          <Link
            to="/admin/skills"
            className="mt-4 pt-3 border-t border-[#20382B] text-xs font-mono text-accent-primary hover:text-accent-hover inline-flex items-center gap-1"
          >
            <span>Manage Skills</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Recent Messages & Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Messages */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#20382B] pb-3">
            <h3 className="text-sm font-bold text-[#F0FDF4] flex items-center gap-2">
              <Inbox size={16} className="text-accent-primary" />
              <span>Recent Inquiries</span>
            </h3>
            <Link
              to="/admin/messages"
              className="text-xs font-mono text-accent-primary hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-3.5 rounded-lg bg-[#12251A] border border-[#243A2C] flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#F0FDF4] truncate">{msg.name}</span>
                    {msg.isRead === 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                    )}
                  </div>
                  <p className="text-xs text-content-secondary font-medium truncate">{msg.subject}</p>
                  <p className="text-[11px] text-content-muted line-clamp-1">{msg.message}</p>
                </div>
                <span className="text-[10px] font-mono text-content-muted shrink-0">
                  {msg.createdAt.split("T")[0]}
                </span>
              </div>
            ))}

            {recentMessages.length === 0 && (
              <p className="text-xs font-mono text-content-muted py-6 text-center">
                No inquiries recorded yet.
              </p>
            )}
          </div>
        </div>

        {/* Audit Log Activity */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#20382B] pb-3">
            <h3 className="text-sm font-bold text-[#F0FDF4] flex items-center gap-2">
              <Activity size={16} className="text-accent-secondary" />
              <span>Recent Admin Activity</span>
            </h3>
            <Link
              to="/admin/security"
              className="text-xs font-mono text-accent-primary hover:underline"
            >
              Security log
            </Link>
          </div>

          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-[#12251A] border border-[#243A2C] flex items-center justify-between gap-2 text-xs font-mono"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-accent-primary shrink-0" />
                  <span className="text-content-primary font-semibold truncate">
                    {log.action.replace(/_/g, " ")}
                  </span>
                  <span className="text-content-muted text-[11px]">[{log.entityType}]</span>
                </div>
                <span className="text-content-muted text-[10px] shrink-0">
                  {log.createdAt ? log.createdAt.split("T")[1]?.slice(0, 5) : ""}
                </span>
              </div>
            ))}

            {recentLogs.length === 0 && (
              <p className="text-xs font-mono text-content-muted py-6 text-center">
                No recent activity logged.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
