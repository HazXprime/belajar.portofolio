import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Terminal, Menu, X, Shield, ArrowUpRight } from "lucide-react";
import { siteConfig } from "../../config/site";
import { cn } from "../../utils";

export function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Skills", href: "/skills" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#07110D]/90 backdrop-blur-md border-b border-[#20382B] py-3 shadow-lg"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Monogram / Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-content-primary hover:text-accent-primary transition-colors group focus:outline-none focus:ring-2 focus:ring-accent-primary rounded-md p-1"
        >
          <div className="w-9 h-9 rounded-lg bg-bg-card border border-border group-hover:border-accent-primary/60 flex items-center justify-center text-accent-primary transition-colors shadow-inner">
            <Terminal size={18} className="transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold tracking-tight text-content-primary group-hover:text-accent-primary transition-colors">
              {siteConfig.developer.handle}
            </span>
            <span className="text-[11px] text-content-muted font-mono leading-none">
              fullstack.engineer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-bg-card/70 border border-border/80 rounded-full px-4 py-1.5 backdrop-blur-sm">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-mono transition-colors",
                  isActive
                    ? "bg-accent-primary/15 text-accent-primary font-semibold"
                    : "text-content-secondary hover:text-content-primary hover:bg-bg-elevated/50"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-bg-card text-content-muted hover:text-accent-primary hover:border-accent-primary/50 text-xs font-mono transition-colors"
            title="Admin CMS Dashboard"
          >
            <Shield size={13} />
            <span>CMS</span>
          </Link>

          <Link
            to="/contact"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs transition-colors shadow-glow-sm"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg bg-bg-card border border-border text-content-primary hover:text-accent-primary transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-bg-primary border-b border-border px-4 py-6 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-2.5 rounded-lg font-mono text-sm transition-colors",
                    isActive
                      ? "bg-accent-primary/15 text-accent-primary font-semibold"
                      : "text-content-secondary hover:text-content-primary hover:bg-bg-card"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-4 mt-2 border-t border-border flex items-center justify-between">
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-xs font-mono text-content-muted hover:text-accent-primary"
              >
                <Shield size={14} />
                <span>Admin CMS</span>
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 rounded-lg bg-accent-primary text-bg-primary font-semibold text-xs"
              >
                Contact Developer
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
