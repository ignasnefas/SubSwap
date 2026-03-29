import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PUBLIC_TRACKERS,
  PRIVATE_TRACKERS,
  STREAMING_SITES,
  EBOOK_SITES,
  MUSIC_SITES,
  SOFTWARE_SITES,
  GrayAlternative,
  GrayAltType,
} from "../data/grayAlternatives";
import DisclaimerModal from "./DisclaimerModal";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface TabDef {
  key: string;
  label: string;
  emoji: string;
  items: GrayAlternative[];
  description: string;
  tip: string;
  tipColor: string;
}

const TABS: TabDef[] = [
  {
    key: "public",
    label: "Public Trackers",
    emoji: "🌊",
    items: PUBLIC_TRACKERS,
    description: "Public BitTorrent trackers — no signup required. Use a VPN.",
    tip: "Combine with a VPN and a good BitTorrent client (qBittorrent, Transmission). Sort by seeders for best speeds.",
    tipColor: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  },
  {
    key: "private",
    label: "Private Trackers",
    emoji: "🔐",
    items: PRIVATE_TRACKERS,
    description: "Invitation-only communities with curated, high-quality content and blazing speeds.",
    tip: "Maintain your ratio (upload ≥ download). Private trackers are far safer and faster than public ones. Getting in requires patience.",
    tipColor: "border-red-500/30 bg-red-500/10 text-red-400",
  },
  {
    key: "streaming",
    label: "Streaming",
    emoji: "📺",
    items: STREAMING_SITES,
    description: "Free streaming sites for movies, TV, and anime — some are even legal.",
    tip: "Install uBlock Origin before visiting. Never click pop-up ads. Use the play button only. Some listed sites are 100% legal.",
    tipColor: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  },
  {
    key: "ebooks",
    label: "Books & Papers",
    emoji: "📚",
    items: EBOOK_SITES,
    description: "Shadow libraries, academic paper unlockers, and legal free book sources.",
    tip: "Anna's Archive is the best single starting point — it indexes LibGen, Z-Lib, and Sci-Hub in one search. Project Gutenberg and Standard Ebooks are 100% legal.",
    tipColor: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  },
  {
    key: "music",
    label: "Music",
    emoji: "🎵",
    items: MUSIC_SITES,
    description: "Download lossless music, find rare albums, and rip from streaming services.",
    tip: "Soulseek is unmatched for rare/lossless music. yt-dlp works on 1000+ sites. Bandcamp and FMA are 100% legal.",
    tipColor: "border-pink-500/30 bg-pink-500/10 text-pink-400",
  },
  {
    key: "software",
    label: "Software & Games",
    emoji: "💾",
    items: SOFTWARE_SITES,
    description: "Cracked apps, repacked games, and mobile app repositories.",
    tip: "Always scan executables with VirusTotal. Read comments for malware reports. FitGirl and DODI are the most trusted repack sources.",
    tipColor: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  },
];

