// Smoke test on a phone viewport: tick items → generate cards → save PNGs to e2e/out for visual review.
// Run after `VITE_SITE_URL=http://localhost:4173 npm run build`:  npm run e2e
import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import { encodeLevels } from '../src/lib/encode'

const OUT = 'e2e/out'
fs.mkdirSync(OUT, { recursive: true })

async function tick(page: Page, n: number) {
  const rows = page.getByRole('checkbox')
  for (let i = 0; i < n; i++) await rows.nth(i * 2).click()
}

async function saveCard(page: Page, file: string) {
  const img = page.getByAltText('আপনার শেয়ার কার্ড')
  await expect(img).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText('আপডেট হচ্ছে…')).toHaveCount(0, { timeout: 30_000 })
  const b64 = await img.evaluate(async (el: HTMLImageElement) => {
    const blob = await (await fetch(el.src)).blob()
    const buf = new Uint8Array(await blob.arrayBuffer())
    let s = ''
    for (const x of buf) s += String.fromCharCode(x)
    return btoa(s)
  })
  fs.writeFileSync(`${OUT}/${file}`, Buffer.from(b64, 'base64'))
}

async function cardsFor(page: Page, path: string, name: string, ticks: number) {
  await page.goto(path)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await tick(page, ticks)
  // upgrade a couple of items to higher levels
  await page.getByRole('radio', { name: /গিয়ে|বানিয়েছি|পেড়ে|ঘুরেছি/ }).first().click()
  await page.getByRole('radio').nth(5).click()
  await page.getByRole('button', { name: 'কার্ড বানান →' }).click()
  await page.getByPlaceholder('আপনার নাম (ঐচ্ছিক)').fill('রাহাত')
  await saveCard(page, `${name}-feed.png`)
  await page.getByRole('tab', { name: 'স্টোরি' }).click()
  await page.waitForTimeout(500)
  await saveCard(page, `${name}-story.png`)
}

test('food64 cards', async ({ page }) => {
  await cardsFor(page, '/', 'food64', 18)
  // persisted after reload
  await page.reload()
  await expect(page.locator('main').getByText('/৬৪').first()).toBeVisible()
})

test('pitha cards', async ({ page }) => {
  await cardsFor(page, '/pitha/', 'pitha', 12)
})

test('fol cards', async ({ page }) => {
  await cardsFor(page, '/fol/', 'fol', 15)
})

test('world cards', async ({ page }) => {
  await cardsFor(page, '/world/', 'world', 14)
})

test('compare via friend link', async ({ page }) => {
  const friend = Array.from({ length: 64 }, (_, i) => (i % 3 === 0 ? 2 : i % 5 === 0 ? 1 : 0))
  await page.goto(`/?v=1&m=${encodeLevels(friend)}&n=${encodeURIComponent('তানভীর')}`)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.getByText('তানভীর').first()).toBeVisible()
  await tick(page, 14)
  await page.getByRole('button', { name: 'তুলনার কার্ড বানান' }).click()
  await saveCard(page, 'compare-feed.png')
})

test('district page and prerendered SEO html', async ({ page, request }) => {
  await page.goto('/district/bogura/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('বগুড়া')
  const html = await (await request.get('/district/bogura/')).text()
  expect(html).toContain('<link rel="canonical" href="http://localhost:4173/district/bogura/"')
  expect(html).toContain('দই')
  expect(html).toContain('application/ld+json')
  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap.match(/<loc>/g)?.length).toBe(69)
})

test('phone UI screenshots', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await tick(page, 6)
  await page.screenshot({ path: `${OUT}/ui-home.png` })
  await page.getByRole('checkbox').nth(0).scrollIntoViewIfNeeded()
  await page.screenshot({ path: `${OUT}/ui-list.png` })
  await page.goto('/district/tangail/')
  await page.screenshot({ path: `${OUT}/ui-district.png`, fullPage: true })
})

test('no horizontal page scroll on phone', async ({ page }) => {
  for (const p of ['/', '/pitha/', '/fol/', '/world/', '/district/bogura/', '/leaderboard/']) {
    await page.goto(p)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, p).toBeLessThanOrEqual(0)
  }
})
