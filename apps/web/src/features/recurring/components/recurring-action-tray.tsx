"use client";

import type { RecurringTransaction } from "../api/get-recurring";
import { Delete01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { DynamicIcon, Icon } from "@mint/ui/components/icon";
import { useSidebar } from "@mint/ui/components/sidebar";
import { toast } from "@mint/ui/components/sonner";
import { Tray, TrayBody, TrayDescription, TrayFooter, TrayHeader, TrayTitle, TrayView } from "@mint/ui/components/tray";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { SelectAccountView } from "@/components/select-account-view";
import { useSession } from "@/features/auth/api";
import { useWallets } from "@/features/wallets/api/get-wallets";
import { useRecurringTray } from "@/store/recurring-tray";
import { useDeleteRecurring } from "../api/delete-recurring";
import { RecurringForm } from "./recurring-form";

type View = "select-account" | "create" | "edit" | "delete";

export function RecurringActionTray() {
  const { mode, recurring, close: storeClose } = useRecurringTray();
  const { open: sidebarOpen, isMobile } = useSidebar();
  const { data: session } = useSession();
  const { data: wallets = [], isPending: isWalletsPending } = useWallets({ queryConfig: { enabled: !!session } });
  const walletsLoading = !!session && isWalletsPending;

  const [view, setView] = useState<View>("select-account");
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  useEffect(() => {
    if (!mode)
      return;
    if (mode === "edit")
      return setView("edit");
    if (mode === "delete")
      return setView("delete");
    // create: only auto-advance from select-account (initial), not from user-navigated views
    if (walletsLoading)
      return;
    if (!session) {
      setView("create");
      return;
    }
    if (view !== "select-account")
      return;
    setView(wallets.length === 0 ? "create" : "select-account");
  }, [mode, session, walletsLoading, wallets.length, view]);

  const close = useCallback(() => {
    storeClose();
    setTimeout(() => {
      setView("select-account");
      setSelectedWalletId(null);
    }, 300);
  }, [storeClose]);

  function handleWalletSelect(walletId: string | null) {
    setSelectedWalletId(walletId);
    setView("create");
  }

  const containerStyle = isMobile
    ? undefined
    : { left: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-width-icon)" };

  const viewKey = view === "create"
    ? `create-${selectedWalletId}`
    : view === "edit"
      ? `edit-${recurring?.id}`
      : view === "delete"
        ? `delete-${recurring?.id}`
        : view;

  const views: Record<View, React.ReactNode> = {
    "select-account": <SelectAccountView wallets={wallets} onSelectAction={handleWalletSelect} />,
    "create": (
      <RecurringForm
        defaultWalletId={selectedWalletId}
        defaultCurrency={wallets.find(w => w.id === selectedWalletId)?.currency}
        onCancelAction={close}
        onBackAction={wallets.length > 0 ? () => setView("select-account") : undefined}
        onSuccessAction={close}
      />
    ),
    "edit": recurring
      ? <RecurringForm recurring={recurring} onCancelAction={close} onSuccessAction={close} />
      : null,
    "delete": recurring
      ? <DeleteView recurring={recurring} onCloseAction={close} />
      : null,
  };

  return (
    <Tray open={!!mode} onClose={close} className="w-full max-w-sm" containerStyle={containerStyle}>
      <TrayView viewKey={viewKey}>
        {views[view]}
      </TrayView>
    </Tray>
  );
}

function DeleteView({ recurring, onCloseAction }: { recurring: RecurringTransaction; onCloseAction: () => void }) {
  const { mutate, isPending } = useDeleteRecurring({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Recurring transaction deleted");
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
        <TrayTitle className="font-semibold">Delete recurring</TrayTitle>
        <TrayDescription>
          Are you sure you want to delete this recurring transaction? This action cannot be undone.
        </TrayDescription>
      </TrayHeader>

      <TrayBody>
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-muted py-5 px-4">
          <div className="size-12 rounded-2xl bg-background flex items-center justify-center overflow-hidden">
            {recurring.logo
              ? (
                  <Image
                    src={recurring.logo}
                    alt={recurring.name}
                    width={20}
                    height={20}
                    className="size-5 object-contain"
                  />
                )
              : <DynamicIcon name={recurring.category.icon} className="size-5 text-muted-foreground" />}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{recurring.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">{recurring.frequency}</p>
          </div>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            {recurring.currency === "KHR" ? "៛" : "$"}
            {Number.parseFloat(recurring.amount).toLocaleString()}
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
          onClick={() => mutate(recurring.id)}
        >
          <Icon icon={isPending ? Loading03Icon : Delete01Icon} className={isPending ? "animate-spin" : undefined} />
          Delete
        </Button>
      </TrayFooter>
    </>
  );
}
