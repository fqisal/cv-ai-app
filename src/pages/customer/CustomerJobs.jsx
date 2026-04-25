import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { StatusBadge } from "../../ui/StatusBadge.jsx";
import { useStore } from "../../mock/store.js";

const tabs = [
  { key: "active", label: "نشطة" },
  { key: "completed", label: "مكتملة" },
  { key: "cancelled", label: "ملغاة/متنازع" }
];

function bucket(status) {
  if (status === "completed") return "completed";
  if (status === "cancelled" || status === "disputed") return "cancelled";
  return "active";
}

export function CustomerJobs() {
  const { state, getCategory } = useStore();
  const nav = useNavigate();
  const [tab, setTab] = React.useState("active");

  const jobs = state.jobs
    .filter((j) => j.customer_id === state.ui.actorUserId)
    .filter((j) => bucket(j.status) === tab)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  const requestById = React.useMemo(() => new Map(state.requests.map((r) => [r.id, r])), [state.requests]);
  const convByJob = React.useMemo(() => new Map(state.conversations.map((c) => [c.job_id, c])), [state.conversations]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[30px] font-bold text-[var(--zinc-900)]">مشاريعي</div>
          <div className="text-[13px] text-[var(--zinc-600)]">تابع حالة المشروع والمحادثة والتأكيد</div>
        </div>
        <Button variant="secondary" onClick={() => nav("/")}>
          ← الرئيسية
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={
              "rounded-full border px-4 py-2 text-[12px] font-bold transition " +
              (tab === t.key
                ? "bg-[var(--green-600)] text-white border-[var(--green-600)]"
                : "bg-white text-[var(--zinc-700)] border-[var(--zinc-200)] hover:bg-[var(--zinc-50)]")
            }
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {jobs.map((j, idx) => {
          const r = requestById.get(j.request_id);
          const cat = r ? getCategory(r.category_id) : null;
          const conv = convByJob.get(j.id);
          return (
            <Card key={j.id} className="p-6 animate-cardReveal" style={{ animationDelay: `${Math.min(idx, 6) * 50}ms` }}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-[17px] font-bold text-[var(--zinc-900)]">{r?.title ?? "—"}</div>
                    <StatusBadge status={j.status} />
                    {cat ? (
                      <span className="rounded-full border border-[var(--zinc-200)] bg-white px-3 py-1 text-[11px] font-bold text-[var(--zinc-700)]">
                        {cat.name}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-[13px] text-[var(--zinc-600)]">{r?.location_text ?? "—"}</div>
                  <div className="mt-1 text-[12px] text-[var(--zinc-500)]">
                    {new Date(j.created_at).toLocaleString("ar-SA")}
                    {j.scheduled_date ? ` · موعد: ${j.scheduled_date}` : ""}
                  </div>
                </div>

                <div className="flex gap-2">
                  {conv ? (
                    <Button onClick={() => nav(`/chat/${conv.id}`)}>فتح المحادثة</Button>
                  ) : (
                    <Button variant="secondary" disabled>
                      لا توجد محادثة
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => nav(`/requests/${j.request_id}`)}>
                    تفاصيل الطلب
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {jobs.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="text-[15px] font-bold text-[var(--zinc-900)]">لا توجد مشاريع في هذا القسم</div>
            <div className="mt-1 text-[13px] text-[var(--zinc-600)]">عند اختيار عرض سعر سيتم إنشاء مشروع تلقائياً.</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

