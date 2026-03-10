"use client";

import type { IconSvgElement } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@mint/ui/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./button";
import { DynamicIcon, Icon } from "./icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type AllIcons = Record<string, IconSvgElement>;

let cachedIcons: AllIcons | null = null;

async function getAllIcons(): Promise<AllIcons> {
  if (cachedIcons)
    return cachedIcons;
  const m = await import("@hugeicons/core-free-icons");
  cachedIcons = m as AllIcons;
  return cachedIcons;
}

type IconPickerProps = {
  value?: string;
  onValueChange?: (name: string) => void;
  placeholder?: string;
  className?: string;
};

export function IconPicker({ value, onValueChange, placeholder = "Pick icon", className }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [allIcons, setAllIcons] = useState<AllIcons | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !allIcons) {
      getAllIcons().then(setAllIcons);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, allIcons]);

  const iconNames = useMemo(() => {
    if (!allIcons)
      return [];
    const names = Object.keys(allIcons).filter(k => k.endsWith("Icon"));
    if (!search.trim())
      return names.slice(0, 120);
    const q = search.toLowerCase().replace(/\s+/g, "");
    return names
      .filter(n => n.toLowerCase().replace("icon", "").includes(q))
      .slice(0, 120);
  }, [allIcons, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={(
          <Button
            variant="secondary"
            className={cn(
              !value && "text-muted-foreground",
              value && "size-8 p-0",
              className,
            )}
          />
        )}
      >
        {value
          ? <DynamicIcon name={value} className="size-4" />
          : placeholder}
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0 gap-0" side="bottom" align="start" sideOffset={6}>
        <div className="px-2 py-1 border-b border-border/60">
          <InputGroup className="border-0 shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-0">
            <InputGroupAddon>
              <Icon icon={Search01Icon} className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search icons..."
            />
          </InputGroup>
        </div>

        <div className="h-56 overflow-y-auto p-2">
          {!allIcons
            ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  Loading icons...
                </div>
              )
            : iconNames.length === 0
              ? (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    No icons found
                  </div>
                )
              : (
                  <div className="grid grid-cols-8 gap-1">
                    {iconNames.map(name => (
                      <button
                        key={name}
                        type="button"
                        title={name.replace("Icon", "")}
                        onClick={() => {
                          onValueChange?.(name);
                          setOpen(false);
                          setSearch("");
                        }}
                        className={cn(
                          "size-8 rounded-(--radius-md) flex items-center justify-center transition-colors",
                          value === name
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 ring-2 ring-ring/50"
                            : "hover:bg-muted",
                        )}
                      >
                        <Icon
                          icon={allIcons[name]!}
                          className={cn("size-4", value === name ? "text-primary-foreground" : "text-foreground")}
                        />
                      </button>
                    ))}
                  </div>
                )}
        </div>

        {value && (
          <div className="px-3 py-2 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs text-muted-foreground truncate">{value.replace("Icon", "")}</span>
            <Button
              type="button"
              variant="link"
              size="xs"
              onClick={() => onValueChange?.("")}
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
