# Launch & viral playbook: আমি খেয়েছি

This is a working plan for launching and growing the app. Captions are in Bangla and ready to paste. Swap `amikheyechi.com` for your real domain.

## 0. Why now

"Unseen Bangladesh", a 64-district visited-map maker, has been trending on Bangladeshi Facebook since about 5 Oct 2026. People are primed for the mechanic: tick districts, get a "X/64" card, share it. We ride that wave with new content (food), plus the things it doesn't have: levels, friend comparison and a district leaderboard. **Launch within days, not weeks.**

## 1. Pre-launch checklist (1 day)

- [ ] Review `docs/DATA-REVIEW.md`. There are 41 uncertain items, 10 of them the signature item of their district. Wrong food claims will be roasted in the comments. Some arguing is good engagement, but obvious errors hurt credibility.
- [ ] Buy a short domain, set `VITE_SITE_URL`, deploy (see README), then run `npm run og` and rebuild.
- [ ] Make a Google Form for "ভুল ধরিয়ে দিন" and set `VITE_FEEDBACK_URL`.
- [ ] Optional: create a PostHog project and set `VITE_POSTHOG_KEY` so you can measure the share loop.
- [ ] Open the site from a Messenger link on a cheap Android phone and confirm that long-press save works in the in-app browser.
- [ ] Paste the URL into the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and check that the OG image shows.
- [ ] Make your own card with an **honest, low-ish score**. It's the first post.

## 2. Launch day: the founder post

Post around **8–11 PM Bangladesh time**, when Facebook usage peaks. Fridays are good. Attach your own card image, not just the link: image posts get more reach than link posts, and the URL is printed on the card.

> ৬৪ জেলার বিখ্যাত খাবারের মধ্যে আমি মাত্র ১৯টা খেয়েছি 😅
> বগুড়ার দই, টাঙ্গাইলের চমচম পার করলেও নেত্রকোনার বালিশ মিষ্টি এখনো খাওয়া হয়নি!
> আপনি কয়টা খেয়েছেন? নিজের ফুড ম্যাপ বানিয়ে কমেন্টে দিন 👇
> 🔗 amikheyechi.com

Put the link in the **first comment** as well. Some pages see better reach when the link isn't in the post body.

Why a low score: it invites people to beat it ("মাত্র ১৯? আমি ৩৪!"). A high score just looks like bragging.

## 3. Content that keeps it spreading

| Format | Example caption | Why it works |
|---|---|---|
| **District-pride bait** | "আপনার জেলার বিখ্যাত খাবার কি ঠিক লিখেছি? ভুল হলে কমেন্টে জানান 👇" | Corrections drive comments, which drive Facebook reach, and they improve your data too. |
| **Rivalry** | "রসমালাই নাকি চমচম? কুমিল্লা বনাম টাঙ্গাইল ⚔️ কমেন্টে ভোট দিন" | District identity is strong in Bangladesh, so people pick a side. |
| **Knockout bracket** | "বাংলাদেশের সেরা মিষ্টি বিশ্বকাপ 🏆 রাউন্ড ১: বগুড়ার দই vs নাটোরের কাঁচাগোল্লা" | A week of daily posts gives people a reason to come back. |
| **Weekly leaderboard** | "এই সপ্তাহে সবচেয়ে ভোজনরসিক জেলা: #১ চট্টগ্রাম, #২ সিলেট… আপনার জেলা কত নম্বরে?" | Tag the district Facebook pages and local news pages so they reshare it. |
| **Challenge** | "৩ জন বন্ধুকে ট্যাগ করুন, যারা দাবি করে সব খেয়েছে 😏" | The compare link in the app turns each tag into a new player. |
| **Nostalgia (fruit)** | "লটকন, ডেউয়া, কাউ… শেষ কবে খেয়েছেন? 🥹" | Strong with probashi users and 30+ audiences. |
| **Seasonal (pitha)** | "শীত এসে গেছে! কয় রকম পিঠা খেয়েছেন? ভাপা-চিতই বাহিনী নাকি পিঠা কিংবদন্তি?" | It's timely, and the tier titles give people something to joke about. |
| **Travel (world)** | "পাসপোর্টে কয়টা সিল? 🌍 ঈদের ছুটির আগে নিজের ট্রাভেল ম্যাপ বানান" | Probashi users and Gulf workers are big here. Post in their groups. |

