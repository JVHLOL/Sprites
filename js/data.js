// Fortnite Sprite roster — Chapter 7 Season 4 Override (launch Aug 20, 2026)
// status per variant: null = missing, 'owned' | 'mastered' | 'lost' | 'soon' | 'na'

export const VARIANTS = ['normal', 'gold', 'cheatmaster'];

export const VARIANT_META = {
  normal:      { label: 'Normal',       color: '#a0aec0', desc: 'Base ability only — no extra bonus.' },
  gold:        { label: 'Gold',         color: '#f6c343', desc: '3× bonus XP from eliminations.' },
  cheatmaster: { label: 'Cheat Master', color: '#34d399', desc: 'Any input works on world Cheat Codes.' },
};

export const RARITY_COLORS = {
  rare: '#38bdf8', epic: '#c084fc', legendary: '#fbbf24', mythic: '#f87171',
};

// Official CDN: https://spritelocker.com/sprites/c7s4/{slug}_{variant}.webp
// variants: basic | gold | cheatmaster
const IMG = {
  jonesy:      { normal: 'jonesy_basic',      gold: 'jonesy_gold',      cheatmaster: 'jonesy_cheatmaster' },
  bush:        { normal: 'bush_basic',        gold: 'bush_gold',        cheatmaster: 'bush_cheatmaster' },
  adventure:   { normal: 'adventure_basic',   gold: 'adventure_gold',   cheatmaster: 'adventure_cheatmaster' },
  eightbit:    { normal: 'eightbit_basic',    gold: 'eightbit_gold',    cheatmaster: 'eightbit_cheatmaster' },
  sonic:       { normal: 'sonic_basic',       gold: 'sonic_gold',       cheatmaster: 'sonic_cheatmaster' },
  tails:       { normal: 'tails_basic',       gold: 'tails_gold',       cheatmaster: 'tails_cheatmaster' },
  shadow:      { normal: 'shadow_basic',      gold: 'shadow_gold',      cheatmaster: 'shadow_cheatmaster' },
  killswitch:  { normal: 'killswitch_basic',  gold: 'killswitch_gold',  cheatmaster: 'killswitch_cheatmaster' },
  jackrabbit:  { normal: 'jackrabbit_basic',  gold: 'jackrabbit_gold',  cheatmaster: 'jackrabbit_cheatmaster' },
  klombo:      { normal: 'klombo_basic',      gold: 'klombo_gold',      cheatmaster: 'klombo_cheatmaster' },
  crown:       { normal: 'crown_basic',       gold: 'crown_gold',       cheatmaster: 'crown_cheatmaster' },
  stormscout:  { normal: 'stormscout_basic',  gold: 'stormscout_gold',  cheatmaster: 'stormscout_cheatmaster' },
};

export function spriteImageUrl(spriteId, variant) {
  const slug = IMG[spriteId]?.[variant];
  if (!slug) return null;
  return `https://spritelocker.com/sprites/c7s4/${slug}.webp`;
}

