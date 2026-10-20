import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import { Cpu } from "lucide-react";

export function SkillsPage() {
  const { data: skillsRes, isLoading } = useQuery({
    queryKey: ["skills-grouped"],
    queryFn: () => api.get("/api/skills"),
  });

  const categories = skillsRes?.grouped || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-accent-secondary uppercase tracking-wider font-semibold">
          <Cpu size={14} />
          <span>Technical Domain Competencies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F0FDF4] tracking-tight">
          Skills & Technologies
        </h1>
        <p className="text-sm sm:text-base text-content-secondary leading-relaxed">
          Disciplined full-stack capabilities transparently distinguishing established daily production tools from active technical explorations.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-[#0D1B14] border border-[#20382B]" />
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((cat) => (
            <section key={cat.id} className="space-y-6">
              <div className="border-b border-[#20382B] pb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#F0FDF4] flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded bg-accent-primary" />
                  <span>{cat.title}</span>
                </h2>
                <span className="text-xs font-mono text-content-muted">
                  {cat.skills?.length || 0} Technologies
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.skills?.map((sk) => {
                  const isLearning = sk.status === "learning";
                  return (
                    <div
                      key={sk.id}
                      className="p-5 rounded-xl bg-[#0D1B14] border border-[#20382B] hover:border-accent-primary/40 transition-colors flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h3 className="text-base font-bold text-[#F0FDF4]">{sk.name}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${
                              isLearning
                                ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                : "bg-accent-primary/10 text-accent-primary border-accent-primary/20"
                            }`}
                          >
                            {isLearning ? "Learning" : "Established"}
                          </span>
                        </div>
                        {sk.description && (
                          <p className="text-xs text-content-secondary leading-relaxed">
                            {sk.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
