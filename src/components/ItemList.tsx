import { memo, useDeferredValue, useMemo, useState } from 'react'
import { Link } from 'wouter'
import type { Collection } from '../collections/types'
import { FoodIcon } from '../icons/FoodIcons'
import { bn } from '../lib/bn'
import type { Level } from '../lib/encode'
import { levelFill } from './BdMap'
import { LevelChips } from './LevelChips'

interface Props {
  c: Collection
  levels: readonly Level[]
  friend?: readonly Level[] | null
  friendName?: string
  onToggle: (i: number) => void
  onLevel: (i: number, l: Level) => void
}

export function ItemList({ c, levels, friend, friendName, onToggle, onLevel }: Props) {
  const [q, setQ] = useState('')
  const dq = useDeferredValue(q.trim().toLowerCase())

  const groups = useMemo(() => {
    const idx = c.items.map((it, i) => ({ it, i }))
    const match = dq
      ? idx.filter(({ it }) => `${it.bn} ${it.en} ${it.sub ?? ''}`.toLowerCase().includes(dq))
      : idx
    return c.groups
      .map((g) => ({ g, rows: match.filter((r) => r.it.group === g.id) }))
      .filter((g) => g.rows.length)
  }, [c, dq])

  const isWorld = c.kind === 'world-map'

  return (
    <div className="min-w-0">
      <label className="sticky top-[57px] z-10 block bg-[var(--paper)] py-2">
        <span className="sr-only">খুঁজুন</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={c.id === 'food64' ? 'জেলা বা খাবারের নাম খুঁজুন…' : 'নাম খুঁজুন…'}
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base outline-none focus:border-[var(--ink)]"
        />
      </label>
      {groups.map(({ g, rows }) => {
        const done = rows.filter((r) => levels[r.i] > 0).length
        return (
          <section key={g.id} className="mt-4">
            <h3 className="mb-2 flex items-baseline justify-between px-1 text-sm font-bold text-[var(--muted)]">
              <span>{g.bn}</span>
              <span>
                {bn(done)}/{bn(rows.length)}
              </span>
            </h3>
            <ul className="divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
              {rows.map(({ it, i }) => (
                <Row
                  key={it.id}
                  c={c}
                  i={i}
                  level={levels[i]}
                  friendHas={Boolean(friend?.[i])}
                  friendName={friendName}
                  isWorld={isWorld}
                  onToggle={onToggle}
                  onLevel={onLevel}
                />
              ))}
            </ul>
          </section>
        )
      })}
      {!groups.length && <p className="py-10 text-center text-[var(--muted)]">কিছু পাওয়া যায়নি</p>}
    </div>
  )
}

const Row = memo(function Row({
  c,
  i,
  level,
  friendHas,
  friendName,
  isWorld,
  onToggle,
  onLevel,
}: {
  c: Collection
  i: number
  level: Level
  friendHas: boolean
  friendName?: string
  isWorld: boolean
  onToggle: (i: number) => void
  onLevel: (i: number, l: Level) => void
}) {
  const it = c.items[i]
  const on = level > 0
  return (
    <li>
      <div
        role="checkbox"
        aria-checked={on}
        tabIndex={0}
        onClick={() => onToggle(i)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            onToggle(i)
          }
        }}
        className="flex cursor-pointer items-center gap-3 px-3 py-2.5 select-none active:bg-[var(--paper)]"
      >
        {isWorld ? (
          <span className="grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold" style={{ background: levelFill(c.theme, level), color: level >= 2 ? '#fff' : 'var(--ink)' }}>
            {it.id}
          </span>
        ) : (
          <FoodIcon name={it.icon} tint={it.tint} size={40} className={on ? '' : 'opacity-60 grayscale-[40%]'} />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold">{it.bn}</span>
            {friendHas && (
              <span className="rounded-full bg-[#E3E8F2] px-1.5 text-[11px] text-[#43557A]" title={`${friendName} খেয়েছেন`}>
                {friendName}✓
              </span>
            )}
          </div>
          {it.sub && <div className="truncate text-sm text-[var(--muted)]">{it.sub}</div>}
        </div>
        <span
          className="grid size-7 shrink-0 place-items-center rounded-lg border-2 text-white transition-colors"
          style={{ borderColor: on ? c.theme.accent : 'var(--line)', background: on ? c.theme.accent : 'transparent' }}
          aria-hidden="true"
        >
          {on && (
            <svg viewBox="0 0 16 16" className="size-4">
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>
      {on && (
        <div className="flex min-w-0 flex-wrap items-center gap-2 px-3 pb-3 pl-[64px]">
          <LevelChips labels={c.levels} value={level} theme={c.theme} onChange={(l) => onLevel(i, l)} />
          {c.id === 'food64' && (
            <Link href={`/district/${it.id}`} className="ml-auto shrink-0 text-xs text-[var(--muted)] underline" onClick={(e) => e.stopPropagation()}>
              বিস্তারিত
            </Link>
          )}
        </div>
      )}
    </li>
  )
})
