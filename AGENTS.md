# APRN Africa — Agent Rules & Architecture Guide

> Read this entire file before writing a single line of code.
> Every rule here exists because a previous decision was made deliberately — don't undo it.

---

## 1. Project Identity

**APRN Africa** is a membership platform for African pipeline research and engineering professionals.
Three audiences: **public visitors**, **members (dashboard)**, **admins (admin panel)**.

- Founder: Lucy Okeke — `info@aprn-africa.org` / `olaghri@gmail.com`
- Director Engineering: Joseph Agwuh — `josephagwuh@gmail.com`
- Content Manager: Tokunbo Khadijat — `tokunbokhadijat@gmail.com`
- Strategic partner: EITEP

---

## 2. Tech Stack (exact versions — do not upgrade without instruction)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.6 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS v4 | 4.3.0 |
| React | React | 19.2.4 |
| Package manager | pnpm | — |
| CMS | Sanity Studio | v3 |
| Database / Auth | Supabase | — |
| Payments | Paystack | — |
| Email | Resend | — |
| AI | Anthropic SDK (`@anthropic-ai/sdk`) | — |
| Image gen | Fal.ai | — |
| Auth state | Zustand v5 | — |
| Validation | Zod | — |
| Import alias | `@/*` | — |

**Key commands:** `pnpm dev` · `pnpm build` · `pnpm lint`

---

## 3. The Golden Rule: Sanity vs Supabase

This is the most important architectural decision. Never confuse the two.

### Sanity = Content (what you publish)
Store in Sanity when it is:
- Public-facing editorial content
- Written/managed by non-engineers (Lucy, Tokunbo)
- Rich text, images, or structured editorial data
- Versioned and needs a CMS workflow

**What lives in Sanity:** research reports, editorial insights, events, training programmes, leadership bios, partner organisations, newsletter issues, newsletter subscribers, homepage config, site settings.

**Newsletter subscribers are in Sanity** — not Supabase. Sanity Studio is the single source of truth for the mailing list. Resend handles transactional send only.

### Supabase = User data (what users do)
Store in Supabase when it is:
- User-generated or user-specific
- Tied to an authenticated session
- Financial or operational record

**What lives in Supabase:** profiles, membership tiers, payments, event registrations, saved items, notification preferences, strategy portal data, document metadata.

### Never mix them
- Do NOT store membership tier history in Sanity
- Do NOT store editorial content in Supabase tables
- Do NOT query Supabase in Sanity schemas or vice versa

---

## 4. Sanity Usage Rules

### Clients
| Client | File | Use for |
|---|---|---|
| Read client | `lib/sanity/client.ts` | All public fetches (CDN in prod) |
| Write client | `lib/sanity/write-client.ts` | AI generator, admin writes only |

- `useCdn: true` in production — queries hit Sanity's CDN. Updates take 2–5 min to propagate.
- Always use `sanityFetch()` from `lib/sanity/fetch.ts` — it handles Next.js cache tagging automatically.
- **Fast tags (60s TTL):** `events`, `event`, `newsletter`, `intelligence`, `insights`, `training`, `leadership`, `partnerships`
- **Slow tags (1hr TTL):** everything else (research, site config, etc.)
- Add new fast tags to `FAST_TAGS` in `lib/sanity/fetch.ts` when content changes frequently.
- The write client uses `SANITY_WRITE_TOKEN` — only import it in server-side routes, never client components.

### Sanity Project
- Project ID: `cwohq4ef`
- Dataset: `production`
- Studio route: `/studio` (embedded Next.js Studio)

### Schemas
Registered in `sanity/schemaTypes.ts`. Key types:
- Singletons: `siteSettings`, `homepageConfig`
- Content: `event`, `researchReport`, `editorialInsight`, `intelligenceUpdate`, `newsletter`, `trainingProgram`, `publication`, `policyFramework`
- People/Orgs: `person`, `organizationPartner`
- Infrastructure: `pipelineCorridor`, `infrastructureProject`
- Reference: `country`, `topic`, `subscriber`

When adding a new schema, register it in `sanity/schemaTypes.ts` and create the file under `sanity/schemas/`.

---

## 5. Supabase Usage Rules

