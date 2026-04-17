import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toggleReaction } from "@/lib/api";
import { useAuth } from "@/contexts/AuthProvider";

const REACTIONS: { kind: string; emoji: string; label: string }[] = [
  { kind: "wave", emoji: "👋", label: "Wave" },
  { kind: "collab", emoji: "🤝", label: "Want to collab" },
  { kind: "interesting", emoji: "💡", label: "Interesting" },
];

type Props = {
  projectId: number;
  counts: Record<string, number>;
  myReactions: string[];
  onChange?: () => void;
};

export function ReactionBar({ projectId, counts, myReactions, onChange }: Props) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [pending, setPending] = useState<string | null>(null);
  const [localCounts, setLocalCounts] = useState(counts);
  const [localMine, setLocalMine] = useState<Set<string>>(new Set(myReactions));

  const handle = async (kind: string) => {
    if (!user) {
      toast("Sign in to react");
      navigate("/login");
      return;
    }
    if (pending) return;
    setPending(kind);
    try {
      const res = await toggleReaction(projectId, kind);
      setLocalMine((prev) => {
        const next = new Set(prev);
        if (res.active) next.add(kind);
        else next.delete(kind);
        return next;
      });
      setLocalCounts((prev) => ({
        ...prev,
        [kind]: Math.max(0, (prev[kind] ?? 0) + (res.active ? 1 : -1)),
      }));
      onChange?.();
    } catch (err: any) {
      toast.error(err?.message || "Failed to react");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {REACTIONS.map(({ kind, emoji, label }) => {
        const active = localMine.has(kind);
        const count = localCounts[kind] ?? 0;
        return (
          <button
            key={kind}
            type="button"
            onClick={() => handle(kind)}
            disabled={pending === kind}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
              active
                ? "border-black bg-black text-white"
                : "border-black/15 bg-white text-black hover:border-black/40",
            )}
          >
            <span className="text-base leading-none">{emoji}</span>
            <span>{label}</span>
            {count > 0 && (
              <span className={cn("text-xs font-semibold", active ? "text-white/80" : "text-black/60")}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
