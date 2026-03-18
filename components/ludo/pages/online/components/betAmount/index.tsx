"use client";

import { useMemo, useState } from "react";

import GameActionButton from "@/components/game-ui/GameActionButton";
import Logo from "@/components/ludo/logo";
import PageWrapper from "@/components/wrapper/page";
import { useGetWalletQuery } from "@/redux/features/wallet/walletApi";
import { useSelector } from "react-redux";
import swal from "sweetalert";

const PRESET_AMOUNTS = [50, 100, 500, 1000];

/* ────────── preset button colors ────────── */
const PRESET_STYLES: Record<
  number,
  { start: string; mid: string; end: string }
> = {
  50: {
    start: "#7cf7ff",
    mid: "#28c7f7",
    end: "#1565d8",
  },
  100: {
    start: "#8cffb5",
    mid: "#2ed573",
    end: "#128a49",
  },
  500: {
    start: "#ffd36d",
    mid: "#ff9f43",
    end: "#d35400",
  },
  1000: {
    start: "#ff9cf3",
    mid: "#e056fd",
    end: "#8e44ad",
  },
};

interface BetAmountProps {
  onBack: () => void;
  onConfirm: (amount: number) => void;
}

const BetAmount = ({ onBack, onConfirm }: BetAmountProps) => {
  const { data } = useGetWalletQuery();
  const { user } = useSelector((state: any) => state.auth) || {};
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");

  /* ────────── derived wallet balance ────────── */
  const walletBalance = useMemo(
    () => Number(user?.m_balance || 0) + Number(data?.balance || 0),
    [data, user],
  );

  /* ────────── final amount resolver ────────── */
  const finalAmount = useMemo(() => {
    const custom = Number(customAmount || 0);
    if (custom > 0) return custom;
    return Number(selectedAmount || 0);
  }, [customAmount, selectedAmount]);

  /* ────────── confirm selected amount ────────── */
  const handleConfirm = () => {
    const normalizedAmount = Number(customAmount || selectedAmount || 0);

    if (!Number.isFinite(normalizedAmount) || normalizedAmount < 50) {
      swal({
        title: "Invalid amount",
        text: "Minimum wager amount is 50",
        icon: "error",
      });
      return;
    }

    if (!Number.isInteger(normalizedAmount)) {
      swal({
        title: "Invalid amount",
        text: "Please enter a whole number",
        icon: "error",
      });
      return;
    }

    if (walletBalance < normalizedAmount) {
      swal({
        title: "Insufficient balance",
        text: "Your wallet balance is lower than the wager amount",
        icon: "error",
      });
      return;
    }

    onConfirm(normalizedAmount);
  };

  return (
    <PageWrapper>
      <Logo />

      {/* ────────── main container ────────── */}
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          margin: "0 auto",
          padding: "8px 16px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {/* ────────── heading card ────────── */}
        <div
          style={{
            width: "100%",
            borderRadius: 20,
            padding: "14px 16px",
            background:
              "linear-gradient(180deg, rgba(8,33,77,0.68) 0%, rgba(6,20,48,0.48) 100%)",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
            textAlign: "center",
            backdropFilter: "blur(6px)",
          }}
        >
          <h2
            style={{
              color: "#ffffff",
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: "0.04em",
              lineHeight: 1.1,
              textTransform: "uppercase",
              textShadow: "0 2px 10px rgba(0,0,0,0.28)",
              margin: 0,
            }}
          >
            Choose Wager Amount
          </h2>

          <div
            style={{
              marginTop: 12,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 999,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.08))",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <span
              style={{
                color: "#dff7ff",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Available Balance:
            </span>
            <span
              style={{
                color: "#ffe36e",
                fontSize: 18,
                fontWeight: 900,
                textShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {walletBalance}
            </span>
          </div>
        </div>

        {/* ────────── preset amount grid ────────── */}
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          {PRESET_AMOUNTS.map((amount) => {
            const active = !customAmount && selectedAmount === amount;
            const colors = PRESET_STYLES[amount];

            return (
              <button
                key={amount}
                type="button"
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                style={{
                  position: "relative",
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  borderRadius: 22,
                  transform: active ? "translateY(-2px) scale(1.02)" : "none",
                  transition: "all 0.2s ease",
                  boxShadow: active
                    ? "0 0 0 3px #ffe066, 0 12px 24px rgba(0,0,0,0.22)"
                    : "0 8px 18px rgba(0,0,0,0.14)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    zIndex: 2,
                    opacity: active ? 1 : 0,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      background: "#ffe066",
                      color: "#3b2f00",
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 900,
                      padding: "4px 8px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
                    }}
                  >
                    SELECTED
                  </div>
                </div>

                <GameActionButton
                  label={`${amount}`}
                  size="lg"
                  colors={colors}
                  className="w-full"
                />
              </button>
            );
          })}
        </div>

        {/* ────────── smart custom amount input ────────── */}
        <div style={{ width: "100%" }}>
          <div
            style={{
              width: "100%",
              borderRadius: 22,
              padding: "14px 14px 12px",
              background:
                "linear-gradient(180deg, rgba(9,34,74,0.66) 0%, rgba(4,15,35,0.46) 100%)",
              border: "1px solid rgba(255,255,255,0.16)",
              boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
              backdropFilter: "blur(8px)",
            }}
          >
            <label
              htmlFor="custom-wager-amount"
              style={{
                display: "block",
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 10,
                textShadow: "0 1px 6px rgba(0,0,0,0.2)",
                textAlign: "center",
              }}
            >
              Or Enter Custom Amount
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderRadius: 16,
                padding: "0 14px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,214,10,0.45)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              <span
                style={{
                  color: "#ffe36e",
                  fontWeight: 900,
                  fontSize: 18,
                  minWidth: 20,
                }}
              >
                ৳
              </span>

              <input
                id="custom-wager-amount"
                type="number"
                min={50}
                step={1}
                placeholder="Type custom amount"
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value)}
                style={{
                  width: "100%",
                  height: 52,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#ffffff",
                  fontSize: 18,
                  fontWeight: 700,
                  textAlign: "left",
                }}
              />
            </div>

            <p
              style={{
                marginTop: 10,
                marginBottom: 0,
                color: "#dff7ff",
                opacity: 0.92,
                fontSize: 14,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Selected Amount:{" "}
              <span style={{ color: "#ffe36e", fontWeight: 900 }}>
                {finalAmount}
              </span>
            </p>
          </div>
        </div>

        {/* ────────── action buttons ────────── */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 4,
          }}
        >
          <GameActionButton
            onClick={handleConfirm}
            label={"Search Same Amount Player"}
            size="lg"
            colors={{
              start: "#ffd66e",
              mid: "#ffb340",
              end: "#d67b00",
            }}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default BetAmount;
