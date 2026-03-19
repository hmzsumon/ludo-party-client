"use client";

import Link from "next/link";

type ModeCardProps = {
  title: string;
  icon: string;
  bgClass: string;
  href: string;
};

const ModeCard = ({ title, icon, bgClass, href }: ModeCardProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center justify-center gap-3 rounded-[18px] px-4 py-4 text-center shadow-[0_12px_28px_rgba(0,0,0,0.34)] ring-1 ring-white/10 ${bgClass}`}
    >
      <span className="text-[30px]">{icon}</span>
      <span className="text-[20px] font-extrabold tracking-tight text-white">
        {title}
      </span>
    </Link>
  );
};

const ModeCards = () => {
  return (
    <section className="grid w-full grid-cols-1 gap-3">
      {/* ────────── Mode Cards ────────── */}
      <ModeCard
        title="Play Online"
        icon="🎲"
        bgClass="bg-[linear-gradient(180deg,#1d7dff_0%,#0b53c8_100%)]"
        href="/online"
      />
      <ModeCard
        title="Play Offline"
        icon="🃏"
        bgClass="bg-[linear-gradient(180deg,#ff3448_0%,#ce1023_100%)]"
        href="/offline"
      />
      <ModeCard
        title="2 Player Mode"
        icon="👥"
        bgClass="bg-[linear-gradient(180deg,#6b4dff_0%,#4b30c7_100%)]"
        href="/online"
      />
    </section>
  );
};

export default ModeCards;
