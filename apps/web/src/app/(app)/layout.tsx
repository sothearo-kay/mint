import {
  SidebarInset,
  SidebarProvider,
} from "@mint/ui/components/sidebar";
import { SyncTransactionsDialog } from "@/features/transactions/components/sync-dialog";
import { AppHeader } from "./_components/app-header";
import { AppSidebar } from "./_components/app-sidebar";
import { TransactionTray } from "./_components/transaction-tray";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <TransactionTray />
      <SyncTransactionsDialog />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 relative px-4 py-6 w-full max-w-3xl mx-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
