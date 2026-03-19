"use client";

import { Loader2 } from "lucide-react";
import Image, { StaticImageData } from "next/image";

import RecIcon from "@/public/icons/record_icon.png";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaAngleLeft } from "react-icons/fa";

import Bkash from "@/public/images/deposit/bkash.png";
import Nagad from "@/public/images/deposit/nagad.png";
import Rocket from "@/public/images/deposit/roket.png";

import PromotionConsent, {
  PromoChoice,
} from "@/components/deposit/PromotionConsent";
import {
  AgentPaymentMethod,
  useGetMyAgentPaymentMethodsQuery,
} from "@/redux/features/deposit/depositApi";
import { useGetDepositPromoInfoQuery } from "@/redux/features/promotion/promotionApi";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import Link from "next/link";

type MethodKey = "Bkash" | "Nagad" | "Rocket";

const METHOD_META: Record<
  MethodKey,
  { image: StaticImageData; label: string }
> = {
  Bkash: { image: Bkash, label: "Bkash VIP" },
  Nagad: { image: Nagad, label: "NAGAD VIP" },
  Rocket: { image: Rocket, label: "ROCKET VIP" },
};

const MIN_AMOUNT = 100;
const MAX_AMOUNT = 25000;

const clamp = (n: number) => Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, n));

const DepositMethodCard = ({
  active,
  onClick,
  image,
  title,
}: {
  active: boolean;
  onClick: () => void;
  image: StaticImageData;
  title: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={[
        "relative w-full rounded-lg border bg-white p-4 text-left transition shadow-sm",
        active
          ? "border-red-400 ring-2 ring-red-200"
          : "border-neutral-200 hover:border-neutral-300",
      ].join(" ")}
      type="button"
    >
      <span className="absolute left-1 top-1 inline-flex h-4 w-4 items-center justify-center rounded-lg bg-orange-500 text-xs font-bold text-white">
        👍
      </span>

      <div className="flex flex-col items-center gap-2">
        <Image src={image} alt={title} className=" w-12" />
        <div className="text-xs font-extrabold tracking-wide text-red-600">
          {title}
        </div>
      </div>

      {active ? (
        <span className="absolute bottom-3 right-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          ✓
        </span>
      ) : null}
    </button>
  );
};

const ChannelCard = ({
  active,
  onClick,
  title,
  code,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  code?: string;
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={[
        "relative w-full rounded-lg border bg-white px-4 py-1 text-left transition shadow-sm",
        active
          ? "border-red-400 ring-2 ring-red-200"
          : "border-neutral-200 hover:border-neutral-300",
      ].join(" ")}
    >
      <span className="absolute left-0.5 top-0.5 inline-flex h-3 w-3 items-center justify-center rounded-lg bg-orange-500 text-xs font-bold text-white">
        👍
      </span>

      <div className="text-xs  font-semibold text-center">
        <span className={active ? "text-red-600" : "text-neutral-800"}>
          {title}
        </span>
      </div>
    </button>
  );
};

const AmountChip = ({
  value,
  active,
  onClick,
}: {
  value: number;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "rounded-lg border bg-white text-gray-500 px-2 py-2 text-center text-sm font-semibold transition shadow-sm",
      active
        ? "border-red-400 ring-2 ring-red-200 text-gray-800 font-bold"
        : "border-neutral-200 hover:border-neutral-300",
    ].join(" ")}
  >
    {value.toLocaleString()}
  </button>
);

const NotFoundChannels = ({ onRefresh }: { onRefresh: () => void }) => {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center px-6 text-center">
      <div className="h-28 w-28 rounded-full bg-neutral-100" />
      <div className="mt-4 text-lg font-semibold text-neutral-700">
        কোনো জমা পদ্ধতি নেই
      </div>
      <button className="mt-2 text-sm font-semibold text-blue-600 underline">
        গ্রাহক সেবা
      </button>

      <div className="mt-4 flex gap-3">
        <button
          className="rounded-2xl border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-600"
          onClick={() => toast.success("Copied")}
          type="button"
        >
          Copy &amp; Report
        </button>
        <button
          className="rounded-2xl border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-600"
          onClick={onRefresh}
          type="button"
        >
          রিফ্রেশ
        </button>
      </div>

      <div className="mt-4 text-sm text-neutral-500">
        No deposit channels found. Please check the configuration.
      </div>
    </div>
  );
};

const codeFromTitle = (title?: string) => {
  if (!title) return undefined;
  const m = title.match(/(\d{2})$/);
  if (!m) return undefined;
  return m[1];
};

