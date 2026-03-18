const summaryItems = [
  { label: "Matches", value: "215", icon: "🏆" },
  { label: "Win Rate", value: "62%", icon: "🔥" },
  { label: "Total Earnings", value: "৳118,500", icon: "🪙" },
];

const ProfileSummaryStrip = () => {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {/* ────────── Summary Cards ────────── */}
      {summaryItems.map((item) => (
        <div
          key={item.label}
          className="rounded-[22px] border border-white/10 bg-[rgba(13,22,72,0.70)] px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur"
        >
          <div className="flex items-center gap-3">
            <span className="text-[28px]">{item.icon}</span>
            <div>
              <h4 className="text-[28px] font-black tracking-tight text-[#ffcf45]">
                {item.value}
              </h4>
              <p className="text-sm font-bold text-white/70">{item.label}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProfileSummaryStrip;
