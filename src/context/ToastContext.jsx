import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback((msg, duration) => addToast(msg, "success", duration), [addToast]);
  const showError = useCallback((msg, duration) => addToast(msg, "error", duration), [addToast]);
  const showInfo = useCallback((msg, duration) => addToast(msg, "info", duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, showSuccess, showError, showInfo }}>
      {children}
      {/* Toast container floating top right */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
              toast.type === "success"
                ? "bg-[#0D1F15] border-[#22C55E]/40 text-[#F0FDF4]"
                : toast.type === "error"
                ? "bg-[#2A0F0F] border-red-500/40 text-red-100"
                : "bg-[#102019] border-[#20382B] text-content-primary"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-accent-hover shrink-0 mt-0.5" />}
            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-content-muted hover:text-content-primary transition-colors p-0.5 rounded"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
