import React from "react";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { useStore } from "../../mock/store.js";
import { useToast } from "../../ui/Toast.jsx";

export function WalletPage() {
  const { state } = useStore();
  const { push } = useToast();

  const wallet = state.wallets.find((w) => w.user_id === state.ui.actorUserId);
  const tx = state.transactions
    .filter((t) => t.user_id === state.ui.actorUserId)
    .slice()
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  const isProvider = state.ui.role === "provider";
  const commissionPct = 10;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[30px] font-bold text-[var(--zinc-900)]">المحفظة</div>
        <div className="text-[13px] text-[var(--zinc-600)]">رصيد وسجل حركات (Demo)</div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="text-[11px] font-bold text-[var(--zinc-500)]">الرصيد الحالي</div>
          <div className="mt-2 text-[36px] font-bold text-[var(--zinc-900)]">
            {(wallet?.balance_sar ?? 0).toLocaleString("ar-SA")} <span className="text-[13px] font-bold text-[var(--zinc-500)]">SAR</span>
          </div>
          <div className="mt-2 text-[13px] text-[var(--zinc-600)]">
            {isProvider ? `يتم خصم عمولة المنصة ${commissionPct}% من الأرباح (تجريبي).` : "يمكنك إضافة رصيد لتسهيل الحجز (تجريبي)."}
          </div>
          <div className="mt-4 flex gap-2">
            {!isProvider ? (
              <Button onClick={() => push({ variant: "info", title: "إضافة رصيد", message: "دمج بوابة دفع في V2 (خارج نطاق MVP)." })}>
                + إضافة رصيد
              </Button>
            ) : (
              <Button onClick={() => push({ variant: "info", title: "سحب الأرباح", message: "سيتم ربطها بتحويل بنكي/بوابة دفع لاحقاً." })}>
                سحب الأرباح
              </Button>
            )}
            <Button variant="secondary" onClick={() => push({ variant: "success", title: "تم", message: "هذه صفحة Demo جاهزة للتوسع." })}>
              ماذا بعد؟
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-[20px] font-bold text-[var(--zinc-900)]">ملخص سريع</div>
          <div className="mt-4 space-y-3">
            <div className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4">
              <div className="text-[11px] font-bold text-[var(--zinc-500)]">عدد الحركات</div>
              <div className="mt-1 text-[24px] font-bold text-[var(--zinc-900)]">{tx.length}</div>
            </div>
            <div className="rounded-[16px] border border-[var(--zinc-200)] bg-white p-4">
              <div className="text-[11px] font-bold text-[var(--zinc-500)]">آخر حركة</div>
              <div className="mt-1 text-[13px] font-bold text-[var(--zinc-900)]">{tx[0]?.note ?? "—"}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="text-[20px] font-bold text-[var(--zinc-900)]">سجل الحركات</div>
        <div className="mt-4 space-y-2">
          {tx.map((t) => (
            <div key={t.id} className="rounded-[14px] border border-[var(--zinc-200)] bg-white p-4 hover:bg-[var(--green-50)] transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[13px] font-bold text-[var(--zinc-900)]">{t.note}</div>
                  <div className="mt-1 text-[12px] text-[var(--zinc-500)]">{new Date(t.created_at).toLocaleString("ar-SA")}</div>
                </div>
                <div className="text-[13px] font-bold" style={{ color: t.amount_sar >= 0 ? "var(--green-700)" : "#dc2626" }}>
                  {t.amount_sar >= 0 ? "+" : ""}
                  {t.amount_sar.toLocaleString("ar-SA")} SAR
                </div>
              </div>
            </div>
          ))}
          {tx.length === 0 ? (
            <div className="rounded-[14px] border border-[var(--zinc-200)] bg-white p-10 text-center text-[13px] text-[var(--zinc-600)]">
              لا توجد حركات بعد
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

