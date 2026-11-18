'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton({ label = 'Sign out', className = 'btn btn-ghost btn-small' }) {
  return (
    <button
      className={className}
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      {label}
    </button>
  );
}
