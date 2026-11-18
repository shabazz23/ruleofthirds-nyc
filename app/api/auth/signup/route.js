// Customer sign-up: creates an account for email/password sign-in.
// Passwords are bcrypt-hashed; the plain password never touches the
// database. After a successful sign-up the signup page signs the customer
// straight in with the Credentials provider.

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, dbConfigured } from '@/lib/db';
import { users } from '@/lib/schema';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email =
    typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!name) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Your password needs to be at least 8 characters.' },
      { status: 400 },
    );
  }

  try {
    if (!dbConfigured()) {
      return NextResponse.json(
        { error: 'The store database is not set up yet. Please try again later.' },
        { status: 500 },
      );
    }
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Try signing in.' },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db.insert(users).values({ name, email, passwordHash });
    return NextResponse.json({ ok: true });
  } catch (err) {
    // A race with another sign-up for the same email lands here as a
    // unique-violation; treat it like the pre-check above.
    if (err?.code === '23505') {
      return NextResponse.json(
        { error: 'An account with this email already exists. Try signing in.' },
        { status: 409 },
      );
    }
    console.error('Signup failed:', err);
    return NextResponse.json(
      { error: 'Something went wrong creating your account. Please try again.' },
      { status: 500 },
    );
  }
}
