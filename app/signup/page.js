import { Suspense } from 'react';
import Reveal from '../../components/Reveal';
import SignUpForm from '../../components/SignUpForm';

export const metadata = {
  title: 'Create an account',
};

export default function SignUpPage() {
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
            Create an <em>account</em>
          </h1>
          <p className="lede">
            Keep your orders in one place — and check out faster next time.
          </p>
        </Reveal>
      </section>
      <section className="wrap auth-wrap">
        <Reveal>
          <div className="auth-card">
            <Suspense fallback={<p className="lede">Loading…</p>}>
              <SignUpForm googleEnabled={googleEnabled} />
            </Suspense>
          </div>
        </Reveal>
      </section>
    </>
  );
}
