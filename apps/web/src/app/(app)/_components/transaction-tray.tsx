"use client";

import type { Wallet } from "@/features/wallets/api/get-wallets";
import { Wallet01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { useSidebar } from "@mint/ui/components/sidebar";
import { Tray, TrayFooter, TrayHeader, TrayTitle, TrayView } from "@mint/ui/components/tray";
import { CHART_COLORS } from "@mint/ui/components/ui/pie-chart";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/features/auth/api";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useWallets } from "@/features/wallets/api/get-wallets";
import { WALLET_ICONS } from "@/features/wallets/utils";
import { formatAmountByCurrency } from "@/utils/format";

function SelectAccountView({ wallets, onSelectAction }: {
  wallets: Wallet[];
  onSelectAction: (walletId: string | null) => void;
}) {
  return (
    <>
      <TrayHeader>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-muted">
            <Icon icon={Wallet01Icon} className="size-5 text-muted-foreground" />
          </div>
          <TrayTitle className="font-semibold">Select account</TrayTitle>
        </div>
      </TrayHeader>

      <div className="flex flex-col gap-2">
        {wallets.map((wallet, i) => {
          const WalletIcon = WALLET_ICONS[wallet.type];
          const color = CHART_COLORS[i % CHART_COLORS.length];
          const balance = Number.parseFloat(wallet.balance);
          return (
            <button
              key={wallet.id}
              type="button"
              onClick={() => onSelectAction(wallet.id)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors text-left w-full"
            >
              <div
                className="size-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
              >
                <Icon icon={WalletIcon} className="size-5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{wallet.name}</p>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {wallet.type}
                  {" "}
                  <span className="inline-block mx-0.5">{" · "}</span>
                  {" "}
                  {wallet.currency}
                </p>
              </div>
              <span className="text-sm font-medium tabular-nums text-foreground shrink-0">
                {formatAmountByCurrency(balance, wallet.currency)}
              </span>
            </button>
          );
        })}
      </div>

      <TrayFooter>
        <button
          type="button"
          className="w-full text-sm text-muted-foreground font-medium hover:text-foreground transition-colors py-1"
          onClick={() => onSelectAction(null)}
        >
          Continue without account
        </button>
      </TrayFooter>
    </>
  );
}

export function TransactionTray() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { open: sidebarOpen, isMobile } = useSidebar();

  const [step, setStep] = useState<"select-account" | "form">("select-account");
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  const { data: session } = useSession();
  const { data: wallets = [], isPending: walletsLoading } = useWallets({ queryConfig: { enabled: !!session } });

  const isOpen = searchParams.get("new") === "true";

  // Once wallets are loaded and tray is open, skip to form if user has no wallets
  useEffect(() => {
    if (isOpen && !!session && !walletsLoading && wallets.length === 0) {
      setStep("form");
    }
  }, [isOpen, session, walletsLoading, wallets.length]);

  const close = useCallback(() => {
    router.replace(pathname as Route);
    setTimeout(() => {
      setStep("select-account");
      setSelectedWalletId(null);
    }, 300);
  }, [router, pathname]);

  function handleWalletSelect(walletId: string | null) {
    setSelectedWalletId(walletId);
    setStep("form");
  }

  const containerStyle = isMobile
    ? undefined
    : { left: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-width-icon)" };

  const showSelectAccount = !!session && wallets.length > 0 && step === "select-account";

  return (
    <Tray
      open={isOpen}
      onClose={close}
      className="w-full max-w-sm"
      containerStyle={containerStyle}
    >
      <TrayView viewKey={showSelectAccount ? "select-account" : `form-${selectedWalletId}`}>
        {showSelectAccount
          ? (
              <SelectAccountView wallets={wallets} onSelectAction={handleWalletSelect} />
            )
          : (
              <TransactionForm
                defaultWalletId={selectedWalletId}
                defaultCurrency={wallets.find(w => w.id === selectedWalletId)?.currency}
                onCancelAction={close}
                onBackAction={wallets.length > 0 ? () => setStep("select-account") : undefined}
                onSuccessAction={close}
              />
            )}
      </TrayView>
    </Tray>
  );
}
