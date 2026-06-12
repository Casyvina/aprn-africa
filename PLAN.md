# APRN Africa — Build Plan & Status

> Stack: Next.js 16.2.6 · Supabase · Sanity CMS · Tailwind v4 · Claude API · Paystack · Fal.ai (planned)
> Last updated: June 2026
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
| Intelligence Briefing | `/dashboard/intelligence` | ✅ | stats, continue learning, recent intelligence, membership + network sidebar |
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
| Sanity Studio | `/studio` | ✅ | CMS — Tokun manages content here |

**Admin generator roadmap:**
- v2: URL input (Claude reads source article as context)
- v2: Fal.ai / Flux Pro hero image generation
- v2: Inline preview panel before saving to Sanity draft

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
1. ❌ Set Vercel env vars: `ADMIN_EMAILS`, `ANTHROPIC_API_KEY`, Paystack live keys, confirm `SANITY_WRITE_TOKEN`
2. ❌ Invite Tokun to Sanity Studio as Editor

### Next build sessions
3. 🔄 **Training page** — full template: tracks, APConnect modules, certification tiers (`training-development.html`)
4. 🔄 **Event detail** `/events/[slug]` — speakers, agenda, sponsors, registration CTA (`conference.html`)
5. ⏳ **Dashboard Intelligence Briefing** `/dashboard/intelligence` — stats grid, learning feed, network activity (`dashboard-intelligence-breifing.html`)
6. 🔄 **Settings: Notifications tab** — email preference toggles (`account-setting.html`)
7. 🔄 **Admin Generator v2** — URL input, Fal.ai image gen, inline preview before Sanity save
8. 🔄 **Admin Payments page** — Paystack transaction history API
9. ⏳ **Programs & Initiatives** `/programs` (`programs-initiative.html`)
10. ⏳ **Professional Certification** `/certification` (`professional-certification.html`)

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
| Joseph Agwuh | Director, Applied Engineering | josephagwuh@gmail.com | ADMIN_EMAILS |
| Tokunbo Khadijat | Content Manager | tokunbokhadijat@gmail.com | ADMIN_EMAILS, Sanity Editor |
