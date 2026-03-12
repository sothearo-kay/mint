"use client";

import type { CreateTransactionInput } from "../api/create-transaction";
import type { Transaction, TransactionType } from "../api/get-transactions";
import type { Currency } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loading03Icon,
  MoneyReceiveFlow01Icon,
  MoneySendFlow01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { DatePicker } from "@mint/ui/components/date-picker";
import { DynamicIcon, Icon } from "@mint/ui/components/icon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@mint/ui/components/select";
import { toast } from "@mint/ui/components/sonner";
import { Textarea } from "@mint/ui/components/textarea";
import { TrayBody, TrayFooter, TrayHeader, TrayTitle } from "@mint/ui/components/tray";
import { cn } from "@mint/ui/lib/utils";
import { useAnimate } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { AmountInput } from "@/components/amount-input";
import { ToggleGroup } from "@/components/toggle-group";
import { useSession } from "@/features/auth/api";
import { useWallets } from "@/features/wallets/api/get-wallets";
import { useGuestTransactions } from "@/store/guest-transactions";
import { useWalletTray } from "@/store/wallet-tray";
import { formatBalanceAmount } from "@/utils/format";
import { createTransactionSchema, useCreateTransaction } from "../api/create-transaction";
import { useCategories } from "../api/get-categories";
import { useUpdateTransaction } from "../api/update-transaction";

const TYPE_CONFIG = {
  expense: {
    icon: MoneySendFlow01Icon,
    iconClass: "text-destructive",
    iconBgClass: "bg-destructive/10",
  },
  income: {
    icon: MoneyReceiveFlow01Icon,
    iconClass: "text-primary",
    iconBgClass: "bg-primary/10",
  },
} as const;

export type TransactionFormProps = {
  type?: TransactionType;
  transaction?: Transaction;
  defaultWalletId?: string | null;
  defaultCurrency?: Currency;
  onCancelAction: () => void;
  onBackAction?: () => void;
  onSuccessAction?: () => void;
};

