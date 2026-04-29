"use client";

import { MoonStar, Palette, SunMedium } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siteThemeOptions } from "@/lib/site-theme";
import { cn } from "@/lib/utils";
import { useThemeMode } from "./ThemeProvider";

const AUTO_MINIMIZE_MS = 5000;

const themeIconMap = {
  day: SunMedium,
  "night-dark": MoonStar,
  "night-light": Palette
} as const;

export function ThemeDock() {
  const { mode, setMode } = useThemeMode();
  const [collapsed, setCollapsed] = useState(false);
  const timerRef = useRef<number | null>(null);

  function clearCollapseTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function scheduleCollapse() {
    clearCollapseTimer();
    timerRef.current = window.setTimeout(() => {
      setCollapsed(true);
    }, AUTO_MINIMIZE_MS);
  }

  function expandDock() {
    setCollapsed(false);
    scheduleCollapse();
  }

  useEffect(() => {
    scheduleCollapse();

    return () => {
      clearCollapseTimer();
    };
  }, []);

  if (collapsed) {
    return (
      <div className="bottom-safe fixed right-3 z-[60] sm:right-4">
        <div className="glass-card flex items-center gap-2 rounded-full px-2 py-2 shadow-soft">
          {siteThemeOptions.map((option) => {
            const Icon = themeIconMap[option.id];
            const active = mode === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  if (active) {
                    expandDock();
                    return;
                  }

                  setMode(option.id);
                  scheduleCollapse();
                }}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full transition active:scale-[0.97]",
                  active
                    ? "bg-cinnabar text-white shadow-seal"
                    : "theme-segment text-dai/70 hover:text-cinnabar"
                )}
                aria-label={`切换到${option.label}`}
                title={active ? `展开${option.label}主题面板` : `切换到${option.label}`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bottom-safe fixed inset-x-3 z-[60] sm:inset-x-auto sm:right-4 sm:max-w-[420px]">
      <section
        className="glass-card rounded-[28px] px-3 py-3 shadow-soft"
        onPointerDown={expandDock}
        onPointerMove={scheduleCollapse}
        onFocus={expandDock}
        onMouseEnter={expandDock}
      >
        <div className="mb-2 flex items-center gap-2 px-2">
          {mode === "day" ? (
            <SunMedium className="h-4 w-4 text-cinnabar" />
          ) : mode === "night-dark" ? (
            <MoonStar className="h-4 w-4 text-cinnabar" />
          ) : (
            <Palette className="h-4 w-4 text-cinnabar" />
          )}
          <p className="text-xs font-semibold tracking-[0.18em] text-dai/65">
            光影模式
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:flex">
          {siteThemeOptions.map((option) => {
            const Icon = themeIconMap[option.id];

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setMode(option.id);
                  expandDock();
                }}
                className={cn(
                  "theme-segment rounded-2xl px-3 py-2 text-left transition active:scale-[0.99] sm:min-w-[92px]",
                  mode === option.id && "theme-segment-active"
                )}
                aria-pressed={mode === option.id}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <p className="text-sm font-semibold">{option.label}</p>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed opacity-80">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
