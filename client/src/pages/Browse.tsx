import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowUpRight, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Nav } from "@/components/Nav";
import { ProjectCard } from "@/components/ProjectCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { getCities, getTags, listProjects, type CanopyProject } from "@/lib/api";
import { useAuth } from "@/contexts/AuthProvider";

export default function Browse() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<CanopyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    stage: "",
    tag: "",
    lookingFor: "",
    sort: "newest",
  });
  const [cities, setCities] = useState<string[]>([]);
  const [tags, setTags] = useState<{ tag: string; count: number }[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const [c, t] = await Promise.all([getCities(), getTags()]);
        setCities(c.cities);
        setTags(t.tags);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  useEffect(() => {
    setLoading(true);
    void (async () => {
      try {
        const res = await listProjects({
          search: search || undefined,
          city: filters.city || undefined,
          stage: filters.stage || undefined,
          tag: filters.tag || undefined,
          lookingFor: filters.lookingFor || undefined,
          sort: filters.sort,
        });
        setProjects(res.projects);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [search, filters]);

  const count = projects.length;

  const empty = useMemo(
    () =>
      !loading && count === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/15 bg-white p-12 text-center">
          <Sparkles className="mx-auto size-8 text-black/30" />
          <p className="mt-4 text-lg font-semibold">No projects match your filters.</p>
          <p className="mt-1 text-sm text-black/60">
            Try clearing filters, or{" "}
            <Link href={user ? "/submit" : "/register"} className="underline underline-offset-4">
              be the first to post.
            </Link>
          </p>
        </div>
      ) : null,
    [loading, count, user],
  );

  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-20 size-72 rounded-full bg-[oklch(0.88_0.17_90/0.35)] blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 right-0 size-96 rounded-full bg-[oklch(0.55_0.14_155/0.18)] blur-3xl"
        />
        <div className="container relative grid gap-10 py-14 md:grid-cols-[1.3fr_1fr] md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium">
              <span className="size-1.5 rounded-full bg-[oklch(0.55_0.14_155)]" />
              Canopy accelerator · Founder directory
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
              Find your cohort.
              <br />
              <span className="bg-[oklch(0.88_0.17_90)] px-2">Share what you're building.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-black/70 md:text-lg">
              A lightweight directory for founders in the Canopy accelerator. Post your project,
              share your contact, browse by city or interest, react, and start a conversation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href={user ? "/submit" : "/register"}>
                  Post your project <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <a href="#grid">Browse founders</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="relative hidden md:block"
          >
            <div className="absolute inset-0 rotate-3 rounded-3xl bg-[oklch(0.88_0.17_90)]" />
            <div className="relative m-2 rounded-3xl border border-black/10 bg-white p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-[oklch(0.55_0.14_155)]" />
                <div>
                  <div className="font-bold">Your Startup</div>
                  <div className="text-xs text-black/50">San Francisco · Prototype</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-black/70">
                "We're building a …. Looking for early users and technical feedback."
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="canopy-chip">#ai</span>
                <span className="canopy-chip">#devtools</span>
                <span className="canopy-chip">👋 3</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search + grid */}
      <section id="grid" className="py-10 md:py-14">
        <div className="container">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSearch(searchInput.trim());
              }}
              className="relative flex-1 max-w-xl"
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-black/40" />
              <Input
                placeholder="Search projects, tags, cities…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onBlur={() => setSearch(searchInput.trim())}
                className="pl-9 h-11 rounded-full"
              />
            </form>
            <div className="text-sm text-black/60">
              {loading ? "Loading…" : `${count} project${count === 1 ? "" : "s"}`}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <FilterSidebar value={filters} onChange={setFilters} cities={cities} tags={tags} />
            <div>
              {empty}
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {projects.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 py-10 text-center text-xs text-black/50">
        Built with 🌳 by the APEX team · Canopy cohort · {new Date().getFullYear()}
      </footer>
    </>
  );
}
