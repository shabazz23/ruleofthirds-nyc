// Postgres client for the store (Vercel Postgres, backed by Neon).
//
// The client is created eagerly at import time: the Auth.js Drizzle adapter
// checks the client's class when the auth config loads, so a lazy proxy
// won't do. No connection is opened until the first query runs, so
// `next build` works fine without a database configured.
//
// When POSTGRES_URL is unset, a dummy local URL stands in — it is never
// queried, because every database-backed route checks dbConfigured() first
// and returns a clear error instead of attempting a connection.

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const url =
  process.env.POSTGRES_URL || 'postgresql://localhost:5432/ruleofthirds';

export const db = drizzle(neon(url), { schema });

// True when a real database is configured.
export function dbConfigured() {
  return Boolean(process.env.POSTGRES_URL);
}
