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
              className="surface-button inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-dai transition hover:text-cinnabar"
            >
              <ArrowLeft className="h-4 w-4" />
              返回工作台
            </Link>

            <div className="mt-6">
              <p className="text-sm font-semibold text-cinnabar">通知中心</p>

              <h1 className="font-title mt-2 text-3xl font-black text-ink md:text-4xl">
                云笺消息
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-loose text-dai/65">
                这里会收纳点赞、收藏、评论、关注和处理结果，让你在手机和桌面端都能顺手追踪互动。
              </p>
            </div>
          </div>

          <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
            <button
              type="button"
              onClick={() => refresh()}
              disabled={loading}
              className="surface-button inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-dai transition hover:text-cinnabar disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <RefreshCcw className="h-4 w-4" />
              刷新
            </button>

            <button
              type="button"
              onClick={() => markAllRead()}
              disabled={unreadCount === 0}
              className="seal-button h-11 w-full gap-2 px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
                点开消息即可进入对应笔记、评论、作者主页或处理结果。
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
