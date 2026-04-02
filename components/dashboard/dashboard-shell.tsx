import DashboardHeader from "./dashboard-header";
import HeroSection from "./hero-section";
import ModeCards from "./mode-cards";

const DashboardShell = () => {
  return (
    <main className="relative min-h-screen w-full overflow-hidden text-white md:min-h-[880px] md:rounded-[30px] md:border md:border-white/10 md:shadow-[0_25px_90px_rgba(0,0,0,0.55)]">
      {/* ── Ludo Star Deep Purple Background ── */}
      <div
        className="relative w-full min-h-screen overflow-hidden px-4 pb-32 pt-4 md:min-h-[880px] md:rounded-[30px] ls-stars-bg"
        style={{
          background:
            "radial-gradient(ellipse at top, #3d0a7a 0%, #1a0533 45%, #0d0221 100%)",
        }}
      >
        {/* Decorative glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[20%] right-[-60px] w-[200px] h-[200px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, #ffd700 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-[40%] left-[-40px] w-[160px] h-[160px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, #00d4ff 0%, transparent 70%)",
            }}
          />
          {/* Decorative star dots */}
          {[
            "top-[12%] left-[8%]",
            "top-[25%] right-[12%]",
            "top-[55%] left-[5%]",
            "top-[70%] right-[8%]",
            "top-[8%] right-[30%]",
          ].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} text-yellow-300 opacity-60 text-sm`}
            >
              ★
            </div>
          ))}
        </div>

        <div className="relative z-10 w-full space-y-5">
          <DashboardHeader />
          <HeroSection />
          <ModeCards />
        </div>
      </div>
    </main>
  );
};

export default DashboardShell;
