import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Save, Globe } from "lucide-react";

export function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const [settings, setSettings] = useState({
    site_name: "",
    site_tagline: "",
    site_description: "",
    contact_email: "",
    allow_contact_form: "true",
  });

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => api.get("/api/admin/settings"),
  });

  useEffect(() => {
    if (res?.data) {
      setSettings((prev) => ({
        ...prev,
        ...res.data,
      }));
    }
  }, [res]);

  const updateMutation = useMutation({
    mutationFn: (data) => api.put("/api/admin/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-settings"]);
      queryClient.invalidateQueries(["settings"]);
      showSuccess("Settings updated successfully!");
    },
    onError: (err) => showError(err.message || "Failed to update settings."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(settings);
  };

  if (isLoading) {
    return <div className="text-xs font-mono text-content-muted p-8">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-[#20382B] pb-4">
        <h1 className="text-2xl font-bold text-[#F0FDF4] mb-1">Global Site Configuration</h1>
        <p className="text-xs text-content-secondary font-mono">
          Configure site-wide metadata, SEO defaults, and inquiry notification settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold flex items-center gap-2">
            <Globe size={14} />
            <span>SEO & Branding</span>
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-content-secondary block">Site Brand Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-content-secondary block">Site Headline / Tagline</label>
              <input
                type="text"
                value={settings.site_tagline}
                onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-content-secondary block">Global Meta Description</label>
              <textarea
                rows={3}
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary font-sans"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold">
            Contact & Notifications
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-content-secondary block">Contact Recipient Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="allowForm"
                checked={settings.allow_contact_form === "true"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    allow_contact_form: e.target.checked ? "true" : "false",
                  })
                }
                className="w-4 h-4 rounded text-accent-primary bg-[#12251A] border-[#243A2C]"
              />
              <label htmlFor="allowForm" className="text-content-secondary cursor-pointer">
                Enable Public Contact Submission Form
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-semibold text-xs font-mono transition-colors shadow-glow-sm flex items-center gap-2"
          >
            <Save size={15} />
            <span>{updateMutation.isPending ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
