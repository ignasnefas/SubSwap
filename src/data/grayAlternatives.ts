// ─────────────────────────────────────────────────────────────────────────────
// Gray-zone / not-so-legal alternatives data
// Organised by category so each subscription card can show relevant entries
// ─────────────────────────────────────────────────────────────────────────────

export type GrayAltType =
  | "torrent-public"
  | "torrent-private"
  | "streaming"
  | "ebook"
  | "music"
  | "software"
  | "general";

export interface GrayAlternative {
  name: string;
  url: string;
  description: string;
  type: GrayAltType;
  logo: string;
  tags: string[];
  /** invite-only / ratio-required etc */
  note?: string;
}

// ── Public Torrent Trackers ───────────────────────────────────────────────────
export const PUBLIC_TRACKERS: GrayAlternative[] = [
  {
    name: "The Pirate Bay",
    url: "https://thepiratebay.org",
    description: "The world's most resilient torrent index. Vast library spanning movies, TV, music, games, software and ebooks.",
    type: "torrent-public",
    logo: "🏴‍☠️",
    tags: ["movies", "tv", "music", "software", "ebooks"],
  },
  {
    name: "1337x",
    url: "https://1337x.to",
    description: "Clean, well-curated torrent site with verified uploaders and a beautiful modern UI. Great for movies and TV.",
    type: "torrent-public",
    logo: "🔱",
    tags: ["movies", "tv", "music", "games", "software"],
  },
  {
    name: "RARBG Mirror",
    url: "https://rargb.to",
    description: "Community-maintained mirrors of the legendary RARBG index, known for high-quality encodes.",
    type: "torrent-public",
    logo: "📦",
    tags: ["movies", "tv", "high-quality"],
  },
  {
    name: "Nyaa.si",
    url: "https://nyaa.si",
    description: "The premier torrent tracker for anime, manga, and Japanese media of all kinds.",
    type: "torrent-public",
    logo: "🐱",
    tags: ["anime", "manga", "japanese media"],
  },
  {
    name: "EZTV",
    url: "https://eztv.re",
    description: "Dedicated TV-show torrent tracker. Auto-updated within minutes of episode airing.",
    type: "torrent-public",
    logo: "📺",
    tags: ["tv shows", "episodes"],
  },
  {
    name: "Torrent Galaxy",
    url: "https://torrentgalaxy.to",
    description: "Modern public tracker with verified uploaders, built-in streaming previews, and no signup required.",
    type: "torrent-public",
    logo: "🌌",
    tags: ["movies", "tv", "music", "ebooks", "software"],
  },
  {
    name: "LimeTorrents",
    url: "https://www.limetorrents.lol",
    description: "Large general-purpose index with health indicators (seeders/leechers) prominently displayed.",
    type: "torrent-public",
    logo: "🍋",
    tags: ["movies", "tv", "games", "software"],
  },
  {
    name: "Rutracker",
    url: "https://rutracker.org",
    description: "Russian-based but globally used forum-style tracker. Legendary for rare, high-quality audio and obscure content.",
    type: "torrent-public",
    logo: "🇷🇺",
    tags: ["music", "movies", "software", "rare content"],
    note: "Free registration required",
  },
  {
    name: "YTS (YIFY)",
    url: "https://yts.mx",
    description: "Specialises in small-file-size high-quality movie encodes. Huge library, clean site, easy magnet links.",
    type: "torrent-public",
    logo: "🎬",
    tags: ["movies", "small size", "HD"],
  },
  {
    name: "Zooqle",
    url: "https://zooqle.com",
    description: "Searchable torrent engine with IMDb/TVDB integration for movies and TV.",
    type: "torrent-public",
    logo: "🦓",
    tags: ["movies", "tv", "games"],
  },
];

