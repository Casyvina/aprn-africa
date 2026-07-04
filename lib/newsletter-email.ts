import type { NewsletterIssue, NewsletterStory } from "@/lib/queries/newsletter";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function sanityImg(url: string, w: number, h: number): string {
  return `${url}?w=${w}&h=${h}&fit=crop&auto=format`;
}

const TAG_CHIP =
  "display:inline-block;background:#D4A017;color:#071B2A;font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;padding:3px 8px;";

function sourceLink(url: string | undefined): string {
  if (!url) return "";
  return `<a href="${esc(url)}" style="display:inline-block;margin-top:10px;font-size:11px;color:#D4A017;text-decoration:none;text-transform:uppercase;letter-spacing:0.1em;">Source &rarr;</a>`;
}

function gridCard(s: NewsletterStory): string {
  const media = s.imageUrl
    ? `<img src="${sanityImg(s.imageUrl, 552, 310)}" width="274" alt="${esc(s.imageAlt ?? s.headline)}" style="display:block;width:100%;height:auto;border:0;" />`
    : `<div style="height:3px;background:#D4A017;font-size:0;line-height:0;">&nbsp;</div>`;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#071B2A;border:1px solid #15324A;">
      <tr><td>${media}</td></tr>
      <tr>
        <td style="padding:16px 18px 20px;">
          <span style="${TAG_CHIP}margin-bottom:10px;">${esc(s.tag)}</span>
          <h3 style="margin:10px 0 8px;font-family:Georgia,serif;font-size:17px;color:#ffffff;line-height:1.35;">${esc(s.headline)}</h3>
          <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">${esc(s.summary)}</p>
          ${sourceLink(s.sourceUrl)}
        </td>
      </tr>
    </table>`;
}

function wideCard(s: NewsletterStory): string {
  const media = s.imageUrl
    ? `<td class="stack" width="176" valign="top">
         <img src="${sanityImg(s.imageUrl, 352, 352)}" width="176" alt="${esc(s.imageAlt ?? s.headline)}" style="display:block;width:100%;height:auto;border:0;" />
       </td>`
    : "";
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#071B2A;border:1px solid #15324A;">
      <tr>
        ${media}
        <td class="stack" valign="top" style="padding:16px 18px 20px;">
          <span style="${TAG_CHIP}margin-bottom:10px;">${esc(s.tag)}</span>
          <h3 style="margin:10px 0 8px;font-family:Georgia,serif;font-size:17px;color:#ffffff;line-height:1.35;">${esc(s.headline)}</h3>
          <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">${esc(s.summary)}</p>
          ${sourceLink(s.sourceUrl)}
        </td>
      </tr>
    </table>`;
}

function storyGrid(stories: NewsletterStory[]): string {
  const rows: string[] = [];
  const pairs = Math.floor(stories.length / 2);
  for (let i = 0; i < pairs * 2; i += 2) {
    rows.push(`
      <tr>
        <td class="stack gap-r" width="50%" valign="top" style="padding:0 12px 24px 0;">${gridCard(stories[i])}</td>
        <td class="stack gap-l" width="50%" valign="top" style="padding:0 0 24px 12px;">${gridCard(stories[i + 1])}</td>
      </tr>`);
  }
  if (stories.length % 2 === 1) {
    rows.push(`
      <tr>
        <td colspan="2" style="padding:0 0 24px;">${wideCard(stories[stories.length - 1])}</td>
      </tr>`);
  }
  return rows.join("");
}

