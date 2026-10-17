import React from "react";
import { cn } from "../../utils";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  as: Component = "button",
  href,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/60 focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "bg-accent-primary text-bg-primary hover:bg-accent-hover font-semibold shadow-sm hover:shadow-glow-sm active:scale-[0.98]",
    secondary:
      "bg-bg-card text-content-primary border border-border hover:border-accent-primary/50 hover:bg-bg-elevated active:scale-[0.98]",
    outline:
      "border border-accent-primary/50 text-accent-primary hover:bg-accent-primary/10 active:scale-[0.98]",
    ghost:
      "text-content-secondary hover:text-content-primary hover:bg-bg-card active:scale-[0.98]",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5",
  };

  const combinedClasses = cn(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a href={href} className={combinedClasses} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  );
}
