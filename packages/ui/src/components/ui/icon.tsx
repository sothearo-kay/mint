"use client";

import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

type IconProps = {
  icon: IconSvgElement;
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

type DynamicIconProps = Omit<IconProps, "icon"> & { name: string };

export function DynamicIcon({ name, className, ...props }: DynamicIconProps) {
  const [iconData, setIconData] = useState<IconSvgElement | null>(null);

  useEffect(() => {
    import("@hugeicons/core-free-icons/loader").then(({ loadIcon, iconExists }) => {
      if (iconExists(name))
        loadIcon(name).then(data => setIconData(data as IconSvgElement));
    });
  }, [name]);

  if (!iconData)
    return <svg className={className} viewBox="0 0 24 24" />;

  return <Icon icon={iconData} className={className} {...props} />;
}
