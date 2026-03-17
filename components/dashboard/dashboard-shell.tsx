import BottomNav from "./bottom-nav";
import DashboardHeader from "./dashboard-header";
import HeroSection from "./hero-section";
import ModeCards from "./mode-cards";

const DashboardShell = () => {
  return (
    <main className="min-h-screen overflow-hidden w-full bg-[#040b2b] text-white">
      {/* ────────── Background Layer ────────── */}
      <div className="relative mx-auto min-h-screen w-full bg-[radial-gradient(circle_at_top,#5c2278_0%,#12215a_24%,#07133b_58%,#040b2b_100%)] px-4 pb-32 pt-4">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-[-40px] top-[100px] h-48 w-48 rounded-full bg-[#4d2f91]/25 blur-3xl" />
          <div className="absolute right-[-30px] top-[280px] h-52 w-52 rounded-full bg-[#1f6fff]/20 blur-3xl" />
          <div className="absolute bottom-[180px] left-[30px] h-44 w-44 rounded-full bg-[#ff8a00]/10 blur-3xl" />
        </div>

        <div className=" w-full z-10 space-y-5">
          <DashboardHeader />
          <HeroSection />
          <ModeCards />
          {/* <QuickGames />
          <ActionShortcuts />
          <DailyBonus /> */}
        </div>

        <BottomNav />
      </div>
    </main>
  );
};

export default DashboardShell;
