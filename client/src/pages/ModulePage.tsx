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
  const calendarQuery = trpc.agency.calendar.useQuery(undefined, { enabled: module === "calendar" });
  const utils = useQueryClient();
  const approve = trpc.agency.approveContent.useMutation({ onSuccess: () => { toast.success("Content approved"); utils.invalidateQueries({ queryKey: [["agency", "content"]] }); } });
  const complete = trpc.agency.completeTask.useMutation({ onSuccess: () => { toast.success("Task completed"); utils.invalidateQueries({ queryKey: [["agency", "tasks"]] }); } });
  const createClientMutation = trpc.agency.createClient.useMutation({ onSuccess: () => { toast.success("Client added"); utils.invalidateQueries({ queryKey: [["agency", "clients"]] }); }, onError: (error) => setFormError(error.message) });
  const createCampaignMutation = trpc.agency.createCampaign.useMutation({ onSuccess: () => { toast.success("Campaign added"); utils.invalidateQueries({ queryKey: [["agency", "campaigns"]] }); }, onError: (error) => setFormError(error.message) });
  const createMediaMutation = trpc.agency.createMediaContact.useMutation({ onSuccess: () => { toast.success("Media contact added"); utils.invalidateQueries({ queryKey: [["agency", "media"]] }); }, onError: (error) => setFormError(error.message) });
  const createInfluencerMutation = trpc.agency.createInfluencer.useMutation({ onSuccess: () => { toast.success("Creator added"); utils.invalidateQueries({ queryKey: [["agency", "influencers"]] }); }, onError: (error) => setFormError(error.message) });
  const createReportMutation = trpc.agency.createReport.useMutation({ onSuccess: () => { toast.success("Report added"); utils.invalidateQueries({ queryKey: [["agency", "reports"]] }); }, onError: (error) => setFormError(error.message) });
  const createInvoiceMutation = trpc.agency.createInvoice.useMutation({ onSuccess: () => { toast.success("Invoice added"); utils.invalidateQueries({ queryKey: [["agency", "invoices"]] }); }, onError: (error) => setFormError(error.message) });
  const createCalendarMutation = trpc.agency.createCalendarEvent.useMutation({ onSuccess: () => { toast.success("Calendar event added"); setFormOpen(false); utils.invalidateQueries({ queryKey: [["agency", "calendar"]] }); }, onError: (error) => setFormError(error.message) });
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Record<string, string>>({});
  const handlePrimaryAction = () => { setFormError(""); setFieldErrors({}); setFormData({}); setFormOpen(true); };
  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    const name = formData.name?.trim();
    if (!name || name.length < 2) errors.name = "Enter at least 2 characters.";
    const clientId = Number(formData.clientId || "");
    if (["campaigns", "reports", "invoices"].includes(module) && (!Number.isInteger(clientId) || clientId < 1)) errors.clientId = "Use a positive whole number.";
    if (module === "clients" && !formData.category?.trim()) errors.category = "Category is required.";
    if (module === "clients" && !formData.leadInitials?.trim()) errors.leadInitials = "Lead initials are required.";
    if (module === "campaigns" && !formData.type?.trim()) errors.type = "Campaign type is required.";
    if (module === "pr-media" && !formData.outlet?.trim()) errors.outlet = "Outlet is required.";
    if (module === "pr-media" && !formData.beat?.trim()) errors.beat = "Beat is required.";
    if (module === "influencers" && !formData.handle?.trim()) errors.handle = "Handle is required.";
    if (module === "influencers" && !formData.platform?.trim()) errors.platform = "Platform is required.";
    if (module === "influencers" && (!Number.isInteger(Number(formData.audience)) || Number(formData.audience) < 0)) errors.audience = "Audience must be zero or greater.";
    if (module === "reports" && !formData.period?.trim()) errors.period = "Period is required.";
    if (module === "invoices" && (!Number.isInteger(Number(formData.amount)) || Number(formData.amount) < 1)) errors.amount = "Amount must be a positive whole number.";
    if (module === "calendar" && (!formData.startsAt || Number.isNaN(new Date(formData.startsAt).getTime()))) errors.startsAt = "Choose a valid date and time.";
    if (Object.keys(errors).length) { setFieldErrors(errors); setFormError("Fix the highlighted fields before saving."); return; }
    setFieldErrors({});

    if (module === "clients") createClientMutation.mutate({ name, category: formData.category || "Other", leadInitials: formData.leadInitials || "RS" });
    else if (module === "campaigns") createCampaignMutation.mutate({ clientId, name, type: formData.type || "Social" });
    else if (module === "pr-media") createMediaMutation.mutate({ name, outlet: formData.outlet, beat: formData.beat });
    else if (module === "influencers") createInfluencerMutation.mutate({ name, handle: formData.handle, platform: formData.platform, audience: Number(formData.audience) });
    else if (module === "reports") createReportMutation.mutate({ clientId, title: name, period: formData.period });
    else if (module === "invoices") { const amount = Number(formData.amount || "0"); if (!Number.isInteger(amount) || amount < 1) { setFormError("Amount must be a positive whole number."); return; } createInvoiceMutation.mutate({ clientId, number: name, amount }); }
    else if (module === "calendar") createCalendarMutation.mutate({ title: name, eventType: formData.type || "Meeting", startsAt: new Date(formData.startsAt).getTime() });
    else setFormError("This module does not accept new records yet.");
  };

  const rows = useMemo(() => {
    const data: ModuleRow[] | undefined = module === "clients" ? clientsQuery.data?.map((x) => ({ a: x.name, b: x.category, c: `${x.health}%`, d: x.status.replaceAll("_", " ") }))
      : module === "campaigns" ? campaignsQuery.data?.map((x) => ({ a: x.name, b: `Client #${x.clientId}`, c: `${x.progress}%`, d: x.status }))
      : module === "content" ? (contentQuery.data?.map((x) => ({ a: x.title, b: x.channel, c: x.dueDate ? new Date(x.dueDate).toLocaleDateString() : "Unscheduled", d: x.status.replaceAll("_", " "), id: x.id })) as ModuleRow[] | undefined)
      : module === "tasks" ? (tasksQuery.data?.map((x) => ({ a: x.title, b: x.assignee || "Unassigned", c: x.dueAt ? new Date(x.dueAt).toLocaleDateString() : "No due date", d: x.status, id: x.id })) as ModuleRow[] | undefined)
      : module === "pr-media" ? mediaQuery.data?.map((x) => ({ a: x.name, b: x.outlet, c: x.beat || "General", d: x.status }))
      : module === "influencers" ? influencerQuery.data?.map((x) => ({ a: x.name, b: x.platform, c: `${x.audience.toLocaleString()} followers`, d: x.status }))
      : module === "reports" ? reportsQuery.data?.map((x) => ({ a: x.title, b: `Client #${x.clientId}`, c: x.period, d: x.status }))
      : module === "invoices" ? invoicesQuery.data?.map((x) => ({ a: x.number, b: `Client #${x.clientId}`, c: `${x.currency} ${x.amount.toLocaleString()}`, d: x.status }))
      : module === "calendar" ? calendarQuery.data?.map((x) => ({ a: x.title, b: `Client #${x.clientId ?? "—"}`, c: new Date(x.startsAt).toLocaleDateString(), d: x.status }))
      : undefined;
    return (data ?? []).filter((row) => `${row.a} ${row.b} ${row.c} ${row.d}`.toLowerCase().includes(query.toLowerCase()));
  }, [module, query, clientsQuery.data, campaignsQuery.data, contentQuery.data, tasksQuery.data, mediaQuery.data, influencerQuery.data, reportsQuery.data, invoicesQuery.data, calendarQuery.data]);

  const activeQuery = module === "clients" ? clientsQuery : module === "campaigns" ? campaignsQuery : module === "content" ? contentQuery : module === "tasks" ? tasksQuery : module === "calendar" ? calendarQuery : module === "pr-media" ? mediaQuery : module === "influencers" ? influencerQuery : module === "reports" ? reportsQuery : module === "invoices" ? invoicesQuery : undefined;
  return <div className="app-shell">
    <aside className="side-rail module-rail"><div className="brand-lockup"><Link href="/" className="brand-mark" aria-label="Go to dashboard"><span /><span /></Link><div><div className="brand-name">AGENCY<span>OS</span></div><div className="brand-kicker">OPERATING DESK / 02</div></div></div><div className="rail-rule" /><div className="rail-label">Workspace</div><nav className="nav-groups">{modules.map(([label, path, Icon]) => <button key={path} className={`nav-item ${path === `/${module}` ? "nav-item--active" : ""}`} onClick={() => setLocation(path)}><Icon size={16} /><span>{label}</span></button>)}</nav><div className="rail-footer"><button className="nav-item" onClick={() => toast("Settings are next on the operating roadmap.")}><Settings2 size={16} /><span>Settings</span></button><div className="team-card"><div className="avatar avatar--orange">RS</div><div><strong>Rhea Shah</strong><small>Super Admin</small></div></div></div></aside>
    <main className="main-stage"><header className="topbar"><button className="icon-button menu-trigger" onClick={() => setLocation("/")} aria-label="Back to dashboard"><ArrowLeft size={18} /></button><div className="breadcrumb"><span>AgencyOS</span><b>/</b><strong>{meta.title}</strong></div><div className="topbar-actions"><div className="search-box"><Search size={16} /><input aria-label="Search this module" placeholder={`Search ${meta.title.toLowerCase()}`} value={query} onChange={(event) => setQuery(event.target.value)} /></div><button className="quick-add" onClick={handlePrimaryAction}><Plus size={16} /> {meta.action}</button></div></header>
      <div className="content-wrap module-content">{formOpen && <form className="module-create-form" onSubmit={submitForm}><div><strong>{meta.action}</strong><button type="button" onClick={() => setFormOpen(false)}>Close</button></div><input required minLength={2} placeholder={module === "invoices" ? "Invoice number" : "Name or title"} value={formData.name || ""} onChange={(event) => setFormData({ ...formData, name: event.target.value })} />{fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}{["campaigns", "reports", "invoices"].includes(module) && <><input placeholder="Client ID" inputMode="numeric" value={formData.clientId || ""} onChange={(event) => setFormData({ ...formData, clientId: event.target.value })} />{fieldErrors.clientId && <span className="field-error">{fieldErrors.clientId}</span>}</>}{["campaigns", "calendar"].includes(module) && <><input required placeholder={module === "calendar" ? "Event type" : "Campaign type"} value={formData.type || ""} onChange={(event) => setFormData({ ...formData, type: event.target.value })} />{fieldErrors.type && <span className="field-error">{fieldErrors.type}</span>}</>}{module === "calendar" && <><input required type="datetime-local" value={formData.startsAt || ""} onChange={(event) => setFormData({ ...formData, startsAt: event.target.value })} />{fieldErrors.startsAt && <span className="field-error">{fieldErrors.startsAt}</span>}</>}{module === "invoices" && <><input required placeholder="Amount in INR" inputMode="numeric" value={formData.amount || ""} onChange={(event) => setFormData({ ...formData, amount: event.target.value })} />{fieldErrors.amount && <span className="field-error">{fieldErrors.amount}</span>}</>}{module === "influencers" && <><input required placeholder="Handle" value={formData.handle || ""} onChange={(event) => setFormData({ ...formData, handle: event.target.value })} />{fieldErrors.handle && <span className="field-error">{fieldErrors.handle}</span>}<input required placeholder="Platform" value={formData.platform || ""} onChange={(event) => setFormData({ ...formData, platform: event.target.value })} />{fieldErrors.platform && <span className="field-error">{fieldErrors.platform}</span>}<input required placeholder="Audience" inputMode="numeric" value={formData.audience || ""} onChange={(event) => setFormData({ ...formData, audience: event.target.value })} />{fieldErrors.audience && <span className="field-error">{fieldErrors.audience}</span>}</>}{module === "pr-media" && <><input required placeholder="Outlet" value={formData.outlet || ""} onChange={(event) => setFormData({ ...formData, outlet: event.target.value })} />{fieldErrors.outlet && <span className="field-error">{fieldErrors.outlet}</span>}<input required placeholder="Beat" value={formData.beat || ""} onChange={(event) => setFormData({ ...formData, beat: event.target.value })} />{fieldErrors.beat && <span className="field-error">{fieldErrors.beat}</span>}</>}{module === "reports" && <><input required placeholder="Reporting period" value={formData.period || ""} onChange={(event) => setFormData({ ...formData, period: event.target.value })} />{fieldErrors.period && <span className="field-error">{fieldErrors.period}</span>}</>}{module === "clients" && <><input required placeholder="Category" value={formData.category || ""} onChange={(event) => setFormData({ ...formData, category: event.target.value })} />{fieldErrors.category && <span className="field-error">{fieldErrors.category}</span>}<input required placeholder="Lead initials" maxLength={8} value={formData.leadInitials || ""} onChange={(event) => setFormData({ ...formData, leadInitials: event.target.value })} />{fieldErrors.leadInitials && <span className="field-error">{fieldErrors.leadInitials}</span>}</>}{formError && <span className="form-error">{formError}</span>}<button className="quick-add" type="submit">Save record <Check size={14} /></button></form>}<div className="module-hero"><div><div className="eyebrow"><span className="eyebrow-index">{meta.eyebrow.split(" /")[0]}</span> {meta.eyebrow.split(" /")[1]}</div><h1>{meta.title}</h1><p className="hero-copy">{meta.description}</p></div><div className="module-hero-stat"><span className="filing-index">Operational rows</span><strong>{rows.length.toString().padStart(2, "0")}</strong><small>filtered in this view</small></div></div><div className="module module-page-card"><div className="module-heading"><div><span className="filing-index">LIST / LIVE</span><h2>{meta.title}</h2></div><button onClick={() => toast("Export is coming in the reporting pass.")}>Export <ArrowUpRight size={14} /></button></div>{activeQuery?.isLoading && <div className="query-state query-state--loading">Syncing live workspace data…</div>}{activeQuery?.isError && <div className="query-state query-state--error">Live data is temporarily unavailable. Showing the last available workspace view.</div>}<div className="table-head module-table-head">{meta.columns.map((column) => <span key={column}>{column}</span>)}</div>{rows.map((row) => <div className="client-row module-table-row" key={`${row.a}-${row.b}`}><div className="client-name"><span className="client-stamp client-stamp--orange">{row.a.slice(0, 1)}</span><div><strong>{row.a}</strong><small>{row.b}</small></div></div><div className="module-cell">{row.b}</div><div className="module-cell">{row.c}</div><div className="module-cell"><span className={`status-chip status-chip--${String(row.d).toLowerCase().includes("open") || String(row.d).toLowerCase().includes("approval") ? "wait" : "good"}`}>{row.d}</span>{module === "content" && row.id && row.d === "awaiting approval" && <button className="row-action" onClick={() => approve.mutate({ id: row.id! })}><Check size={13} /></button>}{module === "tasks" && row.id && row.d !== "done" && <button className="row-action" onClick={() => complete.mutate({ id: row.id! })}><Check size={13} /></button>}</div></div>)}{rows.length === 0 && <div className="empty-state"><BarChart3 size={24} /><strong>No records match this view.</strong><span>Use “{meta.action}” to create the first item.</span></div>}</div><div className="module-page-note"><span className="live-dot" /> Data is read from the shared AgencyOS workspace. Demo rows remain until records are added.</div></div>
    </main>
  </div>;
}
