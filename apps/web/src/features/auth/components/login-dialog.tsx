"use client";

import { Loading03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mint/ui/components/dialog";
import { Icon } from "@mint/ui/components/icon";
import { toast } from "@mint/ui/components/sonner";
import { usePathname } from "next/navigation";
import GithubIcon from "@/assets/icons/socials/github.svg";
import GoogleIcon from "@/assets/icons/socials/google.svg";
import { useSignIn, useSignInWithGithub } from "@/features/auth/api";

type LoginDialogProps = {
  trigger?: React.ReactNode;
  triggerProps?: React.ComponentProps<typeof Button>;
};

export function LoginDialog({ trigger, triggerProps }: LoginDialogProps) {
  const pathname = usePathname();
  const { mutate: signIn, isPending: isSigningIn, isSuccess: isSignedIn } = useSignIn();
  const { mutate: signInGithub, isPending: isSigningInGithub, isSuccess: isSignedInGithub } = useSignInWithGithub();

  const isGoogleLoading = isSigningIn || isSignedIn;
  const isGithubLoading = isSigningInGithub || isSignedInGithub;
  const isAnyLoading = isGoogleLoading || isGithubLoading;

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="raise-default" {...triggerProps} />}>
        {trigger ?? "Login"}
      </DialogTrigger>
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
  );
}
