import {
  SPRITES, VARIANTS, VARIANT_META, RARITY_COLORS,
  isReleased, totalReleased, DUST
} from './data.js';

const STORAGE_KEY = 'sprite-locker-v1';

// ---------- state ----------
let state = loadState();
let filters = {
  view: 'all',       // all | owned | missing | mastered | lost | soon
  rarity: 'all',
  variant: 'all',
  showLevels: true,
  showDust: false,
};

function loadState() {
  const base = {};
  for (const sp of SPRITES) {
    base[sp.id] = { ...sp.variants };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // merge: keep na/soon from roster, restore user progress for released slots
      for (const sp of SPRITES) {
        for (const v of VARIANTS) {
          const roster = sp.variants[v];
          if (roster === 'na' || roster === 'soon') {
            base[sp.id][v] = roster;
          } else if (saved[sp.id] && saved[sp.id][v] !== undefined) {
            base[sp.id][v] = saved[sp.id][v];
          }
        }
      }
      return base;
    }
  } catch {}
  return base;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getStatus(spriteId, variant) {
  return state[spriteId]?.[variant] ?? null;
}

function setStatus(spriteId, variant, status) {
  if (!state[spriteId]) state[spriteId] = {};
  state[spriteId][variant] = status;
  saveState();
  render();
}

// cycle: null (missing) → owned → mastered → lost → null
function cycleStatus(spriteId, variant) {
  const cur = getStatus(spriteId, variant);
  if (cur === 'na' || cur === 'soon') return;
  const next =
    cur === null || cur === undefined ? 'owned' :
    cur === 'owned'   ? 'mastered' :
    cur === 'mastered'? 'lost' :
    null;
  setStatus(spriteId, variant, next);
}

// ---------- stats ----------
function computeStats() {
  let owned = 0, mastered = 0, total = 0;
  const byRarity = { rare: { o: 0, t: 0 }, epic: { o: 0, t: 0 }, legendary: { o: 0, t: 0 }, mythic: { o: 0, t: 0 } };
  const missingRare = [];

  for (const sp of SPRITES) {
    for (const v of VARIANTS) {
      const st = getStatus(sp.id, v);
      if (st === 'na' || st === 'soon') continue;
      total++;
      byRarity[sp.rarity].t++;
      if (st === 'owned' || st === 'mastered') {
        owned++;
        byRarity[sp.rarity].o++;
      }
      if (st === 'mastered') mastered++;
      if (st === null || st === undefined || st === 'lost') {
        const weight = (sp.rarity === 'mythic' ? 40 : sp.rarity === 'legendary' ? 30 : sp.rarity === 'epic' ? 20 : 10)
          + (v !== 'normal' ? 15 : 0);
        missingRare.push({ name: `${VARIANT_META[v].label} ${sp.name}`, weight, id: sp.id, v });
      }
    }
  }
  missingRare.sort((a, b) => b.weight - a.weight);
  return { owned, mastered, total, byRarity, rarest: missingRare.slice(0, 8) };
}

// ---------- render helpers ----------
function emojiFor(spriteId) {
  const map = {
    water: '💧', earth: '🪨', fire: '🔥', fishy: '🐟', air: '💨',
    duck: '🦆', ghost: '👻', demon: '😈', king: '👑', aura: '✨',
    striker: '⚽', dream: '🌙', punk: '🎸', boss: '💼', seven: '㟾️',
    'peeky-peely': '🍌', 'lootin-llama': '🦙', batman: '🦇',
    'grim-reaper': '💀', 'zero-point': '🌀', 'burnt-peanut': '🥜',
    'vini-jr': '⚽', pollo: '🐔', 'john-wick': '🔫', ironmouse: '🐭',
  };
  return map[spriteId] || '⭐';
}

function cardHTML(sp, variant) {
  const st = getStatus(sp.id, variant);
  const meta = VARIANT_META[variant];
  let cls = 'card';
  if (st === 'owned') cls += ' owned';
  else if (st === 'mastered') cls += ' mastered';
  else if (st === 'lost') cls += ' lost';
  else if (st === 'soon') cls += ' soon';
  else if (st === 'na') cls += ' na';
  else cls += ' missing';

  const showLevel = filters.showLevels && (st === 'owned' || st === 'mastered');
  const level = st === 'mastered' ? 5 : (st === 'owned' ? 3 : null);

  let body = '';
  if (st === 'na') body = `<span class="lock-icon">⊘</span>`;
  else if (st === 'soon') body = `<span class="lock-icon">✦</span>`;
  else if (st === null || st === undefined) body = `<span class="lock-icon">🔒</span>`;
  else body = `<span class="card-placeholder">${emojiFor(sp.id)}</span>`;

  return `
    <div class="${cls}" data-sprite="${sp.id}" data-variant="${variant}" title="${meta.label} ${sp.name}">
      ${showLevel ? `<span class="level-badge">${level}</span>` : ''}
      ${st === 'mastered' ? `<span class="crown">👑</span>` : ''}
      ${body}
    </div>`;
}

