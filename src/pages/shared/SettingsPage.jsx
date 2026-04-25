import React from "react";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { useStore } from "../../mock/store.js";
import { useToast } from "../../ui/Toast.jsx";

export function SettingsPage() {
  const { state } = useStore();
  const { push } = useToast();
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [smsEnabled, setSmsEnabled] = React.useState(true);
  const [emailEnabled, setEmailEnabled] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[30px] font-bold text-[var(--zinc-900)]">الإعدادات</div>
        <div className="text-[13px] text-[var(--zinc-600)]">تنبيهات + تفضيلات (Demo)</div>
      </div>

      <Card className="p-6">
        <div className="text-[20px] font-bold text-[var(--zinc-900)]">التنبيهات</div>
        <div className="mt-2 text-[13px] text-[var(--zinc-600)]">
          في النسخة الحقيقية سيتم ربطها بـ Push (Firebase) + SMS Provider + Email.
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-[13px] font-bold text-[var(--zinc-900)]">Push</div>
              <div className="text-[12px] text-[var(--zinc-500)]">لحظي داخل التطبيق</div>
            </div>
            <input type="checkbox" checked={pushEnabled} onChange={(e) => setPushEnabled(e.target.checked)} />
          </label>

          <label className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-[13px] font-bold text-[var(--zinc-900)]">SMS</div>
              <div className="text-[12px] text-[var(--zinc-500)]">OTP وتحديثات الحالة</div>
            </div>
            <input type="checkbox" checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} />
          </label>

          <label className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-[13px] font-bold text-[var(--zinc-900)]">Email</div>
              <div className="text-[12px] text-[var(--zinc-500)]">تقارير وفواتير (V2)</div>
            </div>
            <input type="checkbox" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} />
          </label>
        </div>

        <div className="mt-6 flex gap-2">
          <Button
            onClick={() =>
              push({
                variant: "success",
                title: "تم الحفظ",
                message: `Push=${pushEnabled ? "on" : "off"}, SMS=${smsEnabled ? "on" : "off"}, Email=${emailEnabled ? "on" : "off"}`
              })
            }
          >
            حفظ
          </Button>
          <Button variant="secondary" onClick={() => push({ variant: "info", title: "الدور الحالي", message: `role=${state.ui.role}` })}>
            معلومات
          </Button>
        </div>
      </Card>
    </div>
  );
}

