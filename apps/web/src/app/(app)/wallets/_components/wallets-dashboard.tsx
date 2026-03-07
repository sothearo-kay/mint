"use client";

import type { Wallet } from "@/features/wallets/api/get-wallets";
import { Wallet01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InsightCard } from "@/app/(app)/insights/_components/insight-card";
import { EmptyState } from "@/components/empty-state";
import { Fab } from "@/components/fab";
import { useSession } from "@/features/auth/api";
import { LoginDialog } from "@/features/auth/components/login-dialog";
import { useWallets } from "@/features/wallets/api/get-wallets";
import { WalletActionTray } from "@/features/wallets/components/wallet-action-tray";
import { WalletBalance, WalletBalanceSkeleton } from "@/features/wallets/components/wallet-balance";
import { WalletList, WalletListSkeleton } from "@/features/wallets/components/wallet-list";

type WalletMode = "create" | "edit" | "delete";

export function WalletsDashboard() {
  const { data: session } = useSession();
  const { data: rawWallets = [], isPending: isQueryPending } = useWallets({
    queryConfig: { enabled: !!session },
  });

  const isPending = !!session && isQueryPending;
  const wallets = session ? rawWallets : [];

  const searchParams = useSearchParams();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [mode, setMode] = useState<WalletMode | null>(null);

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setMode("create");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [searchParams]);

  function openCreate() {
    setSelectedWallet(null);
    setMode("create");
  }

  function openEdit(wallet: Wallet) {
    setSelectedWallet(wallet);
    setMode("edit");
  }

  function openDelete(wallet: Wallet) {
    setSelectedWallet(wallet);
    setMode("delete");
  }

  function closeAction() {
    setMode(null);
    setTimeout(() => setSelectedWallet(null), 300);
  }

  return (
    <div className="flex flex-col gap-4 mb-14">
      {session && <Fab onClickAction={openCreate} />}
      <WalletActionTray wallet={selectedWallet} mode={mode} onCloseAction={closeAction} />

      {isPending
        ? (
            <>
              <WalletBalanceSkeleton />
              <InsightCard
                title={(
                  <>
                    <Icon icon={Wallet01Icon} className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Wallets</span>
                  </>
                )}
                cardClassName="py-0"
              >
                <WalletListSkeleton />
              </InsightCard>
            </>
          )
        : wallets.length > 0
          ? (
              <>
                <WalletBalance wallets={wallets} />

                <InsightCard
                  title={(
                    <>
                      <Icon icon={Wallet01Icon} className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Wallets</span>
                    </>
                  )}
                  cardClassName="py-0"
                >
                  <WalletList
                    wallets={wallets}
                    onEditAction={openEdit}
                    onDeleteAction={openDelete}
                  />
                </InsightCard>
              </>
            )
          : !session
              ? (
                  <EmptyState
                    icon={Wallet01Icon}
                    title="Sign in to manage wallets"
                    description="Create an account to track your wallets and balances."
                  >
                    <LoginDialog triggerProps={{ size: "sm", className: "rounded-full mt-1" }} />
                  </EmptyState>
                )
              : (
                  <EmptyState
                    icon={Wallet01Icon}
                    title="No wallets yet"
                    description="Tap + to create your first wallet."
                  />
                )}
    </div>
  );
}
