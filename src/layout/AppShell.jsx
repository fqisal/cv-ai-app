import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Bell, LayoutDashboard, Leaf, ClipboardList, Briefcase, Users, Star, Layers, Wallet, Sun, Moon, Search, Settings } from "lucide-react";
import { Avatar } from "../ui/Avatar.jsx";
import { useStore } from "../mock/store.js";
import { Button } from "../ui/Button.jsx";

function TopNav() {
  const { state, setTheme, markAllNotificationsRead } = useStore();
  const user = state.users.find((u) => u.id === state.ui.actorUserId);
  const unread = state.notifications.filter((n) => n.user_id === state.ui.actorUserId && !n.read).length;
  const [open, setOpen] = React.useState(false);

  return (
    <div className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-[color:var(--card-border)] bg-white/85 backdrop-blur-[12px]">
      <div className="h-[2px] w-full bg-gradient-to-l from-[var(--green-600)] to-[var(--green-400)]" />
      <div className="mx-auto flex h-[calc(64px-2px)] max-w-[1280px] items-center gap-4 px-8">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-[12px] bg-[var(--green-800)] grid place-items-center shadow-[0_10px_30px_rgba(22,163,74,0.18)]">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-bold text-[var(--zinc-900)]">Zaraa</div>
            <div className="text-[11px] font-medium text-[var(--zinc-500)]">زرعة</div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="hidden md:flex w-[min(520px,40vw)] items-center gap-2 rounded-[12px] border border-[var(--zinc-200)] bg-[var(--zinc-50)] px-3 py-2">
          <Search className="h-4 w-4 text-[var(--zinc-500)]" />
          <input
            className="w-full bg-transparent text-[13px] text-[var(--zinc-700)] outline-none"
            placeholder="بحث سريع... (Ctrl+K)"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            className="relative h-9 w-9 rounded-[10px] bg-[var(--zinc-100)] hover:bg-[var(--zinc-200)] transition grid place-items-center"
            onClick={() => {
              setOpen((x) => !x);
              if (!open) markAllNotificationsRead(state.ui.actorUserId);
            }}
            aria-label="notifications"
          >
            <Bell className="h-4 w-4 text-[var(--zinc-700)]" />
            {unread > 0 ? (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-red-500 px-1 text-[11px] font-bold text-white grid place-items-center">
                {unread}
              </span>
            ) : null}
          </button>

          <button
            className="h-9 w-9 rounded-[10px] bg-[var(--zinc-100)] hover:bg-[var(--zinc-200)] transition grid place-items-center"
            onClick={() => setTheme(state.ui.theme === "dark" ? "light" : "dark")}
            aria-label="theme"
          >
            {state.ui.theme === "dark" ? <Sun className="h-4 w-4 text-[var(--zinc-700)]" /> : <Moon className="h-4 w-4 text-[var(--zinc-700)]" />}
          </button>

          <div className="flex items-center gap-2 rounded-full border border-[var(--zinc-200)] bg-white px-2 py-1">
            <Avatar name={user?.full_name ?? "Zaraa User"} size="sm" />
            <div className="hidden sm:block">
              <div className="text-[12px] font-bold text-[var(--zinc-900)]">{user?.full_name ?? "—"}</div>
              <div className="text-[11px] text-[var(--zinc-500)]">{user?.role ?? "—"}</div>
            </div>
          </div>
        </div>
      </div>

      {open ? (
        <div className="mx-auto max-w-[1280px] px-8">
          <div className="absolute mt-2 w-[min(520px,92vw)] rounded-[16px] border border-[var(--zinc-200)] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)] p-3">
            <div className="flex items-center justify-between pb-2">
              <div className="text-[13px] font-bold text-[var(--zinc-900)]">الإشعارات</div>
              <div className="text-[11px] text-[var(--zinc-500)]">تجريبي</div>
            </div>
            <div className="max-h-[320px] overflow-auto space-y-2">
              {state.notifications
                .filter((n) => n.user_id === state.ui.actorUserId)
                .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                .map((n) => (
                  <div key={n.id} className="rounded-[14px] border border-[var(--zinc-200)] p-3 hover:bg-[var(--green-50)] transition">
                    <div className="text-[13px] text-[var(--zinc-800)]">{n.text}</div>
                    <div className="mt-1 text-[11px] text-[var(--zinc-500)]">{new Date(n.created_at).toLocaleString("ar-SA")}</div>
                  </div>
                ))}
              {state.notifications.filter((n) => n.user_id === state.ui.actorUserId).length === 0 ? (
                <div className="rounded-[14px] border border-[var(--zinc-200)] p-6 text-center text-[13px] text-[var(--zinc-600)]">
                  لا توجد إشعارات جديدة
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function navForRole(role) {
  if (role === "admin") {
    return [
      { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
      { to: "/admin/providers", label: "مقدمو الخدمات", icon: Users },
      { to: "/admin/requests", label: "الطلبات", icon: ClipboardList },
      { to: "/admin/jobs", label: "المشاريع", icon: Briefcase },
      { to: "/admin/ratings", label: "التقييمات", icon: Star },
      { to: "/admin/categories", label: "الفئات", icon: Layers }
    ];
  }
  if (role === "provider") {
    return [
      { to: "/provider", label: "لوحة المزود", icon: LayoutDashboard },
      { to: "/provider/inbox", label: "صندوق الطلبات", icon: ClipboardList },
      { to: "/provider/jobs", label: "مشاريعي", icon: Briefcase },
      { to: "/wallet", label: "المحفظة", icon: Wallet },
      { to: "/settings", label: "الإعدادات", icon: Settings }
    ];
  }
  return [
    { to: "/", label: "الرئيسية", icon: LayoutDashboard },
    { to: "/requests", label: "طلباتي", icon: ClipboardList },
    { to: "/jobs", label: "مشاريعي", icon: Briefcase },
    { to: "/wallet", label: "المحفظة", icon: Wallet },
    { to: "/settings", label: "الإعدادات", icon: Settings }
  ];
}

function Sidebar() {
  const { state, setActor } = useStore();
  const [collapsed, setCollapsed] = React.useState(false);
  const nav = navForRole(state.ui.role);

  return (
    <div
      className={clsx(
        "fixed top-16 bottom-0 right-0 z-40 border-l border-[rgba(255,255,255,0.08)]",
        collapsed ? "w-16" : "w-60"
      )}
      style={{
        background: "linear-gradient(180deg, #052e16 0%, #0d2818 50%, #052e16 100%)"
      }}
    >
      <div className="relative h-full overflow-hidden">
        <div
          className="absolute -top-20 -left-20 h-56 w-56 rounded-full opacity-40 animate-orbFloat"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.55), transparent 60%)" }}
        />
        <div
          className="absolute top-40 -right-24 h-56 w-56 rounded-full opacity-30 animate-orbFloat"
          style={{ background: "radial-gradient(circle, rgba(134,239,172,0.55), transparent 60%)", animationDelay: "600ms" }}
        />

        <div className="px-3 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div className={clsx("text-white font-bold", collapsed ? "text-[12px]" : "text-[13px]")}>
              {collapsed ? "Z" : "Zaraa"}
            </div>
            <button
              className="h-8 w-8 rounded-[10px] bg-white/10 hover:bg-white/15 transition grid place-items-center text-white"
              onClick={() => setCollapsed((x) => !x)}
              aria-label="toggle"
            >
              {collapsed ? "←" : "→"}
            </button>
          </div>

          <nav className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      "nav-item flex items-center gap-3 rounded-[12px] px-3 py-2 text-[13px] font-medium transition-all",
                      isActive
                        ? "bg-[var(--green-600)] text-white shadow-[0_10px_30px_rgba(22,163,74,0.18)]"
                        : "text-[var(--green-300)] hover:bg-white/10 hover:text-white"
                    )
                  }
                >
                  <Icon className={clsx("h-4 w-4", collapsed ? "mx-auto" : "")} />
                  {collapsed ? null : <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-6 rounded-[16px] bg-white/10 p-3 text-white">
            <div className="text-[12px] font-bold">تبديل الدور (Demo)</div>
            <div className="mt-2 grid gap-2">
              <Button
                variant="secondary"
                className="justify-center"
                onClick={() => setActor({ role: "customer", actorUserId: "u_c_1" })}
              >
                عميل
              </Button>
              <Button
                variant="secondary"
                className="justify-center"
                onClick={() => setActor({ role: "provider", actorUserId: "u_p_1" })}
              >
                مزود
              </Button>
              <Button
                variant="secondary"
                className="justify-center"
                onClick={() => setActor({ role: "admin", actorUserId: "u_admin_1" })}
              >
                مدير
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <Sidebar />
      <main className="pt-20 pr-[260px] px-8 pb-10">
        <div className="mx-auto max-w-[1280px] animate-pageEnter">{children}</div>
      </main>
    </div>
  );
}

