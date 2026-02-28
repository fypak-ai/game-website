// ── Account Page v2 — offline-first auth ─────────────────────
// Works entirely with localStorage. Backend sync is optional.

const XP_PER_LVL = 500;

const Account = {
  selectedAvatar: '👤',

  showTab(tab) {
    document.getElementById('formLogin').classList.toggle('hidden', tab !== 'login');
    document.getElementById('formRegister').classList.toggle('hidden', tab !== 'register');
    document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
    document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
  },

  msg(id, text, isErr) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = 'auth-msg ' + (isErr ? 'auth-msg--err' : 'auth-msg--ok');
    el.classList.remove('hidden');
  },

  // ── Local DB helpers ────────────────────────────────────────
  getUsers() { try { return JSON.parse(localStorage.getItem('cp_registered_users') || '[]'); } catch { return []; } },
  saveUsers(arr) { localStorage.setItem('cp_registered_users', JSON.stringify(arr)); },

  hashPass(pass) {
    // Simple deterministic hash (no crypto needed for this demo)
    let h = 0;
    for (let i = 0; i < pass.length; i++) { h = (Math.imul(31, h) + pass.charCodeAt(i)) | 0; }
    return 'lh_' + Math.abs(h).toString(36) + pass.length;
  },

  // ── Register ────────────────────────────────────────────────
  async register() {
    const username = document.getElementById('regUser').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const pass     = document.getElementById('regPass').value;
    if (!username || !email || !pass) return this.msg('registerMsg', 'Preencha todos os campos', true);
    if (pass.length < 4) return this.msg('registerMsg', 'Senha com no mínimo 4 caracteres', true);

    const users = this.getUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase()))
      return this.msg('registerMsg', 'Username já em uso', true);
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
      return this.msg('registerMsg', 'E-mail já em uso', true);

    // Get XP/wallet from any existing local session
    const ms = (() => { try { return JSON.parse(localStorage.getItem('cp_missions') || '{}'); } catch { return {}; } })();

    const user = {
      id: 'u_' + Date.now(),
      username, email,
      passwordHash: this.hashPass(pass),
      avatar: this.selectedAvatar || '👤',
      wallet: ms.wallet || 1000,
      xp: ms.xp || 0,
      level: ms.level || 1,
      created_at: new Date().toISOString()
    };
    users.push(user);
    this.saveUsers(users);
    this._setSession(user);

    // Try backend too (silent)
    this._tryBackendRegister(username, email, pass, user.avatar);

    this.msg('registerMsg', '✅ Conta criada!', false);
    setTimeout(() => this.renderProfile(), 600);
  },

  // ── Login ───────────────────────────────────────────────────
  async login() {
    const input = document.getElementById('loginUser').value.trim();
    const pass  = document.getElementById('loginPass').value;
    if (!input || !pass) return this.msg('loginMsg', 'Preencha todos os campos', true);

    const users = this.getUsers();
    const user = users.find(u =>
      u.username.toLowerCase() === input.toLowerCase() ||
      u.email.toLowerCase() === input.toLowerCase()
    );
    if (!user) return this.msg('loginMsg', 'Usuário não encontrado', true);
    if (user.passwordHash !== this.hashPass(pass)) return this.msg('loginMsg', 'Senha incorreta', true);

    this._setSession(user);
    // Sync wallet/xp from missions into user record
    this._syncMissionsToUser(user);
    this.msg('loginMsg', '✅ Bem-vindo!', false);
    setTimeout(() => this.renderProfile(), 400);

    // Try backend login too (silent)
    this._tryBackendLogin(input, pass);
  },

  _setSession(user) {
    const safe = { ...user };
    delete safe.passwordHash;
    localStorage.setItem('cp_currentUser', JSON.stringify(safe));
    localStorage.setItem('cp_token', 'local_' + user.id);
    localStorage.setItem('cp_user', JSON.stringify(safe));
  },

  _syncMissionsToUser(user) {
    const ms = (() => { try { return JSON.parse(localStorage.getItem('cp_missions') || '{}'); } catch { return {}; } })();
    if (ms.xp || ms.wallet) {
      const users = this.getUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx >= 0) {
        users[idx].xp     = Math.max(users[idx].xp    || 0, ms.xp    || 0);
        users[idx].wallet = Math.max(users[idx].wallet || 0, ms.wallet || 1000);
        users[idx].level  = 1 + Math.floor(users[idx].xp / XP_PER_LVL);
        this.saveUsers(users);
        this._setSession(users[idx]);
      }
    }
  },

  async _tryBackendRegister(username, email, pass, avatar) {
    try { await API.register(username, email, pass, avatar); } catch {}
  },
  async _tryBackendLogin(input, pass) {
    try { const r = await API.login(input, pass); if (r.token) localStorage.setItem('cp_token_server', r.token); } catch {}
  },

  logout() {
    localStorage.removeItem('cp_currentUser');
    localStorage.removeItem('cp_token');
    localStorage.removeItem('cp_user');
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('profileSection').classList.add('hidden');
  },

  // ── Profile render ──────────────────────────────────────────
  async renderProfile() {
    let u = (() => { try { return JSON.parse(localStorage.getItem('cp_currentUser') || 'null'); } catch { return null; } })();
    if (!u) return;

    // Sync rewards into profile
    const ms = (() => { try { return JSON.parse(localStorage.getItem('cp_missions') || '{}'); } catch { return {}; } })();
    const walletState = parseFloat(localStorage.getItem('cp_wallet') || '0');
    if (ms.xp    > (u.xp    || 0)) u.xp    = ms.xp;
    const bestWallet = Math.max(ms.wallet || 0, walletState, u.wallet || 1000);
    u.wallet = bestWallet;
    u.level = 1 + Math.floor((u.xp || 0) / XP_PER_LVL);

    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('profileSection').classList.remove('hidden');

    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('profAvatar',   u.avatar || '👤');
    set('profUsername', u.username);
    set('profEmail',    u.email);
    set('profWallet',   'R$ ' + Number(u.wallet || 1000).toFixed(2));
    set('profLevel',    u.level || 1);
    set('profXP',       u.xp || 0);
    const since = u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '—';
    set('profDate', since);

    // XP bar
    const xpInLvl = (u.xp || 0) % XP_PER_LVL;
    const fill = document.getElementById('profXPFill');
    const prog = document.getElementById('profXPProgress');
    if (fill) fill.style.width = (xpInLvl / XP_PER_LVL * 100) + '%';
    if (prog) prog.textContent = `${xpInLvl} / ${XP_PER_LVL} XP para nível ${u.level + 1}`;

    // Load apps from localStorage
    this._loadLocalApps();
    this._loadLocalTools();
    this._loadMissionsLog();
  },

  _loadLocalApps() {
    const apps = (() => { try { return JSON.parse(localStorage.getItem('cp_apps') || '[]'); } catch { return []; } })();
    const u = JSON.parse(localStorage.getItem('cp_currentUser') || 'null');
    // show all apps (local store doesn't have owner_id yet)
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('profApps', apps.length);
    const grid  = document.getElementById('cloudAppsGrid');
    const empty = document.getElementById('cloudAppsEmpty');
    if (!apps.length) {
      if (grid) grid.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');
    if (grid) grid.innerHTML = apps.map((a, i) => `
      <div class="app-card">
        <div class="app-card__logo" style="background:${(a.logo&&a.logo.color)||a.color||'#7c3aed'}20;border:1px solid ${(a.logo&&a.logo.color)||a.color||'#7c3aed'}40">${(a.logo&&a.logo.emoji)||a.emoji||'✨'}</div>
        <div class="app-card__name">${a.name}</div>
        <div class="app-card__desc">${a.description || ''}</div>
        <div class="app-card__meta">
          <span>${a.price === 0 ? 'Grátis' : 'R$ ' + Number(a.price || 0).toFixed(2)}</span>
          <span>${a.category || 'App'}</span>
          <span>⬇️ ${a.downloads || 0}</span>
        </div>
        <button class="btn btn--sm btn--danger-outline" onclick="Account._deleteApp(${i})">🗑️</button>
      </div>`).join('');
  },

  _deleteApp(idx) {
    const apps = (() => { try { return JSON.parse(localStorage.getItem('cp_apps') || '[]'); } catch { return []; } })();
    if (!confirm('Deletar "' + (apps[idx]?.name || 'app') + '"?')) return;
    apps.splice(idx, 1);
    localStorage.setItem('cp_apps', JSON.stringify(apps));
    localStorage.setItem('cp_last_app_created', Date.now()); // re-trigger signal
    this._loadLocalApps();
  },

  _loadLocalTools() {
    const tools = (() => { try { return JSON.parse(localStorage.getItem('cp_hack_tools') || '[]'); } catch { return []; } })();
    const grid  = document.getElementById('cloudToolsGrid');
    const empty = document.getElementById('cloudToolsEmpty');
    if (!tools.length) {
      if (grid) grid.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');
    if (grid) grid.innerHTML = tools.map(t => `
      <div class="hack-tool-card">
        <div class="hack-tool-card__name">${t.emoji || '☠️'} ${t.name}</div>
        <div class="hack-tool-card__type">${t.type} · Poder: ${t.power}/100</div>
        <div class="power-bar"><div class="power-bar__fill" style="width:${t.power}%"></div></div>
      </div>`).join('');
  },

  _loadMissionsLog() {
    const ms = (() => { try { return JSON.parse(localStorage.getItem('cp_missions') || '{}'); } catch { return {}; } })();
    const done = (ms.completed || []).slice(0, 8);
    const el = document.getElementById('missionLogList');
    if (!el) return;
    if (!done.length) { el.innerHTML = '<p class="text-muted" style="font-size:.85rem">Nenhuma missão concluída ainda.</p>'; return; }
    el.innerHTML = done.map(m => `
      <div class="miss-row-mini">
        <span>${m.icon}</span>
        <span style="flex:1;font-size:.82rem;font-weight:600">${m.title}</span>
        <span class="reward-xp" style="font-size:.75rem">+${m.earnedXP} XP</span>
        <span class="reward-money" style="font-size:.75rem">+R$ ${(m.earnedMoney || 0).toFixed(2)}</span>
      </div>`).join('');
  },

  saveApiUrl() {
    const url = document.getElementById('apiUrlInput')?.value.trim();
    if (url) localStorage.setItem('cp_api_url', url);
    else localStorage.removeItem('cp_api_url');
    const s = document.getElementById('apiStatus');
    if (s) { s.textContent = '✅ Salvo!'; setTimeout(() => s.textContent = '', 2000); }
  },

  async checkConnection() {
    const status = document.getElementById('apiStatus');
    if (!status) return;
    try {
      const r = await fetch(API.BASE + '/health', { signal: AbortSignal.timeout(4000) });
      const d = await r.json();
      status.textContent = d.status === 'ok' ? '🟢 API conectada' : '🔴 Erro';
    } catch {
      status.textContent = '🔴 API offline (modo local ativo)';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('cp_api_url');
  if (saved) { const el = document.getElementById('apiUrlInput'); if (el) el.value = saved; }
  Account.checkConnection();

  document.querySelectorAll('.avatar-opt').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.avatar-opt').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      Account.selectedAvatar = el.dataset.v;
    });
  });

  ['loginPass', 'loginUser'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => { if (e.key === 'Enter') Account.login(); });
  });
  ['regPass'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => { if (e.key === 'Enter') Account.register(); });
  });

  // Auto-show profile if already logged in
  const u = localStorage.getItem('cp_currentUser');
  if (u) { try { JSON.parse(u); Account.renderProfile(); } catch {} }
});
