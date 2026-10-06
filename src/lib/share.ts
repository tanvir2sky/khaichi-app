// All share/save side effects live here so a future Capacitor build only swaps this file
// (@capacitor/share + @capacitor/filesystem — Android WebView has no Web Share API).

export type ShareResult = 'shared' | 'downloaded' | 'cancelled' | 'unsupported'

export function canShareFile(): boolean {
  try {
    const probe = new File([new Blob(['x'], { type: 'image/png' })], 'x.png', { type: 'image/png' })
    return Boolean(navigator.canShare?.({ files: [probe] }))
  } catch {
    return false
  }
}

export async function shareImage(blob: Blob, filename: string, text: string, url: string): Promise<ShareResult> {
  const file = new File([blob], filename, { type: 'image/png' })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      // Many apps drop `text` when files are present; the URL is printed on the card anyway.
      await navigator.share({ files: [file], text: `${text}\n${url}` })
      return 'shared'
    } catch (e) {
      if ((e as DOMException)?.name === 'AbortError') return 'cancelled'
    }
  }
  return 'unsupported'
}

export function downloadImage(blob: Blob, filename: string): ShareResult {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000)
  return 'downloaded'
}

export async function shareLink(text: string, url: string): Promise<'shared' | 'copied' | 'failed'> {
  if (navigator.share) {
    try {
      await navigator.share({ text, url })
      return 'shared'
    } catch (e) {
      if ((e as DOMException)?.name === 'AbortError') return 'failed'
    }
  }
  return (await copyText(`${text} ${url}`)) ? 'copied' : 'failed'
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Old in-app browsers: textarea fallback
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    ta.remove()
    return ok
  }
}

export function facebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}
