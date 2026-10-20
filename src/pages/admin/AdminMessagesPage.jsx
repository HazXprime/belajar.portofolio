import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import {
  Inbox,
  Mail,
  Trash2,
  Eye,
  X,
} from "lucide-react";

export function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [selectedMessage, setSelectedMessage] = useState(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => api.get("/api/admin/messages"),
  });

  const markReadMutation = useMutation({
    mutationFn: ({ id, isRead }) => api.patch(`/api/admin/messages/${id}/read`, { isRead }),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-messages"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
    },
    onError: (err) => showError(err.message || "Failed to update status."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-messages"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
      showSuccess("Message deleted.");
      if (selectedMessage?.id === deleteMutation.variables) {
        setSelectedMessage(null);
      }
    },
    onError: (err) => showError(err.message || "Failed to delete message."),
  });

  const handleOpenDetail = (msg) => {
    setSelectedMessage(msg);
    if (msg.isRead === 0) {
      markReadMutation.mutate({ id: msg.id, isRead: true });
    }
  };

  const messages = res?.data || [];
  const unreadCount = messages.filter((m) => m.isRead === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20382B] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0FDF4] mb-1">Inquiries Inbox</h1>
          <p className="text-xs text-content-secondary font-mono">
            {unreadCount} unread • Review and reply to client inquiries securely.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 rounded-xl bg-[#0D1B14] border border-[#20382B] animate-pulse" />
      ) : messages.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0D1B14] border border-[#20382B]">
          <Inbox size={32} className="mx-auto text-content-muted mb-2" />
          <h3 className="text-sm font-bold text-[#F0FDF4]">Inbox is empty</h3>
          <p className="text-xs text-content-secondary mt-1">
            New contact submissions from the public website will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-[#0D1B14] border border-[#20382B] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#20382B] text-content-muted font-mono uppercase tracking-wider text-[11px] bg-[#07110D]/40">
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Message Snippet</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20382B]/60 font-mono">
              {messages.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => handleOpenDetail(m)}
                  className={`hover:bg-[#12251A]/60 cursor-pointer transition-colors ${
                    m.isRead === 0 ? "bg-accent-primary/5 font-semibold" : ""
                  }`}
                >
                  <td className="py-3.5 px-4">
                    {m.isRead === 0 ? (
                      <span className="w-2 h-2 rounded-full bg-accent-primary inline-block" title="Unread" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-content-muted/40 inline-block" title="Read" />
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-[#F0FDF4] font-medium">{m.name}</div>
                    <div className="text-[11px] text-content-muted">{m.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-content-secondary font-sans truncate max-w-xs">
                    {m.subject}
                  </td>
                  <td className="py-3.5 px-4 text-content-muted font-sans truncate max-w-sm">
                    {m.message}
                  </td>
                  <td className="py-3.5 px-4 text-content-muted whitespace-nowrap">
                    {m.createdAt.split("T")[0]}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenDetail(m)}
                      className="p-1 text-content-secondary hover:text-accent-primary"
                      title="View Message"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete message from '${m.name}'?`)) {
                          deleteMutation.mutate(m.id);
                        }
                      }}
                      className="p-1 text-content-muted hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Detail Lightbox Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-6 rounded-2xl bg-[#0D1B14] border border-[#20382B] space-y-6">
            <div className="flex items-start justify-between border-b border-[#20382B] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent-secondary font-semibold">
                  Inquiry Details
                </span>
                <h3 className="text-lg font-bold text-[#F0FDF4] mt-1">{selectedMessage.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-content-muted hover:text-[#F0FDF4] p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono p-3 rounded-lg bg-[#12251A] border border-[#243A2C]">
              <div>
                <span className="text-content-muted block">From:</span>
                <span className="text-[#F0FDF4] font-semibold">{selectedMessage.name}</span>
              </div>
              <div>
                <span className="text-content-muted block">Email:</span>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="text-accent-primary hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <span className="text-content-muted block">Received:</span>
                <span className="text-content-secondary">
                  {selectedMessage.createdAt.replace("T", " ").slice(0, 16)}
                </span>
              </div>
              <div>
                <span className="text-content-muted block">Origin Integrity:</span>
                <span className="text-content-secondary">
                  {selectedMessage.ipHash ? `Hash: ${selectedMessage.ipHash}` : "Verified"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-muted block">Message Body:</label>
              <div className="p-4 rounded-xl bg-[#07110D] border border-[#20382B] text-xs sm:text-sm text-content-secondary leading-relaxed whitespace-pre-wrap font-sans max-h-60 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#20382B]">
              <button
                onClick={() => {
                  deleteMutation.mutate(selectedMessage.id);
                }}
                className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <Trash2 size={13} />
                <span>Delete Message</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    markReadMutation.mutate({
                      id: selectedMessage.id,
                      isRead: selectedMessage.isRead === 0,
                    });
                    setSelectedMessage((prev) => ({
                      ...prev,
                      isRead: prev.isRead === 0 ? 1 : 0,
                    }));
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[#20382B] text-xs font-mono text-content-secondary hover:text-[#F0FDF4]"
                >
                  {selectedMessage.isRead === 1 ? "Mark Unread" : "Mark Read"}
                </button>

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="px-4 py-1.5 rounded-lg bg-accent-primary text-bg-primary font-bold text-xs font-mono shadow-glow-sm flex items-center gap-1.5"
                >
                  <Mail size={13} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
