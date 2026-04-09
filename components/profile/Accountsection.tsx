"use client";

// ✅ AccountSection.tsx
// Personal Profile এর "Account" section
// Account number, Username, Email, Phone, Password, Registration date

import { IPersonalProfile } from "@/redux/features/profile/personalProfileApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import AddFieldModal from "./AddFieldModal";
import EmailChangeModal from "./EmailChangeModal";
import PhoneChangeModal from "./PhoneChangeModal";
import ProfileInfoRow from "./ProfileInfoRow";

interface AccountSectionProps {
  profile: IPersonalProfile;
  onLinkPhone: (phone: string) => Promise<unknown>;
  isLinkingPhone: boolean;
}

export default function AccountSection({
  profile,
  onLinkPhone,
  isLinkingPhone,
}: AccountSectionProps) {
  const router = useRouter();

  // ✅ কোন modal open আছে সেটা track করি
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPhoneModal2, setShowPhoneModal2] = useState(false);

  // ✅ Registration date format করি
  const formattedDate = profile.registrationDate
    ? new Date(profile.registrationDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const handlePhoneConfirm = async (phone: string) => {
    try {
      await onLinkPhone(phone);
      setShowPhoneModal(false);
      toast.success("Phone linked successfully!");
    } catch {
      toast.error("Failed to link phone. Try again.");
    }
  };

  return (
    <>
      {/* ── Section Card ── */}
      <div
        className="rounded-2xl overflow-hidden px-2"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Account number – শুধু static value */}
        <ProfileInfoRow
          label="Account number"
          value={`id: ${profile.accountNumber}`}
          staticValue
          showDivider
        />

        {/* Username – Add button (user model এ username field নেই তাই placeholder) */}
        {/* <ProfileInfoRow
          label="Username"
          isEmpty
          actionType="add"
          onActionClick={() =>
            toast("Username feature coming soon!", { icon: "🔧" })
          }
          showDivider
        /> */}

        {/* Email – Change click এ attention modal */}
        <ProfileInfoRow
          label="Email"
          value={profile.email || undefined}
          actionType="change"
          onActionClick={() => setShowEmailModal(true)}
          showDivider
        />

        {/* Phone – না থাকলে Link button */}
        <ProfileInfoRow
          label="Phone number"
          value={profile.phone || undefined}
          actionType={profile.phone ? "change" : "link"}
          onActionClick={() => setShowPhoneModal2(true)}
          showDivider
        />

        {/* Password – Change আলাদা page এ */}
        <ProfileInfoRow
          label="Password"
          value={`Days since last change: ${profile.daysSincePasswordChange}`}
          actionType="change"
          onActionClick={() => router.push("/change-password")}
          showDivider
        />

        {/* Registration date – শুধু static */}
        <ProfileInfoRow
          label="Registration date"
          value={formattedDate}
          staticValue
          showDivider={false}
        />
      </div>

      {/* ── Email Attention Modal ── */}
      <EmailChangeModal
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onContactSupport={() => router.push("/support")}
      />

      {/* ── Phone Attention Modal ── */}
      <PhoneChangeModal
        open={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onContactSupport={() => router.push("/support")}
      />

      {/* ── Phone Link Modal ── */}
      <AddFieldModal
        open={showPhoneModal}
        title="Link Phone Number"
        fieldLabel="Phone Number"
        placeholder="01XXXXXXXXX"
        inputType="tel"
        prefix="+880"
        note="An SMS with an activation code will be sent to your phone."
        onConfirm={handlePhoneConfirm}
        onClose={() => setShowPhoneModal(false)}
        loading={isLinkingPhone}
      />
    </>
  );
}
