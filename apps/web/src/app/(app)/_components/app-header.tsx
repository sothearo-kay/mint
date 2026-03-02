"use client";

import { SidebarTrigger } from "@mint/ui/components/sidebar";
import { Separator } from "@mint/ui/components/ui/separator";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const pathTitles: Record<string, string> = {
  "/transactions/new": "New Transaction",
  "/transactions": "Transactions",
  "/budget": "Budget",
  "/insights": "Insights",
};

function getTitle(pathname: string): string {
  return pathTitles[pathname] ?? "";
}

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) items-center justify-between border-b px-4">
      <div className="w-full flex items-center gap-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="data-vertical:self-auto data-vertical:h-6" />
        <span className="text-sm font-medium mr-auto">{getTitle(pathname)}</span>
        <ThemeToggle />
      </div>
    </header>
  );
}