export default function DepositPage() {
  const router = useRouter();

  /* ────────── promo choice ────────── */
  const [promoChoice, setPromoChoice] = useState<PromoChoice | null>(null);

  /* ────────── promo info ────────── */
  const { data: promoRes } = useGetDepositPromoInfoQuery();
  const promo = promoRes?.data;

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetMyAgentPaymentMethodsQuery();

  const allMethods: AgentPaymentMethod[] = data?.data || [];

  useEffect(() => {
    if (!isError) return;
    const msg =
      (error as fetchBaseQueryError)?.data?.message ||
      (error as fetchBaseQueryError)?.data?.error ||
      "Failed to load deposit methods";
    toast.error(msg);
  }, [isError, error]);

  const grouped = useMemo(() => {
    const map: Partial<Record<MethodKey, AgentPaymentMethod[]>> = {};
    for (const pm of allMethods) {
      const key = pm.methodName as MethodKey;
      if (!key || !METHOD_META[key]) continue;
      if (!map[key]) map[key] = [];
      map[key]!.push(pm);
    }

    (Object.keys(map) as MethodKey[]).forEach((k) => {
      map[k] = (map[k] || []).slice().sort((a, b) => {
        const ad = a.isDefault ? 1 : 0;
        const bd = b.isDefault ? 1 : 0;
        if (bd !== ad) return bd - ad;
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      });
    });

    return map;
  }, [allMethods]);

  const availableMethods = useMemo(() => {
    return (Object.keys(grouped) as MethodKey[]).filter(
      (k) => (grouped[k]?.length || 0) > 0,
    );
  }, [grouped]);

  const [selectedMethod, setSelectedMethod] = useState<MethodKey | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null,
  );

  // ✅ amount now controlled by input value string
  const [amountInput, setAmountInput] = useState<string>("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedMethod && availableMethods.length > 0) {
      setSelectedMethod(availableMethods[0]);
    }
  }, [availableMethods, selectedMethod]);

  const channels = selectedMethod ? grouped[selectedMethod] || [] : [];

  useEffect(() => {
    if (!selectedChannelId && channels.length > 0) {
      const def = channels.find((c) => !!c.isDefault) || channels[0];
      setSelectedChannelId(def._id);
    }
  }, [channels, selectedChannelId]);

  if (!isLoading && availableMethods.length === 0) {
    return <NotFoundChannels onRefresh={() => refetch()} />;
  }

  const presetAmounts = [
    100, 200, 500, 1000, 3000, 5000, 10000, 15000, 20000, 25000,
  ];

  const amountNumber = amountInput ? Number(amountInput) : NaN;
  const isValidAmount =
    Number.isFinite(amountNumber) &&
    amountNumber >= MIN_AMOUNT &&
    amountNumber <= MAX_AMOUNT;

  const canNext = !!selectedMethod && !!selectedChannelId && isValidAmount;

  const setAmountFromPreset = (v: number) => {
    setSelectedPreset(v);
    setAmountInput(String(v)); // ✅ chip click -> input fill
  };

  const onAmountChange = (raw: string) => {
    const onlyNum = raw.replace(/[^\d]/g, "");
    setAmountInput(onlyNum);
    setSelectedPreset(null); // ✅ user typed, unselect chip
  };

  const onAmountBlur = () => {
    if (!amountInput) return;
    const n = Number(amountInput);
    if (!Number.isFinite(n)) {
      setAmountInput("");
      return;
    }
    if (n < MIN_AMOUNT || n > MAX_AMOUNT) {
      const fixed = clamp(n);
      setAmountInput(String(fixed));
      toast.error(`Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT}`);
    }
  };

  const onNext = () => {
    if (!canNext) {
      toast.error(`Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT}`);
      return;
    }

    /* ────────── promotion permission required ────────── */
    if (!promoChoice) {
      toast.error("Please choose a promotion option");
      return;
    }

    const promoFlag = promoChoice === "opt_in" ? "1" : "0";

    // ✅ amount + channelId pass by query
    router.push(
      `/deposit/payment?amount=${encodeURIComponent(amountInput)}&channelId=${encodeURIComponent(
        selectedChannelId!,
      )}&promo=${encodeURIComponent(promoFlag)}`,
    );
  };

  return (
    <div className="min-h-screen bg-[#0b3c3f]">
      <div className="mx-auto max-w-xl px-3 pb-8">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-[#0b3c3f] px-1 py-3">
          <button
            className="text-gray-100 text-sm hover:underline flex items-center gap-1"
            onClick={() => router.back()}
            type="button"
          >
            <FaAngleLeft />
            Back
          </button>
          <h1 className="text-lg text-white font-bold">Deposit</h1>
          <div className="">
            <Link
              href="/deposit/deposit-record"
              className="text-gray-100 text-sm hover:underline"
            >
              <Image src={RecIcon} alt="History" className="h-6 w-6" />
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-white px-4 py-4 shadow-lg">
          {/* Deposit Method */}
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-800">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Deposit Method
          </div>

          {isLoading ? (
            <div className="flex gap-3">
              <div className="h-24 w-1/2 rounded-3xl bg-neutral-100" />
              <div className="h-24 w-1/2 rounded-3xl bg-neutral-100" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {availableMethods.map((k) => (
                <DepositMethodCard
                  key={k}
                  image={METHOD_META[k].image}
                  title={METHOD_META[k].label}
                  active={selectedMethod === k}
                  onClick={() => {
                    setSelectedMethod(k);
                    setSelectedChannelId(null);
                  }}
                />
              ))}
            </div>
          )}

          {/* Note */}
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] leading-5 text-red-600">
            <span className="font-bold">!!! NOTE :</span> অনুগ্রহ করে আপনার
            ডিপোজিট করার পরে অবশ্যই আপনার Trx-ID আইডি সাবমিট করবেন। তাহলে খুব
            দ্রুত আপনার একাউন্টের মধ্যে টাকা যোগ হয়ে যাবে। ⚠️⚠️⚠️
          </div>

          {/* Payment channels */}
          <div className="mt-6 mb-2 flex items-center gap-2 text-[15px] font-semibold text-neutral-800">
            <span className="h-2 w-2 rounded-full bg-teal-500" />
            Payment channels
            {isFetching ? (
              <span className="ml-2 inline-flex items-center gap-1 text-xs text-neutral-500">
                <Loader2 className="h-3 w-3 animate-spin" /> loading
              </span>
            ) : null}
          </div>

          {channels.length === 0 ? (
            <NotFoundChannels onRefresh={() => refetch()} />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                {channels.map((pm) => (
                  <ChannelCard
                    key={pm._id}
                    active={selectedChannelId === pm._id}
                    onClick={() => setSelectedChannelId(pm._id)}
                    title={pm.title || METHOD_META[selectedMethod!].label}
                    code={codeFromTitle(pm.title)}
                  />
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] leading-5 text-red-600">
                <span className="font-bold">!</span> অনুগ্রহ করে সচেতন থাকুন (যে
                সম্প্রতি ডিপোজিট পরিষেবা প্রদানের জন্য Telegram বা Facebook এর
                ভান করে অনেক স্ক্যামার এসেছে! আমাদের অফিসিয়াল ডিপোজিটগুলো
                শুধুমাত্র প্ল্যাটফর্মের মধ্যে সম্পন্ন হয়) ⚠️
              </div>

              {/* Deposit Amounts */}
              <div className="mt-6 mb-2 flex items-center gap-2 text-[15px] font-semibold text-neutral-800">
                <span className="h-2 w-2 rounded-full bg-pink-500" />
                Deposit Amounts
              </div>

              <div className="grid grid-cols-5 gap-1">
                {presetAmounts.map((v) => (
                  <AmountChip
                    key={v}
                    value={v}
                    active={selectedPreset === v}
                    onClick={() => setAmountFromPreset(v)}
                  />
                ))}
              </div>

              {/* Amount input */}
              <div className="mt-3">
                <div
                  className={[
                    "rounded-lg border bg-white px-4 py-2 shadow-sm flex items-center gap-2",
                    amountInput.length === 0
                      ? "border-neutral-200"
                      : isValidAmount
                        ? "border-emerald-300 ring-2 ring-emerald-100"
                        : "border-red-300 ring-2 ring-red-100",
                  ].join(" ")}
                >
                  <div className="mt-1 font-bold text-neutral-600">৳</div>
                  <input
                    className="w-full text-sm font-extrabold outline-none text-neutral-600 placeholder:text-neutral-400"
                    placeholder={`${MIN_AMOUNT.toLocaleString()} - ${MAX_AMOUNT.toLocaleString()}`}
                    value={amountInput}
                    onChange={(e) => onAmountChange(e.target.value)}
                    onBlur={onAmountBlur}
                    inputMode="numeric"
                  />
                </div>

                <div>
                  {/* ────────── Promotions (optional) ────────── */}
                  {promo?.showPromo ? (
                    <PromotionConsent
                      value={promoChoice}
                      onChange={setPromoChoice}
                      firstBonusPercent={promo?.firstBonusPercent}
                      secondBonusPercent={promo?.secondBonusPercent}
                      eligibleDepositIndex={promo?.eligibleDepositIndex}
                      turnoverMultiplier={promo?.turnoverMultiplier}
                      amount={isValidAmount ? Number(amountInput) : undefined}
                    />
                  ) : null}
                </div>

                <div className="mt-2  text-red-600 text-sm font-semibold">
                  <span className="ml-1">Deposit Info: 24/24</span>
                </div>
              </div>

              {/* Next */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onNext}
                  disabled={!canNext}
                  className={[
                    "w-full rounded-lg py-3 text-sm font-extrabold transition shadow-md",
                    canNext
                      ? "bg-teal-700 text-white hover:bg-teal-800"
                      : "bg-neutral-200 text-neutral-500",
                  ].join(" ")}
                >
                  {canNext ? "Next" : "Select channel & amount"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
