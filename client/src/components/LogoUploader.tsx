import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { buildUrl } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export function LogoUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handle = async (file: File) => {
    setUploading(true);
    try {
      const token = getStoredToken();
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(buildUrl("/api/canopy/uploads/image").toString(), {
        method: "POST",
        body: fd,
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `upload failed (${res.status})`);
      }
      const { url } = (await res.json()) as { url: string };
      onChange(url);
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-20 overflow-hidden rounded-2xl border border-black/10 bg-[oklch(0.97_0_0)]">
        {value ? (
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-black/30">
            <ImagePlus className="size-7" />
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
            <Loader2 className="size-5 animate-spin" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold hover:border-black/40"
        >
          {value ? "Replace logo" : "Upload logo"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="ml-2 inline-flex items-center gap-1 text-xs text-black/50 hover:text-destructive"
          >
            <X className="size-3.5" /> Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handle(f);
            e.target.value = "";
          }}
        />
        <p className="text-[11px] text-black/40">PNG, JPG, SVG — up to 5 MB.</p>
      </div>
    </div>
  );
}
