"use client";

import { useSelector } from "react-redux";

const rankBadges: Record<
  string,
  { label: string; color: string; glow: string }
> = {
  bronze: {
    label: "🥉 Bronze",
    color: "#cd7f32",
    glow: "rgba(205,127,50,0.5)",
  },
  silver: {
    label: "🥈 Silver",
    color: "#c0c0c0",
    glow: "rgba(192,192,192,0.5)",
  },
  gold: { label: "🥇 Gold", color: "#ffd700", glow: "rgba(255,215,0,0.6)" },
  diamond: {
    label: "💎 Diamond",
    color: "#00d4ff",
    glow: "rgba(0,212,255,0.5)",
  },
};

const ProfileHeroCard = () => {
  const { user } = useSelector((s: any) => s.auth) as any;

  const shortName =
    user?.name?.length > 18
      ? user?.name.slice(0, 18) + "..."
      : user?.name || "Player Name";
  const username = user?.username || "@player1234";
  const rank = rankBadges.gold;

  return (
    <section
      className="relative w-full rounded-[24px] overflow-hidden p-5"
      style={{
        background:
          "linear-gradient(145deg, rgba(74,26,138,0.85) 0%, rgba(29,5,70,0.9) 100%)",
        border: "1px solid rgba(255,215,0,0.2)",
        boxShadow:
          "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      {/* Top shine */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />

      <div className="flex flex-col gap-5 ">
        {/* ── Left: Avatar + Name ── */}
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

        {/* ── Right: Rank Badge ── */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl px-6 py-4 text-center"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: `1px solid ${rank.color}40`,
            boxShadow: `0 0 20px ${rank.glow}`,
          }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">
            Current Rank
          </p>
          <h3
            className="text-[28px] font-black"
            style={{ color: rank.color, textShadow: `0 0 12px ${rank.glow}` }}
          >
            {rank.label}
          </h3>
          <p className="mt-1 text-[11px] font-semibold text-white/50">
            Level 18 Champion
          </p>

          {/* Mini rank bar */}
          <div
            className="mt-3 w-full rounded-full overflow-hidden h-1.5"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "68%",
                background: `linear-gradient(90deg, ${rank.color}, ${rank.color}aa)`,
                boxShadow: `0 0 6px ${rank.glow}`,
              }}
            />
          </div>
          <p className="mt-1 text-[10px] text-white/30 font-semibold">
            6,800 / 10,000 XP
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeroCard;