// ── Private Torrent Trackers ──────────────────────────────────────────────────
export const PRIVATE_TRACKERS: GrayAlternative[] = [
  {
    name: "IPTorrents",
    url: "https://iptorrents.com",
    description: "Large semi-private tracker with a massive library across all categories. Accepts new members periodically.",
    type: "torrent-private",
    logo: "🔒",
    tags: ["movies", "tv", "music", "software"],
    note: "Invite or open signups periodically",
  },
  {
    name: "TorrentLeech",
    url: "https://www.torrentleech.org",
    description: "UK-based private tracker renowned for fast pre-times on new releases and an active community.",
    type: "torrent-private",
    logo: "🦟",
    tags: ["movies", "tv", "games", "fast pre-times"],
    note: "Invite only — watch for open signups",
  },
  {
    name: "PassThePopcorn (PTP)",
    url: "https://passthepopcorn.me",
    description: "The gold standard for movie torrents. Every file is screened for quality. Trumping system ensures best encode wins.",
    type: "torrent-private",
    logo: "🍿",
    tags: ["movies", "high-quality", "curated"],
    note: "Invite only — highly exclusive",
  },
  {
    name: "HDBits",
    url: "https://hdbits.org",
    description: "Elite HD movie/TV tracker. Content quality is unmatched — internal encodes are reference-level.",
    type: "torrent-private",
    logo: "💎",
    tags: ["movies", "tv", "4K", "HD", "elite"],
    note: "Extremely hard to get in — invite only",
  },
  {
    name: "Gazelle (What.CD successor) — RED",
    url: "https://redacted.sh",
    description: "redacted.sh is the premier private music tracker. Lossless FLAC, rare pressings, detailed metadata. The best for audiophiles.",
    type: "torrent-private",
    logo: "🎵",
    tags: ["music", "FLAC", "lossless", "audiophile"],
    note: "Interview required to join",
  },
  {
    name: "Orpheus (OPS)",
    url: "https://orpheus.network",
    description: "Second major music tracker after Redacted. Accepts open signups at times. Excellent lossless library.",
    type: "torrent-private",
    logo: "🎶",
    tags: ["music", "FLAC", "lossless"],
    note: "Open signups occasionally",
  },
  {
    name: "MyAnonamouse (MAM)",
    url: "https://www.myanonamouse.net",
    description: "The best private tracker for ebooks, audiobooks, and courses. Massive library, friendly community.",
    type: "torrent-private",
    logo: "🐭",
    tags: ["ebooks", "audiobooks", "courses"],
    note: "Easy to join — register during open signup windows",
  },
  {
    name: "GazelleGames (GGn)",
    url: "https://gazellegames.net",
    description: "Premier private tracker for PC games, console ROMs, and game-related content.",
    type: "torrent-private",
    logo: "🎮",
    tags: ["games", "PC", "console", "ROMs"],
    note: "Invite only",
  },
  {
    name: "Bibliotik",
    url: "https://bibliotik.me",
    description: "Private ebook and audiobook tracker with excellent metadata and curation.",
    type: "torrent-private",
    logo: "📚",
    tags: ["ebooks", "audiobooks"],
    note: "Invite only",
  },
  {
    name: "BroadcasTheNet (BTN)",
    url: "https://broadcasthe.net",
    description: "TV-only private tracker. Pre-times within seconds of airing. Complete season packs for almost every show ever.",
    type: "torrent-private",
    logo: "📡",
    tags: ["tv shows", "complete seasons", "fast"],
    note: "Invite only — very selective",
  },
];

