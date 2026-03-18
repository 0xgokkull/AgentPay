const STATS = [
  { value: "70/20/10", label: "Default split simulation" },
  { value: "1 agent", label: "One vault, one identity" },
  { value: "100%", label: "Policy-enforced flows" },
];

export function StatsBar() {
  return (
    <section className="py-12 sm:py-16">
      <div className="site-container">
        <div className="grid gap-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 p-8 sm:grid-cols-3 sm:p-10">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="text-center sm:border-r sm:border-slate-800/80 sm:last:border-0 sm:px-4 sm:first:pl-0 sm:last:pr-0"
            >
              <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1.5 text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
