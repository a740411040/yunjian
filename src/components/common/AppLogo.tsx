import Image from "next/image";

type AppLogoProps = {
  compact?: boolean;
};

export function AppLogo({ compact = false }: AppLogoProps) {
  return (
    <div className="inline-flex items-center gap-3">
      <Image
        src="/logo.svg"
        width={compact ? 36 : 44}
        height={compact ? 36 : 44}
        alt="云笺 Logo"
        className="rounded-2xl"
      />
      {!compact && (
        <div>
          <div className="font-title text-xl font-black leading-none text-ink">
            云笺
          </div>
          <div className="mt-1 text-[11px] font-medium tracking-[0.22em] text-dai/55">
            YUN JIAN
          </div>
        </div>
      )}
    </div>
  );
}
