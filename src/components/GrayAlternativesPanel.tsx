import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GrayAlternative,
  GrayAltSection,
  GrayAltType,
} from "../data/grayAlternatives";

interface Props {
  sections: GrayAltSection[];
}

const TYPE_LABELS: Record<GrayAltType, string> = {
  "torrent-public": "Public Tracker",
  "torrent-private": "Private Tracker",
  streaming: "Streaming",
  ebook: "eBooks",
  music: "Music",
  software: "Software/Games",
  general: "General",
};

const TYPE_COLORS: Record<GrayAltType, string> = {
  "torrent-public": "bg-orange-500/15 text-orange-300 border-orange-500/30",
  "torrent-private": "bg-red-500/15 text-red-300 border-red-500/30",
  streaming: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  ebook: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  music: "bg-pink-500/15 text-pink-300 border-pink-500/30",
  software: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  general: "bg-gray-500/15 text-gray-300 border-gray-500/30",
};

const NOTE_LEGAL = ["100% legal", "legal", "actually legal"];

function isLegal(note?: string) {
  if (!note) return false;
  return NOTE_LEGAL.some((l) => note.toLowerCase().includes(l));
}

function GrayCard({ item }: { item: GrayAlternative }) {
  const typeColor = TYPE_COLORS[item.type];
  const legal = isLegal(item.note);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 rounded-xl border border-white/8 bg-white/5 p-3.5 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">{item.logo}</span>
          <span className="font-bold text-white text-sm leading-tight group-hover:text-orange-300 transition-colors truncate">
            {item.name}
          </span>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${typeColor}`}
        >
          {TYPE_LABELS[item.type]}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {item.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-white/8 px-2 py-0.5 text-xs text-gray-400 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Note */}
      {item.note && (
        <div
          className={`flex items-center gap-1.5 text-xs font-medium ${
            legal ? "text-green-400" : "text-amber-400"
          }`}
        >
          <span>{legal ? "✅" : "ℹ️"}</span>
          <span>{item.note}</span>
        </div>
      )}

      {/* Visit */}
      <div className="flex items-center gap-1 text-xs text-orange-400/70 group-hover:text-orange-400 transition-colors mt-auto pt-1">
        <span className="font-semibold">Visit</span>
        <svg className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </div>
    </a>
  );
}

export default function GrayAlternativesPanel({ sections }: Props) {
  const [activeSection, setActiveSection] = useState(0);

  if (sections.length === 0) return null;

  const current = sections[activeSection];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="border-t border-orange-500/20 bg-gradient-to-b from-orange-950/30 to-gray-950/50 px-5 py-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🏴‍☠️</span>
          <div>
            <h4 className="font-black text-white text-sm">Gray Zone Alternatives</h4>
            <p className="text-xs text-orange-400/70">
              Use a VPN · For educational purposes only
            </p>
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {sections.map((section, idx) => (
            <button
              key={section.title}
              onClick={() => setActiveSection(idx)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                activeSection === idx
                  ? "bg-orange-600 text-white shadow-md shadow-orange-900/50"
                  : "bg-white/8 text-gray-400 hover:bg-white/15 hover:text-white"
              }`}
            >
              <span>{section.emoji}</span>
              <span>{section.title}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                  activeSection === idx ? "bg-white/20 text-white" : "bg-white/10 text-gray-500"
                }`}
              >
                {section.items.length}
              </span>
            </button>
          ))}
        </div>

        {/* Section description */}
        {current.title.includes("Private") && (
          <div className="mb-3 rounded-xl border border-amber-500/20 bg-amber-950/20 px-3 py-2 text-xs text-amber-300/80">
            <strong className="text-amber-300">🔐 Private trackers</strong> require an invitation or passing an interview/application.
            They offer vastly superior speeds, quality, and curation compared to public trackers.
            Maintain your ratio (upload as much as you download) to keep your account in good standing.
          </div>
        )}
        {current.title.includes("Streaming") && (
          <div className="mb-3 rounded-xl border border-purple-500/20 bg-purple-950/20 px-3 py-2 text-xs text-purple-300/80">
            <strong className="text-purple-300">📺 Tip:</strong> Install{" "}
            <strong className="text-purple-200">uBlock Origin</strong> before visiting any of these sites.
            Avoid clicking anywhere except play buttons. Some entries marked ✅ are{" "}
            <strong className="text-purple-200">fully legal</strong>.
          </div>
        )}
        {current.title.includes("Ebook") && (
          <div className="mb-3 rounded-xl border border-blue-500/20 bg-blue-950/20 px-3 py-2 text-xs text-blue-300/80">
            <strong className="text-blue-300">📚 Tip:</strong>{" "}
            <strong className="text-blue-200">Anna's Archive</strong> is the best starting point — it searches
            LibGen, Z-Lib, and Sci-Hub simultaneously. Entries marked ✅ are fully legal (public domain / lending).
          </div>
        )}
        {current.title.includes("Music") && (
          <div className="mb-3 rounded-xl border border-pink-500/20 bg-pink-950/20 px-3 py-2 text-xs text-pink-300/80">
            <strong className="text-pink-300">🎵 Tip:</strong>{" "}
            <strong className="text-pink-200">Soulseek</strong> is the audiophile's secret weapon for rare and
            lossless music. <strong className="text-pink-200">yt-dlp</strong> can download from over 1,000 sites.
            Entries marked ✅ are legal.
          </div>
        )}
        {current.title.includes("Software") && (
          <div className="mb-3 rounded-xl border border-cyan-500/20 bg-cyan-950/20 px-3 py-2 text-xs text-cyan-300/80">
            <strong className="text-cyan-300">💾 Warning:</strong> Only download software from
            trusted, well-known sources with active communities. Always scan with{" "}
            <strong className="text-cyan-200">VirusTotal</strong> and check comments for malware warnings.
          </div>
        )}

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-2.5 sm:grid-cols-2"
          >
            {current.items.map((item) => (
              <GrayCard key={item.name} item={item} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer reminder */}
        <p className="mt-4 text-center text-xs text-gray-600">
          🛡️ Always use a VPN · 🔍 Verify files before opening · ⚖️ Know your local laws
        </p>
      </div>
    </motion.div>
  );
}
