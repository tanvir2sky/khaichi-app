import { describe, expect, it } from 'vitest'
import { world } from '../src/collections'
import { encodeLevels, type Level } from '../src/lib/encode'
import { decodeFor, encodeFor } from '../src/lib/slots'

const slotIds = world.slots!.map((s) => s.id)
const itemIds = world.items.map((s) => s.id)

describe('retired slots (world: Israel)', () => {
  it('old links made before the retirement keep every other country', () => {
    // A link from before: India, Israel and Turkey ticked, in the original 194-slot order.
    const old = new Array<Level>(194).fill(0)
    old[slotIds.indexOf('IN')] = 2
    old[slotIds.indexOf('IL')] = 1
    old[slotIds.indexOf('TR')] = 3
    const decoded = decodeFor(world, encodeLevels(old))
    expect(decoded).toHaveLength(193)
    expect(decoded[itemIds.indexOf('IN')]).toBe(2)
    expect(decoded[itemIds.indexOf('TR')]).toBe(3)
    expect(decoded.filter(Boolean)).toHaveLength(2) // Israel dropped, nothing shifted
  })

  it('round-trips visible levels and keeps the retired slot empty', () => {
    const lv = itemIds.map((_, i) => (i % 4) as Level)
    const s = encodeFor(world, lv)
    expect(s).toHaveLength(66) // still 194 slots → same link format as before
    expect(decodeFor(world, s)).toEqual(lv)
    const raw = new Array<Level>(194).fill(0)
    // the retired slot is always written as 0
    expect(decodeFor({ ...world, slots: undefined, items: world.slots! }, s)[slotIds.indexOf('IL')]).toBe(raw[0])
  })
})
