// Order records. Server-only.

import { desc, eq } from 'drizzle-orm';
import { db } from './db';
import { orders } from './schema';

// Inserts an order. Idempotent on the provider's order id: if a Stripe
// webhook or a PayPal capture is retried, the second attempt inserts
// nothing and this returns null.
export async function recordOrder(order) {
  const [row] = await db
    .insert(orders)
    .values(order)
    .onConflictDoNothing({ target: orders.providerOrderId })
    .returning();
  return row ?? null;
}

export async function getOrdersForUser(userId) {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}
