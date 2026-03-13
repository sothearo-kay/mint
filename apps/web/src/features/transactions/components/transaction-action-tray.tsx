"use client";

import type { Transaction } from "../api/get-transactions";
import { Delete01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { DynamicIcon, Icon } from "@mint/ui/components/icon";
import { useSidebar } from "@mint/ui/components/sidebar";
import { toast } from "@mint/ui/components/sonner";
import { Tray, TrayBody, TrayDescription, TrayFooter, TrayHeader, TrayTitle, TrayView } from "@mint/ui/components/tray";
import { useSession } from "@/features/auth/api";
import { LogoIcon } from "@/features/recurring/components/logo-registry";
import { useGuestTransactions } from "@/store/guest-transactions";
import { formatBalanceAmount } from "@/utils/format";
import { useDeleteTransaction } from "../api/delete-transaction";
import { TransactionForm } from "./transaction-form";

type Mode = "edit" | "delete";

type TransactionActionTrayProps = {
  transaction: Transaction | null;
  mode: Mode | null;
  onCloseAction: () => void;
};

export function TransactionActionTray({ transaction, mode, onCloseAction }: TransactionActionTrayProps) {
  const { open: sidebarOpen, isMobile } = useSidebar();

  const containerStyle = isMobile
    ? undefined
    : { left: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-width-icon)" };

  const views: Record<Mode, React.ReactNode> = {
    edit: transaction
      ? (
          <TransactionForm
            type={transaction.type}
            transaction={transaction}
            onCancelAction={onCloseAction}
            onSuccessAction={onCloseAction}
          />
        )
      : null,
    delete: transaction
      ? <DeleteView transaction={transaction} onCloseAction={onCloseAction} />
      : null,
  };

  return (
    <Tray
      open={!!transaction && !!mode}
      onClose={onCloseAction}
      className="w-full max-w-sm"
      containerStyle={containerStyle}
    >
      <TrayView viewKey={`${mode}-${transaction?.id}`}>
        {mode ? views[mode] : null}
      </TrayView>
    </Tray>
  );
}

function DeleteView({ transaction, onCloseAction }: { transaction: Transaction; onCloseAction: () => void }) {
  const { data: session } = useSession();
  const guestStore = useGuestTransactions();
  const { mutate, isPending } = useDeleteTransaction({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Transaction deleted");
        onCloseAction();
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    },
  });

  function handleDelete() {
    if (!session) {
      guestStore.remove(transaction.id);
      toast.success("Transaction deleted");
      onCloseAction();
      return;
    }
    mutate(transaction.id);
  }

  return (
    <>
      <TrayHeader>
        <TrayTitle className="font-semibold">Delete transaction</TrayTitle>
        <TrayDescription>Are you sure you want to delete this transaction? This action cannot be undone.</TrayDescription>
      </TrayHeader>

      <TrayBody>
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-muted py-5 px-4">
          <div className="size-12 rounded-2xl bg-background flex items-center justify-center overflow-hidden">
            {transaction.recurring?.logo
              ? <LogoIcon name={transaction.recurring.logo} className="size-6" />
              : <DynamicIcon name={transaction.category.icon} className="size-6 text-muted-foreground" />}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">
              {transaction.recurring?.name ?? transaction.category.name}
            </p>
            {transaction.note && (
              <p className="text-xs text-muted-foreground mt-0.5">{transaction.note}</p>
            )}
          </div>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            {formatBalanceAmount(Number.parseFloat(transaction.amount), transaction.currency)}
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
          onClick={handleDelete}
        >
          <Icon icon={isPending ? Loading03Icon : Delete01Icon} className={isPending ? "animate-spin" : undefined} />
          Delete
        </Button>
      </TrayFooter>
    </>
  );
}
