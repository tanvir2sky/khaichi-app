// Builds src/data/worldMap.json + src/data/countries.json for the "আমি ঘুরেছি: বিশ্ব" collection.
// Geometry: Natural Earth 1:50m via world-atlas (public domain). Names: CLDR via Intl.DisplayNames.
// List: 193 UN members + Palestine + Vatican, minus Bangladesh (home) = 194.
// Run: npm run build:world
import fs from 'node:fs'
import path from 'node:path'
import * as topo from 'topojson-client'
// @ts-expect-error mapshaper ships no types
import mapshaper from 'mapshaper'
import { geoArea, geoNaturalEarth1, geoPath } from 'd3-geo'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'

import iso from 'i18n-iso-countries'

const require = (await import('node:module')).createRequire(import.meta.url)
const world = require('world-atlas/countries-50m.json') as Topology

const REGIONS: { id: string; bn: string; codes: string[] }[] = [
  { id: 'south-asia', bn: 'দক্ষিণ এশিয়া', codes: ['AF', 'BT', 'IN', 'MV', 'NP', 'PK', 'LK'] },
  { id: 'middle-east', bn: 'মধ্যপ্রাচ্য ও পশ্চিম এশিয়া', codes: ['AE', 'AM', 'AZ', 'BH', 'GE', 'IL', 'IQ', 'IR', 'JO', 'KW', 'LB', 'OM', 'PS', 'QA', 'SA', 'SY', 'TR', 'YE'] },
  { id: 'south-east-asia', bn: 'দক্ষিণ-পূর্ব এশিয়া', codes: ['BN', 'ID', 'KH', 'LA', 'MM', 'MY', 'PH', 'SG', 'TH', 'TL', 'VN'] },
  { id: 'east-asia', bn: 'পূর্ব এশিয়া', codes: ['CN', 'JP', 'KP', 'KR', 'MN'] },
  { id: 'central-asia', bn: 'মধ্য এশিয়া', codes: ['KG', 'KZ', 'TJ', 'TM', 'UZ'] },
  { id: 'europe', bn: 'ইউরোপ', codes: ['AD', 'AL', 'AT', 'BA', 'BE', 'BG', 'BY', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GB', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MK', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'RS', 'RU', 'SE', 'SI', 'SK', 'SM', 'UA', 'VA'] },
  { id: 'africa', bn: 'আফ্রিকা', codes: ['AO', 'BF', 'BI', 'BJ', 'BW', 'CD', 'CF', 'CG', 'CI', 'CM', 'CV', 'DJ', 'DZ', 'EG', 'ER', 'ET', 'GA', 'GH', 'GM', 'GN', 'GQ', 'GW', 'KE', 'KM', 'LR', 'LS', 'LY', 'MA', 'MG', 'ML', 'MR', 'MU', 'MW', 'MZ', 'NA', 'NE', 'NG', 'RW', 'SC', 'SD', 'SL', 'SN', 'SO', 'SS', 'ST', 'SZ', 'TD', 'TG', 'TN', 'TZ', 'UG', 'ZA', 'ZM', 'ZW'] },
  { id: 'north-america', bn: 'উত্তর ও মধ্য আমেরিকা', codes: ['AG', 'BB', 'BS', 'BZ', 'CA', 'CR', 'CU', 'DM', 'DO', 'GD', 'GT', 'HN', 'HT', 'JM', 'KN', 'LC', 'MX', 'NI', 'PA', 'SV', 'TT', 'US', 'VC'] },
  { id: 'south-america', bn: 'দক্ষিণ আমেরিকা', codes: ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PE', 'PY', 'SR', 'UY', 'VE'] },
  { id: 'oceania', bn: 'ওশেনিয়া', codes: ['AU', 'FJ', 'FM', 'KI', 'MH', 'NR', 'NZ', 'PG', 'PW', 'SB', 'TO', 'TV', 'VU', 'WS'] },
]

// Friendlier Bangla names than CLDR's defaults for a few entries.
const BN_OVERRIDE: Record<string, string> = {
  PS: 'ফিলিস্তিন',
  CD: 'কঙ্গো (কিনশাসা)',
  CG: 'কঙ্গো (ব্রাজাভিল)',
  VA: 'ভ্যাটিকান সিটি',
  US: 'যুক্তরাষ্ট্র',
  GB: 'যুক্তরাজ্য',
  AE: 'সংযুক্ত আরব আমিরাত',
}

// Lon/lat for states missing from the 1:50m data (drawn as dots).
const FALLBACK_LONLAT: Record<string, [number, number]> = {
  TV: [179.2, -8.5],
  NR: [166.93, -0.53],
  MH: [171.18, 7.13],
  KI: [-157.36, 1.87],
  FM: [158.22, 6.92],
  PW: [134.58, 7.51],
  MV: [73.5, 4.17],
  SC: [55.45, -4.68],
  ST: [6.61, 0.19],
  KM: [43.87, -11.88],
  MU: [57.55, -20.35],
  CV: [-23.6, 15.1],
  MT: [14.4, 35.9],
  SM: [12.46, 43.94],
  VA: [12.45, 41.9],
  MC: [7.42, 43.74],
  AD: [1.52, 42.51],
  LI: [9.55, 47.16],
  SG: [103.82, 1.35],
  BH: [50.55, 26.07],
  TO: [-175.2, -21.18],
  WS: [-172.1, -13.76],
  AG: [-61.8, 17.06],
  KN: [-62.75, 17.33],
  LC: [-60.98, 13.91],
  VC: [-61.2, 13.25],
  GD: [-61.68, 12.12],
  DM: [-61.37, 15.41],
  BB: [-59.54, 13.19],
}

const WIDTH = 1000
const SMALL_AREA = 12 // px²: below this a country is drawn as a tappable dot

const bn = new Intl.DisplayNames(['bn'], { type: 'region' })
const en = new Intl.DisplayNames(['en'], { type: 'region' })

const obj = world.objects.countries as GeometryCollection<{ name: string }>
const all = topo.feature(world, obj) as FeatureCollection<Polygon | MultiPolygon, { name: string }>
const rawLand = all.features.filter((f) => f.properties.name !== 'Antarctica')
for (const f of rawLand) (f.properties as any).iso = f.id === undefined ? '' : String(f.id).padStart(3, '0')
// TopoJSON output keeps d3's clockwise ring winding (mapshaper's GeoJSON output is RFC 7946 CCW,
// which d3-geo would read as "the whole globe minus the country").
const simplified = await mapshaper.applyCommands('-i w.json -simplify 8% weighted keep-shapes -o format=topojson w.topo.json', {
  'w.json': JSON.stringify({ type: 'FeatureCollection', features: rawLand }),
})
const wTopo = JSON.parse(simplified['w.topo.json']) as Topology
const land = (topo.feature(wTopo, wTopo.objects.w as GeometryCollection) as FeatureCollection<Polygon | MultiPolygon, { name: string; iso: string }>).features
for (const f of land) {
  f.id = f.properties.iso || undefined
  fixWinding(f)
}

// Simplification can flip tiny antimeridian slivers (Russia, Fiji); a part bigger than a
// hemisphere is really an inside-out ring, so reverse it.
function fixWinding(f: Feature<Polygon | MultiPolygon>) {
  const parts = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
  for (const rings of parts) {
    if (geoArea({ type: 'Polygon', coordinates: rings }) > 2 * Math.PI) for (const r of rings) r.reverse()
  }
}

const projection = geoNaturalEarth1().fitWidth(WIDTH, { type: 'FeatureCollection', features: land })
const p = geoPath(projection).digits(1)
const [[x0, y0], [, y1]] = p.bounds({ type: 'FeatureCollection', features: land })
projection.translate([projection.translate()[0] - x0, projection.translate()[1] - y0])

const byNumeric = new Map<string, Feature<Polygon | MultiPolygon, { name: string }>>()
for (const f of land) if (f.id !== undefined) byNumeric.set(String(f.id).padStart(3, '0'), f)

const listed = new Set<string>()
const countries: { id: string; bn: string; en: string; region: string }[] = []
const shapes: Record<string, { d?: string; c: [number, number] }> = {}

for (const r of REGIONS) {
  for (const code of r.codes) {
    if (listed.has(code)) throw new Error(`duplicate ${code}`)
    listed.add(code)
    countries.push({ id: code, bn: BN_OVERRIDE[code] ?? bn.of(code)!, en: en.of(code)!, region: r.id })
    const num = iso.alpha2ToNumeric(code) as string | undefined
    const f = num ? byNumeric.get(num) : undefined
    const area = f ? p.area(f) : 0
    if (f && area >= SMALL_AREA) {
      const [cx, cy] = p.centroid(largestPart(f))
      shapes[code] = { d: p(f)!, c: [round(cx), round(cy)] }
    } else {
      const ll = f ? null : FALLBACK_LONLAT[code]
      const pt = f ? p.centroid(f) : ll ? projection(ll) : null
      if (!pt || Number.isNaN(pt[0])) throw new Error(`no location for ${code}`)
      shapes[code] = { c: [round(pt[0]), round(pt[1])] }
    }
  }
}

if (countries.length !== 194) throw new Error(`expected 194 countries, got ${countries.length}`)

// Frozen order for share-link encoding: alphabetical by ISO code. Append-only.
countries.sort((a, b) => a.id.localeCompare(b.id))

// Everything that is land but not in the list (Greenland, W. Sahara, territories…) as one grey path.
const listedNumeric = new Set([...listed].map((c) => iso.alpha2ToNumeric(c)))
const bdNum = iso.alpha2ToNumeric('BD') ?? '050'
const other = land.filter((f) => !listedNumeric.has(String(f.id ?? '').padStart(3, '0')) && String(f.id) !== bdNum)
const bdFeature = byNumeric.get(bdNum)!

const map = {
  attribution: 'Natural Earth (public domain) via world-atlas',
  w: WIDTH,
  h: Math.ceil(y1 - y0),
  other: p({ type: 'FeatureCollection', features: other }),
  home: { d: p(bdFeature), c: p.centroid(bdFeature).map(round) },
  countries: shapes,
}

fs.writeFileSync(path.resolve('src/data/worldMap.json'), JSON.stringify(map))
fs.writeFileSync(
  path.resolve('src/data/countries.json'),
  JSON.stringify({ regions: REGIONS.map(({ id, bn }) => ({ id, bn })), countries }, null, 1),
)
const dots = Object.values(shapes).filter((s) => !s.d).length
console.log(`worldMap.json ${(fs.statSync('src/data/worldMap.json').size / 1024).toFixed(1)} KB, ${map.w}x${map.h}, ${countries.length} countries, ${dots} dots`)

function round(n: number) {
  return Math.round(n * 10) / 10
}

function largestPart(f: Feature<Polygon | MultiPolygon>): Feature {
  if (f.geometry.type !== 'MultiPolygon') return f
  let best: Feature = f
  let bestArea = -1
  for (const coords of f.geometry.coordinates) {
    const part: Feature<Polygon> = { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: coords } }
    const a = p.area(part)
    if (a > bestArea) {
      bestArea = a
      best = part
    }
  }
  return best
}
