export const metadata = { title: "Admin Guide — APRN Africa" };

const sections = [
  { id: "getting-in",        label: "Getting In"         },
  { id: "dashboard",         label: "1. Dashboard"       },
  { id: "members",           label: "2. Members"         },
  { id: "generate",          label: "3. Content Generator" },
  { id: "content-studio",    label: "4. Content Studio"  },
  { id: "weekly-report",     label: "5. Weekly Report"   },
  { id: "outreach",          label: "6. Outreach"        },
  { id: "strategy",          label: "7. Strategy Portal" },
  { id: "personnel",         label: "8. Personnel Docs"  },
  { id: "quick-reference",   label: "Quick Reference"    },
  { id: "faq",               label: "Common Questions"   },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-4">
      {children}
    </p>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-xl font-semibold text-white mb-3 scroll-mt-8 pt-10 first:pt-0"
      style={{ fontFamily: "var(--font-playfair), serif" }}
    >
      {children}
    </h2>
  );
}

function H3({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3
      id={id}
      className="text-sm font-semibold text-gold-500 uppercase tracking-wider mb-2 mt-6 scroll-mt-8"
    >
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-300 leading-relaxed mb-3">{children}</p>;
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-gold-500/40 pl-4 py-1 mb-4">
      <p className="text-sm text-slate-400 leading-relaxed">{children}</p>
    </div>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="mb-4 space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
          <span className="shrink-0 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-gold-500/10 text-gold-500 border border-gold-500/20 mt-0.5">
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function Bullets({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className="mb-4 space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-sm text-slate-300 leading-relaxed">
          <span className="shrink-0 mt-1.5 w-1 h-1 bg-gold-500/60 rounded-full" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mb-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            {headers.map((h) => (
              <th key={h} className="text-left text-[10px] font-bold tracking-widest text-gold-500 uppercase py-2 pr-6">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5">
              {row.map((cell, j) => (
                <td key={j} className="py-2 pr-6 text-slate-300 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminGuidePage() {
  return (
    <div className="flex gap-10 max-w-6xl">

      {/* Sticky sidebar nav */}
      <aside className="hidden lg:block w-44 shrink-0">
        <div className="sticky top-0 pt-1">
          <p className="text-[9px] font-bold tracking-widest text-slate-600 uppercase mb-3">
            Contents
          </p>
          <nav className="space-y-0.5">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-xs text-slate-500 hover:text-gold-500 py-1 transition-colors leading-tight"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-8">
          <SectionLabel>Admin Panel</SectionLabel>
          <h1
            className="text-2xl font-semibold text-white mb-2"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            User Guide
          </h1>
          <p className="text-sm text-slate-400">
            For Lucy Okeke, Joseph Agwuh, and Tokunbo Khadijat.
            Last updated June 2026.
          </p>
        </div>

        {/* ── Getting In ── */}
        <div className="bg-navy-800 border border-white/5 p-6 mb-2">
          <H2 id="getting-in">Getting In</H2>
          <P>
            The admin panel lives at <strong className="text-white">/admin</strong>. You must be
            logged in with an admin email address — the panel is invisible to everyone else.
          </P>
          <P>
            Admin accounts: <code className="text-gold-500 text-xs bg-white/5 px-1.5 py-0.5">info@aprn-africa.org</code>{" "}
            <code className="text-gold-500 text-xs bg-white/5 px-1.5 py-0.5">olaghri@gmail.com</code>{" "}
            <code className="text-gold-500 text-xs bg-white/5 px-1.5 py-0.5">josephagwuh@gmail.com</code>{" "}
            <code className="text-gold-500 text-xs bg-white/5 px-1.5 py-0.5">tokunbokhadijat@gmail.com</code>
          </P>
          <Note>
            If you see a blank page or get redirected, you are either not logged in or your email
            is not on the admin list.
          </Note>
        </div>

        {/* ── Dashboard ── */}
        <div className="bg-navy-800 border border-white/5 p-6 mb-2">
          <H2 id="dashboard">1. Dashboard</H2>
          <p className="text-[10px] text-slate-500 mb-3">/admin</p>
          <P>
            The first thing you see when you enter the admin panel. A live snapshot of the
            membership — nothing is editable here.
          </P>
          <Bullets items={[
            "Total members — everyone registered on the platform",
            "Professional+ members — professional, associate, and corporate tier combined",
            "Paid members — anyone who has completed a payment",
            "New this month — signups in the last 30 days",
            "Tier breakdown — percentage bars showing how members are distributed",
            "Recent signups — the last 8 people who joined, with their email, name, tier, and join date",
          ]} />
        </div>

        {/* ── Members ── */}
        <div className="bg-navy-800 border border-white/5 p-6 mb-2">
          <H2 id="members">2. Members</H2>
          <p className="text-[10px] text-slate-500 mb-3">/admin/members</p>
          <P>The full member database. Every registered user appears here.</P>

          <H3>What you can see</H3>
          <P>Email, full name, membership tier, country, discipline, organisation, topics of interest, join date, last activity.</P>

          <H3>What you can do</H3>
          <Bullets items={[
            <><strong className="text-white">Search</strong> — type any name, email, or organisation to filter the list.</>,
            <><strong className="text-white">Change a member&apos;s tier</strong> — click any member to open a drawer, choose the new tier, and save. Takes effect immediately.</>,
          ]} />

          <H3>When to use this</H3>
          <Bullets items={[
            "A member has paid outside the platform and needs their tier updated manually",
            "A member asks to be moved to a different tier",
            "You want to check who is active or look up a specific member",
          ]} />
        </div>

        {/* ── Content Generator ── */}
        <div className="bg-navy-800 border border-white/5 p-6 mb-2">
          <H2 id="generate">3. Content Generator</H2>
          <p className="text-[10px] text-slate-500 mb-3">/admin/generate</p>
          <P>
            An AI writing tool that creates draft articles and reports for Sanity CMS. The content
            is saved as a <strong className="text-white">draft</strong> — it does not go live until
            someone reviews and publishes it in Sanity Studio.
          </P>

          <H3>Content types</H3>
          <Table
            headers={["Type", "When to use"]}
            rows={[
              ["Editorial Insight", "Thought leadership, opinion pieces, commentary"],
              ["Research Report", "Data-driven briefs, technical summaries"],
              ["Publication", "Press releases, event summaries, op-eds, interviews"],
            ]}
          />

          <H3>How to generate content</H3>
          <Steps items={[
            "Choose a content type from the dropdown.",
            "Add a reference source — URL (paste a link and the system fetches the text), Paste Text (copy text directly), or Screenshot (upload an image of a document).",
            "Enter a topic — the subject of the piece.",
            "Enter an angle/focus — the specific argument or angle the piece should take.",
            "(Optional) Add key points — one point per line, things that must be covered.",
            "Click Generate.",
          ]} />

          <H3>What happens next</H3>
          <Bullets items={[
            "Claude writes the content and saves it as a draft in Sanity CMS.",
            "A hero image is generated in parallel.",
            "The result panel shows the title, a content preview, and the generated image.",
            "The draft appears in Sanity Studio under the relevant document type.",
            "Review, add the hero image, edit if needed, then publish.",
          ]} />

          <Note>
            The AI does not always get facts right. Always verify specific claims, statistics, and
            names before publishing. The generator is a starting point, not a final product.
          </Note>
        </div>

        {/* ── Content Studio ── */}
        <div className="bg-navy-800 border border-white/5 p-6 mb-2">
          <H2 id="content-studio">4. Content Studio</H2>
          <p className="text-[10px] text-slate-500 mb-3">/admin/content-studio</p>
          <P>Generates branded visual assets for social media, newsletters, and events.</P>

          <H3>Supported formats</H3>
          <Table
            headers={["Format", "Dimensions", "Use case"]}
            rows={[
              ["Event Banner", "1920×1080", "Website headers, email headers"],
              ["LinkedIn Post", "1200×627", "LinkedIn article covers"],
              ["Newsletter Header", "1200×400", "Email newsletter banners"],
              ["Research Cover", "800×1000", "Report and document covers"],
              ["Social Square", "1080×1080", "Instagram, general social"],
            ]}
          />

          <H3>How to generate an image</H3>
          <Steps items={[
            "Select a format — each preset shows the aspect ratio.",
            "Write a prompt — describe what you want. Quick suggestions appear for each format.",
            "Toggle Brand Context if you want navy and gold APRN branding in the image.",
            "Click Generate.",
          ]} />

          <H3>After generation</H3>
          <Bullets items={[
            "Download saves the image to your computer.",
            "Save to Library uploads it to the Document Library where it persists permanently.",
          ]} />

          <Note>
            Images on Fal.ai expire after 24 hours. If you plan to use an image, save it to your
            computer or the library immediately. Each generation costs approximately $0.05.
          </Note>
        </div>

        {/* ── Weekly Report ── */}
        <div className="bg-navy-800 border border-white/5 p-6 mb-2">
          <H2 id="weekly-report">5. Weekly Report</H2>
          <p className="text-[10px] text-slate-500 mb-3">/admin/weekly-report</p>
          <P>
            Sends a weekly update email to members and stakeholders via Resend (the
            platform&apos;s email provider).
          </P>
          <Bullets items={[
            "The list shows past reports with subject line, send date, and who sent it.",
            "Click to compose a new report — Claude generates the content based on recent platform activity.",
            "Review and edit the generated content before sending.",
            "Sent reports are logged and visible in the list.",
          ]} />
          <Note>
            The recipient list is configured in the codebase. To change who receives the report,
            ask Joseph.
          </Note>
        </div>

        {/* ── Outreach ── */}
        <div className="bg-navy-800 border border-white/5 p-6 mb-2">
          <H2 id="outreach">6. Outreach</H2>
          <P>Two tools: Campaigns for sending emails, AI Research for finding contacts.</P>

          <H3 id="outreach-campaigns">Campaigns — /admin/outreach</H3>
          <P>
            Manages targeted email campaigns to pipeline professionals outside the APRN membership.
          </P>
          <P>
            The campaign list shows each campaign&apos;s name, status (Draft / Ready / Sending /
            Sent), recipient count, and creation date.
          </P>

          <p className="text-xs font-semibold text-slate-300 mb-2 mt-4">To create a campaign:</p>
          <Steps items={[
            "Click New Campaign.",
            "Enter a campaign name and goal.",
            "Choose the type: General (same email to everyone) or Personalized (unique email per recipient).",
            "Add a subject line and email template.",
          ]} />

          <p className="text-xs font-semibold text-slate-300 mb-2 mt-4">Inside a campaign:</p>
          <Bullets items={[
            "Recipients are grouped by type: Pipeline Engineers, Pipeline Operators, EPC Contractors, Regulators/Associations.",
            "Preview — see how the email looks before sending.",
            "Send — dispatches to all recipients. Status updates to Sent.",
            "Recipient statuses track through: Pending → Sent → Opened / Bounced / Replied / No Email",
          ]} />

          <H3 id="outreach-research">AI Research — /admin/outreach/research</H3>
          <P>Uses Claude to suggest contacts for outreach campaigns — people not currently in your database.</P>

          <p className="text-xs font-semibold text-slate-300 mb-2 mt-4">How it works:</p>
          <Steps items={[
            "Write a research brief describing who you are looking for (e.g. \"Pipeline integrity engineers in East Africa with LNG experience\").",
            "Select the target table — which database table to add accepted contacts to.",
            "Select how many suggestions you want (3, 5, 8, or 10).",
            "Click Research.",
          ]} />

          <p className="text-xs font-semibold text-slate-300 mb-2 mt-4">Reviewing suggestions:</p>
          <Bullets items={[
            "Edit — correct any fields before accepting.",
            "Accept — adds the contact to the selected database table.",
            "Reject — discards the suggestion.",
          ]} />

          <Note>
            Claude may generate plausible but invented contacts. Always verify names and
            organisations via LinkedIn before sending outreach emails.
          </Note>
        </div>

        {/* ── Strategy Portal ── */}
        <div className="bg-navy-800 border border-white/5 p-6 mb-2">
          <H2 id="strategy">7. Strategy Portal</H2>
          <P>Three tools for managing APRN&apos;s strategic operations.</P>

          <H3 id="strategy-stakeholders">Stakeholder Map — /admin/strategy/stakeholders</H3>
          <P>
            A stakeholder management system with a visual influence/interest matrix. Stakeholders
            are plotted by how much influence they hold and how interested they are in APRN.
          </P>
          <Bullets items={[
            "Filter by stakeholder type using the tabs: Internal, Government, Partners, Funders, Industry, Associations, Media, WIMEE.",
            "Update last contact date — click the date field after any meeting or call.",
            "Add notes — click the notes field to record what was discussed.",
            "Generate Engagement Brief — click any stakeholder for a Claude-generated brief with recommended talking points.",
          ]} />
          <Note>Keep last contact dates current. It shows which relationships are going cold.</Note>

          <H3 id="strategy-documents">Document Library — /admin/strategy/documents</H3>
          <P>Central storage for strategy documents, presentations, reports, and research files.</P>
          <P>Supported file types: PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx), HTML</P>

          <p className="text-xs font-semibold text-slate-300 mb-2 mt-4">To upload a document:</p>
          <Steps items={[
            "Click Upload.",
            "Select your file.",
            "Fill in the metadata: display name, version, date, category, description, and internal notes.",
            "Click Save.",
          ]} />

          <p className="text-xs font-semibold text-slate-300 mb-2 mt-4">What you can do with existing documents:</p>
          <Table
            headers={["Action", "What it does"]}
            rows={[
              ["View", "Opens the document in the browser."],
              ["Download", "Generates a 1-hour download link."],
              ["Summarise (AI)", "Claude reads the document and writes a brief summary."],
              ["AI Edit", "HTML documents only — describe a change in plain English and Claude applies it."],
              ["Edit metadata", "Update name, version, date, notes, or category."],
              ["Delete", "Removes the file from storage permanently. Cannot be undone."],
            ]}
          />

          <H3 id="strategy-communication">Communication Strategy — /admin/strategy/communication</H3>
          <P>Manages APRN&apos;s communication plan — channels, stakeholders, approval process, and content calendar.</P>
          <Bullets items={[
            "Channel Strategy — one card per channel (WhatsApp, LinkedIn, Website, Newsletter, Email, Webinars). Click any card to update frequency, content types, audience, and owner.",
            "WhatsApp Groups — tracked separately with group name, member count, manager, and last broadcast date.",
            "Approval Process — the 4-step content flow: Create → Review → Approve → Publish.",
            "Communication Calendar — a 4-week rolling plan. Add, edit, or delete items week by week. Changes save immediately.",
          ]} />
        </div>

        {/* ── Personnel ── */}
        <div className="bg-navy-800 border border-white/5 p-6 mb-2">
          <H2 id="personnel">8. Personnel Documents</H2>
          <p className="text-[10px] text-slate-500 mb-3">/admin/personnel</p>
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-lock text-[11px] text-gold-500" />
            <span className="text-xs text-gold-500 font-semibold">Restricted to Lucy Okeke and Joseph Agwuh only</span>
          </div>
          <P>Storage for confidential team documents — contracts, personnel files, internal records.</P>
          <P>Supported file types: PDF, Word, PowerPoint, Excel, TXT</P>

          <H3>To upload</H3>
          <Steps items={[
            "Click Upload.",
            "Select a file.",
            "Add metadata: display name, person (who it relates to), description, version, date.",
            "Click Save.",
          ]} />

          <H3>Accessing documents</H3>
          <Bullets items={[
            "Download — generates a 1-hour secure download link. The link requires admin login and cannot be shared publicly.",
            "Delete — removes the file permanently.",
          ]} />
          <Note>
            All files are in private cloud storage and are not accessible from any other part of
            the platform.
          </Note>
        </div>

        {/* ── Quick Reference ── */}
        <div className="bg-navy-800 border border-white/5 p-6 mb-2">
          <H2 id="quick-reference">Quick Reference</H2>
          <Table
            headers={["Task", "Where to go"]}
            rows={[
              ["See how many members we have", "/admin"],
              ["Change a member's tier", "/admin/members → click the member"],
              ["Write a draft article", "/admin/generate"],
              ["Generate a social image", "/admin/content-studio"],
              ["Send a weekly email update", "/admin/weekly-report"],
              ["Create an outreach campaign", "/admin/outreach"],
              ["Find new contacts with AI", "/admin/outreach/research"],
              ["Update stakeholder notes", "/admin/strategy/stakeholders"],
              ["Upload a strategy document", "/admin/strategy/documents"],
              ["Update the comms calendar", "/admin/strategy/communication"],
              ["Access personnel files", "/admin/personnel (Lucy & Joseph only)"],
            ]}
          />
        </div>

        {/* ── FAQ ── */}
        <div className="bg-navy-800 border border-white/5 p-6 mb-2">
          <H2 id="faq">Common Questions</H2>

          <H3>I generated content but can&apos;t find it in Sanity Studio.</H3>
          <P>
            Content is saved as a draft. In Sanity Studio, make sure you are viewing
            Drafts not Published. It will appear there under the document type you selected.
          </P>

          <H3>The URL input on the Content Generator didn&apos;t work.</H3>
          <P>
            Some websites block automated fetches. If you see a warning that the URL failed,
            switch to Paste Text and copy the article text manually.
          </P>

          <H3>I deleted a document from the Document Library but the card is still showing.</H3>
          <P>
            Try refreshing the page. The delete removes the file from storage and the database in
            one step. If the card persists after a fresh load, flag it to Joseph.
          </P>

          <H3>A recipient in my outreach campaign shows &quot;No Email&quot;.</H3>
          <P>
            The contact is in the database but has no email address recorded. Source the email and
            update the record in the Database section, or exclude that contact from the campaign.
          </P>

          <H3>I want to change who receives the weekly report.</H3>
          <P>This is configured in the codebase. Ask Joseph to update the recipient list.</P>
        </div>

      </div>
    </div>
  );
}
