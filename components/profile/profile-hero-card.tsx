/* ────────────────────────────────────────────────────────────────
   profile-hero-card.tsx  (UPDATED)
   
   ✅ Current VIP cashback rank দেখাবে (API থেকে real data)
   ✅ Progress bar দেখাবে (turnover progress)
   ✅ VIP cashback page এ navigate করার link আছে
   ✅ Loading skeleton আছে
   ────────────────────────────────────────────────────────────── */

"use client";

import { useGetMyVipCashbackInfoQuery } from "@/redux/features/vipCashback/vipCashbackApi";
import Link from "next/link";
import { useSelector } from "react-redux";
import { getRankConfig } from "../vip/VipRankBadge";

/* ────────────────────────────────────────────────────────────────
   ProfileHeroCard
   ────────────────────────────────────────────────────────────── */
const ProfileHeroCard = () => {
  const { user } = useSelector((s: any) => s.auth) as any;

  /* ── VIP Cashback info API ── */
  const { data: vipData, isLoading: vipLoading } =
    useGetMyVipCashbackInfoQuery();

  const vipInfo = vipData?.data;
  const currentRank = vipInfo?.currentRank;
  const nextRank = vipInfo?.nextRank;
  const userProgress = vipInfo?.userProgress;

  /* ── Rank config (color, glow etc.) ── */
  const rankCfg = getRankConfig(currentRank?.rank);

  /* ── Progress percent (turnover toward next rank) ── */
  const progressPercent = nextRank
    ? Math.min(
        100,
        ((userProgress?.turnoverTotal ?? 0) / nextRank.minTurnover) * 100,
      )
    : currentRank
      ? 100
      : 0;

  /* ── Name ── */
  const shortName =
    user?.name?.length > 18
      ? user?.name.slice(0, 18) + "..."
      : user?.name || "Player Name";

  const username = user?.customerId || "@player1234";

  return (
    <section
      className="relative w-full rounded-[24px] overflow-hidden p-5"
      style={{
        background:
          "linear-gradient(145deg, rgba(74,26,138,0.85) 0%, rgba(29,5,70,0.9) 100%)",
        border: `1px solid ${currentRank ? rankCfg.border : "rgba(255,215,0,0.2)"}`,
        boxShadow: `0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`,
      }}
    >
      {/* Top shine */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />

      <div className="flex flex-col gap-5">
        {/* ── Avatar + Name section ── */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full text-[44px]"
              style={{
                background: "linear-gradient(145deg, #5b21b6 0%, #7c3aed 100%)",
                border: "3px solid #ffd700",
                boxShadow: `0 0 0 6px rgba(255,215,0,0.15), 0 8px 24px rgba(0,0,0,0.5)`,
              }}
            >
              👨
            </div>
            {/* Online dot */}
            <div
              className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-[#1a0533] bg-green-400"
              style={{ boxShadow: "0 0 6px rgba(46,204,113,0.8)" }}
            />
            {/* Country badge */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10px] font-black text-white whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              🇧🇩 BD
            </div>
          </div>

          {/* Name & Username */}
          <div>
            <h2 className="text-[24px] font-black tracking-tight text-white leading-tight">
              {shortName}
            </h2>
            <p className="mt-0.5 text-[13px] font-semibold text-white/50">
              {username}
            </p>
            <button className="ls-btn ls-btn-purple mt-3 px-4 py-2 text-[12px] font-black">
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {/* ── VIP Rank Card (clickable → VIP cashback page) ── */}
        <Link href="/vip-cashback" className="block">
          <div
            className="relative flex flex-col items-center justify-center rounded-2xl px-6 py-4 text-center cursor-pointer transition-transform active:scale-[0.98]"
            style={{
              background: currentRank
                ? `linear-gradient(135deg, ${rankCfg.bg} 0%, rgba(29,5,70,0.6) 100%)`
                : "rgba(0,0,0,0.3)",
              border: `1px solid ${currentRank ? rankCfg.border : "rgba(255,215,0,0.2)"}`,
              boxShadow: currentRank
                ? `0 0 20px ${rankCfg.glow}30`
                : "0 0 20px rgba(255,215,0,0.1)",
            }}
          >
            {/* ── Label ── */}
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">
              Current Rank
            </p>

            {/* ── Rank name ── */}
            {vipLoading ? (
              <div className="h-8 w-24 rounded-lg bg-white/10 animate-pulse my-1" />
            ) : (
              <h3
                className="text-[28px] font-black"
                style={{
                  color: currentRank ? rankCfg.color : "#666",
                  textShadow: currentRank ? `0 0 12px ${rankCfg.glow}` : "none",
                }}
              >
                {currentRank ? `${currentRank.rank}` : "No Rank Yet"}
              </h3>
            )}

            {/* ── Cashback % badge ── */}
            {currentRank && !vipLoading && (
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-black text-black"
                  style={{ background: rankCfg.color }}
                >
                  {currentRank.cashback}% cashback
                </span>
                <span className="text-[10px] text-white/40 font-semibold">
                  {userProgress?.totalMatches ?? 0} matches
                </span>
              </div>
            )}

            {/* ── Progress bar (turnover toward next rank) ── */}
            <div
              className="mt-3 w-full rounded-full overflow-hidden h-1.5"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPercent}%`,
                  background: currentRank
                    ? `linear-gradient(90deg, ${rankCfg.color}, ${rankCfg.color}aa)`
                    : "linear-gradient(90deg, #ffd700, #ffd700aa)",
                  boxShadow: currentRank ? `0 0 6px ${rankCfg.glow}` : "none",
                }}
              />
            </div>

            {/* ── Progress label ── */}
            <p className="mt-1 text-[10px] text-white/30 font-semibold">
              {vipLoading
                ? "Loading..."
                : nextRank
                  ? `${(userProgress?.turnoverTotal ?? 0).toLocaleString()} / ${nextRank.minTurnover.toLocaleString()} XP → ${nextRank.rank}`
                  : currentRank
                    ? "Max Rank Reached 🎉"
                    : "Play games to earn XP"}
            </p>

            {/* Navigate arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-lg">
              →
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default ProfileHeroCard;
