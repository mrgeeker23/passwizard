// Endless Spell Forge — PCG + CFG + Seeded PRNG for maximum variety

interface ForgeChoice {
  label: string;
  emoji: string;
  color?: string;
}

export interface ForgeOptions {
  colors: ForgeChoice[];
  cartoons: ForgeChoice[];
  numbers: ForgeChoice[];
  symbols: ForgeChoice[];
}

// ===== SEEDED PRNG (Mulberry32) — deterministic yet unique per session =====

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fresh seed each generation call — combines timestamp + Math.random for entropy
let _sessionCounter = 0;
function createRng(): () => number {
  const seed = (Date.now() ^ (++_sessionCounter * 2654435761)) + Math.floor(Math.random() * 1e9);
  return mulberry32(seed);
}

// ===== HISTORY TRACKER — prevents recent repeats =====

const HISTORY_SIZE = 5;
const _history: { colors: string[][]; cartoons: string[][]; numbers: string[][]; symbols: string[][] } = {
  colors: [], cartoons: [], numbers: [], symbols: [],
};

function wasRecentlyShown(category: keyof typeof _history, labels: string[]): boolean {
  const key = labels.sort().join('|');
  return _history[category].some(prev => prev.sort().join('|') === key);
}

function recordShown(category: keyof typeof _history, labels: string[]) {
  _history[category].push([...labels]);
  if (_history[category].length > HISTORY_SIZE) _history[category].shift();
}

// ===== PRNG-based utilities =====

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function seededPick<T>(arr: T[], count: number, rng: () => number): T[] {
  return seededShuffle(arr, rng).slice(0, count);
}

// ===== CFG-STYLE WORD GENERATORS =====
// Grammar: [Adjective?] + [Base] + [Title?] — expands differently each call

const funAdjectives = ['Little', 'Happy', 'Brave', 'Lucky', 'Swift', 'Jolly', 'Wild', 'Cool', 'Zappy', 'Mega'];
const proAdjectives = ['Dark', 'Iron', 'Neo', 'Cyber', 'Arc', 'Prime', 'Ultra', 'Nova', 'Hex', 'Quantum'];

// ===== FUN MODE POOLS =====

const funColorBases: Record<string, ForgeChoice[]> = {
  warm: [
    { label: 'Red', emoji: '❤️', color: '0 80% 50%' },
    { label: 'Orange', emoji: '🧡', color: '25 95% 55%' },
    { label: 'Pink', emoji: '💖', color: '330 80% 60%' },
    { label: 'Sunny', emoji: '☀️', color: '45 90% 55%' },
    { label: 'Rose', emoji: '🌹', color: '345 75% 50%' },
    { label: 'Peach', emoji: '🍑', color: '20 85% 65%' },
    { label: 'Ruby', emoji: '💎', color: '350 70% 48%' },
    { label: 'Flame', emoji: '🔥', color: '10 90% 52%' },
  ],
  cool: [
    { label: 'Blue', emoji: '💙', color: '210 80% 55%' },
    { label: 'Sky', emoji: '☁️', color: '200 75% 60%' },
    { label: 'Ice', emoji: '🧊', color: '195 70% 55%' },
    { label: 'Aqua', emoji: '🌊', color: '180 65% 50%' },
    { label: 'Ocean', emoji: '🐳', color: '215 75% 50%' },
    { label: 'Rain', emoji: '🌧️', color: '220 60% 55%' },
    { label: 'Frost', emoji: '❄️', color: '190 65% 52%' },
    { label: 'Wave', emoji: '🏄', color: '205 70% 55%' },
  ],
  nature: [
    { label: 'Green', emoji: '💚', color: '140 70% 40%' },
    { label: 'Leaf', emoji: '🍀', color: '120 65% 45%' },
    { label: 'Lime', emoji: '🍋', color: '80 75% 50%' },
    { label: 'Mint', emoji: '🌿', color: '160 60% 48%' },
    { label: 'Fern', emoji: '🌱', color: '130 55% 42%' },
    { label: 'Moss', emoji: '🪴', color: '100 50% 40%' },
    { label: 'Clover', emoji: '☘️', color: '125 60% 44%' },
    { label: 'Jade', emoji: '🐸', color: '150 55% 40%' },
  ],
  magic: [
    { label: 'Purple', emoji: '💜', color: '270 65% 50%' },
    { label: 'Gold', emoji: '👑', color: '42 90% 50%' },
    { label: 'Silver', emoji: '🌙', color: '210 20% 70%' },
    { label: 'Star', emoji: '⭐', color: '50 85% 55%' },
    { label: 'Moon', emoji: '🌛', color: '240 30% 60%' },
    { label: 'Violet', emoji: '🔮', color: '280 60% 52%' },
    { label: 'Pearl', emoji: '🤍', color: '0 0% 90%' },
    { label: 'Coral', emoji: '🪸', color: '15 75% 55%' },
  ],
};

