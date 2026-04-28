// src/app/admin/reports/page.tsx

import { notFound, redirect } from "next/navigation";
import { AdminReportsPageClient } from "@/components/admin/AdminReportsPageClient";
import { getCurrentProfileServer } from "@/lib/profiles-server";

export default async function AdminReportsPage() {
  const profile = await getCurrentProfileServer();

  if (!profile) {
    redirect("/auth/login");
  }

  if (profile.role !== "admin") {
    notFound();
  }

  return <AdminReportsPageClient />;
}