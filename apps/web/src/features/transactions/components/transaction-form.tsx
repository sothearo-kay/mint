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
import { TrayFooter, TrayHeader, TrayTitle } from "@mint/ui/components/tray";
import { cn } from "@mint/ui/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { SegmentedControl } from "@/components/segmented-control";
import { useSession } from "@/features/auth/api";
import { useWallets } from "@/features/wallets/api/get-wallets";
import { useGuestTransactions } from "@/store/guest-transactions";
import { useWalletTray } from "@/store/wallet-tray";
import { createTransactionSchema, useCreateTransaction } from "../api/create-transaction";
import { useCategories } from "../api/get-categories";
import { useUpdateTransaction } from "../api/update-transaction";

function formatAmountDisplay(raw: string): string {
  if (!raw)
    return "";
  const [intPart, decPart] = raw.split(".");
  const formattedInt = Number.parseInt(intPart || "0", 10).toLocaleString();
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}

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
  const currencySymbol = currency === "KHR" ? "៛" : "$";

  useEffect(() => {
    if (!isEditing && categories.length > 0 && !categories.some(c => c.id === categoryId)) {
      setValue("categoryId", categories[0].id);
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

      <form id="transaction-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {!isEditing && (
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <SegmentedControl
                items={[
                  { value: "expense", label: "Expense" },
                  { value: "income", label: "Income" },
                ]}
                value={field.value}
                onChangeAction={field.onChange}
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
              />
            )}
          />
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={v => field.onChange(v ?? "")}>
                <SelectTrigger>
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

        <div className="flex items-baseline justify-center gap-1 py-4">
          <span className="text-2xl font-medium text-muted-foreground/30 leading-none self-start mt-2">
            {currencySymbol}
          </span>
          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <input
                type="text"
                inputMode="decimal"
                value={formatAmountDisplay(field.value)}
                onChange={e => field.onChange(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
                autoFocus
                className={cn(
                  "bg-transparent outline-none text-5xl font-semibold text-center placeholder:text-muted-foreground/20 field-sizing-content min-w-0",
                  type === "income" ? "caret-primary" : "caret-destructive",
                )}
              />
            )}
          />
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
                      <SelectContent align="start" alignItemWithTrigger={false}>
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
          disabled={!isValid || isPending}
        >
          <Icon icon={isPending ? Loading03Icon : config.icon} className={isPending ? "animate-spin" : undefined} />
          <span className="capitalize">{isEditing ? `Save ${type}` : "Add"}</span>
        </Button>
      </TrayFooter>
    </>
  );
}
