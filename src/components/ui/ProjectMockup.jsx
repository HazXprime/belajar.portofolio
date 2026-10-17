import { Activity, Kanban, ShieldCheck, BarChart3 } from "lucide-react";

export function ProjectMockup({ type }) {
  switch (type) {
    case "dashboard":
      return (
        <div className="w-full h-48 bg-bg-secondary p-4 flex flex-col justify-between font-mono text-[11px] border-b border-border select-none overflow-hidden relative">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <span className="flex items-center gap-1.5 text-accent-primary">
              <Activity size={14} className="animate-pulse" />
              <span>SYSTEM METRICS: OPERATIONAL</span>
            </span>
            <span className="text-content-muted">99.98% UPTIME</span>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2">
            <div className="bg-bg-card p-2 rounded border border-border-subtle">
              <span className="text-[10px] text-content-muted block">Avg Latency</span>
              <span className="text-xs font-bold text-accent-primary">42ms</span>
            </div>
            <div className="bg-bg-card p-2 rounded border border-border-subtle">
              <span className="text-[10px] text-content-muted block">Requests</span>
              <span className="text-xs font-bold text-content-primary">124.5k</span>
            </div>
            <div className="bg-bg-card p-2 rounded border border-border-subtle">
              <span className="text-[10px] text-content-muted block">Errors</span>
              <span className="text-xs font-bold text-emerald-400">0.01%</span>
            </div>
          </div>

          <div className="flex items-end gap-1.5 h-12 pt-2 border-t border-border-subtle">
            {[40, 65, 30, 85, 45, 90, 70, 60, 95, 80, 50, 85, 92, 78].map((val, i) => (
              <div
                key={i}
                className="flex-1 bg-accent-primary/40 rounded-t hover:bg-accent-primary transition-colors"
                style={{ height: `${val}%` }}
              />
            ))}
          </div>
        </div>
      );

    case "kanban":
      return (
        <div className="w-full h-48 bg-bg-secondary p-4 flex flex-col justify-between font-mono text-[11px] border-b border-border select-none overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <span className="flex items-center gap-1.5 text-accent-secondary">
              <Kanban size={14} />
              <span>SPRINT BOARD: ACTIVE</span>
            </span>
            <span className="text-content-muted">3 Columns</span>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2 h-24">
            <div className="bg-bg-card/80 p-2 rounded border border-border-subtle flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-wider text-content-muted">Todo (2)</span>
              <div className="p-1 rounded bg-bg-elevated border border-border text-[9px] text-content-secondary truncate">
                Configure CORS
              </div>
              <div className="p-1 rounded bg-bg-elevated border border-border text-[9px] text-content-secondary truncate">
                ARIA labels
              </div>
            </div>
            <div className="bg-bg-card/80 p-2 rounded border border-border-subtle flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-wider text-amber-300">In Progress</span>
              <div className="p-1 rounded bg-accent-dim border border-accent-primary/30 text-[9px] text-accent-primary truncate">
                JWT Auth flow
              </div>
            </div>
            <div className="bg-bg-card/80 p-2 rounded border border-border-subtle flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-wider text-emerald-400">Done (4)</span>
              <div className="p-1 rounded bg-bg-elevated border border-border text-[9px] text-content-secondary truncate">
                Vite config
              </div>
              <div className="p-1 rounded bg-bg-elevated border border-border text-[9px] text-content-secondary truncate">
                Tailwind tokens
              </div>
            </div>
          </div>
        </div>
      );

    case "security":
      return (
        <div className="w-full h-48 bg-bg-secondary p-4 flex flex-col justify-between font-mono text-[11px] border-b border-border select-none overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <span className="flex items-center gap-1.5 text-accent-primary">
              <ShieldCheck size={14} />
              <span>CRYPTO PROTOCOL: AES-GCM-256</span>
            </span>
            <span className="text-amber-400">SELF-DESTRUCT ON</span>
          </div>

          <div className="p-2.5 rounded bg-bg-card border border-border-subtle my-auto">
            <div className="flex items-center justify-between text-[10px] text-content-muted mb-1">
              <span>Encrypted Payload:</span>
              <span className="text-accent-secondary">Ciphertext Ready</span>
            </div>
            <div className="bg-bg-primary p-1.5 rounded text-[10px] text-accent-hover font-mono truncate">
              e5f8a092b3c4d7...9102abf12c84 (256-bit encrypted)
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-content-muted pt-2 border-t border-border-subtle">
            <span>Views Remaining: 1</span>
            <span className="text-emerald-400">Zero Persistent Logs</span>
          </div>
        </div>
      );

    case "analytics":
    default:
      return (
        <div className="w-full h-48 bg-bg-secondary p-4 flex flex-col justify-between font-mono text-[11px] border-b border-border select-none overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <span className="flex items-center gap-1.5 text-accent-primary">
              <BarChart3 size={14} />
              <span>GITHUB PROFILE TELEMETRY</span>
            </span>
            <span className="text-content-muted">REST API v3</span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-auto">
            <div className="bg-bg-card p-2 rounded border border-border-subtle">
              <span className="text-[10px] text-content-muted block">Main Languages</span>
              <span className="text-xs font-semibold text-content-primary">JS 64% • TS 28%</span>
            </div>
            <div className="bg-bg-card p-2 rounded border border-border-subtle">
              <span className="text-[10px] text-content-muted block">Activity Frequency</span>
              <span className="text-xs font-semibold text-accent-primary">Consistent PRs</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-content-muted pt-2 border-t border-border-subtle">
            <span>Repo Count: 14 Public</span>
            <span className="text-accent-secondary">Synced</span>
          </div>
        </div>
      );
  }
}
