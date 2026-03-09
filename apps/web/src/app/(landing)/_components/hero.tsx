"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import { Icon } from "@mint/ui/components/icon";
import Link from "next/link";
import GithubIcon from "@/assets/icons/socials/github.svg";
import { useTransactionTray } from "@/store/transaction-tray";

export function Hero() {
  const { open } = useTransactionTray();

  return (
    <section className="flex h-(--hero-height) flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-heading text-7xl tracking-tight">Mint</h1>
      <p className="max-w-sm text-muted-foreground">
        A minimalist expense tracker to help you stay on top of your finances.
      </p>
      <div className="flex items-center gap-3">
        <Button
          variant="raise-default"
          nativeButton={false}
          render={<Link href="/transactions" />}
          onClick={() => open()}
        >
          Get Started
          <div className="flex justify-center items-center size-4 bg-primary-foreground/20 rounded-full">
            <Icon icon={ArrowUpRight01Icon} className="size-3.5" />
          </div>
        </Button>
        <Button
          variant="raise-secondary"
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
    </section>
  );
}
