# APRN Africa — Build Plan & Status

> Stack: Next.js 16.2.6 · Supabase · Sanity CMS · Tailwind v4 · Claude API · Paystack · Fal.ai (planned)
> Last updated: June 2026 — Session 6
> Visual sitemap (with data flow + team roles): /admin/sitemap

---

## Legend
- ✅ Done & live on Vercel
- 🔄 Exists but needs upgrade (template in /website-templates/)
- ⏳ Not built yet (template exists)
- ❌ Needs manual action (env var / external invite / config)

---

## 1. Public Marketing Site

| Page | Route | Status | Template |
|---|---|---|---|
| Homepage | `/` | ✅ | `homepage.html` |
| About | `/about` | ✅ | `about-aprn.html` |
| Leadership | `/leadership` | ✅ | `leadership.html` |
| Partnerships | `/partnerships` | ✅ | `partnership.html` |
| Research Hub | `/research` | ✅ | `research-intelligence.html` |
| Research Detail | `/research/[slug]` | ✅ | `strategic-report.html` |
| Insights | `/insights` | ✅ | `intelligence-briefing.html` |
| Insight Detail | `/insights/[slug]` | ✅ | `infrastructure-intelligence-briefing.html` |
| Events Listing | `/events` | ✅ | `conference.html` |
| Event Detail | `/events/[slug]` | 🔄 Static stubs only — needs speakers, agenda, sponsors, register CTA | `conference.html` |
| Membership | `/membership` | ✅ | `membership.html` |
| Training | `/training` | ✅ | `training-development.html` |
| Programs & Initiatives | `/programs` | ⏳ | `programs-initiative.html` |
| Professional Certification | `/certification` | ⏳ | `professional-certification.html` |
| Contact | `/contact` | ✅ | `contacts.html` |
| Newsletter | `/newsletter` | ✅ | — |
| Privacy | `/privacy` | ✅ | `privacy-policy.html` |
| Terms | `/terms` | ✅ | `term-of-use.html` |
| 404 | `not-found.tsx` | ✅ | `404-not-found.html` |

---

## 2. Member Dashboard (login required)

| Page | Route | Status | Notes |
|---|---|---|---|
| Dashboard Home | `/dashboard` | ✅ | Stats, quick links, Zustand hydrated from server |
| Research Feed | `/dashboard/research` | ✅ | Sanity content |
| Research Detail | `/dashboard/research/[slug]` | ✅ | |
| Intelligence Briefing | `/dashboard/intelligence` | ✅ | Stats, continue learning, recent Sanity intelligence, membership + network sidebar |
| Network | `/dashboard/network` | ✅ | Member cards |
| Network Profile | `/dashboard/network/[id]` | ✅ | Bio, expertise, contributions |
| Courses (APConnect) | `/dashboard/courses` | ✅ | |
| My Membership | `/dashboard/membership` | ✅ | Tier benefits + Paystack upgrade |
| Saved Items | `/dashboard/saved` | ✅ | |
| Settings | `/dashboard/settings` | 🔄 | Profile + password done — Notifications tab missing (`account-setting.html`) |
| Onboarding Wizard | `/onboarding` | ✅ | 3-step, upsert, Zod validation, Zustand sync |

---

## 3. Admin Panel (ADMIN_EMAILS only)

| Page | Route | Status | Notes |
|---|---|---|---|
| Overview | `/admin` | ✅ | Coloured stat cards, tier breakdown, recent signups |
| Members | `/admin/members` | ✅ | Search, filter, pagination, detail drawer, inline tier change |
| AI Generator | `/admin/generate` | ✅ | Claude → Sanity draft (editorial or research report) |
| Payments | `/admin/payments` | 🔄 | Stub — needs Paystack live keys + transaction history API |
| Site Map | `/admin/sitemap` | ✅ | All routes, data flow, team roles |
| Sanity Studio | `/studio` | ✅ | CMS — Tokun + Allison manage content here |
| **Strategy Portal** | | | |
| Comms Strategy | `/admin/strategy/communication` | ✅ | Stakeholder tables, channel grid, approval flow, AI regen |
| Stakeholder Map | `/admin/strategy/stakeholders` | ✅ | SVG matrix, filter tabs, table, AI engagement brief drawer |
| Document Library | `/admin/strategy/documents` | ✅ | Grid/list toggle, Supabase Storage, AI edit + preview + save |
| Content Studio | `/admin/content-studio` | ⏳ | Fal.ai Flux Pro image gen — see Section 10 |

