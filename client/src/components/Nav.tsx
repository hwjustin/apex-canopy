import { Link, useLocation } from "wouter";
import { LogIn, LogOut, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";

export function Nav({ tagline }: { tagline?: string }) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-lg shrink-0">
            <span>
              Canopy<span className="text-[oklch(0.55_0.14_155)]">.</span>Meetup
            </span>
            <span className="text-sm font-medium text-black/50">by</span>
            <img src="/images/apex-logo.png" alt="APEX" className="h-7 w-auto" />
          </Link>
          {tagline ? (
            <span className="hidden lg:inline-block truncate border-l border-black/10 pl-3 text-sm text-black/60">
              {tagline}
            </span>
          ) : null}
        </div>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="dark"
                size="sm"
                onClick={() => navigate("/submit")}
                className="rounded-full"
              >
                <Plus className="size-4" /> Post your project
              </Button>
              <Button variant="ghost" size="sm" asChild className="rounded-full">
                <Link href="/me">
                  <User className="size-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={logout} title="Log out">
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="size-4" /> Sign in
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild className="rounded-full">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
