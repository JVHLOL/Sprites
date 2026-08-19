// Fortnite Sprite roster — ~25 base / 117 variants (community data, Aug 2026)
// status per variant: null = missing, 'owned' | 'mastered' | 'lost' | 'soon' | 'na'

export const VARIANTS = ['normal', 'gold', 'gummy', 'galaxy', 'gem', 'holofoil', 'cube', 'quack'];

export const VARIANT_META = {
  normal:   { label: 'Normal',   color: '#a0aec0' },
  gold:     { label: 'Gold',     color: '#f6c343' },
  gummy:    { label: 'Gummy',    color: '#f472b6' },
  galaxy:   { label: 'Galaxy',   color: '#a78bfa' },
  gem:      { label: 'Gem',      color: '#e2e8f0' },
  holofoil: { label: 'Holofoil', color: '#34d399' },
  cube:     { label: 'Cube',     color: '#4ade80' },
  quack:    { label: 'Quack',    color: '#fb923c' },
};

export const RARITY_COLORS = {
  rare:      '#38bdf8',
  epic:      '#c084fc',
  legendary: '#fbbf24',
  mythic:    '#f87171',
};

/** @type {Array<{id:string,name:string,rarity:string,variants:Record<string,string|null>}>} */
export const SPRITES = [
  {
    id: 'water', name: 'Water', rarity: 'rare',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: null, cube: 'na', quack: null }
  },
  {
    id: 'earth', name: 'Earth', rarity: 'rare',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: 'na', cube: null, quack: null }
  },
  {
    id: 'fire', name: 'Fire', rarity: 'rare',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: null, quack: null }
  },
  {
    id: 'fishy', name: 'Fishy', rarity: 'rare',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: 'na', cube: null, quack: 'na' }
  },
  {
    id: 'air', name: 'Air', rarity: 'rare',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' }
  },
  {
    id: 'duck', name: 'Duck', rarity: 'epic',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: 'na', cube: 'na', quack: 'na' }
  },
  {
    id: 'ghost', name: 'Ghost', rarity: 'epic',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' }
  },
  {
    id: 'demon', name: 'Demon', rarity: 'epic',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: 'na', cube: 'na', quack: 'na' }
  },
  {
    id: 'king', name: 'King', rarity: 'epic',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' }
  },
  {
    id: 'aura', name: 'Aura', rarity: 'epic',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: 'na', cube: 'na', quack: 'na' }
  },
  {
    id: 'striker', name: 'Striker', rarity: 'epic',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' }
  },
  {
    id: 'dream', name: 'Dream', rarity: 'legendary',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: 'na', cube: null, quack: 'na' }
  },
  {
    id: 'punk', name: 'Punk', rarity: 'legendary',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'soon', holofoil: 'na', cube: null, quack: 'na' }
  },
  {
    id: 'boss', name: 'Boss', rarity: 'legendary',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: 'na', cube: null, quack: 'na' }
  },
  {
    id: 'seven', name: 'Seven', rarity: 'legendary',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' }
  },
  {
    id: 'peeky-peely', name: 'Peeky Peely', rarity: 'legendary',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: 'na', quack: 'na' }
  },
  {
    id: 'lootin-llama', name: "Lootin' Llama", rarity: 'legendary',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: 'na', cube: 'na', quack: 'na' }
  },
  {
    id: 'batman', name: 'Batman', rarity: 'mythic',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: 'na', holofoil: null, cube: null, quack: 'na' }
  },
  {
    id: 'grim-reaper', name: 'Grim Reaper', rarity: 'mythic',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: null, cube: null, quack: 'na' }
  },
  {
    id: 'zero-point', name: 'Zero Point', rarity: 'mythic',
    variants: { normal: null, gold: null, gummy: null, galaxy: null, gem: null, holofoil: null, cube: null, quack: null }
  },
  {
    id: 'burnt-peanut', name: 'Burnt Peanut', rarity: 'mythic',
    variants: { normal: null, gold: 'na', gummy: 'na', galaxy: 'na', gem: 'na', holofoil: 'na', cube: 'na', quack: 'na' }
  },
  {
    id: 'vini-jr', name: 'Vini Jr.', rarity: 'mythic',
    variants: { normal: null, gold: 'na', gummy: 'na', galaxy: 'na', gem: 'na', holofoil: 'na', cube: 'na', quack: 'na' }
  },
  {
    id: 'pollo', name: 'Pollo', rarity: 'mythic',
    variants: { normal: null, gold: 'na', gummy: 'na', galaxy: 'na', gem: 'na', holofoil: 'na', cube: 'na', quack: 'na' }
  },
  {
    id: 'john-wick', name: 'John Wick', rarity: 'mythic',
    variants: { normal: null, gold: 'na', gummy: 'na', galaxy: 'na', gem: 'na', holofoil: 'na', cube: 'na', quack: 'na' }
  },
  {
    id: 'ironmouse', name: 'Ironmouse', rarity: 'mythic',
    variants: { normal: null, gold: 'na', gummy: 'na', galaxy: 'na', gem: 'na', holofoil: 'na', cube: 'na', quack: 'na' }
  },
];

// Approximate dust costs (community)
export const DUST = {
  rare:      { normal: 100, special: 2700 },
  epic:      { normal: 2700, special: 4000 },
  legendary: { normal: 4500, special: 6750 },
  mythic:    { normal: 6750, special: 10000 },
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
