import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@mint/ui/components/icon";

type ErrorStateProps = {
  message?: string;
};

export function ErrorState({ message = "Something went wrong. Please try again." }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="size-14 rounded-3xl bg-destructive/10 flex items-center justify-center mb-4">
        <Icon icon={AlertCircleIcon} className="size-7 text-destructive" />
      </div>
      <p className="text-sm font-semibold text-foreground">Error</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-56">{message}</p>
    </div>
  );
}
