"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BadgeDollarSign } from "lucide-react";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";
import { PageLoader } from "@/components/ui/page-loader";

const NAV = [
  { href: "/#product", label: "Product" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/dashboard", label: "App" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="site-container flex h-16 items-center justify-between gap-4 sm:h-[4.25rem]">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 shadow-lg shadow-cyan-500/20">
            <BadgeDollarSign
              className="h-5 w-5 text-slate-950"
              strokeWidth={2.25}
            />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            AgentPay
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            item.label === "App" ? (
              <button
                key={item.href}
                onClick={handleAppClick}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ConnectWalletButton size="sm" />
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 text-slate-200 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-800/60 md:hidden"
          >
            <div className="site-container flex flex-col gap-1 py-4">
              {NAV.map((item) => (
                item.label === "App" ? (
                  <button
                    key={item.href}
                    onClick={(e) => {
                      setOpen(false);
                      handleAppClick(e);
                    }}
                    className="flex w-full rounded-lg px-3 py-3 text-base font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-3 text-base font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              <div className="pt-2">
                <ConnectWalletButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PageLoader isVisible={isNavigating} />
    </header>
  );
}
