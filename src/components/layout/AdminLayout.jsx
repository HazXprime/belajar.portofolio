import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  BookOpen,
  Tags,
  Hash,
  Image,
  Inbox,
  Compass,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Terminal,
} from "lucide-react";
import { cn } from "../../utils";

const navSections = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
      { name: "Profile", path: "/admin/profile", icon: User },
    ],
  },
  {
    title: "Portfolio Content",
    items: [
      { name: "Projects", path: "/admin/projects", icon: FolderGit2 },
      { name: "Skills", path: "/admin/skills", icon: Cpu },
      { name: "Experience", path: "/admin/experience", icon: Briefcase },
      { name: "Education & Certs", path: "/admin/education", icon: GraduationCap },
      { name: "Blog Posts", path: "/admin/blog", icon: BookOpen },
    ],
  },
  {
    title: "Taxonomy & Media",
    items: [
      { name: "Categories", path: "/admin/categories", icon: Tags },
      { name: "Tags", path: "/admin/tags", icon: Hash },
      { name: "Media Library", path: "/admin/media", icon: Image },
    ],
  },
  {
    title: "Communications & Config",
    items: [
      { name: "Inbox Messages", path: "/admin/messages", icon: Inbox },
      { name: "Navigation Menu", path: "/admin/navigation", icon: Compass },
      { name: "Site Settings", path: "/admin/settings", icon: Settings },
      { name: "Security & Logs", path: "/admin/security", icon: ShieldAlert },
    ],
  },
];

export function AdminLayout() {
  const { admin, isLoading, logout } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If loading session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07110D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#102019] border border-[#20382B] flex items-center justify-center text-accent-primary animate-pulse shadow-glow-sm">
            <Terminal size={24} />
          </div>
          <p className="font-mono text-xs text-content-muted">Verifying authenticated session...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!admin) {
    navigate("/admin/login", { replace: true, state: { from: location } });
    return null;
  }

  const handleLogout = async () => {
    await logout();
    showSuccess("Logged out successfully.");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#07110D] text-[#F0FDF4] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0B1711] border-r border-[#20382B] shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand */}
        <div className="p-5 border-b border-[#20382B] flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#102019] border border-[#20382B] group-hover:border-accent-primary/60 flex items-center justify-center text-accent-primary transition-colors">
              <Terminal size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-tight text-[#F0FDF4]">
                Portfolio CMS
              </span>
              <span className="text-[10px] text-accent-secondary font-mono leading-none">
                Admin Dashboard
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-6">
          {navSections.map((sec) => (
            <div key={sec.title}>
              <h3 className="px-3 text-[11px] font-mono uppercase tracking-wider text-content-muted font-semibold mb-2">
                {sec.title}
              </h3>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono transition-colors",
                          isActive
                            ? "bg-accent-primary/15 text-accent-primary font-semibold border border-accent-primary/20"
                            : "text-content-secondary hover:text-[#F0FDF4] hover:bg-[#102019]"
                        )
                      }
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#20382B] bg-[#07110D]/60 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-accent-primary/20 border border-accent-primary/40 flex items-center justify-center text-accent-primary font-mono text-xs font-bold shrink-0">
              {admin.name?.charAt(0) || "A"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-[#F0FDF4] truncate">{admin.name}</span>
              <span className="text-[10px] text-content-muted truncate">{admin.email}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 text-content-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Modal */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 bg-[#0B1711] border-r border-[#20382B] flex flex-col h-full z-10 overflow-y-auto">
            <div className="p-4 border-b border-[#20382B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-accent-primary" />
                <span className="font-mono text-sm font-bold text-[#F0FDF4]">Admin CMS</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded text-content-muted hover:text-[#F0FDF4]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 px-3 py-4 space-y-6">
              {navSections.map((sec) => (
                <div key={sec.title}>
                  <h3 className="px-3 text-[11px] font-mono uppercase tracking-wider text-content-muted font-semibold mb-2">
                    {sec.title}
                  </h3>
                  <div className="space-y-1">
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          end={item.end}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono transition-colors",
                              isActive
                                ? "bg-accent-primary/15 text-accent-primary font-semibold"
                                : "text-content-secondary hover:text-[#F0FDF4] hover:bg-[#102019]"
                            )
                          }
                        >
                          <Icon size={16} />
                          <span>{item.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#20382B] flex items-center justify-between">
              <span className="text-xs text-content-muted truncate">{admin.email}</span>
              <button onClick={handleLogout} className="text-red-400 p-1">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-[#0B1711]/90 backdrop-blur-md border-b border-[#20382B] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#102019] border border-[#20382B] text-content-secondary hover:text-[#F0FDF4]"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb Info */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-content-muted hidden sm:inline">CMS</span>
              <span className="text-content-muted hidden sm:inline">/</span>
              <span className="text-accent-primary font-semibold capitalize">
                {location.pathname.replace("/admin/", "").replace("/admin", "Overview") || "Overview"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#20382B] bg-[#102019] text-xs font-mono text-content-secondary hover:text-accent-primary hover:border-accent-primary/40 transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink size={13} />
            </a>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#20382B]">
              <span className="w-2 h-2 rounded-full bg-accent-primary" />
              <span className="text-xs font-mono text-content-muted">Admin Mode</span>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
