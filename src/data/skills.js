/**
 * Technical skills structured by domain.
 * Distinguishes established practical skills from currently learning technologies.
 * No fabricated experience years or proficiency percentages.
 */
export const skillCategories = [
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Building responsive, accessible, and reactive user interfaces.",
    skills: [
      { name: "React.js", status: "established", description: "Hooks, functional components, state management" },
      { name: "JavaScript (ES6+)", status: "established", description: "Async/await, closures, array methods, DOM APIs" },
      { name: "HTML5 & Semantic Web", status: "established", description: "Accessible markup, ARIA roles, modern forms" },
      { name: "CSS3 & Tailwind CSS", status: "established", description: "Flexbox, CSS Grid, custom design systems, responsive layouts" },
      { name: "TypeScript", status: "learning", description: "Interfaces, generics, type guards in React" },
      { name: "Vite", status: "established", description: "Fast HMR, module bundling, modern build tooling" },
    ],
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Engineering scalable APIs, data validation, and business logic.",
    skills: [
      { name: "Node.js", status: "established", description: "Event loop, streams, module system, NPM" },
      { name: "Express.js", status: "established", description: "Middleware chains, route modularization, error handlers" },
      { name: "RESTful API Design", status: "established", description: "HTTP verbs, status codes, JSON payload design" },
      { name: "Authentication Basics", status: "established", description: "JWT tokens, secure HTTP-only cookies, password hashing" },
      { name: "Input Validation", status: "established", description: "Schema-based sanitization and data validation" },
      { name: "Next.js (App Router)", status: "learning", description: "Server components, server actions, route handlers" },
    ],
  },
  {
    id: "databases",
    title: "Databases & Storage",
    description: "Data modeling, relational constraints, and document stores.",
    skills: [
      { name: "PostgreSQL", status: "established", description: "Schema design, joins, foreign keys, indexing basics" },
      { name: "MongoDB", status: "established", description: "Document collections, aggregation pipeline basics" },
      { name: "Prisma ORM", status: "established", description: "Type-safe database queries and migrations" },
      { name: "Redis", status: "learning", description: "Key-value caching and rate limiting strategies" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Workflow",
    description: "Collaborative development, debugging, and code quality.",
    skills: [
      { name: "Git & GitHub", status: "established", description: "Feature branching, pull requests, merge conflict resolution" },
      { name: "ESLint & Prettier", status: "established", description: "Static analysis, linting rules, unified code formatting" },
      { name: "Chrome DevTools", status: "established", description: "Network inspection, performance profiler, DOM debugging" },
      { name: "Postman / Thunder Client", status: "established", description: "API contract testing and mock request management" },
    ],
  },
  {
    id: "deployment",
    title: "Deployment & Infrastructure",
    description: "Deploying applications, security headers, and environments.",
    skills: [
      { name: "Vercel", status: "established", description: "Automated Git CI/CD, preview deployments, headers" },
      { name: "Environment Management", status: "established", description: "Dotenv isolation, frontend vs backend secret safety" },
      { name: "HTTP Security Basics", status: "established", description: "CORS configuration, CSP, frame-options headers" },
      { name: "Docker", status: "learning", description: "Containerizing services for local consistency" },
    ],
  },
];
