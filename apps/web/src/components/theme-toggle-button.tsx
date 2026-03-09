"use client";

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { Button } from "@mint/ui/components/ui/button";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

export function ThemeToggleButton() {
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
    <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={handleToggle}>
      <Icon icon={Sun03Icon} className="dark:hidden" />
      <Icon icon={Moon02Icon} className="hidden dark:block" />
    </Button>
  );
}
