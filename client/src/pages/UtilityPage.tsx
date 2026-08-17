import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, FileText, MessageSquare, Settings2, Inbox } from "lucide-react";

const config = {
  files: { label: "Files", title: "File room", description: "Keep briefs, brand assets, decks, and approvals attached to the work they support.", icon: FileText, rows: ["Brand assets", "Client briefs", "Campaign decks", "Monthly reports"] },
  messages: { label: "Messages", title: "Message room", description: "Give client and team conversations a clear home next to the work they move forward.", icon: MessageSquare, rows: ["Client threads", "Internal notes", "Approval follow-ups", "PR outreach"] },
  settings: { label: "Settings", title: "Workspace settings", description: "Shape the people, permissions, services, and operating defaults behind the AgencyOS workspace.", icon: Settings2, rows: ["Team and roles", "Services", "Approval defaults", "Notifications"] },
  inquiries: { label: "Inquiries", title: "New enquiries", description: "Review project requests submitted through the ERDEN MEDIA website and turn the right ones into conversations.", icon: Inbox, rows: ["No enquiries yet"] },
} as const;

export default function UtilityPage({ page }: { page: keyof typeof config }) {
  const item = config[page];
  const Icon = item.icon;
  const filesQuery = trpc.agency.files.useQuery(undefined, { enabled: page === "files" });
  const messagesQuery = trpc.agency.messages.useQuery(undefined, { enabled: page === "messages" });
  const settingsQuery = trpc.agency.settings.useQuery(undefined, { enabled: page === "settings" });
  const inquiriesQuery = trpc.agency.inquiries.useQuery(undefined, { enabled: page === "inquiries" });
  const liveRows = page === "files" ? filesQuery.data?.map((row) => row.name) : page === "messages" ? messagesQuery.data?.map((row) => row.subject) : page === "settings" ? settingsQuery.data?.map((row) => `${row.workspaceName} · ${row.defaultCurrency} · ${row.approvalSlaHours}h SLA`) : inquiriesQuery.data?.map((row) => `${row.name} · ${row.service} · ${row.status}`);
  const rows = liveRows && liveRows.length ? liveRows : page === "inquiries" ? [] : item.rows;
  const activeQuery = page === "files" ? filesQuery : page === "messages" ? messagesQuery : page === "settings" ? settingsQuery : inquiriesQuery;
  return <div className="public-site utility-page"><header className="public-header"><Link href="/" className="public-brand"><span className="public-brand-mark">EM</span><span>ERDEN MEDIA</span></Link><Link href="/desk" className="public-nav-cta">Back to desk <ArrowRight size={14} /></Link></header><main className="public-interior"><div className="section-kicker">AgencyOS / {item.label}</div><div className="utility-heading"><Icon size={30} /><h1>{item.title}</h1></div><p className="interior-lede">{item.description}</p>{activeQuery.isLoading && <div className="desk-query-state desk-query-state--loading">Syncing live workspace data…</div>}{activeQuery.isError && <div className="desk-query-state desk-query-state--error">Live data is temporarily unavailable. Please refresh after the database connection is restored.</div>}{page === "inquiries" && !activeQuery.isLoading && !activeQuery.isError && (inquiriesQuery.data ?? []).length === 0 && <div className="desk-query-state desk-query-state--empty">No public inquiries yet. Contact submissions will appear here after someone uses the website form.</div>}<div className="interior-grid">{page === "inquiries" ? (inquiriesQuery.data ?? []).map((inquiry, index) => <div className="interior-card" key={inquiry.id ?? `${inquiry.email}-${inquiry.createdAt}`}><span>{String(index + 1).padStart(2, "0")}</span><h2>{inquiry.name}</h2><p><strong>{inquiry.service}</strong>{inquiry.company ? ` · ${inquiry.company}` : ""}<br />{inquiry.email}<br />{inquiry.message}</p><small>{new Date(inquiry.createdAt).toLocaleString()} · {inquiry.status}</small></div>) : rows.map((row, index) => <div className="interior-card" key={row}><span>{String(index + 1).padStart(2, "0")}</span><h2>{row}</h2><p>Organize this part of the operating layer with the same clear, client-aware structure as the rest of the workspace.</p><Link href="/desk" className="text-link">Open the desk <ArrowRight size={14} /></Link></div>)}</div></main><footer className="public-footer"><div className="public-brand"><span className="public-brand-mark">EM</span><span>ERDEN MEDIA</span></div><span>Internal workspace</span></footer></div>;
}
