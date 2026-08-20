import {
  CLASSIC_SPRITES, OVERRIDE_SPRITES, LOBBY_CODES,
  CLASSIC_VARIANTS, OVERRIDE_VARIANTS,
  CLASSIC_VARIANT_META, OVERRIDE_VARIANT_META,
  RARITY_COLORS, DUST, spriteImageUrl, applyRosterData
} from './data.js';

let rosterMode = localStorage.getItem('sprite-roster') || 'override';
let SPRITES = rosterMode === 'classic' ? CLASSIC_SPRITES : OVERRIDE_SPRITES;
let VARIANTS = rosterMode === 'classic' ? CLASSIC_VARIANTS : OVERRIDE_VARIANTS;
let VARIANT_META = rosterMode === 'classic' ? CLASSIC_VARIANT_META : OVERRIDE_VARIANT_META;
applyRosterData(rosterMode);

function storageKey() { return rosterMode === 'classic' ? 'sprite-locker-classic-v1' : 'sprite-locker-c7s4-v1'; }
const PADLOCK = '<svg class="padlock-svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#94a3b8" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

let state = loadState();
let levels = loadLevels();
let filters = { view: 'all', rarity: 'all', variant: 'all', showLevels: true, showDust: false };
let modalTarget = null;
let _docCloser = null;

function loadState() {
  const base = {};
  for (const sp of SPRITES) base[sp.id] = { ...sp.variants };
  try {
    const raw = localStorage.getItem(storageKey());
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

function loadLevels() {
  try {
    const raw = localStorage.getItem(storageKey() + '-levels');
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveState() {
  localStorage.setItem(storageKey(), JSON.stringify(state));
  localStorage.setItem(storageKey() + '-levels', JSON.stringify(levels));
}

function getStatus(id, v) { return state[id]?.[v] ?? null; }
function getLevel(id, v) {
  const key = id + ':' + v;
  if (levels[key] != null) return levels[key];
  const st = getStatus(id, v);
  if (st === 'mastered') return 5;
  if (st === 'owned') return 1;
  return 1;
}

function setStatus(id, v, status) {
  if (!state[id]) state[id] = {};
  state[id][v] = status;
  if (status === 'mastered') levels[id + ':' + v] = 5;
  else if (status === 'owned' && getLevel(id, v) < 1) levels[id + ':' + v] = 1;
  else if (status == null || status === 'lost') delete levels[id + ':' + v];
  saveState();
  render();
  if (modalTarget && modalTarget.id === id && modalTarget.variant === v) openModal(id, v);
}

function setLevel(id, v, n) {
  n = Math.max(1, Math.min(5, n));
  levels[id + ':' + v] = n;
  const st = getStatus(id, v);
  if (n === 5 && st === 'owned') setStatus(id, v, 'mastered');
  else if (n < 5 && st === 'mastered') setStatus(id, v, 'owned');
  else { saveState(); render(); if (modalTarget) openModal(id, v); }
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
        missingRare.push({ name: `${VARIANT_META[v].label} ${sp.name}`, weight, id: sp.id, variant: v, rarity: sp.rarity });
      }
    }
  }
  missingRare.sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name));
  return { owned, mastered, total, byRarity, rarest: missingRare.slice(0, 10) };
}

function emojiFor(id) {
  const m = {
    water:'💧',earth:'🪨',fire:'🔥',fishy:'🐟',air:'💨',duck:'🦆',ghost:'👻',demon:'😈',king:'👑',
    aura:'✨',striker:'⚽',dream:'🌙',punk:'🎸',boss:'💼',seven:'7️⃣','peeky-peely':'🍌','lootin-llama':'🦙',
    batman:'🦇','grim-reaper':'💀','zero-point':'🌀','burnt-peanut':'🥜','vini-jr':'⚽',pollo:'🐔',
    'john-wick':'🔫',ironmouse:'🐭',
    jonesy:'🕵️',bush:'🌿',adventure:'🗺️',eightbit:'🎮',sonic:'💨',tails:'🦊',shadow:'🌑',
    killswitch:'⏱️',jackrabbit:'🐇',klombo:'🦕',crown:'👑',stormscout:'⛈️'
  };
  return m[id] || '⭐';
}