function matchesFilters(sp, variant, st) {
  if (filters.rarity !== 'all' && sp.rarity !== filters.rarity) return false;
  if (filters.variant !== 'all' && variant !== filters.variant) return false;

  if (filters.view === 'owned') return st === 'owned' || st === 'mastered';
  if (filters.view === 'missing') return st === null || st === undefined || st === 'lost';
  if (filters.view === 'mastered') return st === 'mastered';
  if (filters.view === 'lost') return st === 'lost';
  if (filters.view === 'soon') return st === 'soon';
  return true; // all
}

// ---------- main render ----------
function render() {
  const stats = computeStats();
  const pct = stats.total ? Math.round((stats.owned / stats.total) * 100) : 0;
  const mPct = stats.owned ? Math.round((stats.mastered / stats.owned) * 100) : 0;

  // header
  document.getElementById('brand-pct').textContent = pct + '%';
  document.getElementById('header-count').textContent = `${stats.owned} / ${stats.total}`;

  // sidebar progress
  document.getElementById('coll-count').textContent = `${stats.owned} / ${stats.total}`;
  document.getElementById('coll-bar').style.width = pct + '%';
  document.getElementById('mast-count').textContent = `${stats.mastered} / ${stats.total}`;
  document.getElementById('mast-bar').style.width = (stats.total ? (stats.mastered / stats.total * 100) : 0) + '%';
  document.getElementById('mast-sub').textContent = mPct + '% of owned';

  // rarity bars
  for (const r of ['rare', 'epic', 'legendary', 'mythic']) {
    const { o, t } = stats.byRarity[r];
    document.getElementById(`r-${r}-count`).textContent = `${o}/${t}`;
    document.getElementById(`r-${r}-bar`).style.width = (t ? (o / t * 100) : 0) + '%';
  }

  // rarest
  const rarestEl = document.getElementById('rarest');
  rarestEl.innerHTML = stats.rarest.length
    ? stats.rarest.map(x => `
        <span class="rarest-chip"><span class="dot"></span>${x.name}</span>
      `).join('')
    : `<span class="rarest-chip">All collected 🎉</span>`;

  // grid header
  const head = document.getElementById('grid-header');
  head.innerHTML = `
    <div class="col-head sprite-col">SPRITE</div>
    ${VARIANTS.map(v => `
      <div class="col-head" style="background:${VARIANT_META[v].color}">${VARIANT_META[v].label}</div>
    `).join('')}
  `;

  // rows
  const body = document.getElementById('grid-body');
  body.innerHTML = SPRITES.map(sp => {
    // hide row if no cells match filter
    const any = VARIANTS.some(v => matchesFilters(sp, v, getStatus(sp.id, v)));
    if (!any) return '';

    return `
      <div class="sprite-row">
        <div class="sprite-name">
          <span class="dot" style="background:${RARITY_COLORS[sp.rarity]}"></span>
          ${sp.name}
          <span class="info" title="${sp.rarity}">ⓘ</span>
        </div>
        ${VARIANTS.map(v => {
          if (!matchesFilters(sp, v, getStatus(sp.id, v))) {
            return `<div class="card" style="visibility:hidden;pointer-events:none"></div>`;
          }
          return cardHTML(sp, v);
        }).join('')}
      </div>`;
  }).join('');

  // bind clicks
  body.querySelectorAll('.card[data-sprite]').forEach(el => {
    el.addEventListener('click', () => {
      cycleStatus(el.dataset.sprite, el.dataset.variant);
    });
  });
}

// ---------- UI events ----------
function setupUI() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filters.view = tab.dataset.view;
      render();
    });
  });

  document.getElementById('rarity-select').addEventListener('change', e => {
    filters.rarity = e.target.value;
    render();
  });
  document.getElementById('variant-select').addEventListener('change', e => {
    filters.variant = e.target.value;
    render();
  });

  document.getElementById('toggle-levels').addEventListener('click', function () {
    filters.showLevels = !filters.showLevels;
    this.classList.toggle('on', filters.showLevels);
    render();
  });

  document.getElementById('toggle-dust').addEventListener('click', function () {
    filters.showDust = !filters.showDust;
    this.classList.toggle('on', filters.showDust);
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    if (!confirm('Reset all progress?')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = loadState();
    render();
  });

  document.getElementById('btn-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sprite-locker-backup.json';
    a.click();
  });
}

// boot
setupUI();
render();
