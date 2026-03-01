// ── Community Page ─────────────────────────────────────────────
// Carrega usuários e apps do backend Railway

document.addEventListener('DOMContentLoaded', async () => {

  // ── Leaderboard de usuários do banco ──
  const lb = document.getElementById('leaderboard');
  if (lb) {
    try {
      const users = await API.getLeaderboard();   // GET /api/users
      lb.innerHTML = users.map((u, i) => {
        const medals = ['🥇','🥈','🥉'];
        const rank = medals[i] || `${i+1}`;
        return `<div class="leaderboard-item">
          <div class="leaderboard-item__rank">${rank}</div>
          <div class="leaderboard-item__info">
            <div class="leaderboard-item__name">${u.avatar||'👤'} ${u.username}</div>
            <div class="leaderboard-item__sub">Nível ${u.level||1} • ${u.xp||0} XP • R$ ${Number(u.wallet||0).toLocaleString('pt-BR')}</div>
          </div>
        </div>`;
      }).join('');
    } catch(e) {
      lb.innerHTML = '<p style="color:#64748b;padding:16px">Erro ao carregar ranking</p>';
    }
  }

  // ── Apps em destaque do banco ──
  const fa = document.getElementById('featuredApps');
  const fe = document.getElementById('featuredEmpty');
  if (fa) {
    try {
      const apps = await API.getApps();   // GET /api/apps
      const featured = apps.slice(0, 6);
      if (!featured.length) {
        if (fe) fe.style.display = 'block';
      } else {
        if (fe) fe.style.display = 'none';
        fa.innerHTML = featured.map(a => `<div class="app-card">
          <div class="app-card__logo" style="background:${a.color||'#7c3aed'}20">${a.emoji||'📦'}</div>
          <div class="app-card__name">${a.name}</div>
          <div class="app-card__desc">${a.description||''}</div>
          <div class="app-card__meta">
            <span class="app-card__price">R$ ${Number(a.price||0).toLocaleString('pt-BR')}</span>
            <span class="app-card__cat">${a.category||'Geral'}</span>
            <span class="app-card__owner" style="font-size:.72rem;color:#64748b;margin-left:auto">👤 ${a.owner_name||''}</span>
          </div>
        </div>`).join('');
      }
    } catch(e) {
      if (fe) fe.style.display = 'block';
    }
  }

});
