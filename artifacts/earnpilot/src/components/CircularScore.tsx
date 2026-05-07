export default function CircularScore({ score }: { score: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "text-primary";
  let label = "Optimized";
  let bgClass = "bg-primary/10";
  
  if (score <= 40) {
    colorClass = "text-destructive";
    label = "Severely Under-Earning";
    bgClass = "bg-destructive/10";
  } else if (score <= 70) {
    colorClass = "text-amber-500";
    label = "Below Potential";
    bgClass = "bg-amber-500/10";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-40 h-40">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-border opacity-30"
          />
          {/* Progress circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${colorClass}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={`text-4xl font-bold tracking-tighter ${colorClass}`}>{score}</span>
        </div>
      </div>
      <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase border border-current ${colorClass} ${bgClass}`}>
        {label}
      </div>
    </div>
  );
}
