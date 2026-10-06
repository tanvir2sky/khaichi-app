// Canonical list of Bangladesh's 64 districts.
// ORDER IS FROZEN: share links encode one 2-bit level per district in this order.
// Append-only — never reorder or remove (tests/data.test.ts snapshots the ids).

export interface Division {
  id: string
  bn: string
  en: string
}

export interface District {
  id: string
  bn: string
  en: string
  division: string
}

export const DIVISIONS: Division[] = [
  { id: 'dhaka', bn: 'ঢাকা', en: 'Dhaka' },
  { id: 'chattogram', bn: 'চট্টগ্রাম', en: 'Chattogram' },
  { id: 'rajshahi', bn: 'রাজশাহী', en: 'Rajshahi' },
  { id: 'khulna', bn: 'খুলনা', en: 'Khulna' },
  { id: 'barishal', bn: 'বরিশাল', en: 'Barishal' },
  { id: 'sylhet', bn: 'সিলেট', en: 'Sylhet' },
  { id: 'rangpur', bn: 'রংপুর', en: 'Rangpur' },
  { id: 'mymensingh', bn: 'ময়মনসিংহ', en: 'Mymensingh' },
]

const d = (id: string, bn: string, en: string, division: string): District => ({ id, bn, en, division })

export const DISTRICTS: District[] = [
  d('dhaka', 'ঢাকা', 'Dhaka', 'dhaka'),
  d('faridpur', 'ফরিদপুর', 'Faridpur', 'dhaka'),
  d('gazipur', 'গাজীপুর', 'Gazipur', 'dhaka'),
  d('gopalganj', 'গোপালগঞ্জ', 'Gopalganj', 'dhaka'),
  d('kishoreganj', 'কিশোরগঞ্জ', 'Kishoreganj', 'dhaka'),
  d('madaripur', 'মাদারীপুর', 'Madaripur', 'dhaka'),
  d('manikganj', 'মানিকগঞ্জ', 'Manikganj', 'dhaka'),
  d('munshiganj', 'মুন্সীগঞ্জ', 'Munshiganj', 'dhaka'),
  d('narayanganj', 'নারায়ণগঞ্জ', 'Narayanganj', 'dhaka'),
  d('narsingdi', 'নরসিংদী', 'Narsingdi', 'dhaka'),
  d('rajbari', 'রাজবাড়ী', 'Rajbari', 'dhaka'),
  d('shariatpur', 'শরীয়তপুর', 'Shariatpur', 'dhaka'),
  d('tangail', 'টাঙ্গাইল', 'Tangail', 'dhaka'),

  d('bandarban', 'বান্দরবান', 'Bandarban', 'chattogram'),
  d('brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Brahmanbaria', 'chattogram'),
  d('chandpur', 'চাঁদপুর', 'Chandpur', 'chattogram'),
  d('chattogram', 'চট্টগ্রাম', 'Chattogram', 'chattogram'),
  d('cumilla', 'কুমিল্লা', 'Cumilla', 'chattogram'),
  d('coxsbazar', 'কক্সবাজার', "Cox's Bazar", 'chattogram'),
  d('feni', 'ফেনী', 'Feni', 'chattogram'),
  d('khagrachhari', 'খাগড়াছড়ি', 'Khagrachhari', 'chattogram'),
  d('lakshmipur', 'লক্ষ্মীপুর', 'Lakshmipur', 'chattogram'),
  d('noakhali', 'নোয়াখালী', 'Noakhali', 'chattogram'),
  d('rangamati', 'রাঙ্গামাটি', 'Rangamati', 'chattogram'),

  d('bogura', 'বগুড়া', 'Bogura', 'rajshahi'),
  d('chapainawabganj', 'চাঁপাইনবাবগঞ্জ', 'Chapainawabganj', 'rajshahi'),
  d('joypurhat', 'জয়পুরহাট', 'Joypurhat', 'rajshahi'),
  d('naogaon', 'নওগাঁ', 'Naogaon', 'rajshahi'),
  d('natore', 'নাটোর', 'Natore', 'rajshahi'),
  d('pabna', 'পাবনা', 'Pabna', 'rajshahi'),
  d('rajshahi', 'রাজশাহী', 'Rajshahi', 'rajshahi'),
  d('sirajganj', 'সিরাজগঞ্জ', 'Sirajganj', 'rajshahi'),

  d('bagerhat', 'বাগেরহাট', 'Bagerhat', 'khulna'),
  d('chuadanga', 'চুয়াডাঙ্গা', 'Chuadanga', 'khulna'),
  d('jashore', 'যশোর', 'Jashore', 'khulna'),
  d('jhenaidah', 'ঝিনাইদহ', 'Jhenaidah', 'khulna'),
  d('khulna', 'খুলনা', 'Khulna', 'khulna'),
  d('kushtia', 'কুষ্টিয়া', 'Kushtia', 'khulna'),
  d('magura', 'মাগুরা', 'Magura', 'khulna'),
  d('meherpur', 'মেহেরপুর', 'Meherpur', 'khulna'),
  d('narail', 'নড়াইল', 'Narail', 'khulna'),
  d('satkhira', 'সাতক্ষীরা', 'Satkhira', 'khulna'),

  d('barguna', 'বরগুনা', 'Barguna', 'barishal'),
  d('barishal', 'বরিশাল', 'Barishal', 'barishal'),
  d('bhola', 'ভোলা', 'Bhola', 'barishal'),
  d('jhalokathi', 'ঝালকাঠি', 'Jhalokathi', 'barishal'),
  d('patuakhali', 'পটুয়াখালী', 'Patuakhali', 'barishal'),
  d('pirojpur', 'পিরোজপুর', 'Pirojpur', 'barishal'),

  d('habiganj', 'হবিগঞ্জ', 'Habiganj', 'sylhet'),
  d('moulvibazar', 'মৌলভীবাজার', 'Moulvibazar', 'sylhet'),
  d('sunamganj', 'সুনামগঞ্জ', 'Sunamganj', 'sylhet'),
  d('sylhet', 'সিলেট', 'Sylhet', 'sylhet'),

  d('dinajpur', 'দিনাজপুর', 'Dinajpur', 'rangpur'),
  d('gaibandha', 'গাইবান্ধা', 'Gaibandha', 'rangpur'),
  d('kurigram', 'কুড়িগ্রাম', 'Kurigram', 'rangpur'),
  d('lalmonirhat', 'লালমনিরহাট', 'Lalmonirhat', 'rangpur'),
  d('nilphamari', 'নীলফামারী', 'Nilphamari', 'rangpur'),
  d('panchagarh', 'পঞ্চগড়', 'Panchagarh', 'rangpur'),
  d('rangpur', 'রংপুর', 'Rangpur', 'rangpur'),
  d('thakurgaon', 'ঠাকুরগাঁও', 'Thakurgaon', 'rangpur'),

  d('jamalpur', 'জামালপুর', 'Jamalpur', 'mymensingh'),
  d('mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'mymensingh'),
  d('netrokona', 'নেত্রকোনা', 'Netrokona', 'mymensingh'),
  d('sherpur', 'শেরপুর', 'Sherpur', 'mymensingh'),
]

export const DISTRICT_BY_ID: Record<string, District> = Object.fromEntries(DISTRICTS.map((x) => [x.id, x]))
export const DIVISION_BY_ID: Record<string, Division> = Object.fromEntries(DIVISIONS.map((x) => [x.id, x]))
