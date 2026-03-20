"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { BadgeDollarSign, Bot, LayoutDashboard, User, LogOut, ChevronRight } from "lucide-react";

const ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/agent", label: "Agent Console", icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800/40 bg-slate-950/40 backdrop-blur-2xl py-8 md:flex relative z-20">
      {/* App Branding */}
      <Link href="/" className="mb-10 flex items-center gap-3 px-6 group">
        <div className="relative">
          <motion.div
            animate={{ 
              boxShadow: ["0 0 10px rgba(6,182,212,0)", "0 0 20px rgba(6,182,212,0.3)", "0 0 10px rgba(6,182,212,0)"] 
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-600 transition-transform group-hover:scale-105"
          >
            <BadgeDollarSign className="h-6 w-6 text-slate-950" strokeWidth={2.5} />
          </motion.div>
        </div>
        <div>
          <p className="text-base font-bold tracking-tight text-white transition-colors group-hover:text-cyan-400">AgentPay</p>
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-500">Autonomous Fin</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 px-3">
        {ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive 
                  ? "text-cyan-400" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-nav-active"
                    className="absolute inset-0 z-0 rounded-xl bg-gradient-to-r from-cyan-500/15 to-transparent border border-cyan-500/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              
              <Icon className={`relative z-10 h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-cyan-400" : "opacity-70"}`} />
              <span className="relative z-10 tracking-wide">{item.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-pill"
                  className="absolute right-0 h-4 w-1 rounded-l-full bg-cyan-400" 
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Footer Section */}
      <div className="mt-auto space-y-6 px-4">
        {/* User Profile Placeholder */}
        <div className="rounded-2xl border border-slate-800/40 bg-slate-900/30 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/50">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-semibold text-slate-200">Main Account</p>
              <p className="text-[10px] text-slate-500">Tier: Elite</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-2 pb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 transition-all hover:text-cyan-400"
          >
            <LogOut className="h-3.5 w-3.5 rotate-180" />
            Back to Site
          </Link>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800/60 to-transparent" />
          <p className="text-[10px] text-slate-700 font-medium">AgentPay Console v1.0.4</p>
        </div>
      </div>
    </aside>
  );
}
