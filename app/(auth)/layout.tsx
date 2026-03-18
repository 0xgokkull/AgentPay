import type { ReactNode } from "react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grain flex min-h-screen flex-col">
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
