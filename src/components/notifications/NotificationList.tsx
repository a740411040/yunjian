"use client";

import Link from "next/link";
import {
  Bell,
  Bookmark,
  Check,
  Flag,
  Heart,
  MessageCircle,
  ShieldCheck,
  UserPlus
} from "lucide-react";
import type {
  NotificationType,
  NotificationWithActor
} from "@/types/notification";

type NotificationListProps = {
  notifications: NotificationWithActor[];
  loading: boolean;
  onMarkRead: (notificationId: string) => void | Promise<void>;
};

function getNotificationIcon(type: NotificationType) {
  if (type === "note_liked") {
    return <Heart className="h-4 w-4" />;
  }

  if (type === "note_favorited") {
    return <Bookmark className="h-4 w-4" />;
  }

  if (type === "note_commented") {
    return <MessageCircle className="h-4 w-4" />;
  }

  if (type === "user_followed") {
    return <UserPlus className="h-4 w-4" />;
  }

  if (type === "report_resolved" || type === "report_rejected") {
    return <Flag className="h-4 w-4" />;
  }

  return <ShieldCheck className="h-4 w-4" />;
}

function getActorName(notification: NotificationWithActor) {
  return (
    notification.actor?.display_name ||
    notification.actor?.username ||
    "云笺用户"
  );
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function NotificationList({
  notifications,
  loading,
  onMarkRead
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="paper-card p-10 text-center text-sm text-dai/55">
        正在加载通知...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="paper-card p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cinnabar-soft text-cinnabar">
          <Bell className="h-6 w-6" />
        </div>

        <p className="mt-5 text-base font-semibold text-ink">暂无通知</p>

        <p className="mt-2 text-sm text-dai/50">
          当有人与你的公开云笺互动时，通知会出现在这里。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => {
        const card = (
          <article
            className={[
              "paper-card p-4 transition sm:p-5",
              notification.is_read
                ? "opacity-75"
                : "border-cinnabar/20 bg-cinnabar-soft/20"
            ].join(" ")}
          >
            <div className="flex items-start gap-4">
              <div
                className={[
                  "grid h-11 w-11 shrink-0 place-items-center rounded-2xl",
                  notification.is_read
                    ? "bg-white/70 text-dai/55"
                    : "bg-cinnabar text-white"
                ].join(" ")}
              >
                {getNotificationIcon(notification.type)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-ink">
                      {notification.title}
                    </h2>

                    <p className="mt-1 text-xs text-dai/45">
                      {getActorName(notification)} ·{" "}
                      {formatDateTime(notification.created_at)}
                    </p>
                  </div>

                  {!notification.is_read && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        void onMarkRead(notification.id);
                      }}
                      className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-full border border-border-soft bg-white/80 px-3 text-xs font-semibold text-dai/55 transition hover:bg-white hover:text-cinnabar"
                    >
                      <Check className="h-3.5 w-3.5" />
                      已读
                    </button>
                  )}
                </div>

                {notification.content && (
                  <p className="mt-3 text-sm leading-7 text-dai/70">
                    {notification.content}
                  </p>
                )}
              </div>
            </div>
          </article>
        );

        if (notification.href) {
          return (
            <Link
              key={notification.id}
              href={notification.href}
              onClick={() => {
                if (!notification.is_read) {
                  void onMarkRead(notification.id);
                }
              }}
              className="block"
            >
              {card}
            </Link>
          );
        }

        return <div key={notification.id}>{card}</div>;
      })}
    </div>
  );
}
