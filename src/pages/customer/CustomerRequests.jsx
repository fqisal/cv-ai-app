import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../ui/Card.jsx";
import { StatusBadge } from "../../ui/StatusBadge.jsx";
import { useStore } from "../../mock/store.js";
import { Button } from "../../ui/Button.jsx";

const tabs = [
  { key: "all", label: "الكل" },
  { key: "open", label: "مفتوح" },
  { key: "in_progress", label: "قيد التنفيذ" },
  { key: "completed", label: "مكتمل" },
  { key: "cancelled", label: "ملغي" },
  { key: "expired", label: "منتهي" }
];

export function CustomerRequests() {
  const { state, derived, getCategory, getUser } = useStore();
  const nav = useNavigate();
  const [tab, setTab] = React.useState("all");

  const mine = state.requests
    .filter((r) => r.customer_id === state.ui.actorUserId)
    .filter((r) => (tab === "all" ? true : r.status === tab))
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  const counts = React.useMemo(() => {
    const c = { all: 0 };
    for (const t of tabs) c[t.key] = 0;
    for (const r of state.requests.filter((x) => x.customer_id === state.ui.actorUserId)) {
      c.all += 1;
      c[r.status] = (c[r.status] ?? 0) + 1;
    }
    return c;
  }, [state.requests, state.ui.actorUserId]);

  const actor = getUser(state.ui.actorUserId);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[30px] font-bold text-[var(--zinc-900)]">طلباتي</div>
          <div className="text-[13px] text-[var(--zinc-600)]">مرحباً {actor?.full_name ?? ""} — استعرض الطلبات وحالاتها</div>
        </div>
        <Button onClick={() => nav("/")}>← الرئيسية</Button>
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
            <span className="mr-2 inline-grid min-w-6 place-items-center rounded-full bg-black/10 px-2 py-0.5 text-[11px]">
              {counts[t.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mine.map((r, idx) => {
          const cat = getCategory(r.category_id);
          const quoteCount = (derived.quotesByRequest.get(r.id) ?? []).length;
          const media = state.request_media.filter((m) => m.request_id === r.id).slice(0, 3);
          return (
            <Card
              key={r.id}
              className="p-5 animate-cardReveal"
              style={{ animationDelay: `${Math.min(idx, 6) * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2">
                    <span className="rounded-full border border-[var(--zinc-200)] bg-white px-3 py-1 text-[11px] font-bold text-[var(--zinc-700)]">
                      {cat?.name ?? "—"}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>

                  <div className="mt-2 text-[17px] font-bold text-[var(--zinc-900)]">{r.title}</div>
                  <div className="mt-1 text-[13px] text-[var(--zinc-600)]">{r.description}</div>

                  <div className="mt-2 text-[12px] text-[var(--zinc-500)]">
                    {r.location_text} · {new Date(r.created_at).toLocaleDateString("ar-SA")} · {quoteCount} عروض
                  </div>

                  {media.length ? (
                    <div className="mt-3 flex gap-2">
                      {media.map((m) => (
                        <img
                          key={m.id}
                          src={m.file_url}
                          alt="media"
                          className="h-14 w-14 rounded-[12px] object-cover border border-[var(--zinc-200)]"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  <Button variant="secondary" onClick={() => nav(`/requests/${r.id}`)}>
                    عرض التفاصيل ←
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {mine.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="text-[15px] font-bold text-[var(--zinc-900)]">لا توجد نتائج</div>
            <div className="mt-1 text-[13px] text-[var(--zinc-600)]">جرّب تغيير الفلتر أو إنشاء طلب جديد.</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

