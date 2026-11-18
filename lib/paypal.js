// PayPal REST API (live) helpers. Server-only.
//
// Uses the live API at https://api-m.paypal.com with the Client ID +
// Secret of the "Rule of Thirds" REST API app in the PayPal Business
// account. The Client ID is the same public value the checkout page uses
// for the PayPal JS SDK (NEXT_PUBLIC_PAYPAL_CLIENT_ID); the Secret stays
// server-side in PAYPAL_CLIENT_SECRET.

const PAYPAL_API_BASE = 'https://api-m.paypal.com';

let cachedToken = null; // { token, expiresAt }

export async function getPayPalAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error(
      'PayPal is not configured. Add NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Vercel (see SETUP.md).',
    );
  }
  const basic = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error(
      `PayPal sign-in failed: ${data.error_description || data.error || res.status}`,
    );
  }
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 300) * 1000,
  };
  return cachedToken.token;
}

export async function paypalRequest(path, { method = 'GET', body } = {}) {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${PAYPAL_API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data?.details?.[0];
    throw new Error(
      `PayPal ${method} ${path} failed (${res.status}): ${
        detail?.description || data.message || 'unknown error'
      }`,
    );
  }
  return data;
}
