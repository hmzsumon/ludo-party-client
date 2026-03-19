/* ── Page: Withdraw ─────────────────────────────────────────────────────── */
"use client";
import TurnoverNotice from "@/components/withdraw/TurnoverNotice";
import WithdrawForm from "@/components/withdraw/WithdrawForm";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import RecIcon from "@/public/icons/record_icon.png";

import RecallBalanceBtn from "@/components/withdraw/RecallBalanceBtn";
import { BoundWallet } from "@/components/withdraw/WalletCard";
import WalletCarousel from "@/components/withdraw/WalletCarousel";
import WalletTabs, { WalletProvider } from "@/components/withdraw/WalletTabs";
import { useGetUserPaymentMethodsQuery } from "@/redux/features/auth/authApi";
import { useCreateWithdrawRequestMutation } from "@/redux/features/withdraw/withdrawApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa";

/* ── Helpers ────────────────────────────────────────────────────────────── */
const formatBDT = (n: number) =>
  `৳ ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/* ── Component ─────────────────────────────────────────────────────────── */
export default function WithdrawPage() {
  const router = useRouter();
  const { user } = useSelector((s: any) => s.auth) || { user: null };

  const { data, isLoading } = useGetUserPaymentMethodsQuery(undefined);
  const apiList: Array<{
    _id: string;
    method: WalletProvider;
    name?: string;
    accountNumber?: string;
    number?: string;
    wallet?: string;
    createdAt?: string;
    isDefault?: boolean;
  }> = data?.userPaymentMethods ?? [];

  const getAccount = (pm: any) =>
    pm.accountNumber || pm.number || pm.wallet || "";

  const wallets: BoundWallet[] = apiList.map((pm) => ({
    id: pm._id,
    provider: pm.method,
    accountNumber: getAccount(pm),
    holderName: pm.name,
    last4: getAccount(pm).slice(-4) || "****",
    createdAt: (pm.createdAt ?? new Date().toISOString()).slice(0, 10),
    isDefault: pm.isDefault,
  }));

  const [provider, setProvider] = useState<WalletProvider>("bkash");

  // filter wallets for active tab
  const providerWallets = useMemo(
    () => wallets.filter((w) => w.provider === provider),
    [wallets, provider],
  );

  // selection state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    if (providerWallets.length === 1) setSelectedId(providerWallets[0].id);
    else if (
      providerWallets.length > 1 &&
      !providerWallets.some((w) => w.id === selectedId)
    ) {
      setSelectedId(providerWallets[0].id);
    } else if (providerWallets.length === 0) {
      setSelectedId(null);
    }
  }, [providerWallets, selectedId]);

  // tab counts badge
  const counts = useMemo(() => {
    return {
      bkash: wallets.filter((w) => w.provider === "bkash").length,
      nagad: wallets.filter((w) => w.provider === "nagad").length,
    } as Partial<Record<WalletProvider, number>>;
  }, [wallets]);

  const mainBalance = Number(user?.m_balance ?? 0);
  const available = Number(user?.available_amount ?? mainBalance);

  // ✅ Casino-grade naming: bet_volume = wager/rollover remaining
  const wagerRemaining = Number(user?.bet_volume ?? 0);
  const wagerRequired = Number(user?.wager_required ?? 0);

  // optional info (nice UX)
  const turnoverToday = Number(user?.turnover_today ?? 0);
  const turnoverTotal = Number(user?.turnover_total ?? 0);

  const [
    createWithdrawRequest,
    { isLoading: isSubmitting, error: createError, isSuccess, isError },
  ] = useCreateWithdrawRequestMutation();

  const handleRecall = () => {
    console.log("recall balance");
  };

  const selectedWallet =
    providerWallets.find((w) => w.id === selectedId) || null;

  const handleSubmit = async (amt: number, pass: string) => {
    if (!selectedWallet) {
      toast.error("Select an E-wallet");
      return;
    }
    const payload = {
      amount: amt,
      method: {
        name: selectedWallet.provider,
        accountNumber: selectedWallet.accountNumber,
      },
      pass,
    };

    await createWithdrawRequest(payload).unwrap();
  };

  useEffect(() => {
    if (isError) toast.error((createError as fetchBaseQueryError).data?.error);
    if (isSuccess) {
      toast.success("Withdraw request created successfully!");
      router.push("/dashboard");
    }
  }, [isError, isSuccess, createError, router]);

  // ✅ Only show withdraw form when wager is complete
  const canWithdraw = wagerRemaining <= 0;

  return (
    <div className="min-h-screen bg-[#01241D] text-white">
      {/* Topbar */}

      <div className="sticky top-0 z-10 flex items-center justify-between bg-[#0b3c3f] px-4 py-3">
        <button
          className="text-gray-100 text-sm hover:underline flex items-center gap-1"
          onClick={() => router.back()}
          type="button"
        >
          <FaAngleLeft />
          Back
        </button>
        <h1 className="text-lg text-white font-bold">Withdraw</h1>
        <div className="">
          <Link
            href="/withdraw/withdraw-record"
            className="text-gray-100 text-sm hover:underline"
          >
            <Image src={RecIcon} alt="History" className="h-6 w-6" />
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md px-4 py-5">
        {/* Tabs */}
        <WalletTabs value={provider} onChange={setProvider} counts={counts} />

        {/* Bound wallets header */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm">
            {providerWallets.length > 0
              ? `Registered E-wallet (${providerWallets.length}/5)`
              : "Registered E-wallet (0/5)"}
          </p>

          <Link
            href="/withdraw/bind-wallet"
            className="rounded-full bg-red-600 p-2 hover:bg-red-700"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="fill-white"
            >
              <path d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z" />
            </svg>
          </Link>
        </div>

        {/* Cards / Slider */}
        <div className="mt-3">
          {isLoading ? (
            <div className="h-28 animate-pulse rounded-xl bg-white/10" />
          ) : providerWallets.length ? (
            <WalletCarousel
              items={providerWallets}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#00493B] bg-[#031A15] p-8 text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                className="mb-3 fill-white opacity-60"
              >
                <path d="M21 7H7V5c0-1.1.9-2 2-2h12v4zM3 7h2v12h14c1.1 0 2-.9 2-2v-7H7c-1.1 0-2 .9-2 2v5H3V7z" />
              </svg>
              <p className="text-white/70">Empty E-Wallet</p>
              <Link
                href="/withdraw/bind-wallet"
                className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm hover:bg-emerald-500"
              >
                Bind E-wallet
              </Link>
            </div>
          )}
        </div>

        {/* Info + recall */}
        <div className="mt-5 rounded-xl border border-[#00493B] bg-[#031A15] p-4 text-sm">
          <div className="grid gap-1 text-white/80">
            <div>
              Withdrawal time: <span className="opacity-80">24 hours</span>
            </div>
            <div className="opacity-80">Tips: উত্তোলনের সময়সীমা: ২৪ ঘন্টা</div>
            <div className="mt-2">
              Daily withdrawal 99 (Times), Remaining withdrawal 99 (Times)
            </div>

            <div>Main Wallet: {formatBDT(mainBalance)}</div>
            <div>Available Amount: {formatBDT(available)}</div>

            {/* ✅ optional but very helpful */}
            <div className="mt-2 text-white/70">
              Today Turnover:{" "}
              <span className="text-white">{formatBDT(turnoverToday)}</span>
            </div>
            <div className="text-white/70">
              Total Turnover:{" "}
              <span className="text-white">{formatBDT(turnoverTotal)}</span>
            </div>
          </div>

          <div className="mt-3">
            <RecallBalanceBtn onClick={handleRecall} />
          </div>
        </div>

        {/* ✅ Wager / Rollover Notice with progress (only shows when remaining > 0) */}
        <TurnoverNotice
          remaining={wagerRemaining}
          required={wagerRequired}
          onOk={() => console.log("ok")}
        />

        {/* ✅ Withdraw Form section ONLY when wagering is complete */}
        {canWithdraw ? (
          <WithdrawForm
            available={available}
            disabled={!selectedWallet || isSubmitting}
            onSubmit={handleSubmit}
          />
        ) : (
          // Nice UX: show a soft disabled placeholder instead of the form
          <div className="mt-4 rounded-xl border border-[#00493B] bg-[#031A15] p-4 text-sm text-white/70">
            Withdraw is locked until rollover is completed.
          </div>
        )}
      </div>
    </div>
  );
}
