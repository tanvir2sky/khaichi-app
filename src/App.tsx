import { useEffect } from 'react'
import { Route, Router, Switch, useLocation, type BaseLocationHook } from 'wouter'
import { useBrowserLocation } from 'wouter/use-browser-location'
import { COLLECTIONS } from './collections'
import { Nav } from './components/Nav'
import { CollectionPage } from './pages/CollectionPage'
import { DistrictPage, NotFound } from './pages/DistrictPage'
import { LeaderboardPage } from './pages/LeaderboardPage'

// Prerendered pages live at /pitha/index.html etc., so strip trailing slashes before matching.
const useLocationNoSlash: BaseLocationHook = (opts?: unknown) => {
  const [loc, navigate] = useBrowserLocation(opts as never)
  return [loc.length > 1 ? loc.replace(/\/+$/, '') : loc, navigate]
}

function ScrollTop() {
  const [loc] = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [loc])
  return null
}

export function App() {
  return (
    <Router hook={useLocationNoSlash}>
      <ScrollTop />
      <Nav />
      <Switch>
        {COLLECTIONS.map((c) => (
          <Route key={c.id} path={c.route}>
            <CollectionPage key={c.id} c={c} />
          </Route>
        ))}
        <Route path="/district/:id">{(p) => <DistrictPage key={p.id} id={p.id} />}</Route>
        <Route path="/leaderboard" component={LeaderboardPage} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </Router>
  )
}

function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-4 pt-6 pb-28 text-center text-xs leading-relaxed text-[var(--muted)]">
      <p>তৈরি বাংলাদেশের খাবার আর ভ্রমণপ্রেমীদের জন্য। আপনার টিক ও ছবি শুধু আপনার ফোনেই থাকে।</p>
      <p className="mt-1">মানচিত্র: geoBoundaries (BBS / OCHA ROAP, CC BY 3.0 IGO), Natural Earth।</p>
    </footer>
  )
}
