import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { useStore } from "../../mock/store.js";
import clsx from "clsx";
import { useToast } from "../../ui/Toast.jsx";

export function ChatPage() {
  const { conversationId } = useParams();
  const nav = useNavigate();
  const { push } = useToast();
  const { state, sendMessage } = useStore();

  const conv = state.conversations.find((c) => c.id === conversationId);
  const msgs = state.messages
    .filter((m) => m.conversation_id === conversationId)
    .sort((a, b) => (a.created_at > b.created_at ? 1 : -1));

  const [text, setText] = React.useState("");

  if (!conv) {
    return (
      <Card className="p-8">
        <div className="text-[15px] font-bold">المحادثة غير موجودة</div>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => nav(-1)}>
            ← رجوع
          </Button>
        </div>
      </Card>
    );
  }

  const canAccess = (() => {
    if (state.ui.role === "admin") return true;
    if (state.ui.role === "customer" && conv.customer_id === state.ui.actorUserId) return true;
    if (state.ui.role === "provider") {
      const profile = state.provider_profiles.find((p) => p.user_id === state.ui.actorUserId);
      return profile?.id === conv.provider_id;
    }
    return false;
  })();

  if (!canAccess) {
    return (
      <Card className="p-8 border border-red-200 bg-red-50">
        <div className="text-[15px] font-bold text-red-700">غير مصرح</div>
        <div className="mt-1 text-[13px] text-red-700/80">لا يمكنك الوصول لهذه المحادثة.</div>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => nav(-1)}>
            ← رجوع
          </Button>
        </div>
      </Card>
    );
  }

  const send = () => {
    const t = text.trim();
    if (!t) return;
    sendMessage({ conversationId, senderId: state.ui.actorUserId, text: t });
    setText("");
    push({ variant: "success", title: "تم الإرسال", message: "رسالة تجريبية (Mock)." });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[30px] font-bold text-[var(--zinc-900)]">المحادثة</div>
          <div className="text-[13px] text-[var(--zinc-600)]">مرتبطة بمشروع: {conv.job_id}</div>
        </div>
        <Button variant="secondary" onClick={() => nav(-1)}>
          ← رجوع
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="h-[520px] overflow-auto p-4 space-y-2">
          {msgs.map((m) => {
            const mine = m.sender_id === state.ui.actorUserId;
            return (
              <div key={m.id} className={clsx("flex", mine ? "justify-start" : "justify-end")}>
                <div
                  className={clsx(
                    "max-w-[78%] rounded-[16px] px-4 py-3 text-[13px]",
                    mine ? "bg-[var(--green-600)] text-white" : "bg-[var(--zinc-100)] text-[var(--zinc-800)]"
                  )}
                >
                  <div>{m.message_text}</div>
                  {m.attachment_url ? (
                    <img className="mt-2 rounded-[14px] border border-[var(--zinc-200)]" src={m.attachment_url} alt="attachment" />
                  ) : null}
                  <div className={clsx("mt-1 text-[11px]", mine ? "text-white/80" : "text-[var(--zinc-500)]")}>
                    {new Date(m.created_at).toLocaleTimeString("ar-SA")}
                  </div>
                </div>
              </div>
            );
          })}
          {msgs.length === 0 ? <div className="text-center text-[13px] text-[var(--zinc-600)] py-12">لا توجد رسائل</div> : null}
        </div>

        <div className="border-t border-[color:var(--card-border)] p-3 flex gap-2">
          <input
            className="h-11 flex-1 rounded-[10px] border border-[var(--zinc-200)] bg-white px-3 text-[13px] outline-none focus:border-[var(--green-500)] focus:shadow-[0_0_0_3px_rgba(22,163,74,0.10)]"
            placeholder="اكتب رسالة..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
          />
          <Button onClick={send}>إرسال</Button>
        </div>
      </Card>
    </div>
  );
}