// ── Free Streaming Sites ──────────────────────────────────────────────────────
export const STREAMING_SITES: GrayAlternative[] = [
  {
    name: "1moviesz",
    url: "https://1moviesz.to/",
    description: "Updated streaming endpoint for movies and TV with fast access.",
    type: "streaming",
    logo: "🎬",
    tags: ["movies", "tv", "fast"],
  },
  {
    name: "TVids.to",
    url: "https://www.tvids.to/",
    description: "Reliable streaming site for movies and TV shows.",
    type: "streaming",
    logo: "📺",
    tags: ["movies", "tv", "no signup"],
  },
  {
    name: "GoMovies",
    url: "https://gomovies.ms/",
    description: "Free streaming site with a large catalog of movies and series.",
    type: "streaming",
    logo: "🍿",
    tags: ["movies", "tv", "HD"],
  },
  {
    name: "FMoviesTo",
    url: "https://fmoviesto.me/",
    description: "Mirror for FMovies with up-to-date links and good bitrate.",
    type: "streaming",
    logo: "🎥",
    tags: ["movies", "tv", "HD"],
  },
  {
    name: "WatchCartoonOnline",
    url: "https://www.watchcartoononline.cc/",
    description: "Large anime and cartoon library with subbed and dubbed episodes.",
    type: "streaming",
    logo: "🐼",
    tags: ["anime", "cartoons", "sub", "dub"],
  },
  {
    name: "Tubi TV",
    url: "https://tubitv.com",
    description: "100% legal, 100% free with ads. Massive library of 50,000+ titles.",
    type: "streaming",
    logo: "📡",
    tags: ["movies", "tv", "legal", "huge library"],
    note: "Actually legal — ad-supported",
  },
  {
    name: "Kanopy",
    url: "https://www.kanopy.com",
    description: "Free with a library card. Arthouse films, documentaries, and classics. Completely legal.",
    type: "streaming",
    logo: "🏛️",
    tags: ["arthouse", "documentaries", "legal", "library card"],
    note: "Legal — requires library card",
  },
];

// ── Free Ebook / Book Sites ───────────────────────────────────────────────────
export const EBOOK_SITES: GrayAlternative[] = [
  {
    name: "Anna's Archive",
    url: "https://annas-archive.org",
    description: "The world's largest open-source library mirror. Aggregates Sci-Hub, LibGen, Z-Library and more. Search for any book, paper, or article.",
    type: "ebook",
    logo: "📖",
    tags: ["books", "papers", "textbooks", "magazines"],
  },
  {
    name: "Library Genesis (LibGen)",
    url: "https://libgen.is",
    description: "Legendary shadow library with millions of books, textbooks, papers and comics. The OG.",
    type: "ebook",
    logo: "📚",
    tags: ["textbooks", "fiction", "non-fiction", "comics", "papers"],
  },
  {
    name: "Sci-Hub",
    url: "https://sci-hub.se",
    description: "Unlocks paywalled academic papers. Paste any DOI, PMID, or URL and get the full paper instantly.",
    type: "ebook",
    logo: "🔬",
    tags: ["academic papers", "research", "science"],
    note: "Essential for researchers",
  },
  {
    name: "Z-Library",
    url: "https://z-lib.id",
    description: "Massive ebook library with a clean interface and personal login to track downloads.",
    type: "ebook",
    logo: "📕",
    tags: ["ebooks", "fiction", "non-fiction", "textbooks"],
    note: "Daily download limits apply",
  },
  {
    name: "Project Gutenberg",
    url: "https://www.gutenberg.org",
    description: "Over 70,000 public-domain books. Completely legal. Classic literature, history, philosophy.",
    type: "ebook",
    logo: "🕰️",
    tags: ["classics", "public domain", "legal"],
    note: "100% legal — public domain",
  },
  {
    name: "Standard Ebooks",
    url: "https://standardebooks.org",
    description: "Beautifully formatted, proofreader-edited public domain ebooks. Way better than Gutenberg formatting.",
    type: "ebook",
    logo: "✨",
    tags: ["classics", "public domain", "high quality", "legal"],
    note: "100% legal — public domain",
  },
  {
    name: "Open Library",
    url: "https://openlibrary.org",
    description: "Internet Archive's library lending system. Borrow digital books for free, legally.",
    type: "ebook",
    logo: "🌐",
    tags: ["borrow", "legal", "wide selection"],
    note: "Legal — controlled digital lending",
  },
  {
    name: "IRC #ebooks (IRCHighway)",
    url: "https://www.irchighway.net/ebooks",
    description: "Join the #ebooks IRC channel and use search bots to download almost any book via DCC. Old school but incredibly comprehensive.",
    type: "ebook",
    logo: "💬",
    tags: ["IRC", "DCC", "ebooks", "audiobooks"],
    note: "Requires IRC client (e.g. HexChat)",
  },
];

