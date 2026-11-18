// Sign-up form: creates the account, then signs the customer straight in.
// Lives behind a <Suspense> boundary (see app/signup/page.js) because it
// reads the callbackUrl search param.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignUpForm({ googleEnabled }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Those passwords don’t match.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not create your account.');
        setBusy(false);
        return;
      }
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        // Account exists but auto sign-in failed — send them to sign in.
        router.push(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError('Something went wrong creating your account. Please try again.');
      setBusy(false);
    }
  };

  return (
    <>
      {googleEnabled && (
        <>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => signIn('google', { callbackUrl })}
            style={{ width: '100%', marginBottom: '1.5rem' }}
          >
            Continue with Google
          </button>
          <p className="auth-divider">
            <span>or with email</span>
          </p>
        </>
      )}
      <form onSubmit={handleSubmit}>
        {error && (
          <p className="form-note form-error" role="alert">
            {error}
          </p>
        )}
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="confirm">Confirm password</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <button className="btn" type="submit" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Creating your account…' : 'Create account'}
        </button>
      </form>
      <p className="form-note" style={{ textAlign: 'center' }}>
        Already have an account? <Link href="/signin">Sign in</Link>
      </p>
    </>
  );
}