const funCartoonBases: Record<string, ForgeChoice[]> = {
  classic: [
    { label: 'Garfield', emoji: '🐱' }, { label: 'Scooby', emoji: '🐕' },
    { label: 'Tom', emoji: '😼' }, { label: 'Jerry', emoji: '🐭' },
    { label: 'Tweety', emoji: '🐥' }, { label: 'Bugs', emoji: '🐰' },
    { label: 'Daffy', emoji: '🦆' }, { label: 'Pluto', emoji: '🐕' },
  ],
  modern: [
    { label: 'Bluey', emoji: '🐶' }, { label: 'Peppa', emoji: '🐷' },
    { label: 'Elsa', emoji: '❄️' }, { label: 'Olaf', emoji: '⛄' },
    { label: 'Moana', emoji: '🌺' }, { label: 'Simba', emoji: '🦁' },
    { label: 'Nemo', emoji: '🐠' }, { label: 'Woody', emoji: '🤠' },
  ],
  pop: [
    { label: 'Sponge', emoji: '🧽' }, { label: 'Pika', emoji: '⚡' },
    { label: 'Mario', emoji: '🍄' }, { label: 'Sonic', emoji: '💨' },
    { label: 'Kirby', emoji: '🩷' }, { label: 'Yoshi', emoji: '🦖' },
    { label: 'Luigi', emoji: '🟢' }, { label: 'Toad', emoji: '🍄' },
  ],
  cute: [
    { label: 'Panda', emoji: '🐼' }, { label: 'Bunny', emoji: '🐰' },
    { label: 'Kitty', emoji: '🐱' }, { label: 'Puppy', emoji: '🐶' },
    { label: 'Ducky', emoji: '🦆' }, { label: 'Foxy', emoji: '🦊' },
    { label: 'Hammy', emoji: '🐹' }, { label: 'Koala', emoji: '🐨' },
  ],
  adventure: [
    { label: 'Dora', emoji: '🎒' }, { label: 'Diego', emoji: '🌴' },
    { label: 'Boots', emoji: '🐒' }, { label: 'Chase', emoji: '🐾' },
    { label: 'Rubble', emoji: '🏗️' }, { label: 'Skye', emoji: '🦅' },
    { label: 'Rocky', emoji: '🪨' }, { label: 'Zuma', emoji: '🏊' },
  ],
};

const funTitles = [
  'Star', 'Hero', 'Pal', 'Champ', 'Ace', 'Buddy',
  'King', 'Boss', 'Pro', 'Whiz', 'Dash', 'Spark',
  'Gem', 'Jet', 'Blitz', 'Zen', 'Nova', 'Bolt',
];

const funEmojiPool: ForgeChoice[] = [
  { label: '🔥', emoji: '🔥' }, { label: '⚡', emoji: '⚡' },
  { label: '🌈', emoji: '🌈' }, { label: '🎮', emoji: '🎮' },
  { label: '🚀', emoji: '🚀' }, { label: '💎', emoji: '💎' },
  { label: '🦄', emoji: '🦄' }, { label: '🍕', emoji: '🍕' },
  { label: '🎸', emoji: '🎸' }, { label: '🏆', emoji: '🏆' },
  { label: '🎯', emoji: '🎯' }, { label: '🎪', emoji: '🎪' },
  { label: '🧲', emoji: '🧲' }, { label: '🪄', emoji: '🪄' },
  { label: '🎨', emoji: '🎨' }, { label: '🌸', emoji: '🌸' },
  { label: '🍭', emoji: '🍭' }, { label: '🎠', emoji: '🎠' },
  { label: '🧸', emoji: '🧸' }, { label: '🎈', emoji: '🎈' },
];

