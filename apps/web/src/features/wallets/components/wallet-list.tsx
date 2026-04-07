"use client";

import type { Wallet } from "../api/get-wallets";
import { CHART_COLORS } from "@mint/ui/components/ui/pie-chart";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { Reorder } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Stable color map — only updates after server sync, not during drag
  const colorMap = useMemo(
    () => new Map(wallets.map((w, i) => [w.id, CHART_COLORS[i % CHART_COLORS.length]])),
    [wallets],
  );

  useEffect(() => {
    setItems(wallets);
  }, [wallets]);

  function handleDragEnd() {
    reorder(itemsRef.current.map((w, i) => ({ id: w.id, position: i })));
  }

  return (
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

      <Reorder.Group as="div" axis="y" values={items} onReorder={setItems} className="flex flex-col">
        {items.map(wallet => (
          <WalletItem
            key={wallet.id}
            wallet={wallet}
            color={colorMap.get(wallet.id)}
            onEditAction={onEditAction}
            onDeleteAction={onDeleteAction}
            onDragEndAction={handleDragEnd}
          />
        ))}
      </Reorder.Group>
    </div>
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
