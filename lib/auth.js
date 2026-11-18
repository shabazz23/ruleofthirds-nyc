// Customer sign-in (Auth.js v5 / next-auth).
//
// Two ways to sign in:
// - Email + password (Credentials provider). Passwords are bcrypt-hashed
//   and stored in users.password_hash; see app/api/auth/signup/route.js.
// - Google (OAuth). Only registered when GOOGLE_CLIENT_ID and
//   GOOGLE_CLIENT_SECRET are set, so the site works without it.
//
// Sessions are JWTs: the Credentials provider doesn't support database
// sessions, so the adapter is used for users/accounts (OAuth linking) while
// the session itself lives in an encrypted cookie. The user id is copied
// onto the token and the session so server code can attach orders to the
// signed-in account.

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, dbConfigured } from './db';
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from './schema';

const providers = [
  Credentials({
    name: 'Email',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const email =
        typeof credentials?.email === 'string'
          ? credentials.email.trim().toLowerCase()
          : '';
      const password =
        typeof credentials?.password === 'string' ? credentials.password : '';
      if (!email || !password) return null;
      if (!dbConfigured()) {
        throw new Error(
          'POSTGRES_URL is not set. Create the Postgres database in Vercel (see SETUP.md).',
        );
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      // No password hash means a Google-only account — it can't sign in
      // with a password.
      if (!user?.passwordHash) return null;
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return null;
      return { id: user.id, email: user.email, name: user.name };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Google verifies the email address, so signing in with Google may
      // link to an existing account with the same email instead of
      // erroring out.
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  // Trust the host from the request headers (Vercel sets them correctly).
  // Without this, Auth.js rejects every request unless AUTH_URL matches the
  // host exactly — which breaks preview deployments and local development.
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/signin' },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      return session;
    },
  },
});
