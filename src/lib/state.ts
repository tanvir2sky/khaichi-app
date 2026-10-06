import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { Collection } from '../collections/types'
import { SITE_URL } from './config'
import { decodeLevels, encodeLevels, type Level } from './encode'
import { tally } from './score'
import { load, save } from './storage'
import { trackOnce } from './track'

/** Canonical path with trailing slash, matching the prerendered folders. */
export function routePath(route: string): string {
  return route === '/' ? '/' : `${route.replace(/\/$/, '')}/`
}

export function shareUrl(c: Collection, encoded: string, name: string): string {
  const q = new URLSearchParams({ v: '1', m: encoded })
  if (name.trim()) q.set('n', name.trim().slice(0, 30))
  return `${SITE_URL}${routePath(c.route)}?${q}`
}

export function useLevels(c: Collection) {
  const key = `ak:lv:${c.id}`
  const n = c.items.length
  const [levels, setLevels] = useState<Level[]>(() => decodeLevels(load<string>(key, ''), n))

  useEffect(() => {
    save(key, encodeLevels(levels))
  }, [key, levels])

  const setLevel = useCallback((i: number, l: Level) => {
    trackOnce(`first_tick`, { collection: c.id })
    setLevels((prev) => {
      if (prev[i] === l) return prev
      const next = prev.slice()
      next[i] = l
      return next
    })
  }, [c.id])

  const toggle = useCallback((i: number) => setLevels((p) => {
    trackOnce(`first_tick`, { collection: c.id })
    const next = p.slice()
    next[i] = p[i] ? 0 : 1
    return next
  }), [c.id])

  const cycle = useCallback((i: number) => setLevels((p) => {
    trackOnce(`first_tick`, { collection: c.id })
    const next = p.slice()
    next[i] = ((p[i] + 1) % 4) as Level
    return next
  }), [c.id])

  const reset = useCallback(() => setLevels(new Array<Level>(n).fill(0)), [n])
  const encoded = useMemo(() => encodeLevels(levels), [levels])
  const t = useMemo(() => tally(levels), [levels])

  return { levels, tally: t, encoded, setLevel, toggle, cycle, reset }
}

export interface Friend {
  name: string
  levels: Level[]
}

/** Friend's map from a shared link (?m=…&n=…), if present and non-empty. */
export function readFriend(c: Collection, search: string): Friend | null {
  const q = new URLSearchParams(search)
  const m = q.get('m')
  if (!m) return null
  const levels = decodeLevels(m, c.items.length)
  if (!levels.some(Boolean)) return null
  return { name: (q.get('n') ?? '').slice(0, 30) || 'বন্ধু', levels }
}

// ---- profile (name persisted; photo kept in memory only, never uploaded or stored) ----
let photo = ''
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export const profile = {
  getName: () => load<string>('ak:name', ''),
  setName(v: string) {
    save('ak:name', v.slice(0, 30))
    emit()
  },
  getPhoto: () => photo,
  setPhoto(v: string) {
    photo = v
    emit()
  },
}

let snapshot = { name: profile.getName(), photo }
export function useProfile() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => {
      const name = profile.getName()
      if (name !== snapshot.name || photo !== snapshot.photo) snapshot = { name, photo }
      return snapshot
    },
    () => snapshot,
  )
}
