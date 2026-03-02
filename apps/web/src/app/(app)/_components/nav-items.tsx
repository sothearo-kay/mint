"use client";

import {
  Coins01Icon,
  MoneyAdd01Icon,
  PieChart02Icon,
  TransactionIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@mint/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Transactions", icon: TransactionIcon, href: "/transactions" },
  { label: "Budget", icon: Coins01Icon, href: "/budget" },
  { label: "Insights", icon: PieChart02Icon, href: "/insights" },
];

const createItems = [
  { label: "New Transaction", icon: MoneyAdd01Icon, href: "/transactions/new" },
];

function isActive(pathname: string, href: string) {
  return pathname === href;
}

export function NavItems() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="gap-0.5">
      {navItems.map(({ label, icon: NavIcon, href }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            isActive={isActive(pathname, href)}
            tooltip={label}
            render={<Link href={href} />}
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
  const pathname = usePathname();

  return (
    <SidebarMenu className="gap-0.5">
      {createItems.map(({ label, icon: NavIcon, href }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            isActive={isActive(pathname, href)}
            tooltip={label}
            render={<Link href={href} />}
          >
            <Icon icon={NavIcon} />
            <span>{label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
