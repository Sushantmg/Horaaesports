export interface Player {
  slug: string;
  ign: string;
  name: string;
  role: string;
  join: string;
  skill: string;
  tag: "gold" | "fragger" | "sub";
  photo: string;
  stats: { aim: number; clutch: number; tactical: number };
  bio: string;
  socials: { ig?: string; yt?: string; tiktok?: string };
}

export interface Staff {
  slug: string;
  ign: string;
  name: string;
  role: string;
  photo: string;
  gold?: boolean;
}

export interface Match {
  date: string;
  event: string;
  detail: string;
  badge: string;
  cls: string;
  countdown?: string;
  countdownLabel?: string;
}

export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  cat: string;
  excerpt: string;
  body: string[];
  emoji: string;
  bg: string;
}

export interface GalleryItem {
  title: string;
  tag: string;
  emoji: string;
  bg: string;
  img?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  tag: string;
  meta: string;
  featured?: boolean;
}

export interface MerchItem {
  title: string;
  badge: string;
  desc: string;
  price: string;
  emoji: string;
  bg: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Sponsor {
  icon: string;
  name: string;
  logo?: string;
  url?: string;
}

export interface Achievement {
  icon: string;
  tag: string;
  title: string;
  sub: string;
  p: string;
  wide?: boolean;
  hero?: boolean;
  track?: string[];
}

export interface Stat {
  suffix: string;
  value: number;
  label: string;
  prefix?: string;
}

export const GRADS = [
  "linear-gradient(135deg, #e31837 0%, #8f1222 55%, #3d080d 100%)",
  "linear-gradient(135deg, #f0b429 0%, #b8860b 55%, #4a3303 100%)",
  "linear-gradient(135deg, #7c1122 0%, #e31837 60%, #20050a 100%)",
  "linear-gradient(135deg, #5d0f18 0%, #a3162b 60%, #2b070c 100%)",
  "linear-gradient(135deg, #e31837 0%, #b8860b 70%, #3d080d 100%)",
];

export const PLAYERS: Player[] = [
  {
    slug: "jiggle3",
    ign: "JiGGL3",
    name: "Suprim Adhikari",
    role: "IGL / Captain",
    join: "Jan 2025",
    skill: "Tactics",
    tag: "gold",
    photo: "/images/players/jiggle3.jpg",
    stats: { aim: 74, clutch: 82, tactical: 95 },
    bio: "The brain of the operation. JiGGL3 is known for his calm mind, strategic mindset and the ability to handle pressure in the most intense situations — he calls the rotations, controls the tempo and keeps five hunters on the same page. He started PUBG Mobile in 2018 and never looked back. Under his IGL-ing, Horaa won the PMNS 2025 title and stormed through the PMWC 2025 group stages.",
    socials: { ig: "https://www.instagram.com/jigglee1_/", yt: "https://www.youtube.com/@JiGGL3_YT" },
  },
  {
    slug: "sky",
    ign: "SkY",
    name: "Aakash Sotang Rai",
    role: "Fragger",
    join: "Oct 2023",
    skill: "Sharp Shooting",
    tag: "fragger",
    photo: "/images/players/sky.jpg",
    stats: { aim: 96, clutch: 88, tactical: 70 },
    bio: "Horaa's entry machine and a fan favourite, known across the region for his exceptional aim. SkY — one of the founding members — owns the Grand Finals MVP at the Ruthless Pro Series and remains the deadliest barrel in the squad, snapping heads before opponents even finish rotating.",
    socials: { ig: "https://www.instagram.com/skyhoraa/", yt: "https://www.youtube.com/@SkyyPUBGM", tiktok: "https://www.tiktok.com/@skyhoraaa" },
  },
  {
    slug: "nofear",
    ign: "NoFear",
    name: "Aayush Lama",
    role: "Fragger",
    join: "Jun 2024",
    skill: "Aggressive Entry",
    tag: "fragger",
    photo: "/images/players/nofear.jpg",
    stats: { aim: 90, clutch: 84, tactical: 72 },
    bio: "Aggression personified. NoFear lives at the top of the kill feed, throwing himself into fights most teams would retreat from — and winning far more than he loses. A fearless fragger who sets the tempo for the entire squad and keeps enemies permanently on the back foot.",
    socials: { ig: "https://www.instagram.com/_nofear7/", yt: "https://www.youtube.com/@nofearpubg3911", tiktok: "https://www.tiktok.com/@nofearpubgm_" },
  },
  {
    slug: "sleepy",
    ign: "SleepY",
    name: "Shital Rai",
    role: "Fragger",
    join: "Jan 2025",
    skill: "Strategic Support",
    tag: "fragger",
    photo: "/images/players/sleepy.jpg",
    stats: { aim: 78, clutch: 80, tactical: 88 },
    bio: "The quiet professional. SleepY anchors fights with disciplined positioning and split-second support calls — the glue that keeps Horaa's front line connected. Calm under fire and selfless in clutch moments, he is the support player every great fragger wants behind them.",
    socials: { ig: "https://www.instagram.com/sleepyyhoraa_/", yt: "https://www.youtube.com/@sleepyyhora", tiktok: "https://www.tiktok.com/@sleepyyhoraa" },
  },
  {
    slug: "haitdami",
    ign: "HaitDami",
    name: "Prabesh Gurung",
    role: "Substitute",
    join: "Apr 2025",
    skill: "Rotational",
    tag: "sub",
    photo: "/images/players/haitdami.jpg",
    stats: { aim: 82, clutch: 75, tactical: 70 },
    bio: "Depth on the bench. HaitDami slots into any of the four roles, letting Horaa flex their lineup against every meta without losing a step — a rotational asset who keeps the main squad sharp in scrims.",
    socials: {},
  },
];

export const STAFF: Staff[] = [
  {
    slug: "blaze",
    ign: "Blaze",
    name: "Nabaraj Shrestha",
    role: "Co-Owner",
    photo: "/images/players/blaze.jpg",
    gold: true,
  },
  {
    slug: "cr7-horaa",
    ign: "CR7 Horaa",
    name: "Sanjan Gautam",
    role: "Founder / Owner",
    photo: "/images/players/cr7.jpg",
    gold: true,
  },
  {
    slug: "charlie",
    ign: "Charlie",
    name: "Umesh Budthapa",
    role: "Head of Operations",
    photo: "/images/players/charlie.jpg",
  },
  {
    slug: "mafianinja",
    ign: "MafiaNinja",
    name: "Ugyen Lama",
    role: "Head Coach",
    photo: "/images/players/mafianinja.jpg",
  },
  {
    slug: "rashmay",
    ign: "Rashmay",
    name: "Rashma Chandra Mahara",
    role: "Content · Caster & Analyst",
    photo: "/images/players/rashmay.jpg",
  },
];

export const UPCOMING: Match[] = [
  {
    date: "Aug 8 — 16 · 2026",
    event: "PMWC 2026 — Group Stage",
    detail: "Riyadh, KSA · S-Tier · Group B · Live",
    badge: "LIVE NOW",
    cls: "badge-live",
    countdown: "2026-08-16T12:00:00Z",
    countdownLabel: "PMWC 2026 GRAND FINALS IN",
  },
  {
    date: "Aug 15 — 16 · 2026",
    event: "PMWC 2026 — Grand Finals",
    detail: "Top 16 on the world stage · #FORNEPAL",
    badge: "UPCOMING",
    cls: "badge-upcoming",
  },
];

export const RESULTS: Match[] = [
  {
    date: "Oct 2025",
    event: "PMNS 2025 — Champions",
    detail: "Nepal's premier circuit · Grand Final winners",
    badge: "1ST PLACE",
    cls: "badge-win",
  },
  {
    date: "2025",
    event: "PMTG PRO — Season 2",
    detail: "2nd Runner-Up finish on the podium",
    badge: "3RD",
    cls: "badge-podium",
  },
  {
    date: "Jul 2025",
    event: "PMWC 2025 — Group Stage",
    detail: "First Nepali team ever at the World Cup · Riyadh",
    badge: "QUALIFIED",
    cls: "badge-place",
  },
  {
    date: "Oct 2025",
    event: "PMSL — CSA Fall 2025",
    detail: "Central & South Asia Super League campaign",
    badge: "FINALS",
    cls: "badge-place",
  },
  {
    date: "2025",
    event: "Ruthless Pro Series: Clash of Giants S6",
    detail: "Finals + Grand Finals MVP (SkY)",
    badge: "FINALS",
    cls: "badge-place",
  },
];

export const NEWS: NewsItem[] = [
  {
    slug: "building-an-esports-brand-online-the-horaa-esports-story",
    title: "Building an Esports Brand Online: The Horaa Esports Story",
    date: "Mar 14, 2026",
    cat: "Technology",
    excerpt:
      "Horaa Esports is shaping the future of competitive gaming in Nepal by building a strong esports community, showcasing talented players, and creating a growing presence in the gaming scene.",
    body: [
      "The esports industry is growing rapidly across the world, and Nepal is also becoming part of this exciting digital movement. Teams are no longer just competing in tournaments; they are building brands, communities, and online platforms.",
      "Building an esports brand today requires more than talented players. It requires a strong digital presence, a professional website and smart digital marketing strategies. With the help of modern technology and professional digital solutions, teams like Horaa Esports can connect with fans, attract sponsors, and grow their brand globally.",
      "In today's digital world, a website acts as the official home of a brand. For esports organizations, it plays an even bigger role — sharing news and tournament updates, introducing players and team rosters, selling official merchandise, attracting sponsors, and building trust with fans.",
      "Esports is built on community. Fans want to watch matches, follow players, and stay connected with their favorite teams. A strong online platform allows teams to share updates, highlight matches, and engage with their supporters.",
      "As esports continues to grow in Nepal, organizations that invest in strong digital foundations will have the best opportunity to succeed and connect with audiences around the world.",
    ],
    emoji: "🚀",
    bg: "linear-gradient(135deg, #1d4ed8, #0f2f7a)",
  },
  {
    slug: "horaa-esports-wins-regional-cup-2025",
    title: "Horaa Esports Wins Regional Cup 2025",
    date: "Sep 25, 2025",
    cat: "Esports",
    excerpt:
      "Horaa Esports delivered an outstanding performance at the Regional Cup 2025, securing the championship with skill and teamwork. This victory marks another milestone in Horaa's journey in competitive esports.",
    body: [
      "Horaa Esports has once again proven its dominance in the competitive gaming arena with a spectacular victory at the Regional Esports Cup 2025.",
      "Over the course of the tournament, the team demonstrated exceptional strategy, teamwork, and resilience, facing some of the toughest competitors in the region. Every match showcased Horaa's ability to adapt quickly, execute complex tactics, and maintain composure under intense pressure.",
      "This championship win is not just a trophy; it is a milestone in Horaa's journey, reflecting the organization's unwavering commitment to excellence. Each member of the roster played a crucial role, bringing unique strengths that contributed to the team's overall success.",
      "Beyond the competition itself, this victory represents the growing impact of esports in Nepal. Horaa Esports has become a symbol of dedication, passion, and innovation, inspiring aspiring players and fans across the country.",
      "As the celebrations continue, Horaa is already setting its sights on upcoming tournaments, determined to maintain its winning streak and elevate the standard of esports in the region even further.",
    ],
    emoji: "🏆",
    bg: "linear-gradient(135deg, #f0b429, #b8860b)",
  },
  {
    slug: "horaa-esports-clinches-2nd-place-in-pmsl-csa-spring-2025",
    title: "Horaa Esports Clinches 2nd Place in PMSL CSA Spring 2025",
    date: "Aug 27, 2025",
    cat: "Esports",
    excerpt:
      "Horaa Esports secured 2nd place in the PMSL CSA Spring 2025, showcasing exceptional skill and teamwork. This achievement qualifies them for the PUBG Mobile World Cup 2025, marking a major milestone for the team.",
    body: [
      "Horaa Esports has achieved a remarkable milestone by securing 2nd place in the PUBG Mobile Super League (PMSL) Central & South Asia Spring 2025.",
      "This impressive performance not only earned them a significant share of the $200,000 prize pool but also secured their qualification for the prestigious PUBG Mobile World Cup (PMWC) 2025, held in Riyadh, Saudi Arabia.",
      "Competing against 19 top-tier teams from the region, Horaa Esports showcased exceptional skill, strategy, and teamwork throughout the tournament. Their consistent high-level performances and adaptability under pressure were key factors in their runner-up finish.",
      "This achievement marks a significant milestone in Horaa Esports' journey, highlighting their growth and potential on the international stage. As they prepare for the upcoming PMWC 2025, the team is focused on refining their strategies and enhancing their gameplay to compete against the world's best teams.",
    ],
    emoji: "🌍",
    bg: "linear-gradient(135deg, #e31837, #8f1222)",
  },
  {
    slug: "esports-milestones-horaas-journey-to-success",
    title: "Esports Milestones: Horaa's Journey to Success",
    date: "Aug 24, 2025",
    cat: "Esports",
    excerpt:
      "Horaa Esports has achieved remarkable milestones, from local competitions to regional triumphs. Their journey reflects dedication, teamwork, and a growing impact on Nepal's esports scene.",
    body: [
      "Horaa Esports has grown from a passionate local team into one of Nepal's leading esports organizations, achieving remarkable milestones along the way. From early competitions to dominating regional tournaments, every victory and challenge has shaped the team's journey toward excellence.",
      "The organization has nurtured talented players, organized training bootcamps, and competed in multiple prestigious tournaments, including the Regional Cup 2025 and PMSL CSA Spring 2025, where they secured 2nd place and qualified for the PUBG Mobile World Cup 2025.",
      "These milestones highlight the growth of esports in Nepal and Horaa's dedication to raising the standard of competitive gaming. Beyond the trophies, the team has inspired a growing community of fans, engaged with supporters through events and streams, and set an example for aspiring gamers nationwide.",
      "Horaa's journey is far from over — with new tournaments, bootcamps, and roster expansions on the horizon, the team continues to push boundaries and achieve new heights.",
    ],
    emoji: "📈",
    bg: "linear-gradient(135deg, #059669, #064e3b)",
  },
];

export const GALLERY: GalleryItem[] = [
  { title: "Horaa Esports are the Champions of 2025 PMNS Season!", tag: "Champions", emoji: "🏆", bg: "linear-gradient(135deg, #e31837, #8f1222)", img: "/images/gallery/pmns-champions.jpg" },
  { title: "Together we grow, stronger every day", tag: "Community", emoji: "🤝", bg: "linear-gradient(135deg, #0f2f7a, #1d4ed8)", img: "/images/gallery/together-grow.jpg" },
  { title: "HORAA Esports secures 2nd Runner-Up at PMTG PRO Season 2", tag: "Podium", emoji: "🥉", bg: "linear-gradient(135deg, #b8860b, #4a3303)", img: "/images/gallery/pmtg-podium.jpg" },
  { title: "Individually we shine, but together we grow.", tag: "Community", emoji: "⭐", bg: "linear-gradient(135deg, #334155, #0f172a)", img: "/images/gallery/shine-together.jpg" },
  { title: "Jersey Reveal", tag: "Merch", emoji: "👕", bg: "linear-gradient(135deg, #7a1d2e, #2b070c)", img: "/images/gallery/jersey.jpg" },
  { title: "Training Grounds", tag: "Practice", emoji: "🖥️", bg: "linear-gradient(135deg, #059669, #064e3b)", img: "/images/gallery/training.jpg" },
];

export const VIDEOS: VideoItem[] = [
  {
    id: "U9pxYZo5OcQ",
    title: "[WATCHPARTY] 2025 PMWC at EWC Survival Stage D1",
    channel: "Cr7 HORAA",
    tag: "LIVE",
    meta: "Watch Party · PMWC 2025",
    featured: true,
  },
  {
    id: "kFFiPknm_eA",
    title: "Horaa Esports Makes HISTORY at PMWC 2025 Final!",
    channel: "James Kody",
    tag: "HIGHLIGHT",
    meta: "PMWC 2025 Final",
  },
  {
    id: "Avt0j-lLDek",
    title: "Horaa Esports vs Alpha7 — Epic Clash in PMWC 2025!",
    channel: "Ganesh YT",
    tag: "MATCH",
    meta: "Group Stage Clash",
  },
  {
    id: "7oHgH8Oo25I",
    title: "On Air With Sanjay #665 — Horaa Esports",
    channel: "Sanjay Silwal Gupta",
    tag: "INTERVIEW",
    meta: "Guest Interview",
  },
  {
    id: "wj6S8fTrXGo",
    title: "ON-AIR with SKY and MAFIANINJA | Horaa Esports",
    channel: "PUBG MOBILE Bangladesh",
    tag: "INTERVIEW",
    meta: "PMSL CSA Spring",
  },
];

export const MERCH: MerchItem[] = [
  {
    title: "Horaa Esports Jersey",
    badge: "Standard",
    desc: "Athletic fit with sublimated crimson & gold print. Match-day ready.",
    price: "NRS 1650",
    emoji: "👕",
    bg: "linear-gradient(135deg, #e31837, #7a1d2e)",
  },
  {
    title: "Horaa Esports Jersey",
    badge: "Premium",
    desc: "Premium fabric, embroidered crest & fan edition details.",
    price: "NRS 2000",
    emoji: "✨",
    bg: "linear-gradient(135deg, #f0b429, #b8860b)",
  },
  {
    title: "Caps & Accessories",
    badge: "Collection",
    desc: "Snapbacks, stickers & more — rep the logo anywhere.",
    price: "NRS 950",
    emoji: "🧢",
    bg: "linear-gradient(135deg, #334155, #0f172a)",
  },
];

export const FAQS: Faq[] = [
  {
    q: "What country is Horaa Esports from?",
    a: "Horaa Esports is proudly based in <strong>Nepal</strong> — the first Nepali organization to ever qualify for the PUBG Mobile World Cup.",
  },
  {
    q: "Who owns and runs the organization?",
    a: "Founded by <strong>Sanjan Gautam (CR7 Horaa)</strong> on October 5, 2023, with <strong>Blaze</strong> joining as Co-Owner in 2025. Umesh 'Charlie' Budthapa leads operations as Head of Operations.",
  },
  {
    q: "Who is on the current PUBG Mobile roster?",
    a: "IGL/Captain <strong>JiGGL3</strong>, fraggers <strong>SkY</strong>, <strong>NoFear</strong> &amp; <strong>SleepY</strong>, and rotational player <strong>HaitDami</strong>, led by coach <strong>MafiaNinja</strong>.",
  },
  {
    q: "How can I buy the official Horaa jersey?",
    a: "Hit the <strong>Merch Store</strong> — Standard jerseys at NRS 1650, Premium at NRS 2000. Order through the <a href='https://shop.horaaesports.com.np/' target='_blank' rel='noopener'>official shop</a>.",
  },
  {
    q: "How can brands sponsor or partner with us?",
    a: "We partner with brands across gaming hardware, energy drinks, apparel &amp; Web3. Use the <a href='/contact'>contact form</a> or email <strong>info@horaaesports.com.np</strong> — we reply fast.",
  },
  {
    q: "Where can I watch the matches?",
    a: "Tune into <a href='https://www.youtube.com/@HoraaEsportsOfficial' target='_blank' rel='noopener'>@HoraaEsportsOfficial</a> on YouTube and follow <a href='https://www.instagram.com/horaaesports' target='_blank' rel='noopener'>@horaaesports</a> on Instagram for live alerts.",
  },
];

export const SPONSORS: Sponsor[] = [
  {
    icon: "⚡",
    name: "XTREME ENERGY DRINK",
    logo: "/images/sponsors/xtreme.png",
    url: "https://www.instagram.com/xtreme_energydrink/",
  },
  {
    icon: "▣",
    name: "VIANET",
    logo: "/images/sponsors/vianet.png",
    url: "https://www.vianet.com.np/",
  },
  {
    icon: "◈",
    name: "MANAU",
    logo: "/images/sponsors/manau.png",
    url: "https://www.instagram.com/manau.com.np/",
  },
  {
    icon: "◉",
    name: "INFINIX",
    logo: "/images/sponsors/infinix.jpg",
    url: "https://www.infinixmobility.com/",
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    icon: "🏆",
    tag: "HISTORIC FIRST",
    title: "First Nepali Team at PMWC 2025",
    sub: "PUBG Mobile World Cup · S-Tier",
    p: "Qualified for the PUBG Mobile World Cup 2025 — a milestone for Nepal on the global stage.",
    hero: true,
  },
  {
    icon: "🥇",
    tag: "SEASON 2025",
    title: "PMNS 2025 Champions",
    sub: "Nepal's premier circuit",
    p: "Nepal's premier circuit — crowned champions.",
  },
  {
    icon: "🥉",
    tag: "SEASON 2",
    title: "PMTG PRO 2nd Runner-Up",
    sub: "Podium finish",
    p: "Fought through a stacked field to the podium.",
  },
  {
    icon: "💰",
    tag: "EARNINGS",
    title: "$263K+ Won",
    sub: "Across 57 tournaments",
    p: "~2 Crore+ in Nepali Rupees across 57 tournaments.",
  },
  {
    icon: "⚔️",
    tag: "REGIONAL DOMINANCE",
    title: "Ruthless Pro Series",
    sub: "Clash of Giants S6",
    p: "Back-to-back finals appearances, MVP awards for SkY & NoFear.",
  },
  {
    icon: "🗻",
    tag: "HOME TURF",
    title: "Himalayan Clash",
    sub: "Podium on home soil",
    p: "Podium finishes and Grand Finals MVP on home soil.",
  },
  {
    icon: "📊",
    tag: "CONSISTENCY",
    title: "Top 5 on the Ladder",
    sub: "S-Tier & A-Tier circuit",
    p: "Consistent S-Tier & A-Tier placements across the global PUBG Mobile circuit.",
    wide: true,
    track: ["1", "2", "3", "4", "5"],
  },
];

export const STATS: Stat[] = [
  { suffix: "+", value: 15, label: "Trophies Won" },
  { suffix: "+", value: 9, label: "MVP Awards" },
  { suffix: "", value: 318, label: "Matches Played" },
  { suffix: "K", value: 1389, label: "Peak Viewers" },
  { suffix: "", value: 57, label: "Tournaments" },
];

export const HERO_STATS: Stat[] = [
  { suffix: "", value: 2023, label: "Founded" },
  { suffix: "K+", value: 263, label: "Prize Winnings", prefix: "$" },
  { suffix: "", value: 57, label: "Tournaments" },
];

export const initials = (name: string) =>
  name
    .replace(/[^a-zA-Z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
