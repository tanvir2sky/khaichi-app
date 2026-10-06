// Share cards rendered at real pixel size and captured to PNG (see lib/capture.ts).
// Inline styles only, so the capture is deterministic.
import { forwardRef, type CSSProperties, type ReactNode } from 'react'
import { tierFor } from '../collections/tiers'
import type { Collection, Theme } from '../collections/types'
import { FoodIcon } from '../icons/FoodIcons'
import { bn, genitive } from '../lib/bn'
import { SITE_HOST } from '../lib/config'
import type { Level } from '../lib/encode'
import { compare, tally } from '../lib/score'
import { BdMap, COMPARE_COLORS, levelFill } from './BdMap'
import { WorldMap, type WorldData } from './WorldMap'

export type CardFormat = 'feed' | 'story'
export const CARD_SIZE: Record<CardFormat, { w: number; h: number }> = {
  feed: { w: 1080, h: 1350 },
  story: { w: 1080, h: 1920 },
}

const PAPER = '#FFF8EC'
const INK = '#2B1B12'
const MUTED = '#7A6656'
const DISPLAY = "'Tiro Bangla', 'Hind Siliguri', serif"
const BODY = "'Hind Siliguri', sans-serif"
// modern-screenshot freezes each element's computed width/height, so shrink-wrapped text can
// re-wrap in the capture. Default to nowrap; text meant to wrap gets a full-width block (WRAP).
const WRAP: CSSProperties = { whiteSpace: 'normal', display: 'block', width: '100%' }

function Frame({ format, theme, children }: { format: CardFormat; theme: Theme; children: ReactNode }) {
  const { w, h } = CARD_SIZE[format]
  return (
    <div
      style={{
        width: w,
        height: h,
        background: PAPER,
        color: INK,
        fontFamily: BODY,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '72px 64px 0',
        boxSizing: 'border-box',
        lineHeight: 1.35,
        whiteSpace: 'nowrap',
      }}
    >
      {/* nakshi-kantha style running-stitch border */}
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <rect x={26} y={26} width={w - 52} height={h - 52} rx={28} fill="none" stroke={theme.accent} strokeWidth={4} strokeDasharray="18 12" strokeLinecap="round" />
        <rect x={40} y={40} width={w - 80} height={h - 80} rx={20} fill="none" stroke={theme.l2} strokeWidth={2} strokeDasharray="4 10" strokeLinecap="round" />
      </svg>
      {children}
    </div>
  )
}

function Footer({ theme, question }: { theme: Theme; question: string }) {
  return (
    <div
      style={{
        marginTop: 'auto',
        marginLeft: -64,
        marginRight: -64,
        background: theme.accent,
        color: theme.accentInk,
        padding: '30px 64px 38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        position: 'relative',
      }}
    >
      <span data-fit style={{ fontSize: 40, fontWeight: 700 }}>{question}</span>
      <span data-fit style={{ fontSize: 34, fontWeight: 700, background: PAPER, color: theme.accent, borderRadius: 999, padding: '10px 26px', whiteSpace: 'nowrap' }}>
        {SITE_HOST} →
      </span>
    </div>
  )
}

function Header({ name, photo, c }: { name: string; photo: string; c: Collection }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, position: 'relative' }}>
      {photo ? (
        <img src={photo} alt="" width={104} height={104} style={{ borderRadius: '50%', border: `5px solid ${c.theme.accent}`, objectFit: 'cover' }} />
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 30, color: MUTED }}>{name ? `${genitive(name)} স্কোর` : 'আমার স্কোর'}</span>
        <span style={{ fontFamily: DISPLAY, fontSize: 44, lineHeight: 1.15 }}>{c.name}</span>
      </div>
    </div>
  )
}

