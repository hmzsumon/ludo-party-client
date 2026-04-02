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
    <main
      className="min-h-screen w-full overflow-hidden text-white ls-stars-bg"
      style={{
        background:
          "radial-gradient(ellipse at top, #3d0a7a 0%, #1a0533 45%, #0d0221 100%)",
      }}
    >
      <div className="relative min-h-screen w-full px-4 pb-32 pt-4">
        {/* ── Glow Blobs ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-[35%] right-[-60px] w-[200px] h-[200px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, #ffd700 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[20%] left-[-40px] w-[180px] h-[180px] rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, #00d4ff 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          <ProfileTopbar />
          <div className="mt-5">
            <ProfileHeroCard />
          </div>
          <div className="mt-4">
            <ProfileSummaryStrip />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
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
