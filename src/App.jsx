import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

// Layouts
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

// Public Pages
import { HomePage } from "./pages/public/HomePage";
import { AboutPage } from "./pages/public/AboutPage";
import { ProjectsPage } from "./pages/public/ProjectsPage";
import { ProjectDetailPage } from "./pages/public/ProjectDetailPage";
import { SkillsPage } from "./pages/public/SkillsPage";
import { BlogPage } from "./pages/public/BlogPage";
import { BlogPostDetailPage } from "./pages/public/BlogPostDetailPage";
import { ContactPage } from "./pages/public/ContactPage";
import { NotFoundPage } from "./pages/public/NotFoundPage";

// Admin Pages
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminProfilePage } from "./pages/admin/AdminProfilePage";
import { AdminProjectsPage } from "./pages/admin/AdminProjectsPage";
import { AdminProjectFormPage } from "./pages/admin/AdminProjectFormPage";
import { AdminSkillsPage } from "./pages/admin/AdminSkillsPage";
import { AdminExperiencePage } from "./pages/admin/AdminExperiencePage";
import { AdminEducationPage } from "./pages/admin/AdminEducationPage";
import { AdminBlogPage } from "./pages/admin/AdminBlogPage";
import { AdminBlogFormPage } from "./pages/admin/AdminBlogFormPage";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";
import { AdminTagsPage } from "./pages/admin/AdminTagsPage";
import { AdminMediaPage } from "./pages/admin/AdminMediaPage";
import { AdminMessagesPage } from "./pages/admin/AdminMessagesPage";
import { AdminNavigationPage } from "./pages/admin/AdminNavigationPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";
import { AdminSecurityPage } from "./pages/admin/AdminSecurityPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60 * 1000,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Website Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Admin CMS Protected Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
                <Route path="projects" element={<AdminProjectsPage />} />
                <Route path="projects/new" element={<AdminProjectFormPage />} />
                <Route path="projects/:id/edit" element={<AdminProjectFormPage />} />
                <Route path="skills" element={<AdminSkillsPage />} />
                <Route path="experience" element={<AdminExperiencePage />} />
                <Route path="education" element={<AdminEducationPage />} />
                <Route path="blog" element={<AdminBlogPage />} />
                <Route path="blog/new" element={<AdminBlogFormPage />} />
                <Route path="blog/:id/edit" element={<AdminBlogFormPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="tags" element={<AdminTagsPage />} />
                <Route path="media" element={<AdminMediaPage />} />
                <Route path="messages" element={<AdminMessagesPage />} />
                <Route path="navigation" element={<AdminNavigationPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="security" element={<AdminSecurityPage />} />
              </Route>

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
