// Renders public/og/<collection>.png (1200×630) for Facebook/WhatsApp link previews.
// Uses headless Chromium (Playwright) so Bangla is shaped correctly. Run: npm run og
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'
import { COLLECTIONS } from '../src/collections/index.ts'
import { DISTRICTS } from '../src/data/districts.ts'

const bdMap = JSON.parse(fs.readFileSync('src/data/bdMap.json', 'utf8'))
// Inline as data URLs: file:// fonts are blocked on the about:blank page used by setContent.
const font = (pkg: string, file: string) =>
  `data:font/woff2;base64,${fs.readFileSync(path.resolve('node_modules/@fontsource', pkg, 'files', file)).toString('base64')}`

const css = `
@font-face { font-family: 'Hind Siliguri'; font-weight: 400; src: url(${font('hind-siliguri', 'hind-siliguri-bengali-400-normal.woff2')}); unicode-range: U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0-1CF9, U+200C-200D, U+20B9, U+25CC, U+A8F1; }
@font-face { font-family: 'Hind Siliguri'; font-weight: 700; src: url(${font('hind-siliguri', 'hind-siliguri-bengali-700-normal.woff2')}); unicode-range: U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0-1CF9, U+200C-200D, U+20B9, U+25CC, U+A8F1; }
@font-face { font-family: 'Hind Siliguri'; font-weight: 700; src: url(${font('hind-siliguri', 'hind-siliguri-latin-700-normal.woff2')}); unicode-range: U+0000-00FF; }
@font-face { font-family: 'Tiro Bangla'; src: url(${font('tiro-bangla', 'tiro-bangla-bengali-400-normal.woff2')}); }
* { box-sizing: border-box; margin: 0 }
body { width: 1200px; height: 630px; background: #FFF8EC; color: #2B1B12; font-family: 'Hind Siliguri'; overflow: hidden; }
`

// A pleasant, deterministic "filled" demo pattern for the preview.
const demo = (n: number) => Array.from({ length: n }, (_, i) => [0, 1, 0, 2, 1, 0, 3, 0][(i * 7 + 3) % 8])

function mapSvg(theme: { l1: string; l2: string; l3: string; empty: string }) {
  const lv = demo(64)
  const fill = (l: number) => [theme.empty, theme.l1, theme.l2, theme.l3][l]
  return `<svg viewBox="-4 -4 ${bdMap.w + 8} ${bdMap.h + 8}" style="height:560px">
    ${DISTRICTS.map((d, i) => `<path d="${bdMap.districts[d.id].d}" fill="${fill(lv[i])}" stroke="#FFFDF7" stroke-width="1.4"/>`).join('')}
    <path d="${bdMap.divisions}" fill="none" stroke="#3A2417" stroke-opacity=".45" stroke-width="1.6"/></svg>`
}

function page(c: (typeof COLLECTIONS)[number]) {
  const t = c.theme
  const art =
    c.kind === 'bd-map'
      ? mapSvg(t)
      : `<div style="font-family:'Tiro Bangla';font-size:300px;line-height:1;color:${t.accent};opacity:.9">${c.id === 'world' ? '১৯৪' : c.id === 'pitha' ? 'পিঠা' : 'ফল'}</div>`
  return `<!doctype html><html lang="bn"><head><meta charset="utf-8"><style>${css}</style></head><body>
  <div style="position:absolute;inset:18px;border:4px dashed ${t.accent};border-radius:28px"></div>
  <div style="display:flex;height:100%;align-items:center;padding:0 70px;gap:30px">
    <div style="flex:1">
      <div style="font-family:'Tiro Bangla';font-size:34px;color:${t.accent}">${c.name}</div>
      <div style="font-weight:700;font-size:62px;line-height:1.2;margin-top:18px">${c.headline}</div>
      <div style="margin-top:30px;display:inline-block;background:${t.accent};color:#fff;font-weight:700;font-size:32px;border-radius:999px;padding:10px 30px 14px">টিক দিন, কার্ড বানান →</div>
    </div>
    <div style="flex-shrink:0">${art}</div>
  </div></body></html>`
}

const browser = await chromium.launch()
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } })
fs.mkdirSync('public/og', { recursive: true })
for (const c of COLLECTIONS) {
  await tab.setContent(page(c), { waitUntil: 'load' })
  await tab.evaluate(() => document.fonts.ready)
  await tab.screenshot({ path: `public/og/${c.id}.png` })
  console.log(`public/og/${c.id}.png`)
}
await browser.close()
