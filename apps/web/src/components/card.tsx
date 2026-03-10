import { Card, CardContent } from "@mint/ui/components/ui/card";
import { cn } from "@mint/ui/lib/utils";

type MintCardProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
};

export function MintCard({ title, children, className, cardClassName }: MintCardProps) {
  return (
    <div className={cn("bg-border/40 dark:bg-muted p-1 rounded-xl dark:shadow-md h-full flex flex-col", className)}>
      <div className="py-1 pl-3 pr-2 pb-1.5 flex items-center gap-2 shrink-0">
        {typeof title === "string"
          ? <span className="text-sm font-medium text-muted-foreground">{title}</span>
          : title}
      </div>
      <Card className={cn("ring-0 shadow-none rounded-xl flex-1 flex flex-col", cardClassName)}>
        <CardContent className="flex flex-col flex-1">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
