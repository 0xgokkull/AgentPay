import type { ReactNode } from "react";
import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Topbar />
        <div className="page-grid pt-4">{children}</div>
      </div>
    </div>
  );
}

