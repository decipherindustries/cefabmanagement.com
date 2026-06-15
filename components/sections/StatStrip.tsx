import type { Dictionary } from "@/content";

export function StatStrip({ dict }: { dict: Dictionary }) {
  return (
    <div className="ck-stats">
      {dict.about.stats.map((s) => (
        <div className="ck-stat" key={s.label}>
          <div className="ck-stat__value">{s.value}</div>
          <div className="ck-stat__label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
