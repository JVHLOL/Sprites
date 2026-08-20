// Fortnite Sprite Locker — dual roster (Classic S3 + Override C7S4)
// status per variant: null = missing, 'owned' | 'mastered' | 'lost' | 'soon' | 'na'

export const RARITY_COLORS = {
  rare: '#38bdf8', epic: '#c084fc', legendary: '#fbbf24', mythic: '#f87171',
};

// --- Classic (Season 3 style) variants ---
export const CLASSIC_VARIANTS = ['normal', 'gold', 'gummy', 'galaxy', 'gem', 'holofoil', 'cube', 'quack'];
export const CLASSIC_VARIANT_META = {
  normal:   { label: 'Normal',   color: '#a0aec0', desc: 'Base ability only — no extra bonus.' },
  gold:     { label: 'Gold',     color: '#f6c343', desc: 'Bonus XP from eliminations.' },
  gummy:    { label: 'Gummy',    color: '#f472b6', desc: 'More Sprite Dust when you extract.' },
  galaxy:   { label: 'Galaxy',   color: '#a78bfa', desc: 'More ammo when looting.' },
  gem:      { label: 'Gem',      color: '#e2e8f0', desc: '\u221230% fall damage.' },
  holofoil: { label: 'Holofoil', color: '#34d399', desc: 'Squad finds rare sprites more often.' },
  cube:     { label: 'Cube',     color: '#4ade80', desc: 'Overdrive while in the Storm.' },
  quack:    { label: 'Quack',    color: '#fb923c', desc: 'Other sprites gain +50% progress.' },
};

const CLASSIC_IMG = {
  water: { normal: 'water_basic', gold: 'water_gold', gummy: 'water_candy', galaxy: 'water_galaxy', gem: 'water_gem', holofoil: 'water_holofoil', quack: 'water_quack' },
  earth: { normal: 'earth_basic', gold: 'earth_gold', gummy: 'earth_candy', galaxy: 'earth_galaxy', gem: 'earth_gem', cube: 'earth_cube', quack: 'earth_quack' },
  fire: { normal: 'fire_basic', gold: 'fire_gold', gummy: 'fire_candy', galaxy: 'fire_galaxy', holofoil: 'fire_holofoil', cube: 'fire_cube', quack: 'fire_quack' },
  fishy: { normal: 'fishy_basic', gold: 'fishy_gold', gummy: 'fishy_candy', galaxy: 'fishy_galaxy', cube: 'fishy_cube' },
  air: { normal: 'air_basic', gold: 'air_gold', gummy: 'air_candy', galaxy: 'air_galaxy', holofoil: 'air_holo' },
  duck: { normal: 'duck_basic', gold: 'duck_gold', gummy: 'duck_candy', galaxy: 'duck_galaxy', gem: 'duck_gem' },
  ghost: { normal: 'ghost_basic', gold: 'ghost_gold', gummy: 'ghost_candy', galaxy: 'ghost_galaxy', holofoil: 'ghost_holo' },
  demon: { normal: 'demon_basic', gold: 'demon_gold', gummy: 'demon_candy', galaxy: 'demon_galaxy', gem: 'demon_gem' },
  king: { normal: 'king_basic', gold: 'king_gold', gummy: 'king_candy', galaxy: 'king_galaxy', holofoil: 'king_holofoil' },
  aura: { normal: 'drifter_basic', gold: 'drifter_gold', gummy: 'drifter_candy', galaxy: 'drifter_galaxy', gem: 'drifter_gem' },
  striker: { normal: 'soccer_basic', gold: 'soccer_gold', gummy: 'soccer_candy', galaxy: 'soccer_galaxy', holofoil: 'soccer_holofoil' },
  dream: { normal: 'dream_basic', gold: 'dream_gold', gummy: 'dream_candy', galaxy: 'dream_galaxy', cube: 'dream_cube' },
  punk: { normal: 'punk_basic', gold: 'punk_gold', gummy: 'punk_candy', galaxy: 'punk_galaxy', gem: 'punk_gem', cube: 'punk_cube' },
  boss: { normal: 'boss_basic', gold: 'boss_gold', gummy: 'boss_candy', galaxy: 'boss_galaxy', cube: 'boss_cube' },
  seven: { normal: 'seven_basic', gold: 'seven_gold', gummy: 'seven_candy', galaxy: 'seven_galaxy', holofoil: 'seven_holofoil' },
  'peeky-peely': { normal: 'peely_basic', gold: 'peely_gold', gummy: 'peely_candy', galaxy: 'peely_galaxy', holofoil: 'peely_holofoil' },
  'lootin-llama': { normal: 'llama_basic', gold: 'llama_gold', gummy: 'llama_candy', galaxy: 'llama_galaxy', gem: 'llama_gem' },
  batman: { normal: 'fossilmeal_basic', gold: 'fossilmeal_gold', gummy: 'fossilmeal_candy', galaxy: 'fossilmeal_galaxy', holofoil: 'fossilmeal_holofoil', cube: 'fossilmeal_cube' },
  'grim-reaper': { normal: 'grimreaper_basic', gold: 'grimreaper_gold', gummy: 'grimreaper_candy', galaxy: 'grimreaper_galaxy', gem: 'grimreaper_gem', holofoil: 'grimreaper_holofoil', cube: 'grimreaper_cube' },
  'zero-point': { normal: 'zeropoint_basic', gold: 'zeropoint_gold', gummy: 'zeropoint_candy', galaxy: 'zeropoint_galaxy', gem: 'zeropoint_gem', holofoil: 'zeropoint_holofoil', cube: 'zeropoint_cube', quack: 'zeropoint_quack' },
  'burnt-peanut': { normal: 'theburntpeanut_basic' },
  'vini-jr': {},
  pollo: {},
  'john-wick': {},
  ironmouse: {},
};

