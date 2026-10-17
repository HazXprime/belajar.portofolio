/**
 * Featured projects dataset.
 * All sample entries are explicitly labeled as demonstration projects
 * that the developer can easily replace with their real repositories.
 */
export const projectsData = [
  {
    id: "devpulse-monitor",
    title: "DevPulse API Health Monitor",
    isSample: true,
    category: "Full-Stack",
    description: "A centralized dashboard for tracking external API health, uptime response times, and incident notifications with automated email alerts.",
    features: [
      "Scheduled health checks with configurable ping intervals",
      "Real-time latency metrics visualized via clean SVG charts",
      "Webhook alerts for server downtime or degraded latency",
      "Role-based mock authentication with JWT in secure cookies"
    ],
    techStack: ["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
    githubUrl: "https://github.com/placeholder-dev/devpulse-api-monitor",
    demoUrl: "https://devpulse-demo.example.com",
    status: "Sample Showcase",
    previewType: "dashboard",
  },
  {
    id: "taskflow-kanban",
    title: "TaskFlow Collaborative Kanban",
    isSample: true,
    category: "Frontend",
    description: "An intuitive task management board with drag-and-drop mechanics, offline persistence via IndexedDB, and filterable priority tags.",
    features: [
      "Responsive drag-and-drop column workflow with keyboard accessibility",
      "Local-first state architecture using browser storage with export/import",
      "Subtask checklists with real-time completion progress tracking",
      "Dark tech aesthetic with smooth visual feedback and focus indicators"
    ],
    techStack: ["React 18", "Tailwind CSS", "Lucide React", "Vite", "IndexedDB"],
    githubUrl: "https://github.com/placeholder-dev/taskflow-kanban",
    demoUrl: "https://taskflow-demo.example.com",
    status: "Sample Showcase",
    previewType: "kanban",
  },
  {
    id: "secureshare-vault",
    title: "SecureShare Ephemeral Notes",
    isSample: true,
    category: "Security & Tools",
    description: "A privacy-focused self-destructing text sharing utility that encrypts payloads in-browser before submission and wipes records after reading.",
    features: [
      "Client-side AES-GCM 256-bit payload encryption using Web Crypto API",
      "Single-view expiration with automatic server-side purge",
      "Rate-limited endpoints to prevent automated scraping",
      "Zero persistent logging of unencrypted user data"
    ],
    techStack: ["React", "Web Crypto API", "Node.js", "Redis", "Tailwind CSS"],
    githubUrl: "https://github.com/placeholder-dev/secureshare-vault",
    demoUrl: "https://secureshare-demo.example.com",
    status: "Sample Showcase",
    previewType: "security",
  },
  {
    id: "gitpulse-analytics",
    title: "GitPulse Profile Insight",
    isSample: true,
    category: "Frontend",
    description: "A technical dashboard querying the public GitHub REST API to summarize commit frequency, primary languages, and repository activity trends.",
    features: [
      "Safe URL validation and error boundaries for external rate limits",
      "Language distribution metrics and repository stars breakdown",
      "Interactive filtering by star count, license, and last push date",
      "Skeleton loading states and zero layout shift on data load"
    ],
    techStack: ["React", "GitHub REST API", "Tailwind CSS", "Vite"],
    githubUrl: "https://github.com/placeholder-dev/gitpulse-profile-insight",
    demoUrl: "https://gitpulse-demo.example.com",
    status: "Sample Showcase",
    previewType: "analytics",
  }
];

export const projectCategories = ["All", "Full-Stack", "Frontend", "Security & Tools"];
