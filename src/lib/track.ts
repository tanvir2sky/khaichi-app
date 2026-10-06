// Analytics: events go to Google Analytics (gtag in index.html) when present, and to PostHog via
// sendBeacon (no SDK weight) when VITE_POSTHOG_KEY is set.
import { POSTHOG_HOST, POSTHOG_KEY } from './config'
import { load, save } from './storage'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

let distinctId = ''
const once = new Set<string>()

function id(): string {
  if (distinctId) return distinctId
  distinctId = load<string>('ak:uid', '')
  if (!distinctId) {
    distinctId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
    save('ak:uid', distinctId)
  }
  return distinctId
}

export function track(event: string, props: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  try {
    window.gtag?.('event', event, { ...props, in_app: inAppBrowser() ?? 'none' })
  } catch {
    // analytics must never break the app
  }
  if (!POSTHOG_KEY) return
  const body = JSON.stringify({
    api_key: POSTHOG_KEY,
    event,
    distinct_id: id(),
    properties: { ...props, $current_url: location.href, $referrer: document.referrer || undefined, in_app: inAppBrowser() },
  })
  const url = `${POSTHOG_HOST}/capture/`
  try {
    // text/plain keeps the beacon CORS-simple; PostHog parses the JSON body regardless.
    if (navigator.sendBeacon?.(url, new Blob([body], { type: 'text/plain' }))) return
  } catch {
    // fall through
  }
  fetch(url, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {})
}

/** Fire an event only once per page load. */
export function trackOnce(event: string, props?: Record<string, unknown>): void {
  if (once.has(event)) return
  once.add(event)
  track(event, props)
}

export function inAppBrowser(): string | null {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return 'facebook'
  if (/Messenger/i.test(ua)) return 'messenger'
  if (/Instagram/i.test(ua)) return 'instagram'
  if (/TikTok|musical_ly|Bytedance/i.test(ua)) return 'tiktok'
  return null
}
