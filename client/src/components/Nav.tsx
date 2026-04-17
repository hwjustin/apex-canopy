import { Link, useLocation } from "wouter";
import { LogIn, LogOut, Plus, User, TreePine } from "lucide-react";
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
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-[oklch(0.55_0.14_155)] text-white">
              <TreePine className="size-5" />
            </span>
            <span>
              Canopy<span className="text-[oklch(0.55_0.14_155)]">.</span>Meetup
            </span>
          </Link>
          {tagline ? (
            <span className="hidden lg:inline-block truncate border-l border-black/10 pl-3 text-sm text-black/60">
              {tagline}
            </span>
          ) : null}
        </div>

        <nav className="flex items-center gap-2">
          <Link href="/" className="hidden sm:inline-block text-sm font-medium text-black/70 hover:text-black px-3">
            Browse
          </Link>
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
                <Link href="/register">Join Canopy</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
