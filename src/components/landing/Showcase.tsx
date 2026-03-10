"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const tabs = [
  {
    id: "design",
    label: "Design",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    content: {
      title: "Pixel-perfect design tools",
      description: "Create stunning interfaces with our advanced design system. From wireframes to high-fidelity mockups, everything stays in sync.",
      metrics: [
        { label: "Design Tokens", value: "500+" },
        { label: "Components", value: "120+" },
        { label: "Templates", value: "50+" },
      ],
    },
  },
  {
    id: "develop",
    label: "Develop",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    content: {
      title: "Code that writes itself",
      description: "Our AI-powered development environment understands context, suggests improvements, and auto-generates boilerplate.",
      metrics: [
        { label: "Languages", value: "30+" },
        { label: "Integrations", value: "200+" },
        { label: "AI Models", value: "5" },
      ],
    },
  },
  {
    id: "deploy",
    label: "Deploy",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    content: {
      title: "One-click global deployment",
      description: "Deploy to edge locations worldwide in seconds. Built-in CI/CD, preview environments, and rollback capabilities.",
      metrics: [
        { label: "Edge Locations", value: "300+" },
        { label: "Uptime SLA", value: "99.99%" },
        { label: "Avg Deploy", value: "< 8s" },
      ],
    },
  },
];

interface ShowcaseProps {
  title: string;
  subtitle: string;
}

export default function Showcase({ title, subtitle }: ShowcaseProps) {
  const [activeTab, setActiveTab] = useState("design");
  const current = tabs.find((t) => t.id === activeTab)!;

  return (
    <section id="showcase" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-cyan-400 tracking-widest uppercase mb-4">
            Showcase
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex p-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-violet-600/80 to-cyan-600/80 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              {current.content.title}
            </h3>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              {current.content.description}
            </p>
            <div className="grid grid-cols-3 gap-6">
              {current.content.metrics.map((m) => (
                <div key={m.label}>
                  <p className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    {m.value}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            key={`visual-${activeTab}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/10 to-cyan-600/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl overflow-hidden">
              {/* Code Editor Mock */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-xs text-slate-500 ml-2">{current.id}.tsx</span>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed">
                <div className="text-slate-500">
                  <span className="text-violet-400">import</span>{" "}
                  <span className="text-cyan-300">{"{ Nextura }"}</span>{" "}
                  <span className="text-violet-400">from</span>{" "}
                  <span className="text-emerald-400">{`"@nextura/sdk"`}</span>
                </div>
                <div className="mt-4 text-slate-500">
                  <span className="text-violet-400">const</span>{" "}
                  <span className="text-cyan-300">app</span>{" "}
                  <span className="text-slate-400">=</span>{" "}
                  <span className="text-amber-300">Nextura</span>
                  <span className="text-slate-400">.</span>
                  <span className="text-emerald-300">create</span>
                  <span className="text-slate-400">({"{"}</span>
                </div>
                <div className="ml-6 text-slate-500">
                  <span className="text-cyan-300">name</span>
                  <span className="text-slate-400">:</span>{" "}
                  <span className="text-emerald-400">{`"my-app"`}</span>,
                </div>
                <div className="ml-6 text-slate-500">
                  <span className="text-cyan-300">{current.id}</span>
                  <span className="text-slate-400">:</span>{" "}
                  <span className="text-amber-400">true</span>,
                </div>
                <div className="ml-6 text-slate-500">
                  <span className="text-cyan-300">ai</span>
                  <span className="text-slate-400">:</span>{" "}
                  <span className="text-emerald-400">{`"enhanced"`}</span>,
                </div>
                <div className="text-slate-400">{"})"}</div>
                <div className="mt-4 text-slate-500">
                  <span className="text-violet-400">await</span>{" "}
                  <span className="text-cyan-300">app</span>
                  <span className="text-slate-400">.</span>
                  <span className="text-emerald-300">{current.id}</span>
                  <span className="text-slate-400">()</span>
                </div>
                <div className="mt-2 text-emerald-600/60">
                  // ✨ That&apos;s it. You&apos;re live.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
