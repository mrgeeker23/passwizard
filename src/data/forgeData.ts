// Endless Spell Forge data generation

interface ForgeChoice {
  label: string;
  emoji: string;
  color?: string; // HSL for background tint
}

export interface ForgeOptions {
  colors: ForgeChoice[];
  cartoons: ForgeChoice[];
  numbers: ForgeChoice[];
  symbols: ForgeChoice[];
}

// ===== FUN MODE DATA (short, simple, kid-friendly) =====

const funColors = {
  warm: [
    { label: 'Red', emoji: '❤️', color: '0 80% 50%' },
    { label: 'Orange', emoji: '🧡', color: '25 95% 55%' },
    { label: 'Pink', emoji: '💖', color: '330 80% 60%' },
    { label: 'Sunny', emoji: '☀️', color: '45 90% 55%' },
    { label: 'Rose', emoji: '🌹', color: '345 75% 50%' },
    { label: 'Peach', emoji: '🍑', color: '20 85% 65%' },
  ],
  cool: [
    { label: 'Blue', emoji: '💙', color: '210 80% 55%' },
    { label: 'Sky', emoji: '☁️', color: '200 75% 60%' },
    { label: 'Ice', emoji: '🧊', color: '195 70% 55%' },
    { label: 'Aqua', emoji: '🌊', color: '180 65% 50%' },
    { label: 'Ocean', emoji: '🐳', color: '215 75% 50%' },
    { label: 'Rain', emoji: '🌧️', color: '220 60% 55%' },
  ],
  nature: [
    { label: 'Green', emoji: '💚', color: '140 70% 40%' },
    { label: 'Leaf', emoji: '🍀', color: '120 65% 45%' },
    { label: 'Lime', emoji: '🍋', color: '80 75% 50%' },
    { label: 'Mint', emoji: '🌿', color: '160 60% 48%' },
    { label: 'Fern', emoji: '🌱', color: '130 55% 42%' },
    { label: 'Moss', emoji: '🪴', color: '100 50% 40%' },
  ],
  magic: [
    { label: 'Purple', emoji: '💜', color: '270 65% 50%' },
    { label: 'Gold', emoji: '👑', color: '42 90% 50%' },
    { label: 'Silver', emoji: '🌙', color: '210 20% 70%' },
    { label: 'Star', emoji: '⭐', color: '50 85% 55%' },
    { label: 'Moon', emoji: '🌛', color: '240 30% 60%' },
    { label: 'Glow', emoji: '✨', color: '55 80% 58%' },
  ],
};

const funCartoons = {
  classic: [
    { label: 'Garfield', emoji: '🐱' },
    { label: 'Scooby', emoji: '🐕' },
    { label: 'Tom', emoji: '🐱' },
    { label: 'Jerry', emoji: '🐭' },
    { label: 'Tweety', emoji: '🐥' },
    { label: 'Bugs', emoji: '🐰' },
  ],
  modern: [
    { label: 'Bluey', emoji: '🐶' },
    { label: 'Peppa', emoji: '🐷' },
    { label: 'Elsa', emoji: '❄️' },
    { label: 'Olaf', emoji: '⛄' },
    { label: 'Moana', emoji: '🌺' },
    { label: 'Simba', emoji: '🦁' },
  ],
  pop: [
    { label: 'Sponge', emoji: '🧽' },
    { label: 'Pika', emoji: '⚡' },
    { label: 'Mario', emoji: '🍄' },
    { label: 'Sonic', emoji: '💨' },
    { label: 'Kirby', emoji: '🩷' },
    { label: 'Yoshi', emoji: '🦖' },
  ],
  cute: [
    { label: 'Panda', emoji: '🐼' },
    { label: 'Bunny', emoji: '🐰' },
    { label: 'Kitty', emoji: '🐱' },
    { label: 'Puppy', emoji: '🐶' },
    { label: 'Ducky', emoji: '🦆' },
    { label: 'Foxy', emoji: '🦊' },
  ],
};

const funTitles = [
  'Star', 'Hero', 'Pal', 'Champ', 'Ace', 'Buddy',
  'King', 'Boss', 'Pro', 'Whiz', 'Dash', 'Spark',
];

