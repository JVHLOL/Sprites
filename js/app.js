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
    const el = document.querySelector(`.card[data-sprite="${id}"][data-variant="${v}"]`);
    openModal(id, v, el);
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
    if (modalTarget) {
      const el = document.querySelector(`.card[data-sprite="${id}"][data-variant="${v}"]`);
      openModal(id, v, el);
    }
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
        const weight =
          (sp.rarity === 'mythic' ? 40 : sp.rarity === 'legendary' ? 30 : sp.rarity === 'epic' ? 20 : 10) +
          (v !== 'normal' ? 15 : 0);
        missingRare.push({
          name: `${VARIANT_META[v].label} ${sp.name}`,
          weight, id: sp.id, variant: v, rarity: sp.rarity,
        });
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
  else if (st === 'soon') body = (img ? `<img class="card-img dim" src="${img}" alt="" loading="lazy"/>` : '') + '<span class="lock-icon">✦</span>';
  else if (st == null || st === 'lost') body = (img ? `<img class="card-img dim" src="${img}" alt="" loading="lazy"/>` : '') + `<span class="lock-icon padlock">${PADLOCK}</span>`;
  else body = img ? `<img class="card-img" src="${img}" alt="${meta.label} ${sp.name}" loading="lazy"/>` : `<span class="card-placeholder">${emojiFor(sp.id)}</span>`;
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

function openModal(id, variant, anchorEl) {
  const sp = SPRITES.find(s => s.id === id);
  if (!sp) return;
  if (sp.variants[variant] === 'na') return;
  closeModal();
  modalTarget = { id, variant };
  const st = getStatus(id, variant);
  const meta = VARIANT_META[variant];
  const img = spriteImageUrl(id, variant);
  const level = getLevel(id, variant);
  const pop = document.createElement('div');
  pop.id = 'sprite-popover';
  pop.className = 'sprite-popover';
  pop.setAttribute('role', 'dialog');
  const imgHtml = img ? `<img class="pop-img" src="${img}" alt=""/>` : `<span class="pop-emoji">${emojiFor(id)}</span>`;
  const miniCards = VARIANTS.filter(v => {
    const s = getStatus(id, v);
    return s === 'owned' || s === 'mastered';
  }).map(v => {
    const s = getStatus(id, v);
    const u = spriteImageUrl(id, v);
    const lv = getLevel(id, v);
    return `<div class="pop-mini ${s}">${u ? `<img src="${u}" alt=""/>` : ''}<span class="pop-mini-lv">${lv}</span>${s === 'mastered' ? '<span class="pop-mini-crown">👑</span>' : ''}</div>`;
  }).join('');
  const availVariants = VARIANTS.filter(v => sp.variants[v] !== 'na');
  const dustRow = DUST[sp.rarity] || { normal: 0, special: 0 };
  const dustChips = availVariants.map(v => {
    const cost = v === 'normal' ? dustRow.normal : dustRow.special;
    const col = VARIANT_META[v].color;
    return `<span class="pop-dust-chip" style="background:${col}">${VARIANT_META[v].label} ${cost.toLocaleString()}</span>`;
  }).join('');
  pop.innerHTML = `
    <button class="pop-close" type="button" aria-label="Close">×</button>
    <div class="pop-head">${imgHtml}<div><h3>${sp.name}</h3><div class="pop-badges"><span class="pop-badge rarity-${sp.rarity}">${sp.rarity}</span><span class="pop-badge variant">${meta.label}</span></div></div></div>
    <div class="pop-label">Ability</div><p class="pop-effect">${sp.ability || ''}</p>
    <div class="pop-label">Where to find</div><p class="pop-bonus">${sp.where || '—'}</p>
    <div class="pop-label">Variants</div><p class="pop-variants-list">${availVariants.map(v => VARIANT_META[v].label).join(', ')}</p>
    <div class="pop-label">Resummon cost (Sprite Dust)</div><div class="pop-dust">${dustChips}</div>
    <div class="pop-actions">
      <button type="button" data-act="owned" class="${st === 'owned' ? 'on-owned' : ''}"><span>✓</span> Owned</button>
      <button type="button" data-act="mastered" class="${st === 'mastered' ? 'on-mastered' : ''}"><span>👑</span> Mastered</button>
      <button type="button" data-act="lost" class="${st === 'lost' ? 'on-lost' : ''}"><span>⊘</span> Lost</button>
    </div>
    <div class="pop-level"><span class="pop-level-label">Level</span><div class="pop-level-ctrls"><button type="button" data-lvl="-">−</button><span class="pop-level-val">${level} / 5</span><button type="button" data-lvl="+">+</button></div></div>
    ${miniCards ? `<div class="pop-minis">${miniCards}</div>` : ''}`;
  document.body.appendChild(pop);
  const pw = pop.offsetWidth || 360;
  const ph = pop.offsetHeight || 400;
  const left = Math.max(12, Math.round((window.innerWidth - pw) / 2));
  const top = Math.max(12, Math.round((window.innerHeight - ph) / 2));
  pop.style.position = 'fixed';
  pop.style.left = left + 'px';
  pop.style.top = top + 'px';
  pop.style.zIndex = '9999';
  pop.querySelector('.pop-close').onclick = (e) => { e.stopPropagation(); closeModal(); };
  pop.querySelectorAll('[data-act]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const act = btn.dataset.act;
      const cur = getStatus(id, variant);
      if (act === 'owned') setStatus(id, variant, cur === 'owned' ? null : 'owned');
      else if (act === 'mastered') setStatus(id, variant, cur === 'mastered' ? 'owned' : 'mastered');
      else if (act === 'lost') setStatus(id, variant, cur === 'lost' ? null : 'lost');
    };
  });
  pop.querySelectorAll('[data-lvl]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const d = btn.dataset.lvl === '+' ? 1 : -1;
      const cur = getStatus(id, variant);
      if (cur == null || cur === 'lost') setStatus(id, variant, 'owned');
      setLevel(id, variant, getLevel(id, variant) + d);
    };
  });
  _docCloser = (e) => {
    if (pop.contains(e.target)) return;
    if (e.target.closest && e.target.closest('.card[data-sprite]')) return;
    if (e.target.closest && e.target.closest('.rarest-chip')) return;
    closeModal();
  };
  setTimeout(() => document.addEventListener('mousedown', _docCloser, true), 50);
}

