"use client";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { Icon } from "@mint/ui/components/icon";

type FabProps = {
  onClickAction: () => void;
};

export function Fab({ onClickAction }: FabProps) {
  return (
    <Button
      variant="raise-default"
      size="icon"
      onClick={onClickAction}
      className="absolute bottom-6 right-4 z-10 size-10 rounded-full"
    >
      <Icon icon={Add01Icon} className="size-5" />
    </Button>
  );
}
