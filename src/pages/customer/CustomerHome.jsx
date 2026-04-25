import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { StatusBadge } from "../../ui/StatusBadge.jsx";
import { useStore } from "../../mock/store.js";
import { ArrowLeft } from "lucide-react";

export function CustomerHome() {
  const { state, derived, getCategory, getUser } = useStore();
  const nav = useNavigate();
  const actor = getUser(state.ui.actorUserId);

  const myRequests = state.requests
    .filter((r) => r.customer_id === state.ui.actorUserId)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, 3);

  const providerCountByCategory = React.useMemo(() => {
    const map = new Map();
    for (const p of state.provider_profiles) {
      if (p.verification_status !== "approved") continue;
      for (const cId of p.categories) {
        map.set(cId, (map.get(cId) ?? 0) + 1);
      }
    }
    return map;
  }, [state.provider_profiles]);

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden rounded-[24px] border-0 p-8 text-white shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
        style={{ background: "linear-gradient(135deg, #166534 0%, #15803d 50%, #166534 100%)" }}
      >
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full opacity-30 animate-orbFloat"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.45), transparent 60%)" }}
        />
        <div className="absolute bottom-[-60px] right-[-60px] h-72 w-72 rounded-full opacity-20 animate-orbFloat"
          style={{ background: "radial-gradient(circle, rgba(134,239,172,0.8), transparent 60%)", animationDelay: "700ms" }}
        />

        <div className="relative">
          <div className="text-[24px] font-bold">أهلاً {actor?.full_name ?? "بك"} 👋</div>
          <div className="mt-1 text-[13px] text-[var(--green-200)]">
            زرعة تربطك بأفضل مقدمي خدمات الحدائق والتنسيق في السعودية والخليج.
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              className="bg-white text-[var(--green-800)] border-white hover:bg-white/95"
              onClick={() => nav("/requests")}
            >
              طلباتي
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              className="bg-[var(--amber-500)] hover:bg-[var(--amber-400)] text-[var(--zinc-900)]"
              onClick={() => nav("/create-request")}
            >
              + أنشئ طلب خدمة جديد
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-[20px] font-bold text-[var(--zinc-900)]">الفئات</div>
          <div className="text-[13px] text-[var(--zinc-600)]">اختر نوع الخدمة لاستكشاف السوق</div>
        </div>
        <div className="rounded-full border border-[var(--zinc-200)] bg-white px-3 py-1 text-[12px] font-bold text-[var(--zinc-700)]">
          {state.categories.length} فئة
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {state.categories.map((c, idx) => (
          <Card
            key={c.id}
            className="p-5 animate-cardReveal"
            style={{ animationDelay: `${Math.min(idx, 6) * 50}ms` }}
            onClick={() => nav("/requests")}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-full grid place-items-center"
                style={{
                  background:
                    idx % 3 === 0
                      ? "rgba(22,163,74,0.12)"
                      : idx % 3 === 1
                        ? "rgba(245,158,11,0.14)"
                        : "rgba(37,99,235,0.12)"
                }}
              >
                <span className="text-[18px]">🌿</span>
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-bold text-[var(--zinc-900)] truncate">{c.name}</div>
                <div className="text-[12px] text-[var(--zinc-500)]">
                  {providerCountByCategory.get(c.id) ?? 0} مقدم خدمة متاح
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-[20px] font-bold text-[var(--zinc-900)]">طلباتي الأخيرة</div>
          <div className="text-[13px] text-[var(--zinc-600)]">آخر 3 طلبات</div>
        </div>
        <Button variant="ghost" onClick={() => nav("/requests")}>
          عرض الكل ←
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {myRequests.map((r, idx) => {
          const cat = getCategory(r.category_id);
          const quoteCount = (derived.quotesByRequest.get(r.id) ?? []).length;
          return (
            <Card
              key={r.id}
              className="p-5 animate-cardReveal"
              style={{ animationDelay: `${Math.min(idx, 6) * 50}ms` }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[15px] font-bold text-[var(--zinc-900)] truncate">{r.title}</div>
                  <div className="mt-1 text-[12px] text-[var(--zinc-500)]">
                    {cat?.name ?? "—"} · {r.location_text}
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-[12px] text-[var(--zinc-600)]">{quoteCount} عروض</div>
                <Button variant="secondary" onClick={() => nav(`/requests/${r.id}`)}>
                  التفاصيل ←
                </Button>
              </div>
            </Card>
          );
        })}
        {myRequests.length === 0 ? (
          <Card className="p-10 text-center lg:col-span-3">
            <div className="text-[15px] font-bold text-[var(--zinc-900)]">لا توجد طلبات بعد</div>
            <div className="mt-1 text-[13px] text-[var(--zinc-600)]">ابدأ بإنشاء طلب خدمة لتظهر هنا.</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

