# APRN Africa — Admin Panel User Guide

**Who this is for:** Lucy Okeke, Joseph Agwuh, Tokunbo Khadijat  
**Last updated:** June 2026

---

## Getting In

The admin panel lives at `/admin`. You must be logged in with an admin email address — the panel is invisible to everyone else.

Admin accounts: `info@aprn-africa.org`, `olaghri@gmail.com`, `josephagwuh@gmail.com`, `tokunbokhadijat@gmail.com`

If you see a blank page or get redirected, you are either not logged in or your email is not on the admin list.

---

## 1. Dashboard

**Path:** `/admin`

The first thing you see when you enter the admin panel. It gives you a live snapshot of the membership:

- **Total members** — everyone registered on the platform
- **Professional+ members** — professional, associate, and corporate tier combined
- **Paid members** — anyone who has completed a payment
- **New this month** — signups in the last 30 days
- **Tier breakdown** — percentage bars showing how members are distributed across free, student, graduate, professional, associate, and corporate tiers
- **Recent signups** — the last 8 people who joined, with their email, name, tier, and join date

Nothing is editable here. It is a read-only overview.

---

## 2. Members

**Path:** `/admin/members`

The full member database. Every registered user appears here with their profile details.

**What you can see:**
- Email address, full name, membership tier, country, discipline, organisation, topics of interest, join date, last activity

**What you can do:**
- **Search** — type any name, email, or organisation to filter the list
- **Change a member's tier** — click on a member to open a drawer. Choose the new tier from the dropdown and save. This takes effect immediately and is reflected in the member's dashboard.

**When to use this:**
- When a member has paid outside the platform and needs their tier updated manually
- When a member asks to be moved to a different tier
- When you want to check who is active or see the full member profile

---

## 3. Content Generator

**Path:** `/admin/generate`

An AI writing tool that creates draft articles and reports for Sanity CMS. The content is saved as a **draft** — it does not go live until someone reviews and publishes it in Sanity Studio.

### Content types

| Type | When to use |
|---|---|
| Editorial Insight | Thought leadership, opinion pieces, commentary |
| Research Report | Data-driven briefs, technical summaries |
| Publication | Press releases, event summaries, op-eds, interviews |

### How to generate content

1. **Choose a content type** from the dropdown.
2. **Add a reference source** — one of three options:
   - **URL** — paste a link to an article, report, or webpage. The system fetches the text and uses it as context.
   - **Paste text** — copy and paste raw text directly.
   - **Screenshot** — upload an image of text (a PDF screenshot, a photo of a document, etc.). The system reads the text from the image.
3. **Enter a topic** — the subject of the piece (e.g., "Gas pipeline safety standards in West Africa").
4. **Enter an angle/focus** — what specific angle or argument the piece should take.
5. **(Optional) Add key points** — one point per line, to ensure specific things are covered.
6. Click **Generate**.

### What happens next

- Claude writes the content and saves it as a draft in Sanity CMS.
- A hero image is generated in parallel using Fal.ai.
- The result panel shows the title, a preview of the content, and the generated image.
- The draft appears in Sanity Studio under the relevant document type, marked as a draft.
- **Tokunbo** (or whoever manages content) should review the draft in Sanity Studio, add the hero image, make any edits, and publish.

### Important

The AI does not always get facts right. Always verify specific claims, statistics, and names before publishing. The generator is a starting point, not a final product.

---

## 4. Content Studio

**Path:** `/admin/content-studio`

Generates branded visual assets for social media, newsletters, and events using AI image generation.

### Supported formats

| Format | Dimensions | Use case |
|---|---|---|
| Event Banner | 1920×1080 | Website headers, email headers |
| LinkedIn Post | 1200×627 | LinkedIn article covers |
| Newsletter Header | 1200×400 | Email newsletter banners |
| Research Cover | 800×1000 | Report/document covers |
| Social Square | 1080×1080 | Instagram, general social |

### How to generate an image

1. **Select a format** — each preset shows the aspect ratio.
2. **Write a prompt** — describe what you want. Quick suggestions are shown for each format type.
3. **Toggle brand context** if you want navy and gold APRN branding baked into the image.
4. Click **Generate**.

