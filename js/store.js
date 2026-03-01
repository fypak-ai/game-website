// ── Store Page ─────────────────────────────────────────────────
// Carrega apps do backend Railway; fallback para localStorage

const Store = {
  _apps: null,   // cache da sessão

  async loadApps() {
    if (this._apps) return this._apps;
    try {
      const data = await API.getApps();   // GET /api/apps
      // Normaliza formato backend → formato frontend
      this._apps = data.map(a => ({
        id:       String(a.id),
        name:     a.name,
        desc:     a.description || '',
        price:    Number(a.price) || 0,
        category: a.category || 'Geral',
        owner:    a.owner_name || '',
        logo:     { emoji: a.emoji || '📦', color: a.color || '#7c3aed' },
        code:     a.code || '',
        downloads:a.downloads || 0,
        createdAt:new Date(a.created_at).getTime() || Date.now()
      }));
    } catch(e) {
      console.warn('Backend indisponível, usando localStorage:', e.message);
      this._apps = State.getApps();   // fallback
    }
    return this._apps;
  },

  async render() {
    const apps  = await this.loadApps();
    const q     = (document.getElementById('storeSearch')?.value || '').toLowerCase();
    const cat   = document.getElementById('storeCategory')?.value || '';
    const filtered = apps.filter(a =>
      (!q   || a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)) &&
      (!cat || a.category === cat)
    );
    const grid  = document.getElementById('storeGrid');
    const empty = document.getElementById('storeEmpty');
    if (!grid) return;
    if (!filtered.length) {
      grid.innerHTML = '';
      if (empty) empty.style.display = 'block';
    } else {
      if (empty) empty.style.display = 'none';
      grid.innerHTML = filtered.map(app => {
        const owned  = State.isOwned(app.id);
        const isFree = app.price === 0;
        const canBuy = State.getWallet() >= app.price;
        const ownerBadge = app.owner ? `<span class="app-card__owner">👤 ${app.owner}</span>` : '';
        return `<div class="app-card">
          <div class="app-card__logo" style="background:${app.logo.color}20">${app.logo.emoji}</div>
          <div class="app-card__name">${app.name}</div>
          <div class="app-card__desc">${app.desc}</div>
          <div class="app-card__meta">
            <span class="app-card__price">${isFree ? 'Grátis' : 'R$ ' + app.price.toLocaleString('pt-BR')}</span>
            <span class="app-card__cat">${app.category}</span>
            ${ownerBadge}
          </div>
          ${owned
            ? `<button class="btn btn--outline btn--full" onclick="UI.openModal(${JSON.stringify(app).replace(/"/g,'&quot;')})">▶ Abrir</button>`
            : `<button class="btn btn--primary btn--full" onclick="Store.buy('${app.id}')" ${canBuy?'':'disabled'} title="${canBuy?'':'Saldo insuficiente'}">${isFree?'Instalar Grátis':'Comprar'}</button>`
          }
        </div>`;
      }).join('');
    }
    this.renderOwned(apps);
    const countEl = document.getElementById('ownedCount');
    if (countEl) countEl.textContent = State.getOwned().length + ' apps comprados';
  },

  renderOwned(apps) {
    const owned = State.getOwned();
    const myApps = (apps || this._apps || State.getApps()).filter(a => owned.includes(a.id));
    const grid  = document.getElementById('myAppsGrid');
    const empty = document.getElementById('myAppsEmpty');
    if (!grid) return;
    if (!myApps.length) { grid.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
    if (empty) empty.style.display = 'none';
    grid.innerHTML = myApps.map(app => `<div class="app-card">
      <div class="app-card__logo" style="background:${app.logo.color}20">${app.logo.emoji}</div>
      <div class="app-card__name">${app.name}</div>
      <div class="app-card__desc">${app.desc}</div>
      <button class="btn btn--outline btn--full" onclick="UI.openModal(${JSON.stringify(app).replace(/"/g,'&quot;')})">▶ Abrir</button>
    </div>`).join('');
  },

  buy(id) {
    localStorage.setItem('cp_last_store_buy', Date.now());
    const app = (this._apps || State.getApps()).find(a => a.id === id);
    if (!app || State.isOwned(id)) return;
    if (State.getWallet() < app.price) { alert('Saldo insuficiente!'); return; }
    State.deductBalance(app.price);
    State.addOwned(id);
    Store.render();
    alert('✅ "' + app.name + '" comprado com sucesso!');
  },

  filter() { Store.render(); }
};

document.addEventListener('DOMContentLoaded', () => Store.render());
