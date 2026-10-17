import React, { useState } from "react";
import { projectsData, projectCategories } from "../../data/projects";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ProjectMockup } from "../ui/ProjectMockup";
import { ExternalLink, Info, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "../ui/SocialIcons";
import { isSafeUrl } from "../../utils";

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-20 sm:py-28 border-t border-border/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Portfolio"
          title="Featured Projects"
          description="A showcase of full-stack and frontend systems built with practical architectures. Clearly labeled sample projects ready to be replaced with personal production work."
        />

        {/* Notice of Sample Content */}
        <div className="mb-10 p-4 rounded-xl bg-accent-dim/40 border border-accent-primary/20 flex items-start gap-3 text-xs sm:text-sm text-content-secondary max-w-3xl mx-auto">
          <Info size={18} className="text-accent-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-content-primary">Developer Note: </span>
            The items below are structured reference architectures and sample project templates. You can easily populate your own live GitHub repositories, live demo URLs, and production assets in <code className="text-accent-primary font-mono bg-bg-card px-1.5 py-0.5 rounded">src/data/projects.js</code>.
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {projectCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 text-xs font-mono rounded-full border transition-all ${
                selectedCategory === category
                  ? "bg-accent-primary text-bg-primary font-bold border-accent-primary"
                  : "bg-bg-card text-content-secondary border-border hover:border-accent-primary/40"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col bg-bg-card border-border hover:border-border-highlight group"
            >
              {/* Project Interface Visual Preview */}
              <ProjectMockup type={project.previewType} title={project.title} />

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-accent-secondary uppercase tracking-wider font-semibold">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {project.isSample && (
                      <Badge variant="dim" size="xs">
                        Sample Showcase
                      </Badge>
                    )}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-content-primary group-hover:text-accent-primary transition-colors mb-2">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-content-secondary leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Key Features Bullet List */}
                <div className="mb-6 space-y-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-content-muted block mb-1">
                    Key Capabilities:
                  </span>
                  {project.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-content-secondary">
                      <CheckCircle2 size={13} className="text-accent-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="default" size="xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Action Links */}
                <div className="pt-4 border-t border-border/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isSafeUrl(project.githubUrl) ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-content-secondary hover:text-accent-primary transition-colors py-1 px-2.5 rounded bg-bg-secondary border border-border hover:border-accent-primary/40 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      >
                        <GithubIcon size={14} />
                        <span>Source Code</span>
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-content-muted">Repo Private</span>
                    )}

                    {isSafeUrl(project.demoUrl) && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-content-secondary hover:text-accent-primary transition-colors py-1 px-2.5 rounded bg-bg-secondary border border-border hover:border-accent-primary/40 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      >
                        <ExternalLink size={14} />
                        <span>Live Preview</span>
                      </a>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-content-muted">
                    {project.status}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
