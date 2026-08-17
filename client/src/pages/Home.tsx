import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  FileText,
  Filter,
  FolderOpen,
  Headphones,
  LayoutDashboard,
  LineChart,
  Mail,
  Inbox,
  Megaphone,
  Menu,
  MoreHorizontal,
  MoveUpRight,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Target,
  Users,
  WalletCards,
  X,
} from "lucide-react";

/**
 * AgencyOS / Editorial Brutalism reminder:
 * Warm paper canvas, near-black ink, Agency Orange #FF5A36, cobalt navigation,
 * thick rules, offset shadows, filing labels, and staggered editorial modules.
 */

const navGroups = [
  {
    label: "Command",
    items: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "CRM", icon: Users },
      { label: "Clients", icon: BriefcaseBusiness },
      { label: "Campaigns", icon: Target },
    ],
  },
  {
    label: "Production",
    items: [
      { label: "Social", icon: Megaphone },
      { label: "Content", icon: FolderOpen },
      { label: "Tasks", icon: ClipboardCheck },
      { label: "Calendar", icon: CalendarDays },
    ],
  },
  {
    label: "Growth",
    items: [
      { label: "PR & Media", icon: Mail },
      { label: "Influencers", icon: Sparkles },
      { label: "Analytics", icon: LineChart },
      { label: "Reports", icon: FileText },
      { label: "Inquiries", icon: Inbox },
    ],
  },
];

