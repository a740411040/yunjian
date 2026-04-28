"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { AppLogo } from "@/components/common/AppLogo";
import { createClient } from "@/lib/supabase/browser";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isLogin = mode === "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          throw error;
        }

        toast.success("欢迎回来，云笺已为你展开。");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              typeof window !== "undefined"
                ? `${window.location.origin}/workspace`
                : undefined
          }
        });

        if (error) {
          throw error;
        }

        toast.success("注册成功。如开启邮箱确认，请先前往邮箱完成验证。");
      }

      router.push("/workspace");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "操作失败，请稍后重试。";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden p-5">
      <div className="absolute left-[-12rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-cinnabar/10 blur-3xl" />
      <div className="absolute bottom-[-14rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-shiqing/20 blur-3xl" />

      <motion.section
        className="glass-card relative w-full max-w-md rounded-[32px] p-7 md:p-9"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Link href="/" className="inline-flex">
          <AppLogo />
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium text-cinnabar">
            {isLogin ? "登录" : "注册"}
          </p>
          <h1 className="font-title mt-2 text-4xl font-black text-ink">
            {isLogin ? "归来展笺" : "初启云笺"}
          </h1>
          <p className="mt-3 text-sm leading-loose text-dai/70">
            {isLogin
              ? "一处云端书案，继续安放你的灵感与摘录。"
              : "用邮箱创建账号，开始你的新中式云端笔记空间。"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-dai">邮箱</span>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-2xl border border-border-soft bg-white/72 px-4 text-sm outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-dai">密码</span>
            <input
              required
              type="password"
              minLength={6}
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="至少 6 位"
              className="h-12 w-full rounded-2xl border border-border-soft bg-white/72 px-4 text-sm outline-none transition focus:border-cinnabar/50 focus:ring-4 focus:ring-cinnabar/10"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="seal-button h-12 w-full text-sm font-semibold"
          >
            {submitting
              ? "请稍候..."
              : isLogin
                ? "登录云笺"
                : "注册账号"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-dai/70">
          {isLogin ? "还没有账号？" : "已有账号？"}
          <Link
            href={isLogin ? "/auth/register" : "/auth/login"}
            className="ml-1 font-semibold text-cinnabar hover:text-cinnabar-dark"
          >
            {isLogin ? "立即注册" : "返回登录"}
          </Link>
        </p>
      </motion.section>
    </main>
  );
}
