"use client";

import { Logout01Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@mint/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mint/ui/components/dropdown-menu";
import { Icon } from "@mint/ui/components/icon";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@mint/ui/components/sidebar";
import { Skeleton } from "@mint/ui/components/skeleton";
import { toast } from "@mint/ui/components/sonner";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, useSignOut } from "@/features/auth/api";
import { LoginDialog } from "@/features/auth/components/login-dialog";
import { getInitials } from "@/utils/format";

export function SidebarAuth() {
  const { data, isPending } = useSession();
  const router = useRouter();
  const { mutate: signOut } = useSignOut({
    mutationConfig: { onSuccess: () => router.refresh() },
  });

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex h-auto items-center gap-2 rounded-md px-2 py-1.5">
            <Skeleton className="size-8 rounded-full shrink-0" />
            <Skeleton className="h-3.5 w-24 rounded-md" />
            <Skeleton className="size-4 rounded-md ml-auto shrink-0" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!data) {
    return (
      <div className="group-data-[collapsible=icon]:hidden">
        <div className="bg-foreground/5 flex flex-col gap-6 rounded-lg p-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Login</span>
            <p className="text-muted-foreground text-xs">
              Login to your account to save your data and access your data anywhere
            </p>
          </div>
          <LoginDialog triggerProps={{ className: "w-fit" }} />
        </div>
      </div>
    );
  }

  const { user } = data;
  const initial = getInitials(user.name);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton className="h-auto py-1.5 aria-expanded=true:bg-sidebar-accent aria-expanded=true:text-sidebar-accent-foreground" />}>
            <Avatar>
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
            <span className="truncate text-sm font-medium">{user.name}</span>
            <Icon icon={UnfoldMoreIcon} className="size-4 ml-auto shrink-0" />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" className="w-56">
            <div className="flex items-center gap-2 p-1.5">
              <Avatar>
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">{user.email}</span>
              </div>
            </div>

            <DropdownMenuSeparator />
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-sm">Appearance</span>
              <ThemeToggle />
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => signOut(undefined, { onError: () => toast.error("Failed to sign out. Please try again.") })}>
              <Icon icon={Logout01Icon} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
