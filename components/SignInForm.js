// Sign-in form: email + password, plus Google when it's configured.
// Lives behind a <Suspense> boundary (see app/signin/page.js) because it
// reads the callbackUrl search param.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignInForm({ googleEnabled }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        setError('That email and password don’t match an account.');
        setBusy(false);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError('Something went wrong signing you in. Please try again.');
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn" type="submit" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="form-note" style={{ textAlign: 'center' }}>
        New here? <Link href="/signup">Create an account</Link>
      </p>
    </>
  );
}
