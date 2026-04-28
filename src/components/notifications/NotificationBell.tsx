// src/components/notifications/NotificationBell.tsx

"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { getUnreadNotificationCount } from "@/lib/notifications";

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadUnreadCount() {
      try {
        const count = await getUnreadNotificationCount();

        if (!active) {
          return;
        }

        setUnreadCount(count);
      } catch {
        if (active) {
          setUnreadCount(0);
        }
      }
    }

    void loadUnreadCount();

    function handleFocus() {
      void loadUnreadCount();
    }

    function handleVisible() {
      if (document.visibilityState === "visible") {
        void loadUnreadCount();
      }
    }

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisible);

    return () => {
      active = false;
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisible);
    };
  }, []);

  return (
    <Link
      href="/notifications"
      className="relative flex h-11 w-full items-center gap-3 rounded-2xl px-4 text-sm font-medium text-dai/70 transition hover:bg-white/60 hover:text-dai"
    >
      <Bell className="h-4 w-4" />
      通知

      {unreadCount > 0 && (
        <span className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-cinnabar px-2 py-0.5 text-xs font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}