// Fun mode uses emojis as the "symbol" ingredient
const funEmojiPool = [
  { label: '🔥', emoji: '🔥' },
  { label: '⚡', emoji: '⚡' },
  { label: '🌈', emoji: '🌈' },
  { label: '🎮', emoji: '🎮' },
  { label: '🚀', emoji: '🚀' },
  { label: '💎', emoji: '💎' },
  { label: '🦄', emoji: '🦄' },
  { label: '🍕', emoji: '🍕' },
  { label: '🎸', emoji: '🎸' },
  { label: '🏆', emoji: '🏆' },
  { label: '🎯', emoji: '🎯' },
  { label: '🌟', emoji: '🌟' },
  { label: '🎪', emoji: '🎪' },
  { label: '🧲', emoji: '🧲' },
  { label: '🪄', emoji: '🪄' },
];

// ===== PRO MODE DATA (slightly harder but still readable) =====

const proColors = {
  fire: [
    { label: 'Crimson', emoji: '🔥', color: '0 80% 50%' },
    { label: 'Scarlet', emoji: '🌋', color: '5 85% 48%' },
    { label: 'Ember', emoji: '🔶', color: '15 90% 52%' },
    { label: 'Blaze', emoji: '💥', color: '25 95% 55%' },
    { label: 'Ruby', emoji: '💎', color: '350 75% 45%' },
    { label: 'Coral', emoji: '🪸', color: '10 80% 55%' },
  ],
  frost: [
    { label: 'Azure', emoji: '❄️', color: '200 80% 55%' },
    { label: 'Cobalt', emoji: '🌊', color: '215 75% 50%' },
    { label: 'Frost', emoji: '🧊', color: '190 65% 52%' },
    { label: 'Sapphire', emoji: '💧', color: '220 70% 48%' },
    { label: 'Slate', emoji: '🌀', color: '210 40% 45%' },
    { label: 'Indigo', emoji: '🔵', color: '240 60% 48%' },
  ],
  earth: [
    { label: 'Emerald', emoji: '🌿', color: '140 70% 40%' },
    { label: 'Jade', emoji: '🌲', color: '150 65% 38%' },
    { label: 'Sage', emoji: '🍀', color: '100 50% 45%' },
    { label: 'Cedar', emoji: '🪵', color: '30 45% 35%' },
    { label: 'Fern', emoji: '🦎', color: '130 60% 44%' },
    { label: 'Olive', emoji: '🫒', color: '80 40% 40%' },
  ],
  arcane: [
    { label: 'Onyx', emoji: '🌑', color: '260 30% 25%' },
    { label: 'Amethyst', emoji: '🔮', color: '270 65% 50%' },
    { label: 'Gilded', emoji: '👑', color: '42 90% 50%' },
    { label: 'Silver', emoji: '🌙', color: '210 20% 70%' },
    { label: 'Violet', emoji: '🌸', color: '280 60% 48%' },
    { label: 'Obsidian', emoji: '⬛', color: '0 0% 15%' },
  ],
};

const proCartoons = {
  classic: [
    { label: 'Garfield', emoji: '🐱' },
    { label: 'Scooby', emoji: '🐕' },
    { label: 'Ranger', emoji: '⚡' },
    { label: 'Dexter', emoji: '🧪' },
    { label: 'Samurai', emoji: '⚔️' },
    { label: 'Zorro', emoji: '🎭' },
  ],
  modern: [
    { label: 'Aang', emoji: '💨' },
    { label: 'Ben10', emoji: '🔟' },
    { label: 'Gumball', emoji: '🐱' },
    { label: 'Finn', emoji: '🗡️' },
    { label: 'Raven', emoji: '🦅' },
    { label: 'Beast', emoji: '🐾' },
  ],
  anime: [
    { label: 'Naruto', emoji: '🍥' },
    { label: 'Goku', emoji: '🐉' },
    { label: 'Luffy', emoji: '🏴‍☠️' },
    { label: 'Zoro', emoji: '⚔️' },
    { label: 'Vegeta', emoji: '👊' },
    { label: 'Tanjiro', emoji: '🔥' },
  ],
  gaming: [
    { label: 'Mario', emoji: '🍄' },
    { label: 'Link', emoji: '🗡️' },
    { label: 'Sonic', emoji: '💨' },
    { label: 'Cloud', emoji: '⚡' },
    { label: 'Kratos', emoji: '⛓️' },
    { label: 'Master', emoji: '🎮' },
  ],
  wild: [
    { label: 'Crewmate', emoji: '🚀' },
    { label: 'Phoenix', emoji: '🔥' },
    { label: 'Shadow', emoji: '🌑' },
    { label: 'Falcon', emoji: '🦅' },
    { label: 'Viper', emoji: '🐍' },
    { label: 'Storm', emoji: '⛈️' },
  ],
};

