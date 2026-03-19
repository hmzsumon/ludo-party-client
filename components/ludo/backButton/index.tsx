"use client";

import { useRouter } from "next/navigation";
import Icon from "../icon";
import { handleBack } from "./helpers";

interface BackButtonProps {
  to?: string;
  withConfirmation?: boolean;
}

const BackButton = ({
  to = "/",
  withConfirmation = false,
}: BackButtonProps) => {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(to);
    }
  };

  if (!withConfirmation) {
    return (
      <button className="button blue game-back-button" onClick={goBack}>
        <Icon type="back" />
      </button>
    );
  }

  return (
    <button
      className="button blue game-back-button"
      onClick={() =>
        handleBack((action) => {
          if (action) {
            goBack();
          }
        })
      }
    >
      <Icon type="back" />
    </button>
  );
};

export default BackButton;
