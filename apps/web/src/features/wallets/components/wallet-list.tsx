"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import type { Wallet } from "../api/get-wallets";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CHART_COLORS } from "@mint/ui/components/ui/pie-chart";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useReorderWallets } from "../api/reorder-wallets";
import { WalletItem } from "./wallet-item";

type WalletListProps = {
  wallets: Wallet[];
  onEditAction: (wallet: Wallet) => void;
  onDeleteAction: (wallet: Wallet) => void;
};

export function WalletList({ wallets, onEditAction, onDeleteAction }: WalletListProps) {
  const [items, setItems] = useState(wallets);
  const { mutate: reorder } = useReorderWallets();

  useEffect(() => {
    setItems(wallets);
  }, [wallets]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id)
      return;

    const oldIndex = items.findIndex(w => w.id === active.id);
    const newIndex = items.findIndex(w => w.id === over.id);
    if (oldIndex === -1 || newIndex === -1)
      return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);
    reorder(reordered.map((w, i) => ({ id: w.id, position: i })));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(w => w.id)} strategy={verticalListSortingStrategy}>
        <div className="relative">
          {/* Static divider layer — not affected by drag transforms */}
          <div className="absolute inset-0 pointer-events-none">
            {items.slice(1).map((_, i) => (
              <div
                key={i}
                className="absolute left-8 right-0 border-t border-dashed border-border"
                style={{ top: (i + 1) * 65.25 }}
              />
            ))}
          </div>

          <div className="flex flex-col">
            {items.map((wallet, i) => (
              <WalletItem
                key={wallet.id}
                wallet={wallet}
                color={CHART_COLORS[i % CHART_COLORS.length]}
                onEditAction={onEditAction}
                onDeleteAction={onDeleteAction}
              />
            ))}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}

export function WalletListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3.5">
          <Skeleton className="-ml-2 size-7 rounded-lg shrink-0" />
          <Skeleton className="-ml-1 size-9 rounded-xl shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          <Skeleton className="h-3.5 w-14 rounded" />
        </div>
      ))}
    </div>
  );
}
