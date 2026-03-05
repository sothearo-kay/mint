"use client";

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    if (!document.startViewTransition) {
      setTheme(next);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
  };

  return (
    <button
      role="switch"
      aria-label="Toggle theme"
      onClick={handleToggle}
      className="relative flex h-6 w-10 items-center outline-none"
    >
      <div className="mx-px h-3 w-full rounded-full bg-input transition-colors duration-300 dark:bg-muted" />
      <div className="absolute flex size-5.5 translate-x-0 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-transform duration-300 ease-in-out dark:translate-x-5.5 [view-transition-name:theme-thumb]">
        <Icon icon={Sun03Icon} className="size-3 text-foreground dark:hidden" />
        <Icon icon={Moon02Icon} className="size-3 text-foreground hidden dark:block" />
      </div>
    </button>
  );
}
