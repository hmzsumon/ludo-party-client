"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "../icon";
import { handleBack } from "./helpers";

interface BackButtonProps {
  to?: string;
  withConfirmation?: boolean;
}

const RenderAnchor = ({ to }: { to: string }) => (
  <Link href={to} className="button blue game-back-button">
    <Icon type="back" />
  </Link>
);

/**
 * Next.js version of BackButton
 * - আর react-router-dom নাই
 * - ROUTES import বাদ
 * - default path: "/ludo" (Lobby page)
 */
const BackButton = ({
  to = "/",
  withConfirmation = false,
}: BackButtonProps) => {
  const router = useRouter();

  if (!withConfirmation) {
    return <RenderAnchor to={to} />;
  }

  return (
    <button
      className="button blue game-back-button"
      onClick={() =>
        handleBack((action) => {
          if (action) {
            router.push(to);
          }
        })
      }
    >
      <Icon type="back" />
    </button>
  );
};

export default BackButton;
