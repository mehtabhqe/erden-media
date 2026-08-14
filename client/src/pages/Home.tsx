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
      { label: "Content", icon: FolderOpen, badge: "07" },
      { label: "Tasks", icon: ClipboardCheck, badge: "12" },
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
    ],
  },
];

const clientRows = [
  { name: "Brew & Bloom", type: "Hospitality", lead: "AM", color: "orange", status: "On track", metric: "92%" },
  { name: "Mira Sol", type: "Artist / Music", lead: "RS", color: "blue", status: "Needs review", metric: "68%" },
  { name: "Noma Studio", type: "Creator", lead: "JK", color: "lime", status: "On track", metric: "84%" },
  { name: "Late Checkout", type: "Hospitality", lead: "AM", color: "pink", status: "Awaiting assets", metric: "51%" },
];

const approvalItems = [
  { title: "Brew & Bloom — August grid", meta: "8 assets · due today", tone: "orange", person: "BB" },
  { title: "Mira Sol — Tour teaser cut", meta: "1 video · due tomorrow", tone: "blue", person: "MS" },
  { title: "Noma Studio — Creator brief", meta: "Deliverables · Friday", tone: "lime", person: "NS" },
];

export default function Home() {

  const [, setLocation] = useLocation();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("This month");
  const [approved, setApproved] = useState<string[]>([]);
  const summaryQuery = trpc.agency.summary.useQuery();

  const filteredClients = useMemo(
    () => clientRows.filter((client) => client.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const activateNav = (label: string) => {
    setActiveNav(label);
    setSidebarOpen(false);
    const routeMap: Record<string, string> = { Dashboard: "/desk", CRM: "/crm", Clients: "/clients", Campaigns: "/campaigns", Social: "/social", Content: "/content", Tasks: "/tasks", Calendar: "/calendar", "PR & Media": "/pr-media", Influencers: "/influencers", Analytics: "/analytics", Reports: "/reports" };
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
              {group.items.map(({ label, icon: Icon, badge }) => (
                <button className={`nav-item ${activeNav === label ? "nav-item--active" : ""}`} key={label} onClick={() => activateNav(label)}>
                  <Icon size={16} strokeWidth={2.2} />
                  <span>{label}</span>
                  {badge && <span className="nav-badge">{badge}</span>}
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
            <div className="avatar avatar--orange">RS</div>
            <div><strong>Rhea Shah</strong><small>Super Admin</small></div>
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
              <div className="pulse-row"><span className="pulse-number">{summaryQuery.data?.clients ?? 24}</span><span className="pulse-text">active workstreams<br /><b>{summaryQuery.isLoading ? "syncing workspace" : summaryQuery.isError ? "using last view" : `${summaryQuery.data?.openTasks ?? 0} open tasks · ${summaryQuery.data?.outstandingInvoices ?? 0} invoices`}</b></span></div>
              <div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            </div>
          </section>

          {summaryQuery.isError && <div className="desk-query-state desk-query-state--error">Shared workspace data is temporarily unavailable. Showing the last available desk view.</div>}
          {summaryQuery.isLoading && <div className="desk-query-state desk-query-state--loading">Syncing the shared workspace…</div>}
          {summaryQuery.data?.isEmpty && <div className="desk-query-state desk-query-state--empty">Your shared workspace is empty. Add a client or create the first record to turn the desk into a live operating view.</div>}
          <section className="signal-grid" aria-label="Agency metrics">
            <MetricCard index="01" label="Active clients" value={String(summaryQuery.data?.clients ?? 24)} delta="+3" context="vs. last month" icon={<BriefcaseBusiness size={17} />} tone="orange" />
            <MetricCard index="02" label="Active campaigns" value={String(summaryQuery.data?.campaigns ?? 11)} delta="+2" context="in motion now" icon={<Target size={17} />} tone="blue" />
            <MetricCard index="03" label="Awaiting approval" value={String(summaryQuery.data?.awaitingApproval ?? 7).padStart(2, "0")} delta="3 due today" context="needs a nudge" icon={<Clock3 size={17} />} tone="lime" />
            <MetricCard index="04" label="Paid revenue" value={`₹${((summaryQuery.data?.revenue ?? 0) / 1000).toFixed(0)}K`} delta="live" context="from paid invoices" icon={<WalletCards size={17} />} tone="ink" />
          </section>

          <section className="workspace-grid">
            <div className="module module--wide clients-module">
              <ModuleHeading number="A1" title="Client pulse" action="View CRM" onAction={() => activateNav("CRM")} />
              <div className="module-toolbar"><span>24 active accounts</span><button className="filter-button" onClick={() => toast("Filters are ready for the CRM build.")}><Filter size={14} /> Filter</button></div>
              <div className="client-table">
                <div className="table-head"><span>Client / account</span><span>Lead</span><span>Status</span><span>Health</span></div>
                {filteredClients.map((client) => <div className="client-row" key={client.name}>
                  <div className="client-name"><span className={`client-stamp client-stamp--${client.color}`}>{client.name.slice(0, 1)}</span><div><strong>{client.name}</strong><small>{client.type}</small></div></div>
                  <div className="table-avatar">{client.lead}</div>
                  <div><span className={`status-chip status-chip--${client.status === "On track" ? "good" : "wait"}`}>{client.status}</span></div>
                  <div className="health-cell"><span className="health-value">{client.metric}</span><div className="health-bar"><i style={{ width: client.metric }} /></div></div>
                </div>)}
              </div>
              {query && filteredClients.length === 0 && <div className="empty-state">No client matches “{query}”.</div>}
            </div>

            <div className="module approvals-module">
              <ModuleHeading number="A2" title="Approval queue" action="Open queue" onAction={() => activateNav("Content")} />
              <div className="approval-stack">
                {approvalItems.map((item) => {
                  const isDone = approved.includes(item.title);
                  return <div className={`approval-item ${isDone ? "approval-item--done" : ""}`} key={item.title}>
                    <span className={`approval-bar approval-bar--${item.tone}`} />
                    <div className="approval-copy"><strong>{item.title}</strong><small>{item.meta}</small></div>
                    <button className="approval-action" onClick={() => isDone ? toast("Already approved.") : markApproved(item.title)} aria-label={`Approve ${item.title}`}>{isDone ? <Check size={15} /> : <MoveUpRight size={15} />}</button>
                  </div>;
                })}
              </div>
              <div className="approval-footer"><span><i className="live-dot" /> 3 items need action</span><button onClick={() => toast("Approval digest copied.")}><ArrowUpRight size={15} /></button></div>
            </div>

            <div className="module campaign-module">
              <ModuleHeading number="B1" title="Campaign desk" action="All campaigns" onAction={() => activateNav("Campaigns")} />
              <div className="campaign-feature">
                <img src="/manus-storage/agencyos-campaign-collage_9a528ba5.png" alt="Editorial collage of campaign materials" />
                <div className="campaign-overlay"><span>LIVE / 03</span><strong>Monsoon<br />Table Stories</strong><small>Brew & Bloom · PR + Social</small></div>
              </div>
              <div className="campaign-foot"><span>Reach target <b>84%</b></span><div className="campaign-progress"><i style={{ width: "84%" }} /></div><ArrowUpRight size={16} /></div>
            </div>

            <div className="module tasks-module">
              <ModuleHeading number="B2" title="Today’s desk" action="See all tasks" onAction={() => activateNav("Tasks")} />
              <div className="task-list">
                <TaskItem time="09:30" title="Review August content grid" client="Brew & Bloom" done />
                <TaskItem time="11:00" title="Send media follow-up batch" client="Mira Sol" />
                <TaskItem time="14:00" title="Shoot prep — creator briefing" client="Noma Studio" />
                <TaskItem time="16:30" title="Upload monthly report draft" client="Late Checkout" />
              </div>
            </div>
          </section>

          <section className="bottom-grid">
            <div className="module quote-module"><div className="quote-mark">“</div><p>AgencyOS is the desk where scattered work becomes a signal.</p><span>FIELD NOTE / 001</span></div>
            <div className="module media-module"><div className="media-copy"><ModuleHeading number="C1" title="Media signal" action="Open PR CRM" onAction={() => activateNav("PR & Media")} /><div className="media-stat"><strong>18</strong><span>new mentions<br /><b>this week</b></span></div></div><img src="/manus-storage/agencyos-media-signal_613fcb48.png" alt="Abstract wall of media outreach cards" /></div>
            <div className="module finance-module"><ModuleHeading number="C2" title="Cash watch" action="View invoices" onAction={() => activateNav("Invoices")} /><div className="finance-number">₹2.1L</div><div className="finance-label">outstanding invoices <span className="status-chip status-chip--wait">4 open</span></div><div className="finance-note"><ArrowDownRight size={16} /> ₹42K received this week</div></div>
          </section>

          <footer className="app-footer"><span>AGENCYOS / INTERNAL OPERATING SYSTEM</span><span>Last synced 2 min ago <i className="live-dot" /></span><button onClick={() => toast("Help centre is coming soon.")}><CircleHelp size={14} /> Help</button></footer>
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
