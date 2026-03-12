"use client";

import type { SVGProps } from "react";
import {
  Adobe,
  AmazonWebServicesDark,
  AmazonWebServicesLight,
  AppleDark,
  AppleLight,
  ClaudeAI,
  Discord,
  Facebook,
  Figma,
  Gemini,
  GitHubDark,
  GitHubLight,
  Google,
  Instagram,
  LinkedIn,
  Microsoft,
  Netflix,
  Notion,
  OpenAIDark,
  OpenAILight,
  Slack,
  Spotify,
  Telegram,
  TikTokDark,
  TikTokLight,
  VercelDark,
  VercelLight,
  WhatsApp,
  XDark,
  XLight,
  YouTube,
} from "@ridemountainpig/svgl-react";
import { useTheme } from "next-themes";

type LogoEntry = {
  name: string;
  light: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
  dark: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
};

export const LOGO_REGISTRY: Record<string, LogoEntry> = {
  // Social & Messaging
  facebook: { name: "Facebook", light: Facebook, dark: Facebook },
  instagram: { name: "Instagram", light: Instagram, dark: Instagram },
  youtube: { name: "YouTube", light: YouTube, dark: YouTube },
  tiktok: { name: "TikTok", light: TikTokLight, dark: TikTokDark },
  telegram: { name: "Telegram", light: Telegram, dark: Telegram },
  whatsapp: { name: "WhatsApp", light: WhatsApp, dark: WhatsApp },
  discord: { name: "Discord", light: Discord, dark: Discord },
  x: { name: "X", light: XLight, dark: XDark },
  linkedin: { name: "LinkedIn", light: LinkedIn, dark: LinkedIn },
  // AI
  claude: { name: "Claude", light: ClaudeAI, dark: ClaudeAI },
  chatgpt: { name: "ChatGPT", light: OpenAILight, dark: OpenAIDark },
  gemini: { name: "Gemini", light: Gemini, dark: Gemini },
  // Entertainment
  netflix: { name: "Netflix", light: Netflix, dark: Netflix },
  spotify: { name: "Spotify", light: Spotify, dark: Spotify },
  // Productivity
  notion: { name: "Notion", light: Notion, dark: Notion },
  slack: { name: "Slack", light: Slack, dark: Slack },
  figma: { name: "Figma", light: Figma, dark: Figma },
  github: { name: "GitHub", light: GitHubLight, dark: GitHubDark },
  // Cloud & Tech
  google: { name: "Google", light: Google, dark: Google },
  apple: { name: "Apple", light: AppleLight, dark: AppleDark },
  microsoft: { name: "Microsoft", light: Microsoft, dark: Microsoft },
  amazon: { name: "Amazon", light: AmazonWebServicesLight, dark: AmazonWebServicesDark },
  adobe: { name: "Adobe", light: Adobe, dark: Adobe },
  vercel: { name: "Vercel", light: VercelLight, dark: VercelDark },
};

export function LogoIcon({ name, className }: { name: string; className?: string }) {
  const { resolvedTheme } = useTheme();
  const entry = LOGO_REGISTRY[name];
  if (!entry)
    return null;
  const Icon = resolvedTheme === "dark" ? entry.dark : entry.light;
  return <Icon className={className} />;
}
