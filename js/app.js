import {
  SPRITES, VARIANTS, VARIANT_META, RARITY_COLORS,
  spriteImageUrl
} from './data.js';

const STORAGE_KEY = 'sprite-locker-v1';
const PADLOCK = '<svg class="padlock-svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#94a3b8" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

let state = loadState();
let filters = { view: 'all', rarity: 'all', variant: 'all', showLevels: true, showDust: false };

function loadState() {
  const base = {};
  for (const sp of SPRITES) base[sp.id] = { ...sp.variants };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      for (const sp of SPRITES) {
        for (const v of VARIANTS) {
          const roster = sp.variants[v];
          if (roster === 'na' || roster === 'soon') base[sp.id][v] = roster;
          else if (saved[sp.id] && saved[sp.id][v] !== undefined) base[sp.id][v] = saved[sp.id][v];
        }
      }
      return base;
    }
  } catch {}
  return base;
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function getStatus(id, v) { return state[id]?.[v] ?? null; }
function setStatus(id, v, status) {
  if (!state[id]) state[id] = {};
  state[id][v] = status;
  saveState();
  render();
}

function cycleStatus(id, v) {
  const cur = getStatus(id, v);
  if (cur === 'na' || cur === 'soon') return;
  const next = (cur == null) ? 'owned' : cur === 'owned' ? 'mastered' : cur === 'mastered' ? 'lost' : null;
  setStatus(id, v, next);
}

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
      if (st === 'owned' || st === 'mastered') { owned++; byRarity[sp.rarity].o++; }
      if (st === 'mastered') mastered++;
      if (st == null || st === 'lost') {
        const weight = (sp.rarity === 'mythic' ? 40 : sp.rarity === 'legendary' ? 30 : sp.rarity === 'epic' ? 20 : 10) + (v !== 'normal' ? 15 : 0);
        missingRare.push({ name: `${VARIANT_META[v].label} ${sp.name}`, weight });
      }
    }
  }
  missingRare.sort((a, b) => b.weight - a.weight);
  return { owned, mastered, total, byRarity, rarest: missingRare.slice(0, 8) };
}

function emojiFor(id) {
  const m = { water:'💧',earth:'🪨',fire:'🔥',fishy:'🐟',air:'💨',duck:'🦆',ghost:'👻',demon:'😈',king:'👑',aura:'✨',striker:'⚽',dream:'🌙',punk:'🎸',boss:'💼',seven:'7️⃣','peeky-peely':'🍌','lootin-llama':'🦙',batman:'🦇','grim-reaper':'💀','zero-point':'🌀','burnt-peanut':'🥜','vini-jr':'⚽',pollo:'🐔','john-wick':'🔫',ironmouse:'🐭' };
  return m[id] || '⭐';
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
  const img = spriteImageUrl(sp.id, variant);

  let body = '';
  if (st === 'na') {
    body = '<span class="lock-icon">⊘</span>';
  } else if (st === 'soon') {
    body = (img ? `<img class="card-img dim" src="${img}" alt="" loading="lazy"/>` : '') + '<span class="lock-icon">✦</span>';
  } else if (st == null || st === 'lost') {
    body = (img ? `<img class="card-img dim" src="${img}" alt="" loading="lazy"/>` : '') + `<span class="lock-icon padlock">${PADLOCK}</span>`;
  } else {
    body = img
      ? `<img class="card-img" src="${img}" alt="${meta.label} ${sp.name}" loading="lazy"/>`
      : `<span class="card-placeholder">${emojiFor(sp.id)}</span>`;
  }

  return `<div class="${cls}" data-sprite="${sp.id}" data-variant="${variant}" title="${meta.label} ${sp.name}">
      ${showLevel ? `<span class="level-badge">${level}</span>` : ''}
      ${st === 'mastered' ? '<span class="crown">👑</span>' : ''}
      ${body}
    </div>`;
}

function matchesFilters(sp, variant, st) {
  if (filters.rarity !== 'all' && sp.rarity !== filters.rarity) return false;
  if (filters.variant !== 'all' && variant !== filters.variant) return false;
  if (filters.view === 'owned') return st === 'owned' || st === 'mastered';
  if (filters.view === 'missing') return st == null || st === 'lost';
  if (filters.view === 'mastered') return st === 'mastered';
  if (filters.view === 'lost') return st === 'lost';
  if (filters.view === 'soon') return st === 'soon';
  return true;
}

