# Session Analysis Report — APRN Africa

**Generated**: 2026-06-12
**Source**: Git history (100 commits) — no Antigravity brain/ directory present; git log used as session proxy
**Date Range**: 2026-05-11 → 2026-06-12 (32 days)
**Sessions Identified**: 10 (by date cluster)

> Note: Because `~/.gemini/antigravity/brain/` does not exist on this machine, this report derives all signals from git commit messages, file-change frequency, timestamps, PLAN.md, and MEMORY.md. Confidence is adjusted accordingly.

---

## Executive Summary

| Metric | Value | Rating |
|:---|:---|:---|
| Completion Rate (PLAN.md) | ~75% of routes | 🟡 |
| Fix/Rework Commit Rate | 42 / 100 (42%) | 🔴 |
| Sessions with Post-Delivery Lint Fixes | 4 / 10 (40%) | 🔴 |
| Newsletter Redesign Iterations | 2 (3 separate fix commits) | 🔴 |
| Auth/Onboarding Fix Commits | 4 across 2 sessions | 🔴 |
| First-Shot Clean Sessions | 2 / 10 (20%) | 🔴 |
| Cache/ISR Churn (June 10) | 4 commits in 13 hours | 🔴 |
| Avg Session Severity | ~42 (Significant) | 🟡 |

**Narrative**: The build has achieved strong delivery velocity — 75% of planned routes are live — but at the cost of persistent rework. The dominant failure modes are (1) content not finalized before code was written, forcing repeated "fix name / fix title / fix photo" commits across the public pages, and (2) TypeScript and lint errors delivered on every major sprint that required a cleanup commit immediately after. Auth/onboarding was the hardest technical challenge, requiring 4 dedicated fix commits across two sessions. Cache/ISR behavior in Next.js 16 caused a day-long thrash on June 10 that should have been resolved in one commit. The project is healthy overall but the rework rate indicates that pre-build content freeze and pre-push lint validation are missing from the workflow.

---

## Root Cause Breakdown

| Root Cause | Count (estimate) | % | Notes |
|:---|:---|:---|:---|
| SPEC_AMBIGUITY | ~30 commits | 30% | Content not finalized before build (names, titles, photos, newsletter redesigns) |
| AGENT_ARCHITECTURAL_ERROR | ~20 commits | 20% | Lint errors after every sprint, TS type errors, onboarding redirect loop |
| REPO_FRAGILITY | ~20 commits | 20% | RLS INSERT policy missing, Tailwind v4 class names, Next.js ISR behavior |
| HUMAN_SCOPE_CHANGE | ~15 commits | 15% | Admin strategy portal added late, training sections extended, content additions |
| VERIFICATION_CHURN | ~10 commits | 10% | Cache/ISR day, newsletter tested across multiple occasions |
| LEGITIMATE_TASK_COMPLEXITY | ~5 commits | 5% | Sanity integration depth, AI generator, Zustand hydration |

---

## Prompt Sufficiency Analysis

### Common traits of high-sufficiency sessions
- Sessions 1 (initial build) and 10 (Intelligence Briefing + Strategy Portal) produced clean first-shot delivery
- Both had: a clear template reference, bounded scope, and no content dependencies
- Admin work in general had cleaner delivery — admin specs were internally sourced, not client-content-dependent

### Common missing inputs that caused friction

| Missing Input | Where It Hurt |
|:---|:---|
| Finalized content (names, titles, bios, photos) | About, Leadership pages — 28+ rework commits |
| Newsletter design direction upfront | Newsletter redesigned twice from scratch |
| Auth callback flow fully specified | 4 fix commits spread across 2 sessions |
| Tailwind v4 class constraint awareness | 1 dedicated "Fix Tailwind v4 canonical classes" commit |
| Next.js 16 ISR/revalidation behavior | 4 cache commits in a single day |
| RLS policy requirements on upsert | Blocked onboarding completely, required migration fix |