function cardHTML(sp, variant) {
  const st = getStatus(sp.id, variant);
  const meta = VARIANT_META[variant];
  if (!meta) return '';
  let cls = 'card';
  if (st === 'owned') cls += ' owned';
  else if (st === 'mastered') cls += ' mastered';
  else if (st === 'lost') cls += ' lost';
  else if (st === 'soon') cls += ' soon';
  else if (st === 'na') cls += ' na';
  else cls += ' missing';
  const showLevel = filters.showLevels && (st === 'owned' || st === 'mastered');
  const level = getLevel(sp.id, variant);
  const img = spriteImageUrl(sp.id, variant);
  let body = '';
  if (st === 'na') body = '<span class="lock-icon">⊘</span>';
  else if (st === 'soon') body = (img ? `<img class="card-img dim" src="${img}" alt="" loading="lazy"/>` : '') + '<span class="lock-icon soon-label">SOON</span>';
  else if (st == null || st === 'lost') body = (img ? `<img class="card-img dim" src="${img}" alt="" loading="lazy" onerror="this.style.display='none'"/>` : `<span class="card-placeholder dim">${emojiFor(sp.id)}</span>`) + `<span class="lock-icon padlock">${PADLOCK}</span>`;
  else body = img ? `<img class="card-img" src="${img}" alt="${meta.label} ${sp.name}" loading="lazy" onerror="this.outerHTML='<span class=card-placeholder>${emojiFor(sp.id)}</span>'"/>` : `<span class="card-placeholder">${emojiFor(sp.id)}</span>`;
  return `<div class="${cls}" data-sprite="${sp.id}" data-variant="${variant}" title="${meta.label} ${sp.name}">${showLevel ? `<span class="level-badge">${level}</span>` : ''}${st === 'mastered' ? '<span class="crown">👑</span>' : ''}${body}</div>`;
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

function openModal(id, variant) {
  const sp = SPRITES.find(s => s.id === id);
  if (!sp || sp.variants[variant] === 'na') return;
  closeModal();
  modalTarget = { id, variant };
  const st = getStatus(id, variant);
  const meta = VARIANT_META[variant];
  const img = spriteImageUrl(id, variant);
  const level = getLevel(id, variant);
  const pop = document.createElement('div');
  pop.id = 'sprite-popover';
  pop.className = 'sprite-popover';
  const imgHtml = img ? `<img class="pop-img" src="${img}" alt="" onerror="this.outerHTML='<span class=pop-emoji>${emojiFor(id)}</span>'"/>` : `<span class="pop-emoji">${emojiFor(id)}</span>`;
  const availVariants = VARIANTS.filter(v => sp.variants[v] !== 'na');
  const dustRow = DUST[sp.rarity] || { normal: 0, special: 0 };
  const dustChips = availVariants.map(v => {
    const cost = v === 'normal' ? dustRow.normal : dustRow.special;
    return `<span class="pop-dust-chip" style="background:${VARIANT_META[v].color}">${VARIANT_META[v].label} ${cost.toLocaleString()}</span>`;
  }).join('');
  pop.innerHTML = `<button class="pop-close" type="button">×</button>
    <div class="pop-head">${imgHtml}<div><h3>${sp.name}</h3><div class="pop-badges"><span class="pop-badge rarity-${sp.rarity}">${sp.rarity}</span><span class="pop-badge variant">${meta.label}</span></div></div></div>
    <div class="pop-label">Ability</div><p class="pop-effect">${sp.ability || ''}</p>
    <div class="pop-label">Where to find</div><p class="pop-bonus">${sp.where || '—'}</p>
    <div class="pop-label">Variants</div><p class="pop-variants-list">${availVariants.map(v => VARIANT_META[v].label).join(', ')}</p>
    <div class="pop-label">Resummon cost</div><div class="pop-dust">${dustChips}</div>
    <div class="pop-actions">
      <button type="button" data-act="owned" class="${st === 'owned' ? 'on-owned' : ''}"><span>✓</span> Owned</button>
      <button type="button" data-act="mastered" class="${st === 'mastered' ? 'on-mastered' : ''}"><span>👑</span> Mastered</button>
      <button type="button" data-act="lost" class="${st === 'lost' ? 'on-lost' : ''}"><span>⊘</span> Lost</button>
    </div>
    <div class="pop-level"><span class="pop-level-label">Level</span><div class="pop-level-ctrls"><button type="button" data-lvl="-">−</button><span class="pop-level-val">${level} / 5</span><button type="button" data-lvl="+">+</button></div></div>`;
  document.body.appendChild(pop);
  const pw = pop.offsetWidth || 360, ph = pop.offsetHeight || 400;
  pop.style.cssText = `position:fixed;left:${Math.max(12, Math.round((innerWidth - pw) / 2))}px;top:${Math.max(12, Math.round((innerHeight - ph) / 2))}px;z-index:9999`;
  pop.querySelector('.pop-close').onclick = (e) => { e.stopPropagation(); closeModal(); };
  pop.querySelectorAll('[data-act]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const act = btn.dataset.act, cur = getStatus(id, variant);
      if (act === 'owned') setStatus(id, variant, cur === 'owned' ? null : 'owned');
      else if (act === 'mastered') setStatus(id, variant, cur === 'mastered' ? 'owned' : 'mastered');
      else if (act === 'lost') setStatus(id, variant, cur === 'lost' ? null : 'lost');
    };
  });
  pop.querySelectorAll('[data-lvl]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const d = btn.dataset.lvl === '+' ? 1 : -1;
      if (getStatus(id, variant) == null || getStatus(id, variant) === 'lost') setStatus(id, variant, 'owned');
      setLevel(id, variant, getLevel(id, variant) + d);
    };
  });
  _docCloser = (e) => {
    if (pop.contains(e.target)) return;
    if (e.target.closest && (e.target.closest('.card[data-sprite]') || e.target.closest('.rarest-chip'))) return;
    closeModal();
  };
  setTimeout(() => document.addEventListener('mousedown', _docCloser, true), 50);
}

