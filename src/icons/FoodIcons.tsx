// Simple flat category icons in one style (48×48, dark-brown outline). Placeholders for commissioned art.
import type { ReactElement } from 'react'
import type { IconName } from './names'

const INK = '#3A2417'
const S = { stroke: INK, strokeWidth: 2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

type Draw = (tint: string) => ReactElement

const bowlShape = (fill: string) => <path d="M6 24h36c0 9-8 16-18 16S6 33 6 24z" fill={fill} {...S} />

const ICONS: Record<IconName, Draw> = {
  rosogolla: () => (
    <>
      {bowlShape('#E9D8B4')}
      <ellipse cx="24" cy="24" rx="16" ry="3" fill="#F4E3A8" {...S} />
      <circle cx="17" cy="20" r="6" fill="#FFF9EE" {...S} />
      <circle cx="29" cy="19" r="6" fill="#FFF9EE" {...S} />
      <circle cx="23" cy="14" r="5.5" fill="#FFF9EE" {...S} />
    </>
  ),
  chomchom: () => (
    <>
      <ellipse cx="24" cy="26" rx="17" ry="9" fill="#D9826A" {...S} transform="rotate(-15 24 26)" />
      <path d="M12 26c6-4 16-6 24-5" fill="none" {...S} stroke="#F7E6C8" strokeWidth={3} />
      {[14, 20, 26, 32].map((x, i) => <circle key={x} cx={x} cy={22 + (i % 2) * 6} r="1.2" fill="#FFF6E6" />)}
    </>
  ),
  sandesh: () => (
    <>
      <path d="M8 30c0-8 7-14 16-14s16 6 16 14z" fill="#F3DFB0" {...S} />
      <rect x="6" y="29" width="36" height="7" rx="3" fill="#E8CB8E" {...S} />
      <path d="M16 24c3-3 5-3 8 0 3-3 5-3 8 0" fill="none" {...S} />
      <circle cx="24" cy="19" r="1.6" fill="#7BA05B" />
    </>
  ),
  doi: () => (
    <>
      <path d="M10 18h28l-3 18c-1 4-5 6-11 6s-10-2-11-6z" fill="#B8562F" {...S} />
      <ellipse cx="24" cy="18" rx="14" ry="4" fill="#FFF5E1" {...S} />
      <path d="M13 26h22" {...S} stroke="#8E3E1F" />
    </>
  ),
  gur: () => (
    <>
      <path d="M12 16h24l-2 20c-1 4-5 6-10 6s-9-2-10-6z" fill="#8C4A1E" {...S} />
      <ellipse cx="24" cy="16" rx="12" ry="3.5" fill="#5A2C0F" {...S} />
      <path d="M30 17c1 4 0 7-2 8" fill="none" stroke="#C47A2C" strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  ghee: () => (
    <>
      <rect x="13" y="14" width="22" height="26" rx="5" fill="#F7E7B4" {...S} />
      <rect x="13" y="22" width="22" height="18" rx="5" fill="#F2C94C" {...S} />
      <rect x="15" y="8" width="18" height="6" rx="2" fill="#B3261E" {...S} />
    </>
  ),
  bowl: () => (
    <>
      {bowlShape('#E9D8B4')}
      <ellipse cx="24" cy="24" rx="16" ry="4" fill="#FBF1D9" {...S} />
      <circle cx="19" cy="23" r="1.4" fill="#7BA05B" />
      <circle cx="26" cy="22" r="1.4" fill="#B5651D" />
      <circle cx="31" cy="24" r="1.4" fill="#7BA05B" />
    </>
  ),
  fish: () => (
    <>
      <path d="M6 24c6-9 20-11 30-4l6-5v18l-6-5C26 35 12 33 6 24z" fill="#C9D3DA" {...S} />
      <circle cx="13" cy="22" r="1.6" fill={INK} />
      <path d="M18 19c3 3 3 7 0 10" fill="none" {...S} />
    </>
  ),
  shrimp: () => (
    <>
      <path d="M36 14c-12-4-24 4-24 14 0 6 5 10 11 10 4 0 6-3 4-6-6 2-9-2-8-5 1-5 8-9 17-7z" fill="#F08A4B" {...S} />
      <path d="M36 14l6-4M36 14l7 2" {...S} />
      <path d="M20 22l5 3M17 27l5 2" {...S} />
    </>
  ),
  rice: () => (
    <>
      {bowlShape('#D7E3EA')}
      <path d="M10 24c2-9 26-9 28 0z" fill="#FFFDF7" {...S} />
      <path d="M18 19l1 1M24 17l1 1M29 19l1 1M21 22l1 1M27 22l1 1" {...S} />
    </>
  ),
  biryani: () => (
    <>
      <path d="M8 22h32v10c0 5-7 9-16 9S8 37 8 32z" fill="#7C8B91" {...S} />
      <ellipse cx="24" cy="22" rx="16" ry="4.5" fill="#F2C14E" {...S} />
      <circle cx="19" cy="21" r="2.5" fill="#B5651D" {...S} />
      <circle cx="29" cy="22" r="2" fill="#FFF7E0" {...S} />
      <path d="M8 26H4M40 26h4" {...S} />
    </>
  ),
  meat: () => (
    <>
      {bowlShape('#E9D8B4')}
      <ellipse cx="24" cy="24" rx="16" ry="4" fill="#9B4A1C" {...S} />
      <rect x="15" y="18" width="7" height="6" rx="2" fill="#6E3214" {...S} />
      <rect x="25" y="17" width="7" height="6" rx="2" fill="#6E3214" {...S} />
    </>
  ),
  tea: () => (
    <>
      <path d="M10 18h22v10c0 6-5 10-11 10s-11-4-11-10z" fill="#FFFFFF" {...S} />
      <ellipse cx="21" cy="18" rx="11" ry="3" fill="#B9652B" {...S} />
      <path d="M32 21c5 0 6 7 0 7" fill="none" {...S} />
      <path d="M6 40h30" {...S} />
      <path d="M36 8c6 0 8 5 4 10-4-1-6-6-4-10z" fill="#4E9A4A" {...S} />
    </>
  ),
  snack: () => (
    <>
      <rect x="9" y="28" width="30" height="7" rx="3" fill="#D9A55B" {...S} />
      <rect x="11" y="21" width="26" height="7" rx="3" fill="#E8BE73" {...S} />
      <rect x="13" y="14" width="22" height="7" rx="3" fill="#F2D49A" {...S} />
      <path d="M18 17h2M26 17h2M16 24h2M28 24h2" {...S} />
    </>
  ),
  greens: () => (
    <>
      <path d="M24 40C12 34 10 20 16 10c8 6 12 18 8 30z" fill="#6DAA4B" {...S} />
      <path d="M24 40c10-6 14-18 8-28-8 6-11 18-8 28z" fill="#8CC063" {...S} />
      <path d="M24 40V22" {...S} />
    </>
  ),
  mango: (t) => (
    <>
      <path d="M20 10c12-2 20 8 18 18-2 9-12 14-20 10S8 26 12 18c2-4 5-7 8-8z" fill={t || '#F2B705'} {...S} />
      <path d="M22 10c0-3 2-5 4-6" {...S} />
      <path d="M25 6c5-2 10 0 11 4-5 2-9 0-11-4z" fill="#4E9A4A" {...S} />
    </>
  ),
  jackfruit: (t) => (
    <>
      <ellipse cx="24" cy="26" rx="14" ry="15" fill={t || '#9DB33B'} {...S} />
      {[...Array(9)].map((_, i) => (
        <circle key={i} cx={16 + (i % 3) * 8} cy={18 + Math.floor(i / 3) * 8} r="1.3" fill={INK} />
      ))}
      <path d="M24 11V5" {...S} />
    </>
  ),
  coconut: (t) => (
    <>
      <circle cx="24" cy="26" r="15" fill={t || '#7A4A26'} {...S} />
      <circle cx="19" cy="21" r="2" fill={INK} />
      <circle cx="27" cy="21" r="2" fill={INK} />
      <circle cx="23" cy="28" r="2" fill={INK} />
    </>
  ),
  citrus: (t) => (
    <>
      <circle cx="24" cy="24" r="16" fill={t || '#9CC93A'} {...S} />
      <circle cx="24" cy="24" r="12" fill="#F4F8D8" {...S} />
      {[0, 60, 120].map((a) => (
        <path key={a} d="M24 13v22" {...S} transform={`rotate(${a} 24 24)`} />
      ))}
    </>
  ),
  'fruit-round': (t) => (
    <>
      <circle cx="24" cy="27" r="14" fill={t || '#9CC93A'} {...S} />
      <path d="M24 13V7" {...S} />
      <path d="M25 9c4-4 10-4 12 0-4 3-9 3-12 0z" fill="#4E9A4A" {...S} />
      <path d="M17 22c1-2 3-4 5-4" fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  'fruit-bunch': (t) => (
    <>
      <path d="M24 6v8M24 10c-4 2-8 6-9 10M24 10c4 2 8 6 9 10" {...S} fill="none" />
      {[
        [15, 22], [24, 20], [33, 22], [19, 30], [29, 30], [24, 38],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill={t || '#C0392B'} {...S} />
      ))}
    </>
  ),
  'fruit-long': (t) => (
    <>
      <path d="M8 16c4 14 18 22 32 16-2 6-10 10-18 8C12 38 6 28 8 16z" fill={t || '#F4D03F'} {...S} />
      <path d="M8 16l-2-5" {...S} />
    </>
  ),
  'fruit-star': (t) => (
    <path
      d="M24 6l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z"
      fill={t || '#E8C547'}
      {...S}
    />
  ),
  'fruit-pod': (t) => (
    <>
      <path d="M8 30c4-6 6-4 10-8s6-4 10-8 8-6 12-4c2 4-2 8-6 10s-4 6-8 8-6 6-10 8-8 0-8-6z" fill={t || '#8B5A2B'} {...S} />
      <path d="M38 10l4-4" {...S} />
    </>
  ),
  'pitha-bhapa': (t) => (
    <>
      <ellipse cx="24" cy="32" rx="18" ry="5" fill="#E5D3B0" {...S} />
      <path d="M10 30c0-8 6-14 14-14s14 6 14 14z" fill={t || '#F7F0E0'} {...S} />
      <path d="M18 22c3 2 9 2 12 0" fill="none" stroke="#8C4A1E" strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  'pitha-flat': (t) => (
    <>
      <ellipse cx="24" cy="28" rx="18" ry="8" fill="#E5D3B0" {...S} />
      <ellipse cx="24" cy="26" rx="13" ry="6" fill={t || '#F7F0E0'} {...S} />
      {[[18, 25], [24, 23], [29, 26], [22, 28], [27, 29]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1" fill="#C9B48A" />
      ))}
    </>
  ),
  'pitha-roll': (t) => (
    <>
      <rect x="8" y="18" width="30" height="13" rx="6.5" fill={t || '#F3E2B8'} {...S} />
      <ellipse cx="38" cy="24.5" rx="4" ry="6.5" fill="#F7EDD2" {...S} />
      <circle cx="38" cy="24.5" r="2.2" fill="#8C4A1E" />
    </>
  ),
  'pitha-puli': (t) => (
    <>
      <path d="M8 30c0-10 7-16 16-16s16 6 16 16z" fill={t || '#F7F0E0'} {...S} />
      <path d="M8 30h32" {...S} />
      {[12, 17, 22, 27, 32, 37].map((x) => <path key={x} d={`M${x} 30l1.5 3`} {...S} />)}
    </>
  ),
  'pitha-fried': (t) => (
    <>
      <circle cx="24" cy="25" r="15" fill={t || '#B5651D'} {...S} />
      <path d="M16 20c2-3 5-5 9-5" fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx="28" cy="29" r="1.4" fill={INK} opacity={0.5} />
      <circle cx="21" cy="31" r="1.2" fill={INK} opacity={0.5} />
    </>
  ),
  'pitha-nakshi': (t) => (
    <>
      <path d="M24 6c10 6 14 12 14 18s-4 12-14 18C14 36 10 30 10 24s4-12 14-18z" fill={t || '#E3B866'} {...S} />
      <path d="M24 12v24M17 18l14 12M31 18L17 30" {...S} stroke="#8C4A1E" strokeWidth={1.5} />
      <circle cx="24" cy="24" r="3" fill="#FFF3D6" {...S} strokeWidth={1.5} />
    </>
  ),
  globe: (t) => (
    <>
      <circle cx="24" cy="24" r="16" fill={t || '#BFE3EA'} {...S} />
      <path d="M8 24h32M24 8c-6 5-6 27 0 32M24 8c6 5 6 27 0 32" fill="none" {...S} />
    </>
  ),
}

export function FoodIcon({ name, tint, size = 40, className }: { name: IconName; tint?: string; size?: number; className?: string }) {
  const draw = ICONS[name] ?? ICONS.rosogolla
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true">
      {draw(tint ?? '')}
    </svg>
  )
}
