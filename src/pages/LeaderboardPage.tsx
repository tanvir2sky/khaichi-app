import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useSearch } from 'wouter'
import { COLLECTION_BY_ID, COLLECTIONS, type CollectionId } from '../collections'
import type { CardFormat } from '../components/ShareCard'
import { DISTRICT_BY_ID } from '../data/districts'
import { bn } from '../lib/bn'
import { LEADERBOARD_ENABLED, SITE_URL } from '../lib/config'
import { fetchBoard, homeDistrict, type Board } from '../lib/leaderboard'

const CardSheet = lazy(() => import('../components/CardSheet').then((m) => ({ default: m.CardSheet })))

export function LeaderboardPage() {
  const search = useSearch()
  const initial = new URLSearchParams(search).get('c') as CollectionId | null
  const [cid, setCid] = useState<CollectionId>(initial && COLLECTION_BY_ID[initial] ? initial : 'food64')
  const [board, setBoard] = useState<Board | null>(null)
  const [error, setError] = useState(false)
  const [share, setShare] = useState(false)
  const [format, setFormat] = useState<CardFormat>('feed')
  const home = homeDistrict.get()
  const c = COLLECTION_BY_ID[cid]

  useEffect(() => {
    document.title = 'জেলা লিডারবোর্ড: কোন জেলার মানুষ সবচেয়ে ভোজনরসিক? | আমি খেয়েছি'
  }, [])

  useEffect(() => {
    if (!LEADERBOARD_ENABLED) return
    let alive = true
    setBoard(null)
    setError(false)
    fetchBoard(cid)
      .then((b) => alive && setBoard(b))
      .catch(() => alive && setError(true))
    return () => {
      alive = false
    }
  }, [cid])

  const myIdx = board?.rows.findIndex((r) => r.district_id === home) ?? -1
  const mine = myIdx >= 0 ? board!.rows[myIdx] : null

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <h1 className="font-display pt-6 text-3xl leading-tight">কোন জেলার মানুষ সবচেয়ে এগিয়ে?</h1>
      <p className="mt-2 text-[var(--muted)]">
        জেলার সবার গড় স্কোর দিয়ে র‍্যাংকিং। কমপক্ষে ৫ জন খেললে জেলা তালিকায় আসে, আর অল্প খেলোয়াড়ের জেলাকে গড়ের দিকে টানা হয় যাতে ২-১ জনের স্কোরে র‍্যাংক না লাফায়।
      </p>

      <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto" role="tablist">
        {COLLECTIONS.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={x.id === cid}
            onClick={() => setCid(x.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${x.id === cid ? 'bg-[var(--ink)] text-[var(--paper)]' : 'bg-white'}`}
          >
            {x.short}
          </button>
        ))}
      </div>

      {!LEADERBOARD_ENABLED && <p className="mt-10 text-center text-[var(--muted)]">লিডারবোর্ড শীঘ্রই আসছে!</p>}
      {error && <p className="mt-10 text-center text-[#B3261E]">লিডারবোর্ড লোড করা যাচ্ছে না।</p>}
      {LEADERBOARD_ENABLED && !board && !error && <p className="mt-10 text-center text-[var(--muted)]">লোড হচ্ছে…</p>}

      {board && (
        <>
          <p className="mt-4 text-sm text-[var(--muted)]">মোট {bn(board.total)} জন খেলেছেন</p>
          {mine && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl p-4 text-white" style={{ background: c.theme.accent }}>
              <div>
                আপনার জেলা <b>{DISTRICT_BY_ID[mine.district_id].bn}</b> এখন <b className="font-display text-2xl">#{bn(myIdx + 1)}</b>
              </div>
              <button type="button" className="shrink-0 rounded-xl bg-white px-3 py-2 text-sm font-bold" style={{ color: c.theme.accent }} onClick={() => setShare(true)}>
                শেয়ার করুন
              </button>
            </div>
          )}
          {board.rows.length === 0 ? (
            <p className="mt-10 text-center text-[var(--muted)]">
              এখনো কোনো জেলায় ৫ জন খেলেননি।{' '}
              <Link href={c.route} className="underline">
                প্রথম হোন!
              </Link>
            </p>
          ) : (
            <ol className="mt-4 divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
              {board.rows.map((r, i) => (
                <li key={r.district_id} className={`flex items-center gap-3 px-4 py-3 ${r.district_id === home ? 'bg-[#FFF1C9]' : ''}`}>
                  <span className="font-display w-10 text-xl text-[var(--muted)]">{bn(i + 1)}</span>
                  <span className="flex-1 font-bold">{DISTRICT_BY_ID[r.district_id]?.bn ?? r.district_id}</span>
                  <span className="text-right text-sm">
                    গড় <b>{bn(r.avg_count.toFixed(1))}</b>টি
                    <br />
                    <span className="text-[var(--muted)]">{bn(r.participants)} জন</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </>
      )}

      {share && mine && (
        <Suspense fallback={null}>
          <CardSheet
          title="জেলার র‍্যাংক কার্ড"
          card={{
            kind: 'rank',
            c,
            district: { id: mine.district_id, bn: DISTRICT_BY_ID[mine.district_id].bn },
            rank: myIdx + 1,
            of: board!.rows.length,
            participants: mine.participants,
            avgScore: Number(mine.avg_score),
            format,
          }}
          format={format}
          onFormat={setFormat}
          filename={`rank-${mine.district_id}.png`}
          shareText={`${DISTRICT_BY_ID[mine.district_id].bn} এখন #${bn(myIdx + 1)}! আপনার জেলা কত নম্বরে?`}
          shareUrl={`${SITE_URL}/leaderboard/?c=${cid}`}
          onClose={() => setShare(false)}
          analytics={{ collection: cid, kind: 'rank' }}
        />
        </Suspense>
      )}
    </main>
  )
}
