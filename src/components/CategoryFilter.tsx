import { CATEGORIES } from "../data/subscriptions";
import { UserSubscription } from "../types";

interface Props {
  active: string | null;
  onChange: (cat: string | null) => void;
  userSubs: UserSubscription[];
}

const CAT_ICONS: Record<string, string> = {
  Productivity: "⚙️",
  Design: "🎨",
  Communication: "💬",
  "Cloud Storage": "☁️",
  Development: "💻",
  Entertainment: "🎬",
  "VPN & Security": "🔒",
  Analytics: "📊",
  "Email Marketing": "📧",
  "Project Management": "📋",
  CRM: "🤝",
  "AI Tools": "🤖",
  "Web Publishing": "🌐",
  Other: "📦",
};

export default function CategoryFilter({ active, onChange, userSubs }: Props) {
  // Only show categories that exist in current subs
  const usedCategories = [...new Set(userSubs.map((u) => u.sub.category))];
  const counts = usedCategories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = userSubs.filter((u) => u.sub.category === cat).length;
    return acc;
  }, {});

  if (usedCategories.length <= 1) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
          active === null
            ? "bg-violet-600 text-white shadow-md shadow-violet-500/30"
            : "bg-white/10 border border-white/20 text-white/70 hover:border-violet-400/40 hover:text-violet-300"
        }`}
      >
        All
        <span
          className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
            active === null ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
          }`}
        >
          {userSubs.length}
        </span>
      </button>
      {CATEGORIES.filter((c) => usedCategories.includes(c)).map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat === active ? null : cat)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
            active === cat
              ? "bg-violet-600 text-white shadow-md shadow-violet-500/30"
              : "bg-white/10 border border-white/20 text-white/70 hover:border-violet-400/40 hover:text-violet-300"
          }`}
        >
          <span>{CAT_ICONS[cat] ?? "📦"}</span>
          {cat}
          <span
            className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
              active === cat ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
            }`}
          >
            {counts[cat]}
          </span>
        </button>
      ))}
    </div>
  );
}
