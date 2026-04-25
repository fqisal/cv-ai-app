import React from "react";
import { useStore } from "../../mock/store.js";
import { Card } from "../../ui/Card.jsx";
import { StatusBadge } from "../../ui/StatusBadge.jsx";
import { Button } from "../../ui/Button.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  LabelList
} from "recharts";

function useCountUp(target, ms = 1200) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms);
      setV(Math.round(target * easeOutExpo(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function Kpi({ label, value, sub }) {
  const v = useCountUp(value);
  return (
    <Card className="p-6">
      <div className="text-[11px] font-bold text-[var(--zinc-500)]">{label}</div>
      <div className="mt-2 text-[30px] font-bold text-[var(--zinc-900)]">{v.toLocaleString("ar-SA")}</div>
      {sub ? <div className="mt-1 text-[12px] text-[var(--zinc-600)]">{sub}</div> : null}
    </Card>
  );
}

export function AdminDashboard() {
  const { state } = useStore();

  const pendingProviders = state.provider_profiles.filter((p) => p.verification_status === "pending").length;
  const activeRequests = state.requests.filter((r) => r.status === "open").length;
  const activeJobs = state.jobs.filter((j) => j.status === "active").length;
  const avgRating =
    state.ratings.length === 0 ? 0 : Math.round((state.ratings.reduce((a, r) => a + r.score, 0) / state.ratings.length) * 10) / 10;

  const requestsByStatus = ["open", "in_progress", "completed", "cancelled", "expired"].map((s) => ({
    status: s,
    count: state.requests.filter((r) => r.status === s).length
  }));

  const jobsByStatus = ["pending_confirmation", "active", "completed", "cancelled", "disputed"].map((s) => ({
    status: s,
    count: state.jobs.filter((j) => j.status === s).length
  }));

  const weekly = [
    { day: "السبت", requests: 12, jobs: 6 },
    { day: "الأحد", requests: 18, jobs: 8 },
    { day: "الاثنين", requests: 22, jobs: 9 },
    { day: "الثلاثاء", requests: 16, jobs: 7 },
    { day: "الأربعاء", requests: 28, jobs: 12 },
    { day: "الخميس", requests: 20, jobs: 10 },
    { day: "الجمعة", requests: 14, jobs: 5 }
  ];

  const providerTypes = ["nursery", "landscaping", "independent", "irrigation", "other"].map((t) => ({
    type: t,
    count: state.provider_profiles.filter((p) => p.provider_type === t).length
  }));

  const pieColors = ["#16a34a", "#f59e0b", "#2563eb", "#71717a", "#dc2626"];

  return (
    <div className="space-y-6">
      {pendingProviders > 0 ? (
        <Card className="p-4 border border-[var(--amber-100)] bg-[var(--amber-50)]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[13px] font-bold text-[var(--zinc-900)]">تنبيه: طلبات اعتماد مقدمي الخدمات</div>
              <div className="text-[13px] text-[var(--zinc-600)]">لديك {pendingProviders} حسابات بانتظار المراجعة.</div>
            </div>
            <Button variant="secondary" onClick={() => window.location.assign("/admin/providers")}>
              الذهاب للصفحة ←
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[30px] font-bold text-[var(--zinc-900)]">لوحة التحكم</div>
          <div className="text-[13px] text-[var(--zinc-600)]">مرحباً — إليك نظرة شاملة على المنصة</div>
        </div>
        <div className="text-[12px] text-[var(--zinc-500)]">
          آخر تحديث: {new Date().toLocaleString("ar-SA")}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Kpi label="متوسط التقييم" value={Math.round(avgRating * 10)} sub={`${avgRating} / 5`} />
        <Kpi label="مشاريع نشطة" value={activeJobs} />
        <Kpi label="طلبات مفتوحة" value={activeRequests} />
        <Kpi label="بانتظار الموافقة" value={pendingProviders} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="p-6">
          <div className="text-[20px] font-bold text-[var(--zinc-900)]">حالة المشاريع</div>
          <div className="mt-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={jobsByStatus} dataKey="count" nameKey="status" innerRadius={80} outerRadius={120} paddingAngle={2}>
                  {jobsByStatus.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                  <LabelList dataKey="count" position="outside" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-[20px] font-bold text-[var(--zinc-900)]">النشاط الأسبوعي</div>
          <div className="mt-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekly}>
                <CartesianGrid stroke="#e4e4e7" strokeDasharray="4 4" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" stroke="#16a34a" strokeWidth={3} dot>
                  <LabelList dataKey="requests" position="top" />
                </Line>
                <Line type="monotone" dataKey="jobs" stroke="#f59e0b" strokeWidth={3} dot>
                  <LabelList dataKey="jobs" position="top" />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-[20px] font-bold text-[var(--zinc-900)]">أنواع مقدمي الخدمات</div>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={providerTypes} layout="vertical" margin={{ right: 24 }}>
                <CartesianGrid stroke="#e4e4e7" strokeDasharray="4 4" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="type" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" radius={[8, 8, 8, 8]}>
                  <LabelList dataKey="count" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-[20px] font-bold text-[var(--zinc-900)]">توزيع حالات الطلبات</div>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsByStatus} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid stroke="#e4e4e7" strokeDasharray="4 4" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[10, 10, 0, 0]}>
                  <LabelList dataKey="count" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-[20px] font-bold text-[var(--zinc-900)]">أحدث الطلبات</div>
            <Button variant="ghost" onClick={() => window.location.assign("/admin/requests")}>
              عرض الكل ←
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            {state.requests
              .slice()
              .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
              .slice(0, 5)
              .map((r) => (
                <div key={r.id} className="rounded-[14px] border border-[var(--zinc-200)] bg-white p-4 hover:bg-[var(--green-50)] transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-[var(--zinc-900)] truncate">{r.title}</div>
                      <div className="mt-1 text-[12px] text-[var(--zinc-500)]">{r.location_text}</div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-[20px] font-bold text-[var(--zinc-900)]">أحدث المشاريع</div>
            <Button variant="ghost" onClick={() => window.location.assign("/admin/jobs")}>
              عرض الكل ←
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            {state.jobs
              .slice()
              .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
              .slice(0, 5)
              .map((j) => (
                <div key={j.id} className="rounded-[14px] border border-[var(--zinc-200)] bg-white p-4 hover:bg-[var(--green-50)] transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-[var(--zinc-900)]">Job {j.id}</div>
                      <div className="mt-1 text-[12px] text-[var(--zinc-500)]">{new Date(j.created_at).toLocaleString("ar-SA")}</div>
                    </div>
                    <StatusBadge status={j.status} />
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

