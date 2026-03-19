"use client";

import NagadLogo from "@/public/images/deposit/nagad-logo.png";
import { useAddUserPaymentMethodMutation } from "@/redux/features/auth/authApi";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import PaymentBrandIcon from "../../deposit/payment/components/BkashIcon";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import AccountNumberField from "./components/AccountNumberField";
import PasswordSection from "./components/PasswordSection";
import ReadonlyField from "./components/ReadonlyField";
import TextField from "./components/TextField";
import TopAppBar from "./components/TopAppBar";
import WalletGroupSelector from "./components/WalletGroupSelector";

export type WalletGroup = "bkash" | "nagad";

const BindWalletPage: React.FC = () => {
  const router = useRouter();
  const [addUserPaymentMethod] = useAddUserPaymentMethodMutation();

  const { user } = useSelector((state: any) => state.auth);

  const [group, setGroup] = useState<WalletGroup>("bkash");
  const [fullName, setFullName] = useState("");
  const [account, setAccount] = useState("");
  const [txPass, setTxPass] = useState("");
  const [txPass2, setTxPass2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const ewalletType = group === "bkash" ? "BKash" : "Nagad";

  // validations (same logic)
  const nameErr = fullName.trim().length < 3 ? "Enter payee full name" : "";
  const accErr =
    group === "bkash" || group === "nagad"
      ? /^\d{11}$/.test(account)
        ? ""
        : "11-digit account number required"
      : "";

  const passErr = /^\d{6}$/.test(txPass)
    ? ""
    : "Transaction password must be 6 digits";

  const matchErr =
    txPass && txPass2 && txPass !== txPass2 ? "Passwords do not match" : "";

  const isValid = useMemo(
    () =>
      !nameErr &&
      !accErr &&
      !passErr &&
      !matchErr &&
      fullName &&
      account &&
      txPass,
    [nameErr, accErr, passErr, matchErr, fullName, account, txPass],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const data = {
      name: fullName,
      method: group,
      accountNumber: account,
      txPassword: txPass,
    };

    try {
      await addUserPaymentMethod(data).unwrap();
      toast.success("E-wallet bound successfully!");
      router.push("/withdraw");
    } catch (error) {
      console.error(error);
      toast.error(
        (error as fetchBaseQueryError).data?.error || "Something went wrong!",
      );
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <TopAppBar title="Bind E-wallet" onBack={() => history.back()} />

      <form onSubmit={onSubmit} className="mx-auto w-full max-w-md px-4 py-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <WalletGroupSelector
            group={group}
            onChange={setGroup}
            bkashIcon={<PaymentBrandIcon title="BKash" imageSize={30} />}
            nagadIcon={
              <PaymentBrandIcon
                title="Nagad"
                logoSrc={NagadLogo}
                alt="Nagad Logo"
                bgClassName="bg-[#E51B23]"
                imageSize={30}
              />
            }
          />

          <ReadonlyField label="E-wallet type" value={ewalletType} />

          <TextField
            label="* Full name of the payee"
            value={fullName}
            onChange={setFullName}
            placeholder="Enter full name"
            leftIcon="user"
            helperText={
              "Please ensure the name you provide matches exactly with the name registered with your financial provider to avoid failure. Once the name is submitted, it cannot be changed."
            }
            error={nameErr}
          />

          <AccountNumberField
            label={`* ${ewalletType} account number`}
            value={account}
            onChange={setAccount}
            placeholder="01XXXXXXXXX"
            error={accErr}
          />

          <PasswordSection
            txPass={txPass}
            txPass2={txPass2}
            onChangeTxPass={setTxPass}
            onChangeTxPass2={setTxPass2}
            show1={show1}
            show2={show2}
            onToggle1={() => setShow1((v) => !v)}
            onToggle2={() => setShow2((v) => !v)}
            passErr={passErr}
            matchErr={matchErr}
            hasTnxPassword={!!user?.hasTnxPassword}
          />

          <button
            type="submit"
            disabled={!isValid}
            className="mt-5 w-full rounded-lg bg-[#d9d9d9] py-3 text-base font-medium text-slate-800 transition
                       enabled:bg-[#0f4d3f] enabled:text-white enabled:hover:bg-[#0b3d31]
                       disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BindWalletPage;
