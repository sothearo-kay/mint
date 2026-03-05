"use client";

import { Loading03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@mint/ui/components/dialog";
import { Icon } from "@mint/ui/components/icon";
import { toast } from "@mint/ui/components/sonner";
import { useEffect, useState } from "react";
import { useSession } from "@/features/auth/api";
import { useGuestTransactions } from "@/store/guest-transactions";
import { useTransactions } from "../api/get-transactions";
import { useSyncTransactions } from "../api/sync-transactions";

export function SyncTransactionsDialog() {
  const { data: session } = useSession();
  const { transactions, clear } = useGuestTransactions();
  const [open, setOpen] = useState(false);

  const { data: serverTransactions, isSuccess } = useTransactions({
    queryConfig: { enabled: !!session && transactions.length > 0 },
  });

  useEffect(() => {
    if (!isSuccess || !session || transactions.length === 0)
      return;
    if (serverTransactions.length === 0) {
      setOpen(true);
    }
    else {
      clear();
    }
  }, [isSuccess, session, serverTransactions?.length, transactions.length, clear]);

  const { mutate: sync, isPending } = useSyncTransactions({
    mutationConfig: {
      onSuccess: () => {
        clear();
        setOpen(false);
        toast.success("Transactions synced");
      },
      onError: () => {
        toast.error("Failed to sync. Please try again.");
      },
    },
  });

  function handleSync() {
    sync(
      transactions.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        currency: tx.currency,
        categoryId: tx.category.id,
        note: tx.note,
        date: tx.date,
      })),
    );
  }

  function handleDiscard() {
    clear();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v)
          setOpen(true);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sync local transactions</DialogTitle>
          <DialogDescription>
            You have
            {" "}
            {transactions.length}
            {" "}
            local transaction
            {transactions.length !== 1 ? "s" : ""}
            {" "}
            saved while browsing as a guest. Would you like to sync them to your account?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={handleDiscard} disabled={isPending}>
            Discard
          </Button>
          <Button className="flex-1" onClick={handleSync} disabled={isPending}>
            {isPending && <Icon icon={Loading03Icon} className="animate-spin" />}
            Sync
            {" "}
            {transactions.length}
            {" "}
            transaction
            {transactions.length !== 1 ? "s" : ""}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
