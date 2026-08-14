import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, ArrowUpRight, BarChart3, BriefcaseBusiness, CalendarDays, Check, ClipboardCheck,
  FileText, FolderOpen, LayoutDashboard, LineChart, Mail, Megaphone, Plus, Search, Settings2,
  Sparkles, Target, Users, WalletCards,
} from "lucide-react";

const modules = [
  ["Dashboard", "/", LayoutDashboard], ["CRM", "/crm", Users], ["Clients", "/clients", BriefcaseBusiness],
  ["Campaigns", "/campaigns", Target], ["Social", "/social", Megaphone], ["Content", "/content", FolderOpen],
  ["Tasks", "/tasks", ClipboardCheck], ["Calendar", "/calendar", CalendarDays], ["PR & Media", "/pr-media", Mail],
  ["Influencers", "/influencers", Sparkles], ["Analytics", "/analytics", LineChart], ["Reports", "/reports", FileText],
  ["Invoices", "/invoices", WalletCards],
] as const;

type ModuleKey = "crm" | "clients" | "campaigns" | "social" | "content" | "tasks" | "calendar" | "pr-media" | "influencers" | "analytics" | "reports" | "invoices";

const copy: Record<ModuleKey, { eyebrow: string; title: string; description: string; action: string; columns: string[] }> = {
  crm: { eyebrow: "COMMAND / 02", title: "Pipeline room", description: "Move every lead from first signal to signed retainer without losing the thread.", action: "New lead", columns: ["Lead / company", "Category", "Owner", "Stage"] },
  clients: { eyebrow: "COMMAND / 03", title: "Client roster", description: "Every active account, its signal, its context, and the next move in one place.", action: "Add client", columns: ["Client / account", "Category", "Health", "Status"] },
  campaigns: { eyebrow: "COMMAND / 04", title: "Campaign desk", description: "See what is live, what is queued, and what needs a sharper brief.", action: "New campaign", columns: ["Campaign", "Client", "Progress", "Status"] },
  social: { eyebrow: "PRODUCTION / 01", title: "Social command", description: "Bring channel planning, publishing rhythm, and audience signal into the same operational loop.", action: "Plan post", columns: ["Post / asset", "Channel", "Publish date", "Status"] },
  content: { eyebrow: "PRODUCTION / 02", title: "Content pipeline", description: "A clear handoff from draft to client approval to published proof.", action: "Add content", columns: ["Asset / title", "Channel", "Due", "Status"] },
  tasks: { eyebrow: "PRODUCTION / 03", title: "Task board", description: "Make ownership visible and keep the agency moving on the work that matters today.", action: "New task", columns: ["Task", "Assignee", "Due", "Status"] },
  calendar: { eyebrow: "PRODUCTION / 04", title: "Editorial calendar", description: "A shared view of deadlines, publishing moments, shoots, and approvals.", action: "Add event", columns: ["Event", "Client", "Date", "Type"] },
  "pr-media": { eyebrow: "GROWTH / 01", title: "Media room", description: "Track the people, pitches, responses, and coverage that build momentum around every client.", action: "Add contact", columns: ["Contact", "Outlet", "Beat", "Signal"] },
  influencers: { eyebrow: "GROWTH / 02", title: "Creator network", description: "Keep creator relationships, campaign fit, and deliverables close to the work.", action: "Add creator", columns: ["Creator", "Platform", "Audience", "Status"] },
  analytics: { eyebrow: "GROWTH / 03", title: "Signal desk", description: "Turn campaign activity into a readable view of reach, response, and what to repeat.", action: "Add metric", columns: ["Signal", "Client", "Value", "Trend"] },
  reports: { eyebrow: "GROWTH / 04", title: "Report studio", description: "Prepare clear, client-ready recaps from the operational record you already maintain.", action: "New report", columns: ["Report", "Client", "Period", "Status"] },
  invoices: { eyebrow: "FINANCE / 01", title: "Cash watch", description: "Keep retainers, open invoices, and payment follow-ups visible without leaving the desk.", action: "New invoice", columns: ["Invoice", "Client", "Amount", "Status"] },
};

type ModuleRow = { a: string; b: string; c: string; d: string; id?: number };

