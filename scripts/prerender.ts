// Post-build: writes dist/<route>/index.html for every route with unique <title>, description,
// canonical, OG/Twitter tags, JSON-LD and real static content inside #root (for Facebook's crawler
// and non-JS bots; React replaces it on load). Also writes sitemap.xml and robots.txt.
import fs from 'node:fs'
import path from 'node:path'
import { loadEnv } from 'vite'

const env = loadEnv('production', process.cwd(), 'VITE_')
Object.assign(process.env, env)
if (!process.env.VITE_SITE_URL) {
  throw new Error('Set VITE_SITE_URL (e.g. https://yourdomain.com) in .env — canonical URLs, OG tags and the sitemap depend on it.')
}

const { SITE_URL, AUTHOR } = await import('../src/lib/config.ts')
const { COLLECTIONS } = await import('../src/collections/index.ts')
const { FOODS_BY_DISTRICT } = await import('../src/collections/food64.ts')
const { DISTRICTS, DIVISIONS, DISTRICT_BY_ID, DIVISION_BY_ID } = await import('../src/data/districts.ts')
const { genitive } = await import('../src/lib/bn.ts')
const { routePath } = await import('../src/lib/state.ts')
const bdMap = JSON.parse(fs.readFileSync('src/data/bdMap.json', 'utf8')) as { districts: Record<string, { n: string[] }> }

const DIST = path.resolve('dist')
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
const BUILD_DATE = new Date().toISOString().slice(0, 10)

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const abs = (p: string) => `${SITE_URL}${p}`

// Preload the Bengali subsets of the two fonts used above the fold.
const assets = fs.readdirSync(path.join(DIST, 'assets'))
const preloads = assets
  .filter((f) => /^(hind-siliguri-bengali-400|tiro-bangla-bengali-400)-normal.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ')

interface Page {
  path: string
  title: string
  description: string
  ogImage: string
  body: string
  jsonld: object[]
  priority: string
}

function head(p: Page): string {
  const url = abs(p.path)
  return [
    `<title>${esc(p.title)}</title>`,
    `<meta name="description" content="${esc(p.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="আমি খেয়েছি" />`,
    `<meta property="og:locale" content="bn_BD" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta property="og:image" content="${abs(p.ogImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    preloads,
    ...p.jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`),
  ].join('\n    ')
}

function render(p: Page): string {
  return template
    .replace(/<!--head-->[\s\S]*?<!--\/head-->/, head(p))
    .replace('<!--app-->', `<div class="seo">${p.body}</div>`)
}

const nav = `<nav><a href="/">৬৪ জেলার খাবার</a> · <a href="/pitha/">পিঠা</a> · <a href="/fol/">দেশি ফল</a> · <a href="/world/">বিশ্ব ভ্রমণ</a></nav>`

const pages: Page[] = []

for (const c of COLLECTIONS) {
  const p = routePath(c.route)
  let list = ''
  if (c.id === 'food64') {
    list = DIVISIONS.map(
      (dv) =>
        `<h2>${esc(dv.bn)} বিভাগ</h2><ul>${DISTRICTS.filter((d) => d.division === dv.id)
          .map((d) => `<li><a href="/district/${d.id}/">${esc(d.bn)}</a>: ${esc((FOODS_BY_DISTRICT[d.id] ?? []).map((f) => f.bn).join(', '))}</li>`)
          .join('')}</ul>`,
    ).join('')
  } else {
    list = c.groups
      .map((g) => {
        const rows = c.items.filter((it) => it.group === g.id)
        if (!rows.length) return ''
        return `<h2>${esc(g.bn)}</h2><ul>${rows
          .map((it) => `<li><strong>${esc(it.bn)}</strong>${it.desc ? `: ${esc(it.desc)}` : ''}${it.sub ? ` <small>(${esc(it.sub)})</small>` : ''}</li>`)
          .join('')}</ul>`
      })
      .join('')
  }
  const faq =
    c.id === 'food64'
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: DISTRICTS.slice(0, 64).map((d) => ({
            '@type': 'Question',
            name: `${genitive(d.bn)} বিখ্যাত খাবার কী?`,
            acceptedAnswer: { '@type': 'Answer', text: `${genitive(d.bn)} বিখ্যাত খাবার: ${(FOODS_BY_DISTRICT[d.id] ?? []).map((f) => f.bn).join(', ')}।` },
          })),
        }
      : null
  pages.push({
    path: p,
    title: c.seo.title,
    description: c.seo.description,
    ogImage: `/og/${c.id}.png`,
    priority: c.id === 'food64' ? '1.0' : '0.8',
    body: `${nav}<h1>${esc(c.headline)}</h1><p>${esc(c.intro)}</p>${list}`,
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: c.name,
        url: abs(p),
        applicationCategory: 'EntertainmentApplication',
        author: { '@type': 'Person', name: AUTHOR.name, email: AUTHOR.email },
        operatingSystem: 'Any',
        inLanguage: 'bn',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'BDT' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: c.headline,
        numberOfItems: c.items.length,
        itemListElement: c.items.map((it, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.id === 'food64' ? `${it.bn}: ${it.sub}` : it.bn,
          ...(c.id === 'food64' ? { url: abs(`/district/${it.id}/`) } : {}),
        })),
      },
      ...(faq ? [faq] : []),
    ],
  })
}

