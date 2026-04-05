/* ── Component: WithdrawForm ────────────────────────────────────────────── */
"use client";
import { useMemo, useState } from "react";

const PROVIDER_LABELS: Record<string, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
};

export default function WithdrawForm({
  min = 500,
  max = 25000,
  available,
  disabled,
  provider,
  onSubmit,
}: {
  min?: number;
  max?: number;
  available: number;
  disabled?: boolean;
  provider?: string;
  onSubmit: (amount: number, txPass: string, accountNumber: string) => void;
}) {
  const [amount, setAmount] = useState<string>("");
  const [pass, setPass] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [show, setShow] = useState(false);

  const providerLabel = provider
    ? (PROVIDER_LABELS[provider.toLowerCase()] ?? provider)
    : "E-Wallet";

  const n = Number(amount || 0);
  const amountErr = !amount
    ? "Please enter an amount"
    : n < min
      ? `Minimum withdrawal amount is 💎${min.toLocaleString()}`
      : n > max
        ? `Maximum withdrawal amount is 💎${max.toLocaleString()}`
        : n > available
          ? "Insufficient balance"
          : "";

  const accountErr = !accountNumber
    ? "Please enter account number"
    : !/^01[3-9]\d{8}$/.test(accountNumber)
      ? "Enter a valid 11-digit mobile number"
      : "";

  const isValid = useMemo(
    () => !amountErr && !accountErr && pass.length >= 6,
    [amountErr, accountErr, pass],
  );

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20";

  const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40";

  return (
    <div className="p-4 space-y-4">
      {/* ── Notice ── */}
      <div
        className="flex items-start gap-2.5 rounded-xl px-3.5 py-3"
        style={{
          background: "rgba(234,179,8,0.08)",
          border: "1px solid rgba(234,179,8,0.2)",
        }}
      >
        <span className="mt-0.5 text-base">⚠️</span>
        <p className="text-xs leading-relaxed text-yellow-300/80">
          Funds are transferred to{" "}
          <span className="font-semibold text-yellow-300">
            personal accounts only
          </span>
          . Agent or merchant accounts are not supported. Please double-check
          your number before submitting.
        </p>
      </div>

      {/* ── Account Number ── */}
      <div>
        <label className={labelClass}>
          {providerLabel} Personal Account Number
        </label>
        <input
          value={accountNumber}
          onChange={(e) =>
            setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 11))
          }
          inputMode="numeric"
          placeholder={`Enter your ${providerLabel} number`}
          className={inputClass}
        />
        {accountNumber && accountErr && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
            <span>⚠</span> {accountErr}
          </p>
        )}
      </div>

      {/* ── Amount ── */}
      <div>
        <label className={labelClass}>Withdrawal Amount</label>
        <div className="relative">
          <span className="absolute  left-2 top-1/2 -translate-y-1/2 text-base font-bold ">
            💎
          </span>
          <input
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value.replace(/[^\d]/g, "").slice(0, 7))
            }
            inputMode="numeric"
            placeholder={`${min.toLocaleString()} – ${max.toLocaleString()}`}
            className={`${inputClass} pl-8`}
          />
        </div>
        {amount && amountErr && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
            <span>⚠</span> {amountErr}
          </p>
        )}
        {!amountErr && amount && (
          <p className="mt-1.5 text-xs text-emerald-400/70">
            ✓ Amount looks good
          </p>
        )}
      </div>

      {/* ── Transaction Password ── */}
      <div>
        <label className={labelClass}>Your Password</label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Enter your password"
            className={`${inputClass} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-white/40 hover:text-white/70 transition"
            aria-label="Toggle password"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              {show ? (
                <path d="M12 4.5C4.73 4.5 1 12 1 12s3.73 7.5 11 7.5S23 12 23 12 19.27 4.5 12 4.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
              ) : (
                <path d="M12 6c3.86 0 7.16 2.23 8.82 5.5-.46.92-1.08 1.76-1.82 2.5l1.41 1.41C22.09 13.88 23 12 23 12S19.27 4.5 12 4.5c-1.08 0-2.1.14-3.06.41l1.64 1.64C11.08 6.18 11.53 6 12 6zM2.1 2.1L.69 3.51 4.2 7.02C2.69 8.12 1.5 9.46 1 10.5c0 0 3.73 7.5 11 7.5 1.56 0 3.03-.28 4.37-.79l2.62 2.62 1.41-1.41L2.1 2.1z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="button"
        disabled={!isValid || disabled}
        onClick={() => onSubmit(Number(amount), pass, accountNumber)}
        className="w-full rounded-xl py-3 text-sm font-bold tracking-widest uppercase transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
        style={
          isValid && !disabled
            ? {
                background:
                  "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
                boxShadow: "0 0 20px rgba(168,85,247,0.4)",
                color: "#fff",
              }
            : {
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.3)",
              }
        }
      >
        Submit Withdrawal
      </button>
    </div>
  );
}
