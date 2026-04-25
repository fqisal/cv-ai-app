import clsx from "clsx";

function initials(name) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "Z";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase();
}

function hashColor(name) {
  const s = name ?? "Z";
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const palette = ["#16a34a", "#f59e0b", "#2563eb", "#7c3aed", "#dc2626"];
  return palette[h % palette.length];
}

export function Avatar({ name, size = "md", src, className }) {
  const px = { xs: 28, sm: 36, md: 44, lg: 56, xl: 80 }[size] ?? 44;
  if (src) {
    return (
      <img
        alt={name ?? "avatar"}
        src={src}
        width={px}
        height={px}
        className={clsx("rounded-full object-cover", className)}
        style={{ width: px, height: px }}
      />
    );
  }
  const bg = hashColor(name);
  return (
    <div
      className={clsx("flex items-center justify-center rounded-full text-white font-semibold", className)}
      style={{ width: px, height: px, background: bg }}
      aria-label={name}
      title={name}
    >
      <span style={{ fontSize: Math.max(11, Math.floor(px / 3)) }}>{initials(name)}</span>
    </div>
  );
}

