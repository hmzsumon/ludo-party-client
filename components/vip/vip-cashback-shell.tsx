/* ────────────────────────────────────────────────────────────────
   vip-cashback-shell.tsx
   VIP Cashback Page — screenshot এর মত হুবহু

   ✅ Top section: current rank + cashback % + exp rate + progress bar
   ✅ Available from date দেখাবে
   ✅ VIP cashback statuses list (Copper → VIP)
   ✅ প্রতিটা rank এ cashback % + experience + matches দেখাবে
   ✅ Current rank টা highlighted হবে
   ✅ নতুন rank পাওয়ার পর progress নতুন করে start হবে
   ────────────────────────────────────────────────────────────── */

"use client";

import { useGetMyVipCashbackInfoQuery } from "@/redux/features/vipCashback/vipCashbackApi";
import Link from "next/link";
import { getRankConfig } from "./VipRankBadge";

/* ────────── Rank icon SVG/emoji map ────────── */
const RANK_MEDAL_ICON: Record<string, string> = {
  Copper: "🥉",
  Bronze: "🥈",
  Silver: "🥈",
  Gold: "🥇",
  Ruby: "♦️",
  Sapphire: "💠",
  Diamond: "💎",
  VIP: "👑",
};

/* ────────── Number format করো ────────── */
const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(0)} 000`
      : String(n);

/* ────────── Progress text helper ────────── */
const getProgressLabel = (
  currentStageMatches: number,
  currentStageTurnover: number,
  currentRankName?: string | null,
  nextRank?: {
    rank: string;
    cashback: number;
    minMatches: number;
    minTurnover: number;
  } | null,
) => {
  if (!nextRank) return "Max Rank";

  /* ── Copper only matches based ── */
  if (!currentRankName && Number(nextRank.minTurnover) === 0) {
    return `${currentStageMatches.toLocaleString()} / ${nextRank.minMatches.toLocaleString()} matches`;
  }

  /* ── বাকি সব rank fresh turnover based ── */
  return `${currentStageTurnover.toLocaleString()} / ${nextRank.minTurnover.toLocaleString()}`;
};

/* ────────── Progress percent helper ────────── */
const getProgressPercent = (
  currentStageMatches: number,
  currentStageTurnover: number,
  currentRankName?: string | null,
  nextRank?: {
    minMatches: number;
    minTurnover: number;
  } | null,
) => {
  if (!nextRank) return currentRankName ? 100 : 0;

  if (!currentRankName && Number(nextRank.minTurnover) === 0) {
    const targetMatches = Math.max(1, Number(nextRank.minMatches || 0));
    return Math.min(100, (currentStageMatches / targetMatches) * 100);
  }

  const targetTurnover = Math.max(1, Number(nextRank.minTurnover || 0));
  return Math.min(100, (currentStageTurnover / targetTurnover) * 100);
};

/* ────────────────────────────────────────────────────────────────
   VipCashbackShell
   ────────────────────────────────────────────────────────────── */
const VipCashbackShell = () => {
  const { data, isLoading } = useGetMyVipCashbackInfoQuery();

  const info = data?.data;
  const currentRank = info?.currentRank;
  const allRanks = info?.allRanks ?? [];
  const userProgress = info?.userProgress;
  const thisWeek = info?.thisWeek;

  /* ── Progress এখন fresh stage based ── */
  const nextRank = info?.nextRank;
  const currentStageMatches = userProgress?.currentStageMatches ?? 0;
  const currentStageTurnover = userProgress?.currentStageTurnover ?? 0;

  const progressPercent = getProgressPercent(
    currentStageMatches,
    currentStageTurnover,
    currentRank?.rank,
    nextRank,
  );

  const progressLabel = getProgressLabel(
    currentStageMatches,
    currentStageTurnover,
    currentRank?.rank,
    nextRank,
  );

  /* ── Next available cashback date: পরের রবিবার ── */
  const nextSunday = thisWeek?.weekEnd ? new Date(thisWeek.weekEnd) : null;

  const formatDate = (d: Date | null) => {
    if (!d) return "—";
    return `${d.getUTCHours().toString().padStart(2, "0")}:${d
      .getUTCMinutes()
      .toString()
      .padStart(2, "0")} ${d.getUTCDate().toString().padStart(2, "0")}.${(
      d.getUTCMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${d.getUTCFullYear()}`;
  };

  const rankCfg = getRankConfig(currentRank?.rank);

  return (
    <main className="min-h-screen w-full text-white ls-stars-bg">
      <div className="relative min-h-screen w-full pb-28">
        {/* ── Glow Blobs ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, #ff9f00 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[430px] px-4 pt-5">
          {/* ─────────────────────────────────────────────────────────
              TOP BAR
              ───────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 mb-5">
            <Link href="/profile">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                ←
              </button>
            </Link>
            <h1 className="text-[18px] font-black text-white">VIP Cashback</h1>
          </div>

          {/* ─────────────────────────────────────────────────────────
              CURRENT RANK CARD
              ───────────────────────────────────────────────────────── */}
          <section
            className="relative rounded-[24px] overflow-hidden p-5 mb-4"
            style={{
              background:
                "linear-gradient(145deg, rgba(74,26,138,0.85) 0%, rgba(29,5,70,0.9) 100%)",
              border: `1px solid ${rankCfg.border}`,
              boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 40px ${rankCfg.glow}20`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />

            {/* ── Rank icon + badges row ── */}
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-4xl"
                style={{
                  background: rankCfg.bg,
                  border: `2px solid ${rankCfg.border}`,
                  boxShadow: `0 0 20px ${rankCfg.glow}`,
                }}
              >
                {RANK_MEDAL_ICON[currentRank?.rank ?? "None"] ?? "⚪"}
              </div>

              <div className="flex flex-col gap-2">
                <h2
                  className="text-[24px] font-black leading-tight"
                  style={{ color: rankCfg.color }}
                >
                  {isLoading
                    ? "Loading..."
                    : (currentRank?.rank ?? "No Rank Yet")}
                </h2>

                <div className="flex flex-wrap gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-[12px] font-black text-black"
                    style={{
                      background: rankCfg.color,
                      boxShadow: `0 0 10px ${rankCfg.glow}`,
                    }}
                  >
                    {currentRank?.cashback ?? 0}% cashback
                  </span>

                  {/* ── current stage matches দেখাও ── */}
                  <span
                    className="rounded-full px-3 py-1 text-[12px] font-black"
                    style={{
                      background: "rgba(255,159,0,0.2)",
                      border: "1px solid rgba(255,159,0,0.4)",
                      color: "#ff9f00",
                    }}
                  >
                    {currentRank
                      ? currentStageMatches
                      : (userProgress?.totalMatches ?? 0)}{" "}
                    matches
                  </span>
                </div>
              </div>
            </div>

            {/* ── Turnover / fresh progress bar ── */}
            <div className="mt-5">
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-white/50">
                  Experience (Turnover)
                </span>
                <span className="text-[11px] font-black text-white/80">
                  {progressLabel}
                </span>
              </div>
              <div
                className="w-full h-3 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, ${rankCfg.color}, ${rankCfg.color}aa)`,
                    boxShadow: `0 0 8px ${rankCfg.glow}`,
                  }}
                />
              </div>
              {nextRank && (
                <p className="mt-1 text-[10px] text-white/30 font-semibold text-right">
                  Next: {nextRank.rank} ({nextRank.cashback}% cashback)
                </p>
              )}
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              THIS WEEK STATS + AVAILABLE FROM DATE
              ───────────────────────────────────────────────────────── */}
          <section
            className="rounded-[20px] overflow-hidden mb-4"
            style={{
              background:
                "linear-gradient(145deg, rgba(29,5,70,0.9) 0%, rgba(10,2,30,0.95) 100%)",
              border: "1px solid rgba(255,215,0,0.15)",
            }}
          >
            <div
              className="px-4 py-3 flex items-center justify-center gap-2"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span className="text-[12px] font-semibold text-white/50">
                Available from:
              </span>
              <span className="text-[13px] font-black text-white">
                {formatDate(nextSunday)}
              </span>
            </div>

            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    This week's net loss
                  </p>
                  <p className="text-[22px] font-black text-red-400 mt-0.5">
                    💎 {(thisWeek?.currentNetLoss ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    Est. cashback
                  </p>
                  <p
                    className="text-[22px] font-black mt-0.5"
                    style={{ color: rankCfg.color }}
                  >
                    💎 {(thisWeek?.estimatedCashback ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <Link href="/vip-cashback/history">
                <button
                  className="mt-4 w-full rounded-xl py-3 text-[13px] font-black text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)",
                    boxShadow: "0 4px 16px rgba(91,33,182,0.4)",
                  }}
                >
                  📜 Find out your cashback amount →
                </button>
              </Link>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              VIP CASHBACK STATUSES LIST
              ───────────────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[17px] font-black text-white">
                VIP cashback statuses
              </h2>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full text-white/40"
                style={{ border: "1.5px solid rgba(255,255,255,0.2)" }}
              >
                ?
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <RankCardSkeleton key={i} />
                  ))
                : allRanks.map((rankItem) => {
                    const isCurrent = rankItem.rank === currentRank?.rank;

                    return (
                      <RankStatusCard
                        key={rankItem._id}
                        rank={rankItem.rank}
                        cashback={rankItem.cashback}
                        minMatches={rankItem.minMatches}
                        minTurnover={rankItem.minTurnover}
                        isActive={isCurrent}
                        achieved={Boolean(rankItem.achieved)}
                      />
                    );
                  })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default VipCashbackShell;

