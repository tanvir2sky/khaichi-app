// Builds src/data/bdMap.json from geoBoundaries BGD ADM2 (districts).
// Source: geoBoundaries gbOpen BGD ADM2 (BBS / OCHA ROAP), CC BY 3.0 IGO.
// Run: npm run build:map   (downloads the source if scripts/raw is empty)
import fs from 'node:fs'
import path from 'node:path'
// @ts-expect-error mapshaper ships no types
import mapshaper from 'mapshaper'
import * as topo from 'topojson-client'
import { geoIdentity, geoPath } from 'd3-geo'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { Feature, FeatureCollection, Polygon, MultiPolygon } from 'geojson'
import { DISTRICTS, DISTRICT_BY_ID } from '../src/data/districts.ts'

const SRC = 'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/BGD/ADM2/geoBoundaries-BGD-ADM2_simplified.geojson'
const RAW = path.resolve('scripts/raw/bgd-adm2.geojson')
const OUT = path.resolve('src/data/bdMap.json')
const WIDTH = 600

// geoBoundaries spellings -> our canonical ids
const ALIAS: Record<string, string> = {
  barisal: 'barishal',
  bogra: 'bogura',
  brahamanbaria: 'brahmanbaria',
  chittagong: 'chattogram',
  comilla: 'cumilla',
  "cox's bazar": 'coxsbazar',
  jessore: 'jashore',
  jhalokati: 'jhalokathi',
  maulvibazar: 'moulvibazar',
  nawabganj: 'chapainawabganj',
  netrakona: 'netrokona',
}

async function main() {
  if (!fs.existsSync(RAW)) {
    fs.mkdirSync(path.dirname(RAW), { recursive: true })
    const res = await fetch(SRC)
    if (!res.ok) throw new Error(`download failed: ${res.status}`)
    fs.writeFileSync(RAW, Buffer.from(await res.arrayBuffer()))
  }
  const raw = JSON.parse(fs.readFileSync(RAW, 'utf8')) as FeatureCollection
  for (const f of raw.features) {
    const name = String(f.properties!.shapeName).toLowerCase()
    const id = ALIAS[name] ?? name
    if (!DISTRICT_BY_ID[id]) throw new Error(`unmapped district: ${f.properties!.shapeName}`)
    f.properties = { id, division: DISTRICT_BY_ID[id].division }
  }

  const out = await mapshaper.applyCommands(
    '-i bd.json -simplify 4% weighted keep-shapes -proj merc -o format=topojson bd.topo.json',
    { 'bd.json': JSON.stringify(raw) },
  )
  const topology = JSON.parse(out['bd.topo.json']) as Topology
  const obj = topology.objects.bd as GeometryCollection<{ id: string; division: string }>
  const fc = topo.feature(topology, obj) as FeatureCollection<Polygon | MultiPolygon, { id: string; division: string }>
  const nbrs = topo.neighbors(obj.geometries as never)

  const projection = geoIdentity().reflectY(true).fitSize([WIDTH, 100000], fc)
  const p = geoPath(projection).digits(1)
  const [[x0, y0], [x1, y1]] = p.bounds(fc)
  const h = Math.ceil(y1 - y0)
  // shift so bounds start at 0,0
  projection.translate([projection.translate()[0] - x0, projection.translate()[1] - y0])

  const byId: Record<string, { d: string; c: [number, number]; n: string[] }> = {}
  fc.features.forEach((f, i) => {
    const id = f.properties.id
    byId[id] = {
      d: p(f)!,
      c: largestPartCentroid(f, p),
      n: nbrs[i].map((j) => fc.features[j].properties.id).sort(),
    }
  })

  // Division borders and outer coastline as single meshes for nicer styling.
  const divisionMesh = topo.mesh(topology, obj as never, (a: any, b: any) => a !== b && a.properties.division !== b.properties.division)
  const outline = topo.mesh(topology, obj as never, (a: any, b: any) => a === b)

  const missing = DISTRICTS.filter((x) => !byId[x.id]).map((x) => x.id)
  if (missing.length) throw new Error(`missing geometry: ${missing.join(', ')}`)

  const json = {
    attribution: 'Boundaries: geoBoundaries (BBS / OCHA ROAP), CC BY 3.0 IGO',
    w: Math.ceil(x1 - x0),
    h,
    divisions: p(divisionMesh),
    outline: p(outline),
    districts: Object.fromEntries(DISTRICTS.map((x) => [x.id, byId[x.id]])),
  }
  fs.writeFileSync(OUT, JSON.stringify(json))
  console.log(`wrote ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB), ${json.w}x${json.h}`)
}

function largestPartCentroid(f: Feature<Polygon | MultiPolygon>, p: ReturnType<typeof geoPath>): [number, number] {
  let best: Feature = f
  if (f.geometry.type === 'MultiPolygon') {
    let bestArea = -1
    for (const coords of f.geometry.coordinates) {
      const part: Feature<Polygon> = { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: coords } }
      const a = p.area(part)
      if (a > bestArea) {
        bestArea = a
        best = part
      }
    }
  }
  const [cx, cy] = p.centroid(best)
  return [Math.round(cx * 10) / 10, Math.round(cy * 10) / 10]
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