function Legend({ c, levels, items }: { c: Collection; levels: readonly Level[]; items?: { color: string; label: string; n: number }[] }) {
  const t = tally(levels)
  const rows = items ?? c.levels.map((label, i) => ({ color: levelFill(c.theme, (i + 1) as Level), label, n: t.byLevel[i + 1] }))
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 26px', fontSize: 28, width: '100%' }}>
      {rows.map((r) => (
        <span key={r.label} data-fit style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 26, height: 26, borderRadius: 7, background: r.color, display: 'inline-block' }} />
          {r.label} <b>{bn(r.n)}</b>
        </span>
      ))}
    </div>
  )
}

function Score({ c, levels, big = 190, compact = false }: { c: Collection; levels: readonly Level[]; big?: number; compact?: boolean }) {
  const t = tally(levels)
  const tier = tierFor(c.tiers, t.count)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      <div style={{ fontFamily: DISPLAY, fontSize: big, lineHeight: 1, color: c.theme.accent, letterSpacing: -2 }}>
        {bn(t.count)}
        <span style={{ fontSize: big * 0.42, color: MUTED }}>/{bn(c.items.length)}</span>
      </div>
      <div style={{ ...WRAP, fontSize: 40, fontWeight: 700, lineHeight: 1.2 }}>{c.unitLine}</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginTop: 14, width: '100%' }}>
        <span data-fit style={{ background: INK, color: PAPER, fontFamily: DISPLAY, fontSize: 42, borderRadius: 16, padding: '6px 22px 10px' }}>{tier.title}</span>
        <div style={{ ...WRAP, fontSize: 30, color: MUTED }}>{tier.line}</div>
      </div>
      {!compact && (
        <div style={{ fontSize: 28, color: MUTED, marginTop: 6 }}>
          স্কোর {bn(t.score)}/{bn(c.items.length * 3)}
        </div>
      )}
    </div>
  )
}

// 'দুধ চিতই পিঠা' -> 'দুধ চিতই', but keep names that become ambiguous ('কলা পিঠা', 'তেলের পিঠা').
function shortLabel(s: string): string {
  const short = s.replace(/\s*পিঠা$/, '')
  return short.length >= 6 && !/ের$/.test(short) ? short : s
}