function closeModal() {
  if (_docCloser) { document.removeEventListener('mousedown', _docCloser, true); _docCloser = null; }
  const pop = document.getElementById('sprite-popover');
  if (pop) pop.remove();
  modalTarget = null;
}

function render() {
  const stats = computeStats();
  const pct = stats.total ? Math.round((stats.owned / stats.total) * 100) : 0;
  const mPct = stats.owned ? Math.round((stats.mastered / stats.owned) * 100) : 0;
  const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
  const setWidth = (id, w) => { const el = document.getElementById(id); if (el) el.style.width = w; };
  setText('brand-pct', pct + '%');
  setText('header-count', `${stats.owned} / ${stats.total}`);
  setText('coll-count', `${stats.owned} / ${stats.total}`);
  setWidth('coll-bar', pct + '%');
  setText('mast-count', `${stats.mastered} / ${stats.total}`);
  setWidth('mast-bar', (stats.total ? (stats.mastered / stats.total * 100) : 0) + '%');
  setText('mast-sub', mPct + '% of owned');
  for (const r of ['rare', 'epic', 'legendary', 'mythic']) {
    const { o, t } = stats.byRarity[r];
    setText(`r-${r}-count`, `${o}/${t}`);
    setWidth(`r-${r}-bar`, (t ? (o / t * 100) : 0) + '%');
  }
  const rarestEl = document.getElementById('rarest') || document.getElementById('rarest-missing');
  if (rarestEl) {
    rarestEl.innerHTML = stats.rarest.length
      ? stats.rarest.map(x => `<button type="button" class="rarest-chip" data-sprite="${x.id}" data-variant="${x.variant}"><span class="dot" style="background:${RARITY_COLORS[x.rarity] || '#34d399'}"></span>${x.name}</button>`).join('')
      : '<span class="rarest-chip">All collected 🎉</span>';
    rarestEl.querySelectorAll('.rarest-chip[data-sprite]').forEach(chip => {
      chip.addEventListener('click', (e) => { e.stopPropagation(); openModal(chip.dataset.sprite, chip.dataset.variant); });
    });
  }
  const variantsEl = document.getElementById('variants-list');
  if (variantsEl) {
    variantsEl.innerHTML = VARIANTS.map(v => {
      const m = VARIANT_META[v];
      return `<div class="variant-card" style="border-color:${m.color}"><div class="variant-label" style="background:${m.color}">${m.label}</div><p>${m.desc}</p></div>`;
    }).join('');
  }
  const gridCols = `150px repeat(${VARIANTS.length}, minmax(120px, 1fr))`;
  const gh = document.getElementById('grid-header');
  if (gh) {
    gh.style.gridTemplateColumns = gridCols;
    gh.innerHTML = `<div class="col-head sprite-col">SPRITE</div>${VARIANTS.map(v => `<div class="col-head" style="background:${VARIANT_META[v].color}">${VARIANT_META[v].label}</div>`).join('')}`;
  }
  const body = document.getElementById('grid-body');
  if (!body) return;
  body.innerHTML = SPRITES.map(sp => {
    if (!VARIANTS.some(v => matchesFilters(sp, v, getStatus(sp.id, v)))) return '';
    return `<div class="sprite-row"><div class="sprite-name"><span class="dot" style="background:${RARITY_COLORS[sp.rarity]}"></span>${sp.name}<span class="info" title="${sp.ability || sp.rarity}">ⓘ</span></div>${VARIANTS.map(v => {
      if (!matchesFilters(sp, v, getStatus(sp.id, v))) return '<div class="card" style="visibility:hidden;pointer-events:none"></div>';
      return cardHTML(sp, v);
    }).join('')}</div>`;
  }).join('');
  body.querySelectorAll('.sprite-row').forEach(row => { row.style.gridTemplateColumns = gridCols; });
  body.querySelectorAll('.card[data-sprite]').forEach(el => {
    el.addEventListener('click', (e) => { e.stopPropagation(); openModal(el.dataset.sprite, el.dataset.variant); });
  });
}

