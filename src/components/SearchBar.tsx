import { useState, useRef, useEffect, useCallback } from "react";
import Fuse from "fuse.js";
import { SUBSCRIPTIONS, Subscription } from "../data/subscriptions";
import { UserSubscription } from "../types";

interface Props {
  onAdd: (sub: UserSubscription) => void;
  addedIds: string[];
}

const fuse = new Fuse(SUBSCRIPTIONS, {
  keys: [
    { name: "name", weight: 3 },
    { name: "description", weight: 1 },
    { name: "category", weight: 1 },
    { name: "alternatives.tags", weight: 0.5 },
  ],
  threshold: 0.4,
  includeScore: true,
});

const CATEGORY_ICONS: Record<string, string> = {
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
};

export default function SearchBar({ onAdd, addedIds }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [customCategory, setCustomCategory] = useState("Productivity");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results: Subscription[] = query.trim()
    ? fuse
        .search(query)
        .filter((r) => !addedIds.includes(r.item.id))
        .slice(0, 7)
        .map((r) => r.item)
    : SUBSCRIPTIONS.filter((s) => !addedIds.includes(s.id)).slice(0, 7);

  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback(
    (sub: Subscription) => {
      onAdd({ sub, price: sub.avgPrice });
      setQuery("");
      setOpen(false);
      inputRef.current?.focus();
    },
    [onAdd]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[highlightIndex]) handleSelect(results[highlightIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleCustomAdd = () => {
    if (!customName.trim()) return;
    const price = parseFloat(customPrice) || 0;
    const customSub: Subscription = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      logo: "💳",
      color: "bg-gray-600",
      avgPrice: price,
      description: "Custom subscription",
      website: "#",
      alternatives: [],
    };
    onAdd({ sub: customSub, price, isCustom: true });
    setCustomName("");
    setCustomPrice("");
    setShowCustom(false);
  };

  return (
    <>
      <div ref={ref} className="relative w-full max-w-lg mx-auto">
        <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3.5 shadow-md ring-1 ring-slate-700 focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200">
          <svg
            className="h-5 w-5 text-slate-500 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
            placeholder="Search subscriptions — Notion, Spotify, Adobe…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <div className="flex items-center gap-2 shrink-0">
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                  inputRef.current?.focus();
                }}
                className="text-slate-500 hover:text-slate-400 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setShowCustom(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200"
              title="Add custom subscription"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Custom
            </button>
          </div>
        </div>

        {open && results.length > 0 && (
          <ul className="absolute z-50 mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 shadow-lg overflow-hidden divide-y divide-slate-700">
            {query.trim() === "" && (
              <li className="px-4 py-2 bg-slate-900">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Popular</span>
              </li>
            )}
            {results.map((sub, i) => (
              <li key={sub.id}>
                <button
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                    i === highlightIndex ? "bg-slate-700" : "hover:bg-slate-700/50"
                  }`}
                  onMouseEnter={() => setHighlightIndex(i)}
                  onClick={() => handleSelect(sub)}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${sub.color} shadow-sm`}
                  >
                    <span className="text-lg">{sub.logo}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm leading-tight">{sub.name}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{sub.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs bg-slate-700 text-slate-400 rounded-full px-2 py-0.5">
                      {CATEGORY_ICONS[sub.category] ?? "📦"} {sub.category}
                    </span>
                    <span className="text-xs font-bold text-blue-600 min-w-[48px] text-right">
                      {sub.avgPrice === 0 ? "Free" : `~$${sub.avgPrice}/mo`}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {open && query.trim() && results.length === 0 && (
          <div className="absolute z-50 mt-2 w-full rounded-2xl border border-white/20 bg-slate-800 shadow-2xl px-5 py-4 text-center backdrop-blur-sm">
            <p className="text-sm text-white/60 mb-2">No matches for "{query}"</p>
            <button
              onClick={() => {
                setCustomName(query);
                setShowCustom(true);
                setOpen(false);
              }}
              className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              + Add "{query}" as a custom subscription
            </button>
          </div>
        )}
      </div>

      {/* Custom Subscription Modal */}
      {showCustom && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowCustom(false)}
        >
          <div className="w-full max-w-sm rounded-3xl bg-slate-800 border border-white/20 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white">Add Custom Subscription</h3>
              <button
                onClick={() => setShowCustom(false)}
                className="rounded-xl p-2 text-white/40 hover:bg-white/10 hover:text-white/70 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5">Service Name *</label>
                <input
                  autoFocus
                  type="text"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                  placeholder="e.g. Webflow, Notion, AWS…"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomAdd()}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5">Monthly Cost (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm font-medium">$</span>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className="w-full rounded-xl border border-white/20 bg-white/10 pl-7 pr-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                    placeholder="0.00"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCustomAdd()}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5">Category</label>
                <select
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                >
                  {[
                    "Productivity",
                    "Design",
                    "Communication",
                    "Cloud Storage",
                    "Development",
                    "Entertainment",
                    "VPN & Security",
                    "Analytics",
                    "Email Marketing",
                    "Project Management",
                    "CRM",
                    "AI Tools",
                    "Web Publishing",
                    "Other",
                  ].map((c) => (
                    <option key={c} className="bg-slate-900">{c}</option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-white/40 -mt-1">
                Custom subscriptions won't have pre-loaded alternatives, but you can still track their cost.
              </p>

              <button
                onClick={handleCustomAdd}
                disabled={!customName.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-400/30 hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
