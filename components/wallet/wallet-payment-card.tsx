const WalletPaymentCard = () => {
  return (
    <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(31,28,102,0.78)_0%,rgba(10,18,62,0.82)_100%)] p-4 shadow-[0_10px_26px_rgba(0,0,0,0.28)] backdrop-blur sm:p-5">
      {/* ────────── Card Header ────────── */}
      <div className="flex items-center gap-3">
        <span className="text-[28px]">💳</span>
        <h3 className="text-[22px] font-black tracking-tight text-white">
          Payment Methods
        </h3>
      </div>

      {/* ────────── Payment Method Row ────────── */}
      <div className="mt-5 rounded-[18px] bg-[rgba(255,255,255,0.04)] p-4 ring-1 ring-white/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[linear-gradient(180deg,#9157ff_0%,#5b2fe2_100%)] text-2xl shadow-[0_8px_18px_rgba(0,0,0,0.24)]">
              💳
            </div>

            <div>
              <p className="text-xl font-extrabold text-white">
                2 Cards Linked
              </p>
              <p className="mt-1 text-sm font-medium text-white/60">
                Visa, MasterCard
              </p>
            </div>
          </div>

          <button className="rounded-full bg-[linear-gradient(180deg,#7b55ff_0%,#4d2de0_100%)] px-6 py-3 text-sm font-black text-white shadow-[0_10px_20px_rgba(0,0,0,0.24)]">
            Manage
          </button>
        </div>
      </div>
    </section>
  );
};

export default WalletPaymentCard;
