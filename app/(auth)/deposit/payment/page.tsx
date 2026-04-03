"use client";

import CopyToClipboard from "@/lib/CopyToClipboard";
import NagadLogo from "@/public/images/deposit/nagad-logo.png";
import {
  useCreateDepositWithBDTMutation,
  useGetMyAgentPaymentMethodByIdQuery,
} from "@/redux/features/deposit/depositApi";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaAngleLeft } from "react-icons/fa";
import { SlRefresh } from "react-icons/sl";

import PaymentBrandIcon from "./components/BkashIcon";

const MIN_AMOUNT = 100;
const MAX_AMOUNT = 25000;

const clamp = (n: number) => Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, n));

const getWalletTitle = (methodName?: string, methodType?: string) => {
  const isAgent = methodType === "agent";
  const isPersonal = methodType === "personal";

  if (methodName === "Bkash") {
    if (isAgent) return "বিকাশ এজেন্ট ওয়ালেট ( Cash Out )";
    if (isPersonal) return "বিকাশ পার্সোনাল ওয়ালেট ( Send Money )";
    return "বিকাশ ওয়ালেট";
  }

  if (methodName === "Nagad") {
    if (isAgent) return "নগদ এজেন্ট ওয়ালেট ( Cash Out )";
    if (isPersonal) return "নগদ পার্সোনাল ওয়ালেট ( Send Money )";
    return "নগদ ওয়ালেট";
  }

  return "Wallet";
};

