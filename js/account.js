// ── Account Page ────────────────────────────────────────────────
const Account = {
  selectedAvatar: '👤',

  showTab(tab) {
    document.getElementById('formLogin').classList.toggle('hidden', tab!=='login');
    document.getElementById('formRegister').classList.toggle('hidden', tab!=='register');
    document.getElementById('tabLogin').classList.toggle('active', tab==='login');
    document.getElementById('tabRegister').classList.toggle('active', tab==='register');
  },

  msg(id, text, isErr) {
    const el = document.getElementById(id);
    if(!el) return;
    el.textContent = text;
    el.className = 'auth-msg '+(isErr?'auth-msg--err':'auth-msg--ok');
    el.classList.remove('hidden');
  },

  async login() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    if(!user||!pass) return this.msg('loginMsg','Preencha todos os campos',true);
    try {
      await API.login(user, pass);
      this.renderProfile();
    } catch(e) { this.msg('loginMsg', e.message, true); }
  },

  async register() {
    const user = document.getElementById('regUser').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    if(!user||!email||!pass) return this.msg('registerMsg','Preencha todos os campos',true);
    try {
      await API.register(user, email, pass, this.selectedAvatar);
      this.renderProfile();
    } catch(e) { this.msg('registerMsg', e.message, true); }
  },

  logout() {
    API.logout();
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('profileSection').classList.add('hidden');
  },

  async renderProfile() {
    const u = API.currentUser;
    if(!u) return;
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('profileSection').classList.remove('hidden');
    document.getElementById('profAvatar').textContent = u.avatar||'👤';
    document.getElementById('profUsername').textContent = u.username;
    document.getElementById('profEmail').textContent = u.email;
    document.getElementById('profWallet').textContent = 'R$ '+(u.wallet||0).toFixed(2);
    document.getElementById('profLevel').textContent = u.level||1;
    document.getElementById('profXP').textContent = u.xp||0;
    document.getElementById('profDate').textContent = new Date(u.created_at).toLocaleDateString('pt-BR');
    // Load cloud apps
    try {
      const apps = await API.getMyApps();
      document.getElementById('profApps').textContent = apps.length;
      const grid = document.getElementById('cloudAppsGrid');
      const empty = document.getElementById('cloudAppsEmpty');
      if(!apps.length){ grid.innerHTML=''; empty.classList.remove('hidden'); }
      else {
        empty.classList.add('hidden');
        grid.innerHTML = apps.map(a=>`
          <div class="app-card">
            <div class="app-card__logo" style="background:${a.color}20;border:1px solid ${a.color}40">${a.emoji}</div>
            <div class="app-card__name">${a.name}</div>
            <div class="app-card__desc">${a.description||''}</div>
            <div class="app-card__meta"><span>${a.price===0?'Grátis':'R$ '+a.price.toFixed(2)}</span><span>${a.category}</span></div>
          </div>`).join('');
      }
    } catch{}
    // Load cloud tools
    try {
      const tools = await API.getMyTools();
      const tgrid = document.getElementById('cloudToolsGrid');
      const tempty = document.getElementById('cloudToolsEmpty');
      if(!tools.length){ tgrid.innerHTML=''; tempty.classList.remove('hidden'); }
      else {
        tempty.classList.add('hidden');
        tgrid.innerHTML = tools.map(t=>`
          <div class="hack-tool-card">
            <div class="hack-tool-card__name">${t.emoji||'☠️'} ${t.name}</div>
            <div class="hack-tool-card__type">${t.type} · Poder: ${t.power}/100</div>
            <div class="power-bar"><div class="power-bar__fill" style="width:${t.power}%"></div></div>
          </div>`).join('');
      }
    } catch{}
  },

  saveApiUrl() {
    const url = document.getElementById('apiUrlInput').value.trim();
    if(url){ localStorage.setItem('cp_api_url', url); }
    else { localStorage.removeItem('cp_api_url'); }
    document.getElementById('apiStatus').textContent = '✅ Salvo!';
    setTimeout(()=>document.getElementById('apiStatus').textContent='', 2000);
  },

  async checkConnection() {
    const status = document.getElementById('apiStatus');
    try {
      const r = await fetch(API.BASE+'/health');
      const d = await r.json();
      if(status) status.textContent = d.status==='ok'?'🟢 API conectada':'🔴 Erro';
    } catch {
      if(status) status.textContent = '🔴 API offline';
    }
  }
};

document.addEventListener('DOMContentLoaded', ()=>{
  // Set saved API URL
  const saved = localStorage.getItem('cp_api_url');
  if(saved) document.getElementById('apiUrlInput').value = saved;
  Account.checkConnection();

  // Avatar picker
  document.querySelectorAll('.avatar-opt').forEach(el=>{
    el.addEventListener('click',()=>{
      document.querySelectorAll('.avatar-opt').forEach(e=>e.classList.remove('selected'));
      el.classList.add('selected');
      Account.selectedAvatar = el.dataset.v;
    });
  });

  // Enter key on inputs
  ['loginPass','loginUser'].forEach(id=>{
    document.getElementById(id)?.addEventListener('keydown',e=>{ if(e.key==='Enter') Account.login(); });
  });
  ['regPass'].forEach(id=>{
    document.getElementById(id)?.addEventListener('keydown',e=>{ if(e.key==='Enter') Account.register(); });
  });

  if(API.isLoggedIn()) Account.renderProfile();
});
