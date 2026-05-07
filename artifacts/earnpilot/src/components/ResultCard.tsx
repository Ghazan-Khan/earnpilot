import { motion } from "framer-motion";
import { type IncomePlan } from "@workspace/api-client-react/src/generated/api.schemas";
import CircularScore from "./CircularScore";
import ShareCard from "./ShareCard";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw, AlertTriangle, ArrowRight, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { useState, useEffect } from "react";

function CountUp({ to }: { to: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = to / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [to]);

  return <>{count.toLocaleString()}</>;
}

export default function ResultCard({ plan, onReset }: { plan: IncomePlan; onReset: () => void }) {
  const score = parseInt(plan.income_gap_score, 10);
  const yearlyLoss = parseInt(plan.yearly_loss, 10);

  const copyShareText = () => {
    const text = `I used AI and found out I'm under-earning by $${plan.under_earning_amount}/month Here's my plan 👇 ${window.location.href}`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const downloadShareImage = async () => {
    const element = document.getElementById("share-card");
    if (!element) return;
    
    try {
      const dataUrl = await toPng(element, { quality: 1.0, backgroundColor: "#0a0a0a" });
      const link = document.createElement('a');
      link.download = 'earnpilot-diagnostic.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      toast.error("Failed to generate image.");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full relative pb-12">
      <ShareCard plan={plan} />

      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="space-y-8"
      >
        {/* Header Alert */}
        <motion.div variants={item} className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            You are under-earning by <span className="text-red-400">${plan.under_earning_amount}/month</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Missing <span className="text-white font-mono font-bold">$<CountUp to={yearlyLoss} /></span>/year
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Score */}
          <motion.div variants={item} className="md:col-span-1 bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider mb-6">Income Gap Score</h3>
            <CircularScore score={score} />
          </motion.div>

          {/* Biggest Mistake */}
          <motion.div variants={item} className="md:col-span-2 bg-card border border-border rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Critical Leak Detected</h3>
            <p className="text-2xl md:text-3xl font-semibold text-white leading-tight">
              "{plan.biggest_mistake}"
            </p>
          </motion.div>
        </div>

        {/* Opportunities */}
        <motion.div variants={item} className="space-y-4">
          <h3 className="text-xl font-bold text-white border-b border-border pb-4">Top 3 Income Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plan.opportunities.map((opp, i) => (
              <div key={i} className="bg-[#111] border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-bold tracking-tight">{opp.potential}</span>
                </div>
                <h4 className="font-bold text-white text-lg mb-2">{opp.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{opp.action}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 7 Day Plan */}
        <motion.div variants={item} className="bg-card border border-border rounded-2xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h3 className="text-2xl font-bold text-white">7-Day Execution Plan</h3>
            <div className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary font-bold">
              Potential Increase: <span className="text-white">${plan.potential_increase}</span> in 30 days
            </div>
          </div>
          
          <div className="space-y-4">
            {plan.seven_day_plan.map((step, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="shrink-0 w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-bold font-mono text-sm">
                  {i + 1}
                </div>
                <p className="text-foreground pt-1 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button size="lg" onClick={copyShareText} className="w-full sm:w-auto h-14 px-8 bg-primary text-black font-bold hover:bg-primary/90 text-lg">
            <Copy className="w-5 h-5 mr-2" />
            Copy Share Text
          </Button>
          
          <Button size="lg" variant="outline" onClick={downloadShareImage} className="w-full sm:w-auto h-14 px-8 border-primary/50 text-primary hover:bg-primary/10 text-lg">
            <Download className="w-5 h-5 mr-2" />
            Save Image
          </Button>

          <Button size="lg" variant="ghost" onClick={onReset} className="w-full sm:w-auto h-14 px-8 text-muted-foreground hover:text-white text-lg">
            <RefreshCw className="w-5 h-5 mr-2" />
            Recalculate
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
