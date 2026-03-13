"use client";

import type { Wallet } from "../api/get-wallets";
import type { TransferWalletInput } from "../api/transfer-wallet";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight01Icon, Loading03Icon, MoneyExchange01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { Icon } from "@mint/ui/components/icon";
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
import { Badge } from "@mint/ui/components/ui/badge";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { AmountInput } from "@/components/amount-input";
import { formatAmountByCurrency } from "@/utils/format";
import { KHR_PER_USD } from "@/utils/transactions";
import { transferWalletSchema, useTransferWallet } from "../api/transfer-wallet";
import { WALLET_ICONS } from "../utils";

type WalletTransferFormProps = {
  wallet: Wallet;
  wallets: Wallet[];
  onCancelAction: () => void;
  onSuccessAction?: () => void;
};

export function WalletTransferForm({ wallet, wallets, onCancelAction, onSuccessAction }: WalletTransferFormProps) {
  const otherWallets = wallets.filter(w => w.id !== wallet.id);

  const { control, handleSubmit, watch, setValue, formState: { isValid } } = useForm<TransferWalletInput>({
    resolver: zodResolver(transferWalletSchema),
    defaultValues: {
      fromWalletId: wallet.id,
      toWalletId: "",
      fromAmount: "",
      toAmount: "",
      note: "",
      date: new Date().toISOString(),
    },
  });

  const fromAmount = watch("fromAmount");
  const toAmount = watch("toAmount");
  const toWalletId = watch("toWalletId");
  const toWallet = wallets.find(w => w.id === toWalletId) ?? null;
  const isCrossCurrency = toWallet !== null && toWallet.currency !== wallet.currency;

  // Auto-calculate toAmount when fromAmount or toWallet changes
  useEffect(() => {
    const amount = Number.parseFloat(fromAmount) || 0;
    if (!fromAmount || amount === 0 || !toWallet) {
      setValue("toAmount", "", { shouldValidate: true });
      return;
    }
    if (!isCrossCurrency) {
      setValue("toAmount", fromAmount, { shouldValidate: true });
    }
    else if (wallet.currency === "USD" && toWallet.currency === "KHR") {
      setValue("toAmount", String(amount * KHR_PER_USD), { shouldValidate: true });
    }
    else if (wallet.currency === "KHR" && toWallet.currency === "USD") {
      setValue("toAmount", String(amount / KHR_PER_USD), { shouldValidate: true });
    }
  }, [fromAmount, toWalletId]);

  const { mutate, isPending } = useTransferWallet({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Transfer completed");
        onSuccessAction?.();
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    },
  });

  function onSubmit(data: TransferWalletInput) {
    mutate(data);
  }

  const FromWalletIcon = WALLET_ICONS[wallet.type];

  return (
    <>
      <TrayHeader>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon icon={MoneyExchange01Icon} className="size-5 text-primary" />
          </div>
          <TrayTitle className="font-semibold">Transfer</TrayTitle>
        </div>
      </TrayHeader>

      <TrayBody>
        <form id="transfer-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 h-9 px-3 rounded-xl bg-muted text-sm font-medium">
            <Icon icon={FromWalletIcon} className="size-4 text-muted-foreground shrink-0" />
            <span className="truncate">{wallet.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">{wallet.currency}</span>
          </div>

          <Controller
            control={control}
            name="toWalletId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={v => field.onChange(v ?? "")}>
                <SelectTrigger className="w-full h-9!">
                  {field.value && toWallet
                    ? (
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon icon={WALLET_ICONS[toWallet.type]} className="size-4 text-muted-foreground shrink-0" />
                          <span className="truncate">{toWallet.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{toWallet.currency}</span>
                        </div>
                      )
                    : <span className="text-muted-foreground/60">Transfer to wallet</span>}
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {otherWallets.map(w => (
                      <SelectItem key={w.id} value={w.id}>
                        <Icon icon={WALLET_ICONS[w.type]} className="size-4" />
                        {w.name}
                        <span className="text-xs text-muted-foreground ml-1">{w.currency}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <div className="flex flex-col items-center py-4 gap-2">
            <Controller
              control={control}
              name="fromAmount"
              render={({ field }) => (
                <AmountInput
                  value={field.value}
                  onChangeAction={field.onChange}
                  currency={wallet.currency}
                  autoFocus
                />
              )}
            />

            {isCrossCurrency && toWallet && toAmount && (
              <Badge variant="secondary" className="h-6 px-2.5">
                <Icon icon={ArrowRight01Icon} />
                receives
                {" "}
                {formatAmountByCurrency(Number.parseFloat(toAmount), toWallet.currency)}
              </Badge>
            )}
          </div>

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
        <Button type="button" variant="secondary" className="sm:flex-1" onClick={onCancelAction}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="transfer-form"
          className="sm:flex-1"
          disabled={!isValid || isPending}
        >
          <Icon icon={isPending ? Loading03Icon : MoneyExchange01Icon} className={isPending ? "animate-spin" : undefined} />
          Transfer
        </Button>
      </TrayFooter>
    </>
  );
}
