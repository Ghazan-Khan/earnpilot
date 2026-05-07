import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
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
      } catch (e) {
        console.error("Failed to parse saved result");
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
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-16">
        <Hero onStart={() => formRef.current?.scrollIntoView({ behavior: "smooth" })} />
        
        <div ref={formRef} className="mt-16">
          {!result && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
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
              className="mt-16"
            >
              <ResultCard plan={result} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
