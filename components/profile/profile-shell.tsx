"use client";

import LogoutButton from "../auth/LogoutButton";
import BottomNav from "../dashboard/bottom-nav";
import ProfileAccountCard from "./profile-account-card";
import ProfileHeroCard from "./profile-hero-card";
import ProfileHistoryCard from "./profile-history-card";
import ProfileStatisticsCard from "./profile-statistics-card";
import ProfileSummaryStrip from "./profile-summary-strip";
import ProfileWalletCard from "./profile-wallet-card";

const ProfileShell = () => {
  return (
    <main className="min-h-screen w-full overflow-hidden text-white ls-stars-bg">
      <div className="relative min-h-screen w-full px-4 pb-32">
        {/* ── Glow Blobs ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, #ff5fe1 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-[35%] right-[-60px] w-[200px] h-[200px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, #ff9bf0 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[20%] left-[-40px] w-[180px] h-[180px] rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, #c86bff 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          <div className="mt-5">
            <ProfileHeroCard />
          </div>
          <div className="mt-4">
            <ProfileSummaryStrip />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 ">
            <ProfileWalletCard />
            <ProfileAccountCard />
            <ProfileStatisticsCard />
            <ProfileHistoryCard />
          </div>
          <div className="mt-6 flex justify-center">
            <LogoutButton />
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
};

export default ProfileShell;