// ── Free Music Sites ──────────────────────────────────────────────────────────
export const MUSIC_SITES: GrayAlternative[] = [
  {
    name: "Soulseek",
    url: "https://www.slsknet.org",
    description: "Peer-to-peer music sharing network beloved by audiophiles. Find rare, out-of-print, and lossless FLAC albums that don't exist anywhere else.",
    type: "music",
    logo: "🎵",
    tags: ["P2P", "FLAC", "lossless", "rare music"],
    note: "Download the Soulseek client",
  },
  {
    name: "Deemix / Deezer Downloader",
    url: "https://github.com/bambanah/deemix",
    description: "Tool to download from Deezer at full FLAC / MP3 320 quality using a free account. Huge library.",
    type: "music",
    logo: "🟠",
    tags: ["FLAC", "MP3 320", "downloader"],
    note: "Requires Deezer free account",
  },
  {
    name: "Spotify Downloader (spotDL)",
    url: "https://github.com/spotDL/spotify-downloader",
    description: "Open-source CLI tool that matches Spotify tracks to YouTube Music and downloads them with proper metadata.",
    type: "music",
    logo: "🟢",
    tags: ["spotify", "MP3", "metadata", "CLI"],
    note: "Command-line tool — technical setup",
  },
  {
    name: "Free Music Archive",
    url: "https://freemusicarchive.org",
    description: "Curated library of high-quality, legally free music under Creative Commons licenses.",
    type: "music",
    logo: "🎸",
    tags: ["legal", "Creative Commons", "indie"],
    note: "100% legal",
  },
  {
    name: "Bandcamp",
    url: "https://bandcamp.com",
    description: "Artists often offer free or pay-what-you-want downloads. Huge indie library. Also legal.",
    type: "music",
    logo: "🎪",
    tags: ["indie", "pay-what-you-want", "legal"],
    note: "Mostly legal — pay what you want",
  },
  {
    name: "DoubleDouble.digital",
    url: "https://doubledouble.digital",
    description: "Repository of links to rare music, bootlegs, and live recordings shared by collectors.",
    type: "music",
    logo: "💿",
    tags: ["bootlegs", "live", "rare"],
  },
  {
    name: "YouTube → MP3 (yt-dlp)",
    url: "https://github.com/yt-dlp/yt-dlp",
    description: "The most powerful media downloader. Download audio from YouTube, SoundCloud, and 1000+ sites at highest quality.",
    type: "music",
    logo: "▶️",
    tags: ["youtube", "CLI", "MP3", "any site"],
    note: "Command-line — very powerful",
  },
];

