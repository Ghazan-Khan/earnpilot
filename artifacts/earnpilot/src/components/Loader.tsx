import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Analyzing your income potential…",
  "Detecting hidden income leaks…",
  "Generating your upgrade plan…",
  "Calculating your yearly loss…",
  "Building your 7-day action plan…"
];

export default function Loader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 border-4 border-primary/20 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <motion.div
          className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>

      <div className="h-8 relative w-full max-w-sm flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute text-lg font-medium text-primary text-center"
          >
            {messages[index]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
