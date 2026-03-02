"use client";

import { Loading03Icon, Logout01Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@mint/ui/components/avatar";
import { Button } from "@mint/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mint/ui/components/dialog";
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
  SidebarMenuSkeleton,
} from "@mint/ui/components/sidebar";
import { toast } from "@mint/ui/components/sonner";
import { usePathname } from "next/navigation";
import GithubIcon from "@/assets/icons/socials/github.svg";
import GoogleIcon from "@/assets/icons/socials/google.svg";
import { useSession, useSignIn, useSignInWithGithub, useSignOut } from "@/features/auth/api";
import { getInitials } from "@/utils/format";

export function SidebarAuth() {
  const { data, isPending } = useSession();
  const pathname = usePathname();
  const { mutate: signIn, isPending: isSigningIn, isSuccess: isSignedIn } = useSignIn();
  const { mutate: signInGithub, isPending: isSigningInGithub, isSuccess: isSignedInGithub } = useSignInWithGithub();
  const { mutate: signOut } = useSignOut();

  const isGoogleLoading = isSigningIn || isSignedIn;
  const isGithubLoading = isSigningInGithub || isSignedInGithub;
  const isAnyLoading = isGoogleLoading || isGithubLoading;

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuSkeleton />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!data) {
    return (
      <div className="group-data-[collapsible=icon]:hidden">
        <Dialog>
          <div className="bg-foreground/5 flex flex-col gap-6 rounded-lg p-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Login</span>
              <p className="text-muted-foreground text-xs">
                Login to your account to save your data and access your data anywhere
              </p>
            </div>
            <DialogTrigger
              render={<Button variant="default" className="w-fit" />}
            >
              Login
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Welcome to Mint</DialogTitle>
              <DialogDescription>
                Sign in to sync your expenses across devices and never lose your data.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                disabled={isAnyLoading}
                onClick={() => signIn(pathname, {
                  onError: () => toast.error("Failed to sign in. Please try again."),
                })}
              >
                {isGoogleLoading
                  ? <Icon icon={Loading03Icon} className="size-4 animate-spin" />
                  : <GoogleIcon className="size-4" />}
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                disabled={isAnyLoading}
                onClick={() => signInGithub(pathname, {
                  onError: () => toast.error("Failed to sign in. Please try again."),
                })}
              >
                {isGithubLoading
                  ? <Icon icon={Loading03Icon} className="size-4 animate-spin" />
                  : <GithubIcon className="size-4" />}
                Continue with GitHub
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const { user } = data;
  const initial = getInitials(user.name);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton className="h-auto py-1.5" />}>
            <Avatar>
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
            <span className="truncate text-sm">{user.name}</span>
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
