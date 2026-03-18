const transactions = [
  {
    type: "Withdraw",
    amount: "৳500",
    time: "2:45 PM Today",
    icon: "⬇️",
  },
  {
    type: "Deposit",
    amount: "৳1,200",
    time: "10:15 AM Today",
    icon: "⬆️",
  },
];

const WalletTransactionCard = () => {
  return (
    <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(31,28,102,0.78)_0%,rgba(10,18,62,0.82)_100%)] p-4 shadow-[0_10px_26px_rgba(0,0,0,0.28)] backdrop-blur sm:p-5">
      {/* ────────── Card Header ────────── */}
      <div className="flex items-center gap-3">
        <span className="text-[28px]">↗️</span>
        <h3 className="text-[22px] font-black tracking-tight text-white">
          Transaction History
        </h3>
      </div>

      {/* ────────── Transaction List ────────── */}
      <div className="mt-5 space-y-3">
        {transactions.map((item, idx) => (
          <div
            key={`${item.type}-${idx}`}
            className="rounded-[18px] bg-[rgba(255,255,255,0.04)] p-4 ring-1 ring-white/10"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-1 text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xl font-extrabold text-white">
                    {item.type}
                  </p>
                  <p className="mt-1 text-sm font-medium text-white/60">
                    {item.time}
                  </p>
                </div>
              </div>

              <p className="text-[30px] font-black tracking-tight text-[#ffcf45]">
                {item.amount}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ────────── Action Button ────────── */}
      <button className="mt-5 w-full rounded-full bg-[linear-gradient(180deg,#7b55ff_0%,#4d2de0_100%)] px-6 py-3 text-sm font-black text-white shadow-[0_10px_20px_rgba(0,0,0,0.24)]">
        View All
      </button>
    </section>
  );
};

export default WalletTransactionCard;
