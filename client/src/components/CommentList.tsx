import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthProvider";
import { deleteComment, postComment, type CanopyComment } from "@/lib/api";

type Props = {
  projectId: number;
  comments: CanopyComment[];
  onChange: () => void;
};

export function CommentList({ projectId, comments, onChange }: Props) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    const text = body.trim();
    if (!text) return;
    setSubmitting(true);
    try {
      await postComment(projectId, text);
      setBody("");
      onChange();
    } catch (err: any) {
      toast.error(err?.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await deleteComment(id);
      onChange();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="space-y-3">
        <Textarea
          placeholder={
            user ? "Share a thought, question, or say hi…" : "Sign in to leave a comment."
          }
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          disabled={!user || submitting}
        />
        <div className="flex justify-end">
          <Button type="submit" variant="dark" size="sm" disabled={!user || submitting || !body.trim()}>
            {user ? (submitting ? "Posting…" : "Post comment") : "Sign in to comment"}
          </Button>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="text-sm text-black/50">No comments yet. Be the first to say hi.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{c.userName ?? "Anonymous"}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-black/50">{c.createdAt ?? ""}</span>
                  {user && user.id === c.userId && (
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      className="text-black/40 hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-black/80">{c.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
