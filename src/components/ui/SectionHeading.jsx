import React from "react";
import { cn } from "../../utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}) {
  const alignment = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div className={cn("flex flex-col mb-12 sm:mb-16", alignment[align], className)}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-accent-dim border border-accent-primary/20 text-accent-primary font-mono text-xs uppercase tracking-wider font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-content-primary">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm sm:text-base text-content-secondary max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
