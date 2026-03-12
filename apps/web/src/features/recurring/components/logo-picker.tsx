"use client";

import { Button } from "@mint/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@mint/ui/components/popover";
import { cn } from "@mint/ui/lib/utils";
import { useState } from "react";
import { LOGO_REGISTRY, LogoIcon } from "./logo-registry";

type LogoPickerProps = {
  value: string | null;
  onChangeAction: (key: string | null) => void;
};

export function LogoPicker({ value, onChangeAction }: LogoPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={(
          <Button
            type="button"
            variant="secondary"
            className={cn(
              "h-9 px-3 gap-2 bg-muted border-transparent shadow-none text-muted-foreground",
              value && "size-9 p-0",
            )}
          />
        )}
      >
        {value
          ? <LogoIcon name={value} className="size-5" />
          : "Logo"}
      </PopoverTrigger>

      <PopoverContent className="w-70.5 p-2 gap-0" side="bottom" align="start" sideOffset={6}>
        <div className="grid grid-cols-6 gap-1">
          {Object.entries(LOGO_REGISTRY).map(([key, entry]) => (
            <button
              key={key}
              type="button"
              title={entry.name}
              onClick={() => {
                onChangeAction(value === key ? null : key);
                setOpen(false);
              }}
              className={cn(
                "size-9 rounded-(--radius-md) flex items-center justify-center transition-colors",
                value === key
                  ? "bg-primary/10 ring-2 ring-primary/30"
                  : "hover:bg-muted",
              )}
            >
              <LogoIcon name={key} className="size-5" />
            </button>
          ))}
        </div>

        {value && (
          <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs text-muted-foreground truncate">
              {LOGO_REGISTRY[value]?.name ?? value}
            </span>
            <Button
              type="button"
              variant="link"
              size="xs"
              onClick={() => {
                onChangeAction(null);
                setOpen(false);
              }}
              className="shrink-0 h-auto p-0 text-xs text-muted-foreground hover:text-foreground hover:no-underline"
            >
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
