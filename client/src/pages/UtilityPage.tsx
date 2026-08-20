import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, FileText, MessageSquare, Settings2, Inbox, Mail, Phone, Building2 } from "lucide-react";

const config = {
  files: { label: "Files", title: "File room", description: "Keep briefs, brand assets, decks, and approvals attached to the work they support.", icon: FileText, rows: ["Brand assets", "Client briefs", "Campaign decks", "Monthly reports"] },
  messages: { label: "Messages", title: "Message room", description: "Give client and team conversations a clear home next to the work they move forward.", icon: MessageSquare, rows: ["Client threads", "Internal notes", "Approval follow-ups", "PR outreach"] },
  settings: { label: "Settings", title: "Workspace settings", description: "Shape the people, permissions, services, and operating defaults behind the AgencyOS workspace.", icon: Settings2, rows: ["Team and roles", "Services", "Approval defaults", "Notifications"] },
  inquiries: { label: "Inquiries", title: "New enquiries", description: "Review project requests submitted through the EARDEN MEDIA website and turn the right ones into conversations.", icon: Inbox, rows: [] },
} as const;

type InquiryStatus = "new" | "contacted" | "qualified" | "closed";

const statusLabels: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
};

export default function UtilityPage({ page }: { page: keyof typeof config }) {
  const item = config[page];
  const Icon = item.icon;
  const filesQuery = trpc.agency.files.useQuery(undefined, { enabled: page === "files" });
  const messagesQuery = trpc.agency.messages.useQuery(undefined, { enabled: page === "messages" });
  const settingsQuery = trpc.agency.settings.useQuery(undefined, { enabled: page === "settings" });
  const inquiriesQuery = trpc.agency.inquiries.useQuery(undefined, { enabled: page === "inquiries" });
  const updateStatus = trpc.agency.updateInquiryStatus.useMutation({
    onSuccess: async () => {
      await inquiriesQuery.refetch();
    },
  });
  const inquiries = inquiriesQuery.data ?? [];
  const newCount = inquiries.filter((row) => row.status === "new").length;
  const contactedCount = inquiries.filter((row) => row.status === "contacted").length;
  const qualifiedCount = inquiries.filter((row) => row.status === "qualified").length;
  const liveRows = page === "files" ? filesQuery.data?.map((row) => row.name) : page === "messages" ? messagesQuery.data?.map((row) => row.subject) : page === "settings" ? settingsQuery.data?.map((row) => `${row.workspaceName} · ${row.defaultCurrency} · ${row.approvalSlaHours}h SLA`) : [];
  const rows = liveRows && liveRows.length ? liveRows : item.rows;
  const activeQuery = page === "files" ? filesQuery : page === "messages" ? messagesQuery : page === "settings" ? settingsQuery : inquiriesQuery;

  return (
    <div className="public-site utility-page">
      <header className="public-header"><Link href="/" className="public-brand"><img className="public-logo-image" src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663796990363/lStsdmJWPinEeWQc.webp" alt="EARDEN MEDIA" /></Link><Link href="/desk" className="public-nav-cta">Back to desk <ArrowRight size={14} /></Link></header>
      <main className="public-interior">
        <div className="section-kicker">AgencyOS / {item.label}</div>
        <div className="utility-heading"><Icon size={30} /><h1>{item.title}</h1></div>
        <p className="interior-lede">{item.description}</p>
        {page === "inquiries" && !inquiriesQuery.isLoading && !inquiriesQuery.isError && <div className="inquiry-summary" aria-label="Inquiry summary"><div><strong>{inquiries.length}</strong><span>Total enquiries</span></div><div><strong>{newCount}</strong><span>New</span></div><div><strong>{contactedCount}</strong><span>Contacted</span></div><div><strong>{qualifiedCount}</strong><span>Qualified</span></div></div>}
        {activeQuery.isLoading && <div className="desk-query-state desk-query-state--loading">Syncing live workspace data…</div>}
        {activeQuery.isError && <div className="desk-query-state desk-query-state--error">Live data is temporarily unavailable. Please refresh after the database connection is restored.</div>}
        {page === "inquiries" && !activeQuery.isLoading && !activeQuery.isError && inquiries.length === 0 && <div className="desk-query-state desk-query-state--empty">No public inquiries yet. Contact submissions will appear here after someone uses the website form.</div>}
        <div className="interior-grid">
          {page === "inquiries" ? inquiries.map((inquiry, index) => {
            const status = (inquiry.status as InquiryStatus) || "new";
            return <article className="interior-card inquiry-card" key={inquiry.id ?? `${inquiry.email}-${inquiry.createdAt}`}>
              <div className="inquiry-card-top"><span>{String(index + 1).padStart(2, "0")}</span><select aria-label={`Update status for ${inquiry.name}`} value={status} disabled={updateStatus.isPending} onChange={(event) => updateStatus.mutate({ id: inquiry.id!, status: event.target.value as InquiryStatus })}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
              <h2>{inquiry.name}</h2>
              <p className="inquiry-meta"><strong>{inquiry.service}</strong>{inquiry.company ? ` · ${inquiry.company}` : ""}</p>
              <p className="inquiry-contact"><a href={`mailto:${inquiry.email}`}><Mail size={14} />{inquiry.email}</a>{inquiry.company && <span><Building2 size={14} />{inquiry.company}</span>}</p>
              <p className="inquiry-message">{inquiry.message}</p>
              <small>{new Date(inquiry.createdAt).toLocaleString()} · {statusLabels[status]}</small>
            </article>;
          }) : rows.map((row, index) => <div className="interior-card" key={row}><span>{String(index + 1).padStart(2, "0")}</span><h2>{row}</h2><p>Organize this part of the operating layer with the same clear, client-aware structure as the rest of the workspace.</p><Link href="/desk" className="text-link">Open the desk <ArrowRight size={14} /></Link></div>)}
        </div>
      </main>
      <footer className="public-footer"><div className="public-brand"><img className="public-logo-image public-logo-image--footer" src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663796990363/lStsdmJWPinEeWQc.webp" alt="EARDEN MEDIA" /></div><span>Internal workspace</span></footer>
    </div>
  );
}
