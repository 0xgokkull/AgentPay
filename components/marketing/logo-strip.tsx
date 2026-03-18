export function LogoStrip() {
  const labels = ["Polkadot Hub", "XCM", "ERC-4626 style vaults", "Policy engine", "NFT receipts"];
  return (
    <section className="border-y border-slate-800/60 bg-slate-950/40 py-10">
      <div className="site-container">
        <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Designed for
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
          {labels.map((t) => (
            <span
              key={t}
              className="text-sm font-medium text-slate-500 transition hover:text-slate-400"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
