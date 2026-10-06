// Renders a DOM node to PNG in the browser so Chrome's own text shaper handles Bangla conjuncts
// (server-side renderers like Satori break যুক্তাক্ষর).
import { domToBlob } from 'modern-screenshot'

export async function captureNode(node: HTMLElement, width: number, height: number): Promise<Blob> {
  await document.fonts.ready
  // Images inside the card (user photo) must be decoded before capture.
  await Promise.all(
    Array.from(node.querySelectorAll('img')).map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => {}))),
  )
  const blob = await domToBlob(node, {
    width,
    height,
    scale: 1,
    type: 'image/png',
    backgroundColor: null,
    font: { preferredFormat: 'woff2' },
    // modern-screenshot freezes every element's live width/height. Text can rasterise a little wider
    // inside the SVG snapshot, so content-sized boxes (pills, chips) marked data-fit size to content again.
    onCloneNode: (cloned) => {
      if (!(cloned instanceof Element)) return
      for (const el of cloned.querySelectorAll<HTMLElement>('[data-fit]')) {
        el.style.setProperty('width', 'max-content')
        el.style.setProperty('height', 'auto')
      }
    },
  })
  if (!blob) throw new Error('capture failed')
  return blob
}
