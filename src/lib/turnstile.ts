// Invisible Cloudflare Turnstile challenge, used as the captcha for Supabase anonymous sign-in.
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      remove: (id: string) => void
    }
  }
}

let script: Promise<void> | null = null

function loadScript(): Promise<void> {
  script ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('turnstile load failed'))
    document.head.appendChild(s)
  })
  return script
}

export async function getTurnstileToken(siteKey: string): Promise<string> {
  await loadScript()
  const host = document.createElement('div')
  host.style.position = 'fixed'
  host.style.bottom = '8px'
  host.style.right = '8px'
  host.style.zIndex = '100'
  document.body.appendChild(host)
  try {
    return await new Promise<string>((resolve, reject) => {
      window.turnstile!.render(host, {
        sitekey: siteKey,
        appearance: 'interaction-only',
        callback: resolve,
        'error-callback': () => reject(new Error('captcha failed')),
        'timeout-callback': () => reject(new Error('captcha timeout')),
      })
    })
  } finally {
    setTimeout(() => host.remove(), 500)
  }
}
