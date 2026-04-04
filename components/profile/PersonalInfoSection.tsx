"use client";

// ✅ PersonalInfoSection.tsx
// Personal Profile এর "Personal information" section
// Name, Surname, Country (with drawer), City

import { IPersonalProfile } from "@/redux/features/profile/personalProfileApi";
import { useState } from "react";
import { toast } from "react-hot-toast";
import AddFieldModal from "./AddFieldModal";
import CountrySelectDrawer, { Country } from "./CountrySelectDrawer";
import ProfileInfoRow from "./ProfileInfoRow";

interface PersonalInfoSectionProps {
  profile: IPersonalProfile;
  onUpdateProfile: (payload: {
    firstName?: string;
    surname?: string;
    countryCode?: string;
    countryName?: string;
  }) => Promise<unknown>;
  isUpdating: boolean;
}

export default function PersonalInfoSection({
  profile,
  onUpdateProfile,
  isUpdating,
}: PersonalInfoSectionProps) {
  const [showNameModal, setShowNameModal] = useState(false);
  const [showSurnameModal, setShowSurnameModal] = useState(false);
  const [showCountryDrawer, setShowCountryDrawer] = useState(false);

  // ✅ Fix 1: flag field বাদ — শুধু code, name, iso
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    profile.countryName
      ? {
          code: profile.countryCode || "",
          name: profile.countryName,
          iso: profile.countryCode || "",
        }
      : null,
  );

  /* ── Name update handler ── */
  const handleNameUpdate = async (value: string) => {
    try {
      await onUpdateProfile({ firstName: value });
      setShowNameModal(false);
      toast.success("Name updated!");
    } catch {
      toast.error("Failed to update name.");
    }
  };

  /* ── Surname update handler ── */
  const handleSurnameUpdate = async (value: string) => {
    try {
      await onUpdateProfile({ surname: value });
      setShowSurnameModal(false);
      toast.success("Surname updated!");
    } catch {
      toast.error("Failed to update surname.");
    }
  };

  /* ── Country select handler ── */
  const handleCountrySelect = async (country: Country) => {
    setSelectedCountry(country);
    try {
      await onUpdateProfile({
        countryCode: country.code,
        countryName: country.name,
      });
      toast.success("Country updated!");
    } catch {
      toast.error("Failed to update country.");
    }
  };

  // ✅ Fix 2: flag বাদ — শুধু code + name দেখাবে
  const countryDisplay = selectedCountry
    ? `${selectedCountry.code} ${selectedCountry.name}`.trim()
    : profile.countryName || "";

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
        {/* Name */}
        <ProfileInfoRow
          label="Full Name"
          value={profile.firstName || undefined}
          actionType={profile.firstName ? "change" : "add"}
          onActionClick={() => setShowNameModal(true)}
          showDivider
        />

        {/* Surname */}
        {/* <ProfileInfoRow
          label="Surname"
          value={profile.surname || undefined}
          actionType={profile.surname ? "change" : "add"}
          onActionClick={() => setShowSurnameModal(true)}
          showDivider
        /> */}

        {/* Country */}
        <ProfileInfoRow
          label="Country"
          value={countryDisplay || undefined}
          actionType={countryDisplay ? "change" : "add"}
          onActionClick={() => setShowCountryDrawer(true)}
          showDivider
        />

        {/* City */}
        <ProfileInfoRow
          label="City"
          value={profile.city || undefined}
          actionType={profile.city ? "change" : "add"}
          onActionClick={() =>
            toast("City feature coming soon!", { icon: "🏙️" })
          }
          showDivider={false}
        />
      </div>

      {/* ── Name Modal ── */}
      <AddFieldModal
        open={showNameModal}
        title="Update Name"
        fieldLabel="First Name"
        placeholder="Enter your first name"
        onConfirm={handleNameUpdate}
        onClose={() => setShowNameModal(false)}
        loading={isUpdating}
      />

      {/* ── Surname Modal ── */}
      <AddFieldModal
        open={showSurnameModal}
        title="Update Surname"
        fieldLabel="Surname"
        placeholder="Enter your surname"
        onConfirm={handleSurnameUpdate}
        onClose={() => setShowSurnameModal(false)}
        loading={isUpdating}
      />

      {/* ── Country Select Drawer ── */}
      <CountrySelectDrawer
        open={showCountryDrawer}
        selected={selectedCountry}
        onSelect={handleCountrySelect}
        onClose={() => setShowCountryDrawer(false)}
      />
    </>
  );
}
