import { cn } from "@/lib/utils";
import { PROJECT_TYPE_OPTIONS, REGION_OPTIONS, STAGE_OPTIONS } from "@/lib/taxonomies";

type FilterValues = {
  city: string;
  region: string;
  projectType: string;
  stage: string;
  tag: string;
  lookingFor: string;
  sort: string;
};

type Props = {
  value: FilterValues;
  onChange: (next: FilterValues) => void;
  cities: string[];
  tags: { tag: string; count: number }[];
};

const LOOKING_FOR = [
  { key: "co-founder", label: "Co-founder" },
  { key: "users", label: "Early users" },
  { key: "advice", label: "Advice" },
  { key: "partnerships", label: "Partnerships" },
];

export function FilterSidebar({ value, onChange, cities, tags }: Props) {
  const set = <K extends keyof FilterValues>(k: K, v: FilterValues[K]) =>
    onChange({ ...value, [k]: v });

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-black/50">{title}</h4>
      {children}
    </div>
  );

  const Chip = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(active ? "canopy-chip-active" : "canopy-chip")}
    >
      {children}
    </button>
  );

  return (
    <aside className="space-y-6 rounded-3xl border border-black/10 bg-white p-6 lg:sticky lg:top-20">
      <Section title="Sort">
        <div className="flex flex-wrap gap-1.5">
          <Chip active={value.sort !== "reactions"} onClick={() => set("sort", "newest")}>
            Newest
          </Chip>
          <Chip active={value.sort === "reactions"} onClick={() => set("sort", "reactions")}>
            Most reactions
          </Chip>
        </div>
      </Section>

      <Section title="Stage">
        <div className="flex flex-wrap gap-1.5">
          {STAGE_OPTIONS.map((s) => (
            <Chip
              key={s.value}
              active={value.stage === s.value}
              onClick={() => set("stage", value.stage === s.value ? "" : s.value)}
            >
              {s.label}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Region">
        <div className="flex flex-wrap gap-1.5">
          {REGION_OPTIONS.map((r) => (
            <Chip
              key={r.value}
              active={value.region === r.value}
              onClick={() => set("region", value.region === r.value ? "" : r.value)}
            >
              {r.label}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Project type">
        <select
          value={value.projectType}
          onChange={(e) => set("projectType", e.target.value)}
          className="h-9 w-full rounded-md border border-black/15 bg-white px-2 text-sm"
        >
          <option value="">Any type</option>
          {PROJECT_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </Section>

      <Section title="Looking for">
        <div className="flex flex-wrap gap-1.5">
          {LOOKING_FOR.map((s) => (
            <Chip
              key={s.key}
              active={value.lookingFor === s.key}
              onClick={() => set("lookingFor", value.lookingFor === s.key ? "" : s.key)}
            >
              {s.label}
            </Chip>
          ))}
        </div>
      </Section>

      {cities.length > 0 && (
        <Section title="City">
          <div className="flex max-h-48 flex-wrap gap-1.5 overflow-auto">
            {cities.map((c) => (
              <Chip
                key={c}
                active={value.city === c}
                onClick={() => set("city", value.city === c ? "" : c)}
              >
                {c}
              </Chip>
            ))}
          </div>
        </Section>
      )}

      {tags.length > 0 && (
        <Section title="Interests">
          <div className="flex max-h-48 flex-wrap gap-1.5 overflow-auto">
            {tags.map((t) => (
              <Chip
                key={t.tag}
                active={value.tag === t.tag}
                onClick={() => set("tag", value.tag === t.tag ? "" : t.tag)}
              >
                #{t.tag}
                <span className="text-black/40">{t.count}</span>
              </Chip>
            ))}
          </div>
        </Section>
      )}

      {(value.city || value.region || value.projectType || value.stage || value.tag || value.lookingFor) && (
        <button
          type="button"
          onClick={() =>
            onChange({ city: "", region: "", projectType: "", stage: "", tag: "", lookingFor: "", sort: value.sort })
          }
          className="text-xs font-medium text-black/60 underline underline-offset-4 hover:text-black"
        >
          Clear filters
        </button>
      )}
    </aside>
  );
}
