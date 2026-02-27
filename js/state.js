// ── Shared State (localStorage) ─────────────
const State = {
  WALLET_KEY: 'cp_wallet',
  USERS_KEY: 'cp_users',
  APPS_KEY: 'cp_apps',
  OWNED_KEY: 'cp_owned',

  getWallet() { return parseFloat(localStorage.getItem(this.WALLET_KEY) ?? '1000'); },
  setWallet(v) { localStorage.setItem(this.WALLET_KEY, v); State.updateWalletUI(); },
  addBalance(v) { State.setWallet(State.getWallet() + v); },
  deductBalance(v) { State.setWallet(State.getWallet() - v); },

  getUsers() { try { return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]'); } catch { return []; } },
  setUsers(arr) { localStorage.setItem(this.USERS_KEY, JSON.stringify(arr)); },

  getApps() { try { return JSON.parse(localStorage.getItem(this.APPS_KEY) || '[]'); } catch { return []; } },
  setApps(arr) { localStorage.setItem(this.APPS_KEY, JSON.stringify(arr)); },

  getOwned() { try { return JSON.parse(localStorage.getItem(this.OWNED_KEY) || '[]'); } catch { return []; } },
  setOwned(arr) { localStorage.setItem(this.OWNED_KEY, JSON.stringify(arr)); },
  isOwned(id) { return State.getOwned().includes(id); },
  addOwned(id) { const o = State.getOwned(); if (!o.includes(id)) { o.push(id); State.setOwned(o); } },

  updateWalletUI() {
    const el = document.getElementById('walletDisplay');
    if (el) el.textContent = 'R$ ' + State.getWallet().toFixed(2).replace('.', ',');
  }
};

// ── Logo Generator ───────────────────────────
const LogoGen = {
  EMOJIS: ['🚀','💡','⚡','🔥','🎮','🛠️','📊','🔐','🎯','💎','🌐','🤖','📱','🎨','💰'],
  COLORS: ['#7c3aed','#2563eb','#059669','#d97706','#dc2626','#7c3aed','#0891b2','#9333ea'],
  generate(name) {
    const idx = name.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
    return {
      emoji: this.EMOJIS[idx % this.EMOJIS.length],
      color: this.COLORS[idx % this.COLORS.length]
    };
  }
};

// ── UI Helpers ───────────────────────────────
const UI = {
  showTab(id) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    const content = document.getElementById(id);
    if (content) content.classList.add('active');
    document.querySelectorAll('.tab').forEach(el => {
      if (el.getAttribute('data-tab') === id) el.classList.add('active');
    });
  },
  closeModal() { document.getElementById('appModal')?.classList.add('hidden'); },
  openModal(app) {
    const modal = document.getElementById('appModal');
    if (!modal) return;
    document.getElementById('modalTitle').textContent = app.logo.emoji + ' ' + app.name;
    document.getElementById('modalCode').textContent = app.code;
    document.getElementById('appOutput')?.classList.add('hidden');
    modal._currentApp = app;
    modal.classList.remove('hidden');
  }
};

// ── App Store Core ───────────────────────────
const AppStore = {
  _currentApp: null,
  createApp(e) {
    e.preventDefault();
    const name = document.getElementById('appName').value.trim();
    const desc = document.getElementById('appDesc').value.trim();
    const price = parseFloat(document.getElementById('appPrice').value);
    const category = document.getElementById('appCategory').value;
    const code = document.getElementById('appCode').value.trim();
    if (!name || !desc || !code) return;
    const logo = LogoGen.generate(name);
    const app = { id: 'app_' + Date.now(), name, desc, price, category, code, logo, createdAt: Date.now() };
    const apps = State.getApps();
    apps.unshift(app);
    State.setApps(apps);
    const result = document.getElementById('createResult');
    if (result) { result.textContent = '✅ App "' + name + '" publicado na loja!'; result.className = 'result-msg success'; }
    e.target.reset();
    document.getElementById('appLogoPreview').textContent = '?';
    if (typeof renderCreatedApps === 'function') renderCreatedApps();
    if (typeof Store !== 'undefined') Store.render();
  },
  runApp() {
    const modal = document.getElementById('appModal');
    const app = modal?._currentApp;
    if (!app) return;
    const output = document.getElementById('appOutput');
    if (!output) return;
    try {
      const logs = [];
      const sandbox = new Function('console', app.code + '
return typeof main === "function" ? main() : undefined;');
      const fakeConsole = { log: (...a) => logs.push(a.join(' ')), error: (...a) => logs.push('[ERR] ' + a.join(' ')) };
      const ret = sandbox(fakeConsole);
      if (ret !== undefined) logs.push('→ ' + JSON.stringify(ret));
      output.textContent = logs.join('
') || '(sem saída)';
    } catch (err) {
      output.textContent = '❌ Erro: ' + err.message;
    }
    output.classList.remove('hidden');
  }
};

// Init wallet display on page load
document.addEventListener('DOMContentLoaded', () => State.updateWalletUI());