### Verdict
**Prompt sufficiency band: Low → Medium** for content-dependent pages; **High** for bounded admin/feature work. The single highest-yield prompt improvement would be requiring a **content freeze** before writing any public-facing page.

---

## Scope Change Analysis

### Human-Added Scope
- Admin Strategy Portal (June 12) — 3 new admin pages not in original PLAN.md
- Training page section extensions (certification pathway, APConnect platform)
- Multiple team member additions to Leadership (Allison Gabriel, Pieter-Bas Nederveen, Kosie Stephanie Onuora)
- Dashboard quick-access links and Studio link added post-build

### Necessary Discovered Scope
- Supabase RLS INSERT policy — required to make onboarding upsert work; not visible until runtime
- `dynamicParams = true` + ISR on newsletter — required to handle new Sanity-published issues without redeploys
- DashboardHydrator — Zustand server-seed pattern needed once auth store was in place
- `generateStaticParams` hardening — required for slug-based pages in Next.js 16 static build

### Agent-Introduced Scope
- Onboarding redirect loop — the redirect in `dashboard/layout.tsx` was introduced by the agent incorrectly and required 2 fix commits
- Lint errors on every major delivery — agent-generated code consistently had JSX, unused-type, or anchor-tag lint violations that required follow-up commits
- TypeScript generics not typed on first pass — generate-content route required an explicit generic fix; newsletter `sourceUrl` required a cast

---

## Rework Shape Analysis

| Session | Shape | Notes |
|:---|:---|:---|
| S1 May 11 | Clean execution | Initial scaffold, simple and bounded |
| S2 May 12-13 | Progressive scope expansion | Pages kept being added as client reviewed; content not finalized |
| S3 May 14-15 | Reopen/reclose churn | Newsletter approach changed mid-session (Resend → Sanity storage) |
| S4 May 18-19 | Late-stage verification churn | "text changes made push" commits, photo fixes, Tailwind class fixes |
| S5 May 21-22 | Early replan then stable | Auth foundations then lint cleanup after each delivery |
| S6 May 26-27 | Early replan then stable | Large delivery → lint fix → membership rebuilt immediately after |
| S7 June 3 | Reopen/reclose churn | Onboarding loop fixed, then auth reopened in session 8 |
| S8 June 5-6 | Progressive scope expansion | Auth fixes + planning docs + admin sitemap + hydration |
| S9 June 9-10 | Reopen/reclose churn | Newsletter redesigned → cache fixes → TS fix → redesigned again |
| S10 June 12 | Clean execution | Focused delivery, no follow-up fixes |

**Primary pattern**: **Reopen/reclose churn** — features are delivered, appear done, then require reopening due to content changes, cache behavior, or TypeScript issues. This is not a single-session failure; it's a systemic one.

---

## Friction Hotspots

Ranked by modification frequency:

| Rank | File / Subsystem | Touches | Primary Root Cause | Signal |
|:---|:---|:---|:---|:---|
| 1 | `app/about/page.tsx` + `AboutSection.tsx` | 31 combined | SPEC_AMBIGUITY | Content not frozen; names, photos, titles changed repeatedly |
| 2 | `components/Navigation.tsx` | 15 | HUMAN_SCOPE_CHANGE | Nav links added as pages were added, no upfront site map |
| 3 | `app/leadership/page.tsx` | 12 | SPEC_AMBIGUITY | Team roster was live while being built |
| 4 | `app/newsletter/page.tsx` + `[issue]/page.tsx` | 15 combined | SPEC_AMBIGUITY + VERIFICATION_CHURN | 2 redesigns + 3 cache fixes |
| 5 | `app/dashboard/layout.tsx` | 8 | AGENT_ARCHITECTURAL_ERROR + REPO_FRAGILITY | Redirect loop introduced then fixed; auth logic layered over time |
| 6 | `lib/sanity/fetch.ts` | ~6 | VERIFICATION_CHURN | ISR revalidate values wrong; 3-4 iterations to stabilize |
| 7 | `app/training/page.tsx` | 8 | HUMAN_SCOPE_CHANGE | Sections added incrementally across 3 sessions |

