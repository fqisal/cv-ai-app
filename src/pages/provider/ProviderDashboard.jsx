import React from "react";
import { Card } from "../../ui/Card.jsx";
import { useStore } from "../../mock/store.js";
import { StatusBadge } from "../../ui/StatusBadge.jsx";
import { Button } from "../../ui/Button.jsx";
import { useNavigate } from "react-router-dom";
import { Stars } from "../../ui/Stars.jsx";

export function ProviderDashboard() {
  const { state } = useStore();
  const nav = useNavigate();

  const profile = state.provider_profiles.find((p) => p.user_id === state.ui.actorUserId) ?? state.provider_profiles[0];
  const myQuotes = state.quotations.filter((q) => q.provider_id === profile?.id);
  const myJobs = state.jobs.filter((j) => j.provider_id === profile?.id);
  const newRequests = state.requests.filter((r) => r.status === "open").slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[30px] font-bold text-[var(--zinc-900)]">لوحة المزود</div>
          <div className="text-[13px] text-[var(--zinc-600)]">نظرة سريعة على الطلبات والفرص</div>
        </div>
        <Button variant="secondary" onClick={() => nav("/provider/inbox")}>
          صندوق الطلبات ←
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="text-[20px] font-bold text-[var(--zinc-900)]">{profile?.business_name ?? "—"}</div>
              <div className="mt-1 text-[13px] text-[var(--zinc-600)]">{profile?.description ?? "—"}</div>
              <div className="mt-2 flex items-center gap-2">
                <Stars value={profile?.average_rating ?? 0} />
                <span className="text-[12px] text-[var(--zinc-500)]">
                  {(profile?.average_rating ?? 0).toFixed(1)} · {profile?.total_jobs_completed ?? 0} مشروع
                </span>
                <StatusBadge status={profile?.verification_status ?? "pending"} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(profile?.coverage_areas ?? []).slice(0, 4).map((a) => (
                  <span key={a} className="rounded-full border border-[var(--zinc-200)] bg-white px-3 py-1 text-[11px] font-bold text-[var(--zinc-700)]">
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Button onClick={() => nav("/provider/jobs")}>مشاريعي</Button>
              <Button variant="secondary" onClick={() => nav("/wallet")}>
                المحفظة
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-[13px] font-bold text-[var(--zinc-500)]">إحصائيات</div>
          <div className="mt-3 grid gap-3">
            <div className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4">
              <div className="text-[11px] font-bold text-[var(--zinc-500)]">عروض نشطة</div>
              <div className="mt-1 text-[24px] font-bold text-[var(--zinc-900)]">{myQuotes.filter((q) => q.status === "submitted").length}</div>
            </div>
            <div className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4">
              <div className="text-[11px] font-bold text-[var(--zinc-500)]">مشاريع نشطة</div>
              <div className="mt-1 text-[24px] font-bold text-[var(--zinc-900)]">{myJobs.filter((j) => j.status === "active").length}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-[20px] font-bold text-[var(--zinc-900)]">طلبات جديدة بالقرب منك (Demo)</div>
          <div className="text-[13px] text-[var(--zinc-600)]">مفلترة حسب فئاتك ومناطقك (شكلياً)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {newRequests.map((r, idx) => (
          <Card key={r.id} className="p-6 animate-cardReveal" style={{ animationDelay: `${Math.min(idx, 6) * 50}ms` }}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[15px] font-bold text-[var(--zinc-900)]">{r.title}</div>
                <div className="mt-1 text-[13px] text-[var(--zinc-600)]">{r.location_text}</div>
                <div className="mt-1 text-[12px] text-[var(--zinc-500)]">{new Date(r.created_at).toLocaleString("ar-SA")}</div>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="secondary" onClick={() => nav("/provider/inbox")}>
                فتح من صندوق الطلبات ←
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

