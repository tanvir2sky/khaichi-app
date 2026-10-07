import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { tierFor } from '../collections/tiers'
import type { Collection } from '../collections/types'
import { BdMap, COMPARE_COLORS } from '../components/BdMap'
import { ItemList } from '../components/ItemList'
import { JoinLeaderboard } from '../components/JoinLeaderboard'
import type { CardFormat, CardProps } from '../components/ShareCard'
import { WorldMap, useWorldMap } from '../components/WorldMap'
import { FoodIcon } from '../icons/FoodIcons'
import { bn } from '../lib/bn'
import { photoToDataUrl } from '../lib/photo'
import { FEEDBACK_URL } from '../lib/config'
import { compare, tally as tallyOf } from '../lib/score'
import { profile, readFriend, shareUrl, useLevels, useProfile } from '../lib/state'
import { track, trackOnce } from '../lib/track'

const CardSheet = lazy(() => import('../components/CardSheet').then((m) => ({ default: m.CardSheet })))

export function CollectionPage({ c }: { c: Collection }) {
  const { levels, tally, encoded, setLevel, toggle, cycle, reset } = useLevels(c)
  const me = useProfile()
  const friend = useMemo(() => readFriend(c, typeof location !== 'undefined' ? location.search : ''), [c])
  const [sheet, setSheet] = useState<null | 'result' | 'compare'>(null)
  const [format, setFormat] = useState<CardFormat>('feed')
  const [showFriend, setShowFriend] = useState(Boolean(friend))
  const [tapped, setTapped] = useState<number | null>(null)
  const world = useWorldMap()
  const needsWorld = c.kind === 'world-map'

  useEffect(() => {
    document.title = c.seo.title
    trackOnce('started', { collection: c.id })
    if (friend) trackOnce('compare_opened', { collection: c.id })
  }, [c, friend])

  const tier = tierFor(c.tiers, tally.count)
  const url = shareUrl(c, encoded, me.name)
  const overlay = showFriend && friend && tally.count > 0 ? friend.levels : undefined

  function onMapTap(i: number) {
    cycle(i)
    setTapped(i)
  }

  const card: CardProps =
    sheet === 'compare' && friend
      ? { kind: 'compare', c, levels, friend: friend.levels, name: me.name, friendName: friend.name, format, world }
      : { kind: 'result', c, levels, name: me.name, photo: me.photo, format, world }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-32">
      <section className="pt-6 pb-4">
        <h1 className="font-display text-[28px] leading-tight sm:text-4xl">{c.headline}</h1>
        <p className="mt-2 text-[var(--muted)]">{c.intro}</p>
      </section>

      {friend && (
        <div className="mb-4 rounded-2xl border-2 border-dashed p-4" style={{ borderColor: COMPARE_COLORS.them }}>
          <p className="text-lg">
            <b>{friend.name}</b> {c.unitLine.replace(/খেয়েছি$/, 'খেয়েছেন').replace(/ঘুরেছি$/, 'ঘুরেছেন')}:{' '}
            <b className="font-display text-2xl">
              {bn(tallyOf(friend.levels).count)}/{bn(c.items.length)}
            </b>
          </p>
          <p className="text-[var(--muted)]">{tally.count ? 'আপনার টিক দেওয়া চলছে… তুলনা দেখুন!' : 'আপনি কয়টা? নিচে টিক দিয়ে দেখুন কে এগিয়ে!'}</p>
          {tally.count > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="btn" onClick={() => setShowFriend((v) => !v)}>
                {showFriend ? 'শুধু আমার ম্যাপ' : 'ম্যাপে তুলনা'}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setSheet('compare')
                  track('compare_completed', { collection: c.id, ...compare(levels, friend.levels) })
                }}
              >
                তুলনার কার্ড বানান
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {c.kind !== 'grid' && (
          <div className="md:sticky md:top-20 md:self-start">
            <div className="rounded-3xl border border-[var(--line)] bg-white p-3">
              {c.kind === 'bd-map' ? (
                <BdMap theme={c.theme} levels={levels} compareWith={overlay} onTap={onMapTap} className="mx-auto block max-h-[62vh] w-full" />
              ) : world ? (
                <WorldMap data={world} items={c.items} theme={c.theme} levels={levels} compareWith={overlay} onTap={onMapTap} className="block w-full" />
              ) : (
                <div className="aspect-[1000/435] animate-pulse rounded-xl bg-[var(--paper)]" />
              )}
              <MapCaption c={c} index={tapped} level={tapped === null ? 0 : levels[tapped]} overlay={Boolean(overlay)} friendName={friend?.name} />
            </div>
          </div>
        )}
        <ItemList c={c} levels={levels} friend={friend?.levels} friendName={friend?.name} onToggle={toggle} onLevel={setLevel} />
      </div>

      {tally.count > 0 && (
        <p className="mt-8 text-center text-sm">
          <button type="button" onClick={() => confirm('সব টিক মুছে ফেলবেন?') && reset()} className="text-[var(--muted)] underline">
            সব মুছে নতুন করে শুরু
          </button>
          {FEEDBACK_URL && (
            <>
              {' · '}
              <a href={FEEDBACK_URL} target="_blank" rel="noopener" className="text-[var(--muted)] underline">
                তথ্যে ভুল? ধরিয়ে দিন
              </a>
            </>
          )}
        </p>
      )}

      {/* sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="font-display text-2xl leading-none" style={{ color: c.theme.accent }}>
              {bn(tally.count)}/{bn(c.items.length)}
            </div>
            <div className="truncate text-sm text-[var(--muted)]">{tally.count ? tier.title : 'টিক দেওয়া শুরু করুন'}</div>
          </div>
          <button
            type="button"
            disabled={tally.count === 0}
            onClick={() => setSheet('result')}
            className="btn-primary px-5 text-base"
            style={{ background: c.theme.accent }}
          >
            কার্ড বানান →
          </button>
        </div>
      </div>

      {sheet && (
        <Suspense fallback={null}>
          <CardSheet
          title={sheet === 'compare' ? 'তুলনার কার্ড' : 'আপনার কার্ড'}
          card={card}
          format={format}
          onFormat={setFormat}
          filename={`${c.id}-${tally.count}.png`}
          shareText={`${c.headline} আমি ${bn(tally.count)}/${bn(c.items.length)} — ${tier.title}! আপনি কয়টা?`}
          shareUrl={url}
          onClose={() => setSheet(null)}
          ready={!needsWorld || Boolean(world)}
          analytics={{ collection: c.id, kind: sheet, count: tally.count }}
          controls={sheet === 'result' ? <ProfileControls /> : null}
          footer={<JoinLeaderboard c={c} tally={tally} encoded={encoded} />}
        />
        </Suspense>
      )}
    </main>
  )
}

function MapCaption({ c, index, level, overlay, friendName }: { c: Collection; index: number | null; level: number; overlay: boolean; friendName?: string }) {
  if (overlay) {
    return (
      <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
        <Swatch color={COMPARE_COLORS.both} label="দুজনেই" />
        <Swatch color={COMPARE_COLORS.me} label="শুধু আমি" />
        <Swatch color={COMPARE_COLORS.them} label={`শুধু ${friendName}`} />
      </div>
    )
  }
  if (index === null) {
    return (
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-[var(--muted)]">
        <span>ম্যাপে চাপ দিলে লেভেল বদলাবে:</span>
        {c.levels.map((l, i) => (
          <Swatch key={l} color={[c.theme.l1, c.theme.l2, c.theme.l3][i]} label={l} />
        ))}
      </div>
    )
  }
  const it = c.items[index]
  return (
    <div className="mt-2 flex items-center justify-center gap-2 text-sm">
      {c.kind !== 'world-map' && <FoodIcon name={it.icon} tint={it.tint} size={28} />}
      <b>{it.bn}</b>
      {it.sub && <span className="truncate text-[var(--muted)]">· {it.sub.split(' · ')[0]}</span>}
      <span className="rounded-full bg-[var(--paper)] px-2 py-0.5 text-xs">{level ? c.levels[level - 1] : 'বাদ'}</span>
    </div>
  )
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-block size-3 rounded" style={{ background: color }} />
      {label}
    </span>
  )
}

function ProfileControls() {
  const me = useProfile()
  return (
    <div>
    <div className="flex items-center gap-2">
      <label className="relative grid size-12 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full border-2 border-dashed border-[var(--line)] bg-white text-xl" title="ছবি যোগ করুন">
        {me.photo ? <img src={me.photo} alt="" className="size-full object-cover" /> : '📷'}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={async (e) => {
            const f = e.target.files?.[0]
            if (f) profile.setPhoto(await photoToDataUrl(f))
          }}
        />
      </label>
      <input
        type="text"
        value={me.name}
        maxLength={30}
        onChange={(e) => profile.setName(e.target.value)}
        placeholder="আপনার নাম (ঐচ্ছিক)"
        className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5"
      />
      {me.photo && (
        <button type="button" className="text-xs text-[var(--muted)] underline" onClick={() => profile.setPhoto('')}>
          ছবি বাদ
        </button>
      )}
    </div>
      <p className="mt-1 text-xs text-[var(--muted)]">ছবি শুধু আপনার ফোনেই থাকে, কোথাও আপলোড হয় না।</p>
    </div>
  )
}
