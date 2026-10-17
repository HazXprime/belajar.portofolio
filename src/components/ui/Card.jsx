import React from "react";
import { cn } from "../../utils";

export function Card({
  children,
  className = "",
  hover = true,
  glow = false,
  as: Component = "div",
  ...props
}) {
  return (
    <Component
      className={cn(
        "bg-bg-card border border-border rounded-xl transition-all duration-300 relative overflow-hidden",
        hover && "hover:border-border-highlight hover:translate-y-[-2px] hover:shadow-card-dark",
        glow && "hover:shadow-glow-sm hover:border-accent-primary/40",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
