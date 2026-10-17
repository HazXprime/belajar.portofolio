import React, { useState } from "react";
import { skillCategories } from "../../data/skills";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Layout, Server, Database, Wrench, Cloud, Check, Clock } from "lucide-react";

export function Skills() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categoryIcons = {
    frontend: Layout,
    backend: Server,
    databases: Database,
    tools: Wrench,
    deployment: Cloud,
  };

  const filteredCategories =
    selectedCategory === "all"
      ? skillCategories
      : skillCategories.filter((c) => c.id === selectedCategory);

  return (
    <section id="skills" className="py-20 sm:py-28 border-t border-border/50 bg-bg-secondary/40 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Competencies"
          title="Technical Skills & Tooling"
          description="Organized by domain. Clearly distinguishing established practical technologies from frameworks currently being learned."
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-1.5 text-xs font-mono rounded-full border transition-all ${
              selectedCategory === "all"
                ? "bg-accent-primary text-bg-primary font-bold border-accent-primary"
                : "bg-bg-card text-content-secondary border-border hover:border-accent-primary/40"
            }`}
          >
            All Categories ({skillCategories.length})
          </button>
          {skillCategories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Wrench;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono rounded-full border transition-all ${
                  isSelected
                    ? "bg-accent-primary text-bg-primary font-bold border-accent-primary"
                    : "bg-bg-card text-content-secondary border-border hover:border-accent-primary/40"
                }`}
              >
                <Icon size={13} />
                <span>{cat.title.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mb-8 text-xs font-mono text-content-muted">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-primary" />
            <span>Established Practical Skill</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Currently Expanding / In Progress</span>
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Wrench;
            return (
              <Card key={cat.id} className="p-6 flex flex-col h-full bg-bg-card">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/80">
                  <div className="p-2 rounded-lg bg-accent-dim text-accent-primary border border-accent-primary/30">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-content-primary text-sm sm:text-base">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-content-muted">{cat.description}</p>
                  </div>
                </div>

                <div className="space-y-3 mt-auto">
                  {cat.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-2.5 rounded-lg bg-bg-secondary border border-border-subtle hover:border-border transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-content-primary">
                          {skill.name}
                        </span>
                        {skill.status === "established" ? (
                          <Badge variant="accent" size="xs">
                            <Check size={10} className="mr-1" />
                            Solid
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="xs">
                            <Clock size={10} className="mr-1" />
                            Learning
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-content-muted leading-tight">
                        {skill.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