export default function PaymentPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const channelId = sp.get("channelId") || "";
  const amountFromQuery = sp.get("amount") || "";

  /* ────────── promo flag (optional) ──────────
     promo=1 => user opted-in
     promo=0 or missing => opted-out
  */
  const promoFromQuery = sp.get("promo"); // "1" | "0" | null
  const promotionOptIn = promoFromQuery === "1"; // ✅ optional default false

  // ✅ start amount from previous page
  const [amountInput, setAmountInput] = useState<string>(amountFromQuery);
  const [txnId, setTxnId] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");

  // ✅ id দিয়ে payment method fetch
  const {
    data: methodRes,
    isLoading: isMethodLoading,
    isError: isMethodError,
    error: methodError,
    refetch,
  } = useGetMyAgentPaymentMethodByIdQuery(channelId, {
    skip: !channelId,
  });

  const paymentMethod = methodRes?.data;

  const [
    createDepositWithBDT,
    {
      isLoading: isCreating,
      isError: isCreateError,
      isSuccess: isCreateSuccess,
      error: createError,
    },
  ] = useCreateDepositWithBDTMutation();

  /* ────────── sync amount from query if route changes ────────── */
  useEffect(() => {
    setAmountInput(amountFromQuery || "");
  }, [amountFromQuery]);

  // show api errors
  useEffect(() => {
    if (isMethodError) {
      const msg =
        (methodError as fetchBaseQueryError)?.data?.message ||
        (methodError as fetchBaseQueryError)?.data?.error ||
        "Payment channel not found";
      toast.error(msg);
    }
  }, [isMethodError, methodError]);

  useEffect(() => {
    if (isCreateError) {
      toast.error(
        (createError as fetchBaseQueryError)?.data?.message ||
          (createError as fetchBaseQueryError)?.data?.error ||
          "Deposit failed",
      );
    }
    if (isCreateSuccess) {
      toast.success("Deposit created successfully!");
      // চাইলে success এর পরে redirect:
      router.push("/deposit/deposit-record");
    }
  }, [isCreateError, isCreateSuccess, createError, router]);

  // amount validation
  const amountNum = amountInput ? Number(amountInput) : NaN;
  const isValidAmount =
    Number.isFinite(amountNum) &&
    amountNum >= MIN_AMOUNT &&
    amountNum <= MAX_AMOUNT;

  const isValid = useMemo(() => {
    if (!channelId) return false;
    if (!paymentMethod?._id) return false;
    if (!isValidAmount) return false;
    if (!txnId.trim()) return false;
    return true;
  }, [channelId, paymentMethod?._id, isValidAmount, txnId]);

  const onAmountChange = (raw: string) => {
    const onlyNum = raw.replace(/[^\d]/g, "");
    setAmountInput(onlyNum);
  };

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    /* ────────── create deposit with promotion opt-in (optional) ────────── */
    createDepositWithBDT({
      amount: Number(amountInput),
      customerNumber,
      txnId,
      methodId: paymentMethod?._id,

      /* ────────── promotion permission (optional) ────────── */
      promotionOptIn, // ✅ true/false
    });
  };

  const methodName = paymentMethod?.methodName;
  const methodType = paymentMethod?.methodType;

  return (
    <div className="min-h-screen bg-[#0b3c3f]">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-[#0b3c3f] px-4 py-3">
        <button
          className="text-gray-100 text-sm hover:underline flex items-center gap-1"
          onClick={() => router.back()}
          type="button"
        >
          <FaAngleLeft />
          Back
        </button>
        <h1 className="text-lg text-white font-bold">Payment</h1>
        <div className="w-10" />
      </div>

      <div className="mx-auto max-w-md px-2 pb-10 pt-4">
        <div className="rounded-lg border border-[#00493B] bg-[#01241D] shadow-2xl overflow-hidden">
          {/* Top Notice */}
          <div className="bg-[#2F69B1] px-4 py-3 text-sm text-white">
            <p className="leading-snug">
              <b>Before making a request</b>, please transfer funds within{" "}
              <b>10 minutes</b> using the payment details specified below.
            </p>
          </div>

          {/* Body */}
          <div className="p-2 space-y-4 text-white">
            {/* Icon + Title */}
            <div className="space-y-2">
              <div>
                {methodName === "Bkash" ? (
                  <PaymentBrandIcon title="BKash Deposit" />
                ) : methodName === "Nagad" ? (
                  <PaymentBrandIcon
                    title="Nagad Deposit"
                    logoSrc={NagadLogo}
                    alt="Nagad Logo"
                    bgClassName="bg-[#E51B23]"
                  />
                ) : (
                  <span className="text-xs font-bold">PM</span>
                )}
              </div>
              <div className="flex items-center gap-2 px-2">
                <div>
                  <div className="text-sm font-bold">
                    {getWalletTitle(methodName, methodType)}
                  </div>
                </div>

                <div className="mr-2 ml-auto">
                  <button
                    className="text-xs rounded-full p-1 border border-[#2a7565] h-6 w-6 flex items-center justify-center hover:bg-[#031a15]"
                    type="button"
                    onClick={() => refetch()}
                  >
                    <SlRefresh />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading / Missing */}
            {isMethodLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-200">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading payment method...
              </div>
            ) : !paymentMethod ? (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
                Payment method not found.
              </div>
            ) : (
              <>
                {/* Account number + Copy */}
                <div className="grid grid-cols-5 items-center gap-1">
                  <div className="col-span-4">
                    <input
                      value={paymentMethod.accountNumber || ""}
                      readOnly
                      className="w-full rounded-lg border border-[#00493B] bg-[#01241D] px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <CopyToClipboard text={paymentMethod.accountNumber || ""} />
                  </div>
                </div>

                {/* Amount */}
                <div className="rounded-lg border border-[#00493B] bg-[#031a15] p-3">
                  <label className="text-sm font-semibold">Amount</label>

                  <div
                    className={[
                      "mt-2 flex items-center gap-2 rounded-lg border px-3 py-2",
                      amountInput.length === 0
                        ? "border-[#00493B] bg-[#01241D]"
                        : isValidAmount
                          ? "border-emerald-500/40 bg-[#01241D] ring-2 ring-emerald-500/10"
                          : "border-red-500/40 bg-[#01241D] ring-2 ring-red-500/10",
                    ].join(" ")}
                  >
                    <div className="font-bold text-gray-300">💎</div>

                    {/* ────────── keep UI same but show correct value ────────── */}
                    <input
                      inputMode="numeric"
                      value={amountInput}
                      className="w-full bg-transparent text-sm font-extrabold outline-none"
                      readOnly
                    />
                  </div>
                </div>

                {/* Customer Number (optional) */}
                {/* <div className="rounded-2xl border border-[#00493B] bg-[#031a15] p-3">
                  <label className="text-sm font-semibold">
                    Your Wallet Number (optional)
                  </label>
                  <input
                    value={customerNumber}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="mt-2 w-full rounded-xl border border-[#00493B] bg-[#01241D] px-3 py-2 text-sm outline-none"
                  />
                </div> */}

                {/* Txn ID */}
                <div className="rounded-lg border border-[#00493B] bg-[#031a15] p-3">
                  <label className="text-sm font-semibold">
                    Transaction ID (TrxID)
                  </label>
                  <input
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="e.g., 7AB12C3D45"
                    className="mt-2 w-full rounded-lg border border-[#00493B] bg-[#01241D] px-3 py-2 text-sm outline-none"
                    maxLength={10}
                  />
                  <div className="mt-2 ml-1 text-[10px] text-gray-300">
                    Enter the TrxID from your {methodName} transaction history.
                  </div>
                </div>

                {/* Note */}
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-100 leading-relaxed">
                  Please recheck all information. Wrong TxID/TrxID/UTR/Reference
                  can delay verification.
                </div>

                {/* Confirm */}
                <button
                  disabled={!isValid || isCreating}
                  onClick={handleSubmit}
                  className={[
                    "w-full rounded-lg py-3 text-center text-sm font-extrabold transition shadow-lg",
                    !isValid || isCreating
                      ? "bg-neutral-700/40 text-gray-300 cursor-not-allowed"
                      : "bg-[#4CAF50] text-white hover:bg-[#3ea145]",
                  ].join(" ")}
                >
                  {isCreating ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "CONFIRM"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
