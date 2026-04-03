const DailyBonus = () => {
  return (
    <section className="flex items-center gap-3 rounded-[30px] bg-[linear-gradient(180deg,#132562_0%,#101d4d_100%)] px-4 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.34)] ring-1 ring-white/10">
      {/* ────────── Bonus Left ────────── */}
      <div className="shrink-0 text-[72px] leading-none">🎁</div>

      {/* ────────── Bonus Content ────────── */}
      <div className="min-w-0 flex-1">
        <h3 className="text-[22px] font-black tracking-tight text-[#ffbf17]">
          Daily Bonus
        </h3>
        <p className="mt-1 text-[20px] font-extrabold leading-tight text-white">
          Get 💎50 Free!
        </p>
      </div>

      {/* ────────── Bonus CTA ────────── */}
      <button className="rounded-full bg-[linear-gradient(180deg,#ffc91d_0%,#ffb000_100%)] px-5 py-3 text-[16px] font-extrabold text-[#3a2600] shadow-[0_8px_18px_rgba(0,0,0,0.28)]">
        Claim Now
      </button>
    </section>
  );
};

export default DailyBonus;
