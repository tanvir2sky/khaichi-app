import folData from '../data/fol.json'
import type { IconName } from '../icons/names'
import { fractionTiers } from './tiers'
import type { Collection } from './types'

interface FruitRow {
  id: string
  bn: string
  en: string
  icon: IconName
  tint: string
  season: string
  rarity: 'common' | 'uncommon' | 'rare'
  desc: string
}

const rows = folData as unknown as FruitRow[]

export const fol: Collection = {
  id: 'fol',
  route: '/fol',
  kind: 'grid',
  name: 'আমি খেয়েছি: দেশি ফল',
  short: 'দেশি ফল',
  items: rows.map((r) => ({
    id: r.id,
    bn: r.bn,
    en: r.en,
    icon: r.icon,
    tint: r.tint,
    sub: r.season,
    group: r.rarity,
    desc: r.desc,
  })),
  groups: [
    { id: 'common', bn: 'চেনা ফল' },
    { id: 'uncommon', bn: 'কম চেনা ফল' },
    { id: 'rare', bn: 'দুর্লভ ফল' },
  ],
  levels: ['খেয়েছি', 'গাছ থেকে পেড়ে খেয়েছি', 'নিজের গাছ আছে'],
  unitLine: 'রকম দেশি ফল খেয়েছি',
  question: 'আপনি কয়টা দেশি ফল খেয়েছেন?',
  headline: 'কয়টা দেশি ফল খেয়েছেন?',
  intro: 'আম-কাঁঠাল তো সবাই খায়! লটকন, ডেউয়া, কাউ, চালতা — কয়টা খেয়েছেন টিক দিন আর ফল কার্ড শেয়ার করুন।',
  tiers: fractionTiers(rows.length, [
    [0, 'ফল মানে আপেল-আঙুর?', 'দেশি ফল আপনার অপেক্ষায়'],
    [0.1, 'আম-কাঁঠাল বাহিনী', 'চেনা ফলেই সন্তুষ্ট'],
    [0.25, 'দেশি ফলের বন্ধু', 'বাজারে নতুন ফল দেখলেই কেনেন'],
    [0.45, 'গ্রামের গাছ চেনা মানুষ', 'কোন গাছে কী ফল, সব জানা'],
    [0.65, 'লটকন-ডেউয়া বিশেষজ্ঞ', 'দুর্লভ ফলও আপনার চেনা'],
    [0.85, 'চলমান ফল-বিশ্বকোষ', 'উদ্ভিদবিদরাও আপনার কাছে আসে'],
    [1, 'দেশি ফলের কিংবদন্তি', 'বাংলার সব ফল আপনার চেনা!'],
  ]),
  theme: { accent: '#1E6B3A', accentInk: '#ffffff', l1: '#CDE8B5', l2: '#6DBE5C', l3: '#1E6B3A', empty: '#EDE1C8' },
  seo: {
    title: 'দেশি ফলের নাম ও তালিকা: কয়টা খেয়েছেন? | আমি খেয়েছি',
    description:
      'বাংলাদেশের দেশি ফলের তালিকা: আম, কাঁঠাল, লিচু থেকে লটকন, ডেউয়া, কাউ, চালতা, গাব। কোন ফল কোন মৌসুমে, কয়টা খেয়েছেন টিক দিন আর শেয়ার করুন।',
    keywords: ['দেশি ফলের নাম', 'বাংলাদেশের ফলের তালিকা', 'দুর্লভ দেশি ফল', 'native fruits of Bangladesh'],
  },
}
