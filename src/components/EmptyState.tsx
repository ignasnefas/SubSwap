import { motion } from "framer-motion";
import { SUBSCRIPTIONS, Subscription } from "../data/subscriptions";
import { UserSubscription } from "../types";

const QUICK_ADD = ["Notion", "Spotify", "Slack", "Adobe Creative Cloud", "Zoom", "Netflix", "ChatGPT Plus", "Figma"];

interface Props {
  onAdd: (us: UserSubscription) => void;
  addedIds: string[];
}

export default function EmptyState({ onAdd, addedIds }: Props) {
  const quickSubs = QUICK_ADD.map((name) =>
    SUBSCRIPTIONS.find((s) => s.name === name)
  ).filter(Boolean) as Subscription[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-white/5 backdrop-blur-sm py-14 px-8 text-center"
    >
      <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: "2s" }}>
        💸
      </div>
      <h3 className="text-xl font-black text-white mb-2">What are you paying for?</h3>
      <p className="text-white/50 text-sm max-w-sm leading-relaxed mb-7">
        Search above or click a common subscription below to instantly see free and open-source
        alternatives that do the same job.
      </p>

      <div className="flex flex-wrap justify-center gap-2 max-w-md">
        {quickSubs.map((sub) => {
          const added = addedIds.includes(sub.id);
          return (
            <motion.button
              key={sub.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              disabled={added}
              onClick={() => !added && onAdd({ sub, price: sub.avgPrice })}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-all ${
                added
                  ? "border-green-400/30 bg-green-500/10 text-green-400 cursor-default"
                  : "border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:border-violet-400/50 hover:text-white cursor-pointer"
              }`}
            >
              <span>{sub.logo}</span>
              <span>{sub.name}</span>
              {added && <span className="text-green-400">✓</span>}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-4 text-xs text-white/20">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-400 opacity-60"></span>
          {SUBSCRIPTIONS.length}+ subscriptions tracked
        </span>
        <span>·</span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-violet-400 opacity-60"></span>
          Free forever
        </span>
      </div>
    </motion.div>
  );
}
