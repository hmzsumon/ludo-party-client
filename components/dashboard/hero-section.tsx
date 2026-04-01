const HeroSection = () => {
  return (
    <section className="flex w-full items-center justify-center pt-2">
      {/* ────────── Left Content ────────── */}
      <div className="w-full">
        <h1 className="leading-[1.02] text-left">
          <span className="block text-[32px] font-extrabold tracking-tight text-white">
            Play Ludo &
          </span>
          <span className="mt-1 block text-[56px] font-black tracking-tight text-[#ffb400] drop-shadow-[0_3px_0_rgba(0,0,0,0.35)]">
            Win Big Big!
          </span>
        </h1>

        <p className="mt-3 text-sm font-bold leading-[1.15] text-white">
          Challenge Friends & Earn Rewards!
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
