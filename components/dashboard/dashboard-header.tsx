"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

const DashboardHeader = () => {
  const { user } = useSelector((s: any) => s.auth) as any;

  const shortName =
    user?.name?.length > 8
      ? user?.name.slice(0, 8) + "..."
      : user?.name || "User";

  return (
    <Link href="/personal-profile" className="relative w-full mt-2">
      {/* ── Top Row: Profile + Notification ── */}
      <div className="flex items-center justify-between gap-3">
        {/* ── Profile Pill ── */}
        <div
          className="flex items-center gap-2 rounded-full px-1.5 py-1.5 pr-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(74,26,138,0.95) 0%, rgba(29,5,70,0.95) 100%)",
            border: "1px solid rgba(255,215,0,0.3)",
            boxShadow:
              "0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Avatar */}
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl shrink-0"
            style={{
              background: "linear-gradient(180deg, #ffd700 0%, #c8960a 100%)",
              boxShadow: "0 0 0 2px #7c3aed, 0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt="user avatar"
                className=" w-10 h-10 rounded-full"
                width={40}
                height={40}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[44px]">
                👨
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest leading-none mb-0.5">
              Player
            </p>
            <p className="text-sm font-black text-white truncate">
              {shortName}
            </p>
          </div>
        </div>

        {/* ── Right: Gems + Notification ── */}
        <div className="flex items-center gap-2">
          {/* Gems Counter */}
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-2"
            style={{
              background:
                "linear-gradient(135deg, rgba(74,26,138,0.95) 0%, rgba(29,5,70,0.95) 100%)",
              border: "1px solid rgba(0,212,255,0.3)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            <span className="text-base ">💎</span>
            <span className="text-sm font-black text-cyan-300">
              {user?.m_balance?.toLocaleString?.() ?? "0"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Wallet Bar ── */}
      <div
        className="mt-3 flex items-center justify-between rounded-2xl px-3 py-2.5"
        style={{
          background:
            "linear-gradient(135deg, rgba(53,10,110,0.9) 0%, rgba(29,5,70,0.9) 100%)",
          border: "1px solid rgba(255,215,0,0.2)",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Coin balance */}
        <div className="flex items-center gap-2">
          <span className="text-2xl ls-coin">🪙</span>
          <div>
            <p className="text-[10px] text-yellow-400/80 font-bold uppercase tracking-widest leading-none">
              Balance
            </p>
            <p className="text-lg font-black text-cyan-300">
              💎 {user?.m_balance?.toLocaleString?.() ?? "0"}
            </p>
          </div>
        </div>

        {/* Add Money Button */}
        <Link href="/deposit">
          <button className="ls-btn ls-btn-gold ls-shine-effect px-5 py-2.5 text-[13px] font-black">
            + Add Money
          </button>
        </Link>
      </div>
    </Link>
  );
};

export default DashboardHeader;
