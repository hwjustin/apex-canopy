import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Trash2, X } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LogoUploader } from "@/components/LogoUploader";
import {
  createProject,
  deleteProject,
  getProject,
  updateProject,
  type ProjectInput,
  type ProjectType,
  type Region,
  type Stage,
} from "@/lib/api";
import { PROJECT_TYPE_OPTIONS, REGION_OPTIONS, STAGE_OPTIONS } from "@/lib/taxonomies";
import { useAuth } from "@/contexts/AuthProvider";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  tagline: string;
  description: string;
  city: string;
  region: Region | "";
  projectType: ProjectType | "";
  teamIntro: string;
  stage: Stage | "";
  lookingFor: string;
  logoUrl: string | null;
  website: string;
  twitter: string;
  linkedin: string;
  emailContact: string;
  tags: string[];
};

const empty: FormState = {
  name: "",
  tagline: "",
  description: "",
  city: "",
  region: "",
  projectType: "",
  teamIntro: "",
  stage: "",
  lookingFor: "",
  logoUrl: null,
  website: "",
  twitter: "",
  linkedin: "",
  emailContact: "",
  tags: [],
};

const LOOKING_FOR = [
  { key: "co-founder", label: "Co-founder" },
  { key: "users", label: "Early users" },
  { key: "advice", label: "Advice" },
  { key: "partnerships", label: "Partnerships" },
];

