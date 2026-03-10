"use client";

import type { Wallet } from "../api/get-wallets";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Delete01Icon,
  DragDropVerticalIcon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import { buttonVariants } from "@mint/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mint/ui/components/dropdown-menu";
import { Icon } from "@mint/ui/components/icon";
import { cn } from "@mint/ui/lib/utils";
import { formatAmountByCurrency } from "@/utils/format";
import { WALLET_ICONS } from "../utils";

type WalletItemProps = {
  wallet: Wallet;
  color?: string;
  onEditAction: (wallet: Wallet) => void;
  onDeleteAction: (wallet: Wallet) => void;
};

export function WalletItem({ wallet, color, onEditAction, onDeleteAction }: WalletItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: wallet.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const WalletIcon = WALLET_ICONS[wallet.type];
  const iconColor = color ?? "var(--chart-1)";
  const balance = Number.parseFloat(wallet.balance);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 py-3.5 transition-opacity",
        isSortableDragging && "opacity-40",
      )}
    >
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "-ml-2 cursor-grab active:cursor-grabbing text-muted-foreground touch-none shrink-0",
        )}
        {...attributes}
        {...listeners}
      >
        <Icon icon={DragDropVerticalIcon} />
      </button>

      <div
        className="size-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `color-mix(in srgb, ${iconColor} 15%, transparent)` }}
      >
        <Icon icon={WalletIcon} className="size-4.5" style={{ color: iconColor }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate leading-snug">{wallet.name}</p>
        <p className="text-xs text-muted-foreground capitalize mt-0.5">
          {wallet.type}
          {" "}
          <span className="inline-block mx-0.5">{" · "}</span>
          {" "}
          {wallet.currency}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-0 overflow-hidden group-hover:w-7 has-data-popup-open:w-7 [@media(hover:none)]:w-7 transition-all duration-200">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(buttonVariants({ size: "icon-sm", variant: "ghost" }), "shrink-0")}
            >
              <Icon icon={MoreHorizontalIcon} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditAction(wallet)}>
                <Icon icon={PencilEdit02Icon} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDeleteAction(wallet)}>
                <Icon icon={Delete01Icon} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <span className="text-sm font-medium tabular-nums text-foreground">
          {formatAmountByCurrency(balance, wallet.currency)}
        </span>
      </div>
    </div>
  );
}
