import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { deleteProject, listMyProjects, type CanopyProject } from "@/lib/api";
import { useAuth } from "@/contexts/AuthProvider";

export default function MyDashboard() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [projects, setProjects] = useState<CanopyProject[]>([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  const refresh = async () => {
    try {
      const res = await listMyProjects();
      setProjects(res.projects);
    } catch {
      /* ignore */
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (user) void refresh();
  }, [user]);

  const remove = async (id: number) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      await deleteProject(id);
      toast.success("Deleted");
      void refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete");
    }
  };

  if (loading || !user) {
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
      <main className="container py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-extrabold md:text-4xl">Hi, {user.name}</h1>
            <p className="mt-1 text-sm text-black/60">Manage your Canopy projects.</p>
          </div>
          <Button asChild variant="dark" className="rounded-full">
            <Link href="/submit">
              <Plus className="size-4" /> New project
            </Link>
          </Button>
        </motion.div>

        <div className="mt-10">
          {listLoading ? (
            <p className="text-sm text-black/50">Loading…</p>
          ) : projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-black/15 bg-white p-12 text-center">
              <p className="text-lg font-semibold">No projects yet</p>
              <p className="mt-1 text-sm text-black/60">
                Post your first project so others can discover you.
              </p>
              <Button asChild className="mt-6 rounded-full">
                <Link href="/submit">Post your project</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {projects.map((p, i) => (
                <li key={p.id} className="flex items-start gap-4">
                  <div className="flex-1">
                    <ProjectCard project={p} index={i} />
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/submit?id=${p.id}`}>
                        <Edit3 className="size-4" /> Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => remove(p.id)}
                    >
                      <Trash2 className="size-4" /> Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
