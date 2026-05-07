import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import InputForm from "@/components/InputForm";
import Loader from "@/components/Loader";
import ResultCard from "@/components/ResultCard";
import { type IncomePlan } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<IncomePlan | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("earnpilot_result");
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch {
        localStorage.removeItem("earnpilot_result");
      }
    }
  }, []);

  const handleGenerate = (plan: IncomePlan) => {
    setResult(plan);
    setIsGenerating(false);
    localStorage.setItem("earnpilot_result", JSON.stringify(plan));
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setResult(null);
    localStorage.removeItem("earnpilot_result");
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero — full viewport */}
        <Hero onStart={() => formRef.current?.scrollIntoView({ behavior: "smooth" })} />

        {/* How It Works — visible after scrolling past hero */}
        {!result && !isGenerating && <HowItWorks />}

        {/* Form section */}
        <div ref={formRef} className="pb-8">
          {!result && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-center mb-10">
                <span className="text-xs font-mono tracking-widest text-primary uppercase">
                  Step 1 of 1
                </span>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white">
                  Enter your current situation
                </h2>
                <p className="mt-2 text-muted-foreground">No account needed. Results in under 60 seconds.</p>
              </div>
              <InputForm
                onSubmit={() => setIsGenerating(true)}
                onSuccess={handleGenerate}
                onError={() => setIsGenerating(false)}
              />
            </motion.div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isGenerating && (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-12"
            >
              <Loader />
            </motion.div>
          )}

          {result && !isGenerating && (
            <motion.div
              key="results"
              ref={resultsRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8"
            >
              <ResultCard plan={result} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
