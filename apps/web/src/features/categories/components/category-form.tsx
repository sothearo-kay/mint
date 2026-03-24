"use client";

import type { CreateCategoryInput } from "../api/create-category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { Icon } from "@mint/ui/components/icon";
import { IconPicker } from "@mint/ui/components/icon-picker";
import { Input } from "@mint/ui/components/input";
import { toast } from "@mint/ui/components/sonner";
import { TrayBody, TrayFooter, TrayHeader, TrayTitle } from "@mint/ui/components/tray";
import { Controller, useForm } from "react-hook-form";
import { ToggleGroup } from "@/components/toggle-group";
import { createCategorySchema, useCreateCategory } from "../api/create-category";

type CategoryFormProps = {
  onCancelAction: () => void;
  onSuccessAction?: () => void;
};

export function CategoryForm({ onSuccessAction }: CategoryFormProps) {
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
        <TrayTitle className="font-semibold">New category</TrayTitle>
      </TrayHeader>

      <TrayBody>
        <form id="category-form" onSubmit={handleSubmit(data => mutate(data))} className="flex flex-col gap-3">
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

          <div className="flex gap-2">
            <Controller
              control={control}
              name="icon"
              render={({ field }) => (
                <IconPicker
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Icon"
                  className="h-9"
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
                  className="flex-1 h-9 bg-muted border-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0"
                />
              )}
            />
          </div>
        </form>
      </TrayBody>

      <TrayFooter>
        <Button
          type="submit"
          form="category-form"
          variant="default"
          size="lg"
          className="w-full"
          disabled={!isValid || isPending}
        >
          {isPending && <Icon icon={Loading03Icon} className="animate-spin" />}
          Create category
        </Button>
      </TrayFooter>
    </>
  );
}
