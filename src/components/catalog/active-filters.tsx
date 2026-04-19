"use client";
interface ActiveFiltersProps {
  filters: string[];
  sort: string;
  onRemoveFilter: (filter: string) => void;
  onSortChange: (sort: string) => void;
}

export function ActiveFilters({ filters, sort, onRemoveFilter, onSortChange }: ActiveFiltersProps) {
  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
      <div className="flex gap-1.5 flex-wrap">
        {filters.map((f) => (
          <div key={f} className="flex items-center gap-1.5 bg-navy text-white px-2.5 py-1 text-xs">
            {f}
            <span className="cursor-pointer text-sm opacity-70 hover:opacity-100" onClick={() => onRemoveFilter(f)}>×</span>
          </div>
        ))}
      </div>
      <select value={sort} onChange={(e) => onSortChange(e.target.value)} className="font-sans text-[13px] px-3 py-2 border-[1.5px] border-site-border bg-white outline-none cursor-pointer">
        {["Terbaru", "Harga ↑", "Harga ↓"].map((s) => (<option key={s} value={s}>{s}</option>))}
      </select>
    </div>
  );
}
