"use client";

import type { Category } from "@/features/transactions/api/get-categories";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Delete01Icon, LockIcon } from "@hugeicons/core-free-icons";
import { DynamicIcon, Icon } from "@mint/ui/components/icon";
import { cn } from "@mint/ui/lib/utils";

type CategoryRowProps = {
  category: Category;
  onDeleteAction: () => void;
};

export function CategoryRow({ category, onDeleteAction }: CategoryRowProps) {
  const isSystem = category.userId === null;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
    disabled: isSystem,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group flex items-center gap-3 transition-opacity", isDragging && "opacity-40")}
    >
      <div
        className={cn(
          "size-10 rounded-2xl bg-muted flex items-center justify-center shrink-0 touch-none",
          !isSystem && "cursor-grab active:cursor-grabbing",
        )}
        {...(!isSystem ? { ...attributes, ...listeners } : {})}
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
}
