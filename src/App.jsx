import React from "react";
import { Navbar } from "./components/navigation/Navbar";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { Philosophy } from "./components/sections/Philosophy";
import { Contact } from "./components/sections/Contact";
import { Footer } from "./components/layout/Footer";
import { useActiveSection } from "./hooks/useActiveSection";

export function App() {
  const activeSection = useActiveSection([
    "home",
    "about",
    "skills",
    "projects",
    "philosophy",
    "contact",
  ]);

  return (
    <div className="min-h-screen bg-bg-primary text-content-primary flex flex-col selection:bg-accent-primary/20 selection:text-accent-primary">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-primary focus:text-bg-primary focus:font-bold focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Persistent Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Main Page Content */}
      <main id="main-content" className="flex-1">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Philosophy />
        <Contact />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default App;
