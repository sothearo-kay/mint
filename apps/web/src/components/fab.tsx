"use client";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { Icon } from "@mint/ui/components/icon";
import { useSidebar } from "@mint/ui/components/sidebar";

type FabProps = {
  onClickAction: () => void;
};

export function Fab({ onClickAction }: FabProps) {
  const { open: sidebarOpen, isMobile } = useSidebar();

  const sidebarWidth = isMobile ? "0px" : sidebarOpen ? "var(--sidebar-width)" : "0px";
  const right = `max(1rem, calc((100dvw - ${sidebarWidth} - 48rem) / 2 + 1rem))`;

  return (
    <Button
      variant="raise-default"
      size="icon"
      onClick={onClickAction}
      className="fixed bottom-6 z-10 size-10 rounded-full"
      style={{ right }}
    >
      <Icon icon={Add01Icon} className="size-5" />
    </Button>
  );
}
