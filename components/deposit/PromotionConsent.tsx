"use client";

import { useMemo, useState } from "react";

/* ────────── types ────────── */
export type PromoChoice = "opt_in" | "opt_out";

type Props = {
  value: PromoChoice | null;
  onChange: (v: PromoChoice) => void;

  /* ────────── promo info from backend ────────── */
  firstBonusPercent?: number; // 50
  secondBonusPercent?: number; // 25
  eligibleDepositIndex?: 1 | 2 | 0; // 1 => first deposit eligible, 2 => second eligible, 0 => no bonus
  turnoverMultiplier?: number; // 7

  /* ────────── optional: show user amount preview ────────── */
  amount?: number;
};

const pct = (n?: number) => (n ? `${n}%` : "0%");
const money = (n?: number) =>
  Number(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 });

export default function PromotionConsent({
  value,
  onChange,
  firstBonusPercent = 50,
  secondBonusPercent = 25,
  eligibleDepositIndex = 0,
  turnoverMultiplier = 7,
  amount,
}: Props) {
  const [openInfo, setOpenInfo] = useState(false);

  const eligiblePercent = useMemo(() => {
    if (eligibleDepositIndex === 1) return firstBonusPercent;
    if (eligibleDepositIndex === 2) return secondBonusPercent;
    return 0;
  }, [eligibleDepositIndex, firstBonusPercent, secondBonusPercent]);

  const bonusAmount = useMemo(() => {
    if (!amount || !eligiblePercent) return 0;
    return (amount * eligiblePercent) / 100;
  }, [amount, eligiblePercent]);

  const turnoverRequired = useMemo(() => {
    if (!amount) return 0;

    /* ────────── if opt-in, turnover = (deposit+bonus) * 7 ────────── */
    if (value === "opt_in") return (amount + bonusAmount) * turnoverMultiplier;

    /* ────────── if opt-out, turnover rule not applied (keep 0 or amount) ────────── */
    return 0;
  }, [value, amount, bonusAmount, turnoverMultiplier]);

  const showEligibility = eligibleDepositIndex !== 0;

  return (
    <div className="mt-6">
      {/* ────────── title ────────── */}
      <div className="mb-2 flex items-center gap-2 text-[15px] font-semibold text-neutral-800">
        <span className="h-2 w-2 rounded-full bg-pink-500" />
        Promotions
      </div>

      {/* ────────── option: opt in ────────── */}
      <label
        className={[
          "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition",
          value === "opt_in"
            ? "border-red-300 bg-red-50"
            : "border-neutral-200 bg-white hover:border-neutral-300",
        ].join(" ")}
      >
        <input
          type="radio"
          name="promo"
          checked={value === "opt_in"}
          onChange={() => onChange("opt_in")}
          className="mt-1"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-neutral-900">
              Participate in promotions
            </div>

            {showEligibility ? (
              <div className="text-sm font-extrabold text-red-600">
                +{pct(eligiblePercent)}
              </div>
            ) : (
              <div className="text-xs font-semibold text-neutral-500">
                No bonus available
              </div>
            )}
          </div>

          {/* ────────── inline hint ────────── */}
          <div className="mt-1 text-[12px] leading-5 text-neutral-600">
            {showEligibility ? (
              <>
                First deposit: +{firstBonusPercent}% &nbsp;|&nbsp; Second
                deposit: +{secondBonusPercent}% &nbsp;|&nbsp; Turnover:{" "}
                {turnoverMultiplier}x
              </>
            ) : (
              <>No promotional bonus available for your account right now.</>
            )}
          </div>

          {/* ────────── info toggle ────────── */}
          <button
            type="button"
            onClick={() => setOpenInfo((s) => !s)}
            className="mt-2 text-xs font-semibold text-blue-600 underline"
          >
            {openInfo ? "Hide details" : "How it works"}
          </button>

          {/* ────────── info box ────────── */}
          {openInfo && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] leading-5 text-red-700">
              <div className="font-extrabold">Promotion Rules</div>

              <ul className="mt-1 list-disc space-y-1 pl-4">
                <li>
                  First deposit bonus: <b>{firstBonusPercent}%</b>
                </li>
                <li>
                  Second deposit bonus: <b>{secondBonusPercent}%</b>
                </li>
                <li>
                  If you take a bonus, your turnover requirement becomes{" "}
                  <b>{turnoverMultiplier}x</b> of <b>(deposit + bonus)</b>.
                </li>
              </ul>

              {/* ────────── preview with selected amount ────────── */}
              {amount ? (
                <div className="mt-3 rounded-lg border border-red-200 bg-white p-2 text-red-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Deposit</span>
                    <span className="font-extrabold">৳ {money(amount)}</span>
                  </div>

                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-semibold">Bonus</span>
                    <span className="font-extrabold">
                      ৳ {money(bonusAmount)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-semibold">Turnover Required</span>
                    <span className="font-extrabold">
                      ৳ {money(turnoverRequired)}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </label>

      {/* ────────── option: opt out ────────── */}
      <label
        className={[
          "mt-3 flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition",
          value === "opt_out"
            ? "border-red-300 bg-red-50"
            : "border-neutral-200 bg-white hover:border-neutral-300",
        ].join(" ")}
      >
        <input
          type="radio"
          name="promo"
          checked={value === "opt_out"}
          onChange={() => onChange("opt_out")}
          className="mt-1"
        />

        <div className="flex-1">
          <div className="text-sm font-semibold text-neutral-900">
            Do not participate in any promotions
          </div>
          <div className="mt-1 text-[12px] leading-5 text-neutral-600">
            No bonus will be added, and promotion turnover rules will not apply.
          </div>
        </div>
      </label>
    </div>
  );
}