// ===== PRO MODE POOLS =====

const proColorBases: Record<string, ForgeChoice[]> = {
  fire: [
    { label: 'Crimson', emoji: '🔥', color: '0 80% 50%' },
    { label: 'Scarlet', emoji: '🌋', color: '5 85% 48%' },
    { label: 'Ember', emoji: '🔶', color: '15 90% 52%' },
    { label: 'Blaze', emoji: '💥', color: '25 95% 55%' },
    { label: 'Ruby', emoji: '💎', color: '350 75% 45%' },
    { label: 'Coral', emoji: '🪸', color: '10 80% 55%' },
    { label: 'Magma', emoji: '🌡️', color: '8 88% 50%' },
    { label: 'Flare', emoji: '☄️', color: '18 92% 54%' },
  ],
  frost: [
    { label: 'Azure', emoji: '❄️', color: '200 80% 55%' },
    { label: 'Cobalt', emoji: '🌊', color: '215 75% 50%' },
    { label: 'Frost', emoji: '🧊', color: '190 65% 52%' },
    { label: 'Sapphire', emoji: '💧', color: '220 70% 48%' },
    { label: 'Slate', emoji: '🌀', color: '210 40% 45%' },
    { label: 'Indigo', emoji: '🔵', color: '240 60% 48%' },
    { label: 'Arctic', emoji: '🏔️', color: '195 72% 56%' },
    { label: 'Steel', emoji: '⚙️', color: '210 30% 50%' },
  ],
  earth: [
    { label: 'Emerald', emoji: '🌿', color: '140 70% 40%' },
    { label: 'Jade', emoji: '🌲', color: '150 65% 38%' },
    { label: 'Sage', emoji: '🍀', color: '100 50% 45%' },
    { label: 'Cedar', emoji: '🪵', color: '30 45% 35%' },
    { label: 'Fern', emoji: '🦎', color: '130 60% 44%' },
    { label: 'Olive', emoji: '🫒', color: '80 40% 40%' },
    { label: 'Basalt', emoji: '🪨', color: '20 20% 30%' },
    { label: 'Terra', emoji: '🌍', color: '25 50% 38%' },
  ],
  arcane: [
    { label: 'Onyx', emoji: '🌑', color: '260 30% 25%' },
    { label: 'Amethyst', emoji: '🔮', color: '270 65% 50%' },
    { label: 'Gilded', emoji: '👑', color: '42 90% 50%' },
    { label: 'Silver', emoji: '🌙', color: '210 20% 70%' },
    { label: 'Violet', emoji: '🌸', color: '280 60% 48%' },
    { label: 'Obsidian', emoji: '⬛', color: '0 0% 15%' },
    { label: 'Phantom', emoji: '👻', color: '260 20% 35%' },
    { label: 'Prism', emoji: '🌈', color: '300 50% 55%' },
  ],
};

