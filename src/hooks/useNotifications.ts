// src/hooks/useNotifications.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from "@/lib/notifications";
import type { NotificationWithActor } from "@/types/notification";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationWithActor[]>(
    []
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const [items, unread] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount()
      ]);

      setNotifications(items);
      setUnreadCount(unread);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "加载通知失败。";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function markRead(notificationId: string) {
    try {
      await markNotificationAsRead(notificationId);

      setNotifications((items) =>
        items.map((item) =>
          item.id === notificationId ? { ...item, is_read: true } : item
        )
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "标记已读失败。";
      toast.error(message);
    }
  }

  async function markAllRead() {
    try {
      await markAllNotificationsAsRead();

      setNotifications((items) =>
        items.map((item) => ({
          ...item,
          is_read: true
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "全部标记已读失败。";
      toast.error(message);
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    refresh,
    markRead,
    markAllRead
  };
}