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

// COLOR FORGE - Elemental Essence
const colorBuckets = {
  fire: [
    { label: 'CrimsonEmber', emoji: '🔥', color: '0 80% 50%' },
    { label: 'ScarletBlaze', emoji: '🌋', color: '5 85% 48%' },
    { label: 'RubyFlame', emoji: '💎', color: '350 75% 45%' },
    { label: 'InfernoFox', emoji: '🦊', color: '15 90% 52%' },
    { label: 'MoltenSun', emoji: '☀️', color: '25 95% 55%' },
  ],
  water: [
    { label: 'AzureFrost', emoji: '❄️', color: '200 80% 55%' },
    { label: 'CobaltWave', emoji: '🌊', color: '215 75% 50%' },
    { label: 'SapphireTide', emoji: '💧', color: '220 70% 48%' },
    { label: 'CrystalStream', emoji: '🏔️', color: '190 65% 52%' },
    { label: 'OceanMist', emoji: '🐋', color: '195 70% 58%' },
  ],
  nature: [
    { label: 'EmeraldVine', emoji: '🌿', color: '140 70% 40%' },
    { label: 'JadeForest', emoji: '🌲', color: '150 65% 38%' },
    { label: 'LimeSpring', emoji: '🍀', color: '100 75% 45%' },
    { label: 'MossStone', emoji: '🪨', color: '120 50% 42%' },
    { label: 'FernGlow', emoji: '🦎', color: '130 60% 44%' },
  ],
  mystic: [
    { label: 'AmethystStar', emoji: '⭐', color: '270 65% 50%' },
    { label: 'GoldenSunforge', emoji: '👑', color: '42 90% 50%' },
    { label: 'ObsidianShadow', emoji: '🌑', color: '260 30% 25%' },
    { label: 'SilverMoon', emoji: '🌙', color: '210 20% 70%' },
    { label: 'VioletVeil', emoji: '🔮', color: '280 60% 48%' },
  ],
};

// CARTOON FORGE - Mythic Companion
const cartoonEras = {
  classic: [
    { label: 'Garfield', emoji: '🐱' },
    { label: 'ScoobyDoo', emoji: '🐕' },
    { label: 'PowerRanger', emoji: '⚡' },
    { label: 'TomAndJerry', emoji: '🐭' },
  ],
  y2k: [
    { label: 'SpongeBob', emoji: '🧽' },
    { label: 'AvatarAang', emoji: '💨' },
    { label: 'Ben10', emoji: '🔟' },
    { label: 'DextersLab', emoji: '🧪' },
  ],
  modern: [
    { label: 'Bluey', emoji: '🐶' },
    { label: 'PawPatrol', emoji: '🐾' },
    { label: 'Ladybug', emoji: '🐞' },
    { label: 'PeppaPig', emoji: '🐷' },
  ],
  anime: [
    { label: 'Pikachu', emoji: '⚡' },
    { label: 'Naruto', emoji: '🍥' },
    { label: 'Doraemon', emoji: '🤖' },
    { label: 'Goku', emoji: '🐉' },
  ],
  wild: [
    { label: 'AmongUs', emoji: '🚀' },
    { label: 'Gumball', emoji: '🐱' },
    { label: 'PhineasFerb', emoji: '🔧' },
    { label: 'KickButtowski', emoji: '🛹' },
  ],
};

const cartoonTitles = [
  'Bubble Sorcerer', 'Thunder Spirit', 'Time Mage', 'Shadow Knight',
  'Storm Wizard', 'Flame Guardian', 'Frost Healer', 'Star Seeker',
  'Adventure Mage', 'Crystal Paladin', 'Mystic Ranger', 'Arcane Scout',
];

// SYMBOL FORGE
const symbolPool = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '{', '}', '[', ']', '|', ':', ';', '<', '>', '?', '~'];
const rareSymbols = ['★', '∞', '◆', '♦'];

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateNumbers(): ForgeChoice[] {
  const nums: number[] = [];
  const first = Math.floor(Math.random() * 100) + 1;
  nums.push(first);
  
  let attempts = 0;
  while (nums.length < 3 && attempts < 100) {
    const n = Math.floor(Math.random() * 100) + 1;
    const farEnough = nums.every(existing => Math.abs(n - existing) >= 15);
    if (farEnough) nums.push(n);
    attempts++;
  }
  // Fallback
  while (nums.length < 3) nums.push(Math.floor(Math.random() * 100) + 1);
  
  return nums.map(n => ({ label: String(n), emoji: '🎲' }));
}

function generateSymbols(): ForgeChoice[] {
  const count = Math.random() < 0.5 ? 3 : 3;
  const results: ForgeChoice[] = [];
  
  for (let i = 0; i < count; i++) {
    const len = Math.random() < 0.4 ? 1 : Math.random() < 0.7 ? 2 : 3;
    const useRare = Math.random() < 0.1;
    
    if (useRare && len <= 2) {
      const rare = pickRandom(rareSymbols, len);
      results.push({ label: rare.join(''), emoji: '✨' });
    } else {
      const syms = pickRandom(symbolPool, len);
      results.push({ label: syms.join(''), emoji: '✨' });
    }
  }
  return results;
}

export function generateForgeOptions(): ForgeOptions {
  const bucketKeys = Object.keys(colorBuckets) as (keyof typeof colorBuckets)[];
  const selectedBuckets = pickRandom(bucketKeys, 3);
  const colors = selectedBuckets.map(b => pickRandom(colorBuckets[b], 1)[0]);

  const eraKeys = Object.keys(cartoonEras) as (keyof typeof cartoonEras)[];
  const selectedEras = pickRandom(eraKeys, 2);
  const cartoonPool: ForgeChoice[] = [];
  selectedEras.forEach(era => {
    const chars = pickRandom(cartoonEras[era], 2);
    chars.forEach(c => {
      const title = pickRandom(cartoonTitles, 1)[0];
      cartoonPool.push({ ...c, label: `${c.label} ${title}` });
    });
  });
  const cartoons = pickRandom(cartoonPool, 3);

  return {
    colors,
    cartoons,
    numbers: generateNumbers(),
    symbols: generateSymbols(),
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
