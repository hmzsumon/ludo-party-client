import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps): JSX.Element {
  return (
    <main
      className="relative min-h-[100dvh] overflow-y-auto text-white ls-stars-bg"
      style={{
        background:
          "radial-gradient(ellipse at top, #3d0a7a 0%, #1a0533 45%, #0d0221 100%)",
      }}
    >
      {/* ── Decorative glow blobs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[10%] right-[-80px] w-[250px] h-[250px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #ffd700 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-[50%] left-[-60px] w-[200px] h-[200px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)",
          }}
        />

        {/* Floating star decorations */}
        {[
          "top-[10%] left-[10%] text-base",
          "top-[20%] right-[8%] text-sm",
          "top-[60%] left-[6%] text-xs",
          "top-[75%] right-[12%] text-sm",
          "top-[40%] right-[5%] text-xs",
          "top-[85%] left-[15%] text-base",
        ].map((cls, i) => (
          <div key={i} className={`absolute ${cls} text-yellow-400 opacity-40`}>
            ★
          </div>
        ))}
      </div>

      {/* ── Decorative top arch ── */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[180px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(124,58,237,0.2) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,215,0,0.08)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-6 pb-10 pt-6 mt-4">
        {children}
      </div>
    </main>
  );
}
