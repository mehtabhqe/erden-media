import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Link, Route, Switch } from "wouter";
import { useAuth } from "./_core/hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ModulePage from "./pages/ModulePage";
import PublicSite from "./pages/PublicSite";
import UtilityPage from "./pages/UtilityPage";

function AdminLogin({ refresh }: { refresh: () => Promise<unknown> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Unable to sign in");
      }
      await refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return <div className="private-gate"><span className="section-kicker">EARDEN MEDIA / PRIVATE</span><h1>The operating desk is for the team.</h1><p>Sign in to access clients, campaigns, approvals, reporting, and workspace settings.</p><form className="private-login-form" onSubmit={submit}><label>Username<input required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} /></label><label>Password<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="public-button public-button--dark" type="submit" disabled={submitting}>{submitting ? "Signing in…" : "Sign in to the desk"}</button></form><Link className="public-button" href="/">Back to the public site</Link></div>;
}

function PrivateAccess({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated, refresh } = useAuth();
  if (loading) return <div className="private-gate"><span className="section-kicker">EARDEN MEDIA / PRIVATE</span><h1>Checking workspace access.</h1><p>One moment while we verify your session.</p></div>;
  if (!isAuthenticated) return <AdminLogin refresh={refresh} />;
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
