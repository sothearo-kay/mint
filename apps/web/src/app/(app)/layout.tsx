import {
  SidebarInset,
  SidebarProvider,
} from "@mint/ui/components/sidebar";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { getSessionQueryOptions } from "@/features/auth/api";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/react-query";
import { AnimatedContent } from "./_components/animated-content";
import { AppHeader } from "./_components/app-header";
import { AppSidebar } from "./_components/app-sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    ...getSessionQueryOptions(),
    queryFn: async () => {
      const requestHeaders = await headers();
      const { data } = await authClient.getSession({
        fetchOptions: { headers: Object.fromEntries(requestHeaders) },
      });
      return data;
    },
  });

  return (
    <SidebarProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <AnimatedContent>{children}</AnimatedContent>
        </SidebarInset>
      </HydrationBoundary>
    </SidebarProvider>
  );
}
