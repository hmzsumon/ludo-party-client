import BottomNav from "../dashboard/bottom-nav";
import WalletBalanceCard from "./wallet-balance-card";
import WalletPaymentCard from "./wallet-payment-card";
import WalletReferralCard from "./wallet-referral-card";
import WalletTopbar from "./wallet-topbar";
import WalletTransactionCard from "./wallet-transaction-card";

const WalletShell = () => {
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
            className="absolute top-[40%] right-[-60px] w-[200px] h-[200px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, #ffd700 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          <WalletTopbar />
          <div className="mt-5">
            <WalletBalanceCard />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <WalletTransactionCard />
            <WalletPaymentCard />
            <WalletReferralCard />
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
};

export default WalletShell;