export function TransactionForm({
  type: initialType = "expense",
  transaction,
  defaultWalletId,
  defaultCurrency,
  onCancelAction,
  onBackAction,
  onSuccessAction,
}: TransactionFormProps) {
  const isEditing = !!transaction;
  const router = useRouter();
  const { data: session } = useSession();
  const guestStore = useGuestTransactions();
  const { openCreate: openCreateWallet } = useWalletTray();
  const { data: allCategories = [] } = useCategories();
  const { data: wallets = [] } = useWallets({ queryConfig: { enabled: !!session } });

  const { control, handleSubmit, setValue, watch, formState: { isValid } } = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: transaction?.type ?? initialType,
      currency: transaction?.currency ?? defaultCurrency ?? "USD",
      amount: transaction?.amount ?? "",
      categoryId: transaction?.category.id ?? "",
      note: transaction?.note ?? "",
      date: transaction?.date ?? new Date().toISOString(),
      walletId: transaction?.walletId ?? defaultWalletId ?? null,
    },
  });

  const type = watch("type");
  const categoryId = watch("categoryId");
  const categories = allCategories.filter(c => c.type === type);

  const currency = watch("currency");

  const walletId = watch("walletId");
  const amount = watch("amount");
  const selectedWallet = session ? (wallets.find(w => w.id === walletId) ?? null) : null;
  const isBalanceExceeded = type === "expense"
    && selectedWallet !== null
    && Number.parseFloat(amount || "0") > Number.parseFloat(selectedWallet.balance);

  const [amountScope, animateAmount] = useAnimate();
  const prevBalanceExceeded = useRef(false);

  useEffect(() => {
    if (isBalanceExceeded && !prevBalanceExceeded.current) {
      animateAmount(amountScope.current, { x: [0, 6, -6, 6, -6, 0] }, { duration: 0.35, ease: "easeInOut" });
    }
    prevBalanceExceeded.current = isBalanceExceeded;
  }, [isBalanceExceeded]);

  useEffect(() => {
    if (!isEditing && categories.length > 0 && !categories.some(c => c.id === categoryId)) {
      setValue("categoryId", categories[0].id, { shouldValidate: true });
    }
  }, [categories, categoryId, setValue, isEditing]);

  const { mutate: create, isPending: isCreating } = useCreateTransaction({
    mutationConfig: {
      onSuccess: () => {
        toast.success(`${type === "expense" ? "Expense" : "Income"} added to transactions`);
        onSuccessAction?.();
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    },
  });

  const { mutate: update, isPending: isUpdating } = useUpdateTransaction({
    mutationConfig: {
      onSuccess: () => {
        toast.success(`${type === "expense" ? "Expense" : "Income"} updated`);
        onSuccessAction?.();
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    },
  });

  const isPending = isCreating || isUpdating;
  const config = TYPE_CONFIG[type];
  const title = isEditing ? `Edit ${type}` : "New transaction";
  const selectedCategory = categories.find(c => c.id === categoryId);

  function onSubmit(data: CreateTransactionInput) {
    if (!session) {
      const now = new Date().toISOString();
      if (isEditing) {
        guestStore.update(transaction.id, {
          ...data,
          note: data.note ?? null,
          category: selectedCategory ?? transaction.category,
        });
        toast.success(`${type === "expense" ? "Expense" : "Income"} updated`);
      }
      else {
        guestStore.add({
          id: crypto.randomUUID(),
          type: data.type,
          amount: data.amount,
          currency: data.currency,
          note: data.note ?? null,
          date: data.date,
          createdAt: now,
          updatedAt: now,
          category: selectedCategory!,
          walletId: data.walletId ?? null,
          recurring: null,
        });
        toast.success(`${type === "expense" ? "Expense" : "Income"} added to transactions`);
      }
      onSuccessAction?.();
      return;
    }

    if (isEditing) {
      update({ id: transaction.id, ...data });
    }
    else {
      create(data);
    }
  }

  return (
    <>
      <TrayHeader>
        <div className="flex items-center gap-3">
          <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0", config.iconBgClass)}>
            <Icon icon={config.icon} className={cn("size-5", config.iconClass)} />
          </div>
          <TrayTitle className="font-semibold capitalize">{title}</TrayTitle>
        </div>
      </TrayHeader>

      <TrayBody>
        <form id="transaction-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {!isEditing && (
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <ToggleGroup
                  items={[
                    { value: "expense", label: "Expense" },
                    { value: "income", label: "Income" },
                  ]}
                  value={field.value}
                  onChangeAction={(v) => {
                    field.onChange(v);
                    const firstCat = allCategories.filter(c => c.type === v)[0];
                    if (firstCat) {
                      setValue("categoryId", firstCat.id, { shouldValidate: true });
                    }
                  }}
                />
              )}
            />
          )}

          <div className="flex gap-2">
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onValueChange={d => field.onChange(d?.toISOString() ?? new Date().toISOString())}
                  className="h-9"
                  disabled={{ after: new Date() }}
                />
              )}
            />
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={v => field.onChange(v ?? "")}>
                  <SelectTrigger className="h-9!">
                    {selectedCategory
                      ? (
                          <div className="flex items-center gap-2">
                            <DynamicIcon name={selectedCategory.icon} className="size-4" />
                            <span>{selectedCategory.name}</span>
                          </div>
                        )
                      : <span className="text-muted-foreground/60">Category</span>}
                  </SelectTrigger>
                  <SelectContent align="start" alignItemWithTrigger={false}>
                    <SelectGroup>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          <DynamicIcon name={c.icon} className="size-4" />
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div ref={amountScope} className="flex flex-col items-center py-4">
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <AmountInput
                  value={field.value}
                  onChangeAction={field.onChange}
                  type={type}
                  currency={currency}
                  onCurrencyChangeAction={walletId ? undefined : c => setValue("currency", c)}
                  isBalanceExceeded={isBalanceExceeded}
                  autoFocus
                />
              )}
            />
            {isBalanceExceeded && (
              <p className="text-xs text-destructive mt-1">
                Exceeds balance (
                {formatBalanceAmount(Number.parseFloat(selectedWallet!.balance), currency)}
                )
              </p>
            )}
          </div>

          {session && !onBackAction && (
            <Controller
              control={control}
              name="walletId"
              render={({ field }) => (
                wallets.length === 0
                  ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon icon={Wallet01Icon} className="size-4 shrink-0" />
                        <span>
                          No wallets yet.
                          {" "}
                          <button
                            type="button"
                            className="underline underline-offset-2 hover:text-foreground transition-colors"
                            onClick={() => {
                              onCancelAction?.();
                              openCreateWallet();
                              router.push("/wallets");
                            }}
                          >
                            Create one
                          </button>
                          {" "}
                          to track accounts.
                        </span>
                      </div>
                    )
                  : (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={(v) => {
                          field.onChange(v || null);
                          const wallet = wallets.find(w => w.id === v);
                          setValue("currency", wallet?.currency ?? "USD");
                        }}
                      >
                        <SelectTrigger>
                          {field.value
                            ? (
                                <div className="flex items-center gap-2">
                                  <Icon icon={Wallet01Icon} className="size-4 text-muted-foreground" />
                                  <span>{wallets.find(w => w.id === field.value)?.name ?? "Wallet"}</span>
                                </div>
                              )
                            : (
                                <div className="flex items-center gap-2 text-muted-foreground/60">
                                  <Icon icon={Wallet01Icon} className="size-4" />
                                  <span>Select wallet (optional)</span>
                                </div>
                              )}
                        </SelectTrigger>
                        <SelectContent align="start" alignItemWithTrigger={false} className="min-w-max">
                          <SelectGroup>
                            {wallets.map(w => (
                              <SelectItem key={w.id} value={w.id}>
                                <Icon icon={Wallet01Icon} className="size-4" />
                                {w.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )
              )}
            />
          )}

          <Controller
            control={control}
            name="note"
            render={({ field }) => (
              <Textarea
                value={field.value ?? ""}
                onChange={e => field.onChange(e.target.value)}
                placeholder="Add notes..."
                className="resize-none border-none px-0 py-0 min-h-0 dark:bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-none"
              />
            )}
          />
        </form>
      </TrayBody>

      <TrayFooter>
        <Button
          type="button"
          variant="secondary"
          className="sm:flex-1"
          onClick={onBackAction ?? onCancelAction}
        >
          {onBackAction ? "Back" : "Cancel"}
        </Button>
        <Button
          type="submit"
          form="transaction-form"
          variant="default"
          className="sm:flex-1"
          disabled={!isValid || isPending || isBalanceExceeded}
        >
          <Icon icon={isPending ? Loading03Icon : config.icon} className={isPending ? "animate-spin" : undefined} />
          <span className="capitalize">{isEditing ? `Save ${type}` : "Add"}</span>
        </Button>
      </TrayFooter>
    </>
  );
}
