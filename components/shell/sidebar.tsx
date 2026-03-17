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

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/agent/register", label: "Register agent", icon: Bot },
  { href: "/dashboard/vault", label: "Vault", icon: WalletCards },
  { href: "/dashboard/pay", label: "Pay", icon: CreditCard },
  { href: "/dashboard/receipt", label: "Receipts", icon: FileText },
  { href: "/dashboard/policies", label: "Policies", icon: ShieldCheck },
  { href: "/dashboard/services", label: "Services", icon: Layers },
  { href: "/dashboard/xcm", label: "XCM", icon: Waypoints },
  { href: "/dashboard/activity", label: "Activity", icon: Activity },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 flex-col border-r border-slate-800/80 bg-slate-950/90 px-4 py-4 md:flex">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 shadow-[0_14px_40px_rgba(8,47,73,0.9)]">
          <BadgeDollarSign className="h-4 w-4 text-slate-950" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-tight text-slate-50">
            AgentPay
          </p>
          <p className="text-[11px] text-slate-400">Agent-native treasury</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 text-xs">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-xl px-2.5 py-2 transition ${
                isActive
                  ? "bg-slate-900 text-slate-50 shadow-[0_10px_30px_rgba(15,23,42,0.9)]"
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-100"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

