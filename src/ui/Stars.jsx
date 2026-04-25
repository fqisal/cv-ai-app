import clsx from "clsx";

function Star({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className={clsx("h-4 w-4", filled ? "fill-[var(--green-600)]" : "fill-[var(--zinc-200)]")}>
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export function Stars({ value = 0, outOf = 5, className }) {
  const v = Math.max(0, Math.min(outOf, value));
  return (
    <div className={clsx("inline-flex items-center gap-1", className)}>
      {Array.from({ length: outOf }).map((_, i) => (
        <Star key={i} filled={i < Math.round(v)} />
      ))}
    </div>
  );
}

