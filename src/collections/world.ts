import countryData from '../data/countries.json'
import type { Collection, Item } from './types'

// Hidden from the list, map and cards. The slot stays in the share-link encoding so links made
// before the change still decode correctly (see lib/slots.ts).
const RETIRED = new Set(['IL'])

const slots: Item[] = countryData.countries.map((c) => ({ id: c.id, bn: c.bn, en: c.en, icon: 'globe' as const, group: c.region }))

export const world: Collection = {
  id: 'world',
  route: '/world',
  kind: 'world-map',
  name: 'আমি ঘুরেছি: বিশ্ব',
  short: 'বিশ্ব ভ্রমণ',
  items: slots.filter((s) => !RETIRED.has(s.id)),
  slots,
  groups: countryData.regions,
  levels: ['ট্রানজিট', 'ঘুরেছি', 'থেকেছি'],
  unitLine: 'দেশ ঘুরেছি',
  question: 'আপনি কয়টা দেশ ঘুরেছেন?',
  headline: 'বাংলাদেশের বাইরে কয়টা দেশ ঘুরেছেন?',
  intro: 'ট্রানজিট, বেড়ানো নাকি থাকা — যে দেশে গেছেন টিক দিন। নিজের ট্রাভেল ম্যাপ বানিয়ে বন্ধুদের দেখান!',
  tiers: [
    { min: 0, title: 'দেশপ্রেমিক', line: 'বাংলাদেশেই তো সব আছে!' },
    { min: 1, title: 'পাসপোর্টে প্রথম সিল', line: 'যাত্রা মাত্র শুরু' },
    { min: 3, title: 'ভ্রমণপিয়াসী', line: 'ছুটি মানেই নতুন দেশ' },
    { min: 7, title: 'এয়ারপোর্ট চেনা মানুষ', line: 'ইমিগ্রেশনের লাইন আপনার চেনা' },
    { min: 15, title: 'বিশ্ব পর্যটক', line: 'পাসপোর্ট ভারী হচ্ছে' },
    { min: 30, title: 'পাসপোর্ট ভর্তি সিল', line: 'নতুন পাসপোর্ট লাগবে শীঘ্রই' },
    { min: 60, title: 'জীবন্ত গ্লোব', line: 'আপনাকে খুঁজতে ম্যাপ লাগে' },
    { min: 100, title: 'সেঞ্চুরি ট্রাভেলার', line: '১০০ দেশ! আপনি কিংবদন্তি' },
  ],
  theme: { accent: '#0F5E7A', accentInk: '#ffffff', l1: '#BFE3EA', l2: '#3FA7C0', l3: '#0F5E7A', empty: '#E4DCCB' },
  seo: {
    title: 'কয়টা দেশ ঘুরেছেন? নিজের ট্রাভেল ম্যাপ বানান | আমি ঘুরেছি',
    description:
      'বিশ্বের ১৯৩টি দেশের মধ্যে কয়টা ঘুরেছেন? ট্রানজিট, বেড়ানো বা থাকা — টিক দিয়ে নিজের ওয়ার্ল্ড ট্রাভেল ম্যাপ বানিয়ে ফেসবুকে শেয়ার করুন।',
    keywords: ['কয়টা দেশ ঘুরেছেন', 'travel map maker', 'countries visited map', 'বিশ্ব ভ্রমণ ম্যাপ'],
  },
}
