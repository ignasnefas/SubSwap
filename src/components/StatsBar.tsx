import { useEffect, useRef, useState } from "react";

interface Props {
  totalMonthly: number;
  totalSubs: number;
  freeAltsCount: number;
  openSourceCount: number;
  potentialSavings: number;
}

function useCountUp(target: number, duration = 600) {
  const [current, setCurrent] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    const start = prevRef.current;
    const diff = target - start;
    if (diff === 0) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(start + diff * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else prevRef.current = target;
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return current;
}

export default function StatsBar({
  totalMonthly,
  totalSubs,
  freeAltsCount,
  openSourceCount,
  potentialSavings,
}: Props) {
  const animMonthly = useCountUp(totalMonthly);
  const animYearly = useCountUp(totalMonthly * 12);
  const animFree = useCountUp(freeAltsCount);
  const animOS = useCountUp(openSourceCount);
  const animSavings = useCountUp(potentialSavings);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard
        icon="💸"
        label="Monthly spend"
        value={totalMonthly === 0 ? "—" : `$${animMonthly.toFixed(2)}`}
        sub="tracked subs"
        accent="blue"
      />
      <StatCard
        icon="📅"
        label="Yearly spend"
        value={totalMonthly === 0 ? "—" : `$${animYearly.toFixed(0)}`}
        sub="projected cost"
        accent="slate"
      />
      <StatCard
        icon="💡"
        label="Potential savings"
        value={potentialSavings === 0 ? "—" : `$${animSavings.toFixed(2)}/mo`}
        sub="if you switch to free"
        accent="green"
        highlight
      />
      <StatCard
        icon="🆓"
        label="Free alternatives"
        value={`${Math.round(animFree)}`}
        sub={`across ${totalSubs} sub${totalSubs !== 1 ? "s" : ""}`}
        accent="green"
      />
      <StatCard
        icon="🔓"
        label="Open source"
        value={`${Math.round(animOS)}`}
        sub="privacy-respecting"
        accent="blue"
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  accent: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border bg-slate-800 shadow-sm p-4 flex flex-col gap-1 transition-all duration-300 ${
        highlight && value !== "—"
          ? "border-green-800 shadow-green-900/50 shadow-md"
          : "border-slate-700"
      }`}
    >
      <span className="text-xl relative">{icon}</span>
      <p className="text-xs text-slate-400 font-semibold mt-0.5 relative">{label}</p>
      <p
        className={`text-xl font-black leading-tight relative ${
          highlight && value !== "—" ? "text-green-400" : "text-white"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-slate-400 relative">{sub}</p>
    </div>
  );
}
