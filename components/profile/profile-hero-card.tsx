"use client";

import { useSelector } from "react-redux";

const ProfileHeroCard = () => {
  const { user } = useSelector((s: any) => s.auth) as any;

  const shortName =
    user?.name?.length > 18
      ? user?.name.slice(0, 18) + "..."
      : user?.name || "Player Name";

  const username = user?.username || "@player1234";

  return (
    <section className="w-full rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(49,28,118,0.80)_0%,rgba(20,17,74,0.78)_100%)] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.32)] backdrop-blur sm:p-5 lg:p-6">
      {/* ────────── Hero Card Wrapper ────────── */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* ────────── Left Profile Info ────────── */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-[4px] border-[#ffcc3d] bg-[linear-gradient(180deg,#2bc5ff_0%,#2d5bff_100%)] text-[52px] shadow-[0_10px_25px_rgba(0,0,0,0.35)] sm:h-32 sm:w-32">
              👨
            </div>

            <div className="absolute -bottom-1 right-1 rounded-[10px] border border-white/10 bg-[linear-gradient(180deg,#22d35e_0%,#0a9d37_100%)] px-2 py-1 text-[11px] font-black text-white shadow-[0_8px_16px_rgba(0,0,0,0.25)]">
              BD
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-[32px] font-black tracking-tight text-white sm:text-[40px]">
              {shortName}
            </h2>
            <p className="mt-1 text-lg font-medium text-white/75 sm:text-xl">
              {username}
            </p>

            <button className="mt-4 rounded-full bg-[linear-gradient(180deg,#7b55ff_0%,#4d2de0_100%)] px-6 py-3 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(0,0,0,0.28)] ring-1 ring-white/10 sm:text-base">
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {/* ────────── Right Level Block ────────── */}
        <div className="rounded-[22px] border border-white/10 bg-[rgba(10,18,62,0.56)] px-5 py-4 text-center shadow-[0_10px_24px_rgba(0,0,0,0.24)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
            Player Rank
          </p>
          <h3 className="mt-2 text-[32px] font-black text-[#ffcf45]">Gold</h3>
          <p className="mt-1 text-sm font-semibold text-white/70">
            Level 18 Champion
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeroCard;
