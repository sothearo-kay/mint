"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { flushSync } from "react-dom";

const themes = [
  { value: "system", icon: Monitor },
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const activeIndex = themes.findIndex(t => t.value === theme);

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
    <div className="relative flex items-center rounded-full border bg-muted p-0.5">
      <div
        className="absolute size-8 rounded-full bg-background shadow-sm [view-transition-name:theme-indicator]"
        style={{ transform: `translateX(${Math.max(0, activeIndex) * 100}%)` }}
      />
      {themes.map(({ value, icon: Icon }) => (
        <button
          key={value}
          onClick={() => handleChange(value)}
          className="relative z-10 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}
