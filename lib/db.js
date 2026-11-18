// Postgres client for the store.
//
// Works with any standard Postgres — the database Vercel provisions for
// this project is Prisma Postgres, so the client is the plain postgres.js
// driver, not a vendor-specific HTTP driver. (An earlier version used the
// Neon HTTP driver, which only talks to Neon endpoints and returned 404s
// against Prisma Postgres, breaking sign-up.)
//
// The client is created eagerly at import time: the Auth.js Drizzle adapter
// checks the client's class when the auth config loads, so a lazy proxy
// won't do. No connection is opened until the first query runs, so
// `next build` works fine without a database configured.
//
// When no database URL is set, a dummy local URL stands in — it is never
// queried, because every database-backed route checks dbConfigured() first
// and returns a clear error instead of attempting a connection.
//
// `prepare: false` is required when the connection goes through a
// transaction pooler (the pooled URL Vercel adds for Prisma Postgres),
// because prepared statements don't survive pooling; it is harmless on a
// direct connection too.

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

// Prefer the pooled connection string on serverless (Vercel adds it as
// POSTGRES_DATABASE_URL_POOLED for Prisma Postgres); fall back to the
// direct POSTGRES_URL.
const url =
  process.env.POSTGRES_DATABASE_URL_POOLED ||
  process.env.POSTGRES_URL ||
  'postgresql://localhost:5432/ruleofthirds';

const client = postgres(url, { prepare: false });

export const db = drizzle(client, { schema });

// True when a real database is configured.
export function dbConfigured() {
  return Boolean(
    process.env.POSTGRES_DATABASE_URL_POOLED || process.env.POSTGRES_URL,
  );
}
