import {
  sqliteTable,
  AnySQLiteColumn,
  text,
  numeric,
  integer,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const subscriptions = sqliteTable("subscriptions", {
  userId: text("user_id").primaryKey(),
  subscriptionId: text("subscription_id").notNull(),
  status: text().notNull(),
  currentPeriodStart: numeric("current_period_start"),
  currentPeriodEnd: numeric("current_period_end"),
  cancelAtPeriodEnd: integer("cancel_at_period_end", { mode: "boolean" }),
  startedAt: numeric("started_at"),
  productId: text("product_id").notNull(),
});
