"use client";

import type { Category } from "@/features/transactions/api/get-categories";
import { Delete01Icon, LockIcon } from "@hugeicons/core-free-icons";
import { DynamicIcon, Icon } from "@mint/ui/components/icon";
import { cn } from "@mint/ui/lib/utils";
import { Reorder, useDragControls } from "motion/react";
import { useState } from "react";

type CategoryRowProps = {
  category: Category;
  onDeleteAction: () => void;
  onDragEndAction?: () => void;
};

export function CategoryRow({ category, onDeleteAction, onDragEndAction }: CategoryRowProps) {
  const isSystem = category.userId === null;
  const controls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  const inner = (
    <div className={cn("group flex items-center gap-3", isDragging && "opacity-40")}>
      <div
        className={cn(
          "size-10 rounded-2xl bg-muted flex items-center justify-center shrink-0 touch-none",
          !isSystem && "cursor-grab active:cursor-grabbing",
        )}
        onPointerDown={!isSystem ? e => controls.start(e) : undefined}
      >
        <DynamicIcon name={category.icon} className="size-5 text-muted-foreground" />
      </div>
      <p className="flex-1 text-sm font-medium">{category.name}</p>
      {isSystem
        ? (
            <Icon icon={LockIcon} className="size-4 text-muted-foreground/40" />
          )
        : (
            <button
              type="button"
              onClick={onDeleteAction}
              className="opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Icon icon={Delete01Icon} className="size-4" />
            </button>
          )}
    </div>
  );

  if (isSystem) {
    return inner;
  }

  return (
    <Reorder.Item
      as="div"
      value={category}
      dragListener={false}
      dragControls={controls}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        setIsDragging(false);
        onDragEndAction?.();
      }}
      transition={{ type: "spring", stiffness: 600, damping: 40 }}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 40 }}
    >
      {inner}
    </Reorder.Item>
  );
}
