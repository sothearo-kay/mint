import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@mint/ui/components/sidebar";
import Link from "next/link";
import { CreateItems, NavItems, SettingsItems } from "./nav-items";
import { SidebarAuth } from "./sidebar-auth";

export function AppSidebar() {
  return (
    <Sidebar className="border-dashed">
      <SidebarHeader className="border-b border-dashed">
        <Link href="/">
          <span className="font-heading px-2 py-1 text-xl">Mint</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <NavItems />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Create</SidebarGroupLabel>
          <CreateItems />
        </SidebarGroup>

        <SettingsItems />
      </SidebarContent>

      <SidebarFooter>
        <SidebarAuth />
      </SidebarFooter>
    </Sidebar>
  );
}
