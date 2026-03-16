import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps): JSX.Element {
  return (
    <main
      className="relative min-h-[100dvh] overflow-y-auto bg-[#060b1d] bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage:
          'linear-gradient(rgba(7,10,28,0.28), rgba(7,10,28,0.5)), url("/images/auth/bg.png")',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_82%,rgba(255,214,102,0.12),transparent_24%),radial-gradient(circle_at_20%_30%,rgba(70,160,255,0.10),transparent_18%),radial-gradient(circle_at_82%_20%,rgba(175,120,255,0.10),transparent_18%)]" />

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[220px] rounded-b-[50%] bg-white/5" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-6 pb-10 pt-6 mt-4">
        {children}
      </div>
    </main>
  );
}
