# APRN Africa — Build Plan

> African Pipeline Resource Network — Full Platform Roadmap
> Updated: 2026-05-21

---

## Phase 1 — Public Site (Marketing & Acquisition)

> Goal: Professional public presence to build credibility and convert visitors.

- [x] Project setup — Next.js 16, Tailwind v4, Sanity CMS, TypeScript
- [x] Navigation + Footer
- [x] Homepage — Hero, About, Why Now, Pillars, Partners, Map, Research, Roadmap, CTA
- [x] About page
- [x] Leadership page — Pieter-Bas, Lucy, Kosie, Joseph, Allison (Youth Ambassador)
- [x] Research listing page — with Load More pagination
- [x] Research detail page — cinematic hero, Table of Contents, author card
- [x] Insights listing page
- [x] Insights detail page
- [x] Newsletter listing page
- [x] Newsletter issue page — cinematic header, stories, editor analysis
- [x] Partnerships page
- [x] Training page
- [x] Contact page
- [x] SEO — metadataBase, OpenGraph, Twitter card metadata
- [x] Sanity CMS — all content types (research, insights, newsletter, partners, training, homepage)
- [x] Sanity CDN images — cdn.sanity.io whitelisted in next.config.ts
- [x] Sanity webhook — instant cache revalidation on publish (expire: 0)
- [x] Newsletter signup form — API route + subscriber handling
- [x] Font Awesome + Plotly loaded via layout.tsx
- [x] Deployed to Vercel — aprn-africa.org

---

## Phase 2 — Auth & Membership Foundation

> Goal: Gate premium content, onboard members, establish roles.

- [ ] Supabase project setup — auth, database, RLS
- [ ] Database schema
  - [ ] `profiles` table (user metadata, role, membership tier)
  - [ ] `user_roles` table (admin, member, student, institution)
  - [ ] `memberships` table (tier, status, expiry)
- [ ] Supabase Auth — email/password + magic link
- [ ] Auth UI pages
  - [ ] `/login` — sign in page
  - [ ] `/register` — create account page
  - [ ] `/forgot-password` — password reset
- [ ] Middleware — protected route enforcement
- [ ] Role-based access control — free vs paid vs admin
- [ ] Zustand store — session state, user profile, UI state
- [ ] Protect premium research behind membership check
- [ ] Protect full training catalogue behind membership check

---

## Phase 3 — Member Dashboard

> Goal: Every member has a personalised home after login.

- [ ] `/dashboard` — dashboard shell with sidebar navigation
- [ ] Dashboard overview — recent activity, quick links
- [ ] Profile page — edit name, bio, country, specialisation
- [ ] Saved research — bookmark and retrieve articles
- [ ] My courses — enrolled courses with progress
- [ ] Membership status card — current tier, renewal date
- [ ] Notifications panel

---

## Phase 4 — Payments & Memberships

> Goal: Monetise the platform with tiered access.

- [ ] Paystack integration — primary (Nigeria / West Africa)
- [ ] Flutterwave integration — secondary (continental)
- [ ] Membership tiers defined
  - [ ] Free — public content only
  - [ ] Professional — full research archive, newsletter archive
  - [ ] Institutional — team seats, API access, priority support
- [ ] Checkout flow — select tier, pay, activate membership
- [ ] Webhook — Paystack/Flutterwave payment confirmation → update Supabase membership
- [ ] Membership management — upgrade, cancel, renewal reminders

---

## Phase 5 — Training & Course Enrollment

> Goal: APRN's core revenue product — pipeline certification programmes.

- [ ] Course catalogue page — browse all programmes
- [ ] Course detail page — curriculum, instructor, requirements, pricing
- [ ] Enrollment flow — select course, pay (or use membership credit), confirm
- [ ] Course progress tracking — lessons completed, quiz scores
- [ ] Certificate generation — on course completion
- [ ] Instructor dashboard — manage course content, view enrollments

---

## Phase 6 — Engineer Network

> Goal: Community flywheel — connect Africa's pipeline professionals.

- [ ] Engineer directory — searchable, filterable by country/specialisation
- [ ] Public engineer profile pages
- [ ] Connection / follow system
- [ ] Direct messaging (basic)
- [ ] Comments on research articles and insights
- [ ] Discussion threads — community Q&A

---

## Phase 7 — Admin Panel

> Goal: Lucy and the APRN team can manage everything without a developer.

- [ ] Admin dashboard — `/admin`
- [ ] Content management (supplement Sanity Studio)
- [ ] Member management — view, edit roles, suspend accounts
- [ ] Payment history and revenue overview
- [ ] Newsletter send management
- [ ] Course and enrollment management
- [ ] Analytics — traffic, signups, revenue, course completions

---

## Ongoing / Infrastructure

- [ ] On-demand revalidation webhook — Sanity → Vercel (DONE — `expire: 0`)
- [ ] Error monitoring — Sentry or similar
- [ ] Analytics — Vercel Analytics or Plausible
- [ ] Performance — Core Web Vitals audit
- [ ] Accessibility audit
- [ ] Mobile QA across devices
- [ ] OG image — 1200×630 branded image for social sharing (logo needs dark background version)
