import {
  SPRITES, VARIANTS, VARIANT_META, RARITY_COLORS, DUST,
  spriteImageUrl
} from './data.js';

const STORAGE_KEY = 'sprite-locker-v1';
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

function loadLevels() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + '-levels');
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  localStorage.setItem(STORAGE_KEY + '-levels', JSON.stringify(levels));
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
  if (modalTarget && modalTarget.id === id && modalTarget.variant === v) {
    openModal(id, v, document.querySelector(`.card[data-sprite="${id}"][data-variant="${v}"]`));
  }
}

function setLevel(id, v, n) {
  n = Math.max(1, Math.min(5, n));
  levels[id + ':' + v] = n;
  const st = getStatus(id, v);
  if (n === 5 && st === 'owned') setStatus(id, v, 'mastered');
  else if (n < 5 && st === 'mastered') setStatus(id, v, 'owned');
  else {
    saveState();
    render();
    if (modalTarget) openModal(id, v, document.querySelector(`.card[data-sprite="${id}"][data-variant="${v}"]`));
  }
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
  const level = getLevel(sp.id, variant);
  const img = spriteImageUrl(sp.id, variant);
  let body = '';
  if (st === 'na') body = '<span class="lock-icon">⊘</span>';
  else if (st === 'soon') body = (img ? `<img class="card-img dim" src="${img}" alt="" loading="lazy"/>` : '') + '<span class="lock-icon soon-label">SOON</span>';
  else if (st == null || st === 'lost') body = (img ? `<img class="card-img dim" src="${img}" alt="" loading="lazy"/>` : '') + `<span class="lock-icon padlock">${PADLOCK}</span>`;
  else body = img ? `<img class="card-img" src="${img}" alt="${meta.label} ${sp.name}" loading="lazy"/>` : `<span class="card-placeholder">${emojiFor(sp.id)}</span>`;
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
  const imgHtml = img ? `<img class="pop-img" src="${img}" alt=""/>` : `<span class="pop-emoji">${emojiFor(id)}</span>`;
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
    ? stats.rarest.map(x => `<button type="button" class="rarest-chip" data-sprite="${x.id}" data-variant="${x.variant}"><span class="dot" style="background:${RARITY_COLORS[x.rarity] || '#34d399'}"></span>${x.name}</button>`).join('')
    : '<span class="rarest-chip">All collected 🎉</span>';
  rarestEl.querySelectorAll('.rarest-chip[data-sprite]').forEach(chip => {
    chip.addEventListener('click', (e) => { e.stopPropagation(); openModal(chip.dataset.sprite, chip.dataset.variant); });
  });
  const abilitiesEl = document.getElementById('abilities-list');
  if (abilitiesEl) {
    abilitiesEl.innerHTML = SPRITES.map(sp => `<div class="ability-card"><div class="ability-head"><span class="rarity-dot" style="background:${RARITY_COLORS[sp.rarity]}"></span><strong>${sp.name}</strong><span class="rarity-tag">${sp.rarity}</span></div><p class="ability-text">${sp.ability || ''}</p><p class="ability-where">${sp.where || ''}</p></div>`).join('');
  }
  const variantsEl = document.getElementById('variants-list');
  if (variantsEl) {
    variantsEl.innerHTML = VARIANTS.map(v => {
      const m = VARIANT_META[v];
      return `<div class="variant-card" style="border-color:${m.color}"><div class="variant-label" style="background:${m.color}">${m.label}</div><p>${m.desc}</p></div>`;
    }).join('');
  }
  document.getElementById('grid-header').innerHTML = `<div class="col-head sprite-col">SPRITE</div>${VARIANTS.map(v => `<div class="col-head" style="background:${VARIANT_META[v].color}">${VARIANT_META[v].label}</div>`).join('')}`;
  const body = document.getElementById('grid-body');
  body.innerHTML = SPRITES.map(sp => {
    if (!VARIANTS.some(v => matchesFilters(sp, v, getStatus(sp.id, v)))) return '';
    return `<div class="sprite-row"><div class="sprite-name"><span class="dot" style="background:${RARITY_COLORS[sp.rarity]}"></span>${sp.name}<span class="info" title="${sp.ability || sp.rarity}">ⓘ</span></div>${VARIANTS.map(v => {
      if (!matchesFilters(sp, v, getStatus(sp.id, v))) return '<div class="card" style="visibility:hidden;pointer-events:none"></div>';
      return cardHTML(sp, v);
    }).join('')}</div>`;
  }).join('');
  body.querySelectorAll('.card[data-sprite]').forEach(el => {
    el.addEventListener('click', (e) => { e.stopPropagation(); openModal(el.dataset.sprite, el.dataset.variant); });
  });
}

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
  const vLabels = VARIANTS.map(v => VARIANT_META[v].label.toUpperCase().padEnd(8).slice(0, 8));
  const lines = [
    '```',
    '✅ Have   👻 Lost (re-summon)   ❌ Need   🔜 Soon   🚫 N/A',
    '',
    pad('SPRITE', nameW) + '  ' + vLabels.join(' '),
    '-'.repeat(nameW) + '--' + vLabels.map(() => '--------').join('-'),
  ];
  for (const sp of SPRITES) {
    const cells = VARIANTS.map(v => (statusSymbol(getStatus(sp.id, v)) + '       ').slice(0, 8));
    lines.push(pad(sp.name, nameW) + '  ' + cells.join(' '));
  }
  lines.push('');
  lines.push(stats.owned + '/' + stats.total + ' collected');
  lines.push('https://jvhlol.github.io/Sprites/');
  lines.push('```');
  return lines.join('\n');
}

