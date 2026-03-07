"use client";

import type { Wallet } from "../api/get-wallets";
import { MintPieChart } from "@mint/ui/components/ui/pie-chart";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { formatBalanceAmount } from "@/utils/format";

export function WalletBalance({ wallets }: { wallets: Wallet[] }) {
  const usdWallets = wallets.filter(w => w.currency === "USD");
  const khrWallets = wallets.filter(w => w.currency === "KHR");
  const usd = usdWallets.reduce((sum, w) => sum + Number.parseFloat(w.balance), 0);
  const khr = khrWallets.reduce((sum, w) => sum + Number.parseFloat(w.balance), 0);

  const totalBalance = wallets.reduce((sum, w) => sum + Number.parseFloat(w.balance), 0);
  const chartData = wallets.map(w => ({
    id: w.id,
    name: w.name,
    value: totalBalance > 0 ? Number.parseFloat(w.balance) : 1,
  }));

  return (
    <div className="flex items-center gap-6">
      {wallets.length > 1 && (
        <MintPieChart
          data={chartData}
          showLegend={false}
          showLabels={false}
          hideTooltip={totalBalance === 0}
          className="h-36 w-36 shrink-0"
        />
      )}
      <div className="flex flex-col min-w-0 divide-y divide-dashed divide-muted-foreground/30">
        <div className="flex flex-col gap-1 pb-2">
          <p className="text-xs text-muted-foreground">Available balance</p>
          <p className="text-3xl font-bold tabular-nums tracking-tight">
            {formatBalanceAmount(usd, "USD")}
          </p>
        </div>
        {khrWallets.length > 0 && (
          <p className="text-3xl font-bold tabular-nums tracking-tight pt-2">
            {formatBalanceAmount(khr, "KHR")}
          </p>
        )}
      </div>
    </div>
  );
}

export function WalletBalanceSkeleton() {
  return (
    <div className="flex items-center gap-6">
      <div className="size-36 flex items-center justify-center">
        <Skeleton className="size-28 rounded-full shrink-0" />
      </div>
      <div className="flex flex-col gap-3 min-w-0">
        <p className="text-xs text-muted-foreground">Available balance</p>
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}
