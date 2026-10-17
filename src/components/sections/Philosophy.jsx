import React from "react";
import { siteConfig } from "../../config/site";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ShieldCheck, Code, Smartphone, Eye, Zap, GraduationCap } from "lucide-react";

export function Philosophy() {
  const { philosophy } = siteConfig;

  const icons = [Code, ShieldCheck, Smartphone, Eye, Zap, GraduationCap];

  return (
    <section id="philosophy" className="py-20 sm:py-28 border-t border-border/50 bg-bg-secondary/30 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Values"
          title="Development Philosophy"
          description="Software engineering principles that shape my daily decisions, code architecture, and approach to team collaboration."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {philosophy.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Card
                key={item.title}
                className="p-6 flex flex-col justify-between bg-bg-card border-border hover:border-accent-primary/40 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-accent-dim text-accent-primary border border-accent-primary/20 group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <Badge variant="dim" size="xs">
                      {item.badge}
                    </Badge>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-content-primary mb-2 group-hover:text-accent-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-content-muted">
                  <span>Principle #0{index + 1}</span>
                  <span className="text-accent-secondary">Enforced</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
