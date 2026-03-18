import BottomNav from "./bottom-nav";
import DashboardHeader from "./dashboard-header";
import HeroSection from "./hero-section";
import ModeCards from "./mode-cards";

const DashboardShell = () => {
  return (
    <main className="min-h-screen  mx-auto w-full md:w-[600px] bg-[#040b2b] text-white">
      {/* ────────── Background Layer ────────── */}
      <div className=" w-full min-h-screen  bg-[radial-gradient(circle_at_top,#5c2278_0%,#12215a_24%,#07133b_58%,#040b2b_100%)] px-4 pb-32 pt-4">
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
