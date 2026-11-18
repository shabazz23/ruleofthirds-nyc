const isDev = process.env.NODE_ENV !== 'production';

// Content Security Policy: tells browsers which sources this site may load
// scripts, images, fonts and media from, so injected code from elsewhere is
// refused. 'unsafe-inline' is kept because the homepage intro uses a small
// inline script. api.web3forms.com delivers the contact form to the inbox.
// vercel.live is Vercel's preview toolbar (preview links only).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://vercel.live${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://vercel.live",
  "img-src 'self' data: blob: https://vercel.live https://vercel.com",
  "font-src 'self' data: https://vercel.live https://assets.vercel.com",
  "media-src 'self' blob:",
  "connect-src 'self' https://api.web3forms.com https://vercel.live wss://ws-us3.pusher.com",
  "frame-src https://vercel.live",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  // Always use HTTPS, for two years, on this domain and its subdomains.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Don't let other sites put this site inside a frame (stops look-alike "clickjacking" pages).
  { key: 'X-Frame-Options', value: 'DENY' },
  // Don't let browsers guess file types (stops disguised files running as code).
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // When a visitor clicks an outside link, share only the domain, not the full page address.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // The site never needs the camera, microphone or location, so switch them off.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
