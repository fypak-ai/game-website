// ── CodePlay Credential Tracker ────────────────────────────────────────────────────────────────────────────────────────────────────────────
// Fictional hacker-style credential lookup for registered users

// ── Fictional credential generator (deterministic by username) ──
const FakeGen = {
  ADJ:  ['dark','cyber','neon','ghost','toxic','void','phantom','rogue','shadow','steel',
         'nova','hyper','ultra','mega','alpha','zero','ice','fire','pixel','data'],
  NOUN: ['wolf','viper','hawk','cipher','ghost','blade','nexus','core','byte','unit',
         'storm','pulse','node','forge','code','droid','bot','net','sys','hack'],
  WORD: ['matrix','cobra','titan','storm','nexus','omega','viper','delta','sigma','alpha',
         'blade','forge','cyber','ghost','pixel'],
  SYM:  ['@','#','!','$'],

  hash(str) {
    return str.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  },

  username(realUser) {
    const n = this.hash(realUser);
    return `${this.ADJ[n % this.ADJ.length]}_${this.NOUN[(n*7)%this.NOUN.length]}_${(n*31+1337)%9000+1000}`;
  },

  password(realUser) {
    const n = this.hash(realUser);
    return `${this.WORD[(n*13)%this.WORD.length]}${this.SYM[(n*3)%this.SYM.length]}${(n*17+42)%9000+1000}`;
  }
};

