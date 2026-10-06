// District leaderboard on Supabase. The SDK is dynamically imported so it never lands in the main bundle.
import type { SupabaseClient } from '@supabase/supabase-js'
import type { CollectionId } from '../collections/types'
import { LEADERBOARD_ENABLED, SUPABASE_ANON_KEY, SUPABASE_URL, TURNSTILE_SITE_KEY } from './config'
import { load, save } from './storage'

export interface LeaderRow {
  district_id: string
  participants: number
  avg_score: number
  avg_count: number
  rank_score: number
}

export interface Board {
  rows: LeaderRow[]
  total: number
}

let client: Promise<SupabaseClient> | null = null

function supabase(): Promise<SupabaseClient> {
  if (!LEADERBOARD_ENABLED) return Promise.reject(new Error('leaderboard disabled'))
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, storageKey: 'ak:sb' } }),
  )
  return client
}

export const homeDistrict = {
  get: () => load<string>('ak:home', ''),
  set: (id: string) => save('ak:home', id),
}

export function hasJoined(collection: CollectionId): boolean {
  return load<string[]>('ak:joined', []).includes(collection)
}

function markJoined(collection: CollectionId) {
  const j = new Set(load<string[]>('ak:joined', []))
  j.add(collection)
  save('ak:joined', [...j])
}

async function ensureSession(sb: SupabaseClient): Promise<void> {
  const { data } = await sb.auth.getSession()
  if (data.session) return
  const captchaToken = TURNSTILE_SITE_KEY ? await (await import('./turnstile')).getTurnstileToken(TURNSTILE_SITE_KEY) : undefined
  const { error } = await sb.auth.signInAnonymously({ options: { captchaToken } })
  if (error) throw error
}

export async function submitScore(input: {
  collection: CollectionId
  home: string
  score: number
  count: number
  levels: string
}): Promise<void> {
  const sb = await supabase()
  await ensureSession(sb)
  const { error } = await sb.from('scores').upsert(
    { collection: input.collection, home_district: input.home, score: input.score, count: input.count, levels: input.levels },
    { onConflict: 'user_id,collection' },
  )
  if (error) throw error
  homeDistrict.set(input.home)
  markJoined(input.collection)
}

export async function fetchBoard(collection: CollectionId): Promise<Board> {
  const sb = await supabase()
  const [rows, total] = await Promise.all([
    sb.rpc('leaderboard', { p_collection: collection }),
    sb.rpc('leaderboard_total', { p_collection: collection }),
  ])
  if (rows.error) throw rows.error
  if (total.error) throw total.error
  return { rows: (rows.data ?? []) as LeaderRow[], total: Number(total.data ?? 0) }
}
