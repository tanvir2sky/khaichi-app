import pithaData from '../data/pitha.json'
import type { IconName } from '../icons/names'
import { fractionTiers } from './tiers'
import type { Collection } from './types'

interface PithaRow {
  id: string
  bn: string
  en: string
  icon: IconName
  tint: string
  desc: string
  region: string
}

const rows = pithaData as unknown as PithaRow[]

export const pitha: Collection = {
  id: 'pitha',
  route: '/pitha',
  kind: 'grid',
  name: 'আমি খেয়েছি: পিঠা',
  short: 'পিঠা',
  items: rows.map((r) => ({
    id: r.id,
    bn: r.bn,
    en: r.en,
    icon: r.icon,
    tint: r.tint,
    sub: r.region,
    group: r.region ? 'regional' : 'national',
    desc: r.desc,
  })),
  groups: [
    { id: 'national', bn: 'সারা দেশের পিঠা' },
    { id: 'regional', bn: 'আঞ্চলিক পিঠা' },
  ],
  levels: ['খেয়েছি', 'নিজে বানিয়েছি', 'প্রতি শীতে খাই'],
  unitLine: 'রকম পিঠা খেয়েছি',
  question: 'আপনি কয় রকম পিঠা খেয়েছেন?',
  headline: 'কয় রকম পিঠা খেয়েছেন?',
  intro: 'ভাপা, চিতই, পাটিসাপটা থেকে আঞ্চলিক পিঠা পর্যন্ত, যেগুলো খেয়েছেন টিক দিন আর কার্ড বানিয়ে শেয়ার করুন।',
  tiers: fractionTiers(rows.length, [
    [0, 'পিঠা শুধু ছবিতে দেখেছেন', 'শীতকাল আপনাকে মিস করে'],
    [0.1, 'ভাপা-চিতই বাহিনী', 'চেনা পিঠাতেই সন্তুষ্ট'],
    [0.25, 'শীতের অতিথি', 'নানুবাড়ির পিঠা উৎসব মিস করেন না'],
    [0.45, 'পিঠা রসিক', 'খেজুরের গুড় দেখলেই মন ভালো'],
    [0.65, 'পিঠা উৎসবের প্রধান অতিথি', 'নাম শুনলেই রেসিপি বলে দেন'],
    [0.85, 'পিঠা-বিশারদ', 'আপনার মতো পিঠা চেনে কয়জন?'],
    [1, 'পিঠা কিংবদন্তি', 'সব পিঠাই খেয়েছেন! নকশি পিঠার মতোই অনন্য'],
  ]),
  theme: { accent: '#7A3E12', accentInk: '#ffffff', l1: '#F2D7A6', l2: '#D08A3C', l3: '#7A3E12', empty: '#EDE1C8' },
  seo: {
    title: 'পিঠার নাম ও তালিকা: কয় রকম পিঠা খেয়েছেন? | আমি খেয়েছি',
    description:
      'বাংলাদেশের ঐতিহ্যবাহী পিঠার নামের তালিকা: ভাপা, চিতই, পাটিসাপটা, পুলি, নকশি পিঠা ও আঞ্চলিক পিঠা। কয়টা খেয়েছেন টিক দিন আর পিঠা কার্ড শেয়ার করুন।',
    keywords: ['পিঠার নাম', 'শীতের পিঠার নাম', 'বাংলাদেশের পিঠা', 'pitha list Bangladesh'],
  },
}
