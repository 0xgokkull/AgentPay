"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  Bot,
  CreditCard,
  FileText,
  Layers,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Waypoints,
  Activity,
  WalletCards,
} from "lucide-react";

const GROUPS = [
  {
    title: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Agent",
    items: [
      { href: "/dashboard/agent/register", label: "Register agent", icon: Bot },
    ],
  },
  {
    title: "Treasury",
    items: [
      { href: "/dashboard/vault", label: "Vault", icon: WalletCards },
      { href: "/dashboard/pay", label: "Pay", icon: CreditCard },
      { href: "/dashboard/receipt", label: "Receipts", icon: FileText },
      { href: "/dashboard/policies", label: "Policies", icon: ShieldCheck },
    ],
  },
  {
    title: "Network",
    items: [
      { href: "/dashboard/services", label: "Services", icon: Layers },
      { href: "/dashboard/xcm", label: "XCM", icon: Waypoints },
      { href: "/dashboard/activity", label: "Activity", icon: Activity },
    ],
  },
  {
    title: "Account",
    items: [{ href: "/dashboard/settings", label: "Settings", icon: Settings }],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800/80 bg-slate-950/95 py-6 md:flex">
      <Link href="/" className="mb-8 flex items-center gap-2.5 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 shadow-md shadow-cyan-500/15">
          <BadgeDollarSign className="h-5 w-5 text-slate-950" strokeWidth={2.25} />
        </span>
        <div>
          <p className="text-sm font-bold text-white">AgentPay</p>
          <p className="text-[11px] text-slate-500">Console</p>
        </div>
      </Link>

      <nav className="subtle-scrollbar flex flex-1 flex-col gap-6 overflow-y-auto px-3">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-cyan-500/10 text-cyan-400 shadow-sm shadow-cyan-500/5"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-80" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-800/80 px-5 pt-4">
        <Link
          href="/"
          className="text-xs font-medium text-slate-500 transition hover:text-cyan-400"
        >
          ← Marketing site
        </Link>
      </div>
    </aside>
  );
}
