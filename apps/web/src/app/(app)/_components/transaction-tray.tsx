"use client";

import type { TransactionType } from "@/features/transactions/api/get-transactions";
import {
  MoneyReceiveFlow01Icon,
  MoneySendFlow01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { Icon } from "@mint/ui/components/icon";
import { useSidebar } from "@mint/ui/components/sidebar";
import { Tray, TrayHeader, TrayTitle, TrayView } from "@mint/ui/components/tray";
import { cn } from "@mint/ui/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { TransactionForm } from "@/features/transactions/components/transaction-form";

const TYPE_OPTIONS: {
  value: TransactionType;
  label: string;
  description: string;
  icon: typeof MoneySendFlow01Icon;
  iconClass: string;
  iconBgClass: string;
}[] = [
  {
    value: "expense",
    label: "Expense",
    description: "Money going out",
    icon: MoneySendFlow01Icon,
    iconClass: "text-destructive",
    iconBgClass: "bg-destructive/10",
  },
  {
    value: "income",
    label: "Income",
    description: "Money coming in",
    icon: MoneyReceiveFlow01Icon,
    iconClass: "text-primary",
    iconBgClass: "bg-primary/10",
  },
];

export function TransactionTray() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { open: sidebarOpen, isMobile } = useSidebar();

  const [type, setType] = useState<TransactionType | null>(null);

  const isOpen = searchParams.get("new") === "true";

  const close = useCallback(() => {
    router.replace(pathname);
    setTimeout(() => setType(null), 300);
  }, [router, pathname]);

  const containerStyle = isMobile
    ? undefined
    : { left: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-width-icon)" };

  return (
    <Tray
      open={isOpen}
      onClose={close}
      className="w-full max-w-sm"
      containerStyle={containerStyle}
    >
      <TrayView viewKey={type ?? "type"}>
        {!type
          ? (
              <>
                <TrayHeader>
                  <TrayTitle>New transaction</TrayTitle>
                </TrayHeader>
                <div className="flex flex-col gap-1.5">
                  {TYPE_OPTIONS.map(({ value, label, description, icon, iconClass, iconBgClass }) => (
                    <Button
                      key={value}
                      type="button"
                      variant="secondary"
                      onClick={() => setType(value)}
                      className="h-auto w-full justify-start gap-3 py-3 rounded-xl"
                    >
                      <div className={cn("size-9 rounded-xl flex items-center justify-center shrink-0", iconBgClass)}>
                        <Icon icon={icon} className={cn("size-4.5", iconClass)} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </>
            )
          : (
              <TransactionForm
                type={type}
                onCancelAction={() => setType(null)}
                onSuccessAction={close}
              />
            )}
      </TrayView>
    </Tray>
  );
}
