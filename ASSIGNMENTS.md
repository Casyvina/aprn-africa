# APRN Africa — Team Assignments

> Track all weekly and ongoing task assignments across the team.
> Joseph updates technical tasks. Lucy/Tokunbo/Allison confirm non-technical tasks done.
> Format: `- [x]` = done · `- [ ]` = pending · `- [-]` = blocked

---

## Week of June 25–30, 2026

### Joseph — Engineering

- [x] Wire `/dashboard/research` to live Sanity data (replace hardcoded research list)
- [x] Wire `/dashboard/courses` to live Sanity training content
- [x] Wire `/dashboard/network` to live Supabase `profiles` data
- [x] Build Admin Payments page — pull live Paystack transaction history
- [x] Wire bookmark buttons on `/research` and `/insights` → `POST /api/dashboard/saved`
- [x] Connect dashboard filter tabs (courses, network, research) to state
- [x] Register Resend webhook in Resend dashboard (`/api/admin/outreach/webhooks/resend`) — done 2026-06-27 (Joseph)

---

### Tokunbo — Content

- [ ] Create 4–6 editorial insights or publications using AI Generator (`/admin/generate`)
      → Use paste text from LinkedIn posts or URL mode for source material
      → Save as draft, review, add hero image, publish in Sanity Studio
- [ ] Populate at least 2 upcoming events in Sanity Studio (title, date, location, description, speakers)
- [ ] Review and publish any existing AI drafts sitting in Sanity Studio (check Drafts section)
- [ ] Verify training programmes are created in Sanity and appear correctly on `/training`

---

### Allison — Content & Outreach Research

- [ ] Generate 6–8 social graphics using Content Studio (`/admin/content-studio`)
      → LinkedIn banners + newsletter headers for content Tokunbo publishes this week
- [ ] Run 3 AI Research briefs at `/admin/outreach/research`
      → Brief 1: Pipeline integrity engineers in East Africa (Kenya, Tanzania, Ethiopia)
      → Brief 2: EPC contractors operating in West Africa
      → Brief 3: Regulators and industry associations across Africa
      → Review every suggestion carefully — accept verified ones, reject guesses
- [ ] Create 1–2 content pieces using the AI Generator
      → Use screenshot mode for LinkedIn posts to turn into articles

---

### Lucy — Executive

- [ ] Set up the first outreach campaign at `/admin/outreach`
      → Goal: introduce APRN to new database contacts from Allison's research
      → Add recipients, generate email, review content, send
- [ ] Review and approve all content drafts before Tokunbo publishes
      → Check Sanity Studio Drafts section — leave notes in document if changes needed
- [ ] Generate, review, and send the June 25 weekly report (`/admin/weekly-report`)
      → Add notes in the "Notes" section before sending
- [ ] CAC follow-up — chase approval status
      → If approved: notify Joseph to update domain/legal footer

---

## Next Up — Engineering (priority order)

- [x] Build `/training` page — full template (`training-development.html`) — done 2026-06-27 (Joseph)
- [x] Build `/programs` page — template: `programs-initiative.html` — done 2026-06-27 (Joseph)
- [x] Build `/certification` page — template: `professional-certification.html` — done 2026-06-27 (Joseph)
- [x] Settings — wire "Upload Photo" (file picker → Supabase Storage `aprn-documents` bucket → update `profiles.avatar_url`) — done 2026-06-27 (Joseph)
- [x] Settings — wire "Delete Account" through a secure server route (delete auth user + profile row) — done 2026-06-27 (Joseph)
- [x] Document Library — persist metadata and upload registry across page refreshes — done 2026-06-27 (Joseph)
- [x] Stakeholder Map — add create/edit flows for new stakeholders — done 2026-06-27 (Joseph)
- [x] Communication calendar — edit and reorder existing calendar items — done 2026-06-27 (Joseph)

## Backlog — Polish & Accessibility

- [x] Mobile layout fixes (10+ responsive issues across public pages) — done 2026-06-27 (Joseph)
- [x] `components/Footer.tsx` — replace `<a href>` with `next/link` for internal routes — done 2026-06-27 (Joseph)
- [x] Navigation — add `aria-expanded` to mobile hamburger — done 2026-06-27 (Joseph)
- [x] Dashboard mobile nav — increase touch target size on close and sign-out buttons — done 2026-06-27 (Joseph)

---

## Completed

<!-- Move tasks here with date when done -->
<!-- Format: - [x] Task description — done 2026-06-DD (Person) -->

- [x] AI content generator — URL scraping mode — done 2026-06-17 (Joseph)
- [x] AI content generator — paste text + screenshot input modes — done 2026-06-25 (Joseph)
- [x] Outreach & AI research system — campaigns, recipients, email gen, send, tracking — done 2026-06-25 (Joseph)
- [x] Weekly report — GitHub commits, Sanity CMS, Supabase data — done 2026-06-17 (Joseph)
- [x] Weekly report — add Lucy personal email (olaghri@gmail.com) to recipients — done 2026-06-25 (Joseph)
- [x] Events — dynamic `/events/[slug]` route from Sanity — done 2026-06-18 (Joseph)
- [x] Dashboard Intelligence Briefing — done 2026-06-18 (Joseph)
- [x] Dashboard Saved Items — wired to Supabase `saved_items` — done 2026-06-18 (Joseph)
- [x] Settings Notifications tab — wired to `notification_preferences` table — done 2026-06-18 (Joseph)
- [x] Admin Database — 5 Supabase tables, CRUD, AI-assist, Excel export — done 2026-06-17 (Joseph)
- [x] Wire `/dashboard/research` + `/dashboard/courses` + `/dashboard/network` to live data — done 2026-06-25 (Joseph)
- [x] Admin Payments page — live Paystack transaction history — done 2026-06-27 (Joseph)
- [x] Bookmark buttons on `/research` and `/insights` — already wired via SaveButton — confirmed 2026-06-27
- [x] Tokunbo and Allison — Sanity Studio access confirmed active
- [x] GitHub token — added to `.env.local` and Vercel — confirmed
- [x] All 8 Vercel env vars live (ADMIN_EMAILS, ANTHROPIC_API_KEY, FAL_KEY, Paystack ×2, SANITY_WRITE_TOKEN, GITHUB_TOKEN, RESEND_API_KEY)