const TYPE_COLORS: Record<GrayAltType, string> = {
  "torrent-public": "bg-orange-500/10 text-orange-400 border-orange-500/30",
  "torrent-private": "bg-red-500/10 text-red-400 border-red-500/30",
  streaming: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  ebook: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  music: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  software: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  general: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

const TYPE_LABELS: Record<GrayAltType, string> = {
  "torrent-public": "Public Tracker",
  "torrent-private": "Private Tracker",
  streaming: "Streaming",
  ebook: "eBooks",
  music: "Music",
  software: "Software",
  general: "General",
};

const NOTE_LEGAL_KEYWORDS = ["100% legal", "legal —", "actually legal"];

function isLegal(note?: string) {
  if (!note) return false;
  return NOTE_LEGAL_KEYWORDS.some((k) => note.toLowerCase().includes(k));
}

function GrayExplorerCard({ item }: { item: GrayAlternative }) {
  const typeColor = TYPE_COLORS[item.type];
  const legal = isLegal(item.note);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2.5 rounded-lg border border-slate-700 bg-slate-800 p-4 hover:bg-slate-700 hover:border-slate-600 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0">{item.logo}</span>
          <span className="font-bold text-white text-sm group-hover:text-orange-400 transition-colors leading-tight">
            {item.name}
          </span>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${typeColor}`}>
          {TYPE_LABELS[item.type]}
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>

      <div className="flex flex-wrap gap-1">
        {item.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-400 font-medium">
            {tag}
          </span>
        ))}
      </div>

      {item.note && (
        <p className={`text-xs font-medium flex items-center gap-1 ${legal ? "text-green-400" : "text-amber-400"}`}>
          <span>{legal ? "✅" : "ℹ️"}</span>
          {item.note}
        </p>
      )}

      <div className="flex items-center gap-1 text-xs text-orange-400 group-hover:text-orange-300 transition-colors mt-auto pt-1 font-semibold">
        Visit site
        <svg className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </div>
    </a>
  );
}

interface GrayZoneExplorerProps {
  open: boolean;
  onClose: () => void;
}

export default function GrayZoneExplorer({ open, onClose }: GrayZoneExplorerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useLocalStorage<boolean>(
    "subswap-gray-accepted",
    false
  );
  const [unlocked, setUnlocked] = useState(false);

  const handleOpen = () => {
    if (!disclaimerAccepted && !unlocked) {
      setShowDisclaimer(true);
    }
  };

  const handleAccept = () => {
    setDisclaimerAccepted(true);
    setUnlocked(true);
    setShowDisclaimer(false);
  };

  const tab = TABS[activeTab];
  const totalItems = TABS.reduce((a, t) => a + t.items.length, 0);
  const isReady = disclaimerAccepted || unlocked;

  // Auto-show disclaimer when explorer opens and not yet accepted
  useEffect(() => {
    if (open && !isReady && !showDisclaimer) {
      setShowDisclaimer(true);
    }
  }, [open, isReady, showDisclaimer]);

  return (
    <>
      <DisclaimerModal
        open={showDisclaimer}
        onAccept={handleAccept}
        onDecline={() => { setShowDisclaimer(false); onClose(); }}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            key="gray-explorer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ backgroundColor: "rgba(15,23,42,0.99)", backdropFilter: "blur(4px)" }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <span className="text-lg">🏴‍☠️</span>
                </div>
                <div>
                  <h2 className="font-black text-white text-base">Gray Zone Explorer</h2>
                  <p className="text-xs text-orange-400">{totalItems} resources · For educational purposes only</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
                  <span className="text-xs">🛡️</span>
                  <span className="text-xs text-amber-400 font-medium">Use a VPN</span>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300 transition-all"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {isReady ? (
              <div className="flex flex-1 overflow-hidden bg-slate-900">
                {/* Sidebar tabs */}
                <div className="hidden sm:flex flex-col w-52 shrink-0 border-r border-slate-800 py-4 px-3 gap-1 overflow-y-auto bg-slate-900">
                  {TABS.map((t, idx) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(idx)}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all ${
                        activeTab === idx
                          ? "bg-orange-600 text-white shadow-lg shadow-orange-600/40"
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                      }`}
                    >
                      <span className="text-base shrink-0">{t.emoji}</span>
                      <span className="text-sm font-semibold flex-1">{t.label}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                        activeTab === idx ? "bg-white/20 text-white" : "bg-slate-700 text-slate-400"
                      }`}>
                        {t.items.length}
                      </span>
                    </button>
                  ))}

                  {/* Safety tips sidebar box */}
                  <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                    <p className="text-xs font-bold text-amber-400 mb-2">🛡️ Stay Safe</p>
                    <ul className="space-y-1.5 text-xs text-amber-400/80">
                      <li>• VPN always on</li>
                      <li>• uBlock Origin installed</li>
                      <li>• Verify checksums</li>
                      <li>• Check comments</li>
                      <li>• Know local laws</li>
                    </ul>
                  </div>
                </div>

                {/* Mobile tab bar */}
                <div className="sm:hidden fixed bottom-0 left-0 right-0 flex gap-1 px-2 py-2 bg-slate-800 border-t border-slate-700 z-10 overflow-x-auto">
                  {TABS.map((t, idx) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(idx)}
                      className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 shrink-0 transition-all ${
                        activeTab === idx ? "bg-orange-600 text-white" : "text-gray-500 hover:text-white"
                      }`}
                    >
                      <span className="text-base">{t.emoji}</span>
                      <span className="text-xs font-semibold whitespace-nowrap">{t.label}</span>
                    </button>
                  ))}
                </div>

                {/* Content area */}
                <div className="flex-1 overflow-y-auto px-5 py-6 pb-24 sm:pb-6 bg-slate-900">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="mb-5">
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                          <span>{tab.emoji}</span>
                          {tab.label}
                          <span className="text-sm font-normal text-slate-500">
                            ({tab.items.length} resources)
                          </span>
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">{tab.description}</p>

                        {/* Tip box */}
                        <div className={`mt-3 rounded-xl border px-4 py-3 text-xs leading-relaxed ${tab.tipColor}`}>
                          <strong>💡 Tip:</strong> {tab.tip}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {tab.items.map((item) => (
                          <GrayExplorerCard key={item.name} item={item} />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              // Locked state (shouldn't normally be seen — disclaimer auto-shows)
              <div className="flex flex-1 items-center justify-center bg-slate-900">
                <div className="text-center">
                  <div className="text-5xl mb-4">🔒</div>
                  <p className="text-white font-bold mb-2">Accept the disclaimer to continue</p>
                  <button
                    onClick={handleOpen}
                    className="rounded-2xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-500 transition-all"
                  >
                    Show Disclaimer
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
