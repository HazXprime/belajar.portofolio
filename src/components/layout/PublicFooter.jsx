import React from "react";
import { Link } from "react-router-dom";
import { Terminal, Shield, ArrowUp, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/SocialIcons";
import { siteConfig } from "../../config/site";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-bg-secondary border-t border-border pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-border/80">
          {/* Brand Info */}
          <div className="md:col-span-6 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2 mb-3 group">
              <div className="w-8 h-8 rounded-lg bg-bg-card border border-border group-hover:border-accent-primary/50 flex items-center justify-center text-accent-primary transition-colors">
                <Terminal size={16} />
              </div>
              <span className="font-mono text-base font-bold text-content-primary group-hover:text-accent-primary transition-colors">
                {siteConfig.developer.name}
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-content-secondary max-w-sm leading-relaxed mb-4">
              Full-Stack Developer building robust, accessible, and high-performance web applications with Turso, React, and Node.js.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
              <span className="text-xs font-mono text-accent-secondary">
                Production-Ready Systems
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-content-muted font-semibold mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/about" className="text-content-secondary hover:text-accent-primary transition-colors">About & Experience</Link></li>
              <li><Link to="/projects" className="text-content-secondary hover:text-accent-primary transition-colors">Featured Projects</Link></li>
              <li><Link to="/skills" className="text-content-secondary hover:text-accent-primary transition-colors">Technical Stack</Link></li>
              <li><Link to="/blog" className="text-content-secondary hover:text-accent-primary transition-colors">Engineering Blog</Link></li>
              <li><Link to="/contact" className="text-content-secondary hover:text-accent-primary transition-colors">Contact Developer</Link></li>
            </ul>
          </div>

          {/* CMS & Socials */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-content-muted font-semibold mb-3">
              Administration & Social
            </h4>
            <div className="flex items-center gap-3 mb-4">
              <a
                href={siteConfig.developer.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-bg-card border border-border flex items-center justify-center text-content-secondary hover:text-accent-primary hover:border-accent-primary/40 transition-colors"
                aria-label="GitHub Profile"
              >
                <GithubIcon size={16} />
              </a>
              <a
                href={siteConfig.developer.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-bg-card border border-border flex items-center justify-center text-content-secondary hover:text-accent-primary hover:border-accent-primary/40 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon size={16} />
              </a>
              <a
                href={`mailto:${siteConfig.developer.email}`}
                className="w-8 h-8 rounded-lg bg-bg-card border border-border flex items-center justify-center text-content-secondary hover:text-accent-primary hover:border-accent-primary/40 transition-colors"
                aria-label="Send Direct Email"
              >
                <Mail size={16} />
              </a>
            </div>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-content-muted hover:text-accent-primary transition-colors border border-border/60 rounded px-2.5 py-1 bg-bg-card/50"
            >
              <Shield size={12} />
              <span>Admin CMS Portal</span>
            </Link>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-content-muted font-mono">
            &copy; {currentYear} {siteConfig.developer.name}. Engineered with React, Node.js, and Turso.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-content-muted hover:text-accent-primary font-mono transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
