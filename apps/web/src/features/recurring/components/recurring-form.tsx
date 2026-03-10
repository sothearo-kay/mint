"use client";

import type { CreateRecurringInput } from "../api/create-recurring";
import type { RecurringTransaction } from "../api/get-recurring";
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
import { Input } from "@mint/ui/components/input";
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
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ToggleGroup } from "@/components/toggle-group";
import { useSession } from "@/features/auth/api";
import { useCategories } from "@/features/transactions/api/get-categories";
import { useWallets } from "@/features/wallets/api/get-wallets";
import { createRecurringSchema, useCreateRecurring } from "../api/create-recurring";
import { useUpdateRecurring } from "../api/update-recurring";
import { LogoPicker } from "./logo-picker";

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

const FREQUENCY_ITEMS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

function formatAmountDisplay(raw: string): string {
  if (!raw)
    return "";
  const [intPart, decPart] = raw.split(".");
  const formattedInt = Number.parseInt(intPart || "0", 10).toLocaleString();
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}

type RecurringFormProps = {
  recurring?: RecurringTransaction;
  defaultWalletId?: string | null;
  defaultCurrency?: Currency;
  onCancelAction: () => void;
  onBackAction?: () => void;
  onSuccessAction?: () => void;
};

export function RecurringForm({
  recurring,
  defaultWalletId,
  defaultCurrency,
  onCancelAction,
  onBackAction,
  onSuccessAction,
}: RecurringFormProps) {
  const isEditing = !!recurring;
  const { data: session } = useSession();
  const { data: allCategories = [] } = useCategories();
  const { data: wallets = [] } = useWallets({ queryConfig: { enabled: !!session } });

  const { control, handleSubmit, setValue, watch, register, formState: { isValid } } = useForm<CreateRecurringInput>({
    resolver: zodResolver(createRecurringSchema),
    defaultValues: {
      name: recurring?.name ?? "",
      type: recurring?.type ?? "expense",
      currency: recurring?.currency ?? defaultCurrency ?? "USD",
      amount: recurring?.amount ?? "",
      categoryId: recurring?.categoryId ?? "",
      walletId: recurring?.walletId ?? defaultWalletId ?? null,
      logo: recurring?.logo ?? null,
      note: recurring?.note ?? "",
      frequency: recurring?.frequency ?? "monthly",
      startDate: recurring?.startDate ?? new Date().toISOString(),
      endDate: recurring?.endDate ?? null,
      isActive: recurring?.isActive ?? true,
    },
  });

  const type = watch("type");
  const categoryId = watch("categoryId");
  const currency = watch("currency");
  const categories = allCategories.filter(c => c.type === type);
  const currencySymbol = currency === "KHR" ? "៛" : "$";

  useEffect(() => {
    if (!isEditing && categories.length > 0 && !categories.some(c => c.id === categoryId)) {
      setValue("categoryId", categories[0].id);
    }
  }, [categories, categoryId, setValue, isEditing]);

  const { mutate: create, isPending: isCreating } = useCreateRecurring({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Recurring transaction created");
        onSuccessAction?.();
      },
      onError: () => toast.error("Something went wrong. Please try again."),
    },
  });

  const { mutate: update, isPending: isUpdating } = useUpdateRecurring({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Recurring transaction updated");
        onSuccessAction?.();
      },
      onError: () => toast.error("Something went wrong. Please try again."),
    },
  });

  const isPending = isCreating || isUpdating;
  const config = TYPE_CONFIG[type];
  const title = isEditing ? "Edit recurring" : "New recurring";

  function onSubmit(data: CreateRecurringInput) {
    if (isEditing) {
      update({ id: recurring.id, ...data });
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
          <TrayTitle className="font-semibold">{title}</TrayTitle>
        </div>
      </TrayHeader>

      <TrayBody>
        <form id="recurring-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 overflow-auto no-scrollbar">
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
                  onChangeAction={field.onChange}
                />
              )}
            />
          )}

          <div className="flex gap-2">
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onValueChange={d => field.onChange(d?.toISOString() ?? new Date().toISOString())}
                  className="h-9"
                />
              )}
            />
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => {
                const selectedCategory = categories.find(c => c.id === field.value);
                return (
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
                );
              }}
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
                  ? <></>
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

          <div className="flex gap-2">
            <Controller
              control={control}
              name="logo"
              render={({ field }) => (
                <LogoPicker value={field.value ?? null} onChangeAction={field.onChange} />
              )}
            />
            <Input
              {...register("name")}
              placeholder="Name (e.g. Netflix, Salary)"
              className="flex-1 h-9 bg-muted border-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0"
            />
          </div>

          <Controller
            control={control}
            name="frequency"
            render={({ field }) => (
              <ToggleGroup
                items={FREQUENCY_ITEMS}
                value={field.value}
                onChangeAction={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onValueChange={d => field.onChange(d?.toISOString() ?? null)}
                placeholder="End date (optional)"
                className="h-9"
              />
            )}
          />

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
          form="recurring-form"
          variant="default"
          className="sm:flex-1"
          disabled={!isValid || isPending}
        >
          <Icon icon={isPending ? Loading03Icon : config.icon} className={isPending ? "animate-spin" : undefined} />
          <span>{isEditing ? "Save" : "Add"}</span>
        </Button>
      </TrayFooter>
    </>
  );
}