/* ════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════════════════════════ */

/* ────────── Rank Status Card ────────── */
interface RankStatusCardProps {
  rank: string;
  cashback: number;
  minMatches: number;
  minTurnover: number;
  isActive: boolean;
  achieved: boolean;
}

const RankStatusCard = ({
  rank,
  cashback,
  minMatches,
  minTurnover,
  isActive,
  achieved,
}: RankStatusCardProps) => {
  const cfg = getRankConfig(rank);

  return (
    <div
      className="relative flex items-center gap-4 rounded-[18px] overflow-hidden p-4"
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${cfg.bg} 0%, rgba(29,5,70,0.9) 100%)`
          : "linear-gradient(145deg, rgba(30,10,60,0.7) 0%, rgba(10,2,30,0.8) 100%)",
        border: isActive
          ? `1px solid ${cfg.border}`
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isActive
          ? `0 0 24px ${cfg.glow}30, 0 4px 16px rgba(0,0,0,0.4)`
          : "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at left center, ${cfg.glow}15 0%, transparent 60%)`,
          }}
        />
      )}

      <div
        className="relative shrink-0 flex h-14 w-14 items-center justify-center rounded-full text-3xl"
        style={{
          background: isActive ? cfg.bg : "rgba(255,255,255,0.04)",
          border: `1.5px solid ${isActive ? cfg.border : "rgba(255,255,255,0.08)"}`,
          boxShadow: isActive ? `0 0 14px ${cfg.glow}` : "none",
        }}
      >
        {RANK_MEDAL_ICON[rank] ?? "⚪"}

        {achieved && (
          <div
            className="absolute -bottom-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full text-[10px] font-black"
            style={{ background: "#22c55e", border: "1.5px solid #000" }}
          >
            ✓
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[16px] font-black"
            style={{ color: isActive ? cfg.color : "#fff" }}
          >
            {rank}
          </span>

          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-black"
            style={{
              background: isActive ? cfg.color : "rgba(255,255,255,0.1)",
              color: isActive ? "#000" : "rgba(255,255,255,0.7)",
            }}
          >
            {cashback}% cashback
          </span>
        </div>

        <div className="mt-1.5 flex flex-col gap-0.5">
          <p className="text-[12px] font-semibold text-white/50">
            Experience:{" "}
            <span className="text-white/80 font-black">{fmt(minTurnover)}</span>
          </p>
          <p className="text-[12px] font-semibold text-white/50">
            Matches:{" "}
            <span className="text-white/80 font-black">{minMatches}</span>
          </p>
        </div>
      </div>

      {isActive && (
        <div
          className="shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black"
          style={{
            background: cfg.color,
            color: "#000",
            boxShadow: `0 0 10px ${cfg.glow}`,
          }}
        >
          CURRENT
        </div>
      )}
    </div>
  );
};

/* ────────── Loading skeleton ────────── */
const RankCardSkeleton = () => (
  <div
    className="flex items-center gap-4 rounded-[18px] p-4 animate-pulse"
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <div className="h-14 w-14 rounded-full bg-white/10" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-24 rounded bg-white/10" />
      <div className="h-3 w-32 rounded bg-white/10" />
      <div className="h-3 w-20 rounded bg-white/10" />
    </div>
  </div>
);
