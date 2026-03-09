"use client";

import type { Route } from "next";
import {
  Coins01Icon,
  MoneyAdd01Icon,
  PieChart02Icon,
  Tag01Icon,
  TransactionIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@mint/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/features/auth/api";
import { useTransactionTray } from "@/store/transaction-tray";

const navItems: { label: string; icon: typeof TransactionIcon; href: Route }[] = [
  { label: "Transactions", icon: TransactionIcon, href: "/transactions" },
  { label: "Budget", icon: Coins01Icon, href: "/budget" },
  { label: "Insights", icon: PieChart02Icon, href: "/insights" },
  { label: "Wallets", icon: Wallet01Icon, href: "/wallets" },
];

const createItems = [
  { label: "New Transaction", icon: MoneyAdd01Icon, href: "/transactions/new" },
];

const settingsItems: { label: string; icon: typeof Tag01Icon; href: Route }[] = [
  { label: "Categories", icon: Tag01Icon, href: "/categories" },
];

function isActive(pathname: string, href: string) {
  return pathname === href;
}

export function NavItems() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu className="gap-0.5">
      {navItems.map(({ label, icon: NavIcon, href }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            isActive={isActive(pathname, href)}
            tooltip={label}
            render={<Link href={href} onClick={() => setOpenMobile(false)} />}
          >
            <Icon icon={NavIcon} />
            <span>{label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function CreateItems() {
  const { setOpenMobile } = useSidebar();
  const { open } = useTransactionTray();

  return (
    <SidebarMenu className="gap-0.5">
      {createItems.map(({ label, icon: NavIcon }) => (
        <SidebarMenuItem key={label}>
          <SidebarMenuButton
            tooltip={label}
            onClick={() => {
              setOpenMobile(false);
              open();
            }}
          >
            <Icon icon={NavIcon} />
            <span>{label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function SettingsItems() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { data: session } = useSession();

  if (!session)
    return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarMenu className="gap-0.5">
        {settingsItems.map(({ label, icon: NavIcon, href }) => (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton
              isActive={isActive(pathname, href)}
              tooltip={label}
              render={<Link href={href} onClick={() => setOpenMobile(false)} />}
            >
              <Icon icon={NavIcon} />
              <span>{label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
