import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SealButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function SealButton({ children, className, ...props }: SealButtonProps) {
  return (
    <button className={cn("seal-button h-11 px-5 text-sm font-semibold", className)} {...props}>
      {children}
    </button>
  );
}
