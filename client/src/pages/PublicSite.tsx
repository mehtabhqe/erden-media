import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

const nav = [
  ["Services", "/services"],
  ["Portfolio", "/portfolio"],
  ["Case studies", "/case-studies"],
  ["Notes", "/blog"],
  ["About", "/about"],
  ["Retainer calculator", "/tools/roi-calculator"],
  ["Contact", "/contact"],
] as const;

const serviceGroups = [
  { eyebrow: "01 / Client operations", title: "The work that keeps the room moving.", links: ["Client workspaces", "Content approvals", "Campaign operations", "Task and calendar control"] },
  { eyebrow: "02 / Growth systems", title: "The signal that turns activity into momentum.", links: ["Social media management", "PR & media outreach", "Creator partnerships", "Analytics and reporting"] },
];

const articles = [
  ["Operating notes", "How to build a content approval system clients actually use", "A practical framework for fewer follow-ups, clearer handoffs, and a better client experience."],
  ["Campaign systems", "The small agency dashboard that replaces seven open tabs", "What to centralize first when the work lives across chats, sheets, and scattered folders."],
  ["Agency growth", "From one-off deliverables to a repeatable retainer engine", "A field guide to making strategy, execution, and reporting compound month after month."],
];

export default function PublicSite({ page = "home" }: { page?: string }) {
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const isHome = page === "home";
  const title = page === "services" ? "Everything your agency needs to run the work." : page === "portfolio" ? "A clear view of the work in motion." : page === "case-studies" ? "The systems behind the campaigns." : page === "blog" ? "Operating notes for modern agencies." : page === "about" ? "Built for the people doing the work." : page === "roi" ? "Know what your retainer should return." : page === "contact" ? "Start a better operating rhythm." : page === "free-audit" ? "Find the leaks before they cost you another month." : "Run the work. See the signal. Keep the momentum.";

  return <div className="public-site">
    <header className="public-header"><Link href="/" className="public-brand"><span className="public-brand-mark">AO</span><span>AGENCYOS</span></Link><nav className={`public-nav ${menuOpen ? "public-nav--open" : ""}`}>{nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}<Link href="/contact" className="public-nav-cta" onClick={() => setMenuOpen(false)}>Start a conversation <ArrowRight size={14} /></Link></nav><button className="public-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></header>

    {isHome ? <>
      <section className="public-hero"><div className="public-eyebrow">AGENCY OPERATIONS · SOCIAL · PR · CREATIVE</div><h1>Run the work.<br /><i>See the signal.</i><br />Keep the momentum.</h1><p>AgencyOS brings client operations, content, campaigns, approvals, outreach, reporting, and revenue into one clear operating rhythm.</p><div className="public-actions"><Link className="public-button public-button--dark" href="/free-audit">See how it works <ArrowRight size={15} /></Link><Link className="public-button" href="/services">Explore services <ArrowRight size={15} /></Link></div><div className="public-positioning"><span>POSITIONING</span><strong>One operating layer for ambitious agencies who are done piecing the work together.</strong></div></section>
      <MetricBand />
      <section className="public-proofline"><span>Built around the rhythm of the work</span><div className="proof-names"><b>CLIENTS</b><b>CAMPAIGNS</b><b>CONTENT</b><b>MEDIA</b><b>REPORTS</b><b>RETAINERS</b></div></section>
      <ServicesSection />
      <section className="public-section public-difference"><div className="section-kicker">03 · Why AgencyOS</div><h2>Everything in view.<br /><i>Nothing lost in the gaps.</i></h2><div className="difference-grid">{[["01", "One source of truth", "Clients, campaigns, content, and cash share the same operational record."], ["02", "Built for approvals", "Turn waiting into a visible workflow with clear owners and next moves."], ["03", "Results in the room", "Make performance, coverage, and revenue part of the everyday view."], ["04", "Made to compound", "Repeatable systems help the team do better work without adding more tabs."]].map(([n, t, d]) => <div key={n} className="difference-card"><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>
      <FeaturedSection />
      <ProcessSection />
      <NotesSection />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <ContactSection />
    </> : <InteriorPage page={page} title={title} />}

    <footer className="public-footer"><div className="public-brand"><span className="public-brand-mark">AO</span><span>AGENCYOS</span></div><div className="footer-links">{nav.slice(0, 5).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div><span>© 2026 AgencyOS</span></footer>
  </div>;
}

function MetricBand() { return <section className="metric-band"><div><strong>01</strong><span>operating layer</span></div><div><strong>08</strong><span>core workflows</span></div><div><strong>24</strong><span>active accounts</span></div><div><strong>01</strong><span>clear desk</span></div></section>; }
function ServicesSection() { return <section className="public-section"><div className="section-kicker">02 · What we manage</div><div className="section-title-row"><h2>Two systems.<br /><i>One accountable desk.</i></h2><Link href="/services" className="text-link">All services <ArrowRight size={14} /></Link></div><div className="service-grid">{serviceGroups.map((group) => <div className="service-card" key={group.eyebrow}><span className="service-eyebrow">{group.eyebrow}</span><h3>{group.title}</h3><div>{group.links.map((link) => <Link href="/services" key={link}>{link}<ArrowRight size={14} /></Link>)}</div></div>)}</div></section>; }
function FeaturedSection() { return <section className="public-section featured-section"><div className="section-kicker">04 · Featured account</div><div className="featured-grid"><div><h2>From scattered handoffs to a system the whole team can see.</h2><p>One agency used AgencyOS to bring client workspaces, content approvals, campaign tracking, and monthly reporting into a single operating layer.</p><Link href="/case-studies" className="text-link">Read the account story <ArrowRight size={14} /></Link></div><div className="featured-visual"><img src="/manus-storage/agencyos-campaign-collage_9a528ba5.png" alt="Campaign planning collage" /><div><strong>01</strong><span>workspace<br />in motion</span></div></div></div></section>; }
function ProcessSection() { return <section className="public-section process-section"><div className="section-kicker">05 · The rhythm</div><h2>Four steps to a system<br /><i>that compounds.</i></h2><div className="process-grid">{[["01", "See", "Map the clients, campaigns, approvals, and leaks across the current operation."], ["02", "Shape", "Define the structure: what belongs together, what needs an owner, what moves next."], ["03", "Run", "Bring the team into one operating desk and make the work visible in real time."], ["04", "Compound", "Use the record to improve strategy, reporting, and the quality of every retainer."]].map(([n, t, d]) => <div key={n} className="process-item"><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>; }
function NotesSection() { return <section className="public-section notes-section"><div className="section-title-row"><div><div className="section-kicker">06 · Field notes</div><h2>Playbooks,<br /><i>not platitudes.</i></h2></div><Link href="/blog" className="text-link">All notes <ArrowRight size={14} /></Link></div><div className="notes-grid">{articles.map(([category, title, desc]) => <Link href="/blog" className="note-card" key={title}><span>{category}</span><h3>{title}</h3><p>{desc}</p><small>08 min read <ArrowRight size={13} /></small></Link>)}</div></section>; }
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (value: number | null) => void }) { const faqs = [["How does AgencyOS fit into an existing agency stack?", "It becomes the operational layer: the place where the team sees what is happening, who owns it, and what should move next."], ["Is this for an agency of one or a larger team?", "The structure works for a solo operator, a small specialist studio, or a growing full-service team with more roles and handoffs."], ["Can clients access their own workspace?", "Yes. Client-facing approvals, calendars, reports, and files are designed as the next layer on top of the internal desk."], ["What should we connect first?", "Start with clients, campaigns, content approvals, tasks, and invoices. Those records create the fastest operational signal."]]; return <section className="public-section faq-section"><div className="section-kicker">07 · Questions</div><h2>Useful answers<br /><i>before the first move.</i></h2><div className="faq-list">{faqs.map(([q, a], index) => <div className={`faq-item ${openFaq === index ? "faq-item--open" : ""}`} key={q}><button onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{q}</span><ChevronDown size={17} /></button>{openFaq === index && <p>{a}</p>}</div>)}</div></section>; }
function ContactSection() { return <section className="public-contact"><div><div className="section-kicker">08 · Start here</div><h2>Make the next month<br /><i>easier to run.</i></h2><p>Tell us what is currently spread across chats, sheets, folders, and dashboards. We will help you find the first system worth connecting.</p></div><form onSubmit={(event) => { event.preventDefault(); alert("Thanks — the AgencyOS team will follow up shortly."); }}><label>Name<input required placeholder="Your name" /></label><label>Work email<input required type="email" placeholder="you@agency.com" /></label><label>What needs connecting?<textarea required placeholder="Clients, content, campaigns, reporting..." /></label><button className="public-button public-button--dark" type="submit">Send the request <ArrowRight size={15} /></button></form></section>; }
function InteriorPage({ page, title }: { page: string; title: string }) { return <main className="public-interior"><div className="section-kicker">AgencyOS / {page.replaceAll("-", " ")}</div><h1>{title}</h1><p className="interior-lede">A restrained public layer for an operating system built around the real work of modern agencies.</p><div className="interior-grid">{(page === "services" ? serviceGroups.flatMap((group) => group.links) : page === "blog" ? articles.map((article) => article[1]) : ["Client operations", "Campaign intelligence", "Content systems", "Approvals and reporting", "PR and creator workflows", "Retainer visibility"]).map((item, index) => <div className="interior-card" key={item}><span>{String(index + 1).padStart(2, "0")}</span><h2>{item}</h2><p>See how this part of the AgencyOS system brings clarity to the next move.</p><Link href="/contact" className="text-link">Talk to us <ArrowRight size={14} /></Link></div>)}</div></main>; }
