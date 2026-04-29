"use client";

import { usePathname } from "next/navigation";
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  useEffect,
  useState
} from "react";
import {
  getPoeticCopyPool,
  pickPoeticCopy,
  type PoeticCopyKey
} from "@/lib/poetic-copy";

const SESSION_SEED_KEY = "yun-jian-poetic-seed";

type PoeticCopyProps<T extends ElementType> = {
  as?: T;
  copyKey: PoeticCopyKey;
  className?: string;
  fallback?: string;
};

export function PoeticCopy<T extends ElementType = "p">({
  as,
  copyKey,
  className,
  fallback
}: PoeticCopyProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof PoeticCopyProps<T>>) {
  const pathname = usePathname();
  const pool = getPoeticCopyPool(copyKey);
  const [line, setLine] = useState(fallback ?? pool[0] ?? "");

  useEffect(() => {
    const storedSeed =
      window.sessionStorage.getItem(SESSION_SEED_KEY) ??
      `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    window.sessionStorage.setItem(SESSION_SEED_KEY, storedSeed);
    setLine(pickPoeticCopy(copyKey, `${storedSeed}:${pathname}`));
  }, [copyKey, pathname]);

  const Component = (as ?? "p") as ElementType;

  return <Component className={className}>{line}</Component>;
}
