import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function DisclaimerModal({ open, onAccept, onDecline }: Props) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="disclaimer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onDecline(); }}
        >
          <motion.div
            key="disclaimer-panel"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-lg rounded-lg border border-orange-500/30 bg-slate-800 shadow-xl overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 via-red-600 to-rose-600" />

            <div className="p-8">
              {/* Icon + title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/30 shrink-0">
                  <span className="text-3xl">⚠️</span>
                </div>
                <div>
                  <h2 className="text-xl font-black text-white leading-tight">
                    Gray Zone Alternatives
                  </h2>
                  <p className="text-sm text-orange-400 font-medium mt-0.5">
                    Legal disclaimer — please read
                  </p>
                </div>
              </div>

              {/* Body text */}
              <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>
                  The following section lists <strong className="text-white">unofficial, legally gray, or outright illegal</strong> methods
                  to access content without paying — including torrent sites, unofficial streaming platforms,
                  ebook shadow libraries, and peer-to-peer tools.
                </p>

                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 space-y-2">
                  <p className="font-bold text-red-400 flex items-center gap-2">
                    <span>🚫</span> This content is provided for informational purposes only.
                  </p>
                  <ul className="space-y-1.5 text-red-400/80 text-xs list-none pl-0">
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">•</span>
                      Downloading or streaming copyrighted content without authorisation <strong className="text-red-400">may be illegal</strong> in your country.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">•</span>
                      Laws vary by jurisdiction — what is tolerated in one country may carry fines or criminal charges in another.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">•</span>
                      Always use a trusted <strong className="text-red-400">VPN</strong> if you access these services to protect your IP address.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">•</span>
                      We do not host, distribute, or profit from any of the listed content.
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 space-y-1.5">
                  <p className="font-bold text-amber-400 flex items-center gap-2">
                    <span>🛡️</span> Stay safe online
                  </p>
                  <ul className="text-amber-400/80 text-xs space-y-1">
                    <li className="flex items-start gap-2"><span>•</span> Use a reputable VPN (Mullvad, ProtonVPN, IVPN)</li>
                    <li className="flex items-start gap-2"><span>•</span> Use an ad-blocker (uBlock Origin) on all streaming sites</li>
                    <li className="flex items-start gap-2"><span>•</span> Verify checksums / hashes on software downloads</li>
                    <li className="flex items-start gap-2"><span>•</span> Prefer trusted uploaders and private trackers</li>
                  </ul>
                </div>

                <p className="text-slate-500 text-xs">
                  By clicking <strong className="text-slate-400">I Understand</strong>, you acknowledge you are an adult,
                  you understand the legal risks in your jurisdiction, and you take sole
                  responsibility for your actions.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-7 flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={onDecline}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-700 px-5 py-3 text-sm font-semibold text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                >
                  Take me back to safety
                </button>
                <button
                  onClick={onAccept}
                  className="flex-1 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/40 hover:from-orange-500 hover:to-red-500 transition-all active:scale-95"
                >
                  I Understand — Show Me
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
