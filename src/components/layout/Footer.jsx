import React from "react";
import { siteConfig } from "../../config/site";
import { Terminal, Mail, ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/SocialIcons";
import { isSafeUrl } from "../../utils";

export function Footer() {
  const { developer, navigation } = siteConfig;
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-bg-secondary border-t border-border pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-border/80">
          {/* Brand & Mission (Left) */}
          <div className="md:col-span-6 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-bg-card border border-border flex items-center justify-center text-accent-primary">
                <Terminal size={16} />
              </div>
              <span className="font-mono text-base font-bold text-content-primary">
                {developer.name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-content-secondary max-w-sm leading-relaxed mb-4">
              Early-career Full-Stack Developer engineering robust, clean, and accessible web applications.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
              <span className="text-xs font-mono text-accent-secondary">
                Systems Ready for Deployment
              </span>
            </div>
          </div>

          {/* Quick Navigation Links (Center) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-content-muted font-semibold mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-content-secondary hover:text-accent-primary transition-colors focus:outline-none focus:underline"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* External Social Profiles (Right) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-content-muted font-semibold mb-3">
              Connect
            </h4>
            <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <a
                href={`mailto:${developer.email}`}
                className="flex items-center gap-2 text-content-secondary hover:text-accent-primary transition-colors focus:outline-none focus:underline"
              >
                <Mail size={14} className="text-accent-secondary" />
                <span>{developer.email}</span>
              </a>

              {isSafeUrl(developer.githubUrl) && (
                <a
                  href={developer.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-content-secondary hover:text-accent-primary transition-colors focus:outline-none focus:underline"
                >
                  <GithubIcon size={14} className="text-accent-secondary" />
                  <span>GitHub</span>
                </a>
              )}

              {isSafeUrl(developer.linkedinUrl) && (
                <a
                  href={developer.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-content-secondary hover:text-accent-primary transition-colors focus:outline-none focus:underline"
                >
                  <LinkedinIcon size={14} className="text-accent-secondary" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-content-muted">
          <div>
            &copy; {currentYear} {developer.name}. Built with React, Tailwind CSS, & Vite.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-border hover:border-accent-primary/50 text-content-secondary hover:text-content-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
