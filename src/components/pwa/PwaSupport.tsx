"use client";

import { Download, Share2, Smartphone, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const DISMISS_KEY = "yun_jian_pwa_dismissed_v2";

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

function isIosSafari() {
  if (typeof window === "undefined") {
    return false;
  }

  const userAgent = window.navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/i.test(userAgent);
  const isSafari =
    /Safari/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS/i.test(userAgent);

  return isIos && isSafari;
}

function isMobileBrowser() {
  if (typeof window === "undefined") {
    return false;
  }

  return /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent);
}

function isSecureInstallContext() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.isSecureContext;
}

export function PwaSupport() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [readyToSuggest, setReadyToSuggest] = useState(false);

  useEffect(() => {
    setInstalled(isStandaloneMode());
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");

    const timer = window.setTimeout(() => {
      setReadyToSuggest(true);
      if (window.localStorage.getItem(DISMISS_KEY) !== "1") {
        setPanelOpen(true);
      }
    }, 2200);

    if ("serviceWorker" in navigator && window.isSecureContext) {
      void navigator.serviceWorker.register("/sw.js");
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setInstalled(false);
      setReadyToSuggest(true);

      if (window.localStorage.getItem(DISMISS_KEY) !== "1") {
        setPanelOpen(true);
      }
    }

    function handleInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
      setPanelOpen(false);
      window.localStorage.removeItem(DISMISS_KEY);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const installMode = useMemo(() => {
    if (installed || !readyToSuggest) {
      return null;
    }

    if (deferredPrompt) {
      return "prompt";
    }

    if (isIosSafari()) {
      return "ios-help";
    }

    if (!isSecureInstallContext()) {
      return "secure-context-required";
    }

    return "manual-help";
  }, [deferredPrompt, installed, readyToSuggest]);

  if (installed || !installMode) {
    return null;
  }

  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setInstalled(true);
      setDeferredPrompt(null);
      setPanelOpen(false);
      return;
    }

    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setDismissed(true);
    setPanelOpen(false);
    window.localStorage.setItem(DISMISS_KEY, "1");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setPanelOpen((open) => !open);
          setDismissed(false);
        }}
        className="bottom-safe fixed left-3 z-[57] inline-flex h-11 items-center gap-2 rounded-full border border-cinnabar/20 bg-white/82 px-4 text-sm font-semibold text-cinnabar shadow-soft backdrop-blur sm:left-4"
      >
        <Smartphone className="h-4 w-4" />
        安装 App
      </button>

      {panelOpen && !dismissed && (
        <section className="glass-card fixed inset-x-3 bottom-[8.75rem] z-[58] rounded-[26px] p-4 shadow-soft sm:bottom-safe sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-[340px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-cinnabar">
                安装应用
              </p>
              <h2 className="font-title mt-1 text-xl font-black text-ink">
                把云笺放到主屏幕
              </h2>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="surface-button grid h-9 w-9 shrink-0 place-items-center rounded-full text-dai/60 transition hover:text-cinnabar"
              aria-label="关闭安装提示"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {installMode === "prompt" && (
            <>
              <p className="mt-3 text-sm leading-loose text-dai/66">
                当前浏览器已允许安装，你现在就可以把云笺加入主屏幕，像独立 app 一样打开。
              </p>

              <button
                type="button"
                onClick={() => void handleInstall()}
                className="seal-button mt-4 h-11 w-full gap-2 text-sm font-semibold"
              >
                <Download className="h-4 w-4" />
                立即安装
              </button>
            </>
          )}

          {installMode === "ios-help" && (
            <p className="mt-3 text-sm leading-loose text-dai/66">
              在 Safari 中点一下
              <span className="mx-1 inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold text-dai">
                <Share2 className="h-3 w-3" />
                分享
              </span>
              ，再选择“添加到主屏幕”，就能像 app 一样使用云笺。
            </p>
          )}

          {installMode === "secure-context-required" && (
            <p className="mt-3 text-sm leading-loose text-dai/66">
              当前地址不是安全上下文，所以手机浏览器不会弹出安装框。
              如果你现在访问的是
              <span className="mx-1 rounded bg-white/72 px-1.5 py-0.5 text-xs font-semibold text-dai">
                http://局域网IP:3000
              </span>
              ，请改用 HTTPS 域名访问，或在正式部署后再安装。
            </p>
          )}

          {installMode === "manual-help" && (
            <p className="mt-3 text-sm leading-loose text-dai/66">
              {isMobileBrowser()
                ? "如果浏览器暂时没有自动弹出安装框，可以在浏览器菜单里寻找“安装应用”或“添加到主屏幕”。"
                : "如果浏览器暂时没有自动弹出安装框，可以查看地址栏右侧或浏览器菜单中的“安装应用”。"}
            </p>
          )}
        </section>
      )}
    </>
  );
}
