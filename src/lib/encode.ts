// Levels (0–3 per item) <-> compact base64url string, 2 bits per item.
// Item i lives in byte floor(i/4) at bit offset (i%4)*2.

export type Level = 0 | 1 | 2 | 3

export function encodeLevels(levels: ArrayLike<number>): string {
  const bytes = new Uint8Array(Math.ceil(levels.length / 4))
  for (let i = 0; i < levels.length; i++) {
    const v = levels[i] & 3
    bytes[i >> 2] |= v << ((i & 3) * 2)
  }
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Decodes to exactly `n` levels; malformed input yields all zeros. */
export function decodeLevels(s: string | null | undefined, n: number): Level[] {
  const out = new Array<Level>(n).fill(0)
  if (!s || !/^[A-Za-z0-9_-]+$/.test(s)) return out
  let bin: string
  try {
    bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4))
  } catch {
    return out
  }
  for (let i = 0; i < n; i++) {
    const byte = bin.charCodeAt(i >> 2)
    if (Number.isNaN(byte)) break
    out[i] = ((byte >> ((i & 3) * 2)) & 3) as Level
  }
  return out
}
