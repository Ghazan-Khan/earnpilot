import { type IncomePlan } from "@workspace/api-client-react/src/generated/api.schemas";
import CircularScore from "./CircularScore";

export default function ShareCard({ plan }: { plan: IncomePlan }) {
  const score = parseInt(plan.income_gap_score, 10);
  
  return (
    <div 
      id="share-card" 
      className="absolute -left-[9999px] top-0 w-[600px] h-[600px] bg-[#0a0a0a] flex flex-col items-center justify-center p-12 overflow-hidden border-8 border-primary/20 font-sans"
      style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(0,255,136,0.1) 0%, transparent 70%)'
      }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">EarnPilot Diagnostic</h1>
        <p className="text-xl text-primary font-mono uppercase tracking-widest">Income Gap Analysis</p>
      </div>

      <div className="flex items-center gap-12 w-full mb-10">
        <div className="flex-1 text-center">
          <p className="text-xl text-muted-foreground uppercase tracking-wider mb-2">Under-Earning By</p>
          <p className="text-6xl font-bold text-white">${plan.under_earning_amount}<span className="text-2xl text-muted-foreground">/mo</span></p>
        </div>
        <div className="shrink-0">
          <CircularScore score={score} />
        </div>
      </div>

      <div className="w-full bg-[#111] border border-red-500/30 rounded-xl p-6 relative">
        <div className="absolute -top-3 left-6 bg-red-500/20 text-red-500 px-3 py-1 text-xs font-bold uppercase rounded border border-red-500/30 tracking-wider">
          Critical Mistake
        </div>
        <p className="text-white text-lg font-medium leading-relaxed">
          "{plan.biggest_mistake}"
        </p>
      </div>

      <div className="mt-8 text-center w-full">
        <p className="text-muted-foreground text-sm tracking-widest uppercase">Generate yours at earnpilot.app</p>
      </div>
    </div>
  );
}
