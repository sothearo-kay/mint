"use client";

import { Calendar01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/ui/button";
import { Calendar } from "@mint/ui/components/ui/calendar";
import { Icon } from "@mint/ui/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@mint/ui/components/ui/popover";
import { cn } from "@mint/ui/lib/utils";
import { format } from "date-fns";
import * as React from "react";

type DatePickerProps = {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
};

function DatePicker({
  value,
  onValueChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={(
          <Button
            variant="secondary"
            className={cn("font-normal", !value && "text-muted-foreground", className)}
          />
        )}
      >
        <Icon icon={Calendar01Icon} className="size-3.5 opacity-70" />
        <span>{value ? format(value, "MMM d, yyyy") : placeholder}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={value}
          onSelect={onValueChange}
          defaultMonth={value}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
