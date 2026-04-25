import React from "react";
import { Card } from "../../ui/Card.jsx";
import { Stars } from "../../ui/Stars.jsx";
import { useStore } from "../../mock/store.js";

export function AdminRatings() {
  const { state } = useStore();
  const providerById = new Map(state.provider_profiles.map((p) => [p.id, p]));

  const avg = state.ratings.length ? state.ratings.reduce((a, r) => a + r.score, 0) / state.ratings.length : 0;
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    s,
    count: state.ratings.filter((r) => r.score === s).length
  }));
  const total = state.ratings.length || 1;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[30px] font-bold text-[var(--zinc-900)]">التقييمات</div>
        <div className="text-[13px] text-[var(--zinc-600)]">ملخص + بطاقات تقييمات</div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[11px] font-bold text-[var(--zinc-500)]">المتوسط العام</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="text-[36px] font-bold text-[var(--zinc-900)]">{avg.toFixed(1)}</div>
              <Stars value={avg} />
              <div className="text-[12px] text-[var(--zinc-500)]">{state.ratings.length} مراجعة</div>
            </div>
          </div>

          <div className="w-full max-w-[420px] space-y-2">
            {dist.map((d) => (
              <div key={d.s} className="flex items-center gap-2">
                <div className="w-10 text-[12px] font-bold text-[var(--zinc-700)]">{d.s}★</div>
                <div className="h-2 flex-1 rounded-full bg-[var(--zinc-100)] overflow-hidden">
                  <div className="h-2 bg-[var(--green-600)]" style={{ width: `${(d.count / total) * 100}%` }} />
                </div>
                <div className="w-10 text-left text-[12px] text-[var(--zinc-500)]">{Math.round((d.count / total) * 100)}%</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {state.ratings
          .slice()
          .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
          .map((r) => {
            const p = providerById.get(r.provider_id);
            return (
              <Card key={r.id} className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[15px] font-bold text-[var(--zinc-900)]">{p?.business_name ?? "—"}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <Stars value={r.score} />
                      <div className="text-[12px] text-[var(--zinc-500)]">{r.score}/5</div>
                    </div>
                  </div>
                  <div className="text-[12px] text-[var(--zinc-500)]">{new Date(r.created_at).toLocaleString("ar-SA")}</div>
                </div>
                {r.comment ? <div className="mt-3 text-[13px] text-[var(--zinc-700)]">"{r.comment}"</div> : null}
              </Card>
            );
          })}

        {state.ratings.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="text-[15px] font-bold text-[var(--zinc-900)]">لا توجد تقييمات حتى الآن</div>
            <div className="mt-1 text-[13px] text-[var(--zinc-600)]">عند اكتمال المشاريع وتأكيد العميل ستظهر التقييمات هنا.</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

