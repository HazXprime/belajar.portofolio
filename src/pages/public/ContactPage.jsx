import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { siteConfig } from "../../config/site";
import {
  Mail,
  Send,
  MapPin,
  Clock,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
  honeypot: z.string().optional(),
});

export function ContactPage() {
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await api.post("/api/contact", data);
      if (res.success) {
        showSuccess(res.message || "Message sent successfully!");
        setSubmitted(true);
        reset();
      }
    } catch (err) {
      showError(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-accent-secondary uppercase tracking-wider font-semibold">
          <MessageSquare size={14} />
          <span>Direct Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F0FDF4] tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm sm:text-base text-content-secondary leading-relaxed">
          Open to full-stack engineering roles, technical contracting, and software architecture consultations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#12251A] border border-[#243A2C] flex items-center justify-center text-accent-primary">
                <Mail size={18} />
              </div>
              <div>
                <span className="text-xs font-mono text-content-muted block">Direct Email</span>
                <a
                  href={`mailto:${siteConfig.developer.email}`}
                  className="text-sm font-semibold text-[#F0FDF4] hover:text-accent-primary transition-colors font-mono"
                >
                  {siteConfig.developer.email}
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#12251A] border border-[#243A2C] flex items-center justify-center text-accent-primary">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-xs font-mono text-content-muted block">Location / Timezone</span>
                <span className="text-sm font-semibold text-[#F0FDF4]">
                  {siteConfig.developer.location} (UTC+7)
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#12251A] border border-[#243A2C] flex items-center justify-center text-accent-primary">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-xs font-mono text-content-muted block">Availability Status</span>
                <span className="text-sm font-semibold text-accent-secondary">
                  {siteConfig.developer.availabilityStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#07110D] border border-[#20382B]/60 space-y-2">
            <h4 className="text-xs font-mono text-content-muted uppercase tracking-wider font-semibold">
              Security Guarantee
            </h4>
            <p className="text-xs text-content-secondary leading-relaxed">
              Your inquiry is transmitted via HTTPS and stored in a rate-limited relational database. No email addresses or contact details are shared or published.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-2xl bg-[#0D1B14] border border-[#20382B] shadow-card-dark">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-accent-primary/20 border border-accent-primary flex items-center justify-center text-accent-primary mx-auto shadow-glow-sm">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#F0FDF4]">Message Sent Successfully</h3>
                <p className="text-xs sm:text-sm text-content-secondary max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Your message has been safely recorded in the database, and I will review it promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-lg border border-[#20382B] bg-[#12251A] hover:border-accent-primary text-xs font-mono text-accent-primary transition-colors"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <h3 className="text-lg font-bold text-[#F0FDF4] mb-2">Send an Inquiry</h3>

                {/* Honeypot field (hidden from screen reader & users) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="hp_field">Website Trap</label>
                  <input
                    id="hp_field"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("honeypot")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-content-secondary block">
                      Your Name <span className="text-accent-primary">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      {...register("name")}
                      className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3.5 py-2.5 text-xs text-[#F0FDF4] placeholder:text-content-muted focus:outline-none focus:border-accent-primary font-mono transition-colors"
                    />
                    {errors.name && (
                      <span className="text-[11px] font-mono text-red-400 block">
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-content-secondary block">
                      Email Address <span className="text-accent-primary">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      {...register("email")}
                      className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3.5 py-2.5 text-xs text-[#F0FDF4] placeholder:text-content-muted focus:outline-none focus:border-accent-primary font-mono transition-colors"
                    />
                    {errors.email && (
                      <span className="text-[11px] font-mono text-red-400 block">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-content-secondary block">
                    Subject <span className="text-accent-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Full-Stack Engineer Opportunity"
                    {...register("subject")}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3.5 py-2.5 text-xs text-[#F0FDF4] placeholder:text-content-muted focus:outline-none focus:border-accent-primary font-mono transition-colors"
                  />
                  {errors.subject && (
                    <span className="text-[11px] font-mono text-red-400 block">
                      {errors.subject.message}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-content-secondary block">
                    Message Body <span className="text-accent-primary">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe your project, team requirements, or position..."
                    {...register("message")}
                    className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3.5 py-2.5 text-xs text-[#F0FDF4] placeholder:text-content-muted focus:outline-none focus:border-accent-primary font-mono transition-colors resize-none leading-relaxed"
                  />
                  {errors.message && (
                    <span className="text-[11px] font-mono text-red-400 block">
                      {errors.message.message}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs font-mono transition-all shadow-glow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