const fallback: Record<ModuleKey, ModuleRow[]> = {
  crm: [{ a: "Brew & Bloom", b: "Hospitality", c: "AM", d: "Proposal" }, { a: "Mira Sol", b: "Artist / Music", c: "RS", d: "Meeting" }],
  clients: [{ a: "Brew & Bloom", b: "Hospitality", c: "92%", d: "On track" }, { a: "Mira Sol", b: "Artist / Music", c: "68%", d: "Needs review" }],
  campaigns: [{ a: "Monsoon Table Stories", b: "Brew & Bloom", c: "84%", d: "Live" }, { a: "Tour teaser rollout", b: "Mira Sol", c: "42%", d: "Draft" }],
  social: [{ a: "August grid / 08", b: "Instagram", c: "14 Aug", d: "Scheduled" }, { a: "Tour teaser cut", b: "TikTok", c: "16 Aug", d: "Approval" }],
  content: [{ a: "August content grid", b: "Instagram", c: "Today", d: "Awaiting approval" }, { a: "Creator brief v2", b: "PDF", c: "Friday", d: "Draft" }],
  tasks: [{ a: "Review August content grid", b: "Rhea Shah", c: "Today", d: "In progress" }, { a: "Send media follow-up batch", b: "Aarav Mehta", c: "Tomorrow", d: "To do" }],
  calendar: [{ a: "Brew & Bloom grid review", b: "Brew & Bloom", c: "14 Aug", d: "Approval" }, { a: "Noma Studio shoot", b: "Noma Studio", c: "18 Aug", d: "Production" }],
  "pr-media": [{ a: "Ananya Rao", b: "The Sunday Edit", c: "Culture", d: "Responded" }, { a: "Kabir Malhotra", b: "Mint Lounge", c: "Food", d: "Contacted" }],
  influencers: [{ a: "Noma Studio", b: "Instagram", c: "182K", d: "Confirmed" }, { a: "Ishaan K", b: "YouTube", c: "74K", d: "Prospect" }],
  analytics: [{ a: "Earned reach", b: "Brew & Bloom", c: "1.8M", d: "+24%" }, { a: "Saves", b: "Noma Studio", c: "4.2K", d: "+18%" }],
  reports: [{ a: "July performance recap", b: "Brew & Bloom", c: "Jul 2026", d: "Ready" }, { a: "Tour launch report", b: "Mira Sol", c: "Jul 2026", d: "Draft" }],
  invoices: [{ a: "INV-1042", b: "Brew & Bloom", c: "₹84,000", d: "Open" }, { a: "INV-1039", b: "Mira Sol", c: "₹52,000", d: "Overdue" }],
};