### After generation

- The image appears as a preview.
- **Download** saves it to your computer.
- **Save to Library** uploads it to the Document Library in Supabase Storage, where it will persist beyond 24 hours.

Images on Fal.ai expire after 24 hours. If you plan to use an image, save it to your computer or the library immediately.

Each generation costs approximately $0.05.

---

## 5. Weekly Report

**Path:** `/admin/weekly-report`

Sends a weekly update email to members and stakeholders.

**What you can see:**
- A list of past weekly reports with the subject line, send date, and who sent it.

**To send a new report:**
- The system uses Claude to generate the report content based on recent activity.
- Once generated, you can review and edit before sending.
- Sent reports are logged and visible in the list.

Recipients include members and key stakeholders. The report is sent via Resend (the platform's email provider).

---

## 6. Outreach

The Outreach section has two parts: **Campaigns** and **AI Research**.

### 6a. Campaigns

**Path:** `/admin/outreach`

Manages targeted email campaigns to pipeline professionals outside the APRN membership.

**Campaign list:** Shows all campaigns with their name, status (Draft, Ready, Sending, Sent), recipient count, and creation date.

**To create a campaign:**
1. Click **New Campaign**.
2. Enter a campaign name and goal.
3. Choose the campaign type: **General** (same email to everyone) or **Personalized** (unique email per recipient).
4. Add a subject line and email template.

**Inside a campaign:**
- See all recipients grouped by type: Pipeline Engineers, Pipeline Operators, EPC Contractors, Regulators/Associations.
- **Preview** — see how the email will look before sending.
- **Send** — dispatches to all recipients via Resend. Status updates to "Sent" and each recipient's status is tracked.
- Recipient statuses: Pending → Sent → Opened / Bounced / Replied / No Email

### 6b. AI Research

**Path:** `/admin/outreach/research`

Uses Claude to suggest contacts for outreach campaigns. These are people not currently in your database.

**How it works:**

1. Write a research brief describing who you are looking for (e.g., "Pipeline integrity engineers in East Africa with LNG experience").
2. Select the **target table** — which database table to add accepted contacts to (Engineers, Operators, Contractors, or Regulators).
3. Select how many suggestions you want (3, 5, 8, or 10).
4. Click **Research**.

**Reviewing suggestions:**

Each suggestion appears as a card with the generated contact details. For each one you can:
- **Edit** — correct any fields before accepting
- **Accept** — adds the contact to the selected database table
- **Reject** — discards the suggestion

**Important:** Claude may generate plausible but invented contacts. Always verify names and organisations via LinkedIn before sending outreach emails.

---

## 7. Strategy Portal

Three tools for managing APRN's strategic operations.

### 7a. Stakeholder Map

**Path:** `/admin/strategy/stakeholders`

A stakeholder management system with a visual influence/interest matrix.

**What you see:**
- A 2×2 matrix plotting stakeholders by influence (High/Medium/Low) and interest level.
- A table below with full details: name, organisation, type, relationship status, engagement strategy, last contact date, and notes.

**Stakeholder categories:** Internal, Government, Partners, Funders, Industry, Associations, Media, WIMEE

**What you can do:**
- **Filter** by stakeholder type using the tabs above the table.
- **Update last contact date** — click the date field for any stakeholder and set today's date after a meeting or call.
- **Add notes** — click the notes field to record what was discussed or any relevant context.
- **Generate Engagement Brief** — click on any stakeholder to get a Claude-generated brief with recommended talking points and engagement tactics based on their profile.

Keep last contact dates current. It helps track which relationships are going cold.

### 7b. Document Library

**Path:** `/admin/strategy/documents`

Central storage for strategy documents, presentations, reports, and research files.

**Supported file types:** PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx), HTML

**Uploading a document:**
1. Click **Upload**.
2. Select your file.
3. Fill in the metadata: display name, version, date, category, description, and any internal notes.
4. Click **Save**.

**Document categories:** Presentations, Reports, Research, Strategy, Database

