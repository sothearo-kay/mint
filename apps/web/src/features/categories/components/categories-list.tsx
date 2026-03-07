"use client";

import type { Category } from "@/features/transactions/api/get-categories";
import { Delete01Icon, Loading03Icon, LockIcon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { DynamicIcon, Icon } from "@mint/ui/components/icon";
import { useSidebar } from "@mint/ui/components/sidebar";
import { toast } from "@mint/ui/components/sonner";
import { Tray, TrayView } from "@mint/ui/components/tray";
import { cn } from "@mint/ui/lib/utils";
import { useState } from "react";
import { Fab } from "@/components/fab";
import { useDeleteCategory } from "@/features/categories/api/delete-category";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useCategories } from "@/features/transactions/api/get-categories";

export function CategoriesList() {
  const { open: sidebarOpen, isMobile } = useSidebar();
  const { data: categories = [], isPending } = useCategories();
  const [trayOpen, setTrayOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);

  const containerStyle = isMobile
    ? undefined
    : { left: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-width-icon)" };

  const expense = categories.filter(c => c.type === "expense");
  const income = categories.filter(c => c.type === "income");

  return (
    <div className="flex flex-col gap-4 mb-14">
      <Fab onClickAction={() => setTrayOpen(true)} />

      {isPending
        ? <CategorySkeleton />
        : (
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-0">
              {[
                { label: "Expense", items: expense },
                { label: "Income", items: income },
              ].map((group, i) => (
                <div
                  key={group.label}
                  className={cn(
                    "flex-1 sm:px-6 first:sm:pl-0 last:sm:pr-0",
                    i === 0 && "sm:border-r-2 sm:border-dashed sm:border-border/60 pb-6 border-b-2 border-dashed border-border/60 sm:pb-0 sm:border-b-0",
                  )}
                >
                  <p className="text-xs font-semibold text-muted-foreground mb-3">{group.label}</p>
                  <div className="flex flex-col gap-2">
                    {group.items.map(cat => (
                      <CategoryRow key={cat.id} category={cat} onDeleteAction={() => setConfirmDelete(cat)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

      <Tray open={trayOpen} onClose={() => setTrayOpen(false)} className="w-full max-w-sm" containerStyle={containerStyle}>
        <TrayView viewKey="add">
          <CategoryForm
            onCancelAction={() => setTrayOpen(false)}
            onSuccessAction={() => setTrayOpen(false)}
          />
        </TrayView>
      </Tray>

      <Tray open={!!confirmDelete} onClose={() => setConfirmDelete(null)} className="w-full max-w-sm" containerStyle={containerStyle}>
        <TrayView viewKey={`delete-${confirmDelete?.id}`}>
          {confirmDelete && (
            <DeleteView category={confirmDelete} onCloseAction={() => setConfirmDelete(null)} />
          )}
        </TrayView>
      </Tray>
    </div>
  );
}

function CategoryRow({ category, onDeleteAction }: { category: Category; onDeleteAction: () => void }) {
  const isSystem = category.userId === null;

  return (
    <div className="group flex items-center gap-3">
      <div className="size-10 rounded-2xl bg-muted flex items-center justify-center shrink-0">
        <DynamicIcon name={category.icon} className="size-5 text-muted-foreground" />
      </div>
      <p className="flex-1 text-sm font-medium">{category.name}</p>
      {isSystem
        ? (
            <Icon icon={LockIcon} className="size-4 text-muted-foreground/40" />
          )
        : (
            <button
              type="button"
              onClick={onDeleteAction}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Icon icon={Delete01Icon} className="size-4" />
            </button>
          )}
    </div>
  );
}

function DeleteView({ category, onCloseAction }: { category: Category; onCloseAction: () => void }) {
  const { mutate, isPending } = useDeleteCategory({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Category deleted");
        onCloseAction();
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    },
  });

  return (
    <>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold">Delete category</p>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete
          {" "}
          <span className="font-medium text-foreground">{category.name}</span>
          ? Transactions using this category won't be deleted.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-muted py-5 px-4 flex-col">
        <div className="size-12 rounded-2xl bg-background flex items-center justify-center">
          <DynamicIcon name={category.icon} className="size-6 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold">{category.name}</p>
          <p className="text-xs text-muted-foreground capitalize mt-0.5">{category.type}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCloseAction}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="flex-1"
          disabled={isPending}
          onClick={() => mutate(category.id)}
        >
          <Icon icon={isPending ? Loading03Icon : Delete01Icon} className={isPending ? "animate-spin" : undefined} />
          Delete
        </Button>
      </div>
    </>
  );
}

function CategorySkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-0">
      {[4, 3].map((count, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 sm:px-6 first:sm:pl-0 last:sm:pr-0",
            i === 0 && "sm:border-r-2 sm:border-dashed sm:border-border/60 pb-6 border-b-2 border-dashed border-border/60 sm:pb-0 sm:border-b-0",
          )}
        >
          <div className="h-4 w-14 bg-muted rounded-full animate-pulse mb-3" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-muted animate-pulse shrink-0" />
                <div className="h-3.5 w-28 bg-muted rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
