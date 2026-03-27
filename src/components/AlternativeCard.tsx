import { Alternative } from "../data/subscriptions";

interface Props {
  alt: Alternative;
}

function getPriceStyle(price: string) {
  if (price === "Free" || price.startsWith("Free (")) {
    return "bg-green-500/20 text-green-300 border-green-500/30";
  }
  if (price.startsWith("Free /") || price.startsWith("Free (self-host) /")) {
    return "bg-teal-500/20 text-teal-300 border-teal-500/30";
  }
  return "bg-blue-500/20 text-blue-300 border-blue-500/30";
}

export default function AlternativeCard({ alt }: Props) {
  const priceStyle = getPriceStyle(alt.price);
  const isFree = alt.price === "Free" || alt.price.startsWith("Free (");

  return (
    <a
      href={alt.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col gap-2.5 rounded-xl border border-white/20 bg-white/5 p-4 shadow-sm hover:shadow-md hover:border-violet-500/40 hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0">{alt.logo ?? "🔗"}</span>
          <span className="font-bold text-white text-sm group-hover:text-violet-300 transition-colors leading-tight">
            {alt.name}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold border whitespace-nowrap ${priceStyle}`}>
            {isFree ? "🆓 " : ""}{alt.price}
          </span>
          {alt.openSource && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
              <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Open Source
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-white/60 leading-relaxed">{alt.description}</p>

      {/* Tags */}
      {alt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {alt.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60 font-medium border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Visit link */}
      <div className="flex items-center gap-1 text-xs text-violet-400 group-hover:text-violet-300 transition-colors mt-auto pt-1">
        <span className="font-semibold">Visit site</span>
        <svg
          className="h-3 w-3 group-hover:translate-x-0.5 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </div>
    </a>
  );
}
