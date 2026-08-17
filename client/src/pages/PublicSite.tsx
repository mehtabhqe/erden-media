import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, ChevronDown, Instagram, Linkedin, Menu, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

const nav = [
  ["Services", "/services"],
  ["Our work", "/portfolio"],
  ["About", "/about"],
  ["Insights", "/blog"],
  ["Contact", "/contact"],
] as const;

const serviceGroups = [
  { eyebrow: "01 / Brand presence", title: "Make the first impression do more.", links: ["Websites & landing pages", "Personal branding", "Brand identity direction", "Portfolio and profile systems"] },
  { eyebrow: "02 / Visibility & influence", title: "Stay visible for the right reasons.", links: ["Social media management", "Content strategy and production", "Public relations", "Influencer and creator campaigns"] },
];

const articles = [
  ["Personal brand", "Why your online presence should feel like you before you say a word", "A practical guide to turning your point of view, proof, and personality into a recognisable presence."],
  ["Social media", "What makes a social media presence feel alive", "The difference between posting more and building a content rhythm people remember."],
  ["Public relations", "The story is only useful when it travels", "How strong positioning, timely pitching, and consistent visibility work together."],
] as const;

const workItems = [
  ["Brand presence", "Zumorrud", "A considered brand and digital presence built to make Zumorrud easier to understand, remember, and choose.", "Strategy · Website · Social"],
  ["Growth system", "Neurovia Nexus Private Limited", "A clearer communications system for a company with ambitious work and a need to translate its value into a stronger public presence.", "Positioning · Content · Visibility"],
  ["Retail presence", "Fowalk Footwear", "A footwear brand story designed to connect product, everyday style, and the confidence that makes a pair worth coming back to.", "Brand story · Social · Campaigns"],
] as const;

