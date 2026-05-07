import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="px-3 py-1 text-xs font-mono tracking-wider text-primary border border-primary/20 rounded-full bg-primary/5 uppercase">
          System Online
        </span>
      </motion.div>

      <motion.h1 
        className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Find Out How Much<br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
          You're Under-Earning
        </span>
      </motion.h1>

      <motion.p 
        className="text-lg md:text-xl text-muted-foreground max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Drop your stats. Get a brutal, AI-generated income diagnostic in under 60 seconds. Stop leaving money on the table.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button 
          size="lg" 
          className="mt-4 h-14 px-8 text-lg font-semibold uppercase tracking-wide bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
          onClick={onStart}
        >
          Run Diagnostic
        </Button>
      </motion.div>
    </div>
  );
}
