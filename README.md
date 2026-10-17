# Professional Full-Stack Developer Portfolio

A production-ready personal portfolio website for an early-career Full-Stack Software Engineer, designed with a distinct **Dark Tech Green** aesthetic inspired by cybersecurity dashboards, developer tools, and minimalist technical interfaces.

![License: MIT](https://img.shields.io/badge/License-MIT-emerald)
![React: 18](https://img.shields.io/badge/React-18-emerald)
![Vite: 6](https://img.shields.io/badge/Vite-6-emerald)
![Tailwind CSS: 3.4](https://img.shields.io/badge/Tailwind-3.4-emerald)
![Deploy: Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

---

## 1. Visual Identity & Design System

The application strictly implements the **Dark Tech Green** design system:

| Token | Hex Value | Usage |
|---|---|---|
| Primary Background | `#07110D` | Main page canvas background |
| Secondary Background | `#0B1711` | Navbar, terminal headers, footer, elevated panels |
| Card Background | `#102019` | Cards, skills containers, input fields |
| Primary Accent | `#22C55E` | Primary buttons, active tabs, success badges |
| Secondary Accent | `#10B981` | Subtitles, code highlighting, tech badges |
| Border | `#20382B` | Subtle card borders and structural dividers |
| Primary Text | `#F0FDF4` | High-contrast headings and readable body text |
| Secondary Text | `#A7B9AD` | Descriptive paragraphs, subtitles, and labels |

Typography combines **Inter** for clean, readable sans-serif text and **JetBrains Mono** for code snippets and technical labels.

---

## 2. Features & Architecture

- **Single-Page Application (SPA)** with zero layout shift and smooth scroll targeting.
- **Header & Navbar**:
  - Monogram brand logo.
  - Active section indicator dynamically highlighting current scroll position.
  - Mobile slide-out navigation menu with accessible toggle controls and focus management.
- **Hero Section**:
  - Live availability badge (`Open to Junior Full-Stack & Frontend Opportunities`).
  - Clear value proposition and primary/secondary CTAs.
  - Interactive terminal card visual with syntax highlighting.
  - External GitHub and LinkedIn action buttons.
- **About Me Section**:
  - Authentic narrative of an early-career engineer.
  - Problem-solving approach and current learning trajectory.
  - Profile snapshot highlighting core focus.
- **Technical Skills**:
  - Categorized by domain: Frontend, Backend, Databases, Tools & Workflow, and Deployment & Infrastructure.
  - Interactive category filtering pills.
  - Clear distinction between **Established** practical skills and technologies **Currently Learning** (no fabricated years or proficiency percentages).
- **Featured Projects**:
  - Interactive category filtering (`All`, `Full-Stack`, `Frontend`, `Security & Tools`).
  - Clearly labeled sample showcase entries that prevent misrepresenting experience.
  - SVG technical mockups illustrating dashboards, kanban boards, and cryptographic vaults.
  - Safe external URL validation with `rel="noopener noreferrer"`.
- **Development Philosophy**:
  - Core engineering values: Maintainable Code, Security-Conscious Development, Responsive UX, Performance, and Continuous Learning.
- **Contact Section**:
  - Direct communication cards for email, GitHub, and LinkedIn.
  - Structured contact form with client-side validation, character boundaries, accessible error announcements, and mailto dispatch.
- **Footer**:
  - Dynamic current year calculation, quick navigation links, social links, and smooth back-to-top button.

---

## 3. Technology Stack

- **Framework**: [React 18](https://react.dev/)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with PostCSS & Autoprefixer
- **Icons**: [Lucide React](https://lucide.dev/) + Custom SVG Social Icons
- **Code Quality**: [ESLint 9](https://eslint.org/) (Flat Configuration)
- **Deployment Platform**: [Vercel](https://vercel.com/)

---

## 4. Project Directory Structure

```text
portofolio/
├── public/
│   ├── favicon.svg          # Custom Dark Tech Green SVG favicon
│   ├── robots.txt           # Search engine indexing rules
│   └── sitemap.xml          # XML sitemap configuration
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Footer.jsx   # Dynamic footer with back-to-top
│   │   ├── navigation/
│   │   │   └── Navbar.jsx   # Sticky navbar with mobile drawer
│   │   ├── sections/
│   │   │   ├── About.jsx    # Narrative bio and core approach
│   │   │   ├── Contact.jsx  # Validated form and direct links
│   │   │   ├── Hero.jsx     # Hero headline, CTAs, and terminal card
│   │   │   ├── Philosophy.jsx # Engineering values
│   │   │   ├── Projects.jsx # Filterable showcase cards
│   │   │   └── Skills.jsx   # Filterable domain skill matrix
│   │   └── ui/
│   │       ├── Badge.jsx    # Status and category badges
│   │       ├── Button.jsx   # Accessible polymorphic button
│   │       ├── Card.jsx     # Standardized dark-tech card
│   │       ├── ProjectMockup.jsx # SVG interface illustrations
│   │       ├── SectionHeading.jsx # Eyebrow and heading component
│   │       └── SocialIcons.jsx   # GitHub and LinkedIn SVG icons
│   ├── config/
│   │   └── site.js          # Centralized personal info & bio
│   ├── data/
│   │   ├── projects.js      # Featured project showcase data
│   │   └── skills.js        # Categorized skills data
│   ├── hooks/
│   │   └── useActiveSection.js # Active navigation scroll hook
│   ├── utils/
│   │   └── index.js         # cn() utility and isSafeUrl() helper
│   ├── App.jsx              # Main application layout
│   ├── index.css            # Tailwind directives and design tokens
│   └── main.jsx             # React DOM entry point
├── .env.example             # Documented environment variables
├── .gitignore               # Git ignore configuration
├── eslint.config.js         # ESLint 9 configuration
├── index.html               # Semantic HTML5 template with SEO meta
├── package.json             # NPM dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Dark Tech Green theme extensions
├── vercel.json              # HTTP Security Headers & CSP configuration
└── README.md                # Comprehensive documentation
```

---

## 5. Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended; verified on v24.22.0)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher; verified on v11.19.1)

### Installation

Clone the repository and install dependencies:

```bash
git clone <your-repository-url>
cd portofolio
npm install
```

### Local Development

Start the Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Linting & Code Quality

Run ESLint to check for syntax issues, unescaped characters, or unused variables:

```bash
npm run lint
```

### Production Build

Compile and bundle for production:

```bash
npm run build
```

The optimized static assets will be output to the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## 6. How to Customize Your Portfolio

All personal information and content are decoupled from UI components. You can customize the site by editing the following files:

### 1. Developer Profile & Bio
Open `src/config/site.js`:
- Replace `name`, `title`, `handle`, `location`, `email`, `githubUrl`, and `linkedinUrl`.
- Update `bioShort` and the paragraphs inside `about.paragraphs`.
- Modify `about.highlights` to match your actual background.

### 2. Technical Skills
Open `src/data/skills.js`:
- Add or modify skills in the respective category (`frontend`, `backend`, `databases`, `tools`, `deployment`).
- Set `status: "established"` for technologies you have built projects with.
- Set `status: "learning"` for technologies you are actively studying.

### 3. Featured Projects
Open `src/data/projects.js`:
- Replace the sample projects with your own repositories.
- Fill in real `title`, `description`, `features`, `techStack`, `githubUrl`, and `demoUrl`.
- Set `isSample: false` once you replace a sample entry with your real project.

### 4. Favicon & Branding
- Replace `public/favicon.svg` with your personal monogram or custom icon.
- Update the `<title>` and Open Graph tags in `index.html`.

---

## 7. Security Best Practices Applied

1. **No Hardcoded Secrets**: Zero API keys or private tokens are stored in source code.
2. **Safe Link Handling**: All external links use `rel="noopener noreferrer"` and are validated with `isSafeUrl()` to reject malicious URL schemes (such as `javascript:` or arbitrary protocols).
3. **HTTP Security Headers**: `vercel.json` configures strict production headers:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
   - `Content-Security-Policy: default-src 'self' ...`
4. **Client-Side Form Validation**: All inputs in the contact form enforce strict length boundaries and regex validation to prevent UI injection and unexpected behavior.

---

## 8. Deploying to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete Dark Tech Green developer portfolio"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com/) and click **Add New Project**.
   - Select your Git repository.
   - Vercel automatically detects **Vite**:
     - **Framework Preset**: `Vite`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Configure Environment Variables (Optional)**:
   - If using a custom contact email or domain, add:
     - `VITE_CONTACT_EMAIL`: your real email address
     - `VITE_SITE_URL`: your production Vercel domain URL (e.g., `https://your-domain.vercel.app`)

4. **Deploy**:
   - Click **Deploy**. Vercel will build and serve your portfolio with global CDN caching and HTTPS.

---

## 9. License

This project is open-source and available under the [MIT License](LICENSE).
