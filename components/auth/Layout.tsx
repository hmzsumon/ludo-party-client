"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";

import BottomNav from "../dashboard/bottom-nav";
import { MobileSidebar } from "../sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // single source of truth for mobile drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);

  // desktop sidebar width reacts to global collapse state
  const collapsed = useSelector((s: any) => s.ui.sidebarCollapsed) as boolean;
  const gridCols = collapsed
    ? "md:grid-cols-[72px_1fr]"
    : "md:grid-cols-[280px_1fr]";

  return (
    <div className="min-h-screen  text-neutral-100">
      {/* pass open + toggle to header so icon swaps (Menu/X) */}
      {/* <Header open={mobileOpen} onToggle={() => setMobileOpen((v) => !v)} /> */}

      {/* push content below fixed header */}
      <div className={` md:grid ${gridCols}`}>
        {/* desktop sidebar is a column, not overlay */}
        {/* <aside className="hidden md:block">
          <DesktopSidebar />
        </aside> */}

        <main className="min-h-[calc(100dvh-4rem)] w-full  ">
          <div className="pb-10">{children}</div>
          <BottomNav />
        </main>
      </div>

      {/* mobile drawer (starts just below header) */}
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
  );
}
