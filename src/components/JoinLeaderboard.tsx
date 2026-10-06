import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import type { Collection } from '../collections/types'
import { DISTRICTS } from '../data/districts'
import { bn } from '../lib/bn'
import { LEADERBOARD_ENABLED } from '../lib/config'
import { fetchBoard, hasJoined, homeDistrict, submitScore } from '../lib/leaderboard'
import type { Tally } from '../lib/score'
import { track } from '../lib/track'

interface Props {
  c: Collection
  tally: Tally
  encoded: string
}

/** "আপনার জেলার হয়ে খেলুন" — anonymous score submission tied to a home district. */
export function JoinLeaderboard({ c, tally, encoded }: Props) {
  const [home, setHome] = useState(homeDistrict.get())
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const [rank, setRank] = useState<{ rank: number; of: number } | null>(null)
  const joined = hasJoined(c.id)

  async function submit(auto = false) {
    if (!home) return
    setState('saving')
    try {
      await submitScore({ collection: c.id, home, score: tally.score, count: tally.count, levels: encoded })
      if (!auto) track('leaderboard_joined', { collection: c.id, home })
      const board = await fetchBoard(c.id)
      const idx = board.rows.findIndex((r) => r.district_id === home)
      setRank(idx >= 0 ? { rank: idx + 1, of: board.rows.length } : null)
      setState('done')
    } catch (e) {
      console.error(e)
      setState('error')
    }
  }

  // Already joined: keep the stored score fresh whenever the sheet opens.
  useEffect(() => {
    if (LEADERBOARD_ENABLED && joined && home && tally.count > 0) void submit(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!LEADERBOARD_ENABLED || tally.count === 0) return null

  return (
    <div className="mt-5 rounded-2xl border border-[var(--line)] bg-white p-4">
      <h3 className="font-bold">🏆 নিজের জেলার হয়ে খেলুন</h3>
      <p className="mt-1 text-sm text-[var(--muted)]">কোন জেলার মানুষ সবচেয়ে বেশি {c.id === 'world' ? 'ঘুরেছে' : 'খেয়েছে'}? আপনার স্কোর যোগ হবে আপনার জেলার গড়ে।</p>
      <div className="mt-3 flex gap-2">
        <select
          value={home}
          onChange={(e) => setHome(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5"
          aria-label="আপনার জেলা"
        >
          <option value="">আপনার জেলা বাছুন</option>
          {[...DISTRICTS].sort((a, b) => a.bn.localeCompare(b.bn, 'bn')).map((d) => (
            <option key={d.id} value={d.id}>
              {d.bn}
            </option>
          ))}
        </select>
        <button type="button" disabled={!home || state === 'saving'} onClick={() => submit()} className="btn-primary shrink-0 px-4">
          {state === 'saving' ? '…' : joined ? 'আপডেট' : 'যোগ দিন'}
        </button>
      </div>
      {state === 'done' && (
        <p className="mt-3 text-sm">
          ✅ যোগ হয়েছে!{' '}
          {rank ? (
            <>
              আপনার জেলা এখন <b>#{bn(rank.rank)}</b> ({bn(rank.of)}টির মধ্যে)।{' '}
            </>
          ) : (
            'আপনার জেলায় আরও কয়েকজন খেললেই র‍্যাংকিংয়ে দেখা যাবে। '
          )}
          <Link href={`/leaderboard?c=${c.id}`} className="underline">
            লিডারবোর্ড দেখুন
          </Link>
        </p>
      )}
      {state === 'error' && <p className="mt-3 text-sm text-[#B3261E]">এখন যোগ করা যাচ্ছে না, একটু পরে চেষ্টা করুন।</p>}
    </div>
  )
}
