"use client";

import { useSelector } from "react-redux";

const WalletBalanceCard = () => {
  const { user } = useSelector((s: any) => s.auth) as any;

  return (
    <section className="w-full rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(49,28,118,0.80)_0%,rgba(20,17,74,0.78)_100%)] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.32)] backdrop-blur sm:p-5 lg:p-6">
      {/* ────────── Balance Hero Wrapper ────────── */}
      <div className="flex flex-col items-center text-center">
        {/* ────────── Balance Amount ────────── */}
        <h2 className="mt-5 text-2xl font-black tracking-tight text-[#ffcf45] drop-shadow-[0_3px_0_rgba(0,0,0,0.35)] sm:text-[58px]">
          ৳ {user?.m_balance?.toLocaleString?.() ?? 0}
        </h2>

        {/* ────────── Action Buttons ────────── */}
        <div className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <button className="rounded-full bg-[linear-gradient(180deg,#32ee58_0%,#0da93c_100%)] px-6 py-4 text-[18px] font-black text-white shadow-[0_10px_22px_rgba(0,0,0,0.28)] ring-1 ring-white/10 sm:text-[20px]">
            Deposit
          </button>
          <button className="rounded-full bg-[linear-gradient(180deg,#ff724b_0%,#ca2446_100%)] px-6 py-4 text-[18px] font-black text-white shadow-[0_10px_22px_rgba(0,0,0,0.28)] ring-1 ring-white/10 sm:text-[20px]">
            Withdraw
          </button>
        </div>
      </div>
    </section>
  );
};

export default WalletBalanceCard;
