// ── Database Module ───────────────────────────────────────────
// Lê usuários do backend Railway; cp_users (localStorage) continua
// sendo usado apenas para a tabela interna fictícia de "Banco de Dados"

const DB = {
  addUser(e) {
    e.preventDefault();
    const name  = document.getElementById('userName').value.trim();
    const login = document.getElementById('userLogin').value.trim();
    const pass  = document.getElementById('userPass').value;
    const email = document.getElementById('userEmail').value.trim();
    const users = State.getUsers();
    if (users.find(u => u.login === login)) {
      alert('Login "' + login + '" já existe! Escolha outro.'); return;
    }
    const user = { id: 'u_' + Date.now(), name, login, pass, email, createdAt: Date.now() };
    users.push(user);
    localStorage.setItem('cp_last_db_user', Date.now());
    State.setUsers(users);
    DB.renderTable(users);
    DB.renderJSON(users);
    e.target.reset();
  },
  clearUsers() {
    if (!confirm('Apagar todos os usuários?')) return;
    State.setUsers([]);
    DB.renderTable([]);
    DB.renderJSON([]);
  },
  searchUsers(q) {
    const users = State.getUsers();
    const filtered = q ? users.filter(u =>
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.login.toLowerCase().includes(q.toLowerCase()) ||
      (u.email||'').toLowerCase().includes(q.toLowerCase())
    ) : users;
    DB.renderTable(filtered);
  },
  renderTable(users) {
    const tbody = document.getElementById('userTableBody');
    const empty = document.getElementById('userEmpty');
    if (!tbody) return;
    if (!users.length) { tbody.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
    if (empty) empty.style.display = 'none';
    tbody.innerHTML = users.map((u, i) => `<tr>
      <td>#${i+1}</td>
      <td>${u.name}</td>
      <td><code>${u.login}</code></td>
      <td><div class="pass-cell"><span id="pass_${u.id}">••••••</span><button class="pass-toggle" onclick="DB.togglePass('${u.id}','${u.pass}')">👁</button></div></td>
      <td>${u.email || '—'}</td>
      <td><button class="btn btn--sm btn--danger" onclick="DB.deleteUser('${u.id}')">🗑</button></td>
    </tr>`).join('');
  },
  togglePass(id, pass) {
    const el = document.getElementById('pass_' + id);
    if (!el) return;
    el.textContent = el.textContent === '••••••' ? pass : '••••••';
  },
  deleteUser(id) {
    const users = State.getUsers().filter(u => u.id !== id);
    State.setUsers(users);
    DB.renderTable(users);
    DB.renderJSON(users);
  },
  renderJSON(users) {
    const el = document.getElementById('jsonView');
    if (el) el.textContent = JSON.stringify(users, null, 2);
  },
  copyJSON() {
    const users = State.getUsers();
    navigator.clipboard.writeText(JSON.stringify(users, null, 2)).then(() => alert('JSON copiado!'));
  },

  // ── Simulate Login — agora busca do banco ─────────────────
  async simulateLogin(e) {
    e.preventDefault();
    const query  = document.getElementById('simLogin').value.trim().toLowerCase();
    const pass   = document.getElementById('simPass').value.trim();
    const result = document.getElementById('loginResult');

    const _h    = s => s.split('').reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
    const _adj  = ['dark','cyber','neon','ghost','toxic','void','phantom','rogue','shadow','steel','nova','hyper','ultra','mega','alpha','zero','ice','fire','pixel','data'];
    const _noun = ['wolf','viper','hawk','cipher','ghost','blade','nexus','core','byte','unit','storm','pulse','node','forge','code','droid','bot','net','sys','hack'];
    const _word = ['matrix','cobra','titan','storm','nexus','omega','viper','delta','sigma','alpha','blade','forge','cyber','ghost','pixel'];
    const _sym  = ['@','#','!','$'];
    const fakeUser = u => { const n=_h(u); return `${_adj[n%_adj.length]}_${_noun[(n*7)%_noun.length]}_${(n*31+1337)%9000+1000}`; };
    const fakePass = u => { const n=_h(u); return `${_word[(n*13)%_word.length]}${_sym[(n*3)%_sym.length]}${(n*17+42)%9000+1000}`; };

    const AVATARS = {
      'ByteWolf_99':'🐺','N3onViper':'🐍','GhostPixel':'👻','DataPhantom':'🕵️',
      'CipherX':'🔐','NullPointer':'⛔','HexDreamer':'🔷','RootKit99':'💀',
      'ZeroDay':'🌑','SyntaxError':'💥','fypak':'⚡'
    };

    let allUsers = [];
    try {
      allUsers = await API.getLeaderboard();
    } catch {
      result.innerHTML = `<div class="env-error">🚫 Erro ao conectar com o servidor.</div>`;
      result.className = 'login-result error';
      result.classList.remove('hidden');
      return;
    }

    const user = allUsers.find(u =>
      u.username.toLowerCase() === query ||
      fakeUser(u.username).toLowerCase() === query
    );

    if (!user) {
      result.innerHTML = `<div class="env-error">🚫 Usuário "<strong>${query}</strong>" não encontrado no sistema.</div>`;
      result.className = 'login-result error';
      result.classList.remove('hidden');
      return;
    }

    // Validate fake password
    const expectedFakePass = fakePass(user.username);
    if (pass && pass !== expectedFakePass && pass !== '***') {
      result.innerHTML = `<div class="env-error">🔑 Senha fictícia incorreta para <strong>${user.username}</strong>.<br><small>Use a senha gerada no Rastreador de Credenciais.</small></div>`;
      result.className = 'login-result error';
      result.classList.remove('hidden');
      return;
    }

    // Apps deste usuário do banco
    let userApps = [];
    try {
      const allApps = await API.getApps();
      userApps = allApps.filter(a => (a.owner_name||'').toLowerCase() === user.username.toLowerCase());
    } catch {}

    const fakeU  = fakeUser(user.username);
    const fakeP  = fakePass(user.username);
    const avatar = AVATARS[user.username] || user.avatar || '👤';
    const level  = user.level || 1;
    const wallet = Number(user.wallet||0).toLocaleString('pt-BR',{minimumFractionDigits:2});
    const xp     = user.xp || 0;
    const since  = new Date(user.created_at||Date.now()).toLocaleDateString('pt-BR');

    const appsHTML = userApps.length
      ? userApps.map(a => `<div class="env-app" style="--ac:${a.color||'#7c3aed'}">
          <span class="env-app__icon">${a.emoji||'📦'}</span>
          <span class="env-app__name">${a.name}</span>
          <span class="env-app__cat">${a.category||''}</span>
        </div>`).join('')
      : '<p class="env-empty">Nenhum app registrado.</p>';

    result.className = 'login-result success';
    result.innerHTML = `
      <div class="env-panel">
        <div class="env-header">
          <span class="env-avatar">${avatar}</span>
          <div class="env-identity">
            <strong class="env-username">${user.username}</strong>
            <span class="env-level">Nível ${level}</span>
            <span class="env-since">Desde ${since}</span>
          </div>
          <span class="env-badge">✅ ACESSO AUTORIZADO</span>
        </div>
        <div class="env-stats">
          <div class="env-stat"><span class="env-stat__val">R$&nbsp;${wallet}</span><span class="env-stat__lbl">Carteira</span></div>
          <div class="env-stat"><span class="env-stat__val">${xp} XP</span><span class="env-stat__lbl">Experiência</span></div>
          <div class="env-stat"><span class="env-stat__val">${userApps.length}</span><span class="env-stat__lbl">Apps</span></div>
          <div class="env-stat"><span class="env-stat__val">Nv ${level}</span><span class="env-stat__lbl">Ranking</span></div>
        </div>
        <div class="env-creds">
          <span class="env-creds__label">🔑 Credenciais fictícias:</span>
          <code>${fakeU}</code> / <code>${fakeP}</code>
        </div>
        <div class="env-apps-section">
          <h4>📱 Apps do usuário (${userApps.length})</h4>
          <div class="env-apps-grid">${appsHTML}</div>
        </div>
      </div>
    `;
    result.classList.remove('hidden');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const users = State.getUsers();
  DB.renderTable(users);
  DB.renderJSON(users);
});
