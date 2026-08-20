import { SPRITES, VARIANTS, VARIANT_META, RARITY_COLORS, spriteImageUrl } from './data.js';

// state accessors injected
let getStatus, getLevel, computeStats;
export function initShare(api) {
  getStatus = api.getStatus;
  getLevel = api.getLevel;
  computeStats = api.computeStats;
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
  const lines = [
    header,
    '✅Have',
    '👻Lost — needs re-summon',
    '❌Need',
    '🚫Not available',
    '--------------------------------',
  ];
  for (const sp of SPRITES) {
    const cells = VARIANTS.map(v => statusSymbol(getStatus(sp.id, v)));
    lines.push(sp.name + ' ' + cells.join(''));
  }
  lines.push('');
  lines.push(stats.owned + '/' + stats.total + ' collected');
  lines.push('https://jvhlol.github.io/Sprites/');
  return lines.join('\n');
}

export async function copyDiscordText() {
  await navigator.clipboard.writeText(buildDiscordText());
}

function corsImg(url) {
  return 'https://images.weserv.nl/?url=' + encodeURIComponent(url.replace(/^https?:\/\//, '')) + '&output=webp';
}

function loadImg(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function drawPadlock(ctx, cx, cy, size) {
  const s = size;
  ctx.save();
  ctx.translate(cx - s / 2, cy - s / 2);
  ctx.strokeStyle = '#cbd5e1';
  ctx.fillStyle = 'rgba(15, 20, 30, 0.55)';
  ctx.lineWidth = Math.max(1.5, s * 0.08);
  const bw = s * 0.55, bh = s * 0.4, bx = (s - bw) / 2, by = s * 0.48;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, s * 0.08);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  const sx = s / 2, sy = by, r = bw * 0.32;
  ctx.arc(sx, sy, r, Math.PI, 0, false);
  ctx.stroke();
  ctx.restore();
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

export async function buildShareCanvas() {
  const stats = computeStats();
  const pct = stats.total ? Math.round((stats.owned / stats.total) * 100) : 0;
  const pad = 40, nameW = 150, cell = 56, gap = 8;
  const headerH = 130, variantHeadH = 36;
  const cols = VARIANTS.length;
  const rows = SPRITES.length;
  const W = pad * 2 + nameW + cols * (cell + gap) - gap;
  const H = headerH + variantHeadH + rows * (cell + gap) + 50;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#3a1520'); bg.addColorStop(0.4, '#1a0a10'); bg.addColorStop(1, '#0e0608');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(252,165,165,0.7)'; ctx.font = '600 12px Inter,system-ui,sans-serif';
  ctx.fillText('FORTNITE COLLECTION TRACKER', pad, 32);
  ctx.fillStyle = '#fecaca'; ctx.font = '800 40px Inter,system-ui,sans-serif';
  ctx.fillText('SPRITE LOCKER', pad, 76);
  ctx.fillStyle = 'rgba(196,160,168,0.9)'; ctx.font = '500 13px Inter,system-ui,sans-serif';
  ctx.fillText('Have vs. need — open to trade', pad, 100);

  ctx.textAlign = 'right'; ctx.fillStyle = '#fff'; ctx.font = '700 15px Inter,system-ui,sans-serif';
  ctx.fillText(stats.owned + ' / ' + stats.total + ' · ' + pct + '%', W - pad, 44);
  ctx.textAlign = 'left';

  roundRect(ctx, pad, 110, W - pad * 2, 10, 5);
  ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fill();
  if (pct > 0) {
    roundRect(ctx, pad, 110, Math.max(6, (W - pad * 2) * pct / 100), 10, 5);
    const g = ctx.createLinearGradient(pad, 0, W - pad, 0);
    g.addColorStop(0, '#5eead4'); g.addColorStop(1, '#38bdf8');
    ctx.fillStyle = g; ctx.fill();
  }

  const gridX = pad + nameW, gridY = headerH + variantHeadH;
  VARIANTS.forEach((v, i) => {
    const x = gridX + i * (cell + gap);
    roundRect(ctx, x, headerH + 4, cell, 26, 8);
    ctx.fillStyle = VARIANT_META[v].color; ctx.fill();
    ctx.fillStyle = '#0b1220'; ctx.font = '800 9px Inter,system-ui,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(VARIANT_META[v].label.toUpperCase().slice(0, 10), x + cell / 2, headerH + 21);
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
    normal: ['#2a4a6e', '#1e3a5f'],
    gold: ['#8a6a18', '#5c4a0c'],
    cheatmaster: ['#1a6a5a', '#124a3e'],
  };

  SPRITES.forEach((sp, ri) => {
    const y = gridY + ri * (cell + gap);
    ctx.beginPath(); ctx.arc(pad + 8, y + cell / 2, 5, 0, Math.PI * 2);
    ctx.fillStyle = RARITY_COLORS[sp.rarity] || '#fff'; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '700 13px Inter,system-ui,sans-serif';
    ctx.fillText(sp.name.toUpperCase(), pad + 20, y + cell / 2 + 5);

    VARIANTS.forEach((v, vi) => {
      const st = getStatus(sp.id, v);
      const x = gridX + vi * (cell + gap);
      if (st === 'owned' || st === 'mastered') {
        const cols = ownedBg[v] || ownedBg.normal;
        const g = ctx.createLinearGradient(x, y, x, y + cell);
        g.addColorStop(0, cols[0]); g.addColorStop(1, cols[1]);
        roundRect(ctx, x, y, cell, cell, 10);
        ctx.fillStyle = g; ctx.fill();
      } else {
        roundRect(ctx, x, y, cell, cell, 10);
        ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fill();
      }
      const img = imgMap[sp.id + ':' + v];
      if (img) {
        ctx.save();
        if (st == null || st === 'lost') ctx.globalAlpha = 0.4;
        const s = cell - 12;
        ctx.drawImage(img, x + 6, y + 6, s, s);
        ctx.restore();
      }
      if (st == null || st === 'lost') {
        drawPadlock(ctx, x + cell / 2, y + cell / 2, cell * 0.42);
      }
      if (st === 'mastered') {
        ctx.font = '16px serif';
        ctx.fillText('👑', x + cell - 20, y + 18);
      }
    });
  });

  return canvas;
}

export async function downloadShareImage() {
  const canvas = await buildShareCanvas();
  const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
  if (!blob) { alert('Could not create image'); return; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sprite-locker-' + Date.now() + '.png';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
