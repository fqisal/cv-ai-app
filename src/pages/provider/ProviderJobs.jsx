import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { StatusBadge } from "../../ui/StatusBadge.jsx";
import { useStore } from "../../mock/store.js";
import { useToast } from "../../ui/Toast.jsx";

export function ProviderJobs() {
  const { state, providerMarkCompleted } = useStore();
  const { push } = useToast();
  const nav = useNavigate();
  const profile = state.provider_profiles.find((p) => p.user_id === state.ui.actorUserId) ?? state.provider_profiles[0];
  const myJobs = state.jobs.filter((j) => j.provider_id === profile?.id).sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const requestById = new Map(state.requests.map((r) => [r.id, r]));
  const convByJob = new Map(state.conversations.map((c) => [c.job_id, c]));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[30px] font-bold text-[var(--zinc-900)]">مشاريعي</div>
          <div className="text-[13px] text-[var(--zinc-600)]">إدارة حالة المشروع والمحادثات</div>
        </div>
        <Button variant="secondary" onClick={() => nav("/provider")}>
          ← لوحة المزود
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {myJobs.map((j, idx) => {
          const r = requestById.get(j.request_id);
          const conv = convByJob.get(j.id);
          return (
            <Card key={j.id} className="p-6 animate-cardReveal" style={{ animationDelay: `${Math.min(idx, 6) * 50}ms` }}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-[17px] font-bold text-[var(--zinc-900)]">{r?.title ?? "—"}</div>
                    <StatusBadge status={j.status} />
                  </div>
                  <div className="mt-1 text-[13px] text-[var(--zinc-600)]">{r?.location_text ?? "—"}</div>
                  <div className="mt-1 text-[12px] text-[var(--zinc-500)]">
                    {j.scheduled_date ? `موعد: ${j.scheduled_date} · ` : ""}
                    {new Date(j.created_at).toLocaleString("ar-SA")}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {conv ? <Button onClick={() => nav(`/chat/${conv.id}`)}>محادثة</Button> : <Button variant="secondary" disabled>لا توجد محادثة</Button>}
                  <Button
                    variant="secondary"
                    disabled={j.status !== "active"}
                    onClick={() => {
                      providerMarkCompleted({ jobId: j.id });
                      push({ variant: "success", title: "تم التحديث", message: "تم وضع الحالة مكتمل من طرف المزود (Demo)." });
                    }}
                  >
                    وضع مكتمل
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {myJobs.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="text-[15px] font-bold text-[var(--zinc-900)]">لا توجد مشاريع</div>
            <div className="mt-1 text-[13px] text-[var(--zinc-600)]">عند اختيار العميل لعرضك سيتم إنشاء مشروع هنا.</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