function applyRoster(mode) {
  rosterMode = mode;
  localStorage.setItem('sprite-roster', mode);
  applyRosterData(mode);
  SPRITES = mode === 'classic' ? CLASSIC_SPRITES : OVERRIDE_SPRITES;
  VARIANTS = mode === 'classic' ? CLASSIC_VARIANTS : OVERRIDE_VARIANTS;
  VARIANT_META = mode === 'classic' ? CLASSIC_VARIANT_META : OVERRIDE_VARIANT_META;
  state = loadState();
  levels = loadLevels();
  document.querySelectorAll('.roster-btn').forEach(b => {
    b.classList.toggle('on', b.dataset.roster === mode);
  });
  filters.view = 'all'; filters.rarity = 'all'; filters.variant = 'all';
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.toggle('active', t.dataset.view === 'all'));
  const rs = document.getElementById('rarity-select'); if (rs) rs.value = 'all';
  const vs = document.getElementById('variant-select');
  if (vs) {
    vs.innerHTML = '<option value="all">All Variants</option>' +
      VARIANTS.map(v => `<option value="${v}">${VARIANT_META[v].label}</option>`).join('');
    vs.value = 'all';
  }
  closeModal();
  render();
}

function openCodesPanel() {
  const modal = document.getElementById('codes-modal');
  const list = document.getElementById('codes-list');
  if (!modal || !list) return;
  list.innerHTML = LOBBY_CODES.map(c => `
    <div class="code-row">
      <button type="button" class="code-copy" data-code="${c.code}" title="Copy ${c.code}">
        <span class="code-text">${c.code}</span>
        <span class="code-reward">${c.reward}</span>
        <span class="code-copy-hint">copy</span>
      </button>
    </div>`).join('');
  list.querySelectorAll('.code-copy').forEach(btn => {
    btn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.code);
        btn.classList.add('copied');
        const hint = btn.querySelector('.code-copy-hint');
        if (hint) hint.textContent = 'copied!';
        setTimeout(() => { btn.classList.remove('copied'); if (hint) hint.textContent = 'copy'; }, 1200);
      } catch {}
    };
  });
  modal.hidden = false;
}
function closeCodesPanel() { const m = document.getElementById('codes-modal'); if (m) m.hidden = true; }
function openUpdatePanel() { const m = document.getElementById('update-modal'); if (m) m.hidden = false; localStorage.setItem('sprite-seen-update-v2', '1'); }
function closeUpdatePanel() { const m = document.getElementById('update-modal'); if (m) m.hidden = true; }

