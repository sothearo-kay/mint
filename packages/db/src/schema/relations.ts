import { relations } from "drizzle-orm";

import { account, session, user } from "./auth.schema";
import { budget } from "./budget.schema";
import { category } from "./category.schema";
import { recurringTransaction } from "./recurring-transaction.schema";
import { transaction } from "./transaction.schema";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  categories: many(category),
  transactions: many(transaction),
  recurringTransactions: many(recurringTransaction),
  budgets: many(budget),
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
  user: one(user, { fields: [category.userId], references: [user.id] }),
  transactions: many(transaction),
  recurringTransactions: many(recurringTransaction),
  budgets: many(budget),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
  user: one(user, { fields: [transaction.userId], references: [user.id] }),
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
