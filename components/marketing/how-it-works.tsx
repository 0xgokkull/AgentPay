import { Wallet, Bot, CreditCard } from "lucide-react";

const STEPS = [
  {
    icon: Wallet,
    title: "Connect & validate",
    body: "Link your wallet and confirm you’re on the right network. No surprises before you move funds.",
  },
  {
    icon: Bot,
    title: "Register your agent",
    body: "Mint agent identity as an NFT. Everything—vault, policies, receipts—hangs off that identity.",
  },
  {
    icon: CreditCard,
    title: "Simulate, then pay",
    body: "Preview splits and routing, enforce rules, execute, and collect an NFT receipt for every payment.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-24">
      <div className="site-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">How it works</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From wallet to receipt in three clear steps
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            No maze of screens—each step has one job, with obvious feedback so you always know
            what happens on-chain next.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-8 shadow-lg shadow-black/20"
            >
              <span className="absolute -top-3 left-8 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-slate-950">
                {i + 1}
              </span>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <step.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
