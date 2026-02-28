// ── Store Page ───────────────────────────────
const Store = {
  render() {
    const apps = State.getApps();
    const q = document.getElementById('storeSearch')?.value.toLowerCase() || '';
    const cat = document.getElementById('storeCategory')?.value || '';
    const filtered = apps.filter(a =>
      (!q || a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)) &&
      (!cat || a.category === cat)
    );
    const grid = document.getElementById('storeGrid');
    const empty = document.getElementById('storeEmpty');
    if (grid) {
      if (!filtered.length) { grid.innerHTML = ''; if (empty) empty.style.display = 'block'; }
      else {
        if (empty) empty.style.display = 'none';
        grid.innerHTML = filtered.map(app => {
          const owned = State.isOwned(app.id);
          const isFree = app.price === 0;
          const canBuy = State.getWallet() >= app.price;
          return `<div class="app-card">
            <div class="app-card__logo" style="background:${app.logo.color}20">${app.logo.emoji}</div>
            <div class="app-card__name">${app.name}</div>
            <div class="app-card__desc">${app.desc}</div>
            <div class="app-card__meta"><span class="app-card__price">${isFree ? 'Grátis' : 'R$ ' + app.price.toFixed(2)}</span><span class="app-card__cat">${app.category}</span></div>
            ${owned
              ? `<button class="btn btn--outline btn--full" onclick="UI.openModal(${JSON.stringify(app).replace(/"/g,'&quot;')})">▶ Abrir</button>`
              : `<button class="btn btn--primary btn--full" onclick="Store.buy('${app.id}')" ${canBuy?'':'disabled'} title="${canBuy?'':'Saldo insuficiente'}">${isFree?'Instalar Grátis':'Comprar'}</button>`
            }
          </div>`;
        }).join('');
      }
    }
    Store.renderOwned();
    const countEl = document.getElementById('ownedCount');
    if (countEl) countEl.textContent = State.getOwned().length + ' apps comprados';
  },
  renderOwned() {
    const owned = State.getOwned();
    const apps = State.getApps().filter(a => owned.includes(a.id));
    const grid = document.getElementById('myAppsGrid');
    const empty = document.getElementById('myAppsEmpty');
    if (!grid) return;
    if (!apps.length) { grid.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
    if (empty) empty.style.display = 'none';
    grid.innerHTML = apps.map(app => `<div class="app-card">
      <div class="app-card__logo" style="background:${app.logo.color}20">${app.logo.emoji}</div>
      <div class="app-card__name">${app.name}</div>
      <div class="app-card__desc">${app.desc}</div>
      <button class="btn btn--outline btn--full" onclick="UI.openModal(${JSON.stringify(app).replace(/"/g,'&quot;')})">▶ Abrir</button>
    </div>`).join('');
  },
  buy(id) {
    localStorage.setItem('cp_last_store_buy', Date.now());
    const app = State.getApps().find(a => a.id === id);
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