---

## 4. Auth

| Feature | Status | Notes |
|---|---|---|
| Register | ✅ | → /onboarding after email verify |
| Login | ✅ | |
| Forgot / Reset password | ✅ | |
| Onboarding wizard | ✅ | upsert, Zod, Zustand sync |
| "Skip for now" | ✅ | router.replace("/dashboard") — no loop |
| Auth callback smart redirect | ✅ | New user → /onboarding · Returning user (has full_name) → /dashboard |

---

## 5. CMS — Sanity Studio

| Item | Status |
|---|---|
| Studio live at `/studio` | ✅ |
| Schemas: editorialInsight, researchReport, policyFramework | ✅ |
| Schemas: events, training, courses, person, topic | ✅ |
| AI generator (Claude API → Sanity draft) | ✅ |
| Tokun (tokunbokhadijat@gmail.com) invited as Editor | ❌ Manual: sanity.io/manage → cwohq4ef → Members |
| Sanity plan | Free tier — Growth trial ends ~mid June 2026, no upgrade needed |

---

## 6. Infrastructure & Integrations

| Item | Status | Action |
|---|---|---|
| Supabase schema + RLS + triggers | ✅ | — |
| Zustand auth store (all profile fields) | ✅ | — |
| Zustand hydration on dashboard load | ✅ | DashboardHydrator seeds from server profile |
| Zod validation (onboarding, password, settings) | ✅ | — |
| Paystack test keys | ✅ | — |
| Paystack live keys | ❌ | Add `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` + `PAYSTACK_SECRET_KEY` to Vercel |
| ANTHROPIC_API_KEY | ❌ | Add to Vercel env vars |
| ADMIN_EMAILS | ❌ | Add `info@aprn-africa.org,josephagwuh@gmail.com,tokunbokhadijat@gmail.com` to Vercel |
| SANITY_WRITE_TOKEN | ❌ | Confirm present on Vercel (exists in .env.local) |
| Fal.ai image generation | ⏳ | Add `FAL_KEY` to Vercel when ready |

---

## 7. Remaining Work — Priority Order

### Immediate (manual — not code)
1. ❌ Set Vercel env vars: `ADMIN_EMAILS`, `ANTHROPIC_API_KEY`, `FAL_KEY`, Paystack live keys, confirm `SANITY_WRITE_TOKEN`
2. ❌ Invite Tokun + Allison Gabriel to Sanity Studio as Editor (sanity.io/manage → cwohq4ef)
3. ❌ Run "Sync to Cloud" on Document Library page once (migrates files to Supabase Storage)

### Strategy Portal — current sprint (see Section 10 for full detail)
4. ⏳ **Content Studio** `/admin/content-studio` — Fal.ai image gen for social, newsletter, events, reports
5. ⏳ **Comms Strategy: editable channels** — inline edit channel cards + WhatsApp group details
6. ⏳ **Comms Strategy: editable calendar** — add/edit/remove items, assign owners
7. ⏳ **Stakeholder Map: last contact + notes** — date picker + free-text per stakeholder
8. ⏳ **Document Library: Personnel section** — move HR/legal docs out of Strategy

### Public site
9. 🔄 **Event detail** `/events/[slug]` — speakers, agenda, sponsors, registration CTA (`conference.html`)
10. ⏳ **Programs & Initiatives** `/programs` (`programs-initiative.html`)
11. ⏳ **Professional Certification** `/certification` (`professional-certification.html`)

### Dashboard & Settings
12. 🔄 **Settings: Notifications tab** — email preference toggles (`account-setting.html`)

### Admin
13. 🔄 **Admin Generator v2** — URL input, Fal.ai hero image, inline preview before Sanity save
14. 🔄 **Admin Payments page** — Paystack transaction history API

---

## 10. Strategy Portal Roadmap