// Full Chapter 7 Season 4 Override roster (12 base × 3 variants)
export const SPRITES = [
  { id: 'jonesy', name: 'Jonesy', rarity: 'rare',
    ability: 'After a short delay, recover Health or Shield when damaged. Heal amount scales with level.',
    where: 'Starter pick · Chests · Cheat Code Chests · Lobby code PLAY4ALL (CM)',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'bush', name: 'Bush', rarity: 'rare',
    ability: 'Spawns a bush on you after a duration. At max level, also gain a bush on elimination. Cooldown shrinks each level.',
    where: 'Starter pick · Chests · Cheat Code Chests · Lobby code GATHERANDCRAFT (CM)',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'adventure', name: 'Adventure', rarity: 'rare',
    ability: 'Upgrade a random inventory item at each level up.',
    where: 'Starter pick · Mountainous areas · Lobby code BORN2PLAY (CM)',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'eightbit', name: '8-Bit', rarity: 'rare',
    ability: 'Find an 8-Bit Shotgun in your first chest + score multiplier on it.',
    where: 'High / mountainous areas · Lobby code 8BITBLAST (CM)',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'sonic', name: 'Sonic', rarity: 'epic',
    ability: 'Gotta go fast! Sprint speed increases with each level.',
    where: 'Chests · Cheat Code Chests · Lobby code GOTTAGOFAST (CM)',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'tails', name: 'Tails', rarity: 'epic',
    ability: 'Hover in the air (cancels fall damage). Enter Cheat Codes instantly at max.',
    where: 'Chests · Cheat Code Chests · Lobby code IWANNAFLYHIGH (CM)',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'shadow', name: 'Shadow', rarity: 'epic',
    ability: 'Automatically reloads weapons over time even when unequipped.',
    where: 'Chests · Cheat Code Chests',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'killswitch', name: 'Killswitch', rarity: 'epic',
    ability: 'Enter Hangtime with improved accuracy while aiming down sights.',
    where: 'Found around the island at night · Chests',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'jackrabbit', name: 'Jackrabbit', rarity: 'legendary',
    ability: 'Perform an extra jump while mid-air.',
    where: 'Chests · Cheat Code Chests',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'klombo', name: 'Klombo', rarity: 'mythic',
    ability: 'Grants random items at each level. Levels only by consuming health/shield items.',
    where: 'Very rare · Chests · Cheat Code Chests',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'crown', name: 'Crown', rarity: 'legendary',
    ability: 'Extra Crown Wins after a Victory Royale. Levels only by winning matches.',
    where: 'Win a match · Master Crown to unlock variants',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'stormscout', name: 'Storm Scout', rarity: 'mythic',
    ability: 'Storm-related scout ability (details update mid-season).',
    where: 'Rare · Chests · Cheat Code Chests',
    variants: { normal: null, gold: null, cheatmaster: null } },
];

// Alias used by app.js roster switch — both modes use current S4 roster
// (Classic = full board, Override = same board; season is Override)
export const OVERRIDE_SPRITES = SPRITES;

export const DUST = {
  rare: { normal: 100, special: 2700 },
  epic: { normal: 2700, special: 4000 },
  legendary: { normal: 4500, special: 6750 },
  mythic: { normal: 6750, special: 10000 },
};

export function isReleased(v) {
  return v !== 'na' && v !== 'soon';
}

export function totalReleased() {
  let n = 0;
  for (const s of SPRITES) {
    for (const v of Object.values(s.variants)) if (isReleased(v) || v === null) n++;
  }
  return n;
}

// Chapter 7 Season 4 Override — Lobby Hack codes (short rewards only)
export const LOBBY_CODES = [
  { code: 'PLAY4ALL', reward: 'Cheat Master Jonesy Sprite' },
  { code: 'GOTTAGOFAST', reward: 'Cheat Master Sonic Sprite' },
  { code: 'IWANNAFLYHIGH', reward: 'Cheat Master Tails Sprite' },
  { code: '8BITBLAST', reward: 'Cheat Master 8-Bit Sprite' },
  { code: 'BORN2PLAY', reward: 'Cheat Master Adventure Sprite' },
  { code: 'GATHERANDCRAFT', reward: 'Cheat Master Bush Sprite' },
  { code: 'OVERRIDEXP', reward: '40,000 XP' },
  { code: 'MAGILUME', reward: '2,000 Sprite Dust' },
  { code: 'CHISPAMBO', reward: '2,000 Sprite Dust' },
  { code: 'PERLIMPINPIN', reward: '2,000 Sprite Dust' },
  { code: 'ABGESTAUBT', reward: '2,000 Sprite Dust' },
  { code: 'O2OVERRIDE', reward: 'Llama + 5 Portable Extractors' },
  { code: 'PERFECTORDER', reward: '4 Spicy Tacos' },
  { code: 'SURVIVETHENIGHT', reward: '2 Cheat Code Locators' },
  { code: 'FINDITCHAT', reward: '2 Cheat Code Locators' },
  { code: 'TAKEYOURHEART', reward: '2 Extraction Accelerators' },
  { code: 'DONTBLOCKME', reward: 'Tetris block (lobby, reusable)' },
  { code: 'LETSBLOCKANDROLL', reward: 'Tetris block (lobby, reusable)' },
  { code: 'BEMOREALIEN', reward: 'Override Ready Loading Screen' },
  { code: 'REACHYOURIMPOSSIBLE', reward: 'Block Party Loading Screen' },
];
