"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

const themes = [
  { value: "system", icon: Monitor },
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
] as const;

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
      {themes.map(({ value, icon: Icon }) => {
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
            <Icon className="relative z-10 size-4" />
          </button>
        );
      })}
    </div>
  );
}
