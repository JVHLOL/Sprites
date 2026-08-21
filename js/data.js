// Fortnite Sprite Locker — dual roster (Classic S3 + Override C7S4)
import { CLASSIC_IMG, CLASSIC_SPRITES } from './classic.js';

export const RARITY_COLORS = {
  rare: '#38bdf8', epic: '#c084fc', legendary: '#fbbf24', mythic: '#f87171',
};
export const CLASSIC_VARIANTS = ['normal', 'gold', 'gummy', 'galaxy', 'gem', 'holofoil', 'cube', 'quack'];
export const CLASSIC_VARIANT_META = {
  normal:   { label: 'Normal',   color: '#a0aec0', desc: 'Base ability only — no extra bonus.' },
  gold:     { label: 'Gold',     color: '#f6c343', desc: 'Bonus XP from eliminations.' },
  gummy:    { label: 'Gummy',    color: '#f472b6', desc: 'More Sprite Dust when you extract.' },
  galaxy:   { label: 'Galaxy',   color: '#a78bfa', desc: 'More ammo when looting.' },
  gem:      { label: 'Gem',      color: '#e2e8f0', desc: '-30% fall damage.' },
  holofoil: { label: 'Holofoil', color: '#34d399', desc: 'Squad finds rare sprites more often.' },
  cube:     { label: 'Cube',     color: '#4ade80', desc: 'Overdrive while in the Storm.' },
  quack:    { label: 'Quack',    color: '#fb923c', desc: 'Other sprites gain +50% progress.' },
};
export { CLASSIC_IMG, CLASSIC_SPRITES };

export const OVERRIDE_VARIANTS = ['normal', 'gold', 'cheatmaster'];
export const OVERRIDE_VARIANT_META = {
  normal:      { label: 'Normal',       color: '#a0aec0', desc: 'Base ability only — no extra bonus.' },
  gold:        { label: 'Gold',         color: '#f6c343', desc: '3x bonus XP from eliminations.' },
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
export function spriteDisplayUrl(spriteId, variant) {
  const raw = spriteImageUrl(spriteId, variant);
  if (!raw) return null;
  return 'https://images.weserv.nl/?url=' + encodeURIComponent(raw.replace(/^https?:\/\//, '')) + '&output=webp&w=160&n=-1';
}
export const OVERRIDE_SPRITES = [
  { id: 'jonesy', name: 'Jonesy', rarity: 'rare', ability: 'After a short delay, recover health or shields when damaged.', where: 'Starter pick · Chests · Lobby code PLAY4ALL (CM)', variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'bush', name: 'Bush', rarity: 'rare', ability: 'Spawns a bush on you after a duration. At max, bush on elimination.', where: 'Starter pick · Chests · Lobby code GATHERANDCRAFT (CM)', variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'adventure', name: 'Adventure', rarity: 'rare', ability: 'Upgrade a random inventory item at each level up.', where: 'Starter pick · Mountainous areas · Lobby code BORN2PLAY (CM)', variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'eightbit', name: '8-Bit', rarity: 'rare', ability: '8-Bit Shotgun in your first chest + score multiplier.', where: 'High / mountainous areas · Lobby code 8BITBLAST (CM)', variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'sonic', name: 'Sonic', rarity: 'epic', ability: 'Gotta go fast! Sprint speed increases with each level.', where: 'Chests · Cheat Code Chests · Lobby code GOTTAGOFAST (CM)', variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'tails', name: 'Tails', rarity: 'epic', ability: 'Hover in the air (cancels fall damage). Enter Cheat Codes instantly at max.', where: 'Chests · Cheat Code Chests · Lobby code IWANNAFLYHIGH (CM)', variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'shadow', name: 'Shadow', rarity: 'epic', ability: 'Automatically reloads weapons over time even when unequipped.', where: 'Chests · Cheat Code Chests', variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'killswitch', name: 'Killswitch', rarity: 'epic', ability: 'Enter Hangtime with improved accuracy while aiming down sights.', where: 'Found around the island at night · Chests', variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'jackrabbit', name: 'Jackrabbit', rarity: 'legendary', ability: 'Perform an extra jump while mid-air.', where: 'Chests · Cheat Code Chests', variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'klombo', name: 'Klombo', rarity: 'mythic', ability: 'Grants random items at each level. Levels only by consuming health/shield items.', where: 'Very rare · Chests · Cheat Code Chests', variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'crown', name: 'Crown', rarity: 'legendary', ability: 'Extra Crown Wins after a Victory Royale. Levels only by winning matches.', where: 'Win a match · Master Crown to unlock variants', variants: { normal: null, gold: null, cheatmaster: null } },
  { id: 'stormscout', name: 'Storm Scout', rarity: 'mythic', ability: 'Storm-related scout ability (details update mid-season).', where: 'Rare · Chests · Cheat Code Chests', variants: { normal: null, gold: null, cheatmaster: null } },
];
export let SPRITES = OVERRIDE_SPRITES;
export function applyRosterData(mode) {
  if (mode === 'classic') {
    SPRITES = CLASSIC_SPRITES; VARIANTS = CLASSIC_VARIANTS; VARIANT_META = CLASSIC_VARIANT_META;
  } else {
    SPRITES = OVERRIDE_SPRITES; VARIANTS = OVERRIDE_VARIANTS; VARIANT_META = OVERRIDE_VARIANT_META;
  }
}
export const DUST = {
  rare: { normal: 100, special: 2700 },
  epic: { normal: 2700, special: 4000 },
  legendary: { normal: 4500, special: 6750 },
  mythic: { normal: 6750, special: 10000 },
};
export function isReleased(v) { return v !== 'na' && v !== 'soon'; }
export function totalReleased() {
  let n = 0;
  for (const s of SPRITES) for (const v of Object.values(s.variants)) if (isReleased(v) || v === null) n++;
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
export const CHEAT_CODE_SPOTS = [
  { poi: 'Green Hill Zone', tip: 'Consoles + Cheat Code Chests near loops / Extraction' },
  { poi: "Reality's Reign", tip: 'Interior consoles · high-tier chests' },
  { poi: 'Stone Sanctum', tip: 'Sanctum floors · maze edge chests' },
  { poi: 'Mega Maze', tip: 'Center lanes · corner terminals' },
  { poi: 'The Battlewoods', tip: 'Park / canal consoles · boulevard chests' },
  { poi: 'Cluster Coast', tip: 'Docks + urban balconies · sauna area' },
  { poi: 'Heatwave Harbor', tip: 'Harbor terminals · shoreline chests' },
  { poi: 'Shaken Sanctuary', tip: 'Sanctuary pads · nearby Code Chests' },
];