function statusSymbol(st) {
  if (st === 'owned' || st === 'mastered') return '✅';
  if (st === 'lost') return '👻';
  if (st === 'soon') return '🔜';
  if (st === 'na') return '🚫';
  return '❌';
}

function buildDiscordText() {
  const stats = computeStats();
  const nameW = Math.max(...SPRITES.map(s => s.name.length), 12);
  const pad = (s, w) => s + ' '.repeat(Math.max(0, w - s.length));
  const vLabels = VARIANTS.map(v => VARIANT_META[v].label.toUpperCase().padEnd(10).slice(0, 10));
  const lines = ['```', '✅ Have  👻 Lost  ❌ Need  🔜 Soon  🚫 N/A', '', pad('SPRITE', nameW) + '  ' + vLabels.join(' ')];
  for (const sp of SPRITES) {
    const cells = VARIANTS.map(v => (statusSymbol(getStatus(sp.id, v)) + '         ').slice(0, 10));
    lines.push(pad(sp.name, nameW) + '  ' + cells.join(' '));
  }
  lines.push('', stats.owned + '/' + stats.total + ' collected · ' + rosterMode.toUpperCase(), 'https://jvhlol.github.io/Sprites/', '```');
  return lines.join('\n');
}
async function copyDiscordText() { await navigator.clipboard.writeText(buildDiscordText()); }

