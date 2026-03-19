import DashboardHeader from "./dashboard-header";
import HeroSection from "./hero-section";
import ModeCards from "./mode-cards";

const DashboardShell = () => {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#040b2b] text-white md:min-h-[880px] md:rounded-[30px] md:border md:border-white/10 md:shadow-[0_25px_90px_rgba(0,0,0,0.55)]">
      {/* ────────── Background Layer ────────── */}
      <div className="relative w-full min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#5c2278_0%,#12215a_24%,#07133b_58%,#040b2b_100%)] px-4 pb-32 pt-4 md:min-h-[880px] md:rounded-[30px]">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute inset-0 bg-[url('/images/bg/bg.png')] bg-cover bg-center mix-blend-screen opacity-20" />
          <div className="absolute -bottom-24 left-1/2 h-[280px] w-[140%] -translate-x-1/2 rounded-[50%] bg-[rgba(255,255,255,0.05)] blur-0" />
        </div>

        <div className="relative z-10 w-full space-y-5">
          <DashboardHeader />
          <HeroSection />
          <ModeCards />
          {/* <QuickGames />
          <ActionShortcuts />
          <DailyBonus /> */}
        </div>
      </div>
    </main>
  );
};

export default DashboardShell;
