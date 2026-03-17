export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <section className="section-card col-span-2 bg-slate-950/80">
        <h1 className="mb-2 text-sm font-semibold tracking-tight text-slate-50">
          System overview
        </h1>
        <p className="text-xs text-slate-400">
          This is the main dashboard overview. I will fill this with AgentSummary,
          VaultWidget, and ActivityFeed components next.
        </p>
      </section>
      <section className="section-card bg-slate-950/80">
        <p className="text-xs text-slate-400">
          Quick status cards will live here (agent, vault, and policies).
        </p>
      </section>
    </div>
  );
}