async function downloadShareImage() {
  const stats = computeStats();
  const pct = stats.total ? Math.round((stats.owned / stats.total) * 100) : 0;
  const canvas = document.createElement('canvas');
  canvas.width = 900; canvas.height = 180 + SPRITES.length * 36;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1a0a10'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fca5a5'; ctx.font = 'bold 28px Inter,sans-serif';
  ctx.fillText('SPRITE LOCKER', 24, 40);
  ctx.fillStyle = '#c4a0a8'; ctx.font = '16px Inter,sans-serif';
  ctx.fillText(`${stats.owned} / ${stats.total} · ${pct}% · ${rosterMode.toUpperCase()}`, 24, 68);
  let y = 100;
  for (const sp of SPRITES) {
    ctx.fillStyle = RARITY_COLORS[sp.rarity] || '#fff';
    ctx.beginPath(); ctx.arc(32, y + 10, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f1e8ea'; ctx.font = '14px Inter,sans-serif';
    ctx.fillText(sp.name, 48, y + 14);
    let x = 220;
    for (const v of VARIANTS) {
      const st = getStatus(sp.id, v);
      ctx.fillStyle = st === 'mastered' ? '#f6c343' : st === 'owned' ? '#38bdf8' : st === 'lost' ? '#64748b' : st === 'na' ? '#334155' : '#3f1a22';
      ctx.fillRect(x, y, 22, 22);
      x += 28;
    }
    y += 36;
  }
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `sprite-locker-${rosterMode}-${Date.now()}.png`;
  a.click();
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
  document.getElementById('rarity-select')?.addEventListener('change', e => { filters.rarity = e.target.value; render(); });
  document.getElementById('variant-select')?.addEventListener('change', e => { filters.variant = e.target.value; render(); });
  document.getElementById('toggle-levels')?.addEventListener('click', function () {
    filters.showLevels = !filters.showLevels; this.classList.toggle('on', filters.showLevels); render();
  });
  document.getElementById('toggle-dust')?.addEventListener('click', function () {
    filters.showDust = !filters.showDust; this.classList.toggle('on', filters.showDust);
  });
  const moreBtn = document.getElementById('btn-more');
  const moreMenu = document.getElementById('more-menu');
  function closeMore() { if (!moreMenu || !moreBtn) return; moreMenu.hidden = true; moreBtn.classList.remove('open'); moreBtn.setAttribute('aria-expanded', 'false'); }
  function openMore() { if (!moreMenu || !moreBtn) return; moreMenu.hidden = false; moreBtn.classList.add('open'); moreBtn.setAttribute('aria-expanded', 'true'); }
  moreBtn?.addEventListener('click', (e) => { e.stopPropagation(); if (moreMenu.hidden) openMore(); else closeMore(); });
  document.addEventListener('mousedown', (e) => {
    if (moreMenu && !moreMenu.hidden && !moreMenu.contains(e.target) && e.target !== moreBtn && !moreBtn?.contains(e.target)) closeMore();
  });
  document.getElementById('btn-copy-discord')?.addEventListener('click', async () => {
    closeMore(); if (!moreBtn) return;
    moreBtn.innerHTML = '<span class="more-dots">…</span> COPYING';
    try { await copyDiscordText(); moreBtn.innerHTML = '<span class="more-dots">✓</span> COPIED'; }
    catch { moreBtn.innerHTML = '<span class="more-dots">!</span> FAILED'; alert('Could not copy — allow clipboard access.'); }
    setTimeout(() => { moreBtn.innerHTML = '<span class="more-dots">⋯</span> MORE <span class="more-caret">▾</span>'; }, 1800);
  });
  document.getElementById('btn-share-link')?.addEventListener('click', async () => {
    closeMore();
    const url = 'https://jvhlol.github.io/Sprites/';
    try { if (navigator.share) await navigator.share({ title: 'Sprite Locker', url }); else { await navigator.clipboard.writeText(url); alert('Link copied: ' + url); } } catch {}
  });
  document.getElementById('btn-export-image')?.addEventListener('click', async () => {
    closeMore(); if (!moreBtn) return;
    moreBtn.innerHTML = '<span class="more-dots">…</span> EXPORTING';
    try { await downloadShareImage(); moreBtn.innerHTML = '<span class="more-dots">✓</span> SAVED PNG'; }
    catch { moreBtn.innerHTML = '<span class="more-dots">!</span> FAILED'; }
    setTimeout(() => { moreBtn.innerHTML = '<span class="more-dots">⋯</span> MORE <span class="more-caret">▾</span>'; }, 1800);
  });
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    closeMore();
    if (!confirm('Reset all progress for this roster?')) return;
    localStorage.removeItem(storageKey());
    localStorage.removeItem(storageKey() + '-levels');
    state = loadState(); levels = loadLevels(); closeModal(); render();
  });
  document.getElementById('btn-lobby-codes')?.addEventListener('click', () => { closeMore(); openCodesPanel(); });
  document.getElementById('btn-whats-new')?.addEventListener('click', () => { closeMore(); openUpdatePanel(); });
  document.getElementById('btn-roster-classic')?.addEventListener('click', () => { closeMore(); applyRoster('classic'); });
  document.getElementById('btn-roster-override')?.addEventListener('click', () => { closeMore(); applyRoster('override'); });
  document.querySelectorAll('[data-close="codes"]').forEach(b => { b.onclick = closeCodesPanel; });
  document.querySelectorAll('[data-close="update"]').forEach(b => { b.onclick = closeUpdatePanel; });
  document.getElementById('btn-update-gotit')?.addEventListener('click', closeUpdatePanel);
  document.getElementById('codes-modal')?.addEventListener('click', e => { if (e.target.id === 'codes-modal') closeCodesPanel(); });
  document.getElementById('update-modal')?.addEventListener('click', e => { if (e.target.id === 'update-modal') closeUpdatePanel(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeMore(); closeCodesPanel(); closeUpdatePanel(); }
  });
  applyRoster(rosterMode);
  if (!localStorage.getItem('sprite-seen-update-v2')) setTimeout(openUpdatePanel, 600);
}

setupUI();
