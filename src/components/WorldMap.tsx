import { memo, useEffect, useState } from 'react'
import type { Item, Theme } from '../collections/types'
import type { Level } from '../lib/encode'
import { COMPARE_COLORS, levelFill } from './BdMap'

export interface WorldData {
  w: number
  h: number
  other: string
  home: { d: string; c: [number, number] }
  countries: Record<string, { d?: string; c: [number, number] }>
}

// ~107 KB: loaded only on the world page.
let cache: Promise<WorldData> | null = null
export function loadWorldMap(): Promise<WorldData> {
  cache ??= import('../data/worldMap.json').then((m) => m.default as unknown as WorldData)
  return cache
}

export function useWorldMap(): WorldData | null {
  const [data, setData] = useState<WorldData | null>(null)
  useEffect(() => {
    let alive = true
    loadWorldMap().then((d) => alive && setData(d))
    return () => {
      alive = false
    }
  }, [])
  return data
}

interface Props {
  data: WorldData
  items: Item[]
  theme: Theme
  levels?: readonly Level[]
  compareWith?: readonly Level[]
  onTap?: (index: number) => void
  className?: string
  strokeScale?: number
}

export const WorldMap = memo(function WorldMap({ data, items, theme, levels, compareWith, onTap, className, strokeScale = 1 }: Props) {
  const fillFor = (i: number) => {
    const mine = levels?.[i] ?? 0
    if (!compareWith) return levelFill(theme, mine)
    const theirs = compareWith[i] ?? 0
    return mine && theirs ? COMPARE_COLORS.both : mine ? COMPARE_COLORS.me : theirs ? COMPARE_COLORS.them : COMPARE_COLORS.none
  }
  const shapes = items.map((it, i) => ({ it, i, g: data.countries[it.id] }))
  const listed = new Set(items.map((it) => it.id))
  // Countries in the map data but not in the list (retired items) are drawn as plain, non-selectable land.
  const unlisted = Object.entries(data.countries).filter(([id, g]) => g.d && !listed.has(id))
  return (
    <svg viewBox={`0 0 ${data.w} ${data.h}`} className={className} role="img" aria-label="বিশ্ব মানচিত্র">
      <path d={data.other} fill={theme.empty} stroke="#FFFDF7" strokeWidth={0.5 * strokeScale} />
      {unlisted.map(([id, g]) => (
        <path key={id} d={g.d} fill={theme.empty} stroke="#FFFDF7" strokeWidth={0.5 * strokeScale} />
      ))}
      {shapes.map(({ it, i, g }) =>
        g?.d ? (
          <path
            key={it.id}
            d={g.d}
            fill={fillFor(i)}
            stroke="#FFFDF7"
            strokeWidth={0.6 * strokeScale}
            strokeLinejoin="round"
            onClick={onTap ? () => onTap(i) : undefined}
            className={onTap ? 'cursor-pointer hover:brightness-95' : undefined}
          >
            <title>{it.bn}</title>
          </path>
        ) : null,
      )}
      <path d={data.home.d} fill="#006A4E" stroke="#FFFDF7" strokeWidth={0.6 * strokeScale}>
        <title>বাংলাদেশ</title>
      </path>
      {/* tiny states as dots on top */}
      {shapes.map(({ it, i, g }) =>
        g && !g.d ? (
          <circle
            key={it.id}
            cx={g.c[0]}
            cy={g.c[1]}
            r={3.2 * Math.max(1, strokeScale * 0.8)}
            fill={(levels?.[i] ?? 0) || compareWith?.[i] ? fillFor(i) : '#CFC4AD'}
            stroke="#FFFDF7"
            strokeWidth={0.8 * strokeScale}
            onClick={onTap ? () => onTap(i) : undefined}
            className={onTap ? 'cursor-pointer' : undefined}
          >
            <title>{it.bn}</title>
          </circle>
        ) : null,
      )}
    </svg>
  )
})
