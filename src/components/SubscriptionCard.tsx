import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserSubscription } from "../types";
import AlternativeCard from "./AlternativeCard";
import DisclaimerModal from "./DisclaimerModal";
import GrayAlternativesPanel from "./GrayAlternativesPanel";
import { getGrayAltsForSub } from "../data/grayAlternatives";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface Props {
  userSub: UserSubscription;
  onRemove: () => void;
  onUpdatePrice: (price: number) => void;
  totalMonthly: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Productivity: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Design: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Communication: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Cloud Storage": "bg-sky-500/20 text-sky-300 border-sky-500/30",
  Development: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Entertainment: "bg-red-500/20 text-red-300 border-red-500/30",
  "VPN & Security": "bg-green-500/20 text-green-300 border-green-500/30",
  Analytics: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Email Marketing": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Project Management": "bg-teal-500/20 text-teal-300 border-teal-500/30",
  CRM: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "AI Tools": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Web Publishing": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Other: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

export default function SubscriptionCard({ userSub, onRemove, onUpdatePrice, totalMonthly }: Props) {
  const { sub, price, isCustom } = userSub;
  const [expanded, setExpanded] = useState(true);
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState(price.toFixed(2));
  const [confirmRemove, setConfirmRemove] = useState(false);

  // Gray zone state
  const [grayOpen, setGrayOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useLocalStorage<boolean>(
    "subswap-gray-accepted",
    false
  );

  const freeAlts = sub.alternatives.filter((a) => a.price.startsWith("Free"));
  const openSourceAlts = sub.alternatives.filter((a) => a.openSource);
  const pct = totalMonthly > 0 ? Math.round((price / totalMonthly) * 100) : 0;
  const catColor = CATEGORY_COLORS[sub.category] ?? "bg-gray-100 text-gray-600";

  const graySections = getGrayAltsForSub(sub.id, sub.category);

  const handlePriceSave = () => {
    const parsed = parseFloat(priceInput);
    if (!isNaN(parsed) && parsed >= 0) onUpdatePrice(parsed);
    else setPriceInput(price.toFixed(2));
    setEditingPrice(false);
  };

  const handleGrayToggle = () => {
    if (grayOpen) {
      setGrayOpen(false);
      return;
    }
    if (!disclaimerAccepted) {
      setShowDisclaimer(true);
    } else {
      setGrayOpen(true);
    }
  };

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
    setShowDisclaimer(false);
    setGrayOpen(true);
  };

  const handleDisclaimerDecline = () => {
    setShowDisclaimer(false);
  };

  return (
    <>
      <DisclaimerModal
        open={showDisclaimer}
        onAccept={handleDisclaimerAccept}
        onDecline={handleDisclaimerDecline}
      />

      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -40, scale: 0.96 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="rounded-2xl border border-white/20 bg-white/5 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 backdrop-blur-sm"
      >
        {/* Spend bar */}
        {totalMonthly > 0 && price > 0 && (
          <div className="h-1 bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-4 px-5 py-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${sub.color} shadow-sm shrink-0`}
          >
            <span className="text-2xl">{sub.logo}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-white text-base">{sub.name}</h3>
              {isCustom && (
                <span className="text-xs rounded-full bg-white/10 px-2 py-0.5 text-white/60 font-medium border border-white/20">custom</span>
              )}
              <span className={`text-xs rounded-full px-2 py-0.5 font-semibold border ${catColor}`}>
                {sub.category}
              </span>
            </div>
            <p className="text-xs text-white/50 truncate mt-0.5">{sub.description}</p>
            {totalMonthly > 0 && price > 0 && (
              <p className="text-xs text-white/60 mt-0.5">{pct}% of your total spend</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Price */}
            <div className="text-right">
              {editingPrice ? (
                <div className="flex items-center gap-1">
                  <span className="text-white/50 text-sm">$</span>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className="w-20 rounded-lg border border-violet-400/50 bg-violet-500/20 px-2 py-1 text-sm font-bold text-violet-300 outline-none focus:ring-2 focus:ring-violet-400"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    onBlur={handlePriceSave}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handlePriceSave();
                      if (e.key === "Escape") {
                        setPriceInput(price.toFixed(2));
                        setEditingPrice(false);
                      }
                    }}
                    autoFocus
                  />
                  <span className="text-white/40 text-xs">/mo</span>
                </div>
              ) : (
                <button
                  className="group flex items-center gap-1.5"
                  onClick={() => setEditingPrice(true)}
                  title="Click to edit price"
                >
                  <span className="text-sm font-bold text-white">
                    {price === 0 ? "Free" : `$${price.toFixed(2)}/mo`}
                  </span>
                  <svg
                    className="h-3.5 w-3.5 text-white/30 group-hover:text-violet-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
              {price > 0 && (
                <p className="text-xs text-green-400 font-medium mt-0.5">
                  Save ${price.toFixed(2)}/mo if free
                </p>
              )}
            </div>

            {/* Alt badges */}
            <div className="hidden sm:flex flex-col gap-1 items-end">
              {freeAlts.length > 0 && (
                <span className="text-xs bg-green-500/20 text-green-300 border border-green-500/30 rounded-full px-2 py-0.5 font-semibold whitespace-nowrap">
                  {freeAlts.length} free alt{freeAlts.length > 1 ? "s" : ""}
                </span>
              )}
              {openSourceAlts.length > 0 && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2 py-0.5 font-semibold whitespace-nowrap">
                  {openSourceAlts.length} open source
                </span>
              )}
              {sub.alternatives.length === 0 && isCustom && (
                <span className="text-xs bg-white/10 text-white/40 border border-white/20 rounded-full px-2 py-0.5 font-medium">
                  no alts
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              {sub.alternatives.length > 0 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white/70 transition-colors"
                  title={expanded ? "Collapse alternatives" : "Show alternatives"}
                >
                  <motion.svg
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
              )}

              {confirmRemove ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={onRemove}
                    className="rounded-lg px-2 py-1.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => setConfirmRemove(false)}
                    className="rounded-lg px-2 py-1.5 text-xs font-semibold text-white/50 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmRemove(true)}
                  className="rounded-lg p-2 text-white/30 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  title="Remove subscription"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Legal Alternatives */}
        <AnimatePresence initial={false}>
          {expanded && sub.alternatives.length > 0 && (
            <motion.div
              key="alts"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className="border-t border-white/10 bg-gradient-to-b from-white/5 to-white/0 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                    ✅ Better / Free Alternatives
                  </p>
                  <span className="text-xs text-white/50">{sub.alternatives.length} options</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {sub.alternatives.map((alt) => (
                    <AlternativeCard key={alt.name} alt={alt} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gray Zone toggle button */}
        {graySections.length > 0 && (
        <div className={`px-5 py-3 flex items-center justify-between ${grayOpen ? "bg-orange-950/50" : "bg-white/5 border-t border-white/10"}`}>
          <div className="flex items-center gap-2">
            {grayOpen ? (
              <span className="text-xs text-orange-400/70">
                🏴‍☠️ Showing gray zone alternatives — use responsibly
              </span>
            ) : (
              <span className="text-xs text-white/50">
                Want more options?
              </span>
            )}
          </div>
          <button
            onClick={handleGrayToggle}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
              grayOpen
                ? "bg-orange-600/20 text-orange-400 border border-orange-500/30 hover:bg-orange-600/30"
                : "bg-gradient-to-r from-orange-600/20 to-red-600/20 text-orange-400 border border-orange-500/40 hover:from-orange-600/30 hover:to-red-600/30"
            }`}
          >
            <span>🏴‍☠️</span>
            <span>{grayOpen ? "Hide Gray Zone" : "Show Gray Zone"}</span>
            {!grayOpen && (
              <span className="rounded-full bg-orange-500/20 px-1.5 py-0.5 text-orange-300 text-xs">
                ⚠️
              </span>
            )}
          </button>
        </div>
        )}

        {/* Gray Zone Panel */}
        <AnimatePresence>
          {grayOpen && (
            <GrayAlternativesPanel sections={graySections} />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
