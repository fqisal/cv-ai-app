import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { StatusBadge } from "../../ui/StatusBadge.jsx";
import { useStore } from "../../mock/store.js";

export function ProviderInbox() {
  const { state, getCategory } = useStore();
  const nav = useNavigate();
  const profile = state.provider_profiles.find((p) => p.user_id === state.ui.actorUserId) ?? state.provider_profiles[0];
  const [mode, setMode] = React.useState("list"); // list | map
  const [city, setCity] = React.useState("");

  const eligible = state.requests
    .filter((r) => r.status === "open")
    .filter((r) => {
      if (profile?.verification_status !== "approved") return false;
      const catOk = (profile?.categories ?? []).includes(r.category_id);
      const areaOk = !city ? true : r.location_text.includes(city);
      return catOk && areaOk;
    })
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  const cities = Array.from(new Set(state.requests.map((r) => r.location_text.split(" - ")[0]))).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[30px] font-bold text-[var(--zinc-900)]">صندوق الطلبات</div>
          <div className="text-[13px] text-[var(--zinc-600)]">طلبات مفتوحة مطابقة لفئاتك ونطاقك (Demo)</div>
        </div>
        <div className="flex gap-2">
          <Button variant={mode === "list" ? "primary" : "secondary"} onClick={() => setMode("list")}>
            قائمة
          </Button>
          <Button variant={mode === "map" ? "primary" : "secondary"} onClick={() => setMode("map")}>
            خريطة
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-[13px] font-bold text-[var(--zinc-700)]">فلترة بالمدينة</div>
          <select
            className="h-11 rounded-[10px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">الكل</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="text-[12px] text-[var(--zinc-500)]">النتائج: {eligible.length}</div>
        </div>
      </Card>

      {profile?.verification_status !== "approved" ? (
        <Card className="p-8 text-center border border-[var(--amber-100)] bg-[var(--amber-50)]">
          <div className="text-[15px] font-bold text-[var(--zinc-900)]">حسابك قيد المراجعة</div>
          <div className="mt-1 text-[13px] text-[var(--zinc-600)]">لا يمكنك رؤية الطلبات أو تقديم عروض حتى يتم اعتمادك.</div>
          <div className="mt-5">
            <Button variant="secondary" onClick={() => nav("/provider")}>
              رجوع ←
            </Button>
          </div>
        </Card>
      ) : mode === "map" ? (
        <Card className="p-4">
          <MapContainer center={[24.7136, 46.6753]} zoom={5} style={{ height: 520, width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {eligible
              .filter((r) => r.lat && r.lng)
              .map((r) => (
                <Marker key={r.id} position={[r.lat, r.lng]}>
                  <Popup>
                    <div className="text-[13px] font-bold">{r.title}</div>
                    <div className="text-[12px]">{r.location_text}</div>
                    <div className="mt-2">
                      <Button variant="secondary" onClick={() => nav("/provider/inbox")}>
                        فتح
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {eligible.map((r, idx) => {
            const cat = getCategory(r.category_id);
            return (
              <Card key={r.id} className="p-6 animate-cardReveal" style={{ animationDelay: `${Math.min(idx, 6) * 50}ms` }}>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[var(--zinc-200)] bg-white px-3 py-1 text-[11px] font-bold text-[var(--zinc-700)]">
                        {cat?.name ?? "—"}
                      </span>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="mt-2 text-[17px] font-bold text-[var(--zinc-900)]">{r.title}</div>
                    <div className="mt-1 text-[13px] text-[var(--zinc-600)]">{r.location_text}</div>
                    <div className="mt-1 text-[12px] text-[var(--zinc-500)]">{new Date(r.created_at).toLocaleString("ar-SA")}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => nav(`/provider/requests/${r.id}/quote`)}>تقديم عرض</Button>
                    <Button variant="secondary" onClick={() => nav("/provider")}>
                      الرجوع
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
          {eligible.length === 0 ? (
            <Card className="p-10 text-center">
              <div className="text-[15px] font-bold text-[var(--zinc-900)]">لا توجد طلبات مطابقة</div>
              <div className="mt-1 text-[13px] text-[var(--zinc-600)]">جرّب تغيير المدينة أو لاحقاً أضف مناطق تغطية.</div>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}

