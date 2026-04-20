import { Route, Switch } from "wouter";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthProvider";
import Browse from "@/pages/Browse";
import Project from "@/pages/Project";
import Submit from "@/pages/Submit";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import MyDashboard from "@/pages/MyDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Browse} />
      <Route path="/project/:id" component={Project} />
      <Route path="/submit" component={Submit} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/me" component={MyDashboard} />
      <Route>
        <main className="container py-16">
          <h1 className="text-2xl font-bold">Not found</h1>
        </main>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router />
      <Analytics />
    </AuthProvider>
  );
}
