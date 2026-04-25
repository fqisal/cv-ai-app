import React from "react";
import clsx from "clsx";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

const ToastContext = React.createContext(null);

const variants = {
  success: { icon: CheckCircle2, border: "border-[var(--green-600)]", bg: "bg-white" },
  warning: { icon: AlertTriangle, border: "border-[var(--amber-500)]", bg: "bg-white" },
  error: { icon: XCircle, border: "border-red-500", bg: "bg-white" },
  info: { icon: Info, border: "border-blue-500", bg: "bg-white" }
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const push = React.useCallback((toast) => {
    const id = `toast_${Math.floor(Math.random() * 900000 + 100000)}`;
    const t = { id, variant: "info", ttlMs: 4000, ...toast };
    setToasts((x) => [t, ...x].slice(0, 5));
    window.setTimeout(() => setToasts((x) => x.filter((y) => y.id !== id)), t.ttlMs);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed top-4 left-1/2 z-[9999] -translate-x-1/2 space-y-2">
        {toasts.map((t) => {
          const v = variants[t.variant] ?? variants.info;
          const Icon = v.icon;
          return (
            <div
              key={t.id}
              className={clsx(
                "w-[min(92vw,520px)] rounded-[14px] border-r-4 shadow-[0_8px_32px_rgba(0,0,0,0.10)]",
                v.bg,
                v.border
              )}
              style={{ animation: "pageEnter 250ms cubic-bezier(0.34,1.56,0.64,1) both" }}
              role="status"
            >
              <div className="flex items-start gap-3 p-3">
                <div className="mt-0.5">
                  <Icon className="h-5 w-5 text-[var(--zinc-700)]" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-[var(--zinc-900)]">{t.title}</div>
                  {t.message ? <div className="text-[13px] text-[var(--zinc-600)]">{t.message}</div> : null}
                </div>
                <button
                  className="rounded-[10px] p-1 hover:bg-[var(--zinc-100)]"
                  onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
                  aria-label="close"
                >
                  <X className="h-4 w-4 text-[var(--zinc-600)]" />
                </button>
              </div>
              <div className="h-1 w-full bg-[var(--zinc-100)]">
                <div className="h-1 bg-[var(--green-600)]" style={{ width: "100%", animation: `toastTTL ${t.ttlMs}ms linear both` }} />
              </div>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes toastTTL{from{width:100%}to{width:0%}}`}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

