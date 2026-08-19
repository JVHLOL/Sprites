// Fortnite Sprite roster — ~25 base / 117 variants (community data, Aug 2026)
// status per variant: null = missing, 'owned' | 'mastered' | 'lost' | 'soon' | 'na'

export const VARIANTS = ['normal', 'gold', 'gummy', 'galaxy', 'gem', 'holofoil', 'cube', 'quack'];

export const VARIANT_META = {
  normal:   { label: 'Normal',   color: '#a0aec0', desc: 'Base ability only — no extra bonus.' },
  gold:     { label: 'Gold',     color: '#f6c343', desc: 'Bonus XP from eliminations.' },
  gummy:    { label: 'Gummy',    color: '#f472b6', desc: 'More Sprite Dust when you extract.' },
  galaxy:   { label: 'Galaxy',   color: '#a78bfa', desc: 'More ammo when looting.' },
  gem:      { label: 'Gem',      color: '#e2e8f0', desc: '\u221230% fall damage.' },
  holofoil: { label: 'Holofoil', color: '#34d399', desc: 'Squad finds rare sprites more often.' },
  cube:     { label: 'Cube',     color: '#4ade80', desc: 'Overdrive while in the Storm.' },
  quack:    { label: 'Quack',    color: '#fb923c', desc: 'Other sprites gain +50% progress.' },
};

export const RARITY_COLORS = {
  rare: '#38bdf8', epic: '#c084fc', legendary: '#fbbf24', mythic: '#f87171',
};

const IMG = {
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
  batman: { },
  'grim-reaper': { normal: 'grimreaper_basic', gold: 'grimreaper_gold', gummy: 'grimreaper_candy', galaxy: 'grimreaper_galaxy', gem: 'grimreaper_gem', holofoil: 'grimreaper_holofoil', cube: 'grimreaper_cube' },
  'zero-point': { normal: 'zeropoint_basic', gold: 'zeropoint_gold', gummy: 'zeropoint_candy', galaxy: 'zeropoint_galaxy', gem: 'zeropoint_gem', holofoil: 'zeropoint_holofoil', cube: 'zeropoint_cube', quack: 'zeropoint_quack' },
  'burnt-peanut': { normal: 'theburntpeanut_basic' },
  'vini-jr': { },
  pollo: { },
  'john-wick': { },
  ironmouse: { },
};

export function spriteImageUrl(spriteId, variant) {
  const slug = IMG[spriteId]?.[variant];
  if (!slug) return null;
  return `https://spritelocker.com/sprites/${slug}.webp`;
}

export const SPRITES = [
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
    ability: 'Grants a random item each level; legendary loot at max.',
    where: 'Chests only — rarer spawn.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: 'na', cube: null, quack: 'na' } },
  { id: 'punk', name: 'Punk', rarity: 'legendary',
    ability: 'Chance of infinite ammo.',
    where: 'Chests only — rarer spawn.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'soon', holofoil: 'na', cube: null, quack: 'na' } },
  { id: 'boss', name: 'Boss', rarity: 'legendary',
    ability: 'Boosts maximum Health and Shield.',
    where: 'Drops from any Boss after you defeat them.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: 'na', cube: null, quack: 'na' } },
  { id: 'seven', name: 'Seven', rarity: 'legendary',
    ability: 'Makes enemy footsteps visible for your squad.',
    where: 'Sprite Chests in unranked BR and Zero Build.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' } },
  { id: 'peeky-peely', name: 'Peeky Peely', rarity: 'legendary',
    ability: 'Marks rare sprite variants and enemies carrying them nearby.',
    where: 'High ground — mountainous areas.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' } },
  { id: 'lootin-llama', name: "Lootin' Llama", rarity: 'legendary',
    ability: 'Chance of a weapon upgrade when you open an ammo box.',
    where: 'Relic Chests; Sprite/Rare Chests around Golden Grove & Calamari Canyon.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: 'na', cube: 'na', quack: 'na' } },
  { id: 'batman', name: 'Batman', rarity: 'mythic',
    ability: 'Leap and deploy Bat Cape to glide; find rare Sprites more often.',
    where: 'Beat Catwoman (or Harley/Ivy) NPCs, DC quests, or Sprite Chests.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: null, quack: 'na' } },
  { id: 'grim-reaper', name: 'Grim Reaper', rarity: 'mythic',
    ability: 'Anyone who attacks you gets marked.',
    where: 'Chests across the map.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: null, cube: null, quack: 'na' } },
  { id: 'zero-point', name: 'Zero Point', rarity: 'mythic',
    ability: 'Spawns a Shield Bubble Jr. when you use a healing item on yourself.',
    where: 'Vault / keycard Sprite Chests — rarest collectible.',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: null, cube: null, quack: null } },
  { id: 'burnt-peanut', name: 'Burnt Peanut', rarity: 'mythic',
    ability: 'On eliminations, chance for extra loot (up to mythic at max).',
    where: 'Relic Chests (~1.5% chance).',
    variants: { normal: null, gold: 'na', gummy: 'na', galaxy: 'na', gem: 'na', holofoil: 'na', cube: 'na', quack: 'na' } },
  { id: 'vini-jr', name: 'Vini Jr.', rarity: 'mythic',
    ability: 'Sprint unlocks a slidekick that damages enemies and boosts fire rate.',
    where: 'Sprite Chests and Rare Chests.',
    variants: { normal: null, gold: 'na', gummy: 'na', galaxy: 'na', gem: 'na', holofoil: 'na', cube: 'na', quack: 'na' } },
  { id: 'pollo', name: 'Pollo', rarity: 'mythic',
    ability: 'After an elimination, you and your squad regenerate shields.',
    where: 'Sprite Chests and Rare Chests.',
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
