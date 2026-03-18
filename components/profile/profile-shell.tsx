"use client";

import LogoutButton from "../auth/LogoutButton";
import BottomNav from "../dashboard/bottom-nav";
import ProfileAccountCard from "./profile-account-card";
import ProfileHeroCard from "./profile-hero-card";
import ProfileHistoryCard from "./profile-history-card";
import ProfileStatisticsCard from "./profile-statistics-card";
import ProfileSummaryStrip from "./profile-summary-strip";
import ProfileTopbar from "./profile-topbar";
import ProfileWalletCard from "./profile-wallet-card";

const ProfileShell = () => {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#040b2b] text-white">
      {/* ────────── Background Layer ────────── */}
      <div className="relative min-h-screen w-full bg-[radial-gradient(circle_at_top,#5c2278_0%,#12215a_24%,#07133b_58%,#040b2b_100%)] px-4 pb-32 pt-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-[-40px] top-[100px] h-48 w-48 rounded-full bg-[#4d2f91]/25 blur-3xl" />
          <div className="absolute right-[-30px] top-[280px] h-52 w-52 rounded-full bg-[#1f6fff]/20 blur-3xl" />
          <div className="absolute bottom-[180px] left-[30px] h-44 w-44 rounded-full bg-[#ff8a00]/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          {/* ────────── Topbar ────────── */}
          <ProfileTopbar />

          {/* ────────── Hero Card ────────── */}
          <div className="mt-6">
            <ProfileHeroCard />
          </div>

          {/* ────────── Summary Strip ────────── */}
          <div className="mt-4">
            <ProfileSummaryStrip />
          </div>

          {/* ────────── Content Grid ────────── */}
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ProfileWalletCard />
            <ProfileAccountCard />
            <ProfileStatisticsCard />
            <ProfileHistoryCard />
          </div>

          <div className="mt-6 flex justify-end">
            <LogoutButton />
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
};

export default ProfileShell;
