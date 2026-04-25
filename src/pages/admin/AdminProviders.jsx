import React from "react";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { StatusBadge } from "../../ui/StatusBadge.jsx";
import { useStore } from "../../mock/store.js";
import { Avatar } from "../../ui/Avatar.jsx";
import { useToast } from "../../ui/Toast.jsx";

const tabs = [
  { key: "all", label: "الكل" },
  { key: "approved", label: "معتمد" },
  { key: "pending", label: "بانتظار المراجعة" },
  { key: "rejected", label: "مرفوض" }
];

export function AdminProviders() {
  const { state, adminApproveProvider, adminRejectProvider } = useStore();
  const { push } = useToast();
  const [tab, setTab] = React.useState("all");
  const [q, setQ] = React.useState("");

  const items = state.provider_profiles
    .filter((p) => (tab === "all" ? true : p.verification_status === tab))
    .filter((p) => (q ? p.business_name.toLowerCase().includes(q.toLowerCase()) : true))
    .sort((a, b) => (a.business_name > b.business_name ? 1 : -1));

  const counts = React.useMemo(() => {
    const c = { all: state.provider_profiles.length };
    for (const t of tabs) c[t.key] = 0;
    for (const p of state.provider_profiles) c[p.verification_status] = (c[p.verification_status] ?? 0) + 1;
    return c;
  }, [state.provider_profiles]);

  const userById = new Map(state.users.map((u) => [u.id, u]));

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[30px] font-bold text-[var(--zinc-900)]">مقدمو الخدمات</div>
        <div className="text-[13px] text-[var(--zinc-600)]">إدارة الاعتماد والإيقاف والبيانات الأساسية</div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
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

        <div className="flex-1" />

        <input
          className="h-11 w-[min(420px,92vw)] rounded-[12px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none"
          placeholder="بحث باسم المنشأة..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((p, idx) => {
          const u = userById.get(p.user_id);
          return (
            <Card key={p.id} className="p-6 animate-cardReveal" style={{ animationDelay: `${Math.min(idx, 6) * 50}ms` }}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4 min-w-0">
                  <Avatar name={p.business_name} size="lg" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-[17px] font-bold text-[var(--zinc-900)] truncate">{p.business_name}</div>
                      <StatusBadge status={p.verification_status} />
                      <span className="rounded-full border border-[var(--zinc-200)] bg-white px-3 py-1 text-[11px] font-bold text-[var(--zinc-700)]">
                        {p.provider_type}
                      </span>
                    </div>
                    <div className="mt-1 text-[13px] text-[var(--zinc-600)] line-clamp-2">{p.description}</div>
                    <div className="mt-2 text-[12px] text-[var(--zinc-500)]">
                      {u?.email ?? "—"} · {u?.phone ?? "—"} · {u?.city ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {p.verification_status === "pending" ? (
                    <>
                      <Button
                        onClick={() => {
                          adminApproveProvider({ providerProfileId: p.id });
                          push({ variant: "success", title: "تم الاعتماد", message: p.business_name });
                        }}
                      >
                        اعتماد ✓
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          adminRejectProvider({ providerProfileId: p.id });
                          push({ variant: "warning", title: "تم الرفض", message: p.business_name });
                        }}
                      >
                        رفض ✗
                      </Button>
                    </>
                  ) : (
                    <Button variant="secondary" onClick={() => push({ variant: "info", title: "قريباً", message: "عرض الملف الكامل + تعليق إداري." })}>
                      عرض الملف
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {items.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="text-[15px] font-bold text-[var(--zinc-900)]">لا يوجد مقدمو خدمات في هذه الحالة</div>
            <div className="mt-1 text-[13px] text-[var(--zinc-600)]">جرّب تغيير التبويب أو البحث.</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

