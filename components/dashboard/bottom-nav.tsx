"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", icon: "🏠", href: "/dashboard" },
  { label: "Invite", icon: "🎁", href: "/invite" },
  { label: "Wallet", icon: "👛", href: "/wallet" },
  { label: "Profile", icon: "👤", href: "/profile" },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2">
      {/* ── Nav Container ── */}
      <div
        className="relative grid grid-cols-4 w-full overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1a0533 0%, #0d0221 100%)",
          borderTop: "1px solid rgba(255,215,0,0.2)",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.6)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />

        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 px-2 py-3"
            >
              {/* Active background glow */}
              {isActive && (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at center top, rgba(255,215,0,0.12) 0%, transparent 70%)",
                  }}
                />
              )}

              {/* Active top bar */}
              {isActive && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full"
                  style={{
                    background: "linear-gradient(90deg, #ffd700, #ffec6e)",
                  }}
                />
              )}

              {/* Icon box */}
              <div
                className="relative flex h-8 w-8 items-center justify-center rounded-xl"
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0.08) 100%)",
                        border: "1px solid rgba(255,215,0,0.3)",
                      }
                    : {}
                }
              >
                <span className={`text-xl ${isActive ? "" : "opacity-50"}`}>
                  {item.icon}
                </span>
              </div>

              <span
                className="text-[10px] font-black tracking-tight"
                style={{
                  color: isActive ? "#ffd700" : "rgba(255,255,255,0.45)",
                  textShadow: isActive ? "0 0 8px rgba(255,215,0,0.5)" : "none",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