const proCartoonBases: Record<string, ForgeChoice[]> = {
  classic: [
    { label: 'Garfield', emoji: '🐱' }, { label: 'Scooby', emoji: '🐕' },
    { label: 'Ranger', emoji: '⚡' }, { label: 'Dexter', emoji: '🧪' },
    { label: 'Samurai', emoji: '⚔️' }, { label: 'Zorro', emoji: '🎭' },
    { label: 'Batman', emoji: '🦇' }, { label: 'Flash', emoji: '⚡' },
  ],
  modern: [
    { label: 'Aang', emoji: '💨' }, { label: 'Ben10', emoji: '🔟' },
    { label: 'Gumball', emoji: '🐱' }, { label: 'Finn', emoji: '🗡️' },
    { label: 'Raven', emoji: '🦅' }, { label: 'Beast', emoji: '🐾' },
    { label: 'Robin', emoji: '🦸' }, { label: 'Cyborg', emoji: '🤖' },
  ],
  anime: [
    { label: 'Naruto', emoji: '🍥' }, { label: 'Goku', emoji: '🐉' },
    { label: 'Luffy', emoji: '🏴‍☠️' }, { label: 'Zoro', emoji: '⚔️' },
    { label: 'Vegeta', emoji: '👊' }, { label: 'Tanjiro', emoji: '🔥' },
    { label: 'Deku', emoji: '💪' }, { label: 'Itachi', emoji: '👁️' },
  ],
  gaming: [
    { label: 'Mario', emoji: '🍄' }, { label: 'Link', emoji: '🗡️' },
    { label: 'Sonic', emoji: '💨' }, { label: 'Cloud', emoji: '⚡' },
    { label: 'Kratos', emoji: '⛓️' }, { label: 'Master', emoji: '🎮' },
    { label: 'Snake', emoji: '🐍' }, { label: 'Samus', emoji: '🚀' },
  ],
  wild: [
    { label: 'Crewmate', emoji: '🚀' }, { label: 'Phoenix', emoji: '🔥' },
    { label: 'Shadow', emoji: '🌑' }, { label: 'Falcon', emoji: '🦅' },
    { label: 'Viper', emoji: '🐍' }, { label: 'Storm', emoji: '⛈️' },
    { label: 'Apex', emoji: '🏹' }, { label: 'Cipher', emoji: '🔐' },
  ],
};

const proTitles = [
  'Mage', 'Knight', 'Rogue', 'Sage', 'Scout', 'Ace',
  'Bolt', 'Edge', 'Fang', 'Hawk', 'Flux', 'Core',
  'Blade', 'Drift', 'Wraith', 'Glitch', 'Byte', 'Pulse',
];

const proSymbolPool = ['!', '@', '#', '$', '%', '^', '&', '*', '_', '+', '-', '=', '?', '~', ':', ';', '<', '>', '|', '/', '\\'];

// ===== GENERATION ENGINE =====

function generateColors(mode: 'fun' | 'pro', rng: () => number): ForgeChoice[] {
  const bases = mode === 'fun' ? funColorBases : proColorBases;
  const bucketKeys = Object.keys(bases);
  const selected = seededPick(bucketKeys, 3, rng);
  const adjs = mode === 'fun' ? funAdjectives : proAdjectives;

  let attempts = 0;
  let result: ForgeChoice[];
  do {
    result = selected.map(bk => {
      const item = seededPick(bases[bk], 1, rng)[0];
      // CFG: 30% chance to prepend an adjective for variety
      if (rng() < 0.3) {
        const adj = seededPick(adjs, 1, rng)[0];
        return { ...item, label: `${adj}${item.label}` };
      }
      return item;
    });
    attempts++;
  } while (wasRecentlyShown('colors', result.map(r => r.label)) && attempts < 10);

  recordShown('colors', result.map(r => r.label));
  return result;
}

function generateCartoons(mode: 'fun' | 'pro', rng: () => number): ForgeChoice[] {
  const bases = mode === 'fun' ? funCartoonBases : proCartoonBases;
  const titles = mode === 'fun' ? funTitles : proTitles;
  const eraKeys = Object.keys(bases);
  // Pick 3 different eras for max variety
  const selectedEras = seededPick(eraKeys, Math.min(3, eraKeys.length), rng);

  let attempts = 0;
  let result: ForgeChoice[];
  do {
    const pool: ForgeChoice[] = [];
    selectedEras.forEach(era => {
      const chars = seededPick(bases[era], 2, rng);
      chars.forEach(c => {
        const title = seededPick(titles, 1, rng)[0];
        pool.push({ ...c, label: `${c.label}${title}` });
      });
    });
    result = seededPick(pool, 3, rng);
    attempts++;
  } while (wasRecentlyShown('cartoons', result.map(r => r.label)) && attempts < 10);

  recordShown('cartoons', result.map(r => r.label));
  return result;
}

