import React from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../mock/store.js";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { useToast } from "../../ui/Toast.jsx";

function PinPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick?.(e.latlng);
    }
  });
  return null;
}

export function CreateRequest() {
  const nav = useNavigate();
  const { push } = useToast();
  const { state, createRequest } = useStore();

  const [step, setStep] = React.useState(1);
  const [categoryId, setCategoryId] = React.useState(state.categories[0]?.id ?? "");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [locationText, setLocationText] = React.useState("الرياض - ");
  const [areaSize, setAreaSize] = React.useState("");
  const [timingFlex, setTimingFlex] = React.useState("flexible");
  const [preferredDate, setPreferredDate] = React.useState("");
  const [pin, setPin] = React.useState({ lat: 24.7136, lng: 46.6753 });
  const [mediaUrls, setMediaUrls] = React.useState(["", "", "", "", ""]);

  const canNext = () => {
    if (step === 1) return categoryId && title.trim().length >= 6 && description.trim().length >= 10;
    return locationText.trim().length >= 6;
  };

  const submit = () => {
    if (!canNext()) {
      push({ variant: "error", title: "تحقق من المدخلات", message: "يرجى تعبئة الحقول المطلوبة." });
      return;
    }
    createRequest({
      category_id: categoryId,
      title: title.trim(),
      description: description.trim(),
      location_text: locationText.trim(),
      lat: pin?.lat ?? null,
      lng: pin?.lng ?? null,
      area_size: areaSize.trim() || null,
      timing_flexibility: timingFlex,
      preferred_date: timingFlex === "specific_date" ? preferredDate : null,
      media_urls: mediaUrls.filter(Boolean)
    });
    push({ variant: "success", title: "تم إنشاء الطلب", message: "تم إرسال الطلب وإشعار مقدمي الخدمات المطابقين (Demo)." });
    nav("/requests");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[30px] font-bold text-[var(--zinc-900)]">إنشاء طلب خدمة</div>
          <div className="text-[13px] text-[var(--zinc-600)]">نموذج من خطوتين مع خريطة تفاعلية</div>
        </div>
        <Button variant="secondary" onClick={() => nav("/requests")}>
          ← طلباتي
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className={"rounded-full px-3 py-1 text-[12px] font-bold " + (step === 1 ? "bg-[var(--green-600)] text-white" : "bg-[var(--zinc-100)] text-[var(--zinc-700)]")}>
          1) معلومات الخدمة
        </span>
        <span className={"rounded-full px-3 py-1 text-[12px] font-bold " + (step === 2 ? "bg-[var(--green-600)] text-white" : "bg-[var(--zinc-100)] text-[var(--zinc-700)]")}>
          2) الموقع والتفاصيل
        </span>
      </div>

      {step === 1 ? (
        <Card className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="text-[12px] font-bold text-[var(--zinc-600)]">الفئة *</div>
              <select
                className="mt-2 h-11 w-full rounded-[10px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {state.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-[12px] font-bold text-[var(--zinc-600)]">عنوان الطلب *</div>
              <input
                className="mt-2 h-11 w-full rounded-[10px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none"
                placeholder="مثال: تركيب عشب طبيعي لحديقة خلفية"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="mt-1 text-[11px] text-[var(--zinc-500)]">على الأقل 6 أحرف</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-[12px] font-bold text-[var(--zinc-600)]">الوصف *</div>
              <textarea
                className="mt-2 min-h-[120px] w-full rounded-[10px] border border-[var(--zinc-200)] bg-white p-3 text-[13px] outline-none"
                placeholder="صف المطلوب بالتفصيل: المساحة، الحالة الحالية، المطلوب، صور إن وجدت..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="mt-1 text-[11px] text-[var(--zinc-500)]">على الأقل 10 أحرف</div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => nav("/requests")}>
              إلغاء
            </Button>
            <Button disabled={!canNext()} onClick={() => setStep(2)}>
              التالي ←
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <div className="text-[12px] font-bold text-[var(--zinc-600)]">الموقع النصي (مدينة - حي) *</div>
              <input
                className="mt-2 h-11 w-full rounded-[10px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none"
                placeholder="مثال: الرياض - النرجس"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
              />
            </div>

            <div>
              <div className="text-[12px] font-bold text-[var(--zinc-600)]">المساحة (اختياري)</div>
              <input
                className="mt-2 h-11 w-full rounded-[10px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none"
                placeholder="مثال: 80 sqm"
                value={areaSize}
                onChange={(e) => setAreaSize(e.target.value)}
              />
            </div>

            <div>
              <div className="text-[12px] font-bold text-[var(--zinc-600)]">التوقيت</div>
              <div className="mt-2 flex gap-2">
                <button
                  className={"rounded-full border px-4 py-2 text-[12px] font-bold " + (timingFlex === "flexible" ? "bg-[var(--green-600)] text-white border-[var(--green-600)]" : "bg-white border-[var(--zinc-200)] text-[var(--zinc-700)]")}
                  onClick={() => setTimingFlex("flexible")}
                  type="button"
                >
                  مرن
                </button>
                <button
                  className={"rounded-full border px-4 py-2 text-[12px] font-bold " + (timingFlex === "specific_date" ? "bg-[var(--green-600)] text-white border-[var(--green-600)]" : "bg-white border-[var(--zinc-200)] text-[var(--zinc-700)]")}
                  onClick={() => setTimingFlex("specific_date")}
                  type="button"
                >
                  تاريخ محدد
                </button>
              </div>
              {timingFlex === "specific_date" ? (
                <input
                  type="date"
                  className="mt-3 h-11 w-full rounded-[10px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                />
              ) : null}
            </div>

            <div className="md:col-span-2">
              <div className="text-[12px] font-bold text-[var(--zinc-600)]">تحديد الموقع على الخريطة</div>
              <div className="mt-2 overflow-hidden rounded-[16px] border border-[var(--zinc-200)]">
                <MapContainer center={[pin.lat, pin.lng]} zoom={10} style={{ height: 360, width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <PinPicker onPick={(latlng) => setPin({ lat: latlng.lat, lng: latlng.lng })} />
                  <Marker position={[pin.lat, pin.lng]} />
                </MapContainer>
              </div>
              <div className="mt-2 text-[12px] text-[var(--zinc-500)]">
                اضغط على الخريطة لتغيير الإبرة. (lat={pin.lat.toFixed(4)}, lng={pin.lng.toFixed(4)})
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="text-[12px] font-bold text-[var(--zinc-600)]">صور (روابط) — حتى 5</div>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                {mediaUrls.map((v, i) => (
                  <input
                    key={i}
                    className="h-11 w-full rounded-[10px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none"
                    placeholder={`رابط صورة ${i + 1} (اختياري)`}
                    value={v}
                    onChange={(e) => {
                      const next = mediaUrls.slice();
                      next[i] = e.target.value;
                      setMediaUrls(next);
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 text-[12px] text-[var(--zinc-500)]">
                للعرض التجريبي يمكنك استخدام روابط مثل `https://picsum.photos/...`
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setStep(1)}>
              ← رجوع
            </Button>
            <Button onClick={submit}>إرسال الطلب</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

