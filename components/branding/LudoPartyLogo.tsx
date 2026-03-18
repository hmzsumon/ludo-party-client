"use client";

import React from "react";

type Variant = "icon" | "wordmark" | "full";

export interface CapitaliseLogoProps {
  variant?: Variant;
  size?: number;
  color?: string;
  className?: string;
  wordmarkClassName?: string;
  iconClassName?: string;
  gradient?: boolean;
  ariaLabel?: string;
}

const LudoPartyLogo: React.FC<CapitaliseLogoProps> = ({
  variant = "full",
  size = 34,
  color = "currentColor",
  className = "",
  wordmarkClassName = "",
  iconClassName = "",
  gradient = true,
  ariaLabel = "Ludo Party",
}) => {
  /* ────────── fancy ludo wordmark ────────── */
  const Wordmark = (
    <span
      className={`select-none whitespace-nowrap font-black tracking-[0.12em] ${wordmarkClassName}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.1em",
        fontSize: "1.08rem",
        lineHeight: 1,
        textTransform: "uppercase",
        textShadow:
          "0 2px 8px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.12)",
        color,
      }}
    >
      <span style={{ color: "#ff5a5f" }}>L</span>
      <span style={{ color: "#f4b400" }}>u</span>
      <span style={{ color: "#1e88e5" }}>d</span>
      <span style={{ color: "#1faa59" }}>o</span>

      <span style={{ width: 6 }} />

      <span style={{ color: "#ffffff", letterSpacing: "0.1em" }}>Party</span>
    </span>
  );

  if (variant === "wordmark") {
    return <span className={className}>{Wordmark}</span>;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      style={{ verticalAlign: "middle" }}
    >
      <span className="text-xl">🎲</span>
      {Wordmark}
    </span>
  );
};

export default LudoPartyLogo;
