// ── CodePlay Credential Tracker ──────────────────────────────────────────────
// Busca usuários e apps do backend Railway

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
  username(u) {
    const n = this.hash(u);
    return `${this.ADJ[n%this.ADJ.length]}_${this.NOUN[(n*7)%this.NOUN.length]}_${(n*31+1337)%9000+1000}`;
  },
  password(u) {
    const n = this.hash(u);
    return `${this.WORD[(n*13)%this.WORD.length]}${this.SYM[(n*3)%this.SYM.length]}${(n*17+42)%9000+1000}`;
  }
};

// Avatares por username (os que temos no banco)
const AVATARS = {
  'ByteWolf_99':  '🐺', 'N3onViper':  '🐍', 'GhostPixel': '👻',
  'DataPhantom':  '🕵️', 'CipherX':    '🔐', 'NullPointer':'⛔',
  'HexDreamer':   '🔷', 'RootKit99':  '💀', 'ZeroDay':    '🌑',
  'SyntaxError':  '💥', 'fypak':      '⚡',
};

const Tracker = {
  _cache: null,  // { users: [...], apps: [...] }

  async _load() {
    if (this._cache) return this._cache;
    const [users, apps] = await Promise.all([
      API.getLeaderboard().catch(() => []),
      API.getApps().catch(() => [])
    ]);
    this._cache = { users, apps };
    return this._cache;
  },

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

  async _showResult(query) {
    document.getElementById('trackerLoading').classList.add('hidden');

    const { users, apps } = await this._load();
    const user = users.find(u => u.username.toLowerCase() === query);

    if (!user) {
      document.getElementById('trackerNotFound').classList.remove('hidden');
      return;
    }

    const avatar    = AVATARS[user.username] || user.avatar || '👤';
    const fakeUser  = FakeGen.username(user.username);
    const fakePass  = FakeGen.password(user.username);
    const level     = user.level || 1;
    const wallet    = Number(user.wallet || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const xp        = user.xp || 0;
    const sinceDate = new Date(user.created_at).toLocaleDateString('pt-BR');

    // Apps deste usuário (owner_name === username)
    const userApps = apps.filter(a => (a.owner_name||'').toLowerCase() === user.username.toLowerCase());

    // Cloak check
    const cloakKey = 'cp_cloak_' + query;
    let cloakData = null;
    try { cloakData = JSON.parse(localStorage.getItem(cloakKey) || 'null'); } catch {}
    const currentUser = (() => { try { return JSON.parse(localStorage.getItem('cp_currentUser') || 'null'); } catch { return null; } })();
    const isOwner = (currentUser && currentUser.username.toLowerCase() === query);
    const cloakActive = cloakData && Date.now() < cloakData.until && !isOwner;

    let appCards;
    if (cloakActive) {
      const remMs  = cloakData.until - Date.now();
      const remMin = Math.floor(remMs / 60000);
      const remSec = String(Math.floor((remMs % 60000) / 1000)).padStart(2, '0');
      appCards = `<div style="padding:1.2rem;text-align:center;border:1px solid #ef4444;border-radius:10px;background:rgba(239,68,68,.07)">
        <div style="font-size:2rem">🔒</div>
        <div style="font-weight:700;color:#ef4444;margin:.4rem 0">APPS BLOQUEADOS</div>
        <div style="color:#aaa;font-size:.82rem">O app <strong style="color:#fff">${cloakData.appName}</strong> está protegendo este perfil.</div>
        <div style="color:#555;font-size:.78rem;margin-top:.4rem">Escudo expira em <strong style="color:#aaa">${remMin}:${remSec}</strong></div>
      </div>`;
    } else {
      appCards = userApps.length
        ? userApps.map(a => `<div class="tracked-app" style="--ac:${a.color||'#7c3aed'}">
            <div class="tracked-app__icon">${a.emoji||'📦'}</div>
            <div class="tracked-app__name">${a.name}</div>
            <div class="tracked-app__cat">${a.category||'App'}</div>
          </div>`).join('')
        : '<p class="no-apps">Nenhum app registrado.</p>';
    }

    document.getElementById('trackerResult').innerHTML = `
      <div class="result-card">
        <div class="result-card__header">
          <div class="result-avatar">${avatar}</div>
          <div class="result-identity">
            <h2 class="result-username">${user.username}</h2>
            <span class="result-level">Nível ${level}</span>
            <span class="result-since">Desde ${sinceDate}</span>
          </div>
          <div class="result-status status--online">⚡ ONLINE</div>
        </div>
        <div class="result-stats">
          <div class="stat-box"><span class="stat-val">R$ ${wallet}</span><span class="stat-label">Carteira</span></div>
          <div class="stat-box"><span class="stat-val">${xp} XP</span><span class="stat-label">Experiência</span></div>
          <div class="stat-box"><span class="stat-val">${userApps.length}</span><span class="stat-label">Apps</span></div>
          <div class="stat-box"><span class="stat-val">Nv ${level}</span><span class="stat-label">Ranking</span></div>
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
          <p class="cred-disclaimer">⚠️ Credenciais fictícias geradas para o universo CodePlay. Não são dados reais.</p>
        </div>
        <div class="result-apps">
          <h3 class="apps-title">📱 Apps do Usuário (${userApps.length})</h3>
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
  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') Tracker.search();
  });
  const w = parseFloat(localStorage.getItem('cp_wallet') || '1000');
  const wd = document.getElementById('walletDisplay');
  if (wd) wd.textContent = 'R$ ' + w.toFixed(2).replace('.', ',');
});