### Clients — CRITICAL: use the right one
| Client | File | Use when |
|---|---|---|
| Server client | `lib/supabase/server.ts` | Server components, API routes for user-scoped data |
| Admin client | `lib/supabase/admin.ts` | Server routes that need to bypass RLS (webhooks, tier upgrades, admin operations) |

**NEVER import `createAdminClient` in a client component or page.** The service role key would be exposed.
**NEVER use the server client to write payments** — only the admin client can do that (RLS blocks authenticated writes to `payments`).

### Tables
| Table | Description |
|---|---|
| `profiles` | One row per user. `membership_tier`, `is_admin`, `last_seen_at`, `topics[]`, `full_name`, `discipline`, `organisation`, `country`, `linkedin_url`, `bio`, `avatar_url` |
| `payments` | Paystack transaction records. `paystack_ref`, `amount_ngn`, `status`, `payment_type`, `related_id`, `metadata`, `paid_at`. Written by service role only. |
| `event_registrations` | Who registered for which event. Links to Sanity event by `event_id` (Sanity `_id`). |
| `saved_items` | Bookmarked research/insights per user. `item_type`, `item_id` (Sanity doc ID). |
| `notification_preferences` | One row per user, booleans for each notification category. |
| `strategy_channels` | Admin strategy portal — communication channels config. |
| `strategy_stakeholders` | Stakeholder matrix data. |
| `strategy_documents_meta` | Metadata for documents in `aprn-documents` storage bucket. `doc_id` = filename (PK). |

### RLS
- All tables have RLS enabled.
- Members can read/write their own rows only (`auth.uid() = user_id`).
- Admin rows checked via `is_admin = true` on `profiles` (not a Supabase role).
- The admin gate in API routes uses `ADMIN_EMAILS` env var — check it before any sensitive operation.

### Types
- Generated types in `types/database.ts` — always use these.
- Regenerate after migrations: `supabase gen types typescript --linked --schema public > types/database.ts`
- Both clients are typed: `createServerClient<Database>()` and `createClient<Database>()`

### Migrations
- Location: `supabase/migrations/`
- Filename format: `YYYYMMDDHHmmss_description.sql` — do NOT deviate
- Push: `supabase db push` (prompts Y/n — confirm before running)
- Always regenerate types after a migration

### Storage
- One bucket: `aprn-documents` (private)
- Holds: strategy documents, admin-uploaded files, content studio graphics
- Access: signed URLs (1hr expiry) generated server-side
- Downloads go through `/api/admin/documents/download` proxy — never expose raw signed URLs to client for downloads (forces `Content-Disposition: attachment`)
- HTML preview goes through `/api/admin/documents/view` proxy (sets `Content-Type: text/html`)
- Text extraction (PPTX/DOCX/XLSX) goes through `/api/admin/documents/text` (uses fflate ZIP parse)

---

## 6. Auth Flow — Do Not Break This

```
/register → Supabase signup → verify email →
/auth/callback →
  has full_name in profiles? → /dashboard
  no full_name?             → /onboarding
```

- `/onboarding` is a 3-step wizard. Step 1 (full_name) is required; steps 2–3 optional.
- "Skip for now" → `router.replace("/dashboard")` — no redirect back to onboarding.
- Dashboard layout (`app/dashboard/layout.tsx`) does NOT redirect to `/onboarding`. Onboarding is optional.
- After response is sent, `after()` from `next/server` updates `last_seen_at` — this is intentional and non-blocking.
- `DashboardHydrator` (client component, in dashboard layout) seeds Zustand from server-fetched profile on every dashboard page load.
- `AuthProvider` (root layout) listens to Supabase auth state changes and keeps Zustand in sync on the client.

### Admin Gate
```typescript
function isAdmin(email: string | undefined): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map(e => e.trim().toLowerCase())
  return allowed.includes(email?.toLowerCase() ?? "")
}
```
This pattern is used in every `/api/admin/*` route. Copy it exactly — do not invent alternatives.

---

## 7. Payment Flow — Do Not Modify Without Testing

```
/dashboard/membership →
  PaystackButton (client, NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) →
  Paystack modal →
  callback: /dashboard/membership?reference=XXX →
  POST /api/paystack/verify { reference, tier } →
    verifies with Paystack API
    checks amount matches tier price
    admin client: inserts into payments, updates profiles.membership_tier
```

