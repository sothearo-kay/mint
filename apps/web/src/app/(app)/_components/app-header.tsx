"use client";

import { SidebarTrigger } from "@mint/ui/components/sidebar";
import { Button } from "@mint/ui/components/ui/button";
import { Separator } from "@mint/ui/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GithubIcon from "@/assets/icons/socials/github.svg";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { useWallets } from "@/features/wallets/api/get-wallets";
import { AnimatedContent } from "./animated-content";

const pathTitles: Record<string, string> = {
  "/transactions": "Transactions",
  "/budget": "Budget",
  "/recurring": "Recurring Transactions",
  "/insights": "Insights",
  "/wallets": "Wallets",
  "/categories": "Categories",
};

export function AppHeader() {
  const pathname = usePathname();
  const walletDetailMatch = pathname.match(/^\/wallets\/([^/]+)$/);
  const walletId = walletDetailMatch?.[1];
  const { data: wallets = [] } = useWallets({ queryConfig: { enabled: !!walletId } });
  const walletName = walletId ? (wallets.find(w => w.id === walletId)?.name ?? "") : "";

  const title = walletId
    ? (
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/wallets">
            <span className="text-muted-foreground hover:text-foreground transition-colors">Wallets</span>
          </Link>
          {walletName && (
            <>
              <Separator orientation="vertical" className="data-vertical:self-auto data-vertical:h-4 rotate-15" />
              <span className="truncate">{walletName}</span>
            </>
          )}
        </div>
      )
    : <span className="text-sm font-medium">{pathTitles[pathname] ?? ""}</span>;

  return (
    <header className="sticky top-0 z-20 bg-background border-b border-dashed flex items-center gap-4 px-4 py-2.5">
      <SidebarTrigger className="-ml-1.5" />
      <Separator orientation="vertical" className="-ml-1 data-vertical:self-auto data-vertical:h-4 rotate-15" />
      <AnimatedContent>
        {title}
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
