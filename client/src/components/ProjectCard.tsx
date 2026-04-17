import { Link } from "wouter";
import { MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { CanopyProject } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
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

export function ProjectCard({ project, index = 0 }: { project: CanopyProject; index?: number }) {
  const stage = project.stage ? STAGE_LABEL[project.stage] : null;
  const tilt = (index % 5) - 2; // -2..2 deg, deterministic per-card
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3 }}
      className="group relative tape-corner"
      style={{ transform: `rotate(${tilt * 0.4}deg)` }}
    >
      <Link
        href={`/project/${project.id}`}
        className="block h-full rounded-2xl border border-black/10 bg-[var(--card)] p-6 shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] transition-all hover:border-black/30 hover:-translate-y-1 hover:shadow-[0_2px_0_rgba(0,0,0,0.06),0_16px_32px_-12px_rgba(0,0,0,0.18)] hover:rotate-0"
      >
        <div className="flex items-start gap-4">
          {project.logoUrl ? (
            <img
              src={project.logoUrl}
              alt=""
              className="size-14 rounded-2xl object-cover border border-black/10"
            />
          ) : (
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[oklch(0.88_0.17_90)] text-black font-bold text-lg">
              {initials(project.name)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-bold text-lg leading-tight">{project.name}</h3>
              {stage && (
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", stage.cls)}>
                  {stage.label}
                </span>
              )}
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-black/70">{project.tagline}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-black/60">
          {project.city && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {project.city}
            </span>
          )}
          {project.lookingFor && (
            <span className="inline-flex items-center gap-1 capitalize">
              <span className="text-black/40">looking for</span>
              <span className="font-medium text-black/80">{project.lookingFor}</span>
            </span>
          )}
          {typeof project.reactionCount === "number" && project.reactionCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <Heart className="size-3.5 text-[oklch(0.55_0.14_155)]" />
              {project.reactionCount}
            </span>
          )}
        </div>

        {project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="font-normal">
                #{tag}
              </Badge>
            ))}
            {project.tags.length > 4 && (
              <Badge variant="outline" className="font-normal text-black/50">
                +{project.tags.length - 4}
              </Badge>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
