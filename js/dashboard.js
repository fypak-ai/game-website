// ── Dashboard Page ────────────────────────────────────────────────
const XP_PER_LVL = 500;

const Dashboard = {
  async load() {
    if (!API.isLoggedIn()) {
      document.getElementById('notLogged').classList.remove('hidden');
      return;
    }
    document.getElementById('dashContent').classList.remove('hidden');

    // Try fresh data from server
    try {
      const u = await API.me();
      API.currentUser = u;
    } catch {}

    this.renderProfile();
    await Promise.all([this.loadApps(), this.loadTools(), this.loadMissions()]);
  },

  renderProfile() {
    const u = API.currentUser;
    if (!u) return;
    const xp     = u.xp     || 0;
    const wallet = u.wallet || 1000;
    const level  = u.level  || (1 + Math.floor(xp / XP_PER_LVL));
    const xpInLvl = xp % XP_PER_LVL;

    const set = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
    set('dAvatar',   u.avatar  || '👤');
    set('dUsername', u.username || 'Jogador');
    set('dEmail',    u.email    || '');
    set('dSince',    new Date(u.created_at).toLocaleDateString('pt-BR'));
    set('dWallet',   'R$ ' + wallet.toFixed(2));
    set('dLevel',    'Nível ' + level);
    set('dXP',       xp + ' XP');
    set('dXPProgress', `${xpInLvl} / ${XP_PER_LVL} XP para nível ${level + 1}`);

    const fill = document.getElementById('dXPFill');
    if(fill) fill.style.width = (xpInLvl / XP_PER_LVL * 100) + '%';

    // Mission stats from localStorage
    try {
      const ms = JSON.parse(localStorage.getItem('cp_missions') || '{}');
      const mCount = (ms.completed || []).length;
      set('dMissionsCount', mCount);
      set('missBadge', mCount);
    } catch {}
  },

  async loadApps() {
    try {
      const apps = await API.getMyApps();
      const grid  = document.getElementById('dashAppsGrid');
      const empty = document.getElementById('dashAppsEmpty');
      const badge = document.getElementById('appsBadge');
      const cnt   = document.getElementById('dAppsCount');
      if(badge) badge.textContent = apps.length;
      if(cnt)   cnt.textContent   = apps.length;
      if(!apps.length) {
        if(grid)  grid.innerHTML = '';
        if(empty) empty.classList.remove('hidden');
        return;
      }
      if(empty) empty.classList.add('hidden');
      if(grid) grid.innerHTML = apps.map(a => `
        <div class="dash-app-card" style="--ac:${a.color||'#7c3aed'}">
          <div class="dash-app-card__logo">${a.emoji || '✨'}</div>
          <div class="dash-app-card__body">
            <div class="dash-app-card__name">${a.name}</div>
            <div class="dash-app-card__meta">
              <span class="tag">${a.category}</span>
              <span class="tag">${a.price === 0 ? 'Grátis' : 'R$ '+Number(a.price).toFixed(2)}</span>
              <span class="tag">⬇️ ${a.downloads || 0}</span>
            </div>
            <p class="dash-app-card__desc">${a.description || ''}</p>
          </div>
          <button class="btn btn--sm btn--danger-outline" onclick="Dashboard.deleteApp(${a.id}, this)">🗑️</button>
        </div>`).join('');
    } catch(e) { console.warn('loadApps error', e); }
  },

  async loadTools() {
    try {
      const tools = await API.getMyTools();
      const grid  = document.getElementById('dashToolsGrid');
      const empty = document.getElementById('dashToolsEmpty');
      const badge = document.getElementById('toolsBadge');
      const cnt   = document.getElementById('dToolsCount');
      if(badge) badge.textContent = tools.length;
      if(cnt)   cnt.textContent   = tools.length;
      if(!tools.length) {
        if(grid)  grid.innerHTML = '';
        if(empty) empty.classList.remove('hidden');
        return;
      }
      if(empty) empty.classList.add('hidden');
      if(grid) grid.innerHTML = tools.map(t => `
        <div class="dash-tool-card">
          <div class="dash-tool-card__icon">${t.emoji || '☠️'}</div>
          <div class="dash-tool-card__info">
            <strong>${t.name}</strong>
            <small>${t.type}</small>
          </div>
          <div class="dash-tool-card__power">
            <div class="power-mini"><div class="power-mini__fill" style="width:${t.power}%"></div></div>
            <small>${t.power}/100</small>
          </div>
          <button class="btn btn--sm btn--danger-outline" onclick="Dashboard.deleteTool(${t.id}, this)">🗑️</button>
        </div>`).join('');
    } catch(e) { console.warn('loadTools error', e); }
  },

  loadMissions() {
    try {
      const ms   = JSON.parse(localStorage.getItem('cp_missions') || '{}');
      const done = (ms.completed || []).slice(0, 10);
      const log   = document.getElementById('dashMissLog');
      const empty = document.getElementById('dashMissEmpty');
      if(!done.length) {
        if(empty) empty.classList.remove('hidden');
        return;
      }
      if(empty) empty.classList.add('hidden');
      if(log) log.innerHTML = done.map(m => `
        <div class="miss-row">
          <span>${m.icon}</span>
          <span class="miss-row__title">${m.title}</span>
          <span class="reward-xp">+${m.earnedXP} XP</span>
          <span class="reward-money">+R$ ${(m.earnedMoney||0).toFixed(2)}</span>
          <span class="miss-row__when">${new Date(m.completedAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</span>
        </div>`).join('');
    } catch {}
  },

  async deleteApp(id, btn) {
    if(!confirm('Deletar este app?')) return;
    btn.disabled = true;
    try {
      await API.deleteApp(id);
      await this.loadApps();
    } catch(e) { alert(e.message); btn.disabled = false; }
  },

  async deleteTool(id, btn) {
    if(!confirm('Deletar esta ferramenta?')) return;
    btn.disabled = true;
    try {
      await API.deleteTool(id);
      await this.loadTools();
    } catch(e) { alert(e.message); btn.disabled = false; }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Dashboard.load();
  document.getElementById('btnLogout')?.addEventListener('click', () => {
    API.logout();
    window.location.href = 'account.html';
  });
});
