import type { QueryClient } from "@tanstack/react-query";
import { getCategorySummaryQueryOptions } from "@/features/categories/api/get-summary";
import { getBreakdownQueryOptions } from "@/features/insights/api/get-breakdown";
import { getInsightsQueryOptions } from "@/features/insights/api/get-insights";
import { getWalletsQueryOptions } from "@/features/wallets/api/get-wallets";
import { getTransactionsQueryOptions } from "./get-transactions";

export function invalidateTransactionQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: getTransactionsQueryOptions().queryKey });
  queryClient.invalidateQueries({ queryKey: getWalletsQueryOptions().queryKey });
  queryClient.invalidateQueries({ queryKey: getInsightsQueryOptions().queryKey });
  queryClient.invalidateQueries({ queryKey: getBreakdownQueryOptions().queryKey });
  queryClient.invalidateQueries({ queryKey: getCategorySummaryQueryOptions().queryKey });
}