// ── 10 NPC / seed users (must match FAKE_USERS in chat.js) ─────────────────
const SEED_USERS = [
  {
    id: 'u_sample_1',
    username: 'ByteWolf_99',
    email: 'bytewolf@codeplay.fake',
    passwordHash: '######',
    avatar: '🐺',
    wallet: 4200, xp: 1850, level: 4,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    fakeUsername: FakeGen.username('ByteWolf_99'),
    fakePassword: FakeGen.password('ByteWolf_99'),
    apps: [
      { name: 'WolfTracker', logo: { emoji: '🐺', color: '#7c3aed' }, category: 'IA' },
      { name: 'DarkCalc',    logo: { emoji: '🧮', color: '#2563eb' }, category: 'Utilitário' },
      { name: 'ByteVault',   logo: { emoji: '🔐', color: '#dc2626' }, category: 'Segurança' },
    ],
    missions_done: 12,
  },
  {
    id: 'u_sample_2',
    username: 'N3onViper',
    email: 'neonviper@codeplay.fake',
    passwordHash: '######',
    avatar: '🐍',
    wallet: 1800, xp: 720, level: 2,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    fakeUsername: FakeGen.username('N3onViper'),
    fakePassword: FakeGen.password('N3onViper'),
    apps: [
      { name: 'ViperScan', logo: { emoji: '🐍', color: '#16a34a' }, category: 'Segurança' },
      { name: 'NeonGrid',  logo: { emoji: '🟩', color: '#0d9488' }, category: 'Redes' },
    ],
    missions_done: 5,
  },
  {
    id: 'u_sample_3',
    username: 'GhostPixel',
    email: 'ghostpixel@codeplay.fake',
    passwordHash: '######',
    avatar: '👻',
    wallet: 9100, xp: 4400, level: 7,
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    fakeUsername: FakeGen.username('GhostPixel'),
    fakePassword: FakeGen.password('GhostPixel'),
    apps: [
      { name: 'GhostEdit',  logo: { emoji: '👻', color: '#6366f1' }, category: 'Mídia' },
      { name: 'GhostChat',  logo: { emoji: '💀', color: '#1f2937' }, category: 'Social' },
      { name: 'ShadowDB',   logo: { emoji: '🗄️', color: '#7c3aed' }, category: 'Banco de Dados' },
      { name: 'PixelForge', logo: { emoji: '🎨', color: '#0891b2' }, category: 'Criativo' },
    ],
    missions_done: 27,
  },
  {
    id: 'u_sample_4',
    username: 'DataPhantom',
    email: 'dataphantom@codeplay.fake',
    passwordHash: '######',
    avatar: '🕵️',
    wallet: 6600, xp: 3100, level: 6,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    fakeUsername: FakeGen.username('DataPhantom'),
    fakePassword: FakeGen.password('DataPhantom'),
    apps: [
      { name: 'PhantomOS',   logo: { emoji: '🕵️', color: '#374151' }, category: 'Sistema' },
      { name: 'DataBender',  logo: { emoji: '💾', color: '#b45309' }, category: 'IA' },
      { name: 'CryptoVault', logo: { emoji: '🔒', color: '#7c3aed' }, category: 'Segurança' },
    ],
    missions_done: 19,
  },
  {
    id: 'u_sample_5',
    username: 'CipherX',
    email: 'cipherx@codeplay.fake',
    passwordHash: '######',
    avatar: '🔐',
    wallet: 3300, xp: 1200, level: 3,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    fakeUsername: FakeGen.username('CipherX'),
    fakePassword: FakeGen.password('CipherX'),
    apps: [
      { name: 'CryptoVault', logo: { emoji: '🔒', color: '#7c3aed' }, category: 'Segurança' },
      { name: 'NetSpy',      logo: { emoji: '🕸️', color: '#1e3a5f' }, category: 'Redes' },
    ],
    missions_done: 8,
  },
  {
    id: 'u_sample_6',
    username: 'NullByte_7',
    email: 'nullbyte7@codeplay.fake',
    passwordHash: '######',
    avatar: '⛔',
    wallet: 2100, xp: 950, level: 2,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    fakeUsername: FakeGen.username('NullByte_7'),
    fakePassword: FakeGen.password('NullByte_7'),
    apps: [
      { name: 'BotMaster', logo: { emoji: '🤖', color: '#374151' }, category: 'Automação' },
      { name: 'ZeroShell', logo: { emoji: '⛔', color: '#dc2626' }, category: 'Sistema' },
    ],
    missions_done: 6,
  },
  {
    id: 'u_sample_7',
    username: 'QuantumDev',
    email: 'quantumdev@codeplay.fake',
    passwordHash: '######',
    avatar: '⚛️',
    wallet: 7800, xp: 3800, level: 7,
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    fakeUsername: FakeGen.username('QuantumDev'),
    fakePassword: FakeGen.password('QuantumDev'),
    apps: [
      { name: 'GridBreaker', logo: { emoji: '⚛️', color: '#0d9488' }, category: 'Científico' },
      { name: 'CloudRider',  logo: { emoji: '☁️', color: '#2563eb' }, category: 'Nuvem' },
      { name: 'NeoLauncher', logo: { emoji: '🚀', color: '#7c3aed' }, category: 'Utilitário' },
    ],
    missions_done: 22,
  },
  {
    id: 'u_sample_8',
    username: 'PixelHunter',
    email: 'pixelhunter@codeplay.fake',
    passwordHash: '######',
    avatar: '🎯',
    wallet: 4500, xp: 2000, level: 4,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    fakeUsername: FakeGen.username('PixelHunter'),
    fakePassword: FakeGen.password('PixelHunter'),
    apps: [
      { name: 'MegaCalc Pro', logo: { emoji: '🧮', color: '#f59e0b' }, category: 'Utilitário' },
      { name: 'PixelForge',   logo: { emoji: '🎨', color: '#0891b2' }, category: 'Criativo' },
    ],
    missions_done: 14,
  },
  {
    id: 'u_sample_9',
    username: 'DarkCode',
    email: 'darkcode@codeplay.fake',
    passwordHash: '######',
    avatar: '🌑',
    wallet: 5200, xp: 2500, level: 5,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    fakeUsername: FakeGen.username('DarkCode'),
    fakePassword: FakeGen.password('DarkCode'),
    apps: [
      { name: 'ShadowCrawler', logo: { emoji: '🌑', color: '#111827' }, category: 'Segurança' },
      { name: 'DataBender',    logo: { emoji: '💾', color: '#b45309' }, category: 'IA' },
      { name: 'NetSpy',        logo: { emoji: '🕸️', color: '#1e3a5f' }, category: 'Redes' },
    ],
    missions_done: 17,
  },
  {
    id: 'u_sample_10',
    username: 'SyntaxError',
    email: 'syntaxerror@codeplay.fake',
    passwordHash: '######',
    avatar: '💥',
    wallet: 1500, xp: 600, level: 1,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    fakeUsername: FakeGen.username('SyntaxError'),
    fakePassword: FakeGen.password('SyntaxError'),
    apps: [
      { name: 'BruteShield', logo: { emoji: '🛡️', color: '#dc2626' }, category: 'Segurança' },
    ],
    missions_done: 2,
  },
];

