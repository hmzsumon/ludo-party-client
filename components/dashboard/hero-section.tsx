const HeroSection = () => {
  return (
    <section className=" flex items-center justify-center ">
      {/* ────────── Left Content ────────── */}
      <div>
        <h1 className="leading-[1.02]">
          <span className="block text-[32px] font-extrabold tracking-tight text-white">
            Play Ludo &
          </span>
          <span className="mt-1 block text-[56px] font-black tracking-tight text-[#ffb400] drop-shadow-[0_3px_0_rgba(0,0,0,0.35)]">
            Win Big!
          </span>
        </h1>

        <p className="mt-3 text-sm font-bold leading-[1.15] text-white">
          Challenge Friends & Earn Rewards!
        </p>
      </div>
      {/* ────────── Right Board Visual ──────────
      <div className="relative h-[190px]">
        <div className="absolute left-2 top-9 h-[120px] w-[150px] rotate-[18deg] rounded-[22px] bg-[linear-gradient(180deg,#ff5e5e_0%,#ff9c3f_100%)] p-2 shadow-[0_14px_30px_rgba(0,0,0,0.38)]">
          <div className="grid h-full grid-cols-2 gap-2 rounded-[18px] bg-[#10214d] p-2">
            <div className="rounded-[14px] bg-[#e94f4f]" />
            <div className="rounded-[14px] bg-[#3ac462]" />
            <div className="rounded-[14px] bg-[#f1cf45]" />
            <div className="rounded-[14px] bg-[#3387ff]" />
          </div>
        </div>

        <div className="absolute left-[62px] top-[26px] flex h-20 w-20 rotate-12 items-center justify-center rounded-[22px] bg-[linear-gradient(180deg,#fffdf9_0%,#dccfc7_100%)] text-[44px] shadow-[0_14px_30px_rgba(0,0,0,0.34)]">
          🎲
        </div>

        <span className="absolute left-[8px] top-[84px] text-[44px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
          🔵
        </span>
        <span className="absolute left-[36px] top-[38px] text-[42px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
          🔴
        </span>
        <span className="absolute right-[8px] top-[36px] text-[48px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
          🟡
        </span>
        <span className="absolute right-[22px] bottom-[12px] text-[42px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
          🔴
        </span>
        <span className="absolute left-[20px] bottom-[12px] text-[34px]">
          🪙
        </span>
        <span className="absolute right-[0px] top-[92px] text-[34px]">🪙</span>
      </div> */}
    </section>
  );
};

export default HeroSection;
