import React from "react";
import { Link } from "react-router-dom";
import { Terminal, Home, ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#0D1B14] border border-[#20382B] flex items-center justify-center text-accent-primary mx-auto shadow-glow-sm">
        <Terminal size={32} />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-accent-secondary">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F0FDF4]">
          Resource Not Found
        </h1>
        <p className="text-xs sm:text-sm text-content-secondary max-w-md mx-auto leading-relaxed">
          The route you requested does not exist or may have been relocated.
        </p>
      </div>

      <div className="pt-4 flex items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs font-mono transition-colors shadow-glow-sm"
        >
          <Home size={14} />
          <span>Return Home</span>
        </Link>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#20382B] bg-[#0D1B14] hover:border-accent-primary text-[#F0FDF4] text-xs font-mono transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Browse Projects</span>
        </Link>
      </div>
    </div>
  );
}
