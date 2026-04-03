const historyRows = [
  { name: "Rakib", result: "WON", amount: "💎500" },
  { name: "Nayeem", result: "WON", amount: "💎250" },
  { name: "Sohan", result: "LOSE", amount: "💎100" },
];

const ProfileHistoryCard = () => {
  return (
    <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(31,28,102,0.78)_0%,rgba(10,18,62,0.82)_100%)] p-4 shadow-[0_10px_26px_rgba(0,0,0,0.28)] backdrop-blur sm:p-5">
      {/* ────────── Card Header ────────── */}
      <div className="flex items-center gap-3">
        <span className="text-[28px]">📝</span>
        <h3 className="text-[22px] font-black tracking-tight text-white">
          Game History
        </h3>
      </div>

      {/* ────────── History List ────────── */}
      <div className="mt-5 space-y-3">
        {historyRows.map((row, idx) => (
          <div
            key={`${row.name}-${idx}`}
            className="flex items-center justify-between rounded-[18px] bg-[rgba(255,255,255,0.04)] px-4 py-4 ring-1 ring-white/10"
          >
            <div>
              <p className="text-lg font-extrabold text-white">{row.name}</p>
              <p className="mt-1 text-sm font-medium text-white/60">
                Recent Match Result
              </p>
            </div>

            <div className="text-right">
              <p
                className={`text-xl font-black ${
                  row.result === "WON" ? "text-[#ffcf45]" : "text-[#ff6a8f]"
                }`}
              >
                {row.result}
              </p>
              <p className="mt-1 text-lg font-extrabold text-white">
                {row.amount}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ────────── Action Button ────────── */}
      <button className="mt-5 w-full rounded-full bg-[linear-gradient(180deg,#7b55ff_0%,#4d2de0_100%)] px-6 py-3 text-sm font-black text-white shadow-[0_10px_20px_rgba(0,0,0,0.24)]">
        View Full History
      </button>
    </section>
  );
};

export default ProfileHistoryCard;
