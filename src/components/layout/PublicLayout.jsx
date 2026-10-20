import React from "react";
import { Outlet } from "react-router-dom";
import { PublicNavbar } from "./PublicNavbar";
import { PublicFooter } from "./PublicFooter";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#07110D] text-[#F0FDF4] flex flex-col selection:bg-accent-primary/20 selection:text-accent-primary">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-primary focus:text-bg-primary focus:font-bold focus:rounded-md"
      >
        Skip to main content
      </a>

      <PublicNavbar />

      <main id="main-content" className="flex-1 pt-20">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}
