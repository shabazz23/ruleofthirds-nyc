// Drizzle schema for the Rule of Thirds store.
//
// The users / accounts / sessions / verification_tokens tables mirror the
// official Auth.js Postgres schema (see @auth/drizzle-adapter), with two
// additions: a `password_hash` column on users for the Credentials provider
// and a `created_at` timestamp. The `orders` table records store purchases
// from Stripe and PayPal.
//
// Columns are snake_case in Postgres; drizzle maps them to camelCase JS
// properties. Keep db/schema.sql in sync with this file.

import {
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  // bcrypt hash for email/password sign-in. Null for Google-only accounts.
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const accounts = pgTable(
  'accounts',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compositePk: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

// One row per completed purchase. `provider_order_id` is the Stripe Checkout
// Session id or the PayPal order id — unique, so webhook/capture retries
// can't double-record an order. `user_id` is null for guest checkouts.
export const orders = pgTable('orders', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  email: text('email'),
  status: text('status').notNull().default('paid'),
  provider: text('provider').notNull(), // 'stripe' | 'paypal'
  providerOrderId: text('provider_order_id').notNull().unique(),
  providerPaymentId: text('provider_payment_id'),
  items: jsonb('items').notNull(),
  subtotalCents: integer('subtotal_cents').notNull(),
  shippingCents: integer('shipping_cents').notNull(),
  totalCents: integer('total_cents').notNull(),
  currency: text('currency').notNull().default('USD'),
  shippingAddress: jsonb('shipping_address'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});
