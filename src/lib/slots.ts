// Share links and saved selections encode one level per *slot*, in a frozen order.
// A collection can retire an item (hide it everywhere) while keeping its slot, so existing links
// still decode correctly. These helpers convert between visible-item levels and slot levels.
import type { Collection } from '../collections/types'
import { decodeLevels, encodeLevels, type Level } from './encode'

function slotIndexes(c: Collection): number[] | null {
  if (!c.slots) return null
  const pos = new Map(c.slots.map((s, i) => [s.id, i]))
  return c.items.map((it) => pos.get(it.id)!)
}

const cache = new WeakMap<Collection, number[] | null>()
function indexes(c: Collection): number[] | null {
  if (!cache.has(c)) cache.set(c, slotIndexes(c))
  return cache.get(c)!
}

/** Encode visible-item levels into the frozen slot format (retired slots stay 0). */
export function encodeFor(c: Collection, levels: readonly Level[]): string {
  const idx = indexes(c)
  if (!idx) return encodeLevels(levels)
  const slots = new Array<Level>(c.slots!.length).fill(0)
  idx.forEach((s, i) => (slots[s] = levels[i] ?? 0))
  return encodeLevels(slots)
}

/** Decode a slot-format string into levels for the visible items only. */
export function decodeFor(c: Collection, s: string | null | undefined): Level[] {
  const idx = indexes(c)
  if (!idx) return decodeLevels(s, c.items.length)
  const slots = decodeLevels(s, c.slots!.length)
  return idx.map((i) => slots[i])
}
