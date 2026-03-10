"use client";

import type { Wallet } from "@/features/wallets/api/get-wallets";
import { Wallet01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { TrayBody, TrayFooter, TrayHeader, TrayTitle } from "@mint/ui/components/tray";
import { CHART_COLORS } from "@mint/ui/components/ui/pie-chart";
import { WALLET_ICONS } from "@/features/wallets/utils";
import { formatAmountByCurrency } from "@/utils/format";

type SelectAccountViewProps = {
  wallets: Wallet[];
  onSelectAction: (walletId: string | null) => void;
};

export function SelectAccountView({ wallets, onSelectAction }: SelectAccountViewProps) {
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

      <TrayBody>
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
      </TrayBody>

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
