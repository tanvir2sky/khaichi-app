import { Link, useLocation } from 'wouter'
import { COLLECTIONS } from '../collections'
import { LEADERBOARD_ENABLED } from '../lib/config'

export function Nav() {
  const [loc] = useLocation()
  const tabs = [
    ...COLLECTIONS.map((c) => ({ href: c.route, label: c.short })),
    ...(LEADERBOARD_ENABLED ? [{ href: '/leaderboard', label: 'লিডারবোর্ড' }] : []),
  ]
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5">
        <Link href="/" className="font-display shrink-0 text-xl text-[var(--accent)]">
          আমি খেয়েছি
        </Link>
        <nav className="no-scrollbar -mr-4 flex min-w-0 flex-1 gap-1.5 overflow-x-auto pr-4" aria-label="সংগ্রহ">
          {tabs.map((t) => {
            const active = t.href === '/' ? loc === '/' : loc.startsWith(t.href)
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? 'page' : undefined}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm whitespace-nowrap ${active ? 'bg-[var(--ink)] text-[var(--paper)]' : 'bg-white text-[var(--ink)]'}`}
              >
                {t.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
