import React from "react";
import { cn } from "../../utils";

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) {
  const base = "inline-flex items-center font-mono font-medium rounded-full transition-colors";

  const variants = {
    default: "bg-bg-elevated text-content-secondary border border-border",
    accent: "bg-accent-dim text-accent-primary border border-accent-primary/30",
    success: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50",
    warning: "bg-amber-950/50 text-amber-300 border border-amber-800/40",
    dim: "bg-bg-card/70 text-content-muted border border-border-subtle",
  };

  const sizes = {
    xs: "text-[11px] px-2 py-0.5",
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3 py-1.5",
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