- Tier prices are defined in `/api/paystack/verify` in kobo (₦10k, ₦25k, ₦50k, ₦35k, ₦500k).
- Only the server route writes to `payments` — never the client.
- Test mode allows amount mismatch (warn only). Live mode rejects.

---

## 8. AI Integration Rules

### Models
| Use case | Model | Max tokens |
|---|---|---|
| Document AI edit | `claude-opus-4-6` | 32,000 |
| Content generator (Sanity drafts) | `claude-opus-4-6` | 8,192 |
| Document summariser | `claude-sonnet-4-6` | 1,024 |
| Strategy AI (comms, briefs) | `claude-sonnet-4-6` | 1,024 |

- Always stream responses for AI edit and content generation — long outputs will timeout without streaming.
- AI edit route returns **raw HTML only** — the system prompt must say so explicitly. Strip `\`\`\`html` code fences client-side as a safety net.
- Content generator writes to Sanity as drafts via `writeClient.createOrReplace()` — never publishes directly.
- All AI routes are under `/api/admin/*` and require admin auth.
- `ANTHROPIC_API_KEY` must be set in Vercel environment variables.

### Fal.ai (Content Studio)
- Used for social graphic generation (LinkedIn banners, newsletter headers, event covers, research covers).
- Package: `@fal-ai/client`. Env var: `FAL_KEY`.
- Output saved to `aprn-documents` bucket.

---

## 9. Styling Rules (Tailwind v4 — breaking changes)

**Always use v4 canonical classes:**

| Wrong (v3) | Correct (v4) |
|---|---|
| `bg-gradient-to-r` | `bg-linear-to-r` |
| `flex-shrink-0` | `shrink-0` |
| `flex-grow` | `grow` |
| `max-w-[1440px]` | `max-w-360` |

- **Never use arbitrary `[]` values when a scale value exists.** The design uses a consistent spacing/sizing scale.
- Max widths in use: `max-w-360` (1440px), `max-w-275`, `max-w-240`, `max-w-225`

### Design Tokens (use these exact values)
```
navy-900: #071B2A    ← page background
navy-800: #0D2436    ← card background
navy-700: #15324A    ← hover states
gold-500: #D4A017    ← primary accent, CTAs
gold-400: #E5B83B    ← hover state for gold
copper-500: #C97A2B  ← secondary accent
```

### Fonts
- Display/headings: `style={{ fontFamily: "var(--font-playfair), serif" }}` — applied inline, not via class
- Body: Inter (default, via CSS variable)
- Font Awesome 6.4.0 loaded via CDN in root layout — use `<i className="fa-solid fa-..." />`

### Component patterns
- Cards: `bg-navy-800 border border-white/5` with `hover:border-gold-500/20 transition-colors`
- Primary CTAs: `bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest`
- Outline CTAs: `border border-gold-500/30 text-gold-500 hover:bg-gold-500/10`
- Section labels: `text-[10px] font-bold tracking-widest text-gold-500 uppercase`
- No border-radius on any element — the design is sharp/angular throughout

---

## 10. Next.js App Router Rules

- **No `src/` directory.** App is at root: `app/`, `lib/`, `components/`, etc.
- **This is Next.js 16 — APIs may differ from your training data.** Before writing any Next.js-specific code, read `node_modules/next/dist/docs/` for the relevant feature.
- Server components are the default. Add `"use client"` only when you need browser APIs, state, or event handlers.
- Use `after()` from `next/server` for fire-and-forget post-response work (e.g. updating `last_seen_at`).
- Route handlers live at `app/api/*/route.ts`. Export named functions `GET`, `POST`, `PUT`, `DELETE`.
- The `sanityFetch()` wrapper handles Next.js cache tagging — always use it, never call `client.fetch()` directly in page components.
- Dynamic segments: `app/[slug]/page.tsx`. Static params via `generateStaticParams()`.

---

## 11. File & Folder Conventions

