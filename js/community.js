// ── Community Page ───────────────────────────
const FAKE_DEVS = [
  { name: 'Ana Rodrigues', apps: 12, earned: 'R$ 340,00', rank: '🥇' },
  { name: 'Carlos Mendes', apps: 9, earned: 'R$ 210,50', rank: '🥈' },
  { name: 'Beatriz Costa', apps: 7, earned: 'R$ 175,00', rank: '🥉' },
  { name: 'Diego Alves', apps: 5, earned: 'R$ 98,00', rank: '4️⃣' },
  { name: 'Fernanda Lima', apps: 4, earned: 'R$ 60,00', rank: '5️⃣' },
];

document.addEventListener('DOMContentLoaded', () => {
  // Leaderboard
  const lb = document.getElementById('leaderboard');
  if (lb) {
    const userApps = State.getApps();
    const entries = [...FAKE_DEVS];
    if (userApps.length) {
      entries.unshift({ name: 'Você', apps: userApps.length, earned: 'R$ ' + userApps.reduce((a,b) => a+b.price,0).toFixed(2), rank: '⭐' });
    }
    lb.innerHTML = entries.map(d => `<div class="leaderboard-item">
      <div class="leaderboard-item__rank">${d.rank}</div>
      <div class="leaderboard-item__info"><div class="leaderboard-item__name">${d.name}</div><div class="leaderboard-item__sub">${d.apps} apps • ${d.earned} gerados</div></div>
    </div>`).join('');
  }
  // Featured apps
  const fa = document.getElementById('featuredApps');
  const fe = document.getElementById('featuredEmpty');
  if (fa) {
    const apps = State.getApps().slice(0, 6);
    if (!apps.length) { if (fe) fe.style.display = 'block'; }
    else {
      if (fe) fe.style.display = 'none';
      fa.innerHTML = apps.map(app => `<div class="app-card">
        <div class="app-card__logo" style="background:${app.logo.color}20">${app.logo.emoji}</div>
        <div class="app-card__name">${app.name}</div>
        <div class="app-card__desc">${app.desc}</div>
        <div class="app-card__meta"><span class="app-card__price">R$ ${app.price.toFixed(2)}</span><span class="app-card__cat">${app.category}</span></div>
      </div>`).join('');
    }
  }
});