// --- Override (C7S4) variants ---
export const OVERRIDE_VARIANTS = ['normal', 'gold', 'cheatmaster'];
export const OVERRIDE_VARIANT_META = {
  normal:      { label: 'Normal',       color: '#a0aec0', desc: 'Base ability only — no extra bonus.' },
  gold:        { label: 'Gold',         color: '#f6c343', desc: '3× bonus XP from eliminations.' },
  cheatmaster: { label: 'Cheat Master', color: '#34d399', desc: 'Any input works on world Cheat Codes.' },
};

const OVERRIDE_IMG = {
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

export let VARIANTS = OVERRIDE_VARIANTS;
export let VARIANT_META = OVERRIDE_VARIANT_META;

export function spriteImageUrl(spriteId, variant) {
  const oSlug = OVERRIDE_IMG[spriteId]?.[variant];
  if (oSlug) return `https://spritelocker.com/sprites/c7s4/${oSlug}.webp`;
  const cSlug = CLASSIC_IMG[spriteId]?.[variant];
  if (cSlug) return `https://spritelocker.com/sprites/c7s3/${cSlug}.webp`;
  return null;
}

/** Proxied URL for reliable cross-origin display + canvas */
export function spriteDisplayUrl(spriteId, variant) {
  const raw = spriteImageUrl(spriteId, variant);
  if (!raw) return null;
  return 'https://images.weserv.nl/?url=' + encodeURIComponent(raw.replace(/^https?:\/\//, '')) + '&output=webp&w=160&n=-1';
}

export const CLASSIC_SPRITES = [
  { id: 'water', name: 'Water', rarity: 'rare',
    ability: 'Replenishes shields for you and nearby squadmates while in water.',
    where: 'Near water — lakes, rivers, coastline.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: null, cube: 'na', quack: null } },
  { id: 'earth', name: 'Earth', rarity: 'rare',
    ability: 'Chance for extra rare items from chests (up to 30% at max).',
    where: 'Forests and wooded areas.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: 'na', cube: null, quack: null } },
  { id: 'fire', name: 'Fire', rarity: 'rare',
    ability: 'Fiery burst after dealing enough damage to an enemy.',
    where: 'City / built-up POIs.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: null, quack: null } },
  { id: 'fishy', name: 'Fishy', rarity: 'rare',
    ability: 'Increases swim speed and a brief movement boost when damaged.',
    where: 'Chests across the map.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: 'na', cube: null, quack: 'na' } },
  { id: 'air', name: 'Air', rarity: 'rare',
    ability: 'Sprint faster, jump higher while sprinting, zero fall damage.',
    where: 'Chests, Rare Chests, Sprite Chests.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' } },
  { id: 'duck', name: 'Duck', rarity: 'epic',
    ability: 'Emoting or jamming replenishes your shields.',
    where: 'Sprite Chests across the map.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: 'na', cube: 'na', quack: 'na' } },
  { id: 'ghost', name: 'Ghost', rarity: 'epic',
    ability: 'Cloaks you on reload (2–4 seconds).',
    where: 'Only spawns at night.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' } },
  { id: 'demon', name: 'Demon', rarity: 'epic',
    ability: 'Siphons health and shields on eliminations.',
    where: 'Sprite Chests across the map.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: 'na', cube: 'na', quack: 'na' } },
  { id: 'king', name: 'King', rarity: 'epic',
    ability: 'Your pickaxe deals more damage (up to +125%).',
    where: 'Sprite Chests across the map.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' } },
  { id: 'aura', name: 'Aura', rarity: 'epic',
    ability: 'Grants a Shock Rock charge after dealing enough damage.',
    where: 'Chests and Supply Drops.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: 'na', cube: 'na', quack: 'na' } },
  { id: 'striker', name: 'Striker', rarity: 'epic',
    ability: 'Triggers Overdrive when you mantle, hurdle, or wall scramble.',
    where: 'Unlock by scoring a goal at the Soccer Pitch.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' } },
  { id: 'dream', name: 'Dream', rarity: 'legendary',
    ability: 'Briefly enter the dream realm — invisible and faster.',
    where: 'Sprite Chests and high-tier loot.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: 'na', cube: null, quack: 'na' } },
  { id: 'punk', name: 'Punk', rarity: 'legendary',
    ability: 'Damage dealt while sliding or mantling is increased.',
    where: 'Sprite Chests.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: 'na', cube: null, quack: 'na' } },
  { id: 'boss', name: 'Boss', rarity: 'legendary',
    ability: 'Higher chance to find higher rarity weapons.',
    where: 'Named POI boss chests.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: 'na', cube: null, quack: 'na' } },
  { id: 'seven', name: 'Seven', rarity: 'legendary',
    ability: 'Marks the nearest enemy after dealing damage.',
    where: 'Rare Chests and Supply Drops.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' } },
  { id: 'peeky-peely', name: 'Peeky Peely', rarity: 'legendary',
    ability: 'Throw a banana that peels enemies and slows them.',
    where: 'Sprite Chests and Banana stands.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' } },
  { id: 'lootin-llama', name: "Lootin' Llama", rarity: 'legendary',
    ability: 'Chance for extra loot from eliminations and chests.',
    where: 'Llama spawns and rare chests.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: 'na', cube: 'na', quack: 'na' } },
  { id: 'batman', name: 'Batman', rarity: 'mythic',
    ability: 'Grapple and glide briefly; marks enemies in a cone.',
    where: 'Mythic chests / special events.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: null, quack: 'na' } },
  { id: 'grim-reaper', name: 'Grim Reaper', rarity: 'mythic',
    ability: 'Siphon on elim + brief speed boost after a knock.',
    where: 'Mythic / high-tier Sprite Chests.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: null, cube: null, quack: 'na' } },
  { id: 'zero-point', name: 'Zero Point', rarity: 'mythic',
    ability: 'Phase through structures briefly and deal void damage.',
    where: 'Zero Point related locations / rare spawns.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: null, cube: null, quack: null } },
  { id: 'burnt-peanut', name: 'Burnt Peanut', rarity: 'mythic',
    ability: 'Explosive peanut that blinds and damages nearby foes.',
    where: 'Special peanut stands / rare chests.',
    variants: { normal: null, gold: 'na', gummy: 'na', galaxy: 'na', gem: 'na', holofoil: 'na', cube: 'na', quack: 'na' } },
  { id: 'vini-jr', name: 'Vini Jr.', rarity: 'mythic',
    ability: 'Sprint boost and ball-kick style knockback.',
    where: 'Collab / soccer pitch related.',
    variants: { normal: null, gold: 'na', gummy: 'na', galaxy: 'na', gem: 'na', holofoil: 'na', cube: 'na', quack: 'na' } },
  { id: 'pollo', name: 'Pollo', rarity: 'mythic',
    ability: 'Chicken-themed speed and egg projectile.',
    where: 'Collab / rare spawns.',
    variants: { normal: null, gold: 'na', gummy: 'na', galaxy: 'na', gem: 'na', holofoil: 'na', cube: 'na', quack: 'na' } },
  { id: 'john-wick', name: 'John Wick', rarity: 'mythic',
    ability: 'Reveals nearby enemies after you knock or eliminate a player.',
    where: 'Simpsons Reload map (Springfield) — carries over to BR.',
    variants: { normal: null, gold: 'na', gummy: 'na', galaxy: 'na', gem: 'na', holofoil: 'na', cube: 'na', quack: 'na' } },
  { id: 'ironmouse', name: 'Ironmouse', rarity: 'mythic',
    ability: 'Regenerates health when low and cloaks you with low gravity while healing.',
    where: 'Relic Chests.',
    variants: { normal: null, gold: 'na', gummy: 'na', galaxy: 'na', gem: 'na', holofoil: 'na', cube: 'na', quack: 'na' } },
];

export const OVERRIDE_SPRITES = [
  { id: 'jonesy', name: 'Jonesy', rarity: 'rare',
    ability: 'After a short delay, recover health or shields when damaged.',
    where: 'Starter pick · Chests · Lobby code PLAY4ALL (CM)',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'bush', name: 'Bush', rarity: 'rare',
    ability: 'Spawns a bush on you after a duration. At max, bush on elimination.',
    where: 'Starter pick · Chests · Lobby code GATHERANDCRAFT (CM)',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'adventure', name: 'Adventure', rarity: 'rare',
    ability: 'Upgrade a random inventory item at each level up.',
    where: 'Starter pick · Mountainous areas · Lobby code BORN2PLAY (CM)',
    variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'eightbit', name: '8-Bit', rarity: 'rare',
    ability: '8-Bit Shotgun in your first chest + score multiplier.',
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

export let SPRITES = OVERRIDE_SPRITES;

export function applyRosterData(mode) {
  if (mode === 'classic') {
    SPRITES = CLASSIC_SPRITES;
    VARIANTS = CLASSIC_VARIANTS;
    VARIANT_META = CLASSIC_VARIANT_META;
  } else {
    SPRITES = OVERRIDE_SPRITES;
    VARIANTS = OVERRIDE_VARIANTS;
    VARIANT_META = OVERRIDE_VARIANT_META;
  }
}

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
