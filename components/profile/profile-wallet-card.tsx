"use client";

import { useSelector } from "react-redux";

const ProfileWalletCard = () => {
  const { user } = useSelector((s: any) => s.auth) as any;

  return (
    <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(31,28,102,0.78)_0%,rgba(10,18,62,0.82)_100%)] p-4 shadow-[0_10px_26px_rgba(0,0,0,0.28)] backdrop-blur sm:p-5">
      {/* ────────── Card Header ────────── */}
      <div className="flex items-center gap-3">
        <span className="text-[28px]">💼</span>
        <h3 className="text-[22px] font-black tracking-tight text-white">
          Wallet
        </h3>
      </div>

      {/* ────────── Card Body ────────── */}
      <div className="mt-5 rounded-[18px] bg-[rgba(255,255,255,0.04)] p-4 ring-1 ring-white/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-white/65">Current Balance</p>
            <h4 className="mt-1 text-[34px] font-black tracking-tight text-[#ffcf45]">
              ৳ {user?.m_balance?.toLocaleString?.() ?? 0}
            </h4>
          </div>

          <button className="rounded-full bg-[linear-gradient(180deg,#2ae85f_0%,#0da93c_100%)] px-6 py-3 text-base font-black text-white shadow-[0_10px_20px_rgba(0,0,0,0.24)]">
            + Add Money
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfileWalletCard;