### 10a. Document Library
| Task | Status | Notes |
|---|---|---|
| Grid/list toggle | ✅ | Done |
| Supabase Storage + signed URLs | ✅ | `aprn-documents` bucket, admin client |
| AI edit → iframe preview → save | ✅ | HTML files only; streams corrected HTML |
| Migrate existing files to cloud | ❌ Manual | Click "Sync to Cloud" button once |
| Move HR/legal docs to Personnel section | ⏳ | Employment letters, ambassador letter out of strategy |
| Personnel & Legal subsection `/admin/strategy/personnel` | ⏳ | Separate page for HR docs (employment, contracts, letters) |
| Active / Archived status toggle per doc | ⏳ | Filter out archived docs from default view |

### 10b. Communication Strategy — Make it editable
| Task | Status | Notes |
|---|---|---|
| Static strategy page | ✅ | Done |
| AI regenerate | ✅ | Done |
| **Editable channel cards** | ⏳ | Inline edit: name, audience, frequency, owner, notes — saved to Supabase `strategy_channels` table |
| **WhatsApp group detail** | ⏳ | Per-channel sub-section: group name, member count, who manages, last broadcast |
| **Editable communication calendar** | ⏳ | Add/edit/remove weekly items, assign owner per item |
| **Editable approval flow** | ⏳ | Change step owners without code — saved to Supabase |
| AI draft calendar item | ⏳ | Click "Draft" on any calendar item → Claude writes the copy |
| AI draft WhatsApp broadcast | ⏳ | Click "Draft Message" on any WhatsApp group → Claude writes it |

### 10c. Stakeholder Map — Make it live
| Task | Status | Notes |
|---|---|---|
| SVG matrix + filter + table + AI brief | ✅ | Done |
| **Last contact date picker** | ⏳ | Editable per row, persisted to Supabase `strategy_stakeholders` table |
| **Notes / engagement history** | ⏳ | Free-text per stakeholder, shown in AI brief context |
| **Add new stakeholder** | ⏳ | Form to add to the list and matrix |
| **Edit stakeholder details** | ⏳ | Edit name, org, influence/interest, strategy |

### 10d. Content Studio — Fal.ai Image Generation (NEW)
> Primary users: Tokunbo Khadijat, Allison Gabriel
> Route: `/admin/content-studio`

| Task | Status | Notes |
|---|---|---|
| New page + sidebar nav entry | ⏳ | Under "Content" section in admin layout |
| Fal.ai Flux Pro integration | ⏳ | `@fal-ai/client`, `FAL_KEY` env var (already in `.env.local`) |
| Format presets | ⏳ | LinkedIn post (1200×627), Newsletter header (600×200), Event banner (1920×1080), Research cover (800×1000), Social square (1080×1080) |
| Brand prompt injection | ⏳ | Auto-prepend APRN brand context (navy/gold palette, professional pipeline sector) |
| Generate → preview → download | ⏳ | Show image, allow download |
| Save to Supabase Storage | ⏳ | Optional save to `aprn-content-assets` bucket |
| Prompt history | ⏳ | Last 10 generations stored in session |

### 10e. Admin Generator v2
| Task | Status | Notes |
|---|---|---|
| URL input → Claude reads source article | ⏳ | Fetch + pass as context |
| Fal.ai hero image alongside content | ⏳ | Generate cover image as part of content creation flow |
| Inline preview before Sanity save | ⏳ | Review content + image before publishing draft |

---

## 8. Credentials

| Service | ID / URL |
|---|---|
| Vercel | vercel.com → aprn-africa |
| Supabase | kwjotbqnfbisppblsnpt |
| Sanity | cwohq4ef (dataset: production) |
| GitHub | github.com/Casyvina/aprn-africa |
| Domain | aprn-africa.org |

---

## 9. Team

| Person | Role | Email | Access |
|---|---|---|---|
| Lucy Okeke | Founder & Executive Director | info@aprn-africa.org | Vercel, Supabase, ADMIN_EMAILS |
| Joseph Agwuh | Director, Applied Engineering | josephagwuh@gmail.com | ADMIN_EMAILS, platform builder |
| Tokunbo Khadijat | Content Manager | tokunbokhadijat@gmail.com | ADMIN_EMAILS, Sanity Editor ❌ invite pending |
| Allison Gabriel | Youth Ambassador & Content | gabriellallison69@gmail.com | ADMIN_EMAILS, Sanity Editor ❌ invite pending |
