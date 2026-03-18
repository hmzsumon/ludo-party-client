const WalletReferralCard = () => {
  return (
    <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(31,28,102,0.78)_0%,rgba(10,18,62,0.82)_100%)] p-4 shadow-[0_10px_26px_rgba(0,0,0,0.28)] backdrop-blur sm:p-5">
      {/* ────────── Card Header ────────── */}
      <div className="flex items-center gap-3">
        <span className="text-[28px]">👥</span>
        <h3 className="text-[22px] font-black tracking-tight text-white">
          Referral Bonus
        </h3>
      </div>

      {/* ────────── Referral Body ────────── */}
      <div className="mt-5 rounded-[18px] bg-[rgba(255,255,255,0.04)] p-4 ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[42px] font-black tracking-tight text-[#ffcf45]">
              ৳500
            </p>
            <p className="mt-1 text-lg font-medium text-white/75">Earned</p>
          </div>

          <div className="text-[58px] leading-none">🪙</div>
        </div>

        <button className="mt-4 w-full rounded-full bg-[linear-gradient(180deg,#7b55ff_0%,#4d2de0_100%)] px-6 py-3 text-base font-black text-white shadow-[0_10px_20px_rgba(0,0,0,0.24)]">
          Invite
        </button>
      </div>
    </section>
  );
};

export default WalletReferralCard;
