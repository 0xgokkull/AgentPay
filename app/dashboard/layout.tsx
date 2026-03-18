import type { ReactNode } from "react";
import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar />
        <div className="site-container flex-1 py-8 md:py-10">{children}</div>
      </div>
    </div>
  );
}
