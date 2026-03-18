const stats = [
  { label: "Matches", value: "215", color: "text-white" },
  { label: "Wins", value: "134", color: "text-[#68f36e]" },
  { label: "Losses", value: "58", color: "text-[#ff74a6]" },
  { label: "Win Streak", value: "12", color: "text-[#55c7ff]" },
];

const ProfileStatisticsCard = () => {
  return (
    <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(31,28,102,0.78)_0%,rgba(10,18,62,0.82)_100%)] p-4 shadow-[0_10px_26px_rgba(0,0,0,0.28)] backdrop-blur sm:p-5">
      {/* ────────── Card Header ────────── */}
      <div className="flex items-center gap-3">
        <span className="text-[28px]">📊</span>
        <h3 className="text-[22px] font-black tracking-tight text-white">
          Statistics
        </h3>
      </div>

      {/* ────────── Stats List ────────── */}
      <div className="mt-5 space-y-3 rounded-[18px] bg-[rgba(255,255,255,0.04)] p-4 ring-1 ring-white/10">
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-[14px] bg-[rgba(255,255,255,0.03)] px-4 py-3"
          >
            <span className="text-base font-bold text-white/85">
              {item.label}
            </span>
            <span className={`text-2xl font-black ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileStatisticsCard;