function generateNumbers(mode: 'fun' | 'pro', rng: () => number): ForgeChoice[] {
  const max = mode === 'fun' ? 20 : 99;
  const minDist = mode === 'fun' ? 3 : 10;
  const nums: number[] = [];

  let attempts = 0;
  let result: ForgeChoice[];
  do {
    nums.length = 0;
    nums.push(Math.floor(rng() * max) + 1);

    let inner = 0;
    while (nums.length < 3 && inner < 100) {
      const n = Math.floor(rng() * max) + 1;
      if (nums.every(e => Math.abs(n - e) >= minDist)) nums.push(n);
      inner++;
    }
    while (nums.length < 3) nums.push(Math.floor(rng() * max) + 1);

    result = nums.map(n => ({
      label: String(n),
      emoji: mode === 'fun' ? ['🎯', '🎲', '🔢', '🎱', '🎰'][Math.floor(rng() * 5)] : '🎲',
    }));
    attempts++;
  } while (wasRecentlyShown('numbers', result.map(r => r.label)) && attempts < 10);

  recordShown('numbers', result.map(r => r.label));
  return result;
}

function generateFunSymbols(rng: () => number): ForgeChoice[] {
  let attempts = 0;
  let result: ForgeChoice[];
  do {
    result = seededPick(funEmojiPool, 3, rng);
    attempts++;
  } while (wasRecentlyShown('symbols', result.map(r => r.label)) && attempts < 10);

  recordShown('symbols', result.map(r => r.label));
  return result;
}

function generateProSymbols(rng: () => number): ForgeChoice[] {
  let attempts = 0;
  let result: ForgeChoice[];
  do {
    const items: ForgeChoice[] = [];
    for (let i = 0; i < 3; i++) {
      const len = rng() < 0.4 ? 1 : rng() < 0.8 ? 2 : 3;
      const syms = seededPick(proSymbolPool, len, rng);
      // Display emoji is the symbol itself
      items.push({ label: syms.join(''), emoji: syms[0] });
    }
    result = items;
    attempts++;
  } while (wasRecentlyShown('symbols', result.map(r => r.label)) && attempts < 10);

  recordShown('symbols', result.map(r => r.label));
  return result;
}

// ===== MAIN EXPORT =====

export function generateForgeOptions(mode: 'fun' | 'pro' = 'fun'): ForgeOptions {
  const rng = createRng();

  return {
    colors: generateColors(mode, rng),
    cartoons: generateCartoons(mode, rng),
    numbers: generateNumbers(mode, rng),
    symbols: mode === 'fun' ? generateFunSymbols(rng) : generateProSymbols(rng),
  };
}

// Quiz data
export const quizQuestions = [
  {
    question: "What's the #1 thing that makes a password really strong today?",
    options: [
      "Using lots of symbols and emojis and changing it every month",
      "Making it as long as possible (like a sentence or passphrase)",
      "Using your favorite number and birthday",
      "Keeping it short so it's easy to type",
    ],
    correct: 1,
    tip: "Great job! Experts like NIST say length beats everything—your wizard passwords are long and strong because they mix words + extras. Hackers give up way faster on long ones!",
  },
  {
    question: "Should you use the same password for different websites/apps?",
    options: [
      "Yes, it's easier to remember them all",
      "No—use a unique one for each account",
      "Only if it's super long",
      "Yes, but change it every year",
    ],
    correct: 1,
    tip: "One breach shouldn't ruin everything! If hackers get one password, unique ones keep your other accounts safe.",
  },
  {
    question: "What's the smartest way to remember lots of strong passwords?",
    options: [
      "Use the same one everywhere",
      "Store them in a trusted password manager app",
      "Memorize super-complex ones by heart",
      "Save them in a note on your phone",
    ],
    correct: 1,
    tip: "Password managers generate and store super-strong, unique passwords for you. Just remember one master password—MFA makes it even safer!",
  },
  {
    question: "What's the best extra layer of protection for important accounts?",
    options: [
      "Change your password every week",
      "Turn on multi-factor authentication (MFA or 2FA)",
      "Share it only with close friends",
      "Use only numbers",
    ],
    correct: 1,
    tip: "MFA adds a second check (like a code on your phone). Even if someone guesses your password, they can't get in without it!",
  },
];
