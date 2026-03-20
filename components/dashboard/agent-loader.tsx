"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2, Zap, Shield, Cpu, Layers } from "lucide-react";

const STATUS_MESSAGES = [
  "Consulting Groq Llama-3...",
  "Analyzing Intent...",
  "Simulating Contract Exec...",
  "Validating Parameters...",
  "Checking On-Chain State...",
  "Finalizing Response...",
];

export function AgentLoader() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="relative h-24 w-24">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t-2 border-cyan-500/30 border-r-2 border-transparent shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        />

        {/* Middle counter-rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-b-2 border-cyan-400/40 border-l-2 border-transparent"
        />

        {/* Inner pulsing core with icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-4 flex items-center justify-center rounded-full bg-cyan-500/10 shadow-[inset_0_0_10px_rgba(6,182,212,0.3)] backdrop-blur-sm"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={statusIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
            >
              {[
                <Cpu className="h-8 w-8 text-cyan-400" key="cpu" />,
                <Zap className="h-8 w-8 text-cyan-400" key="zap" />,
                <Layers className="h-8 w-8 text-cyan-400" key="layers" />,
                <Shield className="h-8 w-8 text-cyan-400" key="shield" />,
                <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" key="loader" />,
                <Cpu className="h-8 w-8 text-cyan-400" key="cpu2" />,
              ][statusIndex]}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={statusIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-medium tracking-wide text-cyan-300/90"
          >
            {STATUS_MESSAGES[statusIndex]}
          </motion.p>
        </AnimatePresence>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">
          Agent Processing
        </p>
      </div>
    </div>
  );
}
