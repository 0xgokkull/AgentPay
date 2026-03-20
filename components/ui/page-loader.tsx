"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BadgeDollarSign } from "lucide-react";

interface PageLoaderProps {
  isVisible: boolean;
  message?: string;
}

export function PageLoader({ isVisible, message = "Entering AgentPay App..." }: PageLoaderProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xl"
        >
          <div className="relative flex flex-col items-center">
            {/* Pulsing Glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl"
            />
            
            {/* Logo Wrapper */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-600 shadow-2xl shadow-cyan-500/40"
            >
              <BadgeDollarSign className="h-10 w-10 text-slate-950" strokeWidth={2.5} />
            </motion.div>

            {/* Progress Bar (Indeterminate) */}
            <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                animate={{ x: [-192, 192] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-48 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-sm font-medium tracking-tight text-white/90"
            >
              {message}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
