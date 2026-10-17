import React, { useState } from "react";
import { siteConfig } from "../../config/site";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Mail, Send, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/SocialIcons";
import { isSafeUrl } from "../../utils";

export function Contact() {
  const { developer } = siteConfig;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | validating | submitted

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 80) {
      newErrors.name = "Name cannot exceed 80 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length > 120) {
      newErrors.subject = "Subject cannot exceed 120 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    } else if (formData.message.length > 2000) {
      newErrors.message = "Message cannot exceed 2000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitted");
    // Fallback: Trigger default mail client with encoded parameters
    const mailtoUrl = `mailto:${developer.email}?subject=${encodeURIComponent(
      `[Portfolio Inquiry] ${formData.subject}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;

    window.location.href = mailtoUrl;
  };

  return (
    <section id="contact" className="py-20 sm:py-28 border-t border-border/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Initiate Contact"
          title="Let's Build Something Together"
          description="Interested in collaborating on a web project, discussing an engineering role, or chatting about software architecture? Reach out below."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Communication Channels (Left Column) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-content-primary mb-2">
                Direct Channels
              </h3>
              <p className="text-xs sm:text-sm text-content-secondary leading-relaxed mb-6">
                I am actively seeking junior full-stack developer opportunities and select freelance collaborations.
              </p>

              <div className="space-y-4">
                {/* Email Direct Card */}
                <a
                  href={`mailto:${developer.email}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-bg-secondary border border-border hover:border-accent-primary/50 transition-colors group focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <div className="p-2.5 rounded-lg bg-accent-dim text-accent-primary group-hover:scale-105 transition-transform">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-mono uppercase tracking-wider text-content-muted">
                      Email Address
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-medium text-content-primary group-hover:text-accent-primary transition-colors">
                      {developer.email}
                    </span>
                  </div>
                </a>

                {/* GitHub Direct Card */}
                {isSafeUrl(developer.githubUrl) && (
                  <a
                    href={developer.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-bg-secondary border border-border hover:border-accent-primary/50 transition-colors group focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  >
                    <div className="p-2.5 rounded-lg bg-accent-dim text-accent-primary group-hover:scale-105 transition-transform">
                      <GithubIcon size={18} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-mono uppercase tracking-wider text-content-muted">
                        GitHub Profile
                      </span>
                      <span className="text-xs sm:text-sm font-mono font-medium text-content-primary group-hover:text-accent-primary transition-colors">
                        Review repositories & commits
                      </span>
                    </div>
                  </a>
                )}

                {/* LinkedIn Direct Card */}
                {isSafeUrl(developer.linkedinUrl) && (
                  <a
                    href={developer.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-bg-secondary border border-border hover:border-accent-primary/50 transition-colors group focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  >
                    <div className="p-2.5 rounded-lg bg-accent-dim text-accent-primary group-hover:scale-105 transition-transform">
                      <LinkedinIcon size={18} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-mono uppercase tracking-wider text-content-muted">
                        LinkedIn Network
                      </span>
                      <span className="text-xs sm:text-sm font-mono font-medium text-content-primary group-hover:text-accent-primary transition-colors">
                        Connect professionally
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </Card>

            {/* Architecture Transparency Note */}
            <div className="p-4 rounded-xl bg-bg-card/70 border border-border text-xs text-content-secondary space-y-2">
              <div className="flex items-center gap-2 text-accent-secondary font-mono font-semibold">
                <ShieldAlert size={16} />
                <span>Security & Form Delivery Architecture</span>
              </div>
              <p className="text-[11px] leading-relaxed text-content-muted">
                To guarantee zero unauthorized credential exposure in client-side bundles, this form generates a secure mailto dispatch. For automated serverless webhook routing (e.g., Resend, Formspree), see the setup guide in the README.
              </p>
            </div>
          </div>

          {/* Contact Message Form (Right Column) */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-content-primary mb-1">
                Send a Structured Message
              </h3>
              <p className="text-xs sm:text-sm text-content-secondary mb-6">
                All fields include client validation and length boundaries.
              </p>

              {status === "submitted" && (
                <div className="mb-6 p-4 rounded-xl bg-accent-dim border border-accent-primary/40 flex items-start gap-3 text-accent-primary text-xs sm:text-sm">
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Inquiry prepared successfully!</p>
                    <p className="text-content-secondary text-xs mt-1">
                      Your default mail application has been prompted with the formatted message. You can also contact directly at {developer.email}.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-mono text-content-secondary mb-1.5"
                    >
                      Your Name <span className="text-accent-primary">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      maxLength={80}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Jane Doe"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-bg-secondary border text-content-primary placeholder:text-content-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary transition-colors ${
                        errors.name ? "border-rose-500/80" : "border-border hover:border-border-highlight"
                      }`}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-xs text-rose-400 flex items-center gap-1 font-mono">
                        <AlertCircle size={12} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-mono text-content-secondary mb-1.5"
                    >
                      Email Address <span className="text-accent-primary">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      maxLength={100}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-bg-secondary border text-content-primary placeholder:text-content-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary transition-colors ${
                        errors.email ? "border-rose-500/80" : "border-border hover:border-border-highlight"
                      }`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-xs text-rose-400 flex items-center gap-1 font-mono">
                        <AlertCircle size={12} />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject Input */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-mono text-content-secondary mb-1.5"
                  >
                    Subject <span className="text-accent-primary">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    maxLength={120}
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Full-Stack Developer Opportunity / Project Inquiry"
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-bg-secondary border text-content-primary placeholder:text-content-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary transition-colors ${
                      errors.subject ? "border-rose-500/80" : "border-border hover:border-border-highlight"
                    }`}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                  />
                  {errors.subject && (
                    <p id="subject-error" className="mt-1 text-xs text-rose-400 flex items-center gap-1 font-mono">
                      <AlertCircle size={12} />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-mono text-content-secondary"
                    >
                      Message Body <span className="text-accent-primary">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-content-muted">
                      {formData.message.length} / 2000
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    maxLength={2000}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Detail your inquiry, project scope, or opportunity..."
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-bg-secondary border text-content-primary placeholder:text-content-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary transition-colors resize-y ${
                      errors.message ? "border-rose-500/80" : "border-border hover:border-border-highlight"
                    }`}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-xs text-rose-400 flex items-center gap-1 font-mono">
                      <AlertCircle size={12} />
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">
                  <Send size={16} />
                  <span>Send Message via Mail Client</span>
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
