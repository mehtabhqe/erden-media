import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Link, Route, Switch } from "wouter";
import { startLogin } from "./const";
import { useAuth } from "./_core/hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ModulePage from "./pages/ModulePage";
import PublicSite from "./pages/PublicSite";
import UtilityPage from "./pages/UtilityPage";

function PrivateAccess({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <div className="private-gate"><span className="section-kicker">AGENCYOS / PRIVATE</span><h1>Checking workspace access.</h1><p>One moment while we verify your session.</p></div>;
  if (!isAuthenticated) return <div className="private-gate"><span className="section-kicker">AGENCYOS / PRIVATE</span><h1>The operating desk is for the team.</h1><p>Sign in with your AgencyOS account to access clients, campaigns, approvals, reporting, and workspace settings.</p><div className="public-actions"><button className="public-button public-button--dark" onClick={() => startLogin()}>Sign in to the desk</button><Link className="public-button" href="/">Back to the public site</Link></div></div>;
  return <>{children}</>;
}

function PrivateRoute({ children }: { children: React.ReactNode }) { return <PrivateAccess>{children}</PrivateAccess>; }

function Router() {
  return <Switch>
    <Route path="/" component={() => <PublicSite />} />
    <Route path="/desk" component={() => <PrivateRoute><Home /></PrivateRoute>} />
    <Route path="/services" component={() => <PublicSite page="services" />} />
    <Route path="/portfolio/:slug" component={({ params }: { params: { slug: string } }) => <PublicSite page="portfolio-detail" slug={params.slug} />} />
    <Route path="/portfolio" component={() => <PublicSite page="portfolio" />} />
    <Route path="/case-studies" component={() => <PublicSite page="case-studies" />} />
    <Route path="/blog/:slug" component={({ params }: { params: { slug: string } }) => <PublicSite page="blog-detail" slug={params.slug} />} />
    <Route path="/blog" component={() => <PublicSite page="blog" />} />
    <Route path="/about" component={() => <PublicSite page="about" />} />
    <Route path="/tools/roi-calculator" component={() => <PublicSite page="roi" />} />
    <Route path="/contact" component={() => <PublicSite page="contact" />} />
    <Route path="/free-audit" component={() => <PublicSite page="free-audit" />} />
    <Route path="/crm" component={() => <PrivateRoute><ModulePage module="crm" /></PrivateRoute>} />
    <Route path="/clients" component={() => <PrivateRoute><ModulePage module="clients" /></PrivateRoute>} />
    <Route path="/campaigns" component={() => <PrivateRoute><ModulePage module="campaigns" /></PrivateRoute>} />
    <Route path="/social" component={() => <PrivateRoute><ModulePage module="social" /></PrivateRoute>} />
    <Route path="/content" component={() => <PrivateRoute><ModulePage module="content" /></PrivateRoute>} />
    <Route path="/tasks" component={() => <PrivateRoute><ModulePage module="tasks" /></PrivateRoute>} />
    <Route path="/calendar" component={() => <PrivateRoute><ModulePage module="calendar" /></PrivateRoute>} />
    <Route path="/pr-media" component={() => <PrivateRoute><ModulePage module="pr-media" /></PrivateRoute>} />
    <Route path="/influencers" component={() => <PrivateRoute><ModulePage module="influencers" /></PrivateRoute>} />
    <Route path="/analytics" component={() => <PrivateRoute><ModulePage module="analytics" /></PrivateRoute>} />
    <Route path="/reports" component={() => <PrivateRoute><ModulePage module="reports" /></PrivateRoute>} />
    <Route path="/invoices" component={() => <PrivateRoute><ModulePage module="invoices" /></PrivateRoute>} />
    <Route path="/files" component={() => <PrivateRoute><UtilityPage page="files" /></PrivateRoute>} />
    <Route path="/messages" component={() => <PrivateRoute><UtilityPage page="messages" /></PrivateRoute>} />
    <Route path="/settings" component={() => <PrivateRoute><UtilityPage page="settings" /></PrivateRoute>} />
    <Route path="/inquiries" component={() => <PrivateRoute><UtilityPage page="inquiries" /></PrivateRoute>} />
    <Route component={() => <PublicSite page="about" />} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster position="bottom-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
