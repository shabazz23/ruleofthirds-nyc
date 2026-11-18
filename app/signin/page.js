import { Suspense } from 'react';
import Reveal from '../../components/Reveal';
import SignInForm from '../../components/SignInForm';

export const metadata = {
  title: 'Sign in',
};

export default function SignInPage() {
  // Google sign-in is only offered when the OAuth client is configured.
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
  return (
    <>
      <section className="page-hero center">
        <Reveal>
          <p className="eyebrow">Account</p>
          <h1>
            Sign <em>in</em>
          </h1>
        </Reveal>
      </section>
      <section className="wrap auth-wrap">
        <Reveal>
          <div className="auth-card">
            <Suspense fallback={<p className="lede">Loading…</p>}>
              <SignInForm googleEnabled={googleEnabled} />
            </Suspense>
          </div>
        </Reveal>
      </section>
    </>
  );
}
