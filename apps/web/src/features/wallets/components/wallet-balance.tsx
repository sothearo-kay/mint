"use client";

import type { Wallet } from "../api/get-wallets";
import { BalanceDisplay, BalanceDisplaySkeleton } from "@/components/balance-display";
import { PieTooltip } from "@/components/pie-tooltip";
import { formatBalanceAmount } from "@/utils/format";
import { toUSD } from "@/utils/transactions";

export function WalletBalance({ wallets }: { wallets: Wallet[] }) {
  const usdWallets = wallets.filter(w => w.currency === "USD");
  const khrWallets = wallets.filter(w => w.currency === "KHR");
  const usd = usdWallets.reduce((sum, w) => sum + Number.parseFloat(w.balance), 0);
  const khr = khrWallets.reduce((sum, w) => sum + Number.parseFloat(w.balance), 0);

  const totalUSD = wallets.reduce((s, w) => s + toUSD(Number.parseFloat(w.balance), w.currency), 0);
  const chartData = wallets.map((w) => {
    const balance = Number.parseFloat(w.balance);
    return {
      id: w.id,
      name: w.name,
      value: totalUSD > 0 ? toUSD(balance, w.currency) : 1,
      label: formatBalanceAmount(balance, w.currency),
    };
  });

  const labelMap = Object.fromEntries(chartData.map(d => [d.name, [d.label]]));

  const items = khrWallets.length > 0
    ? [formatBalanceAmount(usd, "USD"), formatBalanceAmount(khr, "KHR")]
    : [formatBalanceAmount(usd, "USD")];

  return (
    <BalanceDisplay
      label="Available balance"
      items={items}
      chartData={chartData}
      chartColors={totalUSD > 0 ? undefined : ["var(--border)"]}
      hideTooltip={totalUSD === 0}
      tooltipContent={<PieTooltip labelMap={labelMap} />}
      showChart={wallets.length > 1}
    />
  );
}

export function WalletBalanceSkeleton() {
  return <BalanceDisplaySkeleton label="Available balance" />;
}
