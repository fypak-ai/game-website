// ── Dashboard v2 — offline-first ─────────────────────────────
const XP_PER_LVL = 500;

const Dashboard = {
  load() {
    const u = this.getUser();
    if (!u) {
      document.getElementById('notLogged').classList.remove('hidden');
      return;
    }
    document.getElementById('dashContent').classList.remove('hidden');
    this.renderProfile(u);
    this.loadApps();
    this.loadTools();
    this.loadPurchased();
    this.loadMissions();
  },

  getUser() {
    try {
      // sync missions rewards first
      const ms = JSON.parse(localStorage.getItem('cp_missions') || '{}');
      let u = JSON.parse(localStorage.getItem('cp_currentUser') || 'null');
      if (!u) return null;
      if ((ms.xp || 0) > (u.xp || 0)) u.xp = ms.xp;
      const walletState = parseFloat(localStorage.getItem('cp_wallet') || '0');
      u.wallet = Math.max(ms.wallet || 0, walletState, u.wallet || 1000);
      u.level = 1 + Math.floor((u.xp || 0) / XP_PER_LVL);
      return u;
    } catch { return null; }
  },

  renderProfile(u) {
    const xp      = u.xp || 0;
    const wallet  = u.wallet || 1000;
    const level   = u.level || 1;
    const xpInLvl = xp % XP_PER_LVL;

    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('dAvatar',   u.avatar || '👤');
    set('dUsername', u.username || 'Jogador');
    set('dEmail',    u.email || '');
    try { set('dSince', new Date(u.created_at).toLocaleDateString('pt-BR')); } catch {}
    set('dWallet', 'R$ ' + Number(wallet).toFixed(2));
    set('dLevel',  'Nível ' + level);
    set('dXP',     xp + ' XP');

    const fill = document.getElementById('dXPFill');
    const prog = document.getElementById('dXPProgress');
    if (fill) fill.style.width = (xpInLvl / XP_PER_LVL * 100) + '%';
    if (prog) prog.textContent = `${xpInLvl} / ${XP_PER_LVL} XP para nível ${level + 1}`;

    // Mission stats
    try {
      const ms = JSON.parse(localStorage.getItem('cp_missions') || '{}');
      const mc = (ms.completed || []).length;
      set('dMissionsCount', mc);
      set('missBadge', mc);
    } catch {}
  },

  loadApps() {
    const apps = (() => { try { return JSON.parse(localStorage.getItem('cp_apps') || '[]'); } catch { return []; } })();
    const grid  = document.getElementById('dashAppsGrid');
    const empty = document.getElementById('dashAppsEmpty');
    const badge = document.getElementById('appsBadge');
    const cnt   = document.getElementById('dAppsCount');
    if (badge) badge.textContent = apps.length;
    if (cnt)   cnt.textContent   = apps.length;
    if (!apps.length) {
      if (grid)  grid.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');
    if (grid) grid.innerHTML = apps.map((a, i) => `
      <div class="dash-app-card" style="--ac:${a.color || '#7c3aed'}">
        <div class="dash-app-card__logo">${a.emoji || '✨'}</div>
        <div class="dash-app-card__body">
          <div class="dash-app-card__name">${a.name}</div>
          <div class="dash-app-card__meta">
            <span class="tag">${a.category || 'App'}</span>
            <span class="tag">${a.price === 0 ? 'Grátis' : 'R$ ' + Number(a.price || 0).toFixed(2)}</span>
            <span class="tag">⬇️ ${a.downloads || 0}</span>
          </div>
          <p class="dash-app-card__desc">${a.description || ''}</p>
        </div>
        <button class="btn btn--sm btn--danger-outline" onclick="Dashboard.deleteApp(${i}, this)">🗑️</button>
      </div>`).join('');
  },

  loadTools() {
    const key = 'cp_hack_tools';
    const tools = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } })();
    const grid  = document.getElementById('dashToolsGrid');
    const empty = document.getElementById('dashToolsEmpty');
    const badge = document.getElementById('toolsBadge');
    const cnt   = document.getElementById('dToolsCount');
    if (badge) badge.textContent = tools.length;
    if (cnt)   cnt.textContent   = tools.length;
    if (!tools.length) {
      if (grid)  grid.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');
    if (grid) grid.innerHTML = tools.map((t, i) => `
      <div class="dash-tool-card">
        <div class="dash-tool-card__icon">${t.emoji || '☠️'}</div>
        <div class="dash-tool-card__info">
          <strong>${t.name}</strong>
          <small>${t.type || 'Hacker'}</small>
        </div>
        <div class="dash-tool-card__power">
          <div class="power-mini"><div class="power-mini__fill" style="width:${t.power || 50}%"></div></div>
          <small>${t.power || 50}/100</small>
        </div>
        <button class="btn btn--sm btn--danger-outline" onclick="Dashboard.deleteTool(${i}, this)">🗑️</button>
      </div>`).join('');
  },

  loadPurchased() {
    const purchased = (() => { try { return JSON.parse(localStorage.getItem('cp_owned') || '[]'); } catch { return []; } })();
    const grid  = document.getElementById('dashPurchGrid');
    const empty = document.getElementById('dashPurchEmpty');
    const badge = document.getElementById('purchBadge');
    if (badge) badge.textContent = purchased.length;
    if (!purchased.length) {
      if (grid)  grid.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');
    if (grid) grid.innerHTML = purchased.map(a => `
      <div class="dash-app-card" style="--ac:${a.color || '#22c55e'}">
        <div class="dash-app-card__logo">${a.emoji || '🛒'}</div>
        <div class="dash-app-card__body">
          <div class="dash-app-card__name">${a.name}</div>
          <div class="dash-app-card__meta">
            <span class="tag">${a.category || 'App'}</span>
            <span class="tag">Comprado</span>
          </div>
        </div>
      </div>`).join('');
  },

  loadMissions() {
    const ms   = (() => { try { return JSON.parse(localStorage.getItem('cp_missions') || '{}'); } catch { return {}; } })();
    const done = (ms.completed || []).slice(0, 15);
    const log   = document.getElementById('dashMissLog');
    const empty = document.getElementById('dashMissEmpty');
    const badge = document.getElementById('missBadge');
    if (badge) badge.textContent = (ms.completed || []).length;
    if (!done.length) {
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');
    if (log) log.innerHTML = done.map(m => `
      <div class="miss-row">
        <span class="log-icon">${m.icon}</span>
        <span class="miss-row__title">${m.title}</span>
        <span class="reward-xp">+${m.earnedXP || 0} XP</span>
        <span class="reward-money">+R$ ${(m.earnedMoney || 0).toFixed(2)}</span>
        <span class="miss-row__when">${new Date(m.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>`).join('');
  },

  deleteApp(idx, btn) {
    const apps = (() => { try { return JSON.parse(localStorage.getItem('cp_apps') || '[]'); } catch { return []; } })();
    if (!confirm('Deletar "' + (apps[idx]?.name || 'app') + '"?')) return;
    apps.splice(idx, 1);
    localStorage.setItem('cp_apps', JSON.stringify(apps));
    this.loadApps();
  },

  deleteTool(idx, btn) {
    const tools = (() => { try { return JSON.parse(localStorage.getItem('cp_hack_tools') || '[]'); } catch { return []; } })();
    if (!confirm('Deletar "' + (tools[idx]?.name || 'ferramenta') + '"?')) return;
    tools.splice(idx, 1);
    localStorage.setItem('cp_hack_tools', JSON.stringify(tools));
    this.loadTools();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Dashboard.load();
  document.getElementById('btnLogout')?.addEventListener('click', () => {
    localStorage.removeItem('cp_currentUser');
    localStorage.removeItem('cp_token');
    localStorage.removeItem('cp_user');
    window.location.href = 'account.html';
  });
});