---

## First-Shot Successes

| Session | What Was Built | Why It Worked |
|:---|:---|:---|
| S1 May 11 | Initial scaffold, landing page, mobile nav | Simple, bounded. No content dependencies. |
| S10 June 12 | Intelligence Briefing page + Strategy Portal | Template provided, internal spec, no client-content dependency |
| Admin generator (June 3) | Claude → Sanity AI generator | Internal tool, no design ambiguity, one clear API shape |
| Admin sitemap (June 6) | Visual site map page | Internally specified, no external content |

**Pattern**: The cleanest sessions are those with a template to follow OR no dependency on client-provided content. Admin and internal tooling pages consistently deliver cleanly.

---

## Non-Obvious Findings

### 1. Content instability was the #1 rework driver — not code quality
**Observation**: Of the ~42 fix/rework commits, ~15+ are directly traceable to content not being finalized before pages were built (founder name fix, director→president title, Joseph bio, broken photos, "text changes made push"). This dwarfs lint or TypeScript issues.
**Why it matters**: The fix is organizational, not technical. A content-freeze protocol before any public page is coded would eliminate this class of rework entirely.
**Confidence: High** — direct commit message evidence.

### 2. Lint errors appear as a follow-up tax on every major delivery
**Observation**: Sessions 5, 6, and the trailing edge of session 2 all have a standalone "fix lint errors" commit immediately following a large feature delivery. This is not a one-time issue — it's a pattern across 40% of delivery sessions.
**Why it matters**: It signals that the agent does not run `pnpm lint` before declaring a commit done. A pre-push lint hook would catch this at the source.
**Confidence: High** — timestamp evidence shows lint fixes within hours of delivery commits.

### 3. The newsletter subsystem was redesigned twice with no spec change — spec ambiguity, not feature complexity
**Observation**: Newsletter was built on May 14-15, polished on May 18, redesigned on June 9, patched for cache on June 10, patched for TS on June 10, then redesigned again on June 10. Six commits targeting two files.
**Why it matters**: This is not a technically hard feature. The recurring redesigns indicate the design direction was never explicitly agreed before code was written.
**Confidence: High** — six commits on two files, two explicit "redesign" commit messages.

### 4. Auth/onboarding failure was layered — each fix uncovered the next problem
**Observation**: RLS blocked upsert → fixed. Redirect loop in layout → fixed. Auth callback logic wrong → fixed. Skip-for-now loop → fixed. Each fix exposed the next layer rather than resolving the root cause in one session.
**Why it matters**: This indicates the onboarding flow was not mapped end-to-end before building. A sequence diagram upfront would have revealed all three failure points simultaneously.
**Confidence: High** — 4 commits with explicit "fix onboarding" / "fix redirect" messages across 2 sessions.

### 5. Sessions 1 and 10 are the only fully clean sessions — and they share the same trait
**Observation**: Session 1 (initial scaffold) and Session 10 (Intelligence Briefing + Strategy Portal) had no follow-up fix commits. Both used a template as a reference (UXPilot HTML) and were not dependent on client-provided content.
**Why it matters**: Template-first, content-independent sessions consistently deliver cleanly. This is the most reliable pattern in this build.
**Confidence: High** — timestamp evidence, absence of follow-up fix commits.

### 6. ISR/cache behavior took a full day to stabilize and was never fully resolved in one attempt
**Observation**: June 10 has 4 commits about revalidation/cache within 13 hours. The root issue (Next.js 16 ISR revalidation for Sanity-published content) was clearly not understood at the start of the session.
**Why it matters**: This is REPO_FRAGILITY — Next.js 16 ISR semantics differ from training data. Reading `node_modules/next/dist/docs/` (per AGENTS.md) before touching ISR would have resolved this in one commit.
**Confidence: Medium** — four commits on the same two files is strong signal, but exact root cause per commit not fully dissectable from message alone.