function Grid({ c, levels, compareWith, availH }: { c: Collection; levels: readonly Level[]; compareWith?: readonly Level[]; availH: number }) {
  const n = c.items.length
  const width = 952
  let cols = 6
  for (; cols < 12; cols++) {
    const cw = width / cols
    if (Math.ceil(n / cols) * cw * 1.18 <= availH) break
  }
  const cw = width / cols
  const icon = Math.round(cw * 0.6)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cw}px)`, rowGap: 6 }}>
      {c.items.map((it, i) => {
        const mine = levels[i]
        const theirs = compareWith?.[i] ?? 0
        const on = compareWith ? mine || theirs : mine
        const ring = compareWith
          ? mine && theirs
            ? COMPARE_COLORS.both
            : mine
              ? COMPARE_COLORS.me
              : theirs
                ? COMPARE_COLORS.them
                : 'transparent'
          : mine
            ? levelFill(c.theme, mine)
            : 'transparent'
        return (
          <div key={it.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: on ? 1 : 0.28 }}>
            <div style={{ borderRadius: '50%', padding: 4, border: `4px solid ${ring}`, lineHeight: 0 }}>
              <FoodIcon name={it.icon} tint={it.tint} size={icon} />
            </div>
            <span style={{ fontSize: Math.max(15, Math.round(cw * 0.15)), lineHeight: 1.15, textAlign: 'center', marginTop: 4, maxWidth: cw - 6, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {shortLabel(it.bn)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

interface ResultProps {
  kind: 'result'
  c: Collection
  levels: readonly Level[]
  name: string
  photo: string
  format: CardFormat
  world?: WorldData | null
}

interface CompareProps {
  kind: 'compare'
  c: Collection
  levels: readonly Level[]
  friend: readonly Level[]
  name: string
  friendName: string
  format: CardFormat
  world?: WorldData | null
}

interface RankProps {
  kind: 'rank'
  c: Collection
  district: { id: string; bn: string }
  rank: number
  of: number
  participants: number
  avgScore: number
  format: CardFormat
}

export type CardProps = ResultProps | CompareProps | RankProps

export const ShareCard = forwardRef<HTMLDivElement, CardProps>(function ShareCard(props, ref) {
  return <div ref={ref}>{renderCard(props)}</div>
})

function renderCard(p: CardProps) {
  if (p.kind === 'rank') return <RankCard {...p} />
  if (p.kind === 'compare') return <CompareCard {...p} />
  return <ResultCard {...p} />
}

function ResultCard({ c, levels, name, photo, format, world }: ResultProps) {
  const story = format === 'story'
  const mapStyle: CSSProperties = { display: 'block' }

  if (c.kind === 'bd-map') {
    return (
      <Frame format={format} theme={c.theme}>
        <Header name={name} photo={photo} c={c} />
        {story ? (
          <>
            <div style={{ marginTop: 40 }}>
              <Score c={c} levels={levels} />
            </div>
            <BdMap theme={c.theme} levels={levels} className="" strokeScale={1.6} title={c.name} />
            <div style={{ margin: '0 0 36px' }}>
              <Legend c={c} levels={levels} />
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 0, marginTop: 24, flex: 1, minHeight: 0, marginRight: -20 }}>
              <div style={{ width: 370, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 30 }}>
                <Score c={c} levels={levels} big={160} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Legend c={c} levels={levels} />
                </div>
              </div>
              <div style={{ width: 590, flexShrink: 0, alignSelf: 'center', ...mapStyle }}>
                <BdMap theme={c.theme} levels={levels} strokeScale={1.4} title={c.name} />
              </div>
            </div>
          </>
        )}
        <Footer theme={c.theme} question={c.question} />
      </Frame>
    )
  }

  if (c.kind === 'world-map') {
    const visited = c.items.filter((_, i) => levels[i] > 0)
    const regions = c.groups
      .map((g) => ({ g, n: c.items.filter((it, i) => it.group === g.id && levels[i] > 0).length }))
      .filter((r) => r.n)
    return (
      <Frame format={format} theme={c.theme}>
        <Header name={name} photo={photo} c={c} />
        <div style={{ marginTop: 34 }}>
          <Score c={c} levels={levels} big={story ? 200 : 130} compact={!story} />
        </div>
        <div style={{ marginTop: story ? 40 : 20 }}>{world && <WorldMap data={world} items={c.items} theme={c.theme} levels={levels} strokeScale={1.2} />}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20, fontSize: 26, width: '100%' }}>
          {regions.map(({ g, n }) => (
            <span key={g.id} data-fit style={{ border: `2px solid ${c.theme.l2}`, borderRadius: 999, padding: '4px 16px' }}>
              {g.bn} {bn(n)}
            </span>
          ))}
        </div>
        <div style={{ ...WRAP, fontSize: 26, color: MUTED, marginTop: 18, lineHeight: '38px', maxHeight: story ? 38 * 9 : 38 * 2, overflow: 'hidden', flexShrink: 0 }}>
          {visited.map((v) => v.bn).join(' · ')}
        </div>
        <Footer theme={c.theme} question={c.question} />
      </Frame>
    )
  }

  return (
    <Frame format={format} theme={c.theme}>
      <Header name={name} photo={photo} c={c} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 30, marginBottom: 26 }}>
        <Score c={c} levels={levels} big={story ? 190 : 150} />
        <div style={{ paddingBottom: 6 }}>
          <Legend c={c} levels={levels} items={c.levels.map((label, i) => ({ color: levelFill(c.theme, (i + 1) as Level), label, n: tally(levels).byLevel[i + 1] }))} />
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingBottom: 24 }}>
        <Grid c={c} levels={levels} availH={story ? 1100 : 640} />
      </div>
      <Footer theme={c.theme} question={c.question} />
    </Frame>
  )
}

function CompareCard({ c, levels, friend, name, friendName, format, world }: CompareProps) {
  const me = tally(levels)
  const them = tally(friend)
  const cmp = compare(levels, friend)
  const myLabel = name || 'আমি'
  const legend = [
    { color: COMPARE_COLORS.both, label: 'দুজনেই', n: cmp.both },
    { color: COMPARE_COLORS.me, label: `শুধু ${myLabel}`, n: cmp.onlyMe },
    { color: COMPARE_COLORS.them, label: `শুধু ${friendName}`, n: cmp.onlyThem },
  ]
  const story = format === 'story'
  return (
    <Frame format={format} theme={c.theme}>
      <div style={{ fontFamily: DISPLAY, fontSize: 46, position: 'relative' }}>{c.name}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '26px 0 22px' }}>
        <Versus label={myLabel} count={me.count} color={COMPARE_COLORS.me} />
        <span style={{ fontFamily: DISPLAY, fontSize: 64, color: MUTED }}>বনাম</span>
        <Versus label={friendName} count={them.count} color={COMPARE_COLORS.them} align="right" />
      </div>
      <Legend c={c} levels={levels} items={legend} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0', minHeight: 0 }}>
        {c.kind === 'bd-map' && (
          <div style={{ height: story ? 1180 : 760, aspectRatio: '600 / 815' }}>
            <BdMap theme={c.theme} levels={levels} compareWith={friend} strokeScale={1.4} />
          </div>
        )}
        {c.kind === 'world-map' && world && (
          <div style={{ width: 1000 }}>
            <WorldMap data={world} items={c.items} theme={c.theme} levels={levels} compareWith={friend} strokeScale={1.2} />
          </div>
        )}
        {c.kind === 'grid' && <Grid c={c} levels={levels} compareWith={friend} availH={story ? 1150 : 760} />}
      </div>
      <Footer theme={c.theme} question="আপনি কার দলে?" />
    </Frame>
  )
}

function Versus({ label, count, color, align = 'left' }: { label: string; count: number; color: string; align?: 'left' | 'right' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'left' ? 'flex-start' : 'flex-end', maxWidth: 400 }}>
      <span style={{ fontSize: 36, fontWeight: 700, maxWidth: 400, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{label}</span>
      <span style={{ fontFamily: DISPLAY, fontSize: 150, lineHeight: 1, color }}>{bn(count)}</span>
    </div>
  )
}

function RankCard({ c, district, rank, of, participants, avgScore, format }: RankProps) {
  const story = format === 'story'
  return (
    <Frame format={format} theme={c.theme}>
      <div style={{ fontFamily: DISPLAY, fontSize: 44, position: 'relative' }}>{c.name} · জেলা লিডারবোর্ড</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 30, marginTop: 40 }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 240, lineHeight: 0.9, color: c.theme.accent }}>#{bn(rank)}</span>
        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 16 }}>
          <span style={{ fontSize: 64, fontWeight: 700 }}>{district.bn}</span>
          <span style={{ fontSize: 30, color: MUTED }}>{bn(of)}টি জেলার মধ্যে</span>
        </div>
      </div>
      <div style={{ ...WRAP, fontSize: 34, marginTop: 24, lineHeight: 1.4 }}>
        {genitive(district.bn)} {bn(participants)} জন খেলেছেন · গড় স্কোর {bn(avgScore.toFixed(1))}
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0, margin: '20px 0' }}>
        <div style={{ height: story ? 1150 : 700, aspectRatio: '600 / 815' }}>
          <BdMap theme={c.theme} highlight={district.id} strokeScale={1.4} />
        </div>
      </div>
      <Footer theme={c.theme} question="আপনার জেলা কত নম্বরে?" />
    </Frame>
  )
}
