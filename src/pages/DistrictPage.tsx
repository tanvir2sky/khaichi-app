import { useEffect } from 'react'
import { Link } from 'wouter'
import { food64 } from '../collections'
import { FOODS_BY_DISTRICT } from '../collections/food64'
import { BdMap, districtNeighbours } from '../components/BdMap'
import { LevelChips } from '../components/LevelChips'
import { DISTRICT_BY_ID, DISTRICTS, DIVISION_BY_ID } from '../data/districts'
import { FoodIcon } from '../icons/FoodIcons'
import { genitive } from '../lib/bn'
import { FEEDBACK_URL } from '../lib/config'
import { useLevels } from '../lib/state'

export function districtSeo(id: string) {
  const d = DISTRICT_BY_ID[id]
  const foods = FOODS_BY_DISTRICT[id] ?? []
  const names = foods.map((f) => f.bn).join(', ')
  return {
    title: `${genitive(d.bn)} বিখ্যাত খাবার কী? ${names} | আমি খেয়েছি`,
    description: `${genitive(d.bn)} বিখ্যাত খাবার: ${names}। ${foods[0]?.desc ?? ''} ৬৪ জেলার বিখ্যাত খাবারের কয়টা খেয়েছেন, টিক দিয়ে দেখুন।`.trim(),
  }
}

export function DistrictPage({ id }: { id: string }) {
  const d = DISTRICT_BY_ID[id]
  const { levels, setLevel } = useLevels(food64)

  useEffect(() => {
    if (d) document.title = districtSeo(id).title
  }, [d, id])

  if (!d) return <NotFound />
  const i = DISTRICTS.findIndex((x) => x.id === id)
  const foods = FOODS_BY_DISTRICT[id] ?? []
  const nbrs = districtNeighbours(id)
    .map((n) => DISTRICT_BY_ID[n])
    .filter(Boolean)

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <nav className="pt-4 text-sm text-[var(--muted)]" aria-label="breadcrumb">
        <Link href="/" className="underline">
          ৬৪ জেলার খাবার
        </Link>{' '}
        › {DIVISION_BY_ID[d.division].bn} বিভাগ › {d.bn}
      </nav>
      <h1 className="font-display mt-3 text-3xl leading-tight">{genitive(d.bn)} বিখ্যাত খাবার</h1>

      <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_220px]">
        <div>
          <ul className="space-y-4">
            {foods.map((f, k) => (
              <li key={f.bn} className="flex gap-3 rounded-2xl border border-[var(--line)] bg-white p-4">
                <FoodIcon name={f.icon} size={56} className="shrink-0" />
                <div>
                  <h2 className="text-lg font-bold">
                    {f.bn}
                    {k === 0 && <span className="ml-2 rounded-full bg-[var(--paper)] px-2 py-0.5 align-middle text-xs font-normal">সবচেয়ে বিখ্যাত</span>}
                  </h2>
                  {f.en && <p className="text-sm text-[var(--muted)]">{f.en}</p>}
                  {f.desc && <p className="mt-1 leading-relaxed">{f.desc}</p>}
                  {f.uncertain && <p className="mt-1 text-xs text-[#9A6B00]">এই তথ্য নিয়ে মতভেদ আছে — আপনার জানা থাকলে জানান।</p>}
                  {f.sources.length > 0 && (
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      সূত্র:{' '}
                      {f.sources.map((s, j) => (
                        <a key={s} href={s} target="_blank" rel="noopener nofollow" className="mr-2 underline">
                          {new URL(s).hostname.replace(/^www\./, '')}
                          {f.sources.length > 1 ? ` ${j + 1}` : ''}
                        </a>
                      ))}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border-2 p-4" style={{ borderColor: food64.theme.accent }}>
            <p className="font-bold">{genitive(d.bn)} বিখ্যাত খাবার খেয়েছেন?</p>
            <div className="mt-2">
              <LevelChips labels={food64.levels} value={levels[i]} theme={food64.theme} onChange={(l) => setLevel(i, l)} />
            </div>
            <Link href="/" className="btn-primary mt-4 inline-block" style={{ background: food64.theme.accent }}>
              বাকি ৬৩ জেলার ম্যাপ বানান →
            </Link>
          </div>

          {FEEDBACK_URL && (
            <p className="mt-4 text-sm">
              <a href={FEEDBACK_URL} target="_blank" rel="noopener" className="underline">
                {genitive(d.bn)} খাবার নিয়ে ভুল পেয়েছেন? ধরিয়ে দিন
              </a>
            </p>
          )}
        </div>

        <aside>
          <BdMap theme={food64.theme} levels={levels} highlight={id} className="w-full" title={`${d.bn} জেলা`} />
          {nbrs.length > 0 && (
            <div className="mt-4">
              <h2 className="mb-2 text-sm font-bold text-[var(--muted)]">পাশের জেলার খাবার</h2>
              <ul className="flex flex-wrap gap-1.5">
                {nbrs.map((n) => (
                  <li key={n.id}>
                    <Link href={`/district/${n.id}`} className="inline-block rounded-full bg-white px-3 py-1 text-sm">
                      {n.bn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}

export function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl">পাতাটি পাওয়া যায়নি</h1>
      <Link href="/" className="btn-primary mt-6 inline-block">
        ৬৪ জেলার খাবারে ফিরে যান
      </Link>
    </main>
  )
}
