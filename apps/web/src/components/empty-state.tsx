import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@mint/ui/components/icon";
import * as React from "react";

type EmptyStateProps = {
  icon?: IconSvgElement;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      {icon && (
        <div className="size-14 rounded-3xl bg-muted flex items-center justify-center mb-4">
          <Icon icon={icon} className="size-7 text-muted-foreground" />
        </div>
      )}
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
