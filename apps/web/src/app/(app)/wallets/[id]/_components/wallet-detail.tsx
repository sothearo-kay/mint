"use client";

import type { Transaction } from "@/features/transactions/api/get-transactions";
import type { FilterValue } from "@/features/transactions/components/transaction-filters";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { Icon } from "@mint/ui/components/icon";
import { useSidebar } from "@mint/ui/components/sidebar";
import { Tray, TrayView } from "@mint/ui/components/tray";
import { CHART_COLORS } from "@mint/ui/components/ui/pie-chart";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import Link from "next/link";
import { useState } from "react";
import { Fab } from "@/components/fab";
import { useSession } from "@/features/auth/api";
import { useTransactions } from "@/features/transactions/api/get-transactions";
import { TransactionActionTray } from "@/features/transactions/components/transaction-action-tray";
import { DEFAULT_FILTERS, TransactionFilters } from "@/features/transactions/components/transaction-filters";
import { useWalletTransfers } from "@/features/wallets/api/get-wallet-transfers";
import { useWallets } from "@/features/wallets/api/get-wallets";
import { WalletTransferForm } from "@/features/wallets/components/wallet-transfer-form";
import { WALLET_ICONS } from "@/features/wallets/utils";
import { formatBalanceAmount } from "@/utils/format";
import { WalletActivityList } from "./wallet-activity-list";

type WalletDetailProps = {
  walletId: string;
};

export function WalletDetail({ walletId }: WalletDetailProps) {
  const { open: sidebarOpen, isMobile } = useSidebar();

  const [filters, setFilters] = useState<FilterValue>(DEFAULT_FILTERS);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [txActionMode, setTxActionMode] = useState<"edit" | "delete" | null>(null);
  const [transferOpen, setTransferOpen] = useState(false);

  const { data: session, isPending: isSessionPending } = useSession();
  const { data: rawWallets = [], isPending: isWalletsPending } = useWallets({
    queryConfig: { enabled: !!session },
  });

  const wallet = session ? (rawWallets.find(w => w.id === walletId) ?? null) : null;
  const wallets = session ? rawWallets : [];
  const walletIndex = rawWallets.findIndex(w => w.id === walletId);
  const walletColor = walletIndex >= 0 ? CHART_COLORS[walletIndex % CHART_COLORS.length] : "var(--chart-1)";

  const { data: apiTransactions = [], isPending: isTxPending, isPlaceholderData, isError } = useTransactions({
    params: { from: filters.from, to: filters.to, walletId },
    queryConfig: { enabled: !!session },
  });

  const { data: transfers = [], isPending: isTransfersPending } = useWalletTransfers({
    walletId,
    queryConfig: { enabled: !!session && !!wallet },
  });

  const transactions = session ? apiTransactions : [];
  const isPending = isSessionPending || (!!session && isWalletsPending);
  const isActivityPending = isSessionPending || (!!session && (isTxPending || isTransfersPending));


  const containerStyle = isMobile
    ? undefined
    : { left: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-width-icon)" };

  function closeTxAction() {
    setTxActionMode(null);
    setTimeout(() => setSelectedTx(null), 300);
  }

  return (
    <div className="flex flex-col gap-6 mb-10.5">
      {wallet && (
        <>
          <TransactionActionTray transaction={selectedTx} mode={txActionMode} onCloseAction={closeTxAction} />
          <Tray open={transferOpen} onClose={() => setTransferOpen(false)} className="w-full max-w-sm" containerStyle={containerStyle}>
            <TrayView viewKey={`transfer-${walletId}`}>
              <WalletTransferForm
                wallet={wallet}
                wallets={wallets}
                onCancelAction={() => setTransferOpen(false)}
                onSuccessAction={() => setTransferOpen(false)}
              />
            </TrayView>
          </Tray>
          <Fab onClickAction={() => setTransferOpen(true)} />
        </>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          nativeButton={false}
          render={<Link href="/wallets" className="-ml-1.5" />}
        >
          <Icon icon={ArrowLeft01Icon} />
          <span className="sr-only">Back to wallets</span>
        </Button>

        <TransactionFilters
          showType={false}
          isFetching={!!session && isPlaceholderData}
          onChangeAction={setFilters}
        />
      </div>

      <div className="pb-6 border-b border-dashed">
        {isPending
          ? (
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-5 w-32 rounded" />
                  <Skeleton className="h-3.5 w-20 rounded-full" />
                </div>
                <div className="space-y-1.5 text-right">
                  <Skeleton className="h-6 w-24 rounded ml-auto" />
                  <Skeleton className="h-3 w-14 rounded-full ml-auto" />
                </div>
              </div>
            )
          : !wallet
              ? (
                  <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <p className="text-sm text-muted-foreground">Wallet not found</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      nativeButton={false}
                      render={<Link href="/wallets" />}
                    >
                      <Icon icon={ArrowLeft01Icon} />
                      Back to wallets
                    </Button>
                  </div>
                )
              : (
                  <div className="flex items-center gap-3">
                    <div
                      className="size-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `color-mix(in srgb, ${walletColor} 20%, transparent)` }}
                    >
                      <Icon icon={WALLET_ICONS[wallet.type]} className="size-5" style={{ color: walletColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold truncate leading-snug">{wallet.name}</p>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">
                        {wallet.type}
                        <span className="inline-block mx-1.5">·</span>
                        {wallet.currency}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold tabular-nums tracking-tight">
                        {formatBalanceAmount(Number.parseFloat(wallet.balance), wallet.currency)}
                      </p>
                      <p className="text-xs text-muted-foreground">Balance</p>
                    </div>
                  </div>
                )}
      </div>

      {!isPending && wallet && (
        <WalletActivityList
          walletId={walletId}
          transactions={transactions}
          transfers={transfers}
          isPending={isActivityPending}
          isError={isError}
          from={filters.from}
          onEditAction={(tx) => {
            setSelectedTx(tx);
            setTxActionMode("edit");
          }}
          onDeleteAction={(tx) => {
            setSelectedTx(tx);
            setTxActionMode("delete");
          }}
        />
      )}
    </div>
  );
}
