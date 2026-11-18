// Served at /robots.txt: tells search engines what to read and where the sitemap is.
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/checkout/'] },
    sitemap: 'https://ruleofthirds.nyc/sitemap.xml',
    host: 'https://ruleofthirds.nyc',
  };
}
