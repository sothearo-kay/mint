"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { Icon } from "@mint/ui/components/icon";
import Link from "next/link";
import { useTransactionTray } from "@/store/transaction-tray";

export function Header() {
  const { open } = useTransactionTray();

  return (
    <header className="sticky top-2 flex h-(--header-height) items-center border-b border-dashed bg-background px-4 before:absolute before:content-[''] before:-inset-x-px before:-top-2 before:h-2 before:bg-background before:border-b before:border-border before:border-dashed">
      <div className="flex w-full items-center justify-between">
        <span className="font-heading text-xl">Mint</span>
        <Button
          variant="raise-secondary"
          nativeButton={false}
          render={<Link href="/transactions" />}
          onClick={() => open()}
        >
          Track It
          <div className="flex justify-center items-center size-4 bg-foreground/20 rounded-full">
            <Icon icon={ArrowUpRight01Icon} className="size-3.5" />
          </div>
        </Button>
      </div>
      <span className="corner-square bottom-0 left-0 [--sq-y:50%]" />
      <span className="corner-square bottom-0 right-0 [--sq-x:50%] [--sq-y:50%]" />
    </header>
  );
}
