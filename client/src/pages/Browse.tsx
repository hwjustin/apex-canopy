import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Search, Sparkles } from "lucide-react";
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
          <p className="mt-4 text-lg font-semibold">nothing here yet.</p>
          <p className="mt-1 text-sm text-black/60">
            clear a filter, or{" "}
            <Link href={user ? "/submit" : "/register"} className="underline underline-offset-4">
              pin something first.
            </Link>
          </p>
        </div>
      ) : null,
    [loading, count, user],
  );

  return (
    <>
      <Nav tagline="A chill founder directory for Canopy at Founders, Inc." />

      <section className="paper-grain border-b border-black/5">
        <div className="container py-7 md:py-9">
          <div className="flex flex-col items-start gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[oklch(0.88_0.17_90)]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-black">
              <span className="size-1.5 rounded-full bg-black" />
              unofficial · made with love
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              not the official directory — just where the cohort actually hangs.
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-black/60">
              pin what you're cooking, see who's around, slide into a DM. no pitch decks, no kpis — just builders.
            </p>
          </div>
        </div>
      </section>

      {/* Search + grid */}
      <section id="grid" className="py-8 md:py-10">
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
                placeholder="search projects, tags, cities…"
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
              <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3 pt-3">
                {projects.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 py-10 text-center text-xs text-black/50">
        Built with 🌳 by the APEX team · Canopy at Founders, Inc. · {new Date().getFullYear()}
      </footer>
    </>
  );
}
