"use client";

import type { CreateCategoryInput } from "../api/create-category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon, Tag01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { Icon } from "@mint/ui/components/icon";
import { IconPicker } from "@mint/ui/components/icon-picker";
import { Input } from "@mint/ui/components/input";
import { toast } from "@mint/ui/components/sonner";
import { TrayFooter, TrayHeader, TrayTitle } from "@mint/ui/components/tray";
import { Controller, useForm } from "react-hook-form";
import { SegmentedControl } from "@/components/segmented-control";
import { createCategorySchema, useCreateCategory } from "../api/create-category";

type CategoryFormProps = {
  onCancelAction: () => void;
  onSuccessAction?: () => void;
};

export function CategoryForm({ onCancelAction, onSuccessAction }: CategoryFormProps) {
  const { control, handleSubmit, formState: { isValid } } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: "", icon: "", type: "expense" },
  });

  const { mutate, isPending } = useCreateCategory({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Category created");
        onSuccessAction?.();
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    },
  });

  return (
    <>
      <TrayHeader>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-muted">
            <Icon icon={Tag01Icon} className="size-5 text-muted-foreground" />
          </div>
          <TrayTitle className="font-semibold">New category</TrayTitle>
        </div>
      </TrayHeader>

      <form id="category-form" onSubmit={handleSubmit(data => mutate(data))} className="flex flex-col gap-4">
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

        <div className="flex gap-2">
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <IconPicker
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Icon"
              />
            )}
          />
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Category name"
                maxLength={50}
                autoFocus
                className="flex-1 bg-muted border-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0"
              />
            )}
          />
        </div>
      </form>

      <TrayFooter>
        <Button type="button" variant="secondary" className="sm:flex-1" onClick={onCancelAction}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="category-form"
          variant="default"
          className="sm:flex-1"
          disabled={!isValid || isPending}
        >
          <Icon icon={isPending ? Loading03Icon : Tag01Icon} className={isPending ? "animate-spin" : undefined} />
          Create
        </Button>
      </TrayFooter>
    </>
  );
}
