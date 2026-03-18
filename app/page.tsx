import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { LogoStrip } from "@/components/marketing/logo-strip";
import { StatsBar } from "@/components/marketing/stats-bar";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingCTA } from "@/components/landing/cta";

export default function Home() {
  return (
    <div className="grain relative flex min-h-screen flex-col">
      <div className="relative z-10 flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LandingHero />
        <LogoStrip />
        <StatsBar />
        <LandingFeatures />
        <HowItWorks />
        <LandingCTA />
      </main>
      <SiteFooter />
      </div>
    </div>
  );
}
