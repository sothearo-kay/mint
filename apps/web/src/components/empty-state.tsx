import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@mint/ui/components/icon";

type EmptyStateProps = {
  icon: IconSvgElement;
  title: string;
  description: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="size-14 rounded-3xl bg-muted flex items-center justify-center mb-4">
        <Icon icon={icon} className="size-7 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
