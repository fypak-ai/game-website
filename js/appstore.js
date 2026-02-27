// ── App Playground Renderer ──────────────────
function renderCreatedApps() {
  const grid = document.getElementById('createdAppsGrid');
  const empty = document.getElementById('createdEmpty');
  if (!grid) return;
  const apps = State.getApps();
  if (!apps.length) { grid.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
  if (empty) empty.style.display = 'none';
  grid.innerHTML = apps.map(app => `
    <div class="app-card" onclick="UI.openModal(${JSON.stringify(app).replace(/"/g,'&quot;')})">
      <div class="app-card__logo" style="background:${app.logo.color}20;border-color:${app.logo.color}40">${app.logo.emoji}</div>
      <div class="app-card__name">${app.name}</div>
      <div class="app-card__desc">${app.desc}</div>
      <div class="app-card__meta"><span class="app-card__price">R$ ${app.price.toFixed(2)}</span><span class="app-card__cat">${app.category}</span></div>
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  // Logo preview on name input
  const nameInput = document.getElementById('appName');
  const preview = document.getElementById('appLogoPreview');
  if (nameInput && preview) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim()) {
        const lg = LogoGen.generate(nameInput.value.trim());
        preview.textContent = lg.emoji;
        preview.style.background = lg.color + '33';
      } else { preview.textContent = '?'; preview.style.background = ''; }
    });
  }
  renderCreatedApps();
  // Bind AppStore.createApp via global
  const form = document.getElementById('appForm');
  if (form) form.onsubmit = AppStore.createApp.bind(AppStore);
});
