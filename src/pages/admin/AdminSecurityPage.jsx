import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  Key,
  ShieldCheck,
  Activity,
} from "lucide-react";

export function AdminSecurityPage() {
  const { admin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data: logsRes, isLoading: logsLoading } = useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: () => api.get("/api/admin/audit-logs"),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => api.post("/api/auth/change-password", data),
    onSuccess: () => {
      showSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err) => showError(err.message || "Failed to change password."),
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showError("Please fill in current and new password.");
      return;
    }
    if (newPassword.length < 8) {
      showError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("New password and confirmation do not match.");
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const logs = logsRes?.data || [];

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-[#20382B] pb-4">
        <h1 className="text-2xl font-bold text-[#F0FDF4] mb-1">Security & Audit Center</h1>
        <p className="text-xs text-content-secondary font-mono">
          Cryptographic password management, active session parameters, and complete system audit trail.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Change Password Form */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold flex items-center gap-2">
            <Key size={14} />
            <span>Update Master Password</span>
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-content-secondary block">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-content-secondary block">New Password (Min 8 chars)</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-content-secondary block">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#12251A] border border-[#243A2C] rounded-lg px-3 py-2 text-[#F0FDF4] focus:border-accent-primary"
              />
            </div>

            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="w-full py-2.5 rounded-lg bg-accent-primary hover:bg-accent-hover text-bg-primary font-bold shadow-glow-sm disabled:opacity-50 transition-colors"
            >
              {changePasswordMutation.isPending ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Security Architecture & Session Status */}
        <div className="p-6 rounded-xl bg-[#0D1B14] border border-[#20382B] space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-accent-secondary font-semibold flex items-center gap-2">
            <ShieldCheck size={14} />
            <span>Active Security Protocols</span>
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#12251A] border border-[#243A2C] space-y-1">
              <span className="text-content-muted block text-[10px] uppercase">Hashing Standard</span>
              <span className="text-[#F0FDF4] font-bold">bcryptjs (12 salt rounds)</span>
            </div>

            <div className="p-3 rounded-lg bg-[#12251A] border border-[#243A2C] space-y-1">
              <span className="text-content-muted block text-[10px] uppercase">Session Storage</span>
              <span className="text-accent-primary font-bold">
                HttpOnly, Secure Cookie + SHA-256 in Turso DB
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#12251A] border border-[#243A2C] space-y-1">
              <span className="text-content-muted block text-[10px] uppercase">Rate Limiting</span>
              <span className="text-[#F0FDF4] font-bold">
                Active (10 req/15m for Auth, 5 req/15m for Contact)
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#12251A] border border-[#243A2C] space-y-1">
              <span className="text-content-muted block text-[10px] uppercase">Authenticated Admin</span>
              <span className="text-content-secondary truncate block">
                {admin?.email} ({admin?.role})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#20382B] pb-3">
          <h3 className="text-base font-bold text-[#F0FDF4] flex items-center gap-2">
            <Activity size={16} className="text-accent-secondary" />
            <span>System Audit Trail</span>
          </h3>
          <span className="text-xs font-mono text-content-muted">{logs.length} logged events</span>
        </div>

        {logsLoading ? (
          <div className="h-48 rounded-xl bg-[#0D1B14] border border-[#20382B] animate-pulse" />
        ) : logs.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[#0D1B14] border border-[#20382B] text-xs font-mono text-content-muted">
            No audit records found.
          </div>
        ) : (
          <div className="rounded-xl bg-[#0D1B14] border border-[#20382B] overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead className="sticky top-0 bg-[#0B1711] border-b border-[#20382B] text-content-muted text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Entity Type</th>
                  <th className="py-2.5 px-4">Entity ID</th>
                  <th className="py-2.5 px-4">IP Address</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20382B]/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#12251A]/50">
                    <td className="py-2.5 px-4 text-accent-primary font-bold">
                      {log.action.replace(/_/g, " ")}
                    </td>
                    <td className="py-2.5 px-4 text-content-secondary">{log.entityType}</td>
                    <td className="py-2.5 px-4 text-content-muted truncate max-w-[120px]">
                      {log.entityId || "—"}
                    </td>
                    <td className="py-2.5 px-4 text-content-muted">{log.ipAddress || "—"}</td>
                    <td className="py-2.5 px-4 text-content-muted whitespace-nowrap">
                      {log.createdAt.replace("T", " ").slice(0, 19)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
