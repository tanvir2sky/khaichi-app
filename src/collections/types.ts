import type { IconName } from '../icons/names'

export type CollectionId = 'food64' | 'pitha' | 'fol' | 'world'
export type CollectionKind = 'bd-map' | 'world-map' | 'grid'

export interface Item {
  id: string
  bn: string
  en: string
  icon: IconName
  tint?: string
  /** Secondary line: signature food for a district, season for a fruit, region for a pitha. */
  sub?: string
  /** Group id (division / region / rarity) used for list sections. */
  group: string
  desc?: string
}

export interface Group {
  id: string
  bn: string
}

export interface Tier {
  min: number
  title: string
  line: string
}

export interface Theme {
  accent: string
  accentInk: string
  l1: string
  l2: string
  l3: string
  empty: string
}

export interface Collection {
  id: CollectionId
  route: string
  kind: CollectionKind
  /** Full product name, e.g. "আমি খেয়েছি: ৬৪ জেলা" */
  name: string
  /** Short nav label */
  short: string
  items: Item[]
  groups: Group[]
  /** Labels for level 1, 2, 3 */
  levels: [string, string, string]
  /** "৪১/৬৪ {unitLine}" on the card */
  unitLine: string
  /** Big CTA question, also printed on the card */
  question: string
  headline: string
  intro: string
  tiers: Tier[]
  theme: Theme
  seo: { title: string; description: string; keywords: string[] }
}