**Reels/TikTok (15 sec):** a screen recording of the map filling up as you tick. Ideas:
- "POV: বগুড়ার বন্ধু জানলো আপনি দই খাননি"
- "Rating my friends' food maps" (react to followers' cards)
- Speed-ticking all 64 districts, with the final card reveal

## 4. Seeding: who to send it to

- **Food vloggers and food-review pages** with 100k–1M followers. Mid-tier creators convert better than the biggest names. Send them a pre-made card with *their* likely score and a one-line pitch: "আপনার ফলোয়ারদের সাথে স্কোর তুলনা করুন".
- **Large Facebook food groups** (search "food review Bangladesh" and "ভোজনরসিক"), plus Travelers of Bangladesh (ToB) and district-based community groups. Read each group's rules first; many ban links, so post the card image and put the link in a comment.
- **Meme pages:** offer score-based meme templates, for example "৬৪ জেলার খাবার: ৩/৬৪ — ভাত-ডাল বিশেষজ্ঞ 💀".
- **Probashi groups** (Middle East, Malaysia, Europe): "দেশের কোন খাবার সবচেয়ে মিস করেন?" + the fruit/pitha links.
- **Mishti shops and food brands** (Bogura doi, Porabari chomchom and similar). Send them a card that features their item. Their pages share it for free.

## 5. Press

Lifestyle and tech desks, plus trend portals, cover viral "Facebook trend" tools; that's how Unseen Bangladesh got covered. Send a 5-line press note:

> ৬৪ জেলার বিখ্যাত খাবার কয়টা খেয়েছেন? নতুন ওয়েবসাইট "আমি খেয়েছি"-তে টিক দিয়ে নিজের ফুড ম্যাপ বানিয়ে ফেসবুকে শেয়ার করছেন হাজারো মানুষ। আছে পিঠা, দেশি ফল আর বিশ্ব ভ্রমণের ম্যাপও, এবং জেলাভিত্তিক লিডারবোর্ড: কোন জেলার মানুষ সবচেয়ে ভোজনরসিক। ছবি বা তথ্য কোথাও আপলোড হয় না, সব থাকে ব্যবহারকারীর ফোনে।

Attach 3 card images and the OG image. Coverage brings backlinks, which is the best SEO you can get.

## 6. Seasonal relaunch calendar

Each collection is a new launch moment that costs almost nothing to build. Dates are approximate.

| When | Push | Hook |
|---|---|---|
| Now (Oct) | ৬৪ জেলার খাবার | Ride the district-map trend |
| Nov–Feb | পিঠা | Winter and pitha festivals; post in the first cold week |
| 16 Dec | ৬৪ জেলা | "৬৪ জেলা, এক বাংলাদেশ 🇧🇩" (Victory Day) |
| Feb | (books idea, future) | Ekushey Boimela |
| ~Mar 2027 (Eid ul-Fitr) | বিশ্ব ভ্রমণ | Eid holiday travel; Gulf probashi coming home |
| May–Jul | দেশি ফল | Jaishtha–Asharh mango and litchi season |
| ~May 2027 (Eid ul-Adha) | বিশ্ব ভ্রমণ + ৬৪ জেলা | Holiday travel |

## 7. SEO

What's built in: every route is prerendered with real content. There are 64 district pages that answer "<জেলা>র বিখ্যাত খাবার কী?", plus JSON-LD (ItemList, FAQPage, BreadcrumbList), `sitemap.xml` and `robots.txt`.

After deploying:
1. Add the domain to **Google Search Console** and **Bing Webmaster Tools**, submit `/sitemap.xml`, and request indexing for `/`, `/pitha/` and `/fol/`.
2. Target queries:
   - Head terms: "৬৪ জেলার বিখ্যাত খাবার", "জেলার বিখ্যাত খাবার", "পিঠার নাম", "শীতের পিঠার নাম", "দেশি ফলের নাম".
   - Long tail: "<জেলা>র বিখ্যাত খাবার কি". Students search these for quizzes and assignments, and searches stay steady all year.
   - I have no keyword-volume data. Ahrefs and Semrush weren't connected, so check volumes yourself before investing in more pages.
3. **Internal links:** every district page links to its neighbours and back to the main map.
4. **Backlinks:** press coverage (section 5) and district Facebook pages linking to their own district page ("আমাদের জেলার খাবার").
5. **Freshness:** add one or two lines and a photo credit per district over time. Thin pages rank worse than pages with real text.
6. **Future pages:** "বাংলাদেশের বিখ্যাত মিষ্টি" (all mishti across districts), and a separate page for each pitha and fruit.

## 8. Measure the loop

With PostHog set up, watch these events:
- `started` → `first_tick` → `card_generated` → `card_shared` / `link_copied` → (friend) `compare_opened` → `compare_completed`
- **Viral coefficient ≈ compare_opened ÷ players.** Above 0.3 means sharing pulls in a meaningful share of new players; above 1 means it's spreading on its own.
- `in_app` on events: the share of traffic from the Facebook/Messenger browser. If it's high and `card_shared` is low, the long-press save hint needs to be more prominent.

## 9. Monetization, later (don't do it at launch)

- **"কোথায় পাবেন" listings** on district pages, paid by sweet shops and food brands.
- **Sponsored seasonal collections:** for example a pitha festival sponsor, or a telco sponsoring the world travel map.
- Avoid ads at launch: they slow the page on cheap phones and kill the share loop.
