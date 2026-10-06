import { useEffect, useRef, useState, type ReactNode } from 'react'
import { captureNode } from '../lib/capture'
import { canShareFile, copyText, downloadImage, facebookShareUrl, shareImage } from '../lib/share'
import { inAppBrowser, track } from '../lib/track'
import { CARD_SIZE, ShareCard, type CardFormat, type CardProps } from './ShareCard'

interface Props {
  title: string
  card: CardProps
  format: CardFormat
  onFormat: (f: CardFormat) => void
  filename: string
  shareText: string
  shareUrl: string
  onClose: () => void
  /** Extra controls above the preview (name, photo…) */
  controls?: ReactNode
  /** Extra content below the actions (leaderboard join…) */
  footer?: ReactNode
  /** Disable capture until async data (world map) is ready */
  ready?: boolean
  analytics: Record<string, unknown>
}

export function CardSheet({ title, card, format, onFormat, filename, shareText, shareUrl, onClose, controls, footer, ready = true, analytics }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [preview, setPreview] = useState('')
  const [busy, setBusy] = useState(true)
  const [toast, setToast] = useState('')
  const inApp = inAppBrowser()
  const fileShare = canShareFile()
  const cardKey = JSON.stringify(card)

  useEffect(() => {
    if (!ready) return
    let alive = true
    setBusy(true)
    const t = setTimeout(async () => {
      if (!ref.current) return
      try {
        const b = await captureNode(ref.current.firstElementChild as HTMLElement, CARD_SIZE[format].w, CARD_SIZE[format].h)
        if (!alive) return
        setBlob(b)
        setPreview((old) => {
          if (old) URL.revokeObjectURL(old)
          return URL.createObjectURL(b)
        })
        track('card_generated', { ...analytics, format })
      } catch (e) {
        console.error(e)
        if (alive) flash('কার্ড বানাতে সমস্যা হয়েছে, আবার চেষ্টা করুন')
      } finally {
        if (alive) setBusy(false)
      }
    }, 350)
    return () => {
      alive = false
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardKey, format, ready])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function flash(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2600)
  }

  async function onShare() {
    if (!blob) return
    const r = await shareImage(blob, filename, shareText, shareUrl)
    if (r === 'unsupported') {
      downloadImage(blob, filename)
      flash('ছবি সেভ হয়েছে, এবার ফেসবুকে পোস্ট করুন')
      track('card_shared', { ...analytics, method: 'download' })
    } else if (r === 'shared') {
      track('card_shared', { ...analytics, method: 'web_share' })
    }
  }

  function onDownload() {
    if (!blob) return
    downloadImage(blob, filename)
    track('card_shared', { ...analytics, method: 'download' })
    flash('ছবি সেভ হয়েছে')
  }

  async function onCopy() {
    const ok = await copyText(`${shareText} ${shareUrl}`)
    track('link_copied', analytics)
    flash(ok ? 'লিংক কপি হয়েছে! বন্ধুদের পাঠান' : 'কপি করা যায়নি')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[94dvh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl bg-[var(--paper)] p-4 pb-8 shadow-2xl sm:rounded-3xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">{title}</h2>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full bg-white text-xl" aria-label="বন্ধ করুন">
            ×
          </button>
        </div>

        {controls}

        <div className="my-3 flex gap-2" role="tablist">
          {(['feed', 'story'] as const).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={format === f}
              onClick={() => onFormat(f)}
              className={`flex-1 rounded-xl border py-2 text-sm font-bold ${format === f ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]' : 'border-[var(--line)] bg-white'}`}
            >
              {f === 'feed' ? 'ফেসবুক পোস্ট' : 'স্টোরি'}
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
          {preview ? (
            <img src={preview} alt="আপনার শেয়ার কার্ড" className={`block w-full ${busy ? 'opacity-60' : ''}`} />
          ) : (
            <div className="grid place-items-center text-[var(--muted)]" style={{ aspectRatio: `${CARD_SIZE[format].w} / ${CARD_SIZE[format].h}` }}>
              কার্ড বানানো হচ্ছে…
            </div>
          )}
          {busy && preview && <div className="absolute top-2 right-2 rounded-full bg-white/90 px-3 py-1 text-xs">আপডেট হচ্ছে…</div>}
        </div>

        {inApp && (
          <p className="mt-3 rounded-xl bg-[#FFF1C9] p-3 text-sm leading-relaxed">
            👉 ছবির উপর <b>চেপে ধরে</b> সেভ করুন। সেভ না হলে উপরের <b>⋮</b> মেনু থেকে <b>“Open in Chrome/Browser”</b> বেছে নিন।
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" disabled={!blob} onClick={onShare} className="btn-primary col-span-2">
            {fileShare ? 'শেয়ার করুন' : 'ছবি সেভ করুন'}
          </button>
          {fileShare && (
            <button type="button" disabled={!blob} onClick={onDownload} className="btn">
              ছবি সেভ
            </button>
          )}
          <button type="button" onClick={onCopy} className={`btn ${fileShare ? '' : 'col-span-2'}`}>
            চ্যালেঞ্জ লিংক কপি
          </button>
          <a
            href={facebookShareUrl(shareUrl)}
            target="_blank"
            rel="noopener"
            onClick={() => track('card_shared', { ...analytics, method: 'fb_link' })}
            className="btn col-span-2 text-center"
          >
            ফেসবুকে লিংক শেয়ার
          </a>
        </div>

        {footer}

        {toast && (
          <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] mx-auto w-fit rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)] shadow-lg">
            {toast}
          </div>
        )}

        {/* Off-screen full-size card used for capture */}
        <div aria-hidden="true" style={{ position: 'fixed', left: -20000, top: 0, pointerEvents: 'none' }} ref={ref}>
          <ShareCard {...card} />
        </div>
      </div>
    </div>
  )
}
