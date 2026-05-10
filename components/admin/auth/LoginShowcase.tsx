"use client";

import { Activity, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "Realtime operational snapshots",
  "Secure role-based admin access",
  "Cross-team workflows with audit trails",
];

export function LoginShowcase() {
  return (
    <aside className="hidden min-h-screen w-full max-w-xl flex-col justify-between bg-gradient-to-br from-indigo-800 via-violet-700 to-indigo-900 p-8 text-white lg:flex">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5" />
          Premium Admin Workspace
        </div>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">Operate the platform with confidence.</h2>
        <p className="mt-3 text-sm text-indigo-100">
          Centralized admin authentication, secure sessions, and live operational data in one modern control surface.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Activity className="h-4 w-4 text-cyan-300" />
          Platform Advantages
        </div>
        <ul className="space-y-2 text-sm text-indigo-100">
          {features.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </aside>
  );
}