const proTitles = [
  'Mage', 'Knight', 'Rogue', 'Sage', 'Scout', 'Ace',
  'Bolt', 'Edge', 'Fang', 'Hawk', 'Flux', 'Core',
];

// Pro mode uses actual symbols
const proSymbolPool = ['!', '@', '#', '$', '%', '^', '&', '*', '_', '+', '-', '=', '?', '~'];

// ===== SHARED UTILITIES =====

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateNumbers(mode: 'fun' | 'pro'): ForgeChoice[] {
  const nums: number[] = [];
  const max = mode === 'fun' ? 20 : 99;
  const minDist = mode === 'fun' ? 3 : 10;
  const first = Math.floor(Math.random() * max) + 1;
  nums.push(first);

  let attempts = 0;
  while (nums.length < 3 && attempts < 100) {
    const n = Math.floor(Math.random() * max) + 1;
    const farEnough = nums.every(existing => Math.abs(n - existing) >= minDist);
    if (farEnough) nums.push(n);
    attempts++;
  }
  while (nums.length < 3) nums.push(Math.floor(Math.random() * max) + 1);

  return nums.map(n => ({ label: String(n), emoji: mode === 'fun' ? '🎯' : '🎲' }));
}

function generateFunSymbols(): ForgeChoice[] {
  return pickRandom(funEmojiPool, 3);
}

function generateProSymbols(): ForgeChoice[] {
  const results: ForgeChoice[] = [];
  for (let i = 0; i < 3; i++) {
    const len = Math.random() < 0.5 ? 1 : 2;
    const syms = pickRandom(proSymbolPool, len);
    results.push({ label: syms.join(''), emoji: '✨' });
  }
  return results;
}

export function generateForgeOptions(mode: 'fun' | 'pro' = 'fun'): ForgeOptions {
  if (mode === 'fun') {
    const bucketKeys = Object.keys(funColors) as (keyof typeof funColors)[];
    const selectedBuckets = pickRandom(bucketKeys, 3);
    const colors = selectedBuckets.map(b => pickRandom(funColors[b], 1)[0]);

    const eraKeys = Object.keys(funCartoons) as (keyof typeof funCartoons)[];
    const selectedEras = pickRandom(eraKeys, 2);
    const pool: ForgeChoice[] = [];
    selectedEras.forEach(era => {
      const chars = pickRandom(funCartoons[era], 2);
      chars.forEach(c => {
        const title = pickRandom(funTitles, 1)[0];
        pool.push({ ...c, label: `${c.label}${title}` });
      });
    });

    return {
      colors,
      cartoons: pickRandom(pool, 3),
      numbers: generateNumbers('fun'),
      symbols: generateFunSymbols(),
    };
  }

  // Pro mode
  const bucketKeys = Object.keys(proColors) as (keyof typeof proColors)[];
  const selectedBuckets = pickRandom(bucketKeys, 3);
  const colors = selectedBuckets.map(b => pickRandom(proColors[b], 1)[0]);

  const eraKeys = Object.keys(proCartoons) as (keyof typeof proCartoons)[];
  const selectedEras = pickRandom(eraKeys, 2);
  const pool: ForgeChoice[] = [];
  selectedEras.forEach(era => {
    const chars = pickRandom(proCartoons[era], 2);
    chars.forEach(c => {
      const title = pickRandom(proTitles, 1)[0];
      pool.push({ ...c, label: `${c.label}${title}` });
    });
  });

  return {
    colors,
    cartoons: pickRandom(pool, 3),
    numbers: generateNumbers('pro'),
    symbols: generateProSymbols(),
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
