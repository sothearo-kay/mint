"use client";

import { useSidebar } from "@mint/ui/components/sidebar";
import { Tray, TrayBody, TrayFooter, TrayHeader, TrayView } from "@mint/ui/components/tray";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { useCallback, useEffect, useState } from "react";
import { SelectAccountView } from "@/components/select-account-view";
import { useSession } from "@/features/auth/api";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useWallets } from "@/features/wallets/api/get-wallets";
import { useTransactionTray } from "@/store/transaction-tray";

type View = "loading" | "select-account" | "form";

export function TransactionTray() {
  const { open: sidebarOpen, isMobile } = useSidebar();
  const { isOpen, close: storeClose } = useTransactionTray();

  const [view, setView] = useState<View>("loading");
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  const { data: session, isPending: isSessionPending } = useSession();
  const { data: Rawwallets = [], isPending: isWalletsPending } = useWallets({ queryConfig: { enabled: !!session } });

  const walletsLoading = !!session && isWalletsPending;
  const wallets = session ? Rawwallets : [];

  useEffect(() => {
    if (!isOpen)
      return;
    if (isSessionPending || walletsLoading) {
      setView("loading");
      return;
    }
    if (!session) {
      setView("form");
      return;
    }
    // Only auto-advance from loading — don't override user navigation
    if (view !== "loading")
      return;
    setView(wallets.length === 0 ? "form" : "select-account");
  }, [isOpen, session, isSessionPending, walletsLoading, wallets.length, view]);

  const close = useCallback(() => {
    storeClose();
    setTimeout(() => {
      setView("loading");
      setSelectedWalletId(null);
    }, 300);
  }, [storeClose]);

  function handleWalletSelect(walletId: string | null) {
    setSelectedWalletId(walletId);
    setView("form");
  }

  const containerStyle = isMobile
    ? undefined
    : { left: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-width-icon)" };

  const viewKey = view === "form" ? `form-${selectedWalletId}` : view;

  const views: Record<View, React.ReactNode> = {
    "loading": <SelectAccountSkeleton />,
    "select-account": <SelectAccountView wallets={wallets} onSelectAction={handleWalletSelect} />,
    "form": (
      <TransactionForm
        defaultWalletId={selectedWalletId}
        defaultCurrency={wallets.find(w => w.id === selectedWalletId)?.currency}
        onCancelAction={close}
        onBackAction={wallets.length > 0 ? () => setView("select-account") : undefined}
        onSuccessAction={close}
      />
    ),
  };

  return (
    <Tray open={isOpen} onClose={close} className="w-full max-w-sm" containerStyle={containerStyle}>
      <TrayView viewKey={viewKey}>
        {views[view]}
      </TrayView>
    </Tray>
  );
}

function SelectAccountSkeleton() {
  return (
    <>
      <TrayHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl shrink-0" />
          <Skeleton className="h-4 w-28 rounded-full" />
        </div>
      </TrayHeader>

      <TrayBody>
        <div className="flex flex-col gap-2">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
              <Skeleton className="size-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-24 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3.5 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </TrayBody>

      <TrayFooter>
        <Skeleton className="h-4 w-40 rounded-full mx-auto" />
      </TrayFooter>
    </>
  );
}
