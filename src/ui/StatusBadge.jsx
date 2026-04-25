import clsx from "clsx";

const map = {
  open: { label: "مفتوح", bg: "bg-[var(--green-100)]", text: "text-[var(--green-700)]", dot: "bg-[var(--green-600)]", pulse: true },
  in_progress: { label: "قيد التنفيذ", bg: "bg-[var(--amber-100)]", text: "text-[#92400e]", dot: "bg-[var(--amber-500)]" },
  completed: { label: "مكتمل", bg: "bg-[var(--zinc-100)]", text: "text-[var(--zinc-600)]", dot: "bg-[var(--zinc-500)]" },
  cancelled: { label: "ملغي", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  expired: { label: "منتهي", bg: "bg-[var(--zinc-100)]", text: "text-[var(--zinc-600)]", dot: "bg-[var(--zinc-500)]" },

  pending_confirmation: { label: "بانتظار التأكيد", bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500", pulse: true },
  active: { label: "نشط", bg: "bg-[var(--green-100)]", text: "text-[var(--green-700)]", dot: "bg-[var(--green-600)]", pulse: true },
  disputed: { label: "متنازع", bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },

  approved: { label: "معتمد", bg: "bg-[var(--green-100)]", text: "text-[var(--green-700)]", dot: "bg-[var(--green-600)]" },
  pending: { label: "قيد المراجعة", bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-500", pulse: true },
  rejected: { label: "مرفوض", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" }
};

export function StatusBadge({ status, className }) {
  const s = map[status] ?? { label: status, bg: "bg-[var(--zinc-100)]", text: "text-[var(--zinc-700)]", dot: "bg-[var(--zinc-400)]" };
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-bold",
        s.bg,
        s.text,
        className
      )}
    >
      <span className={clsx("h-2 w-2 rounded-full", s.dot, s.pulse && "animate-statusPulse")} />
      {s.label}
    </span>
  );
}