async function copyDiscordText() {
  await navigator.clipboard.writeText(buildDiscordText());
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function corsImg(url) {
  if (!url) return null;
  return 'https://images.weserv.nl/?url=' + encodeURIComponent(url.replace(/^https?:\/\//, '')) + '&output=webp&n=-1';
}
function loadImg(url) {
  return new Promise(res => {
    if (!url) return res(null);
    const i = new Image();
    i.crossOrigin = 'anonymous';
    const t = setTimeout(() => res(null), 7000);
    i.onload = () => { clearTimeout(t); res(i); };
    i.onerror = () => { clearTimeout(t); res(null); };
    i.src = url;
  });
}
async function buildShareCanvas() {
  const stats = computeStats();
  const pct = stats.total ? Math.round((stats.owned / stats.total) * 100) : 0;
  const pad = 44, nameW = 160, cell = 58, gap = 10;
  const headerH = 140, colH = 36;
  const W = pad * 2 + nameW + VARIANTS.length * (cell + gap) - gap;
  const H = headerH + colH + SPRITES.length * (cell + gap) + 48;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#2b7de9'); bg.addColorStop(0.35, '#1a5fc4'); bg.addColorStop(1, '#0d3a7a');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '600 12px Inter,system-ui,sans-serif';
  ctx.fillText('FORTNITE COLLECTION TRACKER', pad, 36);
  ctx.fillStyle = '#fff'; ctx.font = '800 44px Inter,system-ui,sans-serif';
  ctx.fillText('SPRITE LOCKER', pad, 84);
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '500 14px Inter,system-ui,sans-serif';
  ctx.fillText('Have vs. need — open to trade', pad, 108);

  ctx.textAlign = 'right'; ctx.fillStyle = '#fff'; ctx.font = '700 16px Inter,system-ui,sans-serif';
  ctx.fillText(stats.owned + ' / ' + stats.total + ' · ' + pct + '%', W - pad, 48);
  ctx.textAlign = 'left';

  roundRect(ctx, pad, 118, W - pad * 2, 10, 5);
  ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fill();
  if (pct > 0) {
    roundRect(ctx, pad, 118, Math.max(6, (W - pad * 2) * pct / 100), 10, 5);
    const g = ctx.createLinearGradient(pad, 0, W - pad, 0);
    g.addColorStop(0, '#5eead4'); g.addColorStop(1, '#38bdf8');
    ctx.fillStyle = g; ctx.fill();
  }

  const gridX = pad + nameW, gridY = headerH + colH;
  VARIANTS.forEach((v, i) => {
    const x = gridX + i * (cell + gap);
    roundRect(ctx, x, headerH + 4, cell, 26, 8);
    ctx.fillStyle = VARIANT_META[v].color; ctx.fill();
    ctx.fillStyle = '#0b1220'; ctx.font = '800 9px Inter,system-ui,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(VARIANT_META[v].label.toUpperCase(), x + cell / 2, headerH + 21);
  });
  ctx.textAlign = 'left';

  const imgMap = {};
  const jobs = [];
  for (const sp of SPRITES) {
    for (const v of VARIANTS) {
      const st = getStatus(sp.id, v);
      if (st === 'na' || st === 'soon') continue;
      const raw = spriteImageUrl(sp.id, v);
      if (!raw) continue;
      const key = sp.id + ':' + v;
      jobs.push(loadImg(corsImg(raw)).then(img => { if (img) imgMap[key] = img; }));
    }
  }
  await Promise.all(jobs);

  const ownedBg = {
    normal: ['#3d6ea8', '#2a5280'], gold: ['#c9a227', '#8a6e12'],
    gummy: ['#d45a9a', '#9a3a6e'], galaxy: ['#7b4fd4', '#4a2a8a'],
    gem: ['#6a8aaa', '#4a6278'], holofoil: ['#3db8a0', '#2a8070'],
    cube: ['#4caf50', '#2e7d32'], quack: ['#e8a020', '#b07810'],
  };

  SPRITES.forEach((sp, ri) => {
    const y = gridY + ri * (cell + gap);
    ctx.beginPath(); ctx.arc(pad + 8, y + cell / 2, 5, 0, Math.PI * 2);
    ctx.fillStyle = RARITY_COLORS[sp.rarity] || '#fff'; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '700 14px Inter,system-ui,sans-serif';
    ctx.fillText(sp.name.toUpperCase(), pad + 20, y + cell / 2 + 5);

    VARIANTS.forEach((v, vi) => {
      const st = getStatus(sp.id, v);
      const x = gridX + vi * (cell + gap);

      if (st === 'na') {
        roundRect(ctx, x, y, cell, cell, 11);
        ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '700 18px Inter,system-ui,sans-serif';
        ctx.textAlign = 'center'; ctx.fillText('—', x + cell / 2, y + cell / 2 + 6);
        ctx.textAlign = 'left'; return;
      }
      if (st === 'soon') {
        roundRect(ctx, x, y, cell, cell, 11);
        ctx.fillStyle = 'rgba(80,40,140,0.5)'; ctx.fill();
        ctx.fillStyle = '#e9d5ff'; ctx.font = '800 10px Inter,system-ui,sans-serif';
        ctx.textAlign = 'center'; ctx.fillText('SOON', x + cell / 2, y + cell / 2 + 4);
        ctx.textAlign = 'left'; return;
      }

      const have = st === 'owned' || st === 'mastered';
      if (have) {
        const cols = ownedBg[v] || ownedBg.normal;
        const g = ctx.createLinearGradient(x, y, x, y + cell);
        g.addColorStop(0, cols[0]); g.addColorStop(1, cols[1]);
        roundRect(ctx, x, y, cell, cell, 11); ctx.fillStyle = g; ctx.fill();
        ctx.strokeStyle = st === 'mastered' ? '#f6c343' : 'rgba(255,255,255,0.28)';
        ctx.lineWidth = st === 'mastered' ? 2.5 : 1.5; ctx.stroke();
      } else {
        roundRect(ctx, x, y, cell, cell, 11);
        ctx.fillStyle = 'rgba(10,40,90,0.55)'; ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1.5; ctx.stroke();
      }

      const img = imgMap[sp.id + ':' + v];
      if (img && have) {
        try {
          const s = cell * 0.76;
          ctx.drawImage(img, x + (cell - s) / 2, y + (cell - s) / 2 + 2, s, s);
        } catch (e) {}
      } else if (!have) {
        ctx.fillStyle = 'rgba(180,210,240,0.55)';
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', x + cell / 2, y + cell / 2 + 7);
        ctx.textAlign = 'left';
      }

      if (have) {
        const lv = getLevel(sp.id, v);
        roundRect(ctx, x + 4, y + 4, 16, 14, 4);
        ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fill();
        ctx.fillStyle = '#fef3c7'; ctx.font = '800 10px Inter,system-ui,sans-serif';
        ctx.textAlign = 'center'; ctx.fillText(String(lv), x + 12, y + 14);
        ctx.textAlign = 'left';
        if (st === 'mastered' || lv >= 5) {
          ctx.font = '13px serif'; ctx.textAlign = 'center';
          ctx.fillText('👑', x + cell - 12, y + 16); ctx.textAlign = 'left';
        } else {
          ctx.fillStyle = '#4ade80'; ctx.font = '800 12px Inter,system-ui,sans-serif';
          ctx.textAlign = 'center'; ctx.fillText('✓', x + cell - 11, y + cell - 9);
          ctx.textAlign = 'left';
        }
      }
    });
  });

  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '500 12px Inter,system-ui,sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('jvhlol.github.io/Sprites', W / 2, H - 18);
  ctx.textAlign = 'left';
  return canvas;
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

async function downloadShareImage() {
  const canvas = await buildShareCanvas();
  const blob = await canvasToBlob(canvas);
  if (!blob) { alert('Could not create image'); return; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `sprite-locker-${Date.now()}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
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
    filters.showLevels = !filters.showLevels; this.classList.toggle('on', filters.showLevels); render();
  });
  document.getElementById('toggle-dust').addEventListener('click', function () {
    filters.showDust = !filters.showDust; this.classList.toggle('on', filters.showDust);
  });
  const moreBtn = document.getElementById('btn-more');
  const moreMenu = document.getElementById('more-menu');
  function closeMore() { moreMenu.hidden = true; moreBtn.classList.remove('open'); moreBtn.setAttribute('aria-expanded', 'false'); }
  function openMore() { moreMenu.hidden = false; moreBtn.classList.add('open'); moreBtn.setAttribute('aria-expanded', 'true'); }
  moreBtn.addEventListener('click', (e) => { e.stopPropagation(); if (moreMenu.hidden) openMore(); else closeMore(); });
  document.addEventListener('mousedown', (e) => {
    if (!moreMenu.hidden && !moreMenu.contains(e.target) && e.target !== moreBtn && !moreBtn.contains(e.target)) closeMore();
  });
  document.getElementById('btn-copy-discord').addEventListener('click', async () => {
    closeMore();
    moreBtn.innerHTML = '<span class="more-dots">…</span> COPYING';
    try {
      await copyDiscordText();
      moreBtn.innerHTML = '<span class="more-dots">✓</span> COPIED';
    } catch (e) {
      moreBtn.innerHTML = '<span class="more-dots">!</span> FAILED';
      alert('Could not copy — allow clipboard access.');
    }
    setTimeout(() => { moreBtn.innerHTML = '<span class="more-dots">⋯</span> MORE <span class="more-caret">▾</span>'; }, 1800);
  });
  document.getElementById('btn-share-link').addEventListener('click', async () => {
    closeMore();
    const url = 'https://jvhlol.github.io/Sprites/';
    try {
      if (navigator.share) await navigator.share({ title: 'Sprite Locker', url });
      else { await navigator.clipboard.writeText(url); alert('Link copied: ' + url); }
    } catch {}
  });
  document.getElementById('btn-export-image').addEventListener('click', async () => {
    closeMore();
    moreBtn.innerHTML = '<span class="more-dots">…</span> EXPORTING';
    try {
      await downloadShareImage();
      moreBtn.innerHTML = '<span class="more-dots">✓</span> SAVED PNG';
    } catch (e) {
      moreBtn.innerHTML = '<span class="more-dots">!</span> FAILED';
    }
    setTimeout(() => { moreBtn.innerHTML = '<span class="more-dots">⋯</span> MORE <span class="more-caret">▾</span>'; }, 1800);
  });
  document.getElementById('btn-reset').addEventListener('click', () => {
    closeMore();
    if (!confirm('Reset all progress?')) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + '-levels');
    state = loadState(); levels = loadLevels(); closeModal(); render();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeMore(); } });
}

setupUI();
render();
