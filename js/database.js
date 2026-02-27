// ── Database Module ──────────────────────────
const DB = {
  addUser(e) {
    e.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const login = document.getElementById('userLogin').value.trim();
    const pass = document.getElementById('userPass').value;
    const email = document.getElementById('userEmail').value.trim();
    const users = State.getUsers();
    if (users.find(u => u.login === login)) {
      alert('Login "' + login + '" já existe! Escolha outro.'); return;
    }
    const user = { id: 'u_' + Date.now(), name, login, pass, email, createdAt: Date.now() };
    users.push(user);
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
    const filtered = q ? users.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.login.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())) : users;
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
  simulateLogin(e) {
    e.preventDefault();
    const login = document.getElementById('simLogin').value.trim();
    const pass = document.getElementById('simPass').value;
    const result = document.getElementById('loginResult');
    const user = State.getUsers().find(u => u.login === login);
    if (!user) { result.textContent = '❌ Usuário "' + login + '" não encontrado.'; result.className = 'login-result error'; }
    else if (user.pass !== pass) { result.textContent = '❌ Senha incorreta para "' + login + '".'; result.className = 'login-result error'; }
    else { result.textContent = '✅ Login bem-sucedido! Bem-vindo, ' + user.name + '!'; result.className = 'login-result success'; }
    result.classList.remove('hidden');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const users = State.getUsers();
  DB.renderTable(users);
  DB.renderJSON(users);
});