export default function Home() {

  const [, setLocation] = useLocation();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("This month");
  const [approved, setApproved] = useState<string[]>([]);
  const summaryQuery = trpc.agency.summary.useQuery();
  const clientsQuery = trpc.agency.clients.useQuery();
  const campaignsQuery = trpc.agency.campaigns.useQuery();
  const contentQuery = trpc.agency.content.useQuery();
  const tasksQuery = trpc.agency.tasks.useQuery();
  const clients = clientsQuery.data ?? [];
  const approvals = (contentQuery.data ?? []).filter((item) => item.status === "awaiting_approval").slice(0, 3);
  const tasks = (tasksQuery.data ?? []).filter((task) => task.status !== "done").slice(0, 4);
  const liveCampaigns = (campaignsQuery.data ?? []).filter((campaign) => campaign.status === "live");

  const filteredClients = useMemo(
    () => clients.filter((client) => client.name.toLowerCase().includes(query.toLowerCase())),
    [clients, query],
  );

  const activateNav = (label: string) => {
    setActiveNav(label);
    setSidebarOpen(false);
    const routeMap: Record<string, string> = { Dashboard: "/desk", CRM: "/crm", Clients: "/clients", Campaigns: "/campaigns", Social: "/social", Content: "/content", Tasks: "/tasks", Calendar: "/calendar", "PR & Media": "/pr-media", Influencers: "/influencers", Analytics: "/analytics", Reports: "/reports", Inquiries: "/inquiries" };
    if (routeMap[label]) setLocation(routeMap[label]);
    else toast(`${label} is on the next operating pass.`);
  };

  const markApproved = (title: string) => {
    setApproved((current) => [...current, title]);
    toast.success("Approval moved forward", { description: title });
  };

  return (
    <div className="app-shell">
      <aside className={`side-rail ${sidebarOpen ? "side-rail--open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          <div>
            <div className="brand-name">AGENCY<span>OS</span></div>
            <div className="brand-kicker">OPERATING DESK / 01</div>
          </div>
          <button className="icon-button rail-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>

        <div className="rail-rule" />
        <div className="rail-label">Workspace</div>
        <nav className="nav-groups" aria-label="Primary navigation">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-group-label">{group.label}</div>
              {group.items.map(({ label, icon: Icon }) => (
                <button className={`nav-item ${activeNav === label ? "nav-item--active" : ""}`} key={label} onClick={() => activateNav(label)}>
                  <Icon size={16} strokeWidth={2.2} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="rail-footer">
          <button className="nav-item" onClick={() => setLocation("/messages")}><Headphones size={16} /><span>Messages</span><span className="status-dot" /></button>
          <button className="nav-item" onClick={() => setLocation("/files")}><FolderOpen size={16} /><span>Files</span></button>
          <button className="nav-item" onClick={() => setLocation("/settings")}><Settings2 size={16} /><span>Settings</span></button>
          <div className="team-card">
            <div className="avatar avatar--orange">EM</div>
            <div><strong>EARDEN MEDIA</strong><small>Private workspace</small></div>
            <MoreHorizontal size={16} className="muted-icon" />
          </div>
        </div>
      </aside>

      <main className="main-stage">
        <header className="topbar">
          <button className="icon-button menu-trigger" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
          <div className="breadcrumb"><span>AgencyOS</span><b>/</b><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <div className="search-box"><Search size={16} /><input aria-label="Search clients" placeholder="Search anything" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></div>
            <button className="icon-button notification-button" onClick={() => toast("You are all caught up.")} aria-label="Notifications"><Bell size={18} /><i /></button>
            <button className="quick-add" onClick={() => toast("New item menu opened.")}><Plus size={17} /> New <ChevronDown size={14} /></button>
          </div>
        </header>

        <div className="content-wrap">
          <section className="hero-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-index">00</span> Monday, 14 August 2026 <span className="eyebrow-line" /></div>
              <h1>Keep the whole<br /><em>machine</em> in view.</h1>
              <p className="hero-copy">A live read on clients, campaigns, content and cash. Your agency’s next move is already here.</p>
            </div>
            <div className="hero-aside">
              <div className="hero-aside-label">Network pulse</div>
              <div className="pulse-row"><span className="pulse-number">{summaryQuery.data?.clients ?? 0}</span><span className="pulse-text">active clients<br /><b>{summaryQuery.isLoading ? "syncing workspace" : summaryQuery.isError ? "live data unavailable" : `${summaryQuery.data?.openTasks ?? 0} open tasks · ${summaryQuery.data?.outstandingInvoices ?? 0} invoices`}</b></span></div>
              <div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            </div>
          </section>

          {summaryQuery.isError && <div className="desk-query-state desk-query-state--error">Shared workspace data is temporarily unavailable. Showing the last available desk view.</div>}
          {summaryQuery.isLoading && <div className="desk-query-state desk-query-state--loading">Syncing the shared workspace…</div>}
          {summaryQuery.data?.isEmpty && <div className="desk-query-state desk-query-state--empty">Your shared workspace is empty. Add a client or create the first record to turn the desk into a live operating view.</div>}
          <section className="signal-grid" aria-label="Agency metrics">
            <MetricCard index="01" label="Active clients" value={String(summaryQuery.data?.clients ?? 0)} delta="live" context="from workspace" icon={<BriefcaseBusiness size={17} />} tone="orange" />
            <MetricCard index="02" label="Active campaigns" value={String(summaryQuery.data?.campaigns ?? 0)} delta="live" context="in motion now" icon={<Target size={17} />} tone="blue" />
            <MetricCard index="03" label="Awaiting approval" value={String(summaryQuery.data?.awaitingApproval ?? 0).padStart(2, "0")} delta="live" context="needs a nudge" icon={<Clock3 size={17} />} tone="lime" />
            <MetricCard index="04" label="Paid revenue" value={`₹${((summaryQuery.data?.revenue ?? 0) / 1000).toFixed(0)}K`} delta="live" context="from paid invoices" icon={<WalletCards size={17} />} tone="ink" />
          </section>

          <section className="workspace-grid">
            <div className="module module--wide clients-module">
              <ModuleHeading number="A1" title="Client pulse" action="View CRM" onAction={() => activateNav("CRM")} />
              <div className="module-toolbar"><span>{clients.length} active accounts</span><button className="filter-button" onClick={() => toast("Filters are ready for the CRM build.")}><Filter size={14} /> Filter</button></div>
              <div className="client-table">
                <div className="table-head"><span>Client / account</span><span>Lead</span><span>Status</span><span>Health</span></div>
                {filteredClients.map((client) => { const statusLabel = client.status.replace("_", " "); const metric = `${client.health}%`; return <div className="client-row" key={client.id}>
                  <div className="client-name"><span className="client-stamp client-stamp--orange">{client.name.slice(0, 1)}</span><div><strong>{client.name}</strong><small>{client.category}</small></div></div>
                  <div className="table-avatar">{client.leadInitials}</div>
                  <div><span className={`status-chip status-chip--${client.status === "on_track" ? "good" : "wait"}`}>{statusLabel}</span></div>
                  <div className="health-cell"><span className="health-value">{metric}</span><div className="health-bar"><i style={{ width: metric }} /></div></div>
                </div>; })}
              </div>
              {filteredClients.length === 0 && <div className="empty-state">{query ? `No client matches “${query}”.` : "No client records yet. Add the first client from CRM."}</div>}
            </div>

            <div className="module approvals-module">
              <ModuleHeading number="A2" title="Approval queue" action="Open queue" onAction={() => activateNav("Content")} />
              <div className="approval-stack">
                {approvals.map((item) => {
                  const isDone = approved.includes(item.title);
                  return <div className={`approval-item ${isDone ? "approval-item--done" : ""}`} key={item.id}>
                    <span className="approval-bar approval-bar--orange" />
                    <div className="approval-copy"><strong>{item.title}</strong><small>{item.channel} · awaiting approval</small></div>
                    <button className="approval-action" onClick={() => isDone ? toast("Already approved.") : markApproved(item.title)} aria-label={`Approve ${item.title}`}>{isDone ? <Check size={15} /> : <MoveUpRight size={15} />}</button>
                  </div>;
                })}
                {approvals.length === 0 && <div className="empty-state">No content is awaiting approval.</div>}
              </div>
              <div className="approval-footer"><span><i className="live-dot" /> {approvals.length} items need action</span><button onClick={() => toast("Approval digest copied.")}><ArrowUpRight size={15} /></button></div>
            </div>

            <div className="module campaign-module">
              <ModuleHeading number="B1" title="Campaign desk" action="All campaigns" onAction={() => activateNav("Campaigns")} />
              {liveCampaigns.length > 0 ? <><div className="campaign-feature">
                <div className="campaign-overlay"><span>LIVE / {String(liveCampaigns.length).padStart(2, "0")}</span><strong>{liveCampaigns[0].name}</strong><small>{liveCampaigns[0].type}</small></div>
              </div>
              <div className="campaign-foot"><span>Progress <b>{liveCampaigns[0].progress}%</b></span><div className="campaign-progress"><i style={{ width: `${liveCampaigns[0].progress}%` }} /></div><ArrowUpRight size={16} /></div></> : <div className="empty-state">No live campaigns yet. Create one from Campaigns.</div>}
            </div>

            <div className="module tasks-module">
              <ModuleHeading number="B2" title="Today’s desk" action="See all tasks" onAction={() => activateNav("Tasks")} />
              <div className="task-list">
                {tasks.map((task) => <TaskItem key={task.id} time={task.dueAt ? new Date(task.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"} title={task.title} client={task.assignee || "Unassigned"} />)}
                {tasks.length === 0 && <div className="empty-state">No open tasks yet.</div>}
              </div>
            </div>
          </section>

          <section className="bottom-grid">
            <div className="module quote-module"><div className="quote-mark">“</div><p>AgencyOS is the desk where scattered work becomes a signal.</p><span>FIELD NOTE / 001</span></div>
            <div className="module media-module"><div className="media-copy"><ModuleHeading number="C1" title="Media signal" action="Open PR CRM" onAction={() => activateNav("PR & Media")} /><div className="media-stat"><strong>—</strong><span>coverage metrics<br /><b>add media records to track</b></span></div></div></div>
            <div className="module finance-module"><ModuleHeading number="C2" title="Cash watch" action="View invoices" onAction={() => activateNav("Invoices")} /><div className="finance-number">₹{((summaryQuery.data?.revenue ?? 0) / 1000).toFixed(0)}K</div><div className="finance-label">paid revenue <span className="status-chip status-chip--wait">{summaryQuery.data?.outstandingInvoices ?? 0} open</span></div><div className="finance-note"><ArrowDownRight size={16} /> Live invoice totals</div></div>
          </section>

          <footer className="app-footer"><span>AGENCYOS / INTERNAL OPERATING SYSTEM</span><span>Live workspace data <i className="live-dot" /></span><button onClick={() => toast("Help centre is coming soon.")}><CircleHelp size={14} /> Help</button></footer>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ index, label, value, delta, context, icon, tone }: { index: string; label: string; value: string; delta: string; context: string; icon: React.ReactNode; tone: string }) {
  return <div className={`metric-card metric-card--${tone}`}><div className="metric-top"><span className="filing-index">{index}</span><span className="metric-icon">{icon}</span></div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-bottom"><span className="metric-delta"><ArrowUpRight size={13} />{delta}</span><span>{context}</span></div></div>;
}

function ModuleHeading({ number, title, action, onAction }: { number: string; title: string; action: string; onAction: () => void }) {
  return <div className="module-heading"><div><span className="filing-index">{number}</span><h2>{title}</h2></div><button onClick={onAction}>{action} <ArrowUpRight size={14} /></button></div>;
}

function TaskItem({ time, title, client, done = false }: { time: string; title: string; client: string; done?: boolean }) {
  const [complete, setComplete] = useState(done);
  return <div className={`task-item ${complete ? "task-item--done" : ""}`}><span className="task-time">{time}</span><button className="task-check" onClick={() => setComplete(!complete)} aria-label={`Mark ${title} ${complete ? "incomplete" : "complete"}`}>{complete && <Check size={13} />}</button><div><strong>{title}</strong><small>{client}</small></div></div>;
}
