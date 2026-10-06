import { DISTRICTS, DIVISIONS } from '../data/districts'
import foodData from '../data/food64.json'
import type { IconName } from '../icons/names'
import type { Collection } from './types'

export interface Food {
  bn: string
  en: string
  icon: IconName
  desc: string
  uncertain: boolean
  sources: string[]
}

export const FOODS_BY_DISTRICT = foodData as unknown as Record<string, Food[]>

export const food64: Collection = {
  id: 'food64',
  route: '/',
  kind: 'bd-map',
  name: 'আমি খেয়েছি: ৬৪ জেলা',
  short: '৬৪ জেলার খাবার',
  items: DISTRICTS.map((d) => {
    const foods = FOODS_BY_DISTRICT[d.id] ?? []
    return {
      id: d.id,
      bn: d.bn,
      en: d.en,
      icon: foods[0]?.icon ?? 'rosogolla',
      sub: foods.map((f) => f.bn).join(' · '),
      group: d.division,
      desc: foods[0]?.desc,
    }
  }),
  groups: DIVISIONS.map((x) => ({ id: x.id, bn: `${x.bn} বিভাগ` })),
  levels: ['খেয়েছি', 'জেলায় গিয়ে খেয়েছি', 'ভক্ত'],
  unitLine: 'জেলার বিখ্যাত খাবার খেয়েছি',
  question: 'আপনি কয়টা খেয়েছেন?',
  headline: '৬৪ জেলার বিখ্যাত খাবারের কয়টা খেয়েছেন?',
  intro: 'যে জেলার বিখ্যাত খাবার খেয়েছেন টিক দিন, নিজের ফুড ম্যাপ বানান, তারপর বন্ধুদের চ্যালেঞ্জ করুন!',
  tiers: [
    { min: 0, title: 'ভাত-ডাল বিশেষজ্ঞ', line: 'আম্মুর রান্নাই সেরা, বাকি সব গুজব' },
    { min: 5, title: 'নবিশ খাদক', line: 'যাত্রা শুরু, পেট প্রস্তুত তো?' },
    { min: 13, title: 'পেটুক শিক্ষানবিশ', line: 'দেশের স্বাদ চেনা শুরু হয়েছে' },
    { min: 25, title: 'ভোজনরসিক', line: 'খাবারের নাম শুনলেই চোখ চকচক করে' },
    { min: 37, title: 'খাদ্য পর্যটক', line: 'ঘুরতে যান খাবারের টানেই' },
    { min: 49, title: 'ভোজন-বিশারদ', line: 'বন্ধুরা খাবারের রিভিউ আপনার কাছেই নেয়' },
    { min: 60, title: 'জাতীয় খাদ্য রত্ন', line: 'আর মাত্র কয়েকটা জেলা বাকি!' },
    { min: 64, title: 'খাদ্য-বিশ্বজয়ী', line: 'পুরো বাংলাদেশ আপনার পেটে! কিংবদন্তি' },
  ],
  theme: { accent: '#B3261E', accentInk: '#ffffff', l1: '#F6CF72', l2: '#EB8A2E', l3: '#B3261E', empty: '#EDE1C8' },
  seo: {
    title: '৬৪ জেলার বিখ্যাত খাবার: কয়টা খেয়েছেন? | আমি খেয়েছি',
    description:
      'বাংলাদেশের ৬৪ জেলার বিখ্যাত খাবারের তালিকা। কোন জেলার কোন খাবার বিখ্যাত জানুন, কয়টা খেয়েছেন টিক দিন, নিজের ফুড ম্যাপ বানিয়ে বন্ধুদের সাথে শেয়ার করুন।',
    keywords: ['৬৪ জেলার বিখ্যাত খাবার', 'জেলার বিখ্যাত খাবার', 'বাংলাদেশের বিখ্যাত মিষ্টি', 'famous food of 64 districts Bangladesh'],
  },
}
