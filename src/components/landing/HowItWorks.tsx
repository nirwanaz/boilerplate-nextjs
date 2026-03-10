"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Connect Your Stack",
    description:
      "Integrate with your existing tools in minutes. We support GitHub, GitLab, Figma, Jira, Slack, and 200+ more.",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    number: "02",
    title: "Design & Build",
    description:
      "Use our AI-assisted editor to create components, pages, and entire applications with unprecedented speed.",
    gradient: "from-fuchsia-500 to-cyan-500",
  },
  {
    number: "03",
    title: "Test & Iterate",
    description:
      "Automated testing, preview deployments, and real-time collaboration make iteration effortless.",
    gradient: "from-cyan-500 to-emerald-500",
  },
  {
    number: "04",
    title: "Ship & Scale",
    description:
      "Deploy globally with one click. Auto-scaling, CDN, and monitoring are built-in. Just focus on your product.",
    gradient: "from-emerald-500 to-amber-500",
  },
];

interface HowItWorksProps {
  title: string;
  subtitle: string;
}

export default function HowItWorks({ title, subtitle }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-sm font-semibold text-emerald-400 tracking-widest uppercase mb-4">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-px">
            <div className="h-full bg-gradient-to-r from-violet-500/30 via-cyan-500/30 to-emerald-500/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative group"
              >
                {/* Number Circle */}
                <div className="relative mb-8 flex justify-center lg:justify-start">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}
                  >
                    <span className="text-xl font-bold text-white">{step.number}</span>
                  </div>
                  {/* Glow */}
                  <div
                    className={`absolute -inset-2 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                  />
                </div>

                {/* Card */}
                <div className="text-center lg:text-left">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
