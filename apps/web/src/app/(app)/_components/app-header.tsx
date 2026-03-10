"use client";

import { SidebarTrigger } from "@mint/ui/components/sidebar";
import { Button } from "@mint/ui/components/ui/button";
import { Separator } from "@mint/ui/components/ui/separator";
import { usePathname } from "next/navigation";
import GithubIcon from "@/assets/icons/socials/github.svg";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { AnimatedContent } from "./animated-content";

const pathTitles: Record<string, string> = {
  "/transactions": "Transactions",
  "/budget": "Budget",
  "/recurring": "Recurring Transactions",
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
    <header className="sticky top-0 z-10 bg-background border-b border-dashed flex items-center gap-4 px-4 py-2.5">
      <SidebarTrigger className="-ml-1.5" />
      <Separator orientation="vertical" className="-ml-1 data-vertical:self-auto data-vertical:h-4 rotate-15" />
      <AnimatedContent>
        <span className="text-sm font-medium">{getTitle(pathname)}</span>
      </AnimatedContent>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggleButton />
        <Button
          variant="secondary"
          nativeButton={false}
          render={(
            <a
              href="https://github.com/sothearo-kay/mint"
              target="_blank"
              rel="noopener noreferrer"
            />
          )}
        >
          Open Source
          <GithubIcon className="size-4" />
        </Button>
      </div>
    </header>
  );
}
