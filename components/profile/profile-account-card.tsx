"use client";

import { useSelector } from "react-redux";

const ProfileAccountCard = () => {
  const { user } = useSelector((s: any) => s.auth) as any;

  const infoRows = [
    { label: "Username", value: user?.username || "@rakib1234", icon: "👤" },
    { label: "Email", value: user?.email || "rakib@gmail.com", icon: "📧" },
    { label: "Mobile", value: user?.phone || "+880 1234-567890", icon: "📱" },
  ];

  return (
    <section
      className="relative rounded-[20px] overflow-hidden p-4"
      style={{
        background:
          "linear-gradient(145deg, rgba(74,26,138,0.6) 0%, rgba(29,5,70,0.7) 100%)",
        border: "1px solid rgba(255,215,0,0.15)",
        boxShadow:
          "0 8px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Shine line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪪</span>
          <h3 className="text-[17px] font-black text-white">Account Info</h3>
        </div>
        <button className="ls-btn ls-btn-purple px-3 py-1.5 text-[11px] font-black">
          Manage
        </button>
      </div>

      {/* Info Rows */}
      <div className="space-y-2">
        {infoRows.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span className="text-base shrink-0">{row.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400/50 leading-none">
                {row.label}
              </p>
              <p className="text-[13px] font-bold text-white truncate mt-0.5">
                {row.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileAccountCard;
