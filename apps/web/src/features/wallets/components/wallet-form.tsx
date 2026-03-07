"use client";

import type { CreateWalletInput } from "../api/create-wallet";
import type { Wallet } from "../api/get-wallets";
import { zodResolver } from "@hookform/resolvers/zod";
import { FloppyDiskIcon, Loading03Icon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { Icon } from "@mint/ui/components/icon";
import { toast } from "@mint/ui/components/sonner";
import { TrayFooter, TrayHeader, TrayTitle } from "@mint/ui/components/tray";
import { Input } from "@mint/ui/components/ui/input";
import { Label } from "@mint/ui/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { SegmentedControl } from "@/components/segmented-control";
import { createWalletSchema, useCreateWallet } from "../api/create-wallet";
import { useUpdateWallet } from "../api/update-wallet";

const CURRENCY_ITEMS = [
  { value: "USD", label: "USD" },
  { value: "KHR", label: "KHR" },
] as const;

const TYPE_ITEMS = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank" },
  { value: "savings", label: "Savings" },
] as const;

type WalletFormProps = {
  wallet?: Wallet;
  onCancelAction: () => void;
  onSuccessAction?: () => void;
};

export function WalletForm({ wallet, onCancelAction, onSuccessAction }: WalletFormProps) {
  const isEditing = !!wallet;

  const { control, handleSubmit, formState: { isValid } } = useForm({
    resolver: zodResolver(createWalletSchema),
    defaultValues: {
      name: wallet?.name ?? "",
      currency: wallet?.currency ?? "USD",
      type: wallet?.type ?? "cash",
    },
  });

  const { mutate: create, isPending: isCreating } = useCreateWallet({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Wallet created");
        onSuccessAction?.();
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    },
  });

  const { mutate: update, isPending: isUpdating } = useUpdateWallet({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Wallet updated");
        onSuccessAction?.();
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    },
  });

  const isPending = isCreating || isUpdating;
  const title = isEditing ? "Edit wallet" : "New wallet";

  function onSubmit(data: CreateWalletInput) {
    if (isEditing) {
      update({ id: wallet.id, name: data.name, type: data.type });
    }
    else {
      create(data);
    }
  }

  return (
    <>
      <TrayHeader>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon icon={Wallet01Icon} className="size-5 text-primary" />
          </div>
          <TrayTitle className="font-semibold">{title}</TrayTitle>
        </div>
      </TrayHeader>

      <form id="wallet-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <Label>Name</Label>
              <Input
                {...field}
                placeholder="e.g. Main Account"
                autoFocus
                aria-invalid={!!fieldState.error}
                className="bg-muted border-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0"
              />
            </div>
          )}
        />

        {!isEditing && (
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label>Currency</Label>
                <SegmentedControl
                  items={CURRENCY_ITEMS}
                  value={field.value}
                  onChangeAction={field.onChange}
                />
              </div>
            )}
          />
        )}

        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label>Type</Label>
              <SegmentedControl
                items={TYPE_ITEMS}
                value={field.value}
                onChangeAction={field.onChange}
              />
            </div>
          )}
        />
      </form>

      <TrayFooter>
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancelAction}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="wallet-form"
          className="flex-1"
          disabled={!isValid || isPending}
        >
          <Icon icon={isPending ? Loading03Icon : FloppyDiskIcon} className={isPending ? "animate-spin" : undefined} />
          {isEditing ? "Save" : "Create"}
        </Button>
      </TrayFooter>
    </>
  );
}
