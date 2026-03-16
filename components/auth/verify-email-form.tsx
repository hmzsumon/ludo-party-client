"use client";

import { CircleAlert, Mail } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import Logo from "@/components/branding/logo";

type Props = {
  email?: string;
};

export default function VerifyEmailForm({
  email = "hmzwork2222@gmail.com",
}: Props): JSX.Element {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const maskedEmail = maskEmail(email);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const next = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, index) => {
      next[index] = char;
    });

    setOtp(next);

    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const code = otp.join("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({
      email,
      code,
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className=" scale-90 sm:scale-100">
        <Logo />
      </div>

      <h1 className="mt-2 text-center text-2xl font-extrabold leading-none tracking-tight text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]">
        Verify your email
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-4 w-full rounded-2xl border border-white/10 bg-[rgba(7,10,24,0.78)] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-[2px]"
      >
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[rgba(10,14,30,0.88)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <Mail className="h-5 w-5 text-white/65" />
          <span className="truncate text-sm font-medium text-white">
            {email}
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-emerald-300">
          <div className="flex items-start gap-2">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-[0.70rem] leading-7">
              We&apos;ve sent a verification code to{" "}
              <span className="font-semibold text-emerald-200">
                {maskedEmail}
              </span>
              . Please check your inbox (and spam folder) and enter the code
              below.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-[1.05rem] font-bold text-white">
            Verification code
          </h2>

          <div className="mt-5 flex items-center justify-between gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="h-10 w-10 rounded-[.70rem] border border-white/15 bg-[rgba(10,14,30,0.88)] text-center text-sm font-bold text-white outline-none transition focus:border-[#6b8cff] focus:shadow-[0_0_0_2px_rgba(107,140,255,0.20)] "
              />
            ))}
          </div>

          <button
            type="button"
            className="mx-auto mt-5 block text-center text-[1rem] font-bold text-[#f4b400] underline underline-offset-4 transition hover:text-[#ffd45a]"
            onClick={() => {
              console.log("Resend verification code");
            }}
          >
            Get a new code
          </button>
        </div>

        <button
          type="submit"
          disabled={code.length !== 6}
          className="mt-6 w-full rounded-xl border border-lime-300/30 bg-[linear-gradient(180deg,#8cf61e_0%,#46c81d_56%,#0a991f_100%)] py-3 text-xl font-extrabold tracking-tight text-white shadow-[inset_0_8px_14px_rgba(255,255,255,0.12),inset_0_-6px_10px_rgba(0,0,0,0.16),0_8px_22px_rgba(0,0,0,0.34)] transition hover:-translate-y-[1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Verify Email
        </button>

        <Link
          href="/login"
          className="mt-3 flex w-full items-center justify-center rounded-xl border border-[#5f72d5]/40 bg-[rgba(8,14,40,0.24)] py-3 text-sm font-extrabold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_18px_rgba(0,0,0,0.2)] transition hover:bg-[rgba(12,20,56,0.32)]"
        >
          Back to Sign In
        </Link>
      </form>
    </div>
  );
}

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;

  const visible = Math.min(4, name.length);
  const hidden = "*".repeat(Math.max(name.length - visible, 0));

  return `${name.slice(0, visible)}${hidden}@${domain}`;
}