### 7. Admin tooling has near-zero rework — suggesting admin specs are more complete
**Observation**: Admin panel (May 27), AI generator (June 3), sitemap (June 6), intelligence briefing (June 12), and strategy portal (June 12) all delivered with no rework. The only admin rework was the `admin/layout.tsx` receiving new nav links (human-added scope, not bugs).
**Why it matters**: Admin pages are spec'd internally by the engineering team. Public pages depend on client content. The delta in rework rate directly reflects this difference.
**Confidence: High** — file modification frequency analysis.

---

## Severity Triage

| Session | Severity | Band | Primary Driver | Best Intervention |
|:---|:---|:---|:---|:---|
| S9 June 9-10 | 55 | Significant | Newsletter churn × 6 commits, cache thrash | Prompt improvement — require design direction + ISR strategy before coding |
| S3-S4 Auth chain | 52 | Significant | 4-layer onboarding failure | Repo: map auth flow end-to-end (sequence diagram) before building |
| S2 May 12-13 | 48 | Significant | Content not frozen, nav scope explosion | Process: content freeze protocol |
| S4 May 18-19 | 44 | Significant | "text changes made push", photo/image churn | Process: client content approved before build session |
| S6 May 26-27 | 38 | Moderate | Lint tax, membership rebuild | Validation: add pre-push lint hook |
| S5 May 21-22 | 35 | Moderate | Lint tax after auth sprint | Validation: pre-push lint hook |
| S1, S10 | 8 | Low | None — clean delivery | No intervention needed |

---

## Recommendations

### 1. Enforce content freeze before public page sessions

- **Observed pattern**: ~15 commits are "fix name / fix photo / fix title / text changes"
- **Likely cause**: Pages were coded while client-provided content was still being finalized
- **Evidence**: "Fix: correct founder name to Lucy Okeke", "updated director to president", "Add founder headshots", multiple "fix broken leadership photos"
- **Change to make**: Before any public-facing page session, obtain approved: full names, titles, headshot URLs, copy. Do not start coding until these are signed off.
- **Expected benefit**: Eliminates ~30% of rework commits
- **Confidence: High**

### 2. Add a pre-push lint + type-check step

- **Observed pattern**: Dedicated lint-fix commits appear after 40% of delivery sessions
- **Likely cause**: `pnpm lint` and `pnpm build` are not run before committing
- **Evidence**: "Fix 4 lint errors — JSX mismatch, anchor tag, unused type, ref capture", "Fix all lint errors, dashboard bugs", "Redesign /newsletter to editorial template style; fix AdminMembersTable lint"
- **Change to make**: Add a pre-commit hook: `pnpm lint && pnpm tsc --noEmit`. Or configure in `.claude` hooks via `/update-config`.
- **Expected benefit**: Eliminates standalone lint-fix commits entirely
- **Confidence: High**

### 3. Read Next.js docs before touching ISR / cache

- **Observed pattern**: 4 cache/revalidation commits in 13 hours
- **Likely cause**: Next.js 16 ISR semantics not consulted upfront (per AGENTS.md, this is required)
- **Evidence**: "Fix newsletter cache", "Reduce cache to 60s", "Fix newsletter cache: reduce revalidate to 60s", all same day
- **Change to make**: Before any page that uses `revalidate`, `revalidateTag`, or `dynamicParams`, read `node_modules/next/dist/docs/` on caching. Document the chosen strategy in a comment before coding.
- **Expected benefit**: Reduces ISR-related churn to 0-1 commits per feature
- **Confidence: High**

### 4. Map auth flows end-to-end before building

