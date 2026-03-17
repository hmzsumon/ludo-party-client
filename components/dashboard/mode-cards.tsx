type ModeCardProps = {
  title: string;
  icon: string;
  bgClass: string;
};

const ModeCard = ({ title, icon, bgClass }: ModeCardProps) => {
  return (
    <button
      className={`flex  items-center justify-center rounded-[14px] px-4 py-2 text-center shadow-[0_12px_28px_rgba(0,0,0,0.34)] ring-1 ring-white/10 ${bgClass}`}
    >
      <span className="text-[30px]">{icon}</span>
      <span className="mt-2 text-[20px] font-extrabold tracking-tight text-white">
        {title}
      </span>
    </button>
  );
};

const ModeCards = () => {
  return (
    <section className="grid grid-cols-1 gap-3">
      {/* ────────── Mode Cards ────────── */}
      <ModeCard
        title="Play Online"
        icon="🎲"
        bgClass="bg-[linear-gradient(180deg,#1d7dff_0%,#0b53c8_100%)]"
      />
      <ModeCard
        title="Play Offline"
        icon="🃏"
        bgClass="bg-[linear-gradient(180deg,#ff3448_0%,#ce1023_100%)]"
      />
      <ModeCard
        title="2 Player Mode"
        icon="👥"
        bgClass="bg-[linear-gradient(180deg,#6b4dff_0%,#4b30c7_100%)]"
      />
    </section>
  );
};

export default ModeCards;
