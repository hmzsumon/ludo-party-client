import BottomNav from "../dashboard/bottom-nav";
import WalletBalanceCard from "./wallet-balance-card";
import WalletPaymentCard from "./wallet-payment-card";
import WalletReferralCard from "./wallet-referral-card";
import WalletTopbar from "./wallet-topbar";
import WalletTransactionCard from "./wallet-transaction-card";

const WalletShell = () => {
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
          <WalletTopbar />

          {/* ────────── Balance Card ────────── */}
          <div className="mt-6">
            <WalletBalanceCard />
          </div>

          {/* ────────── Content Grid ────────── */}
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <WalletTransactionCard />
            {/* <WalletPromoCard /> */}
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
