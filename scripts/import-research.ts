// Validates research/*.json (hand-curated, with sources) and writes the app data files:
//   research/districts-a.json + districts-b.json -> src/data/food64.json
//   research/pitha.json                          -> src/data/pitha.json
//   research/fol.json                            -> src/data/fol.json
// Sources for pitha/fol stay in research/*.json (not shipped); district sources are shown on district pages.
// Run: npm run import:data      (pass --placeholder to write stub data when research is missing)
import fs from 'node:fs'
import { DISTRICTS } from '../src/data/districts.ts'
import { FOOD_ICONS, FRUIT_ICONS, PITHA_ICONS } from '../src/icons/names.ts'

const placeholder = process.argv.includes('--placeholder')
const problems: string[] = []
const read = (p: string) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, '')) : null)
const write = (p: string, v: unknown) => fs.writeFileSync(p, JSON.stringify(v, null, 1) + '\n')
const bnText = (s: unknown) => typeof s === 'string' && /[ঀ-৿]/.test(s)

// ---- 64 districts ----
{
  const rows = [...(read('research/districts-a.json') ?? []), ...(read('research/districts-b.json') ?? [])]
  const byId = new Map<string, any>(rows.map((r: any) => [r.id, r]))
  const foodIcons = new Set<string>([...FOOD_ICONS, ...FRUIT_ICONS])
  const out: Record<string, unknown[]> = {}
  for (const d of DISTRICTS) {
    const r = byId.get(d.id)
    if (!r) {
      if (!placeholder) problems.push(`food64: missing district ${d.id}`)
      out[d.id] = [{ bn: '(তথ্য আসছে)', en: '', icon: 'rosogolla', desc: '', uncertain: true, sources: [] }]
      continue
    }
    if (!Array.isArray(r.foods) || r.foods.length < 1 || r.foods.length > 3) problems.push(`food64: ${d.id} needs 1–3 foods`)
    // Verified items first (stable), so the signature shown on maps/cards is the safest claim.
    const foods = [...(r.foods ?? [])].sort((x: any, y: any) => Number(Boolean(x.uncertain)) - Number(Boolean(y.uncertain)))
    out[d.id] = foods.map((f: any, i: number) => {
      if (!bnText(f.bn)) problems.push(`food64: ${d.id}[${i}] bn missing`)
      if (!foodIcons.has(f.icon)) problems.push(`food64: ${d.id}[${i}] bad icon "${f.icon}"`)
      return {
        bn: String(f.bn).trim(),
        en: String(f.en ?? '').trim(),
        icon: foodIcons.has(f.icon) ? f.icon : 'rosogolla',
        desc: String(f.desc_bn ?? '').trim(),
        uncertain: Boolean(f.uncertain),
        sources: Array.isArray(f.sources) ? f.sources.filter((s: unknown) => typeof s === 'string' && /^https?:\/\//.test(s)) : [],
      }
    })
  }
  const extra = [...byId.keys()].filter((id) => !DISTRICTS.some((d) => d.id === id))
  if (extra.length) problems.push(`food64: unknown ids ${extra.join(', ')}`)
  write('src/data/food64.json', out)
  const unsure = Object.entries(out).flatMap(([id, fs]) => (fs as any[]).filter((f) => f.uncertain).map((f) => `${id}:${f.bn}`))
  console.log(`food64: ${Object.keys(out).length} districts, ${unsure.length} uncertain`)
}

// ---- pitha & fol ----
function importList(name: 'pitha' | 'fol', icons: readonly string[], map: (r: any) => Record<string, unknown>) {
  const rows = read(`research/${name}.json`)
  if (!rows) {
    if (!placeholder) problems.push(`${name}: research/${name}.json missing`)
    if (!fs.existsSync(`src/data/${name}.json`)) write(`src/data/${name}.json`, [])
    return
  }
  const seen = new Set<string>()
  const out = rows.map((r: any, i: number) => {
    if (!/^[a-z0-9-]+$/.test(r.id ?? '')) problems.push(`${name}[${i}]: bad id "${r.id}"`)
    if (seen.has(r.id)) problems.push(`${name}: duplicate id ${r.id}`)
    seen.add(r.id)
    if (!bnText(r.bn)) problems.push(`${name}[${i}] ${r.id}: bn missing`)
    if (!icons.includes(r.icon)) problems.push(`${name}[${i}] ${r.id}: bad icon "${r.icon}"`)
    if (!/^#[0-9a-fA-F]{6}$/.test(r.tint ?? '')) problems.push(`${name}[${i}] ${r.id}: bad tint "${r.tint}"`)
    return map(r)
  })
  write(`src/data/${name}.json`, out)
  console.log(`${name}: ${out.length} items`)
}

importList('pitha', PITHA_ICONS, (r) => ({
  id: r.id,
  bn: r.bn.trim(),
  en: String(r.en ?? '').trim(),
  aka: Array.isArray(r.aka) ? r.aka : [],
  icon: r.icon,
  tint: r.tint,
  desc: String(r.desc_bn ?? '').trim(),
  region: String(r.region_bn ?? '').trim(),
}))

importList('fol', FRUIT_ICONS, (r) => ({
  id: r.id,
  bn: r.bn.trim(),
  en: String(r.en ?? '').trim(),
  sci: String(r.sci ?? '').trim(),
  icon: r.icon,
  tint: r.tint,
  season: String(r.season_bn ?? '').trim(),
  rarity: ['common', 'uncommon', 'rare'].includes(r.rarity) ? r.rarity : 'uncommon',
  desc: String(r.desc_bn ?? '').trim(),
}))

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n- ${problems.join('\n- ')}`)
  process.exit(1)
}
