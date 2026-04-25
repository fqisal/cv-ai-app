import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { useToast } from "../../ui/Toast.jsx";
import { useStore } from "../../mock/store.js";
import { StatusBadge } from "../../ui/StatusBadge.jsx";

export function ProviderSubmitQuotation() {
  const { id } = useParams();
  const nav = useNavigate();
  const { push } = useToast();
  const { state, derived, getCategory, submitQuotation } = useStore();

  const req = state.requests.find((r) => r.id === id);
  const cat = req ? getCategory(req.category_id) : null;
  const profile = state.provider_profiles.find((p) => p.user_id === state.ui.actorUserId) ?? null;
  const myQuote = profile
    ? (derived.quotesByRequest.get(id) ?? []).find((q) => q.provider_id === profile.id && q.status === "submitted")
    : null;

  const [price, setPrice] = React.useState("");
  const [duration, setDuration] = React.useState("2 أيام");
  const [message, setMessage] = React.useState("");

  if (!req) {
    return (
      <Card className="p-8">
        <div className="text-[15px] font-bold">الطلب غير موجود</div>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => nav("/provider/inbox")}>
            ← صندوق الطلبات
          </Button>
        </div>
      </Card>
    );
  }

  const canSubmit = () => {
    if (!profile) return false;
    if (profile.verification_status !== "approved") return false;
    if (req.status !== "open") return false;
    const city = req.location_text.split(" - ")[0];
    const eligible = profile.categories.includes(req.category_id) && profile.coverage_areas.includes(city);
    if (!eligible) return false;
    if (myQuote) return false;
    return Number(price) > 0 && duration.trim().length > 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[30px] font-bold text-[var(--zinc-900)]">تقديم عرض سعر</div>
          <div className="text-[13px] text-[var(--zinc-600)]">{req.title} · {req.location_text}</div>
        </div>
        <Button variant="secondary" onClick={() => nav("/provider/inbox")}>
          ← صندوق الطلبات
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[var(--zinc-200)] bg-white px-3 py-1 text-[11px] font-bold text-[var(--zinc-700)]">
            {cat?.name ?? "—"}
          </span>
          <StatusBadge status={req.status} />
        </div>
        <div className="mt-3 text-[13px] text-[var(--zinc-600)]">{req.description}</div>
      </Card>

      {myQuote ? (
        <Card className="p-6 border border-[var(--amber-100)] bg-[var(--amber-50)]">
          <div className="text-[15px] font-bold text-[var(--zinc-900)]">لديك عرض نشط بالفعل لهذا الطلب</div>
          <div className="mt-1 text-[13px] text-[var(--zinc-600)]">قاعدة النظام: عرض واحد نشط لكل مزود لكل طلب.</div>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => nav("/provider/inbox")}>
              رجوع
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="text-[12px] font-bold text-[var(--zinc-600)]">السعر (SAR) *</div>
              <input
                className="mt-2 h-11 w-full rounded-[10px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ""))}
                placeholder="مثال: 2450"
              />
            </div>
            <div>
              <div className="text-[12px] font-bold text-[var(--zinc-600)]">المدة المتوقعة *</div>
              <input
                className="mt-2 h-11 w-full rounded-[10px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="مثال: 3 أيام"
              />
            </div>
            <div className="md:col-span-2">
              <div className="text-[12px] font-bold text-[var(--zinc-600)]">ملاحظة للعميل (اختياري)</div>
              <textarea
                className="mt-2 min-h-[120px] w-full rounded-[10px] border border-[var(--zinc-200)] bg-white p-3 text-[13px] outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="مثال: يشمل المواد + ضمان 14 يوم..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => nav("/provider/inbox")}>
              إلغاء
            </Button>
            <Button
              disabled={!canSubmit()}
              onClick={() => {
                submitQuotation({
                  requestId: req.id,
                  quoted_price: Number(price),
                  estimated_duration: duration.trim(),
                  message: message.trim() || null
                });
                push({ variant: "success", title: "تم إرسال العرض", message: "تم إشعار العميل (Demo)." });
                nav("/provider");
              }}
            >
              إرسال العرض
            </Button>
          </div>

          <div className="mt-3 text-[12px] text-[var(--zinc-500)]">
            ملاحظة: لن يظهر لك الطلب إذا لم تكن فئته ضمن فئاتك أو المدينة ضمن نطاق تغطيتك.
          </div>
        </Card>
      )}
    </div>
  );
}