function closeModal() {
  if (_docCloser) {
    document.removeEventListener('mousedown', _docCloser, true);
    _docCloser = null;
  }
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
    ? stats.rarest.map(x =>
        `<button type="button" class="rarest-chip" data-sprite="${x.id}" data-variant="${x.variant}" title="Open ${x.name}">
          <span class="dot" style="background:${RARITY_COLORS[x.rarity] || '#34d399'}"></span>${x.name}
        </button>`).join('')
    : '<span class="rarest-chip">All collected 🎉</span>';
  rarestEl.querySelectorAll('.rarest-chip[data-sprite]').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(chip.dataset.sprite, chip.dataset.variant, document.querySelector(`.card[data-sprite="${chip.dataset.sprite}"][data-variant="${chip.dataset.variant}"]`) || chip);
    });
  });
  const abilitiesEl = document.getElementById('abilities-list');
  if (abilitiesEl) {
    abilitiesEl.innerHTML = SPRITES.map(sp => `
      <div class="ability-card"><div class="ability-head"><span class="rarity-dot" style="background:${RARITY_COLORS[sp.rarity]}"></span><strong>${sp.name}</strong><span class="rarity-tag">${sp.rarity}</span></div><p class="ability-text">${sp.ability || ''}</p><p class="ability-where">${sp.where || ''}</p></div>`).join('');
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
    const any = VARIANTS.some(v => matchesFilters(sp, v, getStatus(sp.id, v)));
    if (!any) return '';
    return `<div class="sprite-row"><div class="sprite-name"><span class="dot" style="background:${RARITY_COLORS[sp.rarity]}"></span>${sp.name}<span class="info" title="${sp.ability || sp.rarity}">ⓘ</span></div>${VARIANTS.map(v => {
      if (!matchesFilters(sp, v, getStatus(sp.id, v))) return '<div class="card" style="visibility:hidden;pointer-events:none"></div>';
      return cardHTML(sp, v);
    }).join('')}</div>`;
  }).join('');
  body.querySelectorAll('.card[data-sprite]').forEach(el => {
    el.addEventListener('click', (e) => { e.stopPropagation(); openModal(el.dataset.sprite, el.dataset.variant, el); });
  });
}

