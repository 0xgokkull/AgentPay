import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingCTA } from "@/components/landing/cta";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 pb-16 pt-16 md:px-8 md:pt-24">
        <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center">
          <div className="h-72 w-[28rem] rounded-full bg-cyan-500/30 blur-3xl" />
        </div>
        <LandingHero />
        <LandingFeatures />
        <LandingCTA />
      </div>
    </main>
  );
}

