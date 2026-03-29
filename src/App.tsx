import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SUBSCRIPTIONS, CATEGORIES, Subscription } from "./data/subscriptions";
import { UserSubscription } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import SubscriptionCard from "./components/SubscriptionCard";
import StatsBar from "./components/StatsBar";
import CategoryFilter from "./components/CategoryFilter";
import SavingsReport from "./components/SavingsReport";
import GrayZoneExplorer from "./components/GrayZoneExplorer";

const SUBSCRIPTIONS_COUNT = SUBSCRIPTIONS.length;

// ── Category icon map ──────────────────────────────────────────────────────
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
};

export default function App() {
  const [userSubs, setUserSubs] = useLocalStorage<UserSubscription[]>("subswap-subs", []);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [browseCategory, setBrowseCategory] = useState<string>(CATEGORIES[0]);
  const [grayExplorerOpen, setGrayExplorerOpen] = useState(false);

  const addedIds = userSubs.map((u) => u.sub.id);
  const hasSubs = userSubs.length > 0;

  const handleAdd = (us: UserSubscription) => {
    if (addedIds.includes(us.sub.id)) return;
    setUserSubs((prev) => [...prev, us]);
  };

  const handleRemove = (id: string) => {
    setUserSubs((prev) => prev.filter((u) => u.sub.id !== id));
  };

  const handleUpdatePrice = (id: string, price: number) => {
    setUserSubs((prev) =>
      prev.map((u) => (u.sub.id === id ? { ...u, price } : u))
    );
  };

  // ── Stats ────────────────────────────────────────────────────────────────
  const totalMonthly = useMemo(
    () => userSubs.reduce((acc, u) => acc + u.price, 0),
    [userSubs]
  );

  const freeAltsCount = useMemo(
    () =>
      userSubs.reduce(
        (acc, u) =>
          acc + u.sub.alternatives.filter((a) => a.price.startsWith("Free")).length,
        0
      ),
    [userSubs]
  );

  const openSourceCount = useMemo(
    () =>
      userSubs.reduce(
        (acc, u) => acc + u.sub.alternatives.filter((a) => a.openSource).length,
        0
      ),
    [userSubs]
  );

  // Potential savings = sum of prices for subs that have at least 1 free alt
  const potentialSavings = useMemo(
    () =>
      userSubs
        .filter((u) => u.sub.alternatives.some((a) => a.price.startsWith("Free")))
        .reduce((acc, u) => acc + u.price, 0),
    [userSubs]
  );

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return categoryFilter
      ? userSubs.filter((u) => u.sub.category === categoryFilter)
      : userSubs;
  }, [userSubs, categoryFilter]);

  // ── Browse subs ──────────────────────────────────────────────────────────
  const browseSubs = SUBSCRIPTIONS.filter((s) => s.category === browseCategory);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ── Header ── */}
      <header className="border-b border-slate-800 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4"
          >
            SubSwap
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-xl mx-auto mb-0 leading-relaxed"
          >
            Helping you break free from subscription overload

          </motion.p>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-8">
        <AnimatePresence mode="wait">
          {hasSubs ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats */}
              <div className="mb-6">
                <StatsBar
                  totalMonthly={totalMonthly}
                  totalSubs={userSubs.length}
                  freeAltsCount={freeAltsCount}
                  openSourceCount={openSourceCount}
                  potentialSavings={potentialSavings}
                />
              </div>

              {/* Controls */}
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CategoryFilter
                  active={categoryFilter}
                  onChange={setCategoryFilter}
                  userSubs={userSubs}
                />
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-4">
                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/20 py-12 text-center text-white/40 text-sm">
                    No subscriptions in this category.
                  </div>
                ) : (
                  <AnimatePresence>
                    {filtered.map((u) => (
                      <SubscriptionCard
                        key={u.sub.id}
                        userSub={u}
                        onRemove={() => handleRemove(u.sub.id)}
                        onUpdatePrice={(price) => handleUpdatePrice(u.sub.id, price)}
                        totalMonthly={totalMonthly}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Clear all */}
              {userSubs.length > 1 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      if (confirm("Remove all subscriptions?")) setUserSubs([]);
                    }}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2"
                  >
                    Clear all subscriptions
                  </button>
                </div>
              )}

              {/* Browse More Subscriptions */}
              <div className="mt-12 pt-8 border-t border-slate-800">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-xl font-black text-white mb-1">Add More Subscriptions</h2>
                  <p className="text-sm text-slate-400 mb-5">
                    Browse by category to find and add more subscriptions to track.
                  </p>

                  {/* Category tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setBrowseCategory(cat)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                          browseCategory === cat
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                        }`}
                      >
                        <span>{CAT_ICONS[cat] ?? "📦"}</span>
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Sub grid */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                      {browseSubs.map((sub) => {
                        const added = addedIds.includes(sub.id);
                        return (
                          <motion.button
                            key={sub.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            disabled={added}
                            onClick={() => !added && handleAdd({ sub, price: sub.avgPrice })}
                            className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                              added
                                ? "border-green-600 bg-green-900/30 cursor-default opacity-70"
                                : "border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-blue-600 cursor-pointer"
                            }`}
                          >
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${sub.color} shrink-0`}
                            >
                              <span className="text-xl">{sub.logo}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-white text-sm">{sub.name}</p>
                              <p className="text-xs text-slate-400 truncate">{sub.description}</p>
                            </div>
                            {added && <span className="text-green-400 text-xs font-bold shrink-0">✓ Added</span>}
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2"
            >
              <BrowseAll
                onAdd={handleAdd}
                addedIds={addedIds}
                activeCategory={browseCategory}
                setCategory={setBrowseCategory}
                browseSubs={browseSubs}
                onOpenGrayZone={() => setGrayExplorerOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 px-4 py-10 text-center">
        <p className="text-xs text-slate-400 mb-1">
           <a href="https://nefas.tv" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Author Website</a>
        </p>
        
      </footer>

      {/* ── Gray Zone Explorer ── */}
      <GrayZoneExplorer
        open={grayExplorerOpen}
        onClose={() => setGrayExplorerOpen(false)}
      />
    </div>
  );
}

// ── Browse All ─────────────────────────────────────────────────────────────
function BrowseAll({
  onAdd,
  addedIds,
  activeCategory,
  setCategory,
  browseSubs,
  onOpenGrayZone,
}: {
  onAdd: (us: UserSubscription) => void;
  addedIds: string[];
  activeCategory: string;
  setCategory: (c: string) => void;
  browseSubs: Subscription[];
  onOpenGrayZone: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="mt-10"
    >
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === cat
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
            }`}
          >
            <span>{CAT_ICONS[cat] ?? "📦"}</span>
            {cat}
          </button>
        ))}

        <button
          onClick={onOpenGrayZone}
          className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 hover:bg-orange-500/20 transition-all"
        >
          <span>🏴‍☠️</span>
          Gray Zone
        </button>
      </div>

      {/* Sub grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {browseSubs.map((sub) => {
            const added = addedIds.includes(sub.id);
            return (
              <motion.button
                key={sub.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                disabled={added}
                onClick={() => !added && onAdd({ sub, price: sub.avgPrice })}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  added
                    ? "border-green-400/30 bg-green-500/10 cursor-default opacity-70"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-400/40 cursor-pointer"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${sub.color} shrink-0`}
                >
                  <span className="text-xl">{sub.logo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm leading-tight">{sub.name}</p>
                  <p className="text-xs text-white/40 truncate mt-0.5">{sub.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-semibold text-violet-400">
                      {sub.avgPrice === 0 ? "Free" : `~$${sub.avgPrice}/mo`}
                    </span>
                    {sub.alternatives.filter((a) => a.price.startsWith("Free")).length > 0 && (
                      <span className="text-xs text-green-400/80">
                        · {sub.alternatives.filter((a) => a.price.startsWith("Free")).length} free alt
                        {sub.alternatives.filter((a) => a.price.startsWith("Free")).length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  {added ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-sm font-bold">
                      ✓
                    </span>
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-violet-500 hover:text-white transition-all text-lg font-light">
                      +
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
