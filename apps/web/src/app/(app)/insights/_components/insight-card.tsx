import { Card, CardContent } from "@mint/ui/components/ui/card";
import { cn } from "@mint/ui/lib/utils";

type InsightCardProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function InsightCard({ title, children, className }: InsightCardProps) {
  return (
    <div className={cn("bg-border/40 dark:bg-muted p-1 rounded-xl dark:shadow-md h-full flex flex-col", className)}>
      <div className="py-1 pl-3 pr-2 pb-1.5 flex items-center gap-2 shrink-0">
        {typeof title === "string"
          ? <span className="text-sm font-medium text-muted-foreground">{title}</span>
          : title}
      </div>
      <Card className="ring-0 shadow-none rounded-xl flex-1 flex flex-col">
        <CardContent className="flex flex-col flex-1">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
