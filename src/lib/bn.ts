const DIGITS = '০১২৩৪৫৬৭৮৯'

/** Western digits -> Bangla digits, e.g. bn(41) === '৪১'. */
export function bn(n: number | string): string {
  return String(n).replace(/\d/g, (d) => DIGITS[Number(d)])
}

/** Bangla genitive for a name: রাহাত -> রাহাতের, ঢাকা -> ঢাকার, Rahat -> Rahat-এর. */
export function genitive(name: string): string {
  const t = name.trim()
  if (!t) return t
  if (/[A-Za-z0-9]$/.test(t)) return `${t}-এর`
  return /[ািীুূৃেৈোৌ]$/.test(t) ? `${t}র` : `${t}ের`
}
