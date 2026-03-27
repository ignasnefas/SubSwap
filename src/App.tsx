import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SUBSCRIPTIONS, CATEGORIES, Subscription } from "./data/subscriptions";
import { UserSubscription } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import SearchBar from "./components/SearchBar";
import SubscriptionCard from "./components/SubscriptionCard";
import StatsBar from "./components/StatsBar";
import EmptyState from "./components/EmptyState";
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
  const [sortBy, setSortBy] = useState<"name" | "price" | "alts">("price");
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

  // ── Filter + sort ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = categoryFilter
      ? userSubs.filter((u) => u.sub.category === categoryFilter)
      : userSubs;
    if (sortBy === "price") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "name")
      list = [...list].sort((a, b) => a.sub.name.localeCompare(b.sub.name));
    if (sortBy === "alts")
      list = [...list].sort(
        (a, b) => b.sub.alternatives.length - a.sub.alternatives.length
      );
    return list;
  }, [userSubs, categoryFilter, sortBy]);

  // ── Browse subs ──────────────────────────────────────────────────────────
  const browseSubs = SUBSCRIPTIONS.filter((s) => s.category === browseCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900">
      {/* ── Header ── */}
      <header className="relative overflow-hidden px-4 pt-14 pb-24">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge row */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/60 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              {SUBSCRIPTIONS_COUNT}+ subscriptions tracked · Free forever · No account needed
            </div>
            <button
              onClick={() => setGrayExplorerOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-400 hover:bg-orange-500/20 hover:border-orange-400/60 transition-all backdrop-blur-sm"
            >
              <span>🏴‍☠️</span>
              Gray Zone Explorer
              <span className="rounded-full bg-orange-500/20 px-1.5 py-0.5 text-orange-300 text-xs">NEW</span>
            </button>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4"
          >
            Stop overpaying for{" "}
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              subscriptions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/55 text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Scan your subscriptions and instantly discover free, open-source, or cheaper
            alternatives that do the same job.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SearchBar onAdd={handleAdd} addedIds={addedIds} />
          </motion.div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto max-w-5xl px-4 pb-28 -mt-6">
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

              {/* Savings callout */}
              <AnimatePresence>
                {potentialSavings > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-5"
                  >
                    <div className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-950/40 px-5 py-3.5">
                      <span className="text-2xl shrink-0">💡</span>
                      <div className="flex-1">
                        <p className="text-sm text-green-300 font-medium">
                          <strong>Switching to free alternatives</strong> could save you{" "}
                          <strong className="text-green-400">${potentialSavings.toFixed(2)}/month</strong>{" "}
                          — that's{" "}
                          <strong className="text-green-400">${(potentialSavings * 12).toFixed(0)}/year</strong>{" "}
                          back in your pocket.
                        </p>
                      </div>
                      <SavingsReport
                        userSubs={userSubs}
                        totalMonthly={totalMonthly}
                        potentialSavings={potentialSavings}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls */}
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CategoryFilter
                  active={categoryFilter}
                  onChange={setCategoryFilter}
                  userSubs={userSubs}
                />
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400 whitespace-nowrap">Sort:</span>
                  <select
                    className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/80 outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer backdrop-blur-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "name" | "price" | "alts")}
                  >
                    <option value="price" className="bg-slate-900">Price (highest)</option>
                    <option value="name" className="bg-slate-900">Name (A–Z)</option>
                    <option value="alts" className="bg-slate-900">Most alternatives</option>
                  </select>
                </div>
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
              <div className="mt-12 pt-8 border-t border-white/10">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-xl font-black text-white mb-1">Add More Subscriptions</h2>
                  <p className="text-sm text-white/40 mb-5">
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
                            ? "bg-violet-600 text-white shadow-lg shadow-violet-900/50"
                            : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
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
                              <p className="font-bold text-white text-sm">{sub.name}</p>
                              <p className="text-xs text-white/50 truncate">{sub.description}</p>
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
              <EmptyState onAdd={handleAdd} addedIds={addedIds} />
              <BrowseAll
                onAdd={handleAdd}
                addedIds={addedIds}
                activeCategory={browseCategory}
                setCategory={setBrowseCategory}
                browseSubs={browseSubs}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-4 py-10 text-center">
        <p className="text-xs text-white/20 mb-1">
          SubSwap · Helping you break free from subscription overload
        </p>
        <p className="text-xs text-white/12 mb-4">
          All alternatives are community-verified free, open-source, or genuinely cheaper options.
        </p>
        <button
          onClick={() => setGrayExplorerOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/8 px-4 py-2 text-xs font-semibold text-orange-400/70 hover:text-orange-400 hover:bg-orange-500/15 transition-all"
        >
          <span>🏴‍☠️</span>
          Explore Gray Zone Alternatives
        </button>
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
}: {
  onAdd: (us: UserSubscription) => void;
  addedIds: string[];
  activeCategory: string;
  setCategory: (c: string) => void;
  browseSubs: Subscription[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="mt-10"
    >
      <h2 className="text-xl font-black text-white mb-1">Browse by Category</h2>
      <p className="text-sm text-white/40 mb-5">
        Click any card to add it to your tracker instantly.
      </p>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === cat
                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/50"
                : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
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
