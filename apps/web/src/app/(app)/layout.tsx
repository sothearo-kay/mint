import {
  SidebarInset,
  SidebarProvider,
} from "@mint/ui/components/sidebar";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { getSessionQueryOptions } from "@/features/auth/api/session";
import { SyncTransactionsDialog } from "@/features/transactions/components/sync-dialog";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/react-query";
import { AppHeader } from "./_components/app-header";
import { AppSidebar } from "./_components/app-sidebar";
import { TransactionTray } from "./_components/transaction-tray";

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider>
        <AppSidebar />
        <TransactionTray />
        <SyncTransactionsDialog />
        <SidebarInset>
          <div className="h-dvh flex flex-col overflow-auto">
            <AppHeader />
            <main className="flex-1 relative px-4 py-8 w-full max-w-3xl mx-auto">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
