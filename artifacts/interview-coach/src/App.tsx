import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/context/session-context";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";

import HomeScreen from "@/pages/home";
import InterviewScreen from "@/pages/interview";
import SessionSummary from "@/pages/summary";
import JDInterview from "@/pages/jd-interview";
import Dashboard from "@/pages/dashboard";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomeScreen} />
        <Route path="/interview" component={InterviewScreen} />
        <Route path="/summary" component={SessionSummary} />
        <Route path="/jd" component={JDInterview} />
        <Route path="/sessions/:sessionId" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SessionProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </SessionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