function seedSampleUsers() {
  const KEY = 'cp_registered_users';
  const KEY_SEEDED = 'cp_tracker_seeded_v2';
  if (localStorage.getItem(KEY_SEEDED)) return;
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || '[]');
    const merged = [...existing];
    SEED_USERS.forEach(su => {
      if (!merged.find(u => u.username.toLowerCase() === su.username.toLowerCase())) {
        merged.push(su);
      }
    });
    localStorage.setItem(KEY, JSON.stringify(merged));
    localStorage.setItem(KEY_SEEDED, '1');
  } catch {}
}

// ── Tracker logic ───────────────────────────────────────────
const Tracker = {
  quickSearch(name) {
    document.getElementById('searchInput').value = name;
    this.search();
  },

  search() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!query) return;

    document.getElementById('trackerResult').classList.add('hidden');
    document.getElementById('trackerNotFound').classList.add('hidden');
    document.getElementById('trackerLoading').classList.remove('hidden');

    this._runScanAnimation(query);
  },

  _runScanAnimation(query) {
    const steps = [
      '🔎 Iniciando varredura global...',
      '📡 Conectando ao servidor CodePlay...',
      '🔓 Bypass de firewall...',
      '🗂️ Acessando banco de dados de usuários...',
      '🔍 Localizando perfil: ' + query + '...',
      '🔑 Descriptografando credenciais...',
      '✅ Dados encontrados!',
    ];
    const logEl = document.getElementById('scanLog');
    const txtEl = document.getElementById('scanText');
    logEl.innerHTML = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => this._showResult(query), 300);
        return;
      }
      txtEl.textContent = steps[i];
      const line = document.createElement('div');
      line.className = 'scan-line';
      line.textContent = steps[i];
      logEl.appendChild(line);
      logEl.scrollTop = logEl.scrollHeight;
      i++;
    }, 350);
  },

  _getUsers() {
    try { return JSON.parse(localStorage.getItem('cp_registered_users') || '[]'); } catch { return []; }
  },

  _getApps() {
    try { return JSON.parse(localStorage.getItem('cp_apps') || '[]'); } catch { return []; }
  },

  _getOwned() {
    try { return JSON.parse(localStorage.getItem('cp_owned') || '[]'); } catch { return []; }
  },

  _showResult(query) {
    document.getElementById('trackerLoading').classList.add('hidden');
    const users = this._getUsers();
    const user  = users.find(u => u.username.toLowerCase() === query);

    if (!user) {
      document.getElementById('trackerNotFound').classList.remove('hidden');
      return;
    }

    // Generate fake creds if not already stored
    const fakeUser = user.fakeUsername || FakeGen.username(user.username);
    const fakePass = user.fakePassword || FakeGen.password(user.username);

    // Get apps for this user (current session apps if it's the logged-in user)
    let apps = user.apps || [];
    const currentUser = (() => { try { return JSON.parse(localStorage.getItem('cp_currentUser') || 'null'); } catch { return null; } })();
    if (currentUser && currentUser.username.toLowerCase() === query) {
      const myApps  = this._getApps();
      const myOwned = this._getOwned();
      apps = [...myApps, ...myOwned].filter((a, i, arr) => arr.findIndex(b => b.id === a.id || b.name === a.name) === i);
    }

    const level = user.level || (1 + Math.floor((user.xp || 0) / 500));
    const wallet = parseFloat(localStorage.getItem('cp_wallet') || user.wallet || 1000);
    const displayWallet = (currentUser && currentUser.username.toLowerCase() === query) ? wallet : (user.wallet || 1000);

    // ── Cloak check — is the searched user hiding their apps? ──
    const cloakKey = 'cp_cloak_' + query; // query is already lowercased
    let cloakData = null;
    try { cloakData = JSON.parse(localStorage.getItem(cloakKey) || 'null'); } catch {}
    const isOwner = (currentUser && currentUser.username.toLowerCase() === query);
    const cloakActive = cloakData && Date.now() < cloakData.until && !isOwner;

    let appCards;
    if (cloakActive) {
      const remMs = cloakData.until - Date.now();
      const remMin = Math.floor(remMs / 60000);
      const remSec = String(Math.floor((remMs % 60000) / 1000)).padStart(2, '0');
      appCards = `<div style="padding:1.2rem;text-align:center;border:1px solid #ef4444;border-radius:10px;background:rgba(239,68,68,.07)">
        <div style="font-size:2rem">🔒</div>
        <div style="font-weight:700;color:#ef4444;margin:.4rem 0">APPS BLOQUEADOS</div>
        <div style="color:#aaa;font-size:.82rem">O app <strong style="color:#fff">${cloakData.appName}</strong> está protegendo este perfil.</div>
        <div style="color:#555;font-size:.78rem;margin-top:.4rem">Escudo expira em <strong style="color:#aaa">${remMin}:${remSec}</strong></div>
      </div>`;
    } else {
      appCards = apps.length
        ? apps.map(a => {
            const emoji = (a.logo && a.logo.emoji) || a.emoji || '✨';
            const color = (a.logo && a.logo.color) || a.color || '#7c3aed';
            return `<div class="tracked-app" style="--ac:${color}">
              <div class="tracked-app__icon">${emoji}</div>
              <div class="tracked-app__name">${a.name}</div>
              <div class="tracked-app__cat">${a.category || 'App'}</div>
            </div>`;
          }).join('')
        : '<p class="no-apps">Nenhum app registrado.</p>';
    }

    const sinceDate = new Date(user.created_at).toLocaleDateString('pt-BR');

    document.getElementById('trackerResult').innerHTML = `
      <div class="result-card">
        <div class="result-card__header">
          <div class="result-avatar">${user.avatar || '👤'}</div>
          <div class="result-identity">
            <h2 class="result-username">${user.username}</h2>
            <span class="result-level">Nível ${level}</span>
            <span class="result-since">Desde ${sinceDate}</span>
          </div>
          <div class="result-status status--online">⚡ ONLINE</div>
        </div>

        <div class="result-stats">
          <div class="stat-box">
            <span class="stat-val">R$ ${displayWallet.toFixed(2).replace('.',',')}</span>
            <span class="stat-label">Carteira</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">${user.xp || 0} XP</span>
            <span class="stat-label">Experiência</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">${apps.length}</span>
            <span class="stat-label">Apps</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">${user.missions_done || 0}</span>
            <span class="stat-label">Missões</span>
          </div>
        </div>

        <div class="result-credentials">
          <div class="cred-header">
            <span class="cred-icon">🔑</span>
            <h3>Credenciais Fictícias do Sistema</h3>
            <span class="cred-badge">DECRIPTADO</span>
          </div>
          <div class="cred-row">
            <span class="cred-field">Login Fictício</span>
            <span class="cred-value" id="fakeUserVal">${fakeUser}</span>
            <button class="copy-btn" onclick="Tracker.copy('fakeUserVal')">📋</button>
          </div>
          <div class="cred-row">
            <span class="cred-field">Senha Fictícia</span>
            <span class="cred-value" id="fakePassVal">${fakePass}</span>
            <button class="copy-btn" onclick="Tracker.copy('fakePassVal')">📋</button>
          </div>
          <div class="cred-row">
            <span class="cred-field">E-mail</span>
            <span class="cred-value">${user.email}</span>
          </div>
          <p class="cred-disclaimer">⚠️ Credenciais fictícias geradas para o universo CodePlay. Não são dados reais.</p>
        </div>

        <div class="result-apps">
          <h3 class="apps-title">📱 Apps do Usuário (${apps.length})</h3>
          <div class="tracked-apps-grid">${appCards}</div>
        </div>
      </div>
    `;

    document.getElementById('trackerResult').classList.remove('hidden');
  },

  copy(elId) {
    const val = document.getElementById(elId)?.textContent;
    if (!val) return;
    navigator.clipboard.writeText(val).catch(() => {});
    const btn = document.querySelector(`[onclick="Tracker.copy('${elId}')"]`);
    if (btn) { btn.textContent = '✅'; setTimeout(() => btn.textContent = '📋', 1500); }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  seedSampleUsers();
  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') Tracker.search();
  });
  // Update wallet display
  const w = parseFloat(localStorage.getItem('cp_wallet') || '1000');
  const wd = document.getElementById('walletDisplay');
  if (wd) wd.textContent = 'R$ ' + w.toFixed(2).replace('.', ',');
});
