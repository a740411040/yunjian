// src/app/notifications/page.tsx

import { redirect } from "next/navigation";
import { NotificationsPageClient } from "@/components/notifications/NotificationsPageClient";
import { getCurrentProfileServer } from "@/lib/profiles-server";

export default async function NotificationsPage() {
  const profile = await getCurrentProfileServer();

  if (!profile) {
    redirect("/auth/login");
  }

  return <NotificationsPageClient />;
}