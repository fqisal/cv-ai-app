import React from "react";
import { Card } from "../../ui/Card.jsx";
import { StatusBadge } from "../../ui/StatusBadge.jsx";
import { useStore } from "../../mock/store.js";
import { Button } from "../../ui/Button.jsx";

const columns = [
  { key: "pending_confirmation", label: "بانتظار التأكيد" },
  { key: "active", label: "نشط" },
  { key: "completed", label: "مكتمل" },
  { key: "disputed", label: "متنازع" },
  { key: "cancelled", label: "ملغي" }
];

export function AdminJobs() {
  const { state } = useStore();
  const [view, setView] = React.useState("list"); // list | kanban

  const requestById = new Map(state.requests.map((r) => [r.id, r]));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[30px] font-bold text-[var(--zinc-900)]">المشاريع</div>
          <div className="text-[13px] text-[var(--zinc-600)]">قائمة + كانبان لسهولة المتابعة</div>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "list" ? "primary" : "secondary"} onClick={() => setView("list")}>
            قائمة
          </Button>
          <Button variant={view === "kanban" ? "primary" : "secondary"} onClick={() => setView("kanban")}>
            كانبان
          </Button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          {columns.map((col) => {
            const items = state.jobs.filter((j) => j.status === col.key);
            return (
              <div key={col.key} className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-bold text-[var(--zinc-900)]">{col.label}</div>
                  <div className="rounded-full bg-[var(--zinc-100)] px-2 py-0.5 text-[11px] font-bold">{items.length}</div>
                </div>
                <div className="mt-3 space-y-3">
                  {items.map((j) => {
                    const r = requestById.get(j.request_id);
                    return (
                      <Card key={j.id} className="p-4 hover:-translate-y-0">
                        <div className="text-[12px] font-bold text-[var(--zinc-900)]">{r?.title ?? "—"}</div>
                        <div className="mt-1 text-[11px] text-[var(--zinc-500)]">{j.id}</div>
                        <div className="mt-2">
                          <StatusBadge status={j.status} />
                        </div>
                      </Card>
                    );
                  })}
                  {items.length === 0 ? <div className="text-[12px] text-[var(--zinc-500)]">لا يوجد</div> : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {state.jobs
            .slice()
            .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
            .map((j) => {
              const r = requestById.get(j.request_id);
              return (
                <div key={j.id} className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4 hover:bg-[var(--green-50)] transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-[var(--zinc-900)]">{r?.title ?? "—"}</div>
                      <div className="mt-1 text-[12px] text-[var(--zinc-500)]">
                        {j.id} · {new Date(j.created_at).toLocaleString("ar-SA")}
                      </div>
                    </div>
                    <StatusBadge status={j.status} />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