// ── Software / Apps (cracked) ─────────────────────────────────────────────────
export const SOFTWARE_SITES: GrayAlternative[] = [
  {
    name: "Mobilism",
    url: "https://forum.mobilism.org",
    description: "Forum for cracked Android apps and iOS IPA files. Clean, organised, and actively maintained.",
    type: "software",
    logo: "📱",
    tags: ["Android", "iOS", "apps"],
    note: "Forum registration required",
  },
  {
    name: "DownloadHa",
    url: "https://www.downloadha.com",
    description: "Persian software site with cracked desktop apps, games, and tools. Surprisingly well-curated.",
    type: "software",
    logo: "💾",
    tags: ["Windows", "Mac", "software", "games"],
  },
  {
    name: "CrackWatch (Reddit)",
    url: "https://www.reddit.com/r/CrackWatch/",
    description: "Subreddit tracking the cracking status of DRM-protected PC games. Links to scene releases.",
    type: "software",
    logo: "🎮",
    tags: ["PC games", "DRM", "crack status"],
  },
  {
    name: "FitGirl Repacks",
    url: "https://fitgirl-repacks.site",
    description: "Highly compressed PC game repacks. A 50 GB game might download as 15 GB. Trusted and verified.",
    type: "software",
    logo: "👩",
    tags: ["PC games", "compressed", "repacks"],
    note: "Longer install time due to decompression",
  },
  {
    name: "DODI Repacks",
    url: "https://dodi-repacks.site",
    description: "Alternative to FitGirl for compressed PC game repacks. Sometimes faster and with optional DLC.",
    type: "software",
    logo: "🎯",
    tags: ["PC games", "compressed", "DLC"],
  },
  {
    name: "0install / Scoop (legit)",
    url: "https://scoop.sh",
    description: "Windows package manager for installing open-source software easily. Completely legal.",
    type: "software",
    logo: "🍦",
    tags: ["Windows", "package manager", "legal"],
    note: "100% legal",
  },
  {
    name: "Revanced Manager",
    url: "https://vanced.to/",
    description: "Assistive manager for installing custom Android YouTube clients and patches.",
    type: "software",
    logo: "⚙️",
    tags: ["Android", "YouTube", "modding"],
    note: "Use with caution; side-loaded APK may not be official",
  },
];

// ── Map subscription categories/IDs to relevant gray alt types ────────────────
export interface GrayAltSection {
  title: string;
  emoji: string;
  items: GrayAlternative[];
}

export function getGrayAltsForSub(subId: string, category: string): GrayAltSection[] {
  const sections: GrayAltSection[] = [];

  // ─ Only show grey zone for subscriptions where it actually makes sense ─
  // i.e. content (movies/music/books) and expensive crackable software + games
  
  const isEntertainment = category === "Entertainment" ||
    ["netflix", "disney-plus"].includes(subId);

  const isMusic = ["spotify", "youtube-premium"].includes(subId);

  const isBooks: boolean = false; // No book subscriptions in the list yet

  // Only expensive/crackable software (Adobe, design tools, expensive dev tools)
  const isExpensiveCreackableSoftware = 
    ["adobe-creative-cloud", "figma", "microsoft365"].includes(subId);

  const isGames = category === "Gaming" || 
    ["steam", "epic-games", "xbox-game-pass", "playstation-plus", "nintendo-switch-online", "ubisoft-plus"].includes(subId);

  // Early return: if no relevant category, don't show grey zone at all
  if (!isEntertainment && !isMusic && !isBooks && !isExpensiveCreackableSoftware && !isGames) {
    return [];
  }

  // Show torrent trackers (universal for all piracy)
  sections.push({
    title: "Public Torrent Trackers",
    emoji: "🌊",
    items: PUBLIC_TRACKERS,
  });

  sections.push({
    title: "Private Torrent Trackers",
    emoji: "🔐",
    items: PRIVATE_TRACKERS,
  });

  if (isEntertainment) {
    sections.push({
      title: "Free Streaming Sites",
      emoji: "📺",
      items: STREAMING_SITES,
    });
  }

  if (isMusic) {
    sections.push({
      title: "Free Music Downloads",
      emoji: "🎵",
      items: MUSIC_SITES,
    });
  }

  if (isBooks) {
    sections.push({
      title: "Free Ebook & Book Sites",
      emoji: "📚",
      items: EBOOK_SITES,
    });
  }

  if (isExpensiveCreackableSoftware || isGames) {
    sections.push({
      title: "Software & Games",
      emoji: "💾",
      items: SOFTWARE_SITES,
    });
  }

  return sections.filter(s => s.items.length > 0);
}
