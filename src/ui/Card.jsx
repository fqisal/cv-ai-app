import clsx from "clsx";

export function Card({ className, ...props }) {
  return (
    <div
      className={clsx(
        "card rounded-[16px] border bg-[var(--card-bg)] border-[color:var(--card-border)] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-[2px] transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

