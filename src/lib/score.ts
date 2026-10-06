import type { Level } from './encode'

export interface Tally {
  count: number // items with level >= 1
  score: number // sum of levels
  byLevel: [number, number, number, number]
}

export function tally(levels: readonly Level[]): Tally {
  const byLevel: [number, number, number, number] = [0, 0, 0, 0]
  let score = 0
  for (const l of levels) {
    byLevel[l]++
    score += l
  }
  return { count: levels.length - byLevel[0], score, byLevel }
}

export interface Comparison {
  both: number
  onlyMe: number
  onlyThem: number
}

export function compare(me: readonly Level[], them: readonly Level[]): Comparison {
  let both = 0
  let onlyMe = 0
  let onlyThem = 0
  for (let i = 0; i < me.length; i++) {
    const a = me[i] > 0
    const b = (them[i] ?? 0) > 0
    if (a && b) both++
    else if (a) onlyMe++
    else if (b) onlyThem++
  }
  return { both, onlyMe, onlyThem }
}
