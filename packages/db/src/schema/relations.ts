import { relations } from "drizzle-orm";

import { account, session, user } from "./auth.schema";
import { budget } from "./budget.schema";
import { category } from "./category.schema";
import { recurringTransaction } from "./recurring-transaction.schema";
import { settings } from "./settings.schema";
import { transaction } from "./transaction.schema";
import { wallet } from "./wallet.schema";
import { walletTransfer } from "./wallet-transfer.schema";

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  categories: many(category),
  transactions: many(transaction),
  recurringTransactions: many(recurringTransaction),
  budgets: many(budget),
  wallets: many(wallet),
  settings: one(settings, { fields: [user.id], references: [settings.userId] }),
}));

export const walletRelations = relations(wallet, ({ one, many }) => ({
  user: one(user, { fields: [wallet.userId], references: [user.id] }),
  transactions: many(transaction),
  recurringTransactions: many(recurringTransaction),
  transfersFrom: many(walletTransfer, { relationName: "fromWallet" }),
  transfersTo: many(walletTransfer, { relationName: "toWallet" }),
}));

export const walletTransferRelations = relations(walletTransfer, ({ one }) => ({
  user: one(user, { fields: [walletTransfer.userId], references: [user.id] }),
  fromWallet: one(wallet, {
    fields: [walletTransfer.fromWalletId],
    references: [wallet.id],
    relationName: "fromWallet",
  }),
  toWallet: one(wallet, {
    fields: [walletTransfer.toWalletId],
    references: [wallet.id],
    relationName: "toWallet",
  }),
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
  user: one(user, { fields: [category.userId], references: [user.id] }),
  transactions: many(transaction),
  recurringTransactions: many(recurringTransaction),
  budgets: many(budget),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
  user: one(user, { fields: [transaction.userId], references: [user.id] }),
  wallet: one(wallet, { fields: [transaction.walletId], references: [wallet.id] }),
  category: one(category, {
    fields: [transaction.categoryId],
    references: [category.id],
  }),
  recurring: one(recurringTransaction, {
    fields: [transaction.recurringId],
    references: [recurringTransaction.id],
  }),
}));

export const recurringTransactionRelations = relations(
  recurringTransaction,
  ({ one, many }) => ({
    user: one(user, {
      fields: [recurringTransaction.userId],
      references: [user.id],
    }),
    wallet: one(wallet, {
      fields: [recurringTransaction.walletId],
      references: [wallet.id],
    }),
    category: one(category, {
      fields: [recurringTransaction.categoryId],
      references: [category.id],
    }),
    transactions: many(transaction),
  }),
);

export const budgetRelations = relations(budget, ({ one }) => ({
  user: one(user, { fields: [budget.userId], references: [user.id] }),
  category: one(category, {
    fields: [budget.categoryId],
    references: [category.id],
  }),
}));

export const settingsRelations = relations(settings, ({ one }) => ({
  user: one(user, { fields: [settings.userId], references: [user.id] }),
}));
