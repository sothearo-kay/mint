"use client";

import type { Wallet } from "../api/get-wallets";
import { CHART_COLORS } from "@mint/ui/components/ui/pie-chart";
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
  const sorted = [...wallets].sort((a, b) => toUSD(Number.parseFloat(b.balance), b.currency) - toUSD(Number.parseFloat(a.balance), a.currency));
  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);

  const topData = top.map((w) => {
    const balance = Number.parseFloat(w.balance);
    return {
      id: w.id,
      name: w.name,
      value: totalUSD > 0 ? toUSD(balance, w.currency) : 1,
      label: formatBalanceAmount(balance, w.currency),
    };
  });

  const othersUSD = rest.reduce((s, w) => s + toUSD(Number.parseFloat(w.balance), w.currency), 0);
  const chartData = rest.length > 0
    ? [...topData, { id: "others", name: "Others", value: totalUSD > 0 ? othersUSD : 1, label: formatBalanceAmount(othersUSD, "USD") }]
    : topData;

  const labelMap = Object.fromEntries(chartData.map(d => [d.name, [d.label]]));

  const hasBalance = totalUSD > 0;
  const items = [formatBalanceAmount(usd, "USD"), formatBalanceAmount(khr, "KHR")];
  const finalChartData = hasBalance ? chartData : [{ id: "empty", name: "", value: 1 }];
  const chartColors = hasBalance
    ? [...CHART_COLORS.slice(0, top.length), ...(rest.length > 0 ? ["var(--muted-foreground)"] : [])]
    : ["var(--border)"];

  return (
    <BalanceDisplay
      label="Available balance"
      items={items}
      chartData={finalChartData}
      chartColors={chartColors}
      hideTooltip={!hasBalance}
      tooltipContent={<PieTooltip labelMap={labelMap} />}
    />
  );
}

export function WalletBalanceSkeleton() {
  return <BalanceDisplaySkeleton label="Available balance" />;
}
