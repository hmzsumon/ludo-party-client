"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import Logo from "../branding/logo";

const DashboardHeader = () => {
  const { user } = useSelector((s: any) => s.auth) as any;

  const shortName =
    user?.name?.length > 8
      ? user?.name.slice(0, 8) + "..."
      : user?.name || "User";

  return (
    <div className="relative w-full mt-4">
      {/* ────────── Logo Block ────────── */}
      <div className="flex justify-center">
        <Logo />
      </div>

      {/* ────────── Notification Block ────────── */}
      <div className="absolute right-0 top-0 flex items-center gap-4">
        <button className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(16,25,69,0.88)] shadow-[0_8px_22px_rgba(0,0,0,0.28)] ring-1 ring-white/10">
          <span className="text-xl">🔔</span>
          <span className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#111b4f] bg-[#ff4b4b] text-[12px] font-extrabold text-white">
            0
          </span>
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        {/* ────────── Profile Row ────────── */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 rounded-full bg-[rgba(16,25,69,0.88)] px-2 py-1.5 pr-4 shadow-[0_8px_22px_rgba(0,0,0,0.28)] ring-1 ring-white/10">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[#ffcc3d] bg-[linear-gradient(180deg,#ffc36b_0%,#ff8f2f_100%)] text-xl shadow-[0_6px_16px_rgba(0,0,0,0.28)]">
              👨
            </div>
            <span className="truncate text-sm font-bold text-white">
              {shortName}
            </span>
          </div>
        </div>

        {/* ────────── Wallet Row ────────── */}
        <div className="flex shrink-0 overflow-hidden rounded-full bg-[rgba(16,25,69,0.95)] shadow-[0_10px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
          <div className="flex items-center gap-1 px-2 py-2">
            <span className="text-lg">🪙</span>
            <span className="text-sm font-extrabold text-white">
              ৳ {user?.m_balance?.toLocaleString?.() ?? "0"}
            </span>
          </div>
          <Link
            href="/deposit"
            className="flex items-center justify-center bg-[linear-gradient(180deg,#15cf2d_0%,#0eaf22_100%)] px-4 text-sm font-extrabold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            <button>+ Add</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