export default function Submit() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const editingId = useMemo(() => {
    const params = new URLSearchParams(searchString);
    const id = Number(params.get("id"));
    return Number.isFinite(id) && id > 0 ? id : null;
  }, [searchString]);

  const [form, setForm] = useState<FormState>(empty);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingProject, setLoadingProject] = useState(Boolean(editingId));

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!editingId) return;
    void (async () => {
      try {
        const res = await getProject(editingId);
        const p = res.project;
        setForm({
          name: p.name,
          tagline: p.tagline,
          description: p.description ?? "",
          city: p.city ?? "",
          region: (p.region ?? "") as FormState["region"],
          projectType: (p.projectType ?? "") as FormState["projectType"],
          teamIntro: p.teamIntro ?? "",
          stage: (p.stage ?? "") as FormState["stage"],
          lookingFor: p.lookingFor ?? "",
          logoUrl: p.logoUrl,
          website: p.website ?? "",
          twitter: p.twitter ?? "",
          linkedin: p.linkedin ?? "",
          emailContact: p.emailContact ?? "",
          tags: p.tags,
        });
      } catch (err: any) {
        toast.error(err?.message || "Failed to load project");
        navigate("/me");
      } finally {
        setLoadingProject(false);
      }
    })();
  }, [editingId, navigate]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t) return;
    setForm((prev) =>
      prev.tags.includes(t) ? prev : { ...prev, tags: [...prev.tags, t].slice(0, 15) },
    );
    setTagInput("");
  };

  const removeTag = (t: string) =>
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.tagline.trim()) {
      toast.error("Name and tagline are required");
      return;
    }
    setSubmitting(true);
    try {
      const body: ProjectInput = {
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        description: form.description.trim() || undefined,
        city: form.city.trim() || undefined,
        region: (form.region || undefined) as Region | undefined,
        projectType: (form.projectType || undefined) as ProjectType | undefined,
        teamIntro: form.teamIntro.trim() || undefined,
        stage: (form.stage || undefined) as Stage | undefined,
        lookingFor: form.lookingFor || undefined,
        logoUrl: form.logoUrl || undefined,
        website: form.website.trim() || undefined,
        twitter: form.twitter.trim() || undefined,
        linkedin: form.linkedin.trim() || undefined,
        emailContact: form.emailContact.trim() || undefined,
        tags: form.tags,
      };
      if (editingId) {
        const res = await updateProject(editingId, body);
        toast.success("Project updated");
        navigate(`/project/${res.project.id}`);
      } else {
        const res = await createProject(body);
        toast.success("Project posted!");
        navigate(`/project/${res.project.id}`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (!editingId) return;
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      await deleteProject(editingId);
      toast.success("Deleted");
      navigate("/me");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete");
    }
  };

  if (loading || loadingProject) {
    return (
      <>
        <Nav />
        <main className="container py-16 text-sm text-black/50">Loading…</main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="container max-w-3xl py-10 md:py-14">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href={editingId ? `/project/${editingId}` : "/"}>
            <ArrowLeft className="size-4" /> Back
          </Link>
        </Button>

        <h1 className="text-3xl font-extrabold md:text-4xl">
          {editingId ? "Edit project" : "Post your project"}
        </h1>
        <p className="mt-2 text-sm text-black/60">
          Share what you're building so other founders can find and connect with you.
        </p>

        <form onSubmit={submit} className="mt-10 space-y-8">
          <div className="space-y-2">
            <Label>Logo</Label>
            <LogoUploader value={form.logoUrl} onChange={(v) => set("logoUrl", v)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Project name *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Tagline * <span className="text-black/40 font-normal">(one line)</span></Label>
              <Input
                value={form.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                maxLength={120}
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={5}
                placeholder="What are you building, why, and what's the current state?"
              />
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="San Francisco"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Region</Label>
              <select
                value={form.region}
                onChange={(e) => set("region", e.target.value as FormState["region"])}
                className="h-10 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
              >
                <option value="">—</option>
                {REGION_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Project type</Label>
              <select
                value={form.projectType}
                onChange={(e) => set("projectType", e.target.value as FormState["projectType"])}
                className="h-10 w-full rounded-md border border-black/15 bg-white px-3 text-sm"
              >
                <option value="">—</option>
                {PROJECT_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Stage</Label>
              <div className="flex flex-wrap gap-1.5">
                {STAGE_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => set("stage", form.stage === s.value ? "" : s.value)}
                    className={cn(form.stage === s.value ? "canopy-chip-active" : "canopy-chip")}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Team intro <span className="text-black/40 font-normal">(who's building this)</span></Label>
              <Textarea
                value={form.teamIntro}
                onChange={(e) => set("teamIntro", e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Two ex-Stripe engineers + one designer from Figma…"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Looking for</Label>
              <div className="flex flex-wrap gap-1.5">
                {LOOKING_FOR.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => set("lookingFor", form.lookingFor === s.key ? "" : s.key)}
                    className={cn(form.lookingFor === s.key ? "canopy-chip-active" : "canopy-chip")}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Tags / interests</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="ai, devtools, consumer… (press Enter)"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {form.tags.map((t) => (
                    <span key={t} className="canopy-chip-active">
                      #{t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        aria-label="Remove"
                        className="-mr-1 ml-0.5 inline-flex size-4 items-center justify-center rounded-full hover:bg-white/20"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold">Contact links <span className="font-normal text-black/50">(at least one helps people reach you)</span></h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Twitter / X</Label>
                <Input
                  value={form.twitter}
                  onChange={(e) => set("twitter", e.target.value)}
                  placeholder="@yourhandle"
                />
              </div>
              <div className="space-y-1.5">
                <Label>LinkedIn</Label>
                <Input
                  value={form.linkedin}
                  onChange={(e) => set("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/…"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Website</Label>
                <Input
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                  placeholder="yoursite.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Contact email</Label>
                <Input
                  type="email"
                  value={form.emailContact}
                  onChange={(e) => set("emailContact", e.target.value)}
                  placeholder="you@domain.com"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-black/10 pt-6">
            <div>
              {editingId && (
                <Button type="button" variant="ghost" onClick={remove} className="text-destructive">
                  <Trash2 className="size-4" /> Delete project
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="lg" className="rounded-full" onClick={() => navigate("/me")}>
                Cancel
              </Button>
              <Button type="submit" variant="dark" size="lg" className="rounded-full" disabled={submitting}>
                {submitting ? "Saving…" : editingId ? "Save changes" : "Publish project"}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
