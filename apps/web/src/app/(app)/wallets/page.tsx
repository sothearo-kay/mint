import { Suspense } from "react";
import { WalletsDashboard } from "./_components/wallets-dashboard";

export default function WalletsPage() {
  return (
    <Suspense>
      <WalletsDashboard />
    </Suspense>
  );
}