```
app/                    Pages and API routes (App Router)
  (auth)/               Login, register, onboarding — no layout wrapper
  admin/                Admin panel pages (ADMIN_EMAILS gated)
  dashboard/            Member dashboard (auth required)
  api/                  Route handlers
    admin/              Admin-only API routes
    auth/               Supabase auth callbacks
    paystack/           Payment webhook + verify
lib/
  sanity/               client.ts, write-client.ts, fetch.ts, image.ts
  supabase/             server.ts, admin.ts
  validation.ts         Zod schemas (onboarding, profile, password)
  queries/              GROQ queries + TypeScript types (events.ts, etc.)
components/             Shared UI components
store/
  auth.ts               Zustand store — MembershipTier, profile, actions
types/
  database.ts           Generated Supabase types — DO NOT hand-edit
sanity/
  schemas/              One file per document/object type
  schemaTypes.ts        Registers all schemas
supabase/
  migrations/           SQL migration files
```

---

## 12. What NOT To Do

- **Do not use `bg-gradient-to-*`** — it's `bg-linear-to-*` in Tailwind v4.
- **Do not hand-edit `types/database.ts`** — regenerate it with the CLI after every migration.
- **Do not import `createAdminClient` in any client component or page** — service role key exposure.
- **Do not call `client.fetch()` directly in pages** — always use `sanityFetch()` for proper cache tagging.
- **Do not add border-radius** — design is intentionally sharp/angular.
- **Do not write to the `payments` table from the client or via the server client** — admin client only.
- **Do not store subscriber emails in Supabase** — they belong in Sanity (`subscriber` document type).
- **Do not push to `origin/master` without TypeScript passing** — run `pnpm exec tsc --noEmit` first.
- **Do not skip migrations** — every schema change to Supabase needs a migration file with correct timestamp format.
- **Do not add comments explaining what code does** — only add comments for non-obvious WHY (hidden constraints, workarounds). Never write multi-line comment blocks.
- **Do not add error handling for impossible scenarios** — only validate at system boundaries (user input, external APIs).
- **Do not add `border-radius` or rounded corners** — the design language is sharp rectangles only.
- **Do not use `flex-shrink-0`** — it's `shrink-0` in Tailwind v4.
- **Do not use `max-w-[1440px]`** — it's `max-w-360`.
- **Do not create new Supabase storage buckets** — everything goes in `aprn-documents`.
- **Do not expose signed URLs for downloads** — proxy through `/api/admin/documents/download`.
- **Do not use AI models other than `claude-opus-4-6` or `claude-sonnet-4-6`** — no dated suffixes on model IDs.
- **Do not commit `.env*` files, `PLAN.md`, `/.claude`, `/public/documents/`, `/website-templates/`** — all gitignored.

---

## 13. Environment Variables

| Variable | Where used | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + server | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + server | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/admin.ts` only | Secret — never client |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity clients | `cwohq4ef` |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity clients | `production` |
| `SANITY_API_READ_TOKEN` | `lib/sanity/client.ts` | Secret |
| `SANITY_WRITE_TOKEN` | `lib/sanity/write-client.ts` | Secret |
| `ADMIN_EMAILS` | All `/api/admin/*` routes | Comma-separated list |
| `ANTHROPIC_API_KEY` | All AI routes | Secret |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | PaystackButton component | Public |
| `PAYSTACK_SECRET_KEY` | `/api/paystack/verify` | Secret |
| `FAL_KEY` | Content Studio image gen | Secret |
| `RESEND_API_KEY` | Email routes | Secret |

---

## 14. Commit Convention

Every commit message co-authored by Claude must end with:
```
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Use PowerShell here-strings (`@'...'@`) for multi-line commit messages — bash heredocs fail in this environment.

---

## 15. Current Build Priorities (in order)

1. Training page — full template (`website-templates/training-development.html`)
2. Event detail `/events/[slug]` — dynamic route from Sanity (`website-templates/conference.html`)
3. Dashboard Intelligence Briefing `/dashboard/intelligence`
4. Settings: Notifications tab — `notification_preferences` table exists, not wired
5. Admin Generator v2 — URL input + Fal.ai image gen
6. Wire `saved_items` table to `/dashboard/saved`
7. Dashboard courses/research/network → live Sanity/Supabase data
8. Admin Payments page — Paystack transaction history
9. Mobile + accessibility fixes (10+ issues)
10. Set Vercel env vars: `ADMIN_EMAILS`, `ANTHROPIC_API_KEY`, Paystack live keys, confirm `SANITY_WRITE_TOKEN`
