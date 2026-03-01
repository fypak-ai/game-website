// -- CodePlay API Client --
// Reads API_URL from localStorage (set via account.html) or falls back to Railway
const API = {
  get BASE() {
    return localStorage.getItem('cp_api_url') || 'https://codeplay-backend-production.up.railway.app';
  },
  get token() { return localStorage.getItem('cp_token') || ''; },
  set token(v) { if(v) localStorage.setItem('cp_token',v); else localStorage.removeItem('cp_token'); },
  get currentUser() { try{ return JSON.parse(localStorage.getItem('cp_user')||'null'); }catch{ return null; } },
  set currentUser(v) { if(v) localStorage.setItem('cp_user',JSON.stringify(v)); else localStorage.removeItem('cp_user'); },

  async req(method, path, body) {
    const opts = {
      method,
      headers: { 'Content-Type':'application/json', ...(this.token?{'Authorization':'Bearer '+this.token}:{}) }
    };
    if(body) opts.body = JSON.stringify(body);
    const r = await fetch(this.BASE + path, opts);
    const data = await r.json().catch(()=>({error:'Resposta invalida'}));
    if(!r.ok) throw new Error(data.error || 'Erro '+r.status);
    return data;
  },

  // Auth
  async register(username, email, password, avatar='👤') {
    const res = await this.req('POST','/api/auth/register',{username,email,password,avatar});
    this.token = res.token; this.currentUser = res.user; return res;
  },
  async login(username, password) {
    const res = await this.req('POST','/api/auth/login',{username,password});
    this.token = res.token; this.currentUser = res.user; return res;
  },
  async me() { return this.req('GET','/api/auth/me'); },
  logout() { this.token = null; this.currentUser = null; },

  // Apps
  async getApps() { return this.req('GET','/api/apps'); },
  async getMyApps() { return this.req('GET','/api/apps/mine'); },
  async createApp(data) { return this.req('POST','/api/apps',data); },
  async deleteApp(id) { return this.req('DELETE','/api/apps/'+id); },
  async purchaseApp(id) { return this.req('POST','/api/apps/'+id+'/purchase'); },

  // Users
  async getLeaderboard() { return this.req('GET','/api/users'); },

  // Hack Tools
  async getMyTools() { return this.req('GET','/api/hack-tools/mine'); },
  async createTool(data) { return this.req('POST','/api/hack-tools',data); },
  async deleteTool(id) { return this.req('DELETE','/api/hack-tools/'+id); },

  isLoggedIn() { return !!this.token && !!this.currentUser; }
};