for (const d of DISTRICTS) {
  const foods = FOODS_BY_DISTRICT[d.id] ?? []
  const names = foods.map((f) => f.bn).join(', ')
  const nbrs = (bdMap.districts[d.id]?.n ?? []).map((n) => DISTRICT_BY_ID[n]).filter(Boolean)
  const p = `/district/${d.id}/`
  pages.push({
    path: p,
    title: `${genitive(d.bn)} বিখ্যাত খাবার কী? ${names} | আমি খেয়েছি`,
    description: `${genitive(d.bn)} বিখ্যাত খাবার: ${names}। ${foods[0]?.desc ?? ''}`.trim().slice(0, 300),
    ogImage: '/og/food64.png',
    priority: '0.6',
    body: `${nav}<p><a href="/">৬৪ জেলার খাবার</a> › ${esc(DIVISION_BY_ID[d.division].bn)} বিভাগ › ${esc(d.bn)}</p><h1>${esc(genitive(d.bn))} বিখ্যাত খাবার</h1><ul>${foods
      .map((f) => `<li><strong>${esc(f.bn)}</strong>${f.en ? ` (${esc(f.en)})` : ''}${f.desc ? `: ${esc(f.desc)}` : ''}</li>`)
      .join('')}</ul>${nbrs.length ? `<h2>পাশের জেলার খাবার</h2><ul>${nbrs.map((n) => `<li><a href="/district/${n.id}/">${esc(n.bn)}</a></li>`).join('')}</ul>` : ''}<p><a href="/">৬৪ জেলার বিখ্যাত খাবারের কয়টা খেয়েছেন? টিক দিয়ে দেখুন</a></p>`,
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `${genitive(d.bn)} বিখ্যাত খাবার কী?`,
            acceptedAnswer: { '@type': 'Answer', text: `${genitive(d.bn)} বিখ্যাত খাবার: ${names}। ${foods[0]?.desc ?? ''}`.trim() },
          },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '৬৪ জেলার খাবার', item: abs('/') },
          { '@type': 'ListItem', position: 2, name: d.bn, item: abs(p) },
        ],
      },
    ],
  })
}

pages.push({
  path: '/leaderboard/',
  title: 'জেলা লিডারবোর্ড: কোন জেলার মানুষ সবচেয়ে ভোজনরসিক? | আমি খেয়েছি',
  description: 'কোন জেলার মানুষ সবচেয়ে বেশি জেলার বিখ্যাত খাবার, পিঠা আর দেশি ফল খেয়েছে, কারা সবচেয়ে বেশি দেশ ঘুরেছে — জেলাভিত্তিক লিডারবোর্ড।',
  ogImage: '/og/food64.png',
  priority: '0.5',
  body: `${nav}<h1>কোন জেলার মানুষ সবচেয়ে এগিয়ে?</h1><p>জেলার সবার গড় স্কোর দিয়ে র‍্যাংকিং।</p>`,
  jsonld: [],
})

for (const p of pages) {
  const file = path.join(DIST, p.path, 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, render(p))
}

fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${BUILD_DATE}</lastmod><priority>${p.priority}</priority></url>`)
    .join('\n')}\n</urlset>\n`,
)
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`)

console.log(`prerendered ${pages.length} pages for ${SITE_URL}`)
