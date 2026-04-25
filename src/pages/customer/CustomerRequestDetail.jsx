import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { StatusBadge } from "../../ui/StatusBadge.jsx";
import { Stars } from "../../ui/Stars.jsx";
import { useStore } from "../../mock/store.js";
import { useToast } from "../../ui/Toast.jsx";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";

export function CustomerRequestDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { push } = useToast();
  const { state, derived, getCategory, getProviderProfile, selectQuotation, getUser } = useStore();

  const request = state.requests.find((r) => r.id === id);
  const cat = request ? getCategory(request.category_id) : null;
  const media = state.request_media.filter((m) => m.request_id === id);
  const quotes = (derived.quotesByRequest.get(id) ?? []).slice().sort((a, b) => a.quoted_price - b.quoted_price);

  const min = quotes[0]?.quoted_price ?? null;
  const max = quotes.length ? quotes[quotes.length - 1].quoted_price : null;

  if (!request) {
    return (
      <Card className="p-8">
        <div className="text-[15px] font-bold">الطلب غير موجود</div>
        <div className="mt-4">
          <Button onClick={() => nav("/requests")}>← رجوع</Button>
        </div>
      </Card>
    );
  }

  const customer = getUser(request.customer_id);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[30px] font-bold text-[var(--zinc-900)]">{request.title}</div>
          <div className="mt-1 text-[13px] text-[var(--zinc-600)]">
            {cat?.name ?? "—"} · {request.location_text} · {customer?.full_name ?? "—"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={request.status} />
          <Button variant="secondary" onClick={() => nav("/requests")}>
            ← طلباتي
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="text-[20px] font-bold text-[var(--zinc-900)]">تفاصيل الطلب</div>
          <div className="mt-2 text-[13px] text-[var(--zinc-600)]">{request.description}</div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4">
              <div className="text-[11px] font-bold text-[var(--zinc-500)]">الموقع</div>
              <div className="mt-1 text-[13px] font-bold text-[var(--zinc-900)]">{request.location_text}</div>
            </div>
            <div className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4">
              <div className="text-[11px] font-bold text-[var(--zinc-500)]">المساحة</div>
              <div className="mt-1 text-[13px] font-bold text-[var(--zinc-900)]">{request.area_size ?? "—"}</div>
            </div>
            <div className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4">
              <div className="text-[11px] font-bold text-[var(--zinc-500)]">الوقت</div>
              <div className="mt-1 text-[13px] font-bold text-[var(--zinc-900)]">
                {request.timing_flexibility === "flexible" ? "مرن" : request.preferred_date ?? "—"}
              </div>
            </div>
            <div className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4">
              <div className="text-[11px] font-bold text-[var(--zinc-500)]">تاريخ الإنشاء</div>
              <div className="mt-1 text-[13px] font-bold text-[var(--zinc-900)]">
                {new Date(request.created_at).toLocaleString("ar-SA")}
              </div>
            </div>
          </div>

          {media.length ? (
            <div className="mt-6">
              <div className="text-[13px] font-bold text-[var(--zinc-900)]">الصور</div>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                {media.map((m) => (
                  <img
                    key={m.id}
                    src={m.file_url}
                    alt="media"
                    className="h-40 w-full rounded-[16px] object-cover border border-[var(--zinc-200)]"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </Card>

        <Card className="p-6">
          <div className="text-[20px] font-bold text-[var(--zinc-900)]">ملخص العروض</div>
          <div className="mt-2 text-[13px] text-[var(--zinc-600)]">
            {quotes.length ? `عدد العروض: ${quotes.length}` : "لا توجد عروض بعد"}
          </div>
          {quotes.length ? (
            <div className="mt-4 rounded-[16px] bg-[var(--green-50)] border border-[var(--green-100)] p-4">
              <div className="text-[11px] font-bold text-[var(--zinc-500)]">النطاق السعري</div>
              <div className="mt-1 text-[20px] font-bold text-[var(--zinc-900)]">
                {min?.toLocaleString("ar-SA")}–{max?.toLocaleString("ar-SA")} SAR
              </div>
              <div className="mt-1 text-[12px] text-[var(--zinc-600)]">الأرخص يظهر أولاً</div>
            </div>
          ) : null}

          <div className="mt-5">
            <div className="text-[13px] font-bold text-[var(--zinc-900)]">الخريطة</div>
            <div className="mt-3">
              <MapContainer
                center={[request.lat ?? 24.7136, request.lng ?? 46.6753]}
                zoom={request.lat ? 12 : 6}
                style={{ height: 240, width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {request.lat && request.lng ? (
                  <Marker position={[request.lat, request.lng]}>
                    <Popup>{request.location_text}</Popup>
                  </Marker>
                ) : null}
              </MapContainer>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-[20px] font-bold text-[var(--zinc-900)]">العروض</div>
          <div className="text-[13px] text-[var(--zinc-600)]">قارن واختر العرض الأفضل</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {quotes.map((q, idx) => {
          const p = getProviderProfile(q.provider_id);
          const cheapest = q.quoted_price === min;
          return (
            <Card
              key={q.id}
              className="p-6 animate-cardReveal"
              style={{ animationDelay: `${Math.min(idx, 6) * 50}ms` }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-[17px] font-bold text-[var(--zinc-900)]">{p?.business_name ?? "—"}</div>
                    {cheapest ? (
                      <span className="rounded-full bg-[var(--amber-100)] px-3 py-1 text-[11px] font-bold text-[#92400e]">
                        الأرخص
                      </span>
                    ) : null}
                    <span className="rounded-full border border-[var(--zinc-200)] bg-white px-3 py-1 text-[11px] font-bold text-[var(--zinc-700)]">
                      {p?.provider_type ?? "—"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Stars value={p?.average_rating ?? 0} />
                    <span className="text-[12px] text-[var(--zinc-500)]">
                      {(p?.average_rating ?? 0).toFixed(1)} · {p?.total_jobs_completed ?? 0} مشروع
                    </span>
                  </div>
                  <div className="mt-3 text-[13px] text-[var(--zinc-600)]">{q.message ?? "—"}</div>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
                  <div className="text-[24px] font-bold text-[var(--zinc-900)]">
                    {q.quoted_price.toLocaleString("ar-SA")} <span className="text-[13px] font-bold text-[var(--zinc-500)]">SAR</span>
                  </div>
                  <div className="text-[12px] text-[var(--zinc-600)]">المدة: {q.estimated_duration}</div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        if (request.status !== "open") {
                          push({ variant: "warning", title: "غير متاح", message: "لا يمكن اختيار عرض إلا عندما يكون الطلب مفتوحاً." });
                          return;
                        }
                        selectQuotation({ requestId: request.id, quotationId: q.id });
                        push({ variant: "success", title: "تم اختيار العرض", message: "تم إنشاء مشروع وربط محادثة تلقائياً (Demo)." });
                        nav("/jobs");
                      }}
                      disabled={q.status !== "submitted" || request.status !== "open"}
                    >
                      اختيار هذا العرض
                    </Button>
                    <Button variant="secondary" onClick={() => push({ variant: "info", title: "معلومات", message: "عرض تفاصيل المزود (قريباً)." })}>
                      التفاصيل
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {quotes.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="text-[15px] font-bold text-[var(--zinc-900)]">لا توجد عروض حتى الآن</div>
            <div className="mt-1 text-[13px] text-[var(--zinc-600)]">سيتم إشعارك عند وصول عرض جديد.</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

