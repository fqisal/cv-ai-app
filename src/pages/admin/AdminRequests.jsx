import React from "react";
import { Card } from "../../ui/Card.jsx";
import { StatusBadge } from "../../ui/StatusBadge.jsx";
import { useStore } from "../../mock/store.js";

export function AdminRequests() {
  const { state, derived, getCategory, getUser } = useStore();
  const [status, setStatus] = React.useState("all");
  const [city, setCity] = React.useState("all");

  const cities = Array.from(new Set(state.requests.map((r) => r.location_text.split(" - ")[0]))).filter(Boolean);
  const items = state.requests
    .filter((r) => (status === "all" ? true : r.status === status))
    .filter((r) => (city === "all" ? true : r.location_text.startsWith(city)))
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[30px] font-bold text-[var(--zinc-900)]">الطلبات</div>
        <div className="text-[13px] text-[var(--zinc-600)]">مراقبة جميع الطلبات حسب الحالة والمدينة</div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-[12px] font-bold text-[var(--zinc-600)]">الحالة</div>
          <select className="h-11 rounded-[10px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">الكل</option>
            <option value="open">مفتوح</option>
            <option value="in_progress">قيد التنفيذ</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
            <option value="expired">منتهي</option>
          </select>
          <div className="text-[12px] font-bold text-[var(--zinc-600)]">المدينة</div>
          <select className="h-11 rounded-[10px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="all">الكل</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="mr-auto text-[12px] text-[var(--zinc-500)]">النتائج: {items.length}</div>
        </div>
      </Card>

      <div className="space-y-3">
        {items.map((r) => {
          const customer = getUser(r.customer_id);
          const cat = getCategory(r.category_id);
          const quotes = derived.quotesByRequest.get(r.id) ?? [];
          return (
            <div key={r.id} className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4 hover:bg-[var(--green-50)] transition">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[var(--zinc-900)]">{r.title}</div>
                  <div className="mt-1 text-[12px] text-[var(--zinc-500)]">
                    {customer?.full_name ?? "—"} · {cat?.name ?? "—"} · {r.location_text} · {quotes.length} عروض
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

