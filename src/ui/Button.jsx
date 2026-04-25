import React from "react";
import clsx from "clsx";

function rippleize(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const rx = ((e.clientX - rect.left) / rect.width) * 100;
  const ry = ((e.clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--rx", `${rx}%`);
  el.style.setProperty("--ry", `${ry}%`);
  el.classList.add("rippling");
  window.setTimeout(() => el.classList.remove("rippling"), 420);
}

export function Button({ variant = "primary", className, onClick, ...props }) {
  const base =
    "ripple inline-flex items-center justify-center gap-2 rounded-[10px] px-5 py-2.5 text-[13px] font-semibold transition-all duration-150 select-none";

  const variants = {
    primary:
      "bg-[var(--green-600)] text-white shadow-[0_2px_10px_rgba(22,163,74,0.16)] hover:bg-[var(--green-700)] hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(22,163,74,0.15)] active:bg-[var(--green-800)] active:translate-y-0 active:scale-[0.98]",
    secondary:
      "bg-white text-[var(--zinc-700)] border border-[var(--zinc-200)] hover:bg-[var(--zinc-50)] hover:border-[var(--zinc-300)]",
    ghost: "bg-transparent text-[var(--zinc-600)] hover:bg-[var(--zinc-100)]",
    danger:
      "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 active:scale-[0.98]"
  };

  return (
    <button
      className={clsx(base, variants[variant], className)}
      onClick={(e) => {
        rippleize(e);
        onClick?.(e);
      }}
      {...props}
    />
  );
}