function statusSymbol(st) {
  if (st === 'owned' || st === 'mastered') return '✅';
  if (st === 'lost') return '👻';
  if (st === 'na' || st === 'soon') return '🚫';
  return '❌';
}
function buildDiscordText() {
  const stats = computeStats();
  const header = '|' + VARIANTS.map(v => VARIANT_META[v].label.toUpperCase()).join('|') + '|';
  const lines = [header, '✅Have', '👻Lost — needs re-summon', '❌Need', '🚫Not available', '--------------------------------'];
  for (const sp of SPRITES) {
    lines.push(sp.name + ' |' + VARIANTS.map(v => statusSymbol(getStatus(sp.id, v))).join('|') + '|');
  }
  lines.push(stats.owned + '/' + stats.total + ' collected · track yours at https://jvhlol.github.io/Sprites/');
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

function buildShareCanvas() {
  const stats = computeStats();
  const pct = stats.total ? Math.round((stats.owned / stats.total) * 100) : 0;
  const W = 720;
  const pad = 28;
  const cell = 14;
  const gap = 3;
  const nameW = 130;
  const headerH = 120;
  const rarityH = 100;
  const gridTop = headerH + rarityH + 20;
  const rows = SPRITES.length;
  const H = gridTop + rows * (cell + gap) + 50;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#1e5bb8');
  bg.addColorStop(0.4, '#1a4fa0');
  bg.addColorStop(1, '#0f2d6b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '600 11px Inter, system-ui, sans-serif';
  ctx.fillText('FORTNITE COLLECTION TRACKER', pad, 28);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 28px Inter, system-ui, sans-serif';
  ctx.fillText('SPRITE LOCKER', pad, 58);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '500 12px Inter, system-ui, sans-serif';
  ctx.fillText('Have vs. need — open to trade', pad, 78);

  ctx.fillStyle = '#f6c343';
  ctx.font = '800 32px Inter, system-ui, sans-serif';
  ctx.fillText(`${stats.owned} / ${stats.total}`, pad, 112);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 18px Inter, system-ui, sans-serif';
  ctx.fillText(`${pct}%`, pad + 180, 112);

  const barX = pad, barY = 122, barW = W - pad * 2, barH = 10;
  roundRect(ctx, barX, barY, barW, barH, 5);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();
  if (pct > 0) {
    roundRect(ctx, barX, barY, Math.max(8, barW * pct / 100), barH, 5);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
  }

  const rarities = [
    { key: 'rare', label: 'Rare', color: '#38bdf8' },
    { key: 'epic', label: 'Epic', color: '#c084fc' },
    { key: 'legendary', label: 'Legendary', color: '#fbbf24' },
    { key: 'mythic', label: 'Mythic', color: '#f87171' },
  ];
  const cardW = (W - pad * 2 - 18) / 4;
  rarities.forEach((r, i) => {
    const x = pad + i * (cardW + 6);
    const y = headerH + 8;
    roundRect(ctx, x, y, cardW, 80, 12);
    ctx.fillStyle = 'rgba(0, 20, 60, 0.45)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 16, y + 20, 5, 0, Math.PI * 2);
    ctx.fillStyle = r.color;
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '600 11px Inter, system-ui, sans-serif';
    ctx.fillText(r.label, x + 28, y + 24);
    const { o, t } = stats.byRarity[r.key];
    ctx.fillStyle = '#fff';
    ctx.font = '800 20px Inter, system-ui, sans-serif';
    ctx.fillText(`${o}/${t}`, x + 14, y + 52);
    const rp = t ? o / t : 0;
    roundRect(ctx, x + 14, y + 62, cardW - 28, 6, 3);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fill();
    if (rp > 0) {
      roundRect(ctx, x + 14, y + 62, Math.max(4, (cardW - 28) * rp), 6, 3);
      ctx.fillStyle = r.color;
      ctx.fill();
    }
  });

  ctx.fillStyle = '#f6c343';
  ctx.font = '700 12px Inter, system-ui, sans-serif';
  ctx.fillText(`Mastered ${stats.mastered}`, W - pad - 110, 40);

  const gridX = pad + nameW;
  const gridY = gridTop;
  VARIANTS.forEach((v, i) => {
    const x = gridX + i * (cell + gap);
    ctx.fillStyle = VARIANT_META[v].color;
    roundRect(ctx, x, gridY - 18, cell, 12, 3);
    ctx.fill();
  });
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '600 10px Inter, system-ui, sans-serif';
  ctx.fillText('SPRITE', pad, gridY - 8);

  SPRITES.forEach((sp, ri) => {
    const y = gridY + ri * (cell + gap);
    ctx.fillStyle = RARITY_COLORS[sp.rarity] || '#fff';
    ctx.beginPath();
    ctx.arc(pad + 6, y + cell / 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '600 11px Inter, system-ui, sans-serif';
    ctx.fillText(sp.name.length > 16 ? sp.name.slice(0, 15) + '…' : sp.name, pad + 16, y + cell - 3);

    VARIANTS.forEach((v, vi) => {
      const st = getStatus(sp.id, v);
      const x = gridX + vi * (cell + gap);
      if (st === 'na') ctx.fillStyle = 'rgba(71, 85, 105, 0.35)';
      else if (st === 'soon') ctx.fillStyle = 'rgba(109, 40, 217, 0.45)';
      else if (st === 'mastered') ctx.fillStyle = '#f6c343';
      else if (st === 'owned') ctx.fillStyle = '#38bdf8';
      else if (st === 'lost') ctx.fillStyle = '#64748b';
      else ctx.fillStyle = 'rgba(255,255,255,0.12)';
      roundRect(ctx, x, y, cell, cell, 3);
      ctx.fill();
      if (st === 'mastered') {
        ctx.fillStyle = '#0b1220';
        ctx.font = '700 9px Inter, system-ui, sans-serif';
        ctx.fillText('*', x + 4, y + 11);
      }
    });
  });

  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '500 11px Inter, system-ui, sans-serif';
  ctx.fillText('jvhlol.github.io/Sprites', pad, H - 18);

  return canvas;
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

async function downloadShareImage() {
  const canvas = buildShareCanvas();
  const blob = await canvasToBlob(canvas);
  if (!blob) { alert('Could not create image'); return; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `sprite-locker-${Date.now()}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

async function copyShareImage() {
  const canvas = buildShareCanvas();
  const blob = await canvasToBlob(canvas);
  if (!blob) { alert('Could not create image'); return false; }
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      return true;
    }
  } catch (e) {
    console.warn('clipboard image failed', e);
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `sprite-locker-discord-${Date.now()}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  return false;
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

  const moreBtn = document.getElementById('btn-more');
  const moreMenu = document.getElementById('more-menu');
  function closeMore() {
    moreMenu.hidden = true;
    moreBtn.classList.remove('open');
    moreBtn.setAttribute('aria-expanded', 'false');
  }
  function openMore() {
    moreMenu.hidden = false;
    moreBtn.classList.add('open');
    moreBtn.setAttribute('aria-expanded', 'true');
  }
  moreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (moreMenu.hidden) openMore(); else closeMore();
  });
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
      console.error(e);
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
      console.error(e);
      moreBtn.innerHTML = '<span class="more-dots">!</span> FAILED';
    }
    setTimeout(() => { moreBtn.innerHTML = '<span class="more-dots">⋯</span> MORE <span class="more-caret">▾</span>'; }, 1800);
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    closeMore();
    if (!confirm('Reset all progress?')) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + '-levels');
    state = loadState();
    levels = loadLevels();
    closeModal();
    render();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeMore(); }
  });
}

setupUI();
render();
