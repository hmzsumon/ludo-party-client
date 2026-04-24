"use client";

import DashboardLayoutShell from "@/components/auth/Layout";
import SupportFloatingButton from "@/components/SupportFloatingButton";
import { useLoadUserQuery } from "@/redux/features/auth/authApi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError } = useLoadUserQuery();

  return (
    <DashboardLayoutShell>
      <div>
        {children}
        <SupportFloatingButton />
      </div>
    </DashboardLayoutShell>
  );
}
