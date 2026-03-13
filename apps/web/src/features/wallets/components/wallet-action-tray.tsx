"use client";

import type { Wallet } from "../api/get-wallets";
import { Delete01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { Icon } from "@mint/ui/components/icon";
import { useSidebar } from "@mint/ui/components/sidebar";
import { toast } from "@mint/ui/components/sonner";
import { Tray, TrayBody, TrayDescription, TrayFooter, TrayHeader, TrayTitle, TrayView } from "@mint/ui/components/tray";
import { formatBalanceAmount } from "@/utils/format";
import { useDeleteWallet } from "../api/delete-wallet";
import { WalletForm } from "./wallet-form";

type Mode = "create" | "edit" | "delete";

type WalletActionTrayProps = {
  wallet: Wallet | null;
  mode: Mode | null;
  onCloseAction: () => void;
};

export function WalletActionTray({ wallet, mode, onCloseAction }: WalletActionTrayProps) {
  const { open: sidebarOpen, isMobile } = useSidebar();

  const containerStyle = isMobile
    ? undefined
    : { left: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-width-icon)" };

  const isOpen = mode === "create" || (!!wallet && (mode === "edit" || mode === "delete"));

  const views: Record<Mode, React.ReactNode> = {
    create: <WalletForm onCancelAction={onCloseAction} onSuccessAction={onCloseAction} />,
    edit: wallet ? <WalletForm wallet={wallet} onCancelAction={onCloseAction} onSuccessAction={onCloseAction} /> : null,
    delete: wallet ? <DeleteView wallet={wallet} onCloseAction={onCloseAction} /> : null,
  };

  return (
    <Tray open={isOpen} onClose={onCloseAction} className="w-full max-w-sm" containerStyle={containerStyle}>
      <TrayView viewKey={`${mode}-${wallet?.id ?? "new"}`}>
        {mode ? views[mode] : null}
      </TrayView>
    </Tray>
  );
}

function DeleteView({ wallet, onCloseAction }: { wallet: Wallet; onCloseAction: () => void }) {
  const { mutate, isPending } = useDeleteWallet({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Wallet deleted");
        onCloseAction();
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    },
  });

  return (
    <>
      <TrayHeader>
        <TrayTitle className="font-semibold">Delete wallet</TrayTitle>
        <TrayDescription>
          Are you sure you want to delete this wallet? This action cannot be undone.
        </TrayDescription>
      </TrayHeader>

      <TrayBody>
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-muted py-5 px-4">
          <p className="text-lg font-semibold text-foreground">{wallet.name}</p>
          <p className="text-sm text-muted-foreground capitalize">
            {wallet.type}
            <span className="inline-block mx-1.5">·</span>
            {wallet.currency}
          </p>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground mt-1">
            {formatBalanceAmount(Number.parseFloat(wallet.balance), wallet.currency)}
          </p>
        </div>
      </TrayBody>

      <TrayFooter>
        <Button type="button" variant="secondary" className="sm:flex-1" onClick={onCloseAction}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="sm:flex-1"
          disabled={isPending}
          onClick={() => mutate(wallet.id)}
        >
          <Icon icon={isPending ? Loading03Icon : Delete01Icon} className={isPending ? "animate-spin" : undefined} />
          Delete
        </Button>
      </TrayFooter>
    </>
  );
}
