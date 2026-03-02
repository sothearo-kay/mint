import { HugeiconsIcon } from "@hugeicons/react";

type IconProps = {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
  strokeWidth?: number;
} & React.ComponentProps<"svg">;

export function Icon({ icon, strokeWidth = 2, className, ...props }: IconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}
