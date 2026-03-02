"use client";

import { usePathname } from "next/navigation";

export function AnimatedContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="animate-in fade-in slide-in-from-bottom-2 duration-200 p-6"
    >
      {children}
    </div>
  );
}
