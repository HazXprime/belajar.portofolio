import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Terminal, Lock, Mail, ArrowRight } from "lucide-react";

export function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, admin } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  // If already logged in, redirect
  if (admin) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        showSuccess("Authenticated successfully. Welcome back!");
        navigate(from, { replace: true });
      }
    } catch (err) {
      showError(err.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07110D] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#0D1B14] border border-[#20382B] flex items-center justify-center text-accent-primary mx-auto shadow-glow-sm">
            <Terminal size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-[#F0FDF4] tracking-tight">
            Admin CMS Authentication
          </h1>
          <p className="text-xs text-content-secondary font-mono">
            Restricted access portal for portfolio content management
          </p>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-2xl bg-[#0D1B14] border border-[#20382B] shadow-card-dark">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary block">
                Administrator Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-[#F0FDF4] placeholder:text-content-muted focus:outline-none focus:border-accent-primary font-mono transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-secondary block">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-[#F0FDF4] placeholder:text-content-muted focus:outline-none focus:border-accent-primary font-mono transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs font-mono transition-all shadow-glow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 mt-6 border-t border-[#20382B] text-center">
            <Link
              to="/"
              className="text-xs font-mono text-content-muted hover:text-accent-primary transition-colors"
            >
              &larr; Return to public portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
