import type { Theme } from '../collections/types'
import type { Level } from '../lib/encode'
import { levelFill } from './BdMap'

interface Props {
  labels: [string, string, string]
  value: Level
  theme: Theme
  onChange: (l: Level) => void
}

export function LevelChips({ labels, value, theme, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup">
      {labels.map((label, idx) => {
        const l = (idx + 1) as Level
        const on = value === l
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={(e) => {
              e.stopPropagation()
              onChange(on ? 0 : l)
            }}
            className="rounded-full border px-2.5 py-1 text-[13px] leading-none transition-colors"
            style={{
              borderColor: on ? levelFill(theme, l) : 'var(--line)',
              background: on ? levelFill(theme, l) : 'transparent',
              color: on && l >= 2 ? '#fff' : 'var(--ink)',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
