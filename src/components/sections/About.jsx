import React from "react";
import { siteConfig } from "../../config/site";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { Compass, Target, Code2, BookOpen, CheckCircle2 } from "lucide-react";

export function About() {
  const { about, developer } = siteConfig;

  return (
    <section id="about" className="py-20 sm:py-28 border-t border-border/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Background"
          title="About Me & Engineering Journey"
          description="An authentic look into my background, problem-solving approach, and current technical trajectory."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Narrative Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/80">
                <div className="p-2.5 rounded-lg bg-accent-dim text-accent-primary border border-accent-primary/20">
                  <Code2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-content-primary">
                    Early-Career Full-Stack Engineer
                  </h3>
                  <p className="text-xs text-content-muted font-mono">
                    Based in {developer.location}
                  </p>
                </div>
              </div>

              <p className="text-content-primary text-base sm:text-lg font-medium leading-relaxed mb-4">
                {about.lead}
              </p>

              <div className="space-y-4 text-sm sm:text-base text-content-secondary leading-relaxed">
                {about.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </Card>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-5">
                <div className="flex items-center gap-2.5 text-accent-primary mb-2 font-semibold text-sm">
                  <Target size={18} />
                  <span>Problem-Solving Approach</span>
                </div>
                <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
                  Breaking down features into testable micro-modules, writing clear contracts between client and server, and validating inputs rigorously.
                </p>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2.5 text-accent-secondary mb-2 font-semibold text-sm">
                  <BookOpen size={18} />
                  <span>Current Learning Goals</span>
                </div>
                <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
                  Strengthening TypeScript type safety, exploring containerized CI/CD pipelines, and mastering database query optimization.
                </p>
              </Card>
            </div>
          </div>

          {/* Quick Facts & Highlights (Right Column) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card className="p-6 bg-bg-card/90">
              <h4 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-bold mb-4 flex items-center gap-2">
                <Compass size={16} />
                <span>Profile Snapshot</span>
              </h4>

              <div className="space-y-4">
                {about.highlights.map((item, i) => (
                  <div key={i} className="pb-3 border-b border-border/60 last:border-0 last:pb-0">
                    <span className="block text-xs font-mono text-content-muted mb-0.5">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-content-primary">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Commitments Card */}
            <Card className="p-6 bg-gradient-to-br from-bg-card to-bg-secondary border-border">
              <h4 className="text-sm font-semibold text-content-primary mb-3">
                What I Bring to a Team
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-content-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-accent-primary shrink-0 mt-0.5" />
                  <span>Disciplined version control with atomic commits and clear PR summaries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-accent-primary shrink-0 mt-0.5" />
                  <span>Eagerness to receive technical feedback, learn team idioms, and iterate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-accent-primary shrink-0 mt-0.5" />
                  <span>Focus on writing readable code with minimal accidental complexity.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
