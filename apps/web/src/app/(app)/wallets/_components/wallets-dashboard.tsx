"use client";

import { Wallet01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { MintCard } from "@/components/card";
import { EmptyState } from "@/components/empty-state";
import { Fab } from "@/components/fab";
import { useSession } from "@/features/auth/api";
import { LoginDialog } from "@/features/auth/components/login-dialog";
import { useWallets } from "@/features/wallets/api/get-wallets";
import { WalletActionTray } from "@/features/wallets/components/wallet-action-tray";
import { WalletBalance, WalletBalanceSkeleton } from "@/features/wallets/components/wallet-balance";
import { WalletList, WalletListSkeleton } from "@/features/wallets/components/wallet-list";
import { useWalletTray } from "@/store/wallet-tray";

export function WalletsDashboard() {
  const { data: session, isPending: isSessionPending } = useSession();
  const { data: rawWallets = [], isPending: isQueryPending } = useWallets({
    queryConfig: { enabled: !!session },
  });

  const isPending = isSessionPending || (!!session && isQueryPending);
  const wallets = session ? rawWallets : [];

  const { mode, wallet: selectedWallet, openCreate, openEdit, openDelete, close } = useWalletTray();

  function closeAction() {
    close();
    setTimeout(() => useWalletTray.setState({ wallet: null }), 300);
  }

  return (
    <div className="flex flex-col gap-1 mb-14">
      {session && <Fab onClickAction={openCreate} />}
      <WalletActionTray wallet={selectedWallet} mode={mode} onCloseAction={closeAction} />

      {!isSessionPending && !session
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
            <>
              {isPending ? <WalletBalanceSkeleton /> : <WalletBalance wallets={wallets} />}

              <MintCard
                title={(
                  <>
                    <Icon icon={Wallet01Icon} className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Wallets</span>
                  </>
                )}
                cardClassName="py-0"
              >
                {isPending
                  ? <WalletListSkeleton />
                  : wallets.length > 0
                    ? (
                        <WalletList
                          wallets={wallets}
                          onEditAction={openEdit}
                          onDeleteAction={openDelete}
                        />
                      )
                    : (
                        <EmptyState
                          icon={Wallet01Icon}
                          title="No wallets yet"
                          description="Tap + to create your first wallet."
                        />
                      )}
              </MintCard>
            </>
          )}
    </div>
  );
}
