"use client";
import React from "react";
import PasswordField from "./PasswordField";

type Props = {
  txPass: string;
  txPass2: string;
  onChangeTxPass: (v: string) => void;
  onChangeTxPass2: (v: string) => void;
  show1: boolean;
  show2: boolean;
  onToggle1: () => void;
  onToggle2: () => void;
  passErr: string;
  matchErr: string;

  hasTnxPassword: boolean;
};

const PasswordSection: React.FC<Props> = ({
  txPass,
  txPass2,
  onChangeTxPass,
  onChangeTxPass2,
  show1,
  show2,
  onToggle1,
  onToggle2,
  passErr,
  matchErr,
  hasTnxPassword,
}) => {
  return (
    <>
      <p className="mt-4 text-[13px] font-medium text-red-600">
        Please set up your transaction password.
      </p>

      <PasswordField
        label="* Set transaction password"
        value={txPass}
        onChange={onChangeTxPass}
        show={show1}
        onToggle={onToggle1}
        error={passErr}
      />

      {!hasTnxPassword && (
        <div className="mt-3">
          <PasswordField
            label="* Confirm password"
            value={txPass2}
            onChange={onChangeTxPass2}
            show={show2}
            onToggle={onToggle2}
            error={matchErr}
          />
        </div>
      )}
    </>
  );
};

export default PasswordSection;
