/**
 * Site configuration and developer profile details.
 * All personal details and social links are centralized here for easy editing.
 */
export const siteConfig = {
  developer: {
    name: "Sunaryo Adi Putra", // [EDITABLE PLACEHOLDER]: Replace with developer's real name
    title: "Full-Stack Developer",
    handle: "Adiputra.dev",
    location: "Cilacap, Indonesia / Remote", // [EDITABLE PLACEHOLDER]
    availabilityStatus: "Open to Junior Full-Stack & Frontend Opportunities",
    isAvailable: true,
    email: import.meta.env.VITE_CONTACT_EMAIL || "adiputrayy1927@gmail.com",
    githubUrl: "https://github.com/placeholder-dev", // [EDITABLE PLACEHOLDER]
    linkedinUrl: "https://linkedin.com/in/placeholder-dev", // [EDITABLE PLACEHOLDER]
    bioShort: "Building reliable, accessible, and performant web experiences from database queries to interactive interfaces.",
  },
  navigation: [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Philosophy", href: "#philosophy" },
    { name: "Contact", href: "#contact" },
  ],
  about: {
    lead: "I am an early-career Full-Stack Developer with a disciplined engineering mindset and a commitment to clean, well-tested code.",
    paragraphs: [
      "My journey started with building interactive frontends and quickly grew into understanding the full web lifecycle—from relational schema design and RESTful APIs to client-side state management and responsive styling.",
      "Rather than chasing every fleeting trend, I prioritize foundational computer science concepts: data flow clarity, semantic accessibility, predictable asynchronous handling, and defense-in-depth web security.",
      "Currently, I am strengthening my full-stack capabilities by engineering end-to-end full-stack applications, deepening my understanding of database indexing, and adopting strict automated testing workflows."
    ],
    highlights: [
      { label: "Focus", value: "Modern React & Node.js ecosystem" },
      { label: "Approach", value: "Maintainable, accessible, security-conscious" },
      { label: "Learning", value: "Docker workflows& Microservices patterns" },
      { label: "Availability", value: "Full-time & Contract roles" }
    ]
  },
  philosophy: [
    {
      title: "Maintainable Code",
      description: "Writing self-documenting code with clear domain boundaries, modular components, and predictable data flow that future teammates can easily maintain.",
      badge: "Architecture"
    },
    {
      title: "Security-Conscious Development",
      description: "Adhering to OWASP essentials—validating input boundaries, sanitizing rendering, managing CORS, and keeping secret credentials out of frontend client bundles.",
      badge: "Security"
    },
    {
      title: "Responsive & Accessible UX",
      description: "Crafting fluid layouts tailored for every screen size, respecting prefers-reduced-motion, and building accessible WCAG-compliant interactive elements.",
      badge: "Accessibility"
    },
    {
      title: "Performance & Efficiency",
      description: "Minimizing bundle bloat, optimizing asset delivery, preventing unnecessary re-renders, and prioritizing fast First Contentful Paint.",
      badge: "Performance"
    },
    {
      title: "Continuous Deliberate Learning",
      description: "Reviewing pull requests thoughtfully, exploring official documentation, and building practical proofs-of-concept to master modern tooling.",
      badge: "Growth"
    }
  ]
};
