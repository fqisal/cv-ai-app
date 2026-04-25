import React from "react";
import { Card } from "../../ui/Card.jsx";
import { StatusBadge } from "../../ui/StatusBadge.jsx";
import { useStore } from "../../mock/store.js";

export function AdminCategories() {
  const { state } = useStore();
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[30px] font-bold text-[var(--zinc-900)]">الفئات</div>
        <div className="text-[13px] text-[var(--zinc-600)]">إدارة فئات الخدمات (Demo)</div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {state.categories.map((c) => (
          <Card key={c.id} className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[15px] font-bold text-[var(--zinc-900)]">{c.name}</div>
                <div className="mt-1 text-[12px] text-[var(--zinc-500)]">{c.slug}</div>
              </div>
              <StatusBadge status={c.status === "active" ? "approved" : "rejected"} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

