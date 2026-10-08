// Works in the browser (Vite env) and in Node build scripts (process.env).
const env: Record<string, string | undefined> =
  (import.meta as { env?: Record<string, string> }).env ?? (typeof process !== 'undefined' ? process.env : {})

export const SITE_URL: string = (env.VITE_SITE_URL || 'https://amikheyechi.com').replace(/\/$/, '')
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '')
export const SUPABASE_URL: string = env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY: string = env.VITE_SUPABASE_ANON_KEY || ''
export const TURNSTILE_SITE_KEY: string = env.VITE_TURNSTILE_SITE_KEY || ''
export const POSTHOG_KEY: string = env.VITE_POSTHOG_KEY || ''
export const POSTHOG_HOST: string = (env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/$/, '')
export const FEEDBACK_URL: string = env.VITE_FEEDBACK_URL || ''

export const LEADERBOARD_ENABLED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const AUTHOR = { name: 'MD TANVIR HOSSAIN', email: 'tanvir2sky@gmail.com' } as const
