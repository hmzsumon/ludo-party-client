"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", icon: "🏠", href: "/dashboard" },
  { label: "Games", icon: "🎮", href: "/games" },
  { label: "Wallet", icon: "👛", href: "/wallet" },
  { label: "Profile", icon: "👤", href: "/profile" },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 px-4 pb-2 lg:hidden">
      {/* ────────── Bottom Navigation ────────── */}
      <div className="grid grid-cols-4 overflow-hidden rounded-xl bg-[rgba(9,18,56,0.96)] shadow-[0_-8px_24px_rgba(0,0,0,0.25),0_12px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 px-2 py-2"
            >
              <span className="text-xl">{item.icon}</span>
              <span
                className={`text-xs font-extrabold tracking-tight ${
                  isActive ? "text-[#55c7ff]" : "text-white"
                }`}
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
