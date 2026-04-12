"use client";
import WithdrawForm from "@/components/withdraw/WithdrawForm";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import RecIcon from "@/public/icons/record_icon.png";

import RecallBalanceBtn from "@/components/withdraw/RecallBalanceBtn";
import { BoundWallet } from "@/components/withdraw/WalletCard";
import WalletTabs, {
  WalletProvider,
  WalletProviderConfig,
} from "@/components/withdraw/WalletTabs";
import { useGetUserPaymentMethodsQuery } from "@/redux/features/auth/authApi";
import { useCreateWithdrawRequestMutation } from "@/redux/features/withdraw/withdrawApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa";

import UsdtLogo from "@/public/images/deposit/beep-20.png";
import BinanceLogo from "@/public/images/deposit/binance.png";
import BkashLogo from "@/public/images/deposit/bkash-logo.png";
import CashLogo from "@/public/images/deposit/cash-logo.png";
import NagadLogo from "@/public/images/deposit/nagad-logo.png";
import RocketLogo from "@/public/images/deposit/roket-logo.png";

const formatBDT = (n: number) =>
  `💎 ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const PANEL = {
  background:
    "linear-gradient(180deg, rgba(67,11,88,0.55) 0%, rgba(20,4,31,0.75) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const walletProviders: WalletProviderConfig[] = [
  {
    id: "bkash",
    title: "bKash",
    logoSrc: BkashLogo,
    bgClassName: "bg-[#DA126B]",
    active: true,
  },
  {
    id: "nagad",
    title: "Nagad",
    logoSrc: NagadLogo,
    bgClassName: "bg-[#E51B23]",
    active: true,
  },
  {
    id: "rocket",
    title: "Rocket",
    logoSrc: RocketLogo,
    bgClassName: "bg-[#8E2BAF]",
    active: true,
  },
  {
    id: "binance",
    title: "Binance",
    logoSrc: BinanceLogo,
    bgClassName: "bg-[#24272E]",
    active: true,
  },
  {
    id: "crypto",
    title: "Crypto",
    logoSrc: UsdtLogo,
    bgClassName: "bg-[#4D5156]",
    active: true,
  },
  {
    id: "cash",
    title: "Cash",
    logoSrc: CashLogo,
    bgClassName: "bg-[#4D5156]",
    active: false, // এই method কে অস্থায়ীভাবে নিষ্ক্রিয় করা হয়েছে
  },
];

export default function WithdrawPage() {
  const router = useRouter();
  const { user } = useSelector((s: any) => s.auth) || { user: null };

  const { data } = useGetUserPaymentMethodsQuery(undefined);

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

  const defaultProvider =
    walletProviders.find((item) => item.active !== false)?.id || "bkash";

  const [provider, setProvider] = useState<WalletProvider>(defaultProvider);

  const providerWallets = useMemo(
    () => wallets.filter((w) => w.provider === provider),
    [wallets, provider],
  );

  // যেসব method আগে bound wallet দিয়ে চলতো সেগুলো intact থাকবে
  const isLegacyWalletProvider = [
    "bkash",
    "nagad",
    "rocket",
    "bank_transfer",
  ].includes(String(provider));

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const currentProvider = walletProviders.find(
      (item) => item.id === provider,
    );

    if (!currentProvider || currentProvider.active === false) {
      const nextActiveProvider =
        walletProviders.find((item) => item.active !== false)?.id || "bkash";
      setProvider(nextActiveProvider);
      return;
    }

    if (providerWallets.length === 1) {
      setSelectedId(providerWallets[0].id);
    } else if (
      providerWallets.length > 1 &&
      !providerWallets.some((w) => w.id === selectedId)
    ) {
      setSelectedId(providerWallets[0].id);
    } else if (providerWallets.length === 0) {
      setSelectedId(null);
    }
  }, [provider, providerWallets, selectedId]);

  const counts = useMemo(() => {
    return walletProviders.reduce(
      (acc, item) => {
        acc[item.id] = wallets.filter((w) => w.provider === item.id).length;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [wallets]);

  const mainBalance = Number(user?.m_balance ?? 0);
  const available = Number(user?.available_amount ?? mainBalance);
  const wagerRemaining = Number(user?.bet_volume ?? 0);
  const wagerRequired = Number(user?.wager_required ?? 0);

  const [
    createWithdrawRequest,
    { isLoading: isSubmitting, error: createError, isSuccess, isError },
  ] = useCreateWithdrawRequestMutation();

  const handleRecall = () => {
    console.log("recall balance");
  };

  const selectedWallet =
    providerWallets.find((w) => w.id === selectedId) || null;

  // handleSubmit আপডেট
  const handleSubmit = async (
    amt: number,
    pass: string,
    accountNumber: string,
  ) => {
    if (!selectedWallet && !accountNumber) {
      toast.error("Select an E-wallet and enter account number");
      return;
    }

    const payoutCurrency = ["binance", "crypto"].includes(provider)
      ? "USDT"
      : "BDT";

    await createWithdrawRequest({
      amount: amt,
      method: {
        name: provider,
        accountNumber: accountNumber,
      },
      payoutCurrency,
      pass,
    }).unwrap();
  };
  useEffect(() => {
    if (isError) toast.error((createError as fetchBaseQueryError).data?.error);

    if (isSuccess) {
      toast.success("Withdraw request created successfully!");
      router.push("/dashboard");
    }
  }, [isError, isSuccess, createError, router]);

  const canWithdraw = wagerRemaining <= 0;

  return (
    <div className="min-h-screen pb-10" style={{ background: "#14041f" }}>
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
        style={{
          background:
            "linear-gradient(180deg,rgba(30,5,50,0.98),rgba(20,4,31,0.95))",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-white/70 transition hover:text-white"
          style={{ background: "rgba(255,255,255,0.07)" }}
          onClick={() => router.back()}
          type="button"
        >
          <FaAngleLeft className="text-xs" /> Back
        </button>

        <h1 className="text-base font-extrabold tracking-widest text-white uppercase">
          🏧 Withdraw
        </h1>

        <Link href="/withdraw/withdraw-record">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <Image src={RecIcon} alt="History" className="h-5 w-5" />
          </div>
        </Link>
      </div>

      <div className="mx-auto w-full max-w-md px-3 py-4 space-y-3">
        <div
          className="rounded-2xl p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(80,10,120,0.7), rgba(30,5,60,0.9))",
            border: "1px solid rgba(180,80,255,0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">
                Main Wallet
              </div>
              <div className="text-xl font-extrabold text-white">
                {formatBDT(mainBalance)}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">
                Available
              </div>
              <div className="text-lg font-bold" style={{ color: "#a78bfa" }}>
                {formatBDT(available)}
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-2 gap-2 pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div>
              <div className="text-[10px] text-white/35">Min Withdraw</div>
              <div className="text-xs font-semibold text-white/70 mt-0.5">
                {formatBDT(500)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-white/35">Max Withdraw</div>
              <div className="text-xs font-semibold text-white/70 mt-0.5">
                {formatBDT(25000)}
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-white/40">
            <div>
              Withdrawal time: <span className="text-white/60">24 hours</span>
            </div>
            <div className="text-right">
              Daily limit: <span className="text-white/60">Unlimited</span>
            </div>
          </div>

          <div className="mt-3">
            <RecallBalanceBtn onClick={handleRecall} />
          </div>
        </div>

        <div className="rounded-2xl p-4" style={PANEL}>
          <WalletTabs
            value={provider}
            onChange={setProvider}
            providers={walletProviders}
            counts={counts}
          />
        </div>

        {/* <TurnoverNotice
          remaining={wagerRemaining}
          required={wagerRequired}
          onOk={() => console.log("ok")}
        /> */}

        <div className="rounded-2xl overflow-hidden" style={PANEL}>
          <WithdrawForm
            available={available}
            provider={provider} // ← এটা যোগ করো
            disabled={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
