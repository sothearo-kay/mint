"use client";

import { ComputerIcon, Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

const themes = [
  { value: "system", icon: ComputerIcon },
  { value: "light", icon: Sun03Icon },
  { value: "dark", icon: Moon02Icon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleChange = (value: string) => {
    if (!document.startViewTransition) {
      setTheme(value);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => setTheme(value));
    });
  };

  return (
    <div className="flex items-center rounded-full border bg-muted p-px">
      {themes.map(({ value, icon: ThemeIcon }) => {
        const isActive = mounted && theme === value;
        return (
          <button
            key={value}
            onClick={() => handleChange(value)}
            className="relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:text-foreground data-[active=true]:text-foreground"
            data-active={isActive}
          >
            {isActive && (
              <div className="absolute inset-0 rounded-full bg-background shadow-sm [view-transition-name:theme-indicator]" />
            )}
            <Icon
              icon={ThemeIcon}
              size={16}
              className="relative z-10"
            />
          </button>
        );
      })}
    </div>
  );
}
