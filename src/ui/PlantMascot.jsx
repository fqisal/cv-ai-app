import React from "react";
import clsx from "clsx";
import { Button } from "./Button.jsx";

export function PlantMascot() {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState("help");
  const [text, setText] = React.useState("");
  const [msgs, setMsgs] = React.useState(() => [
    { from: "bot", text: "مرحباً! كيف يمكنني مساعدتك اليوم؟" }
  ]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "me", text: t }, { from: "bot", text: "تم استلام رسالتك (تجريبي). سنرد قريباً." }]);
    setText("");
  };

  return (
    <>
      <button
        className={clsx(
          "fixed bottom-6 right-6 z-[9998] h-14 w-14 rounded-full",
          "shadow-[0_0_0_8px_rgba(22,163,74,0.10),0_0_0_16px_rgba(22,163,74,0.05)]",
          "bg-[var(--green-800)] hover:-translate-y-[2px] transition-all duration-200"
        )}
        onClick={() => setOpen((x) => !x)}
        aria-label="support"
        title="الدعم والمساعدة"
      >
        <div className="h-full w-full grid place-items-center">
          <svg className="h-9 w-9 animate-plantBounce" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="28" fill="#166534" />
            <ellipse cx="28" cy="44" rx="12" ry="4" fill="#92400e" />
            <g className="animate-stemBreathe" style={{ transformOrigin: "28px 44px" }}>
              <line x1="28" y1="44" x2="28" y2="26" stroke="#16a34a" strokeWidth="2.6" strokeLinecap="round" />
            </g>
            <g className="animate-leafSway" style={{ transformOrigin: "28px 32px" }}>
              <ellipse cx="21" cy="30" rx="7" ry="4" fill="#4ade80" transform="rotate(-30 21 30)" />
            </g>
            <g className="animate-leafSway" style={{ transformOrigin: "28px 28px", animationDelay: "140ms" }}>
              <ellipse cx="35" cy="28" rx="7" ry="4" fill="#22c55e" transform="rotate(25 35 28)" />
            </g>
            <circle cx="28" cy="24" r="3" fill="#86efac" />
          </svg>
        </div>
      </button>

      <div
        className={clsx(
          "fixed bottom-6 right-6 z-[9997] w-[360px] max-w-[92vw]",
          "rounded-t-[20px] rounded-b-[16px] border border-[color:var(--card-border)] bg-[var(--card-bg)] shadow-[0_8px_32px_rgba(0,0,0,0.10)]",
          open ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-[110%] opacity-0 pointer-events-none"
        )}
        style={{ transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        <div className="rounded-t-[20px] bg-[var(--green-800)] px-4 py-3 text-white">
          <div className="text-[13px] font-bold">🌿 زرعة — الدعم والمساعدة</div>
          <div className="text-[12px] text-[var(--green-200)]">نسخة تجريبية (Mock)</div>
        </div>

        <div className="flex gap-2 px-3 pt-3">
          <button
            className={clsx(
              "rounded-full px-3 py-1 text-[12px] font-bold border",
              tab === "help"
                ? "bg-[var(--green-600)] text-white border-[var(--green-600)]"
                : "bg-transparent text-[var(--zinc-700)] border-[var(--zinc-200)]"
            )}
            onClick={() => setTab("help")}
          >
            مشكلة تقنية
          </button>
          <button
            className={clsx(
              "rounded-full px-3 py-1 text-[12px] font-bold border",
              tab === "req"
                ? "bg-[var(--green-600)] text-white border-[var(--green-600)]"
                : "bg-transparent text-[var(--zinc-700)] border-[var(--zinc-200)]"
            )}
            onClick={() => setTab("req")}
          >
            استفسار عن طلب
          </button>
          <button
            className={clsx(
              "rounded-full px-3 py-1 text-[12px] font-bold border",
              tab === "team"
                ? "bg-[var(--green-600)] text-white border-[var(--green-600)]"
                : "bg-transparent text-[var(--zinc-700)] border-[var(--zinc-200)]"
            )}
            onClick={() => setTab("team")}
          >
            تواصل مع الفريق
          </button>
        </div>

        <div className="h-[320px] overflow-auto px-3 py-3 space-y-2">
          {msgs.map((m, idx) => (
            <div
              key={idx}
              className={clsx(
                "max-w-[85%] rounded-[14px] px-3 py-2 text-[13px]",
                m.from === "me"
                  ? "mr-auto bg-[var(--green-600)] text-white"
                  : "ml-auto bg-[var(--zinc-100)] text-[var(--zinc-800)]"
              )}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-[color:var(--card-border)] p-3">
          <input
            className="h-11 flex-1 rounded-[10px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none focus:border-[var(--green-500)] focus:shadow-[0_0_0_3px_rgba(22,163,74,0.10)]"
            placeholder="اكتب رسالتك..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
          />
          <Button className="h-11 px-4" onClick={send}>
            ↑
          </Button>
        </div>
      </div>
    </>
  );
}