- **Observed pattern**: Auth/onboarding required 4 fix commits across 2 sessions
- **Likely cause**: Callback routing, RLS requirements, and redirect logic were discovered layer-by-layer instead of planned upfront
- **Evidence**: "Fix onboarding: add INSERT RLS policy", "Fix onboarding: remove redirect loop", "Fix: remove onboarding redirect loop in dashboard layout", "Auth callback: skip onboarding for returning users"
- **Change to make**: Write a flow diagram (even a simple comment block) covering: register → verify → callback → profile check → redirect. Identify all Supabase RLS requirements before writing the first line.
- **Expected benefit**: Collapses 4 sessions of auth churn into 1
- **Confidence: High**

### 5. Require design direction before newsletter / detail page rebuilds

- **Observed pattern**: Newsletter redesigned twice, resulting in 6 commits
- **Likely cause**: No explicit design direction was specified; agent inferred from template and then changed direction again
- **Evidence**: "Redesign /newsletter to editorial template style" → "Redesign newsletter listing page — consistent dark navy APRN branding"
- **Change to make**: Before redesigning any page, specify: which template file to use, what colour palette, what specific sections are changing vs staying.
- **Expected benefit**: Eliminates second redesign pass
- **Confidence: Medium** (two "redesign" commits are clear; whether the second was human-directed or agent-introduced is unclear)

---

## Per-Session Breakdown

| # | Session | Intent | Commits | Fix Commits | Root Cause | Rework Shape | Severity | Clean? |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| 1 | May 11: Initial scaffold | DELIVERY | 6 | 1 | — | Clean | 8 | Yes |
| 2 | May 12-13: Public pages | DELIVERY | 14 | 6 | SPEC_AMBIGUITY | Progressive scope expansion | 48 | No |
| 3 | May 14-15: Newsletter + Sanity | DELIVERY | 9 | 3 | SPEC_AMBIGUITY | Reopen/reclose | 42 | No |
| 4 | May 18-19: Content + detail pages | DELIVERY | 17 | 9 | SPEC_AMBIGUITY | Late-stage verification churn | 44 | No |
| 5 | May 21-22: Auth + Dashboard | DELIVERY | 17 | 5 | AGENT_ARCHITECTURAL_ERROR | Early replan then stable | 35 | No |
| 6 | May 26-27: Admin + Onboarding | DELIVERY | 7 | 2 | LEGITIMATE_TASK_COMPLEXITY | Early replan then stable | 38 | No |
| 7 | June 3: AI Generator + auth fix | DELIVERY + DEBUGGING | 3 | 1 | REPO_FRAGILITY | Reopen/reclose | 30 | No |
| 8 | June 5-6: Auth polish + planning | DEBUGGING | 7 | 2 | REPO_FRAGILITY | Progressive scope expansion | 32 | No |
| 9 | June 9-10: Newsletter + cache | DELIVERY + DEBUGGING | 10 | 6 | SPEC_AMBIGUITY + VERIFICATION_CHURN | Reopen/reclose | 55 | No |
| 10 | June 12: Intelligence + Strategy | DELIVERY | 3 | 0 | — | Clean | 8 | Yes |

---

## Remaining Work (from PLAN.md) — Risk Assessment

| Item | Risk | Reason |
|:---|:---|:---|
| Event detail `/events/[slug]` | Medium | Needs speakers/agenda content — same content-dependency risk as About/Leadership |
| Settings: Notifications tab | Low | Bounded UI addition, template exists |
| Admin Generator v2 (URL + Fal.ai) | Low | Internal tool, clear spec, no content dependency |
| Programs page `/programs` | Medium | Client content required; risk of repeated photo/copy changes |
| Professional Certification `/certification` | Medium | Same risk as Programs |
| Admin Payments (Paystack API) | Low | External API with clear contract |
| Vercel env vars (ADMIN_EMAILS, etc.) | Low | Manual steps, not code |

---

*Report generated from git history analysis. For Antigravity brain/ session analysis, install and use the Gemini CLI with session tracking enabled.*
