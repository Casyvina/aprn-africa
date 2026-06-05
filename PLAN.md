# APRN Africa — Build Plan & Status

> Stack: Next.js 16.2.6, Supabase, Sanity, Tailwind v4, Claude API, Paystack
> Updated: June 2026

---

## Legend
- ✅ Done & deployed
- 🔄 Exists but incomplete / needs template upgrade
- ⏳ Not started — template exists in /website-templates/
- ❌ Blocked by env var / external dependency

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
| Event Detail | `/events/[slug]` | 🔄 Static stubs only — needs full template (speakers, agenda, sponsors, register CTA) | `conference.html` |
| Membership | `/membership` | ✅ | `membership.html` |
| Training | `/training` | 🔄 Basic page — needs full template (tracks, APConnect, certification) | `training-development.html` |
| Programs & Initiatives | `/programs` | ⏳ Not built | `programs-initiative.html` |
| Professional Certification | `/certification` | ⏳ Not built | `professional-certification.html` |
| Contact | `/contact` | ✅ | `contacts.html` |
| Newsletter | `/newsletter` | ✅ | — |
| Privacy | `/privacy` | ✅ | `privacy-policy.html` |
| Terms | `/terms` | ✅ | `term-of-use.html` |
| 404 | `not-found.tsx` | ✅ | `404-not-found.html` |

---

## 2. Member Dashboard (requires login)

| Page | Route | Status | Notes |
|---|---|---|---|
| Dashboard Home | `/dashboard` | ✅ | Stats, quick links |
| Research | `/dashboard/research` | ✅ | `dashboard-research.html` |
| Research Detail | `/dashboard/research/[slug]` | ✅ | |
| Intelligence Briefing | `/dashboard/intelligence` | ⏳ Not built | `dashboard-intelligence-breifing.html` — stats overview, learning grid, network activity panel |
| Network | `/dashboard/network` | ✅ | Member cards |
| Network Profile | `/dashboard/network/[id]` | ✅ | Bio, expertise, contributions |
| Courses | `/dashboard/courses` | ✅ | APConnect modules |
| Membership | `/dashboard/membership` | ✅ | Tier benefits + Paystack |
| Saved | `/dashboard/saved` | ✅ | Bookmarked items |
| Settings | `/dashboard/settings` | 🔄 Profile + password done — Notifications tab missing | `account-setting.html` |
| Onboarding | `/onboarding` | ✅ | 3-step wizard |

---

## 3. Admin Panel (admin emails only)

| Page | Route | Status | Notes |
|---|---|---|---|
| Overview | `/admin` | ✅ | Stats strip, tier breakdown, recent signups |
| Members | `/admin/members` | ✅ | Search, filter, pagination, detail drawer, tier change |
| AI Generator | `/admin/generate` | ✅ | Claude drafts editorial/research straight into Sanity |
| Payments | `/admin/payments` | 🔄 Stub — needs Paystack live keys + API wiring | |

**Planned admin upgrades:**
- Generator v2: URL input (Claude reads source article), image upload, inline preview before saving to Sanity
- Add Generate link to admin sidebar nav

---

## 4. Auth Flow

| Feature | Status |
|---|---|
| Register | ✅ |
| Login | ✅ |
| Forgot password | ✅ |
| Onboarding wizard (3-step, upsert, Zod, Zustand) | ✅ |
| "Skip for now" loop fix | ❌ Dashboard layout redirects back to `/onboarding` if `full_name` is null — skip is a dead end |

---

## 5. CMS — Sanity Studio (`/studio`)

| Item | Status |
|---|---|
| Studio live | ✅ |
| Schemas: editorialInsight, researchReport, policyFramework | ✅ |
| Schemas: events, training, courses, person, topic | ✅ |
| AI content generator (Claude API → Sanity draft) | ✅ |
| Tokun invited as Editor | ❌ Must invite via sanity.io/manage → cwohq4ef |
| Sanity plan | Free tier (Growth trial ends ~mid June 2026) — no upgrade needed |

---

## 6. Infrastructure & Integrations

| Item | Status | Action needed |
|---|---|---|
| Supabase schema deployed | ✅ | — |
| RLS policies + profile trigger | ✅ | — |
| Zustand auth store | ✅ | — |
| Zod validation | ✅ | — |
| Paystack (test keys) | ✅ | — |
| Paystack (live keys) | ❌ | Add to Vercel env vars |
| Anthropic API | ❌ | Add `ANTHROPIC_API_KEY` to Vercel |
| Admin access gate | ❌ | Add `ADMIN_EMAILS` to Vercel |
| Zustand hydration on first load | ❌ | Seed store from server profile in dashboard layout |

---

## 7. Priority Order

### Before soft launch (do now)
1. Fix "Skip for now" onboarding loop — dashboard layout should allow null `full_name`
2. Set Vercel env vars: `ADMIN_EMAILS`, `ANTHROPIC_API_KEY`, Paystack live keys
3. Invite Tokun to Sanity — sanity.io/manage → Members → Invite as Editor
4. Fix Zustand hydration — seed store from server on dashboard load

### Next 2 weeks
5. Training page — full template: tracks, APConnect, certification tiers
6. Event detail page `/events/[slug]` — speakers, agenda, sponsors, register CTA
7. Dashboard Intelligence Briefing — `/dashboard/intelligence`
8. Settings: Notifications tab — email preference toggles
9. Admin Generator v2 — URL input + inline preview before saving
10. Admin payments — wire Paystack transaction history

### Later
11. Programs & Initiatives (`/programs`)
12. Professional Certification (`/certification`)
13. Admin sidebar: add Generate Content link

---

## 8. Credentials & Access

| Service | Project/ID |
|---|---|
| Vercel | vercel.com → aprn-africa |
| Supabase | supabase.com → kwjotbqnfbisppblsnpt |
| Sanity | sanity.io/manage → cwohq4ef |
| GitHub | github.com/Casyvina/aprn-africa |
| Domain | aprn-africa.org |

---

## 9. Team

| Person | Role | Email | Access |
|---|---|---|---|
| Lucy Okeke | Founder & Executive Director | info@aprn-africa.org | Vercel, Supabase, ADMIN_EMAILS |
| Joseph Agwuh | Director, Applied Engineering | josephagwuh@gmail.com | ADMIN_EMAILS |
| Tokunbo Khadijat | Content Manager | tokunbokhadijat@gmail.com | ADMIN_EMAILS, Sanity Editor |
