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
        gradient="from-violet-500 to-purple-600"
        accent="violet"
      />
      <StatCard
        icon="📅"
        label="Yearly spend"
        value={totalMonthly === 0 ? "—" : `$${animYearly.toFixed(0)}`}
        sub="projected cost"
        gradient="from-pink-500 to-rose-600"
        accent="pink"
      />
      <StatCard
        icon="💡"
        label="Potential savings"
        value={potentialSavings === 0 ? "—" : `$${animSavings.toFixed(2)}/mo`}
        sub="if you switch to free"
        gradient="from-amber-400 to-orange-500"
        accent="amber"
        highlight
      />
      <StatCard
        icon="🆓"
        label="Free alternatives"
        value={`${Math.round(animFree)}`}
        sub={`across ${totalSubs} sub${totalSubs !== 1 ? "s" : ""}`}
        gradient="from-green-500 to-emerald-600"
        accent="green"
      />
      <StatCard
        icon="🔓"
        label="Open source"
        value={`${Math.round(animOS)}`}
        sub="privacy-respecting"
        gradient="from-blue-500 to-cyan-600"
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
  gradient,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  gradient: string;
  accent: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white/5 shadow-sm p-4 flex flex-col gap-1 transition-all duration-300 backdrop-blur-sm ${
        highlight && value !== "—"
          ? "border-amber-500/30 shadow-amber-500/10 shadow-md"
          : "border-white/20"
      }`}
    >
      <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${gradient} opacity-[0.15]`} />
      <div className={`absolute -left-3 -bottom-3 h-14 w-14 rounded-full bg-gradient-to-br ${gradient} opacity-[0.1]`} />
      <span className="text-xl relative">{icon}</span>
      <p className="text-xs text-white/50 font-semibold mt-0.5 relative">{label}</p>
      <p
        className={`text-xl font-black leading-tight relative ${
          highlight && value !== "—" ? "text-amber-400" : "text-white"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-white/50 relative">{sub}</p>
    </div>
  );
}