export function buildNewsletterHtml(issue: NewsletterIssue, siteUrl: string): string {
  const issueLabel = `Vol. ${issue.volume}, Issue ${String(issue.issueNumber).padStart(3, "0")}`;
  const issueUrl   = `${siteUrl}/newsletter/${issue.slug}`;
  const dateLine   = new Date(issue.publishDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const [lead, ...rest] = issue.stories;

  const heroHtml = issue.heroImageUrl
    ? `<tr><td style="background:#0D2436;">
         <img src="${sanityImg(issue.heroImageUrl, 1280, 640)}" width="640" alt="${esc(issue.heroImageAlt ?? issue.title)}" style="display:block;width:100%;height:auto;border:0;" />
       </td></tr>`
    : "";

  const leadImageHtml = lead?.imageUrl
    ? `<img src="${sanityImg(lead.imageUrl, 1152, 648)}" width="576" alt="${esc(lead.imageAlt ?? lead.headline)}" style="display:block;width:100%;height:auto;border:0;margin-bottom:20px;" />`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(issue.title)}</title>
<style>
  @media only screen and (max-width: 600px) {
    .stack { display: block !important; width: 100% !important; }
    .gap-r { padding-right: 0 !important; }
    .gap-l { padding-left: 0 !important; }
    .sm-pad { padding-left: 20px !important; padding-right: 20px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#071B2A;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${esc(issue.leadSummary)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#071B2A;">
    <tr><td align="center" style="padding:40px 12px;">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;">

        <!-- Masthead -->
        <tr>
          <td class="sm-pad" style="background:#0D2436;border-bottom:3px solid #D4A017;padding:32px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:10px;color:#D4A017;text-transform:uppercase;letter-spacing:0.3em;">Africa's Pipeline Intelligence Weekly</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:34px;color:#ffffff;font-weight:700;">APRN Intelligence Briefing</h1>
            <p style="margin:8px 0 0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.15em;">${issueLabel}</p>
          </td>
        </tr>

        <!-- Dateline -->
        <tr>
          <td class="sm-pad" style="background:#D4A017;padding:10px 40px;">
            <p style="margin:0;font-size:11px;color:#071B2A;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;">${issueLabel} &middot; ${dateLine} &middot; ${issue.stories.length} Stories</p>
          </td>
        </tr>

        ${heroHtml}

        <!-- Lead summary -->
        <tr>
          <td class="sm-pad" style="background:#0D2436;padding:28px 32px;border-bottom:1px solid #15324A;">
            <p style="margin:0;font-size:15px;color:#cbd5e1;line-height:1.7;">${esc(issue.leadSummary)}</p>
          </td>
        </tr>

        <!-- Lead story -->
        ${lead ? `
        <tr>
          <td class="sm-pad" style="background:#0D2436;padding:28px 32px 32px;border-bottom:1px solid #15324A;">
            <p style="margin:0 0 16px;font-size:10px;color:#D4A017;text-transform:uppercase;letter-spacing:0.2em;">Lead Story</p>
            ${leadImageHtml}
            <span style="${TAG_CHIP}">${esc(lead.tag)}</span>
            <h2 style="margin:12px 0 10px;font-family:Georgia,serif;font-size:24px;color:#ffffff;line-height:1.3;">${esc(lead.headline)}</h2>
            <p style="margin:0;font-size:14px;color:#94a3b8;line-height:1.7;">${esc(lead.summary)}</p>
            ${sourceLink(lead.sourceUrl)}
          </td>
        </tr>` : ""}

        <!-- Story grid -->
        ${rest.length > 0 ? `
        <tr>
          <td class="sm-pad" style="background:#0D2436;padding:28px 32px 8px;">
            <p style="margin:0 0 16px;font-size:10px;color:#D4A017;text-transform:uppercase;letter-spacing:0.2em;">In This Issue</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${storyGrid(rest)}
            </table>
          </td>
        </tr>` : ""}

        <!-- Editor's Analysis -->
        <tr>
          <td class="sm-pad" style="background:#15324A;padding:32px;border-top:2px solid #D4A017;">
            <p style="margin:0 0 12px;font-size:10px;color:#D4A017;text-transform:uppercase;letter-spacing:0.2em;">Editor's Analysis</p>
            ${issue.pullQuote ? `<p style="margin:0 0 16px;font-family:Georgia,serif;font-size:20px;color:#ffffff;font-style:italic;line-height:1.5;">&ldquo;${esc(issue.pullQuote)}&rdquo;</p>` : ""}
            <p style="margin:0;font-size:14px;color:#cbd5e1;line-height:1.7;">${esc(issue.editorAnalysis).replace(/\n/g, "<br>")}</p>
            <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;">&mdash; Lucy Okeke, Founder &amp; Executive Director, APRN</p>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="background:#071B2A;padding:32px;text-align:center;border-top:1px solid #15324A;">
            <a href="${issueUrl}" style="display:inline-block;background:#D4A017;color:#071B2A;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;padding:14px 32px;text-decoration:none;">Read Full Issue Online &rarr;</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#071B2A;padding:24px 32px 8px;border-top:1px solid #15324A;text-align:center;">
            <p style="margin:0 0 8px;font-size:11px;color:#64748b;">African Pipeline Resource Network &middot; <a href="${siteUrl}" style="color:#D4A017;text-decoration:none;">aprn-africa.org</a></p>
            <p style="margin:0 0 8px;font-size:10px;color:#475569;">You received this because you subscribed to the APRN Intelligence Briefing.</p>
            <p style="margin:0;font-size:10px;color:#475569;"><a href="mailto:info@aprn-africa.org?subject=Unsubscribe" style="color:#64748b;text-decoration:underline;">Unsubscribe</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildNewsletterText(issue: NewsletterIssue, siteUrl: string): string {
  const issueLabel = `Vol. ${issue.volume}, Issue ${String(issue.issueNumber).padStart(3, "0")}`;
  const issueUrl   = `${siteUrl}/newsletter/${issue.slug}`;
  const dateLine   = new Date(issue.publishDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const stories = issue.stories
    .map((s, i) => {
      const lines = [`${i + 1}. [${s.tag.toUpperCase()}] ${s.headline}`, s.summary];
      if (s.sourceUrl) lines.push(`Source: ${s.sourceUrl}`);
      return lines.join("\n");
    })
    .join("\n\n");

  return [
    "APRN INTELLIGENCE BRIEFING",
    `${issueLabel} · ${dateLine} · ${issue.stories.length} stories`,
    "",
    issue.leadSummary,
    "",
    stories,
    "",
    "EDITOR'S ANALYSIS",
    issue.pullQuote ? `"${issue.pullQuote}"` : "",
    issue.editorAnalysis,
    "— Lucy Okeke, Founder & Executive Director, APRN",
    "",
    `Read online: ${issueUrl}`,
    "Unsubscribe: reply with subject \"Unsubscribe\" or email info@aprn-africa.org",
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}
