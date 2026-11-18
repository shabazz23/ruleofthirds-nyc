// Wraps the app in Auth.js's SessionProvider so client components
// (Nav, checkout) can read the signed-in state with useSession().
// The session is fetched client-side from /api/auth/session, so no
// server component has to read cookies for the nav to work.
'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
