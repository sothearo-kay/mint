"use client";

import { SidebarTrigger } from "@mint/ui/components/sidebar";
import { Separator } from "@mint/ui/components/ui/separator";
import { usePathname } from "next/navigation";
import { AnimatedContent } from "./animated-content";

const pathTitles: Record<string, string> = {
  "/transactions": "Transactions",
  "/budget": "Budget",
  "/insights": "Insights",
  "/wallets": "Wallets",
  "/categories": "Categories",
};

function getTitle(pathname: string): string {
  return pathTitles[pathname] ?? "";
}

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="flex items-center gap-4 px-4 py-2.5">
      <SidebarTrigger className="-ml-1.5" />
      <Separator orientation="vertical" className="-ml-1 data-vertical:self-auto data-vertical:h-6" />
      <AnimatedContent>
        <span className="text-sm font-medium">{getTitle(pathname)}</span>
      </AnimatedContent>
    </header>
  );
}
