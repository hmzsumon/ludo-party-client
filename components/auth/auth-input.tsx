"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export default function AuthInput({
  error,
  className = "",
  type = "text",
  ...props
}: Props): JSX.Element {
  const isPasswordField = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div>
      <div className="relative">
        <input
          {...props}
          type={inputType}
          className={`py-3 w-full rounded-[14px] border border-[#7789ff38] bg-[linear-gradient(180deg,rgba(41,54,120,0.92),rgba(32,43,96,0.94))] px-6 pr-16 text-sm font-semibold text-white outline-none placeholder:font-semibold placeholder:text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_18px_rgba(0,0,0,0.35)] focus:border-sky-300/50 focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_2px_rgba(88,145,255,0.22),0_8px_18px_rgba(0,0,0,0.35)] ${className}`}
        />

        {isPasswordField ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-2 pl-1 text-sm font-semibold text-rose-300">{error}</p>
      ) : null}
    </div>
  );
}
