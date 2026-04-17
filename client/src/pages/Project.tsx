import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit3,
  ExternalLink,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
} from "lucide-react";
import { Nav } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReactionBar } from "@/components/ReactionBar";
import { CommentList } from "@/components/CommentList";
import { ProjectCard } from "@/components/ProjectCard";
import {
  getProject,
  listProjects,
  type CanopyProject,
  type ProjectDetailResponse,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthProvider";
import { cn } from "@/lib/utils";

const STAGE_LABEL: Record<string, { label: string; cls: string }> = {
  idea: { label: "Idea", cls: "canopy-stage-idea" },
  prototype: { label: "Prototype", cls: "canopy-stage-prototype" },
  launched: { label: "Launched", cls: "canopy-stage-launched" },
  funded: { label: "Funded", cls: "canopy-stage-funded" },
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function Project() {
  const [, params] = useRoute("/project/:id");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const id = Number(params?.id);
  const [data, setData] = useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [similar, setSimilar] = useState<CanopyProject[]>([]);

  const refresh = async () => {
    try {
      const res = await getProject(id);
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    setLoading(true);
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!data) return;
    const firstTag = data.project.tags[0];
    if (!firstTag) return;
    void (async () => {
      try {
        const res = await listProjects({ tag: firstTag });
        setSimilar(res.projects.filter((p) => p.id !== data.project.id).slice(0, 3));
      } catch {
        /* ignore */
      }
    })();
  }, [data]);

  const stage = useMemo(
    () => (data?.project.stage ? STAGE_LABEL[data.project.stage] : null),
    [data],
  );

  if (!Number.isFinite(id)) return null;

  if (loading) {
    return (
      <>
        <Nav />
        <main className="container py-16 text-sm text-black/50">Loading…</main>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Nav />
        <main className="container py-16">
          <p className="text-black/60">Project not found.</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/">← Back to browse</Link>
          </Button>
        </main>
      </>
    );
  }

  const { project, author, reactions, myReactions, comments } = data;
  const isOwner = user && author && user.id === author.id;

  const contact: { href: string; icon: React.ElementType; label: string }[] = [];
  if (project.twitter) {
    const handle = project.twitter.replace(/^@/, "");
    contact.push({
      href: handle.startsWith("http") ? handle : `https://twitter.com/${handle}`,
      icon: Twitter,
      label: `@${handle}`,
    });
  }
  if (project.linkedin) {
    const url = project.linkedin.startsWith("http")
      ? project.linkedin
      : `https://${project.linkedin}`;
    contact.push({ href: url, icon: Linkedin, label: "LinkedIn" });
  }
  if (project.website) {
    const url = project.website.startsWith("http") ? project.website : `https://${project.website}`;
    contact.push({ href: url, icon: Globe, label: "Website" });
  }
  if (project.emailContact) {
    contact.push({
      href: `mailto:${project.emailContact}`,
      icon: Mail,
      label: project.emailContact,
    });
  }

  return (
    <>
      <Nav />
      <main className="container py-10 md:py-14">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link href="/">
            <ArrowLeft className="size-4" /> Back
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-8 lg:grid-cols-[1fr_320px]"
        >
          <div>
            <div className="flex items-start gap-5">
              {project.logoUrl ? (
                <img
                  src={project.logoUrl}
                  alt=""
                  className="size-20 rounded-3xl border border-black/10 object-cover"
                />
              ) : (
                <div className="flex size-20 items-center justify-center rounded-3xl bg-[oklch(0.88_0.17_90)] text-2xl font-bold">
                  {initials(project.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-extrabold md:text-4xl">{project.name}</h1>
                  {stage && (
                    <span
                      className={cn("rounded-full px-3 py-0.5 text-xs font-semibold", stage.cls)}
                    >
                      {stage.label}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-lg text-black/75">{project.tagline}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-black/60">
                  {project.city && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-4" /> {project.city}
                    </span>
                  )}
                  {author && <span>by {author.name}</span>}
                  {project.lookingFor && (
                    <span className="capitalize">
                      <span className="text-black/40">looking for</span>{" "}
                      <span className="font-medium text-black/80">{project.lookingFor}</span>
                    </span>
                  )}
                </div>
              </div>
              {isOwner && (
                <Button variant="outline" size="sm" onClick={() => navigate(`/submit?id=${project.id}`)}>
                  <Edit3 className="size-4" /> Edit
                </Button>
              )}
            </div>

            {project.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.tags.map((t) => (
                  <Badge key={t} variant="outline" className="font-normal">
                    #{t}
                  </Badge>
                ))}
              </div>
            )}

            {project.description && (
              <div className="mt-8 whitespace-pre-wrap rounded-3xl border border-black/10 bg-white p-6 text-[15px] leading-relaxed text-black/80">
                {project.description}
              </div>
            )}

            <div className="mt-8">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-black/50">
                Say hi
              </h2>
              <ReactionBar
                projectId={project.id}
                counts={reactions}
                myReactions={myReactions}
                onChange={refresh}
              />
            </div>

            <div className="mt-10">
              <h2 className="mb-4 text-lg font-bold">
                Comments{" "}
                <span className="text-sm font-normal text-black/50">({comments.length})</span>
              </h2>
              <CommentList projectId={project.id} comments={comments} onChange={refresh} />
            </div>
          </div>

          <aside className="space-y-6">
            {contact.length > 0 ? (
              <div className="rounded-3xl border border-black/10 bg-white p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-black/50">
                  Connect
                </h3>
                <div className="mt-4 space-y-2">
                  {contact.map(({ href, icon: Icon, label }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium transition-colors hover:border-black/30"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="size-4" /> {label}
                      </span>
                      <ExternalLink className="size-3.5 text-black/40" />
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-black/15 p-6 text-sm text-black/50">
                No public contact links. Leave a comment to say hi.
              </div>
            )}

            {similar.length > 0 && (
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-black/50">
                  Similar founders
                </h3>
                <div className="space-y-3">
                  {similar.map((s, i) => (
                    <ProjectCard key={s.id} project={s} index={i} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </motion.div>
      </main>
    </>
  );
}
