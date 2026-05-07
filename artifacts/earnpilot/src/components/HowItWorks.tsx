import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Enter Your Stats",
    description: "Tell us your monthly income, your main skill, and how many hours a day you can commit. Takes 30 seconds.",
  },
  {
    number: "02",
    title: "AI Analyzes Your Gap",
    description: "Our AI benchmarks you against market rates, detects income leaks, and identifies your fastest opportunities.",
  },
  {
    number: "03",
    title: "Get Your Upgrade Plan",
    description: "Receive a brutally honest breakdown: your under-earning amount, your biggest mistake, and a concrete 7-day action plan.",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="py-20 border-t border-border/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <span className="text-xs font-mono tracking-widest text-primary uppercase">
          How It Works
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
          Three steps to your income truth
        </h2>
      </motion.div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Connecting line on desktop */}
        <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
            className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors group"
          >
            {/* Step number bubble */}
            <div className="relative mb-6 w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary/10 group-hover:bg-primary/15 transition-colors" />
              <div className="absolute inset-0 rounded-full border border-primary/20 group-hover:border-primary/40 transition-colors" />
              <span className="relative font-mono text-2xl font-bold text-primary">
                {step.number}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
