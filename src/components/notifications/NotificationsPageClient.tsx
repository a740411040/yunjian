// src/components/notifications/NotificationsPageClient.tsx

"use client";

import Link from "next/link";
import { ArrowLeft, Bell, CheckCheck, RefreshCcw } from "lucide-react";
import { NotificationList } from "@/components/notifications/NotificationList";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationsPageClient() {
  const {
    notifications,
    unreadCount,
    loading,
    refresh,
    markRead,
    markAllRead
  } = useNotifications();

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="page-shell space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Link
              href="/workspace"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border-soft bg-white/70 px-4 text-sm font-semibold text-dai transition hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
              返回工作台
            </Link>

            <div className="mt-6">
              <p className="text-sm font-semibold text-cinnabar">通知中心</p>

              <h1 className="font-title mt-2 text-4xl font-black text-ink">
                云笺消息
              </h1>

              <p className="mt-3 text-sm leading-loose text-dai/65">
                查看点赞、收藏、评论和举报处理结果。
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => refresh()}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border-soft bg-white/70 px-5 text-sm font-semibold text-dai transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw className="h-4 w-4" />
              刷新
            </button>

            <button
              type="button"
              onClick={() => markAllRead()}
              disabled={unreadCount === 0}
              className="seal-button h-11 gap-2 px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCheck className="h-4 w-4" />
              全部已读
            </button>
          </div>
        </div>

        <section className="paper-card p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cinnabar-soft text-cinnabar">
              <Bell className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-ink">
                未读通知：{unreadCount}
              </p>

              <p className="mt-1 text-xs text-dai/50">
                点击通知可进入对应笔记、评论或处理结果。
              </p>
            </div>
          </div>
        </section>

        <NotificationList
          notifications={notifications}
          loading={loading}
          onMarkRead={markRead}
        />
      </div>
    </main>
  );
}