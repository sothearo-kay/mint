"use client";

import { Toaster } from "@mint/ui/components/sonner";
import { TooltipProvider } from "@mint/ui/components/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { getQueryClient } from "@/lib/react-query";

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({
  children,
}: AppProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster position="top-center" />
          {children}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
