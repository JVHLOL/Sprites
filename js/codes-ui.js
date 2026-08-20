import { LOBBY_CODES, OVERRIDE_SPRITES, SPRITES as CLASSIC } from './data.js';

export function installCodesAndRoster(api) {
  const {
    setSprites, loadState, loadLevels, setState, setLevels,
    closeModal, render, closeMore,
  } = api;

  let rosterMode = localStorage.getItem('sprite-roster') || 'classic';

  function applyRoster(mode) {
    rosterMode = mode;
    localStorage.setItem('sprite-roster', mode);
    setSprites(mode === 'override' ? OVERRIDE_SPRITES : CLASSIC);
    setState(loadState());
    setLevels(loadLevels());
    document.querySelectorAll('.roster-btn').forEach(b => {
      b.classList.toggle('on', b.dataset.roster === mode);
    });
    closeModal();
    render();
  }

  function openCodesPanel() {
    const modal = document.getElementById('codes-modal');
    const list = document.getElementById('codes-list');
    if (!modal || !list) return;
    list.innerHTML = LOBBY_CODES.map(c =>
      `<div class="code-row"><button type="button" class="code-copy" data-code="${c.code}">` +
      `<span class="code-text">${c.code}</span><span class="code-reward">${c.reward}</span>` +
      `<span class="code-copy-hint">copy</span></button></div>`
    ).join('');
    list.querySelectorAll('.code-copy').forEach(btn => {
      btn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.code);
          btn.classList.add('copied');
          const h = btn.querySelector('.code-copy-hint');
          if (h) h.textContent = 'copied!';
          setTimeout(() => {
            btn.classList.remove('copied');
            if (h) h.textContent = 'copy';
          }, 1200);
        } catch {}
      };
    });
    modal.hidden = false;
  }

  function closeCodesPanel() {
    const m = document.getElementById('codes-modal');
    if (m) m.hidden = true;
  }

  function openUpdatePanel() {
    const m = document.getElementById('update-modal');
    if (m) m.hidden = false;
    localStorage.setItem('sprite-seen-update-v2', '1');
  }

  function closeUpdatePanel() {
    const m = document.getElementById('update-modal');
    if (m) m.hidden = true;
  }

  document.getElementById('btn-lobby-codes')?.addEventListener('click', () => {
    closeMore(); openCodesPanel();
  });
  document.getElementById('btn-whats-new')?.addEventListener('click', () => {
    closeMore(); openUpdatePanel();
  });
  document.getElementById('btn-roster-classic')?.addEventListener('click', () => {
    closeMore(); applyRoster('classic');
  });
  document.getElementById('btn-roster-override')?.addEventListener('click', () => {
    closeMore(); applyRoster('override');
  });
  document.querySelectorAll('[data-close="codes"]').forEach(b => { b.onclick = closeCodesPanel; });
  document.querySelectorAll('[data-close="update"]').forEach(b => { b.onclick = closeUpdatePanel; });
  document.getElementById('btn-update-gotit')?.addEventListener('click', closeUpdatePanel);
  document.getElementById('codes-modal')?.addEventListener('click', e => {
    if (e.target.id === 'codes-modal') closeCodesPanel();
  });
  document.getElementById('update-modal')?.addEventListener('click', e => {
    if (e.target.id === 'update-modal') closeUpdatePanel();
  });

  applyRoster(rosterMode);
  if (!localStorage.getItem('sprite-seen-update-v2')) {
    setTimeout(openUpdatePanel, 600);
  }

  return { closeCodesPanel, closeUpdatePanel, applyRoster };
}
