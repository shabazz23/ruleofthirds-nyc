// Served at /sitemap.xml: the list of pages search engines should know about.
const BASE = 'https://ruleofthirds.nyc';

const PAGES = [
  { path: '', priority: 1 },
  { path: '/about', priority: 0.9 },
  { path: '/gallery', priority: 0.8 },
  { path: '/featured-artists', priority: 0.7 },
  { path: '/shop', priority: 0.7 },
  { path: '/contact', priority: 0.6 },
  { path: '/terms', priority: 0.2 },
  { path: '/privacy', priority: 0.2 },
];

export default function sitemap() {
  return PAGES.map((p) => ({
    url: `${BASE}${p.path}`,
    changeFrequency: 'monthly',
    priority: p.priority,
  }));
}
