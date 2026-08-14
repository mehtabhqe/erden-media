import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ModulePage from "./pages/ModulePage";
import PublicSite from "./pages/PublicSite";

function Router() {
  return <Switch>
    <Route path="/" component={() => <PublicSite />} />
    <Route path="/desk" component={Home} />
    <Route path="/services" component={() => <PublicSite page="services" />} />
    <Route path="/portfolio" component={() => <PublicSite page="portfolio" />} />
    <Route path="/case-studies" component={() => <PublicSite page="case-studies" />} />
    <Route path="/blog" component={() => <PublicSite page="blog" />} />
    <Route path="/about" component={() => <PublicSite page="about" />} />
    <Route path="/tools/roi-calculator" component={() => <PublicSite page="roi" />} />
    <Route path="/contact" component={() => <PublicSite page="contact" />} />
    <Route path="/free-audit" component={() => <PublicSite page="free-audit" />} />
    <Route path="/crm" component={() => <ModulePage module="crm" />} />
    <Route path="/clients" component={() => <ModulePage module="clients" />} />
    <Route path="/campaigns" component={() => <ModulePage module="campaigns" />} />
    <Route path="/social" component={() => <ModulePage module="social" />} />
    <Route path="/content" component={() => <ModulePage module="content" />} />
    <Route path="/tasks" component={() => <ModulePage module="tasks" />} />
    <Route path="/calendar" component={() => <ModulePage module="calendar" />} />
    <Route path="/pr-media" component={() => <ModulePage module="pr-media" />} />
    <Route path="/influencers" component={() => <ModulePage module="influencers" />} />
    <Route path="/analytics" component={() => <ModulePage module="analytics" />} />
    <Route path="/reports" component={() => <ModulePage module="reports" />} />
    <Route path="/invoices" component={() => <ModulePage module="invoices" />} />
    <Route component={() => <PublicSite page="about" />} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster position="bottom-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
