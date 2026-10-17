import React, { useState, useEffect } from "react";
import { siteConfig } from "../../config/site";
import { Menu, X, Terminal, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../utils";

export function Navbar({ activeSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-bg-primary/90 backdrop-blur-md border-b border-border py-3 shadow-lg"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Monogram / Brand Logo */}
        <a
          href="#home"
          className="flex items-center gap-2.5 text-content-primary hover:text-accent-primary transition-colors group focus:outline-none focus:ring-2 focus:ring-accent-primary rounded-md p-1"
          aria-label={`${siteConfig.developer.name} - Home`}
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
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-1 bg-bg-card/70 border border-border/80 px-3 py-1.5 rounded-full backdrop-blur-sm"
          aria-label="Main Navigation"
        >
          {siteConfig.navigation.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary",
                  isActive
                    ? "bg-accent-dim text-accent-primary font-semibold border border-accent-primary/30"
                    : "text-content-secondary hover:text-content-primary hover:bg-bg-elevated/50"
                )}
              >
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* CTA Button & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <Button
            href="#contact"
            variant="primary"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight size={14} />
          </Button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-bg-card border border-border text-content-secondary hover:text-content-primary hover:border-accent-primary/50 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-[60px] bg-bg-primary/95 backdrop-blur-xl z-40 md:hidden flex flex-col p-6 border-t border-border animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <nav className="flex flex-col gap-2 mt-4" aria-label="Mobile Navigation">
            {siteConfig.navigation.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors border",
                    isActive
                      ? "bg-accent-dim text-accent-primary border-accent-primary/30 font-semibold"
                      : "text-content-secondary hover:text-content-primary border-transparent hover:bg-bg-card"
                  )}
                >
                  <span>{item.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />}
                </a>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3">
            <Button
              href="#contact"
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={closeMobileMenu}
            >
              <span>Get in Touch</span>
              <ArrowUpRight size={16} />
            </Button>
            <p className="text-xs text-center text-content-muted mt-2 font-mono">
              Status: Available for opportunities
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
