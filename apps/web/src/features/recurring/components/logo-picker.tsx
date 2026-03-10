"use client";

import { Button } from "@mint/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@mint/ui/components/popover";
import { cn } from "@mint/ui/lib/utils";
import Image from "next/image";
import { useState } from "react";

type LogoItem = { name: string; url: string; mono?: boolean };

export const LOGOS: LogoItem[] = [
  // Social & Messaging
  { name: "Facebook", url: "/logos/facebook.svg" },
  { name: "Instagram", url: "/logos/instagram.svg" },
  { name: "YouTube", url: "/logos/youtube.svg" },
  { name: "TikTok", url: "/logos/tiktok.svg" },
  { name: "Telegram", url: "/logos/telegram.svg" },
  { name: "WhatsApp", url: "/logos/whatsapp.svg" },
  { name: "Discord", url: "/logos/discord.svg" },
  { name: "X", url: "/logos/x.svg", mono: true },
  { name: "LinkedIn", url: "/logos/linkedin.svg" },
  // AI
  { name: "Claude", url: "/logos/claude.svg" },
  { name: "ChatGPT", url: "/logos/chatgpt.svg", mono: true },
  { name: "Gemini", url: "/logos/gemini.svg" },
  // Entertainment
  { name: "Netflix", url: "/logos/netflix.svg" },
  { name: "Spotify", url: "/logos/spotify.svg" },
  // Productivity
  { name: "Notion", url: "/logos/notion.svg" },
  { name: "Slack", url: "/logos/slack.svg" },
  { name: "Figma", url: "/logos/figma.svg" },
  { name: "GitHub", url: "/logos/github.svg", mono: true },
  // Cloud & Tech
  { name: "Google", url: "/logos/google.svg" },
  { name: "Apple", url: "/logos/apple.svg", mono: true },
  { name: "Microsoft", url: "/logos/microsoft.svg" },
  { name: "Amazon", url: "/logos/amazon.svg", mono: true },
  { name: "Adobe", url: "/logos/adobe.svg" },
  { name: "Vercel", url: "/logos/vercel.svg", mono: true },
];

type LogoPickerProps = {
  value: string | null;
  onChangeAction: (url: string | null) => void;
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
          ? (
              <Image
                src={value}
                alt="logo"
                width={20}
                height={20}
                className={cn("size-5 object-contain", LOGOS.find(l => l.url === value)?.mono && "dark:invert")}
              />
            )
          : "Logo"}
      </PopoverTrigger>

      <PopoverContent className="w-70.5 p-2 gap-0" side="bottom" align="start" sideOffset={6}>
        <div className="grid grid-cols-6 gap-1">
          {LOGOS.map(logo => (
            <button
              key={logo.url}
              type="button"
              title={logo.name}
              onClick={() => {
                onChangeAction(value === logo.url ? null : logo.url);
                setOpen(false);
              }}
              className={cn(
                "size-9 rounded-(--radius-md) flex items-center justify-center transition-colors",
                value === logo.url
                  ? "bg-primary/10 ring-2 ring-primary/30"
                  : "hover:bg-muted",
              )}
            >
              <Image
                src={logo.url}
                alt={logo.name}
                width={20}
                height={20}
                className={cn("size-5 object-contain", logo.mono && "dark:invert")}
              />
            </button>
          ))}
        </div>

        {value && (
          <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs text-muted-foreground truncate">
              {LOGOS.find(l => l.url === value)?.name ?? "Custom"}
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
