import Logo from "@/components/branding/logo";
import { WifiOff } from "lucide-react";
import Link from "next/link";

function ActionButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`block w-full rounded-[20px] border px-6 py-4 text-center text-xl font-extrabold tracking-wide text-white shadow-[0_8px_22px_rgba(0,0,0,0.35)] transition hover:scale-[1.01] ${className}`}
    >
      {children}
    </Link>
  );
}

export default function PublicHomePage(): JSX.Element {
  return (
    <main className="ludo-home relative min-h-screen overflow-hidden text-white mt-4">
      {/* <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.12)_0%,rgba(2,6,23,0.4)_40%,rgba(2,6,23,0.72)_100%)]" />
      <div className="absolute left-0 right-0 top-0 h-[260px] rounded-b-[50%] bg-[rgba(125,105,255,0.12)] blur-[1px]" /> */}

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-10 pt-10">
        <Logo />
        <div className="mt-14">
          <h1 className="text-xl font-black uppercase italic leading-[0.95] tracking-[-0.03em]">
            <span className="text-white">PLAY</span>{" "}
            <span className="bg-[linear-gradient(180deg,#ffe768_0%,#ffb600_100%)] bg-clip-text text-transparent">
              LUDO WIN BIG
            </span>{" "}
            <span className="text-white">REWARDS!</span>
          </h1>
        </div>

        <div className="mt-10 space-y-5">
          <Link
            href="/guest"
            className="flex items-center gap-4 rounded-[20px] border border-red-300/20 bg-[linear-gradient(180deg,#ea244e_0%,#9b0028_100%)] px-4 py-2 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1),0_10px_25px_rgba(0,0,0,0.35)]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-300/10 text-yellow-300">
              <WifiOff size={30} />
            </div>

            <div>
              <div className="text-xl font-extrabold leading-none">
                Play Offline
              </div>
              <div className="mt-2 text-[18px] text-white/80">Guest Mode</div>
            </div>
          </Link>

          <ActionButton
            href="/register-login?tab=signin"
            className="border-green-300/25 bg-[linear-gradient(180deg,#7dff12_0%,#23ad0f_55%,#048b12_100%)] text-white"
          >
            Sign In
          </ActionButton>

          <ActionButton
            href="/register"
            className="border-blue-300/25 bg-[linear-gradient(180deg,#5877ff_0%,#2f53db_55%,#1d2d8e_100%)] text-white"
          >
            Create New Account
          </ActionButton>
        </div>
      </section>
    </main>
  );
}
