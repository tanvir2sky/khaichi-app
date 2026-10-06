import type { Tier } from './types'

/** Build tiers from fractions of n so they scale with list length. Last tier is "all". */
export function fractionTiers(n: number, rows: [number, string, string][]): Tier[] {
  return rows.map(([f, title, line]) => ({ min: f >= 1 ? n : Math.ceil(f * n), title, line }))
}

export function tierFor(tiers: Tier[], count: number): Tier {
  let t = tiers[0]
  for (const x of tiers) if (count >= x.min) t = x
  return t
}
