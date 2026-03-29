import { motion } from "framer-motion";
import { SUBSCRIPTIONS, Subscription } from "../data/subscriptions";
import { UserSubscription } from "../types";

const QUICK_ADD = ["Notion", "Spotify", "Slack", "Adobe Creative Cloud", "Zoom", "Netflix", "ChatGPT Plus", "Figma"];

interface Props {
  onAdd: (us: UserSubscription) => void;
  addedIds: string[];
}

export default function EmptyState({ onAdd, addedIds }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 bg-slate-900/50 py-14 px-8 text-center"
    >
      <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: "2s" }}>
        💸
      </div>
      <h3 className="text-xl font-black text-white mb-2">Browse by category</h3>
      <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-7">
        Use the category picker below to add subscriptions to your tracker.
      </p>

      <div className="mt-8 flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500 opacity-60"></span>
          {SUBSCRIPTIONS.length}+ subscriptions tracked
        </span>
        <span>·</span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-500 opacity-60"></span>
          Free forever
        </span>
      </div>
    </motion.div>
  );
}
