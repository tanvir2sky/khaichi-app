import { memo } from 'react'
import type { Theme } from '../collections/types'
import mapData from '../data/bdMap.json'
import { DISTRICTS } from '../data/districts'
import type { Level } from '../lib/encode'

type MapData = { w: number; h: number; divisions: string; outline: string; districts: Record<string, { d: string; c: [number, number]; n: string[] }> }
const MAP = mapData as unknown as MapData

export const COMPARE_COLORS = { both: '#2E7D4F', me: '#EB8A2E', them: '#7C8FB0', none: '#EDE1C8' }

export function levelFill(theme: Theme, l: Level): string {
  return l === 0 ? theme.empty : l === 1 ? theme.l1 : l === 2 ? theme.l2 : theme.l3
}

interface Props {
  theme: Theme
  levels?: readonly Level[]
  /** Overlay mode: colours by both / only me / only them */
  compareWith?: readonly Level[]
  highlight?: string
  onTap?: (index: number) => void
  className?: string
  /** Thicker strokes for large renders (share cards) */
  strokeScale?: number
  title?: string
}

export const BdMap = memo(function BdMap({ theme, levels, compareWith, highlight, onTap, className, strokeScale = 1, title }: Props) {
  return (
    <svg
      viewBox={`-4 -4 ${MAP.w + 8} ${MAP.h + 8}`}
      className={className}
      role="img"
      aria-label={title ?? 'বাংলাদেশের ৬৪ জেলার মানচিত্র'}
    >
      <path d={MAP.outline} fill="none" stroke="#3A2417" strokeOpacity={0.18} strokeWidth={6 * strokeScale} strokeLinejoin="round" />
      {DISTRICTS.map((d, i) => {
        const geo = MAP.districts[d.id]
        const mine = levels?.[i] ?? 0
        let fill: string
        if (compareWith) {
          const theirs = compareWith[i] ?? 0
          fill = mine && theirs ? COMPARE_COLORS.both : mine ? COMPARE_COLORS.me : theirs ? COMPARE_COLORS.them : COMPARE_COLORS.none
        } else {
          fill = levelFill(theme, mine)
        }
        const hl = highlight === d.id
        return (
          <path
            key={d.id}
            d={geo.d}
            fill={hl ? theme.accent : fill}
            stroke="#FFFDF7"
            strokeWidth={1.2 * strokeScale}
            strokeLinejoin="round"
            onClick={onTap ? () => onTap(i) : undefined}
            className={onTap ? 'cursor-pointer transition-[fill] duration-200 hover:brightness-95' : undefined}
          >
            <title>{d.bn}</title>
          </path>
        )
      })}
      <path d={MAP.divisions} fill="none" stroke="#3A2417" strokeOpacity={0.45} strokeWidth={1.6 * strokeScale} strokeLinejoin="round" pointerEvents="none" />
    </svg>
  )
})

export function districtCentroid(id: string): [number, number] {
  return MAP.districts[id].c
}

export function districtNeighbours(id: string): string[] {
  return MAP.districts[id]?.n ?? []
}

export const BD_MAP_SIZE = { w: MAP.w, h: MAP.h }
