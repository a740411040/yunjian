import { Feather } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <section className="paper-card grid min-h-[420px] place-items-center p-10 text-center">
      <div className="max-w-md">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cinnabar-soft text-cinnabar">
          <Feather className="h-7 w-7" />
        </div>
        <h2 className="font-title mt-6 text-3xl font-black text-ink">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-loose text-dai/70">{description}</p>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="seal-button mt-7 h-11 px-6 text-sm font-semibold"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </section>
  );
}
