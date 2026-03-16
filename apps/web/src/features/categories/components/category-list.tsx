"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import type { Category } from "@/features/transactions/api/get-categories";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Delete01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { DynamicIcon, Icon } from "@mint/ui/components/icon";
import { useSidebar } from "@mint/ui/components/sidebar";
import { toast } from "@mint/ui/components/sonner";
import { Tray, TrayBody, TrayDescription, TrayFooter, TrayHeader, TrayTitle, TrayView } from "@mint/ui/components/tray";
import { Skeleton } from "@mint/ui/components/ui/skeleton";
import { cn } from "@mint/ui/lib/utils";
import { useEffect, useState } from "react";
import { Fab } from "@/components/fab";
import { useDeleteCategory } from "@/features/categories/api/delete-category";
import { useReorderCategories } from "@/features/categories/api/reorder-categories";
import { CategoryForm } from "@/features/categories/components/category-form";
import { CategoryRow } from "@/features/categories/components/category-row";
import { useCategories } from "@/features/transactions/api/get-categories";

type View = "add" | "delete";

export function CategoryList() {
  const { open: sidebarOpen, isMobile } = useSidebar();
  const { data: categories = [], isPending } = useCategories();
  const [view, setView] = useState<View | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const containerStyle = isMobile
    ? undefined
    : { left: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-width-icon)" };

  const expense = categories.filter(c => c.type === "expense");
  const income = categories.filter(c => c.type === "income");

  function openDelete(cat: Category) {
    setSelectedCategory(cat);
    setView("delete");
  }

  function close() {
    setView(null);
    setTimeout(() => setSelectedCategory(null), 300);
  }

  const views: Record<View, React.ReactNode> = {
    add: <CategoryForm onCancelAction={close} onSuccessAction={close} />,
    delete: selectedCategory
      ? <DeleteView category={selectedCategory} onCloseAction={close} />
      : null,
  };

  const viewKey = view === "delete" ? `delete-${selectedCategory?.id}` : "add";

  return (
    <div className="flex flex-col gap-4 mb-14">
      <Fab onClickAction={() => setView("add")} />

      {isPending
        ? <CategorySkeleton />
        : (
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-0">
              {[
                { label: "Expense", items: expense },
                { label: "Income", items: income },
              ].map((group, i) => (
                <div
                  key={group.label}
                  className={cn(
                    "flex-1 sm:px-6 first:sm:pl-0 last:sm:pr-0",
                    i === 0 && "border-dashed max-sm:pb-6 max-sm:border-b sm:border-r",
                  )}
                >
                  <p className="text-xs font-semibold text-muted-foreground mb-3">{group.label}</p>
                  <SortableCategoryGroup items={group.items} onDeleteAction={openDelete} />
                </div>
              ))}
            </div>
          )}

      <Tray open={!!view} onClose={close} className="w-full max-w-sm" containerStyle={containerStyle}>
        <TrayView viewKey={viewKey}>
          {view ? views[view] : null}
        </TrayView>
      </Tray>
    </div>
  );
}

function SortableCategoryGroup({
  items,
  onDeleteAction,
}: {
  items: Category[];
  onDeleteAction: (cat: Category) => void;
}) {
  const systemItems = items.filter(c => c.userId === null);
  const userItems = items.filter(c => c.userId !== null);

  const [localUserItems, setLocalUserItems] = useState(userItems);
  const { mutate: reorder } = useReorderCategories();

  useEffect(() => {
    setLocalUserItems(userItems);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id)
      return;

    const oldIndex = localUserItems.findIndex(c => c.id === active.id);
    const newIndex = localUserItems.findIndex(c => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1)
      return;

    const reordered = arrayMove(localUserItems, oldIndex, newIndex);
    setLocalUserItems(reordered);
    reorder(reordered.map((c, i) => ({ id: c.id, position: i })));
  }

  return (
    <div className="flex flex-col gap-2">
      {systemItems.map(cat => (
        <CategoryRow key={cat.id} category={cat} onDeleteAction={() => onDeleteAction(cat)} />
      ))}

      {localUserItems.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={localUserItems.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {localUserItems.map(cat => (
              <CategoryRow key={cat.id} category={cat} onDeleteAction={() => onDeleteAction(cat)} />
            ))}
          </SortableContext>
        </DndContext>
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
      <TrayHeader>
        <TrayTitle className="font-semibold">Delete category</TrayTitle>
        <TrayDescription>
          Are you sure you want to delete
          {" "}
          <span className="font-medium text-foreground">{category.name}</span>
          ? Transactions using this category won't be deleted.
        </TrayDescription>
      </TrayHeader>

      <TrayBody>
        <div className="flex items-center gap-3 rounded-2xl bg-muted py-5 px-4 flex-col">
          <div className="size-12 rounded-2xl bg-background flex items-center justify-center">
            <DynamicIcon name={category.icon} className="size-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">{category.name}</p>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">{category.type}</p>
          </div>
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
          onClick={() => mutate(category.id)}
        >
          <Icon icon={isPending ? Loading03Icon : Delete01Icon} className={isPending ? "animate-spin" : undefined} />
          Delete
        </Button>
      </TrayFooter>
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
          <Skeleton className="h-4 w-14 rounded-full mb-3" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-2xl shrink-0" />
                <Skeleton className="h-3.5 w-28 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