function render() {
  const stats = computeStats();
  const pct = stats.total ? Math.round((stats.owned / stats.total) * 100) : 0;
  const mPct = stats.owned ? Math.round((stats.mastered / stats.owned) * 100) : 0;

  document.getElementById('brand-pct').textContent = pct + '%';
  document.getElementById('header-count').textContent = `${stats.owned} / ${stats.total}`;
  document.getElementById('coll-count').textContent = `${stats.owned} / ${stats.total}`;
  document.getElementById('coll-bar').style.width = pct + '%';
  document.getElementById('mast-count').textContent = `${stats.mastered} / ${stats.total}`;
  document.getElementById('mast-bar').style.width = (stats.total ? (stats.mastered / stats.total * 100) : 0) + '%';
  document.getElementById('mast-sub').textContent = mPct + '% of owned';

  for (const r of ['rare', 'epic', 'legendary', 'mythic']) {
    const { o, t } = stats.byRarity[r];
    document.getElementById(`r-${r}-count`).textContent = `${o}/${t}`;
    document.getElementById(`r-${r}-bar`).style.width = (t ? (o / t * 100) : 0) + '%';
  }

  const rarestEl = document.getElementById('rarest');
  rarestEl.innerHTML = stats.rarest.length
    ? stats.rarest.map(x => `<span class="rarest-chip"><span class="dot"></span>${x.name}</span>`).join('')
    : '<span class="rarest-chip">All collected 🎉</span>';

  const abilitiesEl = document.getElementById('abilities-list');
  if (abilitiesEl) {
    abilitiesEl.innerHTML = SPRITES.map(sp => `
      <div class="ability-card">
        <div class="ability-head">
          <span class="rarity-dot" style="background:${RARITY_COLORS[sp.rarity]}"></span>
          <strong>${sp.name}</strong>
          <span class="rarity-tag">${sp.rarity}</span>
        </div>
        <p class="ability-text">${sp.ability || ''}</p>
        <p class="ability-where">${sp.where || ''}</p>
      </div>`).join('');
  }

  const variantsEl = document.getElementById('variants-list');
  if (variantsEl) {
    variantsEl.innerHTML = VARIANTS.map(v => {
      const m = VARIANT_META[v];
      return `<div class="variant-card" style="border-color:${m.color}">
        <div class="variant-label" style="background:${m.color}">${m.label}</div>
        <p>${m.desc}</p>
      </div>`;
    }).join('');
  }

  document.getElementById('grid-header').innerHTML = `
    <div class="col-head sprite-col">SPRITE</div>
    ${VARIANTS.map(v => `<div class="col-head" style="background:${VARIANT_META[v].color}">${VARIANT_META[v].label}</div>`).join('')}`;

  const body = document.getElementById('grid-body');
  body.innerHTML = SPRITES.map(sp => {
    const any = VARIANTS.some(v => matchesFilters(sp, v, getStatus(sp.id, v)));
    if (!any) return '';
    return `<div class="sprite-row">
      <div class="sprite-name">
        <span class="dot" style="background:${RARITY_COLORS[sp.rarity]}"></span>
        ${sp.name}
        <span class="info" title="${sp.ability || sp.rarity}">ⓘ</span>
      </div>
      ${VARIANTS.map(v => {
        if (!matchesFilters(sp, v, getStatus(sp.id, v)))
          return '<div class="card" style="visibility:hidden;pointer-events:none"></div>';
        return cardHTML(sp, v);
      }).join('')}
    </div>`;
  }).join('');

  body.querySelectorAll('.card[data-sprite]').forEach(el => {
    el.addEventListener('click', () => cycleStatus(el.dataset.sprite, el.dataset.variant));
  });
}

function setupUI() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filters.view = tab.dataset.view;
      render();
    });
  });
  document.getElementById('rarity-select').addEventListener('change', e => { filters.rarity = e.target.value; render(); });
  document.getElementById('variant-select').addEventListener('change', e => { filters.variant = e.target.value; render(); });
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

setupUI();
render();
