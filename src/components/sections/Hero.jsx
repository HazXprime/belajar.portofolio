import React from "react";
import { siteConfig } from "../../config/site";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { ArrowRight, Terminal, Shield, Cpu, Layers } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/SocialIcons";
import { isSafeUrl } from "../../utils";

export function Hero() {
  const { developer } = siteConfig;

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center pt-28 pb-16 overflow-hidden bg-grid-tech"
      aria-label="Hero Introduction"
    >
      {/* Subtle radial ambient highlight */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-accent-primary/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy (Left Column) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Availability Badge */}
            {developer.isAvailable && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-dim border border-accent-primary/30 text-accent-primary text-xs font-mono mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary" />
                </span>
                <span>{developer.availabilityStatus}</span>
              </div>
            )}

            {/* Developer Greeting & Heading */}
            <p className="font-mono text-sm text-accent-secondary mb-2 tracking-wide">
              Hello, I&apos;m {developer.name}
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-content-primary leading-[1.15]">
              Building Digital Experiences Through{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
                Practical Code.
              </span>
            </h1>

            {/* Subtitle / Value Proposition */}
            <p className="mt-5 text-base sm:text-lg text-content-secondary max-w-xl leading-relaxed">
              {developer.bioShort}
            </p>

            {/* Call To Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="#projects" variant="primary" size="md">
                <span>Explore My Projects</span>
                <ArrowRight size={16} />
              </Button>
              <Button href="#contact" variant="secondary" size="md">
                <span>Contact Me</span>
              </Button>
            </div>

            {/* Social Links & Quick Stack Icons */}
            <div className="mt-10 pt-6 border-t border-border/80 w-full flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-content-muted">Find me on:</span>
                {isSafeUrl(developer.githubUrl) && (
                  <a
                    href={developer.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-bg-card border border-border text-content-secondary hover:text-accent-primary hover:border-accent-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    aria-label="GitHub Profile"
                  >
                    <GithubIcon size={18} />
                  </a>
                )}
                {isSafeUrl(developer.linkedinUrl) && (
                  <a
                    href={developer.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-bg-card border border-border text-content-secondary hover:text-accent-primary hover:border-accent-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedinIcon size={18} />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="dim" size="xs">React</Badge>
                <Badge variant="dim" size="xs">Node.js</Badge>
                <Badge variant="dim" size="xs">PostgreSQL</Badge>
                <Badge variant="dim" size="xs">Tailwind</Badge>
              </div>
            </div>
          </div>

          {/* Code Terminal Visual Card (Right Column) */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-bg-card border border-border rounded-xl shadow-card-dark overflow-hidden transition-all duration-300 hover:border-border-highlight">
              {/* Terminal Window Header */}
              <div className="bg-bg-secondary px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs text-content-muted">developer.config.json</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-accent-primary bg-accent-dim px-2 py-0.5 rounded">
                  <Terminal size={12} />
                  <span>node v24</span>
                </div>
              </div>

              {/* Terminal Code Body */}
              <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-content-secondary">
                <p className="text-content-muted">&#47;&#47; Developer Profile Metadata</p>
                <p>
                  <span className="text-emerald-400">const</span>{" "}
                  <span className="text-amber-300">developer</span> = &#123;
                </p>
                <p className="pl-4">
                  <span className="text-content-primary">role:</span>{" "}
                  <span className="text-emerald-300">&quot;{developer.title}&quot;</span>,
                </p>
                <p className="pl-4">
                  <span className="text-content-primary">stack:</span> [
                  <span className="text-emerald-300">&quot;React&quot;</span>,{" "}
                  <span className="text-emerald-300">&quot;Node.js&quot;</span>,{" "}
                  <span className="text-emerald-300">&quot;PostgreSQL&quot;</span>],
                </p>
                <p className="pl-4">
                  <span className="text-content-primary">principles:</span> &#123;
                </p>
                <p className="pl-8">
                  <span className="text-content-muted">cleanCode:</span> <span className="text-accent-primary">true</span>,
                </p>
                <p className="pl-8">
                  <span className="text-content-muted">securityAware:</span> <span className="text-accent-primary">true</span>,
                </p>
                <p className="pl-8">
                  <span className="text-content-muted">testDriven:</span> <span className="text-accent-primary">true</span>
                </p>
                <p className="pl-4">&#125;,</p>
                <p className="pl-4">
                  <span className="text-content-primary">status:</span>{" "}
                  <span className="text-emerald-300">&quot;ready_to_contribute&quot;</span>
                </p>
                <p>&#125;;</p>

                <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-content-muted">
                  <span className="flex items-center gap-1.5 text-accent-secondary">
                    <span className="inline-block w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                    System Status: Normal
                  </span>
                  <span className="font-mono">utf-8</span>
                </div>
              </div>
            </div>

            {/* Quick Micro-stats cards */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-bg-card/70 border border-border text-center">
                <Layers size={16} className="mx-auto text-accent-secondary mb-1" />
                <span className="block text-xs font-mono font-semibold text-content-primary">Full-Stack</span>
                <span className="text-[10px] text-content-muted">Architecture</span>
              </div>
              <div className="p-3 rounded-lg bg-bg-card/70 border border-border text-center">
                <Shield size={16} className="mx-auto text-accent-secondary mb-1" />
                <span className="block text-xs font-mono font-semibold text-content-primary">Secure</span>
                <span className="text-[10px] text-content-muted">Practices</span>
              </div>
              <div className="p-3 rounded-lg bg-bg-card/70 border border-border text-center">
                <Cpu size={16} className="mx-auto text-accent-secondary mb-1" />
                <span className="block text-xs font-mono font-semibold text-content-primary">Modern</span>
                <span className="text-[10px] text-content-muted">React & Node</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
