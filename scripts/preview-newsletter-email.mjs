import { writeFileSync, readFileSync } from "node:fs";

const src = readFileSync("lib/newsletter-email.ts", "utf8")
  .replace(/^import type .*$/m, "")
  .replace(/(function sanityImg\(url)(: string)(, w)(: number)(, h)(: number)\)(: string)/, "$1$3$5)")
  .replace(/(function esc\(s)(: string)\)(: string)/, "$1)")
  .replace(/(function sourceLink\(url)(: string \| undefined)\)(: string)/, "$1)")
  .replace(/(function gridCard\(s)(: NewsletterStory)\)(: string)/, "$1)")
  .replace(/(function wideCard\(s)(: NewsletterStory)\)(: string)/, "$1)")
  .replace(/(function storyGrid\(stories)(: NewsletterStory\[\])\)(: string)/, "$1)")
  .replace(/(const rows)(: string\[\])/, "$1")
  .replace(/(issue)(: NewsletterIssue)(, siteUrl)(: string)\)(: string)/g, "$1$3)");
writeFileSync(".preview-email-bundle.mjs", src);
const { buildNewsletterHtml, buildNewsletterText } = await import("../.preview-email-bundle.mjs");

const img = (id) => `https://picsum.photos/id/${id}/1200/675`;

const issue = {
  _id: "test",
  slug: "vol-1-issue-004",
  title: "Lagos-Calabar Momentum & the AKK Endgame",
  volume: 1,
  issueNumber: 4,
  publishDate: "2026-07-01",
  leadSummary:
    "AKK enters its final commissioning phase as NNPC confirms gas-in dates, EACOP clears its last Tanzanian land corridor, and new FID signals emerge from the Nigeria-Morocco feasibility consortium.",
  heroImageUrl: img(1041),
  heroImageAlt: "Pipeline corridor aerial",
  stories: [
    { tag: "AKK Pipeline", headline: "AKK Commissioning Window Confirmed for Q4 as Kaduna Segment Passes Hydrotest", summary: "NNPC engineers completed hydrostatic testing on the 200km Kaduna-Kano segment this week, clearing the final technical hurdle before line-fill. Gas-in is now targeted for November.", sourceUrl: "https://example.com/1", imageUrl: img(1056), imageAlt: "Pipeline construction" },
    { tag: "EACOP", headline: "Tanzania Clears Final Land Corridor; Coating Plant Hits Full Capacity", summary: "The last 47 project-affected households in the Tanga corridor have been compensated and resettled, closing the land acquisition chapter after four years.", sourceUrl: "https://example.com/2", imageUrl: img(1043), imageAlt: "East African corridor" },
    { tag: "Policy", headline: "NMDPRA Publishes Draft Third-Party Access Rules for Gas Transport Networks", summary: "The new framework would require open-access tariff publication for all transport pipelines above 12 inches, a significant shift for private operators.", sourceUrl: "https://example.com/3" },
    { tag: "Nigeria-Morocco", headline: "Feasibility Consortium Signals Phase-One FID Package for 2027", summary: "The 5,600km offshore route's first segment — Nigeria to Ghana — now has a defined engineering package and preliminary financing structure led by IsDB.", sourceUrl: "https://example.com/4", imageUrl: img(1015), imageAlt: "Offshore route" },
    { tag: "Training", headline: "APRN Pipeline Integrity Masterclass Opens September Cohort", summary: "Applications are open for the 6-week integrity management programme, delivered with EITEP. Early registration closes August 15.", imageUrl: img(1076), imageAlt: "Training cohort" },
  ],
  editorAnalysis:
    "Three of the continent's four flagship corridors moved forward in the same fortnight — that has not happened since 2022.\nThe signal is financing confidence, not construction coincidence. Watch the tariff rules: third-party access will decide whether AKK becomes a network or a pipe.",
  pullQuote: "Third-party access will decide whether AKK becomes a network or a pipe.",
  status: "approved",
};

writeFileSync("newsletter-preview.html", buildNewsletterHtml(issue, "https://aprn-africa.org"));
writeFileSync("newsletter-preview.txt", buildNewsletterText(issue, "https://aprn-africa.org"));
console.log("Wrote newsletter-preview.html / .txt");
