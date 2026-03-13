import { WalletDetail } from "./_components/wallet-detail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WalletDetailPage({ params }: Props) {
  const { id } = await params;
  return <WalletDetail walletId={id} />;
}