const workStories: Record<string, { kicker: string; headline: string; overview: string; challenge: string; approach: string; outcome: string; services: string[] }> = {
  Zumorrud: {
    kicker: "Brand presence / Selected work",
    headline: "Making Zumorrud easier to discover, understand, and remember.",
    overview: "Zumorrud came to the work with the kind of opportunity many growing businesses know well: the work had its own character, but the public-facing story needed to catch up. Our role was to bring that character into a clearer, more consistent presence across the places where people first encounter the company.",
    challenge: "The challenge was not simply to make the brand look better. It was to make the value of Zumorrud easier to read at a glance, while keeping the personality that makes the company feel human. The brand needed a sharper introduction, a more confident digital home, and content that could keep the conversation moving after the first impression.",
    approach: "We shaped the work around a simple system: clarify the central story, give the visual language room to breathe, and create repeatable content directions rather than isolated posts. The website and social touchpoints were treated as one connected experience, with the same tone, hierarchy, and cues carrying through from the first scroll to the next conversation.",
    outcome: "The result was a more coherent public presence for Zumorrud: clearer in its introduction, more consistent in its expression, and better prepared to turn attention into genuine interest. Instead of asking every touchpoint to explain the company from scratch, the new system gave the brand a recognisable way to show up and build familiarity over time.",
    services: ["Brand positioning", "Website direction", "Social content system", "Ongoing visibility"],
  },
  "Neurovia Nexus Private Limited": {
    kicker: "Growth system / Selected work",
    headline: "Turning complex value into a public story people can follow.",
    overview: "Neurovia Nexus Private Limited operates in a space where the work can be meaningful and ambitious, but the story can quickly become difficult to communicate. We worked on the layer between the company’s capability and the audience’s understanding: the language, structure, and visual direction that make a serious business feel clear without flattening what makes it different.",
    challenge: "The central challenge was translation. Strong work can still be overlooked when the website, content, and public messaging speak in separate voices. Neurovia Nexus needed a clearer way to introduce its value, organise its ideas, and build confidence with the people it wanted to reach.",
    approach: "We built the communications around a stronger point of view and a more deliberate rhythm. The work connected positioning with content planning, turned important ideas into accessible narratives, and created a foundation that could support future campaigns, partnerships, and conversations. Every piece was designed to answer the same question: why does this matter, and why now?",
    outcome: "Neurovia Nexus left with a more legible public presence and a communications foundation that could grow with the company. The work made the brand easier to enter, easier to explain, and more equipped to build recognition through consistent, useful visibility rather than one-off noise.",
    services: ["Positioning direction", "Narrative development", "Content strategy", "Public visibility"],
  },
  "Fowalk Footwear": {
    kicker: "Retail presence / Selected work",
    headline: "Giving Fowalk Footwear a story that feels as good as the product.",
    overview: "Fowalk Footwear is in a category where people make quick decisions with their eyes before they make them with their feet. We worked on the story around the product: the visual world, the everyday context, and the small details that help a footwear brand feel relevant, dependable, and worth remembering.",
    challenge: "The opportunity was to move beyond product-only communication. Footwear is functional, but the strongest brands also sell a feeling: confidence on the move, a dependable choice for everyday life, or a point of view about personal style. Fowalk needed a way to show both the product and the life around it.",
    approach: "We developed a content and campaign direction that put the shoes into real moments instead of treating each product as an isolated catalogue item. Product storytelling, social formats, and campaign language worked together to make the brand more immediate, while keeping the focus on wearability, character, and the reasons someone would choose Fowalk again.",
    outcome: "The result was a more inviting brand story for Fowalk Footwear: product-led, but never product-only. The company gained a clearer platform for social communication and campaigns, giving future launches and everyday content a consistent world to build from.",
    services: ["Brand story", "Campaign direction", "Social content", "Product visibility"],
  },
};

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function PublicSite({ page = "home", slug }: { page?: string; slug?: string }) {
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const isHome = page === "home";
  const title = page === "services" ? "Ideas, identity, and visibility — made to move." : page === "portfolio" ? "Work that gives good brands somewhere to go." : page === "case-studies" ? "The thinking behind the work." : page === "blog" ? "Notes on brands, culture, and being seen." : page === "about" ? "A media agency for people with something to say." : page === "roi" ? "Build a presence that earns its place." : page === "contact" ? "Let’s make your next move visible." : page === "free-audit" ? "Find the gaps in your public presence." : "Build a presence people remember.";

  return <div className="public-site">
    <header className="public-header"><Link href="/" className="public-brand"><img className="public-logo-image" src="/assets/earden-media-logo.webp" alt="EARDEN MEDIA" /></Link><nav className={`public-nav ${menuOpen ? "public-nav--open" : ""}`}>{nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}<Link href="/contact" className="public-nav-cta" onClick={() => setMenuOpen(false)}>Start a conversation <ArrowRight size={14} /></Link></nav><button className="public-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></header>

    {isHome ? <>
      <section className="public-hero"><div className="public-eyebrow">MEDIA AGENCY · BRAND · SOCIAL · PR</div><h1>Build a presence.<br /><i>Make it matter.</i><br />Be remembered.</h1><p>Erden Media helps ambitious people and brands show up with a sharper identity, stronger content, and the visibility to move the room.</p><div className="public-actions"><Link className="public-button public-button--dark" href="/contact">Start a project <ArrowRight size={15} /></Link><Link className="public-button" href="/services">See what we do <ArrowRight size={15} /></Link></div><div className="public-positioning"><span>OUR APPROACH</span><strong>We connect the story, the look, the content, and the right audience.</strong></div></section>
      <MetricBand />
      <section className="public-proofline"><span>Built for brands with something to say</span><div className="proof-names"><b>WEBSITES</b><b>PERSONAL BRANDS</b><b>SOCIAL</b><b>PR</b><b>CONTENT</b><b>CAMPAIGNS</b></div></section>
      <ServicesSection />
      <section className="public-section public-difference"><div className="section-kicker">03 · Why Erden Media</div><h2>Good work deserves<br /><i>to be seen properly.</i></h2><div className="difference-grid">{[["01", "A point of view", "We help you find the idea, tone, and visual language that feels unmistakably yours."], ["02", "A presence with rhythm", "From the website to the weekly post, every touchpoint works as part of the same story."], ["03", "Visibility with intent", "PR, creators, and campaigns built to put your name in the right conversations."], ["04", "A partner in the room", "Strategy and execution together, without making you translate your ambition into a brief."]].map(([n, t, d]) => <div key={n} className="difference-card"><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>
      <FeaturedSection />
      <ProcessSection />
      <NotesSection />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <ContactSection />
    </> : page === "contact" ? <ContactSection /> : page === "portfolio-detail" ? <WorkDetailPage slug={slug || ""} /> : page === "blog-detail" ? <ArticleDetailPage slug={slug || ""} /> : <InteriorPage page={page} title={title} />}

    <footer className="public-footer"><div className="public-footer-top"><div className="public-footer-brand"><div className="public-brand"><img className="public-logo-image public-logo-image--footer" src="/assets/earden-media-logo.webp" alt="EARDEN MEDIA" /></div><p>Ideas, identity, and visibility for people and brands with something to say.</p></div><div className="public-footer-column"><span className="public-footer-label">Explore</span><div className="footer-links">{nav.slice(0, 5).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div></div><div className="public-footer-column"><span className="public-footer-label">Contact</span><a href="mailto:support@eardenmedia.site">support@eardenmedia.site</a><a href="mailto:info@eardenmedia.site">info@eardenmedia.site</a><a href="tel:+919864382265">+91 9864-382-265</a><div className="public-footer-socials"><a className="public-footer-social" href="https://instagram.com/eardenmedia" target="_blank" rel="noreferrer" aria-label="Open EARDEN MEDIA on Instagram"><Instagram size={17} aria-hidden="true" /></a><span className="public-footer-social public-footer-social--inactive" title="LinkedIn coming soon" aria-label="LinkedIn coming soon"><Linkedin size={17} aria-hidden="true" /></span></div></div><div className="public-footer-column"><span className="public-footer-label">Visit</span><span>Dimoruguri, 782003</span><span>Nagaon, Assam</span><span>Mon–Fri · 11:00 AM–9:00 PM</span></div></div><div className="public-footer-bottom"><span>© 2026 EARDEN MEDIA</span><span>Built for better visibility.</span></div></footer>
  </div>;
}

function MetricBand() { return <section className="metric-band"><div><strong>06</strong><span>ways to show up</span></div><div><strong>04</strong><span>core disciplines</span></div><div><strong>01</strong><span>clear point of view</span></div><div><strong>∞</strong><span>room to grow</span></div></section>; }
function ServicesSection() { return <section className="public-section"><div className="section-kicker">02 · What we manage</div><div className="section-title-row"><h2>One story.<br /><i>Many ways to show up.</i></h2><Link href="/services" className="text-link">All services <ArrowRight size={14} /></Link></div><div className="service-grid">{serviceGroups.map((group) => <div className="service-card" key={group.eyebrow}><span className="service-eyebrow">{group.eyebrow}</span><h3>{group.title}</h3><div>{group.links.map((link) => <Link href="/services" key={link}>{link}<ArrowRight size={14} /></Link>)}</div></div>)}</div></section>; }
function FeaturedSection() { return <section className="public-section featured-section"><div className="section-kicker">04 · Selected work</div><div className="featured-grid"><div><h2>Make the brand feel as good as the work behind it.</h2><p>We bring strategy, design, content, social, and PR together so the public sees the same confidence you bring to the work.</p><Link href="/portfolio" className="text-link">See selected work <ArrowRight size={14} /></Link></div><div className="featured-visual"><img src="/assets/agencyos-campaign-collage.webp" alt="Illustrative campaign planning collage" /><div><strong>01</strong><span>work in<br />motion</span></div></div></div></section>; }
function ProcessSection() { return <section className="public-section process-section"><div className="section-kicker">05 · How we work</div><h2>From first thought<br /><i>to public presence.</i></h2><div className="process-grid">{[["01", "Listen", "Understand the ambition, the audience, and the story only you can tell."], ["02", "Shape", "Turn the raw idea into a clear brand direction, content system, and campaign plan."], ["03", "Make", "Build the website, shoot the content, run the socials, and create the things people see."], ["04", "Amplify", "Put the work into the right conversations through social, PR, creators, and partnerships."]].map(([n, t, d]) => <div key={n} className="process-item"><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>; }
function NotesSection() { return <section className="public-section notes-section"><div className="section-title-row"><div><div className="section-kicker">06 · Insights</div><h2>Ideas for being seen<br /><i>without shouting.</i></h2></div><Link href="/blog" className="text-link">All notes <ArrowRight size={14} /></Link></div><div className="notes-grid">{articles.map(([category, title, desc]) => <Link href={`/blog/${slugify(title)}`} className="note-card" key={title}><span>{category}</span><h3>{title}</h3><p>{desc}</p><small>08 min read <ArrowRight size={13} /></small></Link>)}</div></section>; }
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (value: number | null) => void }) { const faqs = [["What kind of work do you take on?", "We work across websites, personal branding, social media management, content, PR, influencer campaigns, and launch moments."], ["Who do you work with?", "Founders, artists, creators, cafés, restaurants, growing brands, and teams with a point of view they want to make visible."], ["Can you help with both strategy and execution?", "Yes. We can shape the direction and then make the website, content, social rhythm, and PR activity that brings it to life."], ["How do we get started?", "Send us a note about what you are building or changing. We will come back with the clearest next step, whether that is a conversation, audit, or project outline."]]; return <section className="public-section faq-section"><div className="section-kicker">07 · Questions</div><h2>A few things<br /><i>you might want to know.</i></h2><div className="faq-list">{faqs.map(([q, a], index) => <div className={`faq-item ${openFaq === index ? "faq-item--open" : ""}`} key={q}><button onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{q}</span><ChevronDown size={17} /></button>{openFaq === index && <p>{a}</p>}</div>)}</div></section>; }
function ContactSection() {
  const createInquiry = trpc.agency.createInquiry.useMutation();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => ({ name: "", email: "", company: "", service: (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("service")) || "Website / landing page", message: "" }));
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return <section className="public-contact"><div><div className="section-kicker">08 · Start here</div><h2>Have something worth<br /><i>putting into the world?</i></h2><p>Tell us what you are building, changing, launching, or becoming. We will help you turn it into a presence people can feel.</p>{submitted && <div className="form-success">Thanks — your enquiry is with the Erden Media team. We’ll be in touch soon.</div>}{error && <div className="form-error">{error}</div>}</div><form onSubmit={(event) => { event.preventDefault(); setError(""); setSubmitted(false); createInquiry.mutate({ ...form, company: form.company || undefined, source: "contact" }, { onSuccess: () => { setSubmitted(true); setForm({ name: "", email: "", company: "", service: "Website / landing page", message: "" }); }, onError: (mutationError) => setError(mutationError.message || "We could not send your enquiry. Please try again.") }); }}><label>Name<input required value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name" /></label><label>Work email<input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@brand.com" /></label><label>Company or brand<input value={form.company} onChange={(event) => update("company", event.target.value)} placeholder="Your brand, studio, or name" /></label><label>What do you need?<select value={form.service} onChange={(event) => update("service", event.target.value)}><option>Website / landing page</option><option>Personal branding</option><option>Social media management</option><option>Content strategy and production</option><option>Public relations</option><option>Influencer campaign</option><option>Custom service</option></select></label><label>Tell us a little more<textarea required minLength={10} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="What are you building, changing, launching, or becoming?" /></label><button className="public-button public-button--dark" type="submit" disabled={createInquiry.isPending}>{createInquiry.isPending ? "Sending…" : "Send the request"} <ArrowRight size={15} /></button></form></section>;
}
function InteriorPage({ page, title }: { page: string; title: string }) {
  const serviceItems = serviceGroups.flatMap((group) => group.links);
  const items = page === "services" ? serviceItems : page === "blog" ? articles.map((article) => article[1]) : page === "portfolio" ? workItems.map((item) => item[1]) : ["Websites and landing pages", "Personal branding", "Social media management", "Content strategy and production", "Public relations", "Influencer campaigns"];
  return <main className="public-interior"><div className="section-kicker">ERDEN MEDIA / {page.replaceAll("-", " ")}</div><h1>{title}</h1><p className="interior-lede">A media agency for brands, founders, artists, and teams who want to look sharper, sound clearer, and be seen by the right people.</p><div className="interior-grid">{items.map((item, index) => { const href = page === "blog" ? `/blog/${slugify(item)}` : page === "portfolio" ? `/portfolio/${slugify(item)}` : "/contact"; const description = page === "portfolio" ? workItems.find((work) => work[1] === item)?.[2] : page === "blog" ? articles.find((article) => article[1] === item)?.[2] : "See how we turn this part of your public presence into something clear, considered, and memorable."; return <div className="interior-card" key={item}><span>{String(index + 1).padStart(2, "0")}</span><h2>{item}</h2><p>{description}</p><Link href={page === "services" ? `/contact?service=${encodeURIComponent(item)}` : href} className="text-link">{page === "portfolio" ? "View project" : page === "blog" ? "Read note" : "Talk to us"} <ArrowRight size={14} /></Link></div>; })}{page === "services" && <div className="interior-card interior-card--custom"><span>07</span><h2>Something else in mind?</h2><p>Tell us what you are building, launching, or changing. We can shape a custom mix of strategy, design, content, social, and PR around it.</p><Link href="/contact?service=Custom service" className="text-link">Build a custom service <ArrowRight size={14} /></Link></div>}</div></main>;
}

function WorkDetailPage({ slug }: { slug: string }) {
  const work = workItems.find((item) => slugify(item[1]) === slug) || workItems[0];
  const story = workStories[work[1]] || workStories.Zumorrud;
  return <main className="public-interior detail-page">
    <div className="section-kicker">ERDEN MEDIA / {story.kicker}</div>
    <h1>{story.headline}</h1>
    <p className="interior-lede">{story.overview}</p>
    <div className="detail-meta"><span>{work[0]}</span><span>{work[3]}</span></div>
    <div className="detail-story">
      <h2>The brief</h2>
      <p>{story.challenge}</p>
      <h2>The approach</h2>
      <p>{story.approach}</p>
      <h2>Where it landed</h2>
      <p>{story.outcome}</p>
      <div className="detail-services"><span>Engagement focus</span>{story.services.map((service) => <strong key={service}>{service}</strong>)}</div>
      <Link href="/contact" className="public-button public-button--dark">Start a similar project <ArrowRight size={15} /></Link>
    </div>
  </main>;
}

function ArticleDetailPage({ slug }: { slug: string }) { const article = articles.find((item) => slugify(item[1]) === slug) || articles[0]; return <main className="public-interior detail-page"><div className="section-kicker">ERDEN MEDIA / {article[0]}</div><h1>{article[1]}</h1><p className="interior-lede">{article[2]}</p><div className="detail-story"><h2>Start with the thing only you can say.</h2><p>A recognisable presence is rarely the result of posting more. It comes from knowing what you stand for, who it is for, and how to repeat the idea with enough care that people begin to remember it.</p><p>For brands, founders, artists, and creators, that usually means aligning the website, profile, content rhythm, and public conversations around one honest point of view.</p><Link href="/contact" className="text-link">Talk to Erden Media <ArrowRight size={14} /></Link></div></main>; }
