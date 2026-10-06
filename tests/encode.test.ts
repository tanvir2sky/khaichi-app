import { describe, expect, it } from 'vitest'
import { decodeLevels, encodeLevels, type Level } from '../src/lib/encode'
import { compare, tally } from '../src/lib/score'

const rand = (n: number, seed: number): Level[] => {
  let s = seed
  return Array.from({ length: n }, () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return (s % 4) as Level
  })
}

describe('encodeLevels / decodeLevels', () => {
  it.each([1, 3, 4, 5, 38, 51, 64, 194])('round-trips random levels for n=%i', (n) => {
    for (let seed = 1; seed < 20; seed++) {
      const lv = rand(n, seed)
      expect(decodeLevels(encodeLevels(lv), n)).toEqual(lv)
    }
  })

  it('round-trips empty, full and each single level', () => {
    for (const l of [0, 1, 2, 3] as Level[]) {
      const lv = new Array<Level>(64).fill(l)
      expect(decodeLevels(encodeLevels(lv), 64)).toEqual(lv)
    }
  })

  it('is compact and URL-safe', () => {
    const s64 = encodeLevels(rand(64, 7))
    const s194 = encodeLevels(rand(194, 7))
    expect(s64).toHaveLength(22)
    expect(s194).toHaveLength(66)
    expect(s64 + s194).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('returns all zeros for garbage or missing input', () => {
    expect(decodeLevels('', 8)).toEqual(new Array(8).fill(0))
    expect(decodeLevels(null, 8)).toEqual(new Array(8).fill(0))
    expect(decodeLevels('not valid!!', 8)).toEqual(new Array(8).fill(0))
  })

  it('pads short input with zeros instead of failing', () => {
    const lv = rand(64, 3)
    const short = encodeLevels(lv.slice(0, 10))
    expect(decodeLevels(short, 64).slice(0, 10)).toEqual(lv.slice(0, 10))
    expect(decodeLevels(short, 64).slice(12)).toEqual(new Array(52).fill(0))
  })
})

describe('tally / compare', () => {
  it('counts items and sums levels', () => {
    const t = tally([0, 1, 2, 3, 3, 0])
    expect(t).toEqual({ count: 4, score: 9, byLevel: [2, 1, 1, 2] })
  })

  it('splits both / only me / only them', () => {
    expect(compare([1, 0, 2, 0, 3], [1, 1, 0, 0, 2])).toEqual({ both: 2, onlyMe: 1, onlyThem: 1 })
  })
})