**What you can do with existing documents:**
- **View** — opens the document in the browser (HTML files render in-browser; others are shown as-is).
- **Download** — generates a 1-hour download link.
- **Summarise (AI)** — Claude reads the document and writes a brief summary. Useful for quickly understanding a document without opening it.
- **AI Edit (HTML documents only)** — describe a change in plain English ("Update the Q3 numbers to Q4" or "Add a new section on Nigeria"). Claude applies the change and shows a preview. You can then save the edited version.
- **Edit metadata** — update any of the metadata fields (name, version, date, notes, category).
- **Delete** — removes the file from storage and the metadata record. This cannot be undone.

**Search and filter:** Use the search bar to find documents by name, description, or notes. Use the category filter to narrow by type.

### 7c. Communication Strategy

**Path:** `/admin/strategy/communication`

Manages APRN's communication plan — channels, stakeholders, approval process, and content calendar.

**What's here:**

- **Overview** — headline numbers (internal stakeholders, external stakeholders, channels, approval stages)
- **Internal Stakeholders** — the core team and their communication channels
- **External Stakeholders** — partners, funders, government bodies, industry, associations, media
- **Channel Strategy** — one card per communication channel (WhatsApp, LinkedIn, Website, Newsletter, Email, Webinars). Each card shows the frequency, content types, target audience, and owner.
- **WhatsApp Groups** — tracked separately with group name, member count, manager, and last broadcast date.
- **Approval Process** — the 4-step content approval flow: Create → Review → Approve → Publish
- **Communication Calendar** — a 4-week rolling content plan with editable items per week

**Editing channels:**
Click any channel card to open a drawer where you can update frequency, content types, audience, and owner. Changes are saved to the database.

**Editing the calendar:**
Add, edit, or delete calendar items week by week. Changes are live immediately.

---

## 8. Personnel Documents

**Path:** `/admin/personnel`

**Access restricted to Lucy Okeke and Joseph Agwuh only.**

Storage for confidential team documents — contracts, personnel files, internal records.

**Uploading:**
1. Click **Upload**.
2. Select a file (PDF, Word, PowerPoint, Excel, or TXT).
3. Add metadata: display name, person (who it relates to), description, version, date.
4. Click **Save**.

**Accessing documents:**
- **Download** — generates a 1-hour secure download link. The link cannot be shared; it requires admin login.
- **Delete** — removes the file permanently.

All files are stored in private cloud storage and are not accessible from any other part of the platform.

---

## 9. Site Map

**Path:** `/admin/sitemap`

A reference page showing every route on the platform, what data source it uses, its current build status, and which team member is responsible for each area. Also shows the data flow diagram (how Sanity, Supabase, Paystack, Claude API, and Fal.ai connect).

Nothing is editable here. Use it to understand the platform architecture or check the build status of a feature.

---

## Quick Reference

| Task | Where to go |
|---|---|
| See how many members we have | `/admin` |
| Change a member's tier | `/admin/members` → click the member |
| Write a draft article | `/admin/generate` |
| Generate a social image | `/admin/content-studio` |
| Send a weekly email update | `/admin/weekly-report` |
| Create an outreach campaign | `/admin/outreach` |
| Find contacts with AI | `/admin/outreach/research` |
| Update stakeholder notes | `/admin/strategy/stakeholders` |
| Upload a strategy document | `/admin/strategy/documents` |
| Update the comms calendar | `/admin/strategy/communication` |
| Access personnel files | `/admin/personnel` |

---

## Common Questions

**I generated content but can't find it in Sanity Studio.**  
Content is saved as a draft. In Sanity Studio, make sure you are viewing "Drafts" not "Published". It will appear there under the document type you selected (Editorial Insight, Research Report, or Publication).

**The URL input on the Content Generator didn't work.**  
Some websites block automated fetches. If you see a warning that the URL failed, switch to Paste Text and copy the article text manually.

**I deleted a document from the Document Library but the card is still showing.**  
Try refreshing the page. The delete removes the file from storage and the database in one step — if the card persists after a fresh load, flag it to Joseph.

**A recipient in my outreach campaign shows "No Email".**  
The contact is in the database but has no email address recorded. Either source the email and update the record in the Database section, or exclude that contact from the campaign.

**I want to change who receives the weekly report.**  
This is configured in the codebase. Ask Joseph to update the recipient list.
