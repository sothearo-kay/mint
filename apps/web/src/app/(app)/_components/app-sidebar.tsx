import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@mint/ui/components/sidebar";
import { CreateItems, NavItems } from "./nav-items";
import { SidebarAuth } from "./sidebar-auth";

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <span className="font-heading px-2 py-1 text-xl">Mint</span>
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
      </SidebarContent>

      <SidebarFooter>
        <SidebarAuth />
      </SidebarFooter>
    </Sidebar>
  );
}