export default function ModulePage({ module }: { module: ModuleKey }) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const meta = copy[module];
  const clientsQuery = trpc.agency.clients.useQuery(undefined, { enabled: module === "clients" });
  const campaignsQuery = trpc.agency.campaigns.useQuery(undefined, { enabled: module === "campaigns" });
  const contentQuery = trpc.agency.content.useQuery(undefined, { enabled: module === "content" });
  const tasksQuery = trpc.agency.tasks.useQuery(undefined, { enabled: module === "tasks" });
  const mediaQuery = trpc.agency.media.useQuery(undefined, { enabled: module === "pr-media" });
  const influencerQuery = trpc.agency.influencers.useQuery(undefined, { enabled: module === "influencers" });
  const reportsQuery = trpc.agency.reports.useQuery(undefined, { enabled: module === "reports" });
  const invoicesQuery = trpc.agency.invoices.useQuery(undefined, { enabled: module === "invoices" });
  const utils = useQueryClient();
  const approve = trpc.agency.approveContent.useMutation({ onSuccess: () => { toast.success("Content approved"); utils.invalidateQueries({ queryKey: [["agency", "content"]] }); } });
  const complete = trpc.agency.completeTask.useMutation({ onSuccess: () => { toast.success("Task completed"); utils.invalidateQueries({ queryKey: [["agency", "tasks"]] }); } });

  const rows = useMemo(() => {
    const data: ModuleRow[] | undefined = module === "clients" ? clientsQuery.data?.map((x) => ({ a: x.name, b: x.category, c: `${x.health}%`, d: x.status.replaceAll("_", " ") }))
      : module === "campaigns" ? campaignsQuery.data?.map((x) => ({ a: x.name, b: `Client #${x.clientId}`, c: `${x.progress}%`, d: x.status }))
      : module === "content" ? (contentQuery.data?.map((x) => ({ a: x.title, b: x.channel, c: x.dueDate ? new Date(x.dueDate).toLocaleDateString() : "Unscheduled", d: x.status.replaceAll("_", " "), id: x.id })) as ModuleRow[] | undefined)
      : module === "tasks" ? (tasksQuery.data?.map((x) => ({ a: x.title, b: x.assignee || "Unassigned", c: x.dueAt ? new Date(x.dueAt).toLocaleDateString() : "No due date", d: x.status, id: x.id })) as ModuleRow[] | undefined)
      : module === "pr-media" ? mediaQuery.data?.map((x) => ({ a: x.name, b: x.outlet, c: x.beat || "General", d: x.status }))
      : module === "influencers" ? influencerQuery.data?.map((x) => ({ a: x.name, b: x.platform, c: `${x.audience.toLocaleString()} followers`, d: x.status }))
      : module === "reports" ? reportsQuery.data?.map((x) => ({ a: x.title, b: `Client #${x.clientId}`, c: x.period, d: x.status }))
      : module === "invoices" ? invoicesQuery.data?.map((x) => ({ a: x.number, b: `Client #${x.clientId}`, c: `${x.currency} ${x.amount.toLocaleString()}`, d: x.status }))
      : undefined;
    return (data && data.length ? data : fallback[module]).filter((row) => `${row.a} ${row.b} ${row.c} ${row.d}`.toLowerCase().includes(query.toLowerCase()));
  }, [module, query, clientsQuery.data, campaignsQuery.data, contentQuery.data, tasksQuery.data, mediaQuery.data, influencerQuery.data, reportsQuery.data, invoicesQuery.data]);

  const activeQuery = module === "clients" ? clientsQuery : module === "campaigns" ? campaignsQuery : module === "content" ? contentQuery : module === "tasks" ? tasksQuery : module === "pr-media" ? mediaQuery : module === "influencers" ? influencerQuery : module === "reports" ? reportsQuery : module === "invoices" ? invoicesQuery : undefined;
  return <div className="app-shell">
    <aside className="side-rail module-rail"><div className="brand-lockup"><Link href="/" className="brand-mark" aria-label="Go to dashboard"><span /><span /></Link><div><div className="brand-name">AGENCY<span>OS</span></div><div className="brand-kicker">OPERATING DESK / 02</div></div></div><div className="rail-rule" /><div className="rail-label">Workspace</div><nav className="nav-groups">{modules.map(([label, path, Icon]) => <button key={path} className={`nav-item ${path === `/${module}` ? "nav-item--active" : ""}`} onClick={() => setLocation(path)}><Icon size={16} /><span>{label}</span></button>)}</nav><div className="rail-footer"><button className="nav-item" onClick={() => toast("Settings are next on the operating roadmap.")}><Settings2 size={16} /><span>Settings</span></button><div className="team-card"><div className="avatar avatar--orange">RS</div><div><strong>Rhea Shah</strong><small>Super Admin</small></div></div></div></aside>
    <main className="main-stage"><header className="topbar"><button className="icon-button menu-trigger" onClick={() => setLocation("/")} aria-label="Back to dashboard"><ArrowLeft size={18} /></button><div className="breadcrumb"><span>AgencyOS</span><b>/</b><strong>{meta.title}</strong></div><div className="topbar-actions"><div className="search-box"><Search size={16} /><input aria-label="Search this module" placeholder={`Search ${meta.title.toLowerCase()}`} value={query} onChange={(event) => setQuery(event.target.value)} /></div><button className="quick-add" onClick={() => toast(`${meta.action} form is ready for the next data entry pass.`)}><Plus size={16} /> {meta.action}</button></div></header>
      <div className="content-wrap module-content"><div className="module-hero"><div><div className="eyebrow"><span className="eyebrow-index">{meta.eyebrow.split(" /")[0]}</span> {meta.eyebrow.split(" /")[1]}</div><h1>{meta.title}</h1><p className="hero-copy">{meta.description}</p></div><div className="module-hero-stat"><span className="filing-index">Operational rows</span><strong>{rows.length.toString().padStart(2, "0")}</strong><small>filtered in this view</small></div></div><div className="module module-page-card"><div className="module-heading"><div><span className="filing-index">LIST / LIVE</span><h2>{meta.title}</h2></div><button onClick={() => toast("Export is coming in the reporting pass.")}>Export <ArrowUpRight size={14} /></button></div>{activeQuery?.isLoading && <div className="query-state query-state--loading">Syncing live workspace data…</div>}{activeQuery?.isError && <div className="query-state query-state--error">Live data is temporarily unavailable. Showing the last available workspace view.</div>}<div className="table-head module-table-head">{meta.columns.map((column) => <span key={column}>{column}</span>)}</div>{rows.map((row) => <div className="client-row module-table-row" key={`${row.a}-${row.b}`}><div className="client-name"><span className="client-stamp client-stamp--orange">{row.a.slice(0, 1)}</span><div><strong>{row.a}</strong><small>{row.b}</small></div></div><div className="module-cell">{row.b}</div><div className="module-cell">{row.c}</div><div className="module-cell"><span className={`status-chip status-chip--${String(row.d).toLowerCase().includes("open") || String(row.d).toLowerCase().includes("approval") ? "wait" : "good"}`}>{row.d}</span>{module === "content" && row.id && row.d === "awaiting approval" && <button className="row-action" onClick={() => approve.mutate({ id: row.id! })}><Check size={13} /></button>}{module === "tasks" && row.id && row.d !== "done" && <button className="row-action" onClick={() => complete.mutate({ id: row.id! })}><Check size={13} /></button>}</div></div>)}{rows.length === 0 && <div className="empty-state"><BarChart3 size={24} /><strong>No records match this view.</strong><span>Use “{meta.action}” to create the first item.</span></div>}</div><div className="module-page-note"><span className="live-dot" /> Data is read from the shared AgencyOS workspace. Demo rows remain until records are added.</div></div>
    </main>
  </div>;
}
