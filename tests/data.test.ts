import { describe, expect, it } from 'vitest'
import bdMap from '../src/data/bdMap.json'
import worldMap from '../src/data/worldMap.json'
import { COLLECTIONS } from '../src/collections'
import { FOODS_BY_DISTRICT } from '../src/collections/food64'
import { tierFor } from '../src/collections/tiers'
import { DISTRICTS, DIVISIONS } from '../src/data/districts'
import { isIconName } from '../src/icons/names'
import { bn, genitive } from '../src/lib/bn'

describe('frozen item order (share links depend on it — append only)', () => {
  // If this fails because you reordered or removed an item, existing share links will decode wrongly.
  // Only append new items at the end, then update the expected prefix here.
  it('districts', () => {
    expect(DISTRICTS.map((d) => d.id).join(',')).toMatchInlineSnapshot(
      `"dhaka,faridpur,gazipur,gopalganj,kishoreganj,madaripur,manikganj,munshiganj,narayanganj,narsingdi,rajbari,shariatpur,tangail,bandarban,brahmanbaria,chandpur,chattogram,cumilla,coxsbazar,feni,khagrachhari,lakshmipur,noakhali,rangamati,bogura,chapainawabganj,joypurhat,naogaon,natore,pabna,rajshahi,sirajganj,bagerhat,chuadanga,jashore,jhenaidah,khulna,kushtia,magura,meherpur,narail,satkhira,barguna,barishal,bhola,jhalokathi,patuakhali,pirojpur,habiganj,moulvibazar,sunamganj,sylhet,dinajpur,gaibandha,kurigram,lalmonirhat,nilphamari,panchagarh,rangpur,thakurgaon,jamalpur,mymensingh,netrokona,sherpur"`,
    )
  })

  it.each(COLLECTIONS.map((c) => [c.id, c] as const))('%s ids are unique', (_, c) => {
    const ids = c.items.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('data integrity', () => {
  it('has 64 districts across 8 divisions, each with map geometry and food', () => {
    expect(DISTRICTS).toHaveLength(64)
    expect(new Set(DISTRICTS.map((d) => d.division))).toEqual(new Set(DIVISIONS.map((d) => d.id)))
    for (const d of DISTRICTS) {
      expect((bdMap.districts as Record<string, unknown>)[d.id], d.id).toBeTruthy()
      const foods = FOODS_BY_DISTRICT[d.id]
      expect(foods?.length, d.id).toBeGreaterThan(0)
      for (const f of foods) {
        expect(f.bn, d.id).toMatch(/[ঀ-৿]/)
        expect(f.bn, d.id).not.toContain('তথ্য আসছে')
      }
    }
  })

  it('every item has a known icon and Bangla name', () => {
    for (const c of COLLECTIONS) {
      for (const it of c.items) {
        expect(isIconName(it.icon), `${c.id}/${it.id}`).toBe(true)
        expect(it.bn, `${c.id}/${it.id}`).toMatch(/[ঀ-৿]/)
        expect(c.groups.some((g) => g.id === it.group), `${c.id}/${it.id} group`).toBe(true)
      }
    }
  })

  it('world list shows 193 countries (Israel retired) over 194 frozen slots', () => {
    const world = COLLECTIONS.find((c) => c.id === 'world')!
    expect(world.items).toHaveLength(193)
    expect(world.slots).toHaveLength(194)
    expect(world.items.some((it) => it.id === 'IL')).toBe(false)
    expect(world.items.some((it) => it.id === 'PS')).toBe(true)
    for (const it of world.items) expect((worldMap.countries as Record<string, unknown>)[it.id], it.id).toBeTruthy()
  })

  it('pitha and fol lists are populated', () => {
    expect(COLLECTIONS.find((c) => c.id === 'pitha')!.items.length).toBeGreaterThanOrEqual(30)
    expect(COLLECTIONS.find((c) => c.id === 'fol')!.items.length).toBeGreaterThanOrEqual(40)
  })
})

describe('tiers', () => {
  it.each(COLLECTIONS.map((c) => [c.id, c] as const))('%s tiers are ordered and cover 0..n', (_, c) => {
    expect(c.tiers[0].min).toBe(0)
    for (let i = 1; i < c.tiers.length; i++) expect(c.tiers[i].min).toBeGreaterThan(c.tiers[i - 1].min)
    expect(c.tiers[c.tiers.length - 1].min).toBeLessThanOrEqual(c.items.length)
    // every count maps to a tier; full completion gets the top tier for capped lists
    for (let n = 0; n <= c.items.length; n++) expect(tierFor(c.tiers, n)).toBeTruthy()
  })

  it('food64 boundaries', () => {
    const c = COLLECTIONS[0]
    expect(tierFor(c.tiers, 0).title).toBe('ভাত-ডাল বিশেষজ্ঞ')
    expect(tierFor(c.tiers, 4).title).toBe('ভাত-ডাল বিশেষজ্ঞ')
    expect(tierFor(c.tiers, 5).title).toBe('নবিশ খাদক')
    expect(tierFor(c.tiers, 63).title).toBe('জাতীয় খাদ্য রত্ন')
    expect(tierFor(c.tiers, 64).title).toBe('খাদ্য-বিশ্বজয়ী')
  })
})

describe('bangla helpers', () => {
  it('converts digits', () => {
    expect(bn(1234567890)).toBe('১২৩৪৫৬৭৮৯০')
    expect(bn('41/64')).toBe('৪১/৬৪')
  })
  it('builds genitives', () => {
    expect(genitive('রাহাত')).toBe('রাহাতের')
    expect(genitive('ঢাকা')).toBe('ঢাকার')
    expect(genitive('বগুড়া')).toBe('বগুড়ার')
    expect(genitive('সিলেট')).toBe('সিলেটের')
    expect(genitive('নোয়াখালী')).toBe('নোয়াখালীর')
    expect(genitive('Rahat')).toBe('Rahat-এর')
  })
})
