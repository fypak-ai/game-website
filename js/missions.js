// ── CodePlay Missions System ────────────────────────────────────
// 5-minute rotating missions with XP + money rewards
// Full localStorage persistence, no backend needed

const MISSION_INTERVAL = 5 * 60; // 300s = 5 min
const XP_PER_LEVEL = 500;

// ── Mission template pool ──────────────────────────────────────
const MISSION_POOL = [
  // === CRIAR APP ===
  { id:'ca1', cat:'create', icon:'📱', title:'Crie um App de Calculadora',
    desc:'Vá ao Playground e crie um app com o nome "Calculadora". Pode ser qualquer calculadora — básica, científica, fictícia!',
    action:'Criar App', link:'playground.html',
    xp:80, money:120, diff:'Fácil', color:'#22c55e', time:180 },
  { id:'ca2', cat:'create', icon:'🎮', title:'Crie um App de Jogo',
    desc:'Crie um app com a categoria "Jogo" no Playground. Quanto mais criativo o nome, melhor!',
    action:'Criar App', link:'playground.html',
    xp:100, money:180, diff:'Fácil', color:'#22c55e', time:180 },
  { id:'ca3', cat:'create', icon:'🤖', title:'Crie um App de IA',
    desc:'Crie um app com "IA" ou "Bot" no nome. Ative a auto-detecção de código para bônus!',
    action:'Criar App', link:'playground.html',
    xp:150, money:250, diff:'Médio', color:'#f59e0b', time:240 },
  { id:'ca4', cat:'create', icon:'🛡️', title:'Crie uma Ferramenta Hacker',
    desc:'Vá ao Hacker Lab e crie uma nova ferramenta com poder acima de 70.',
    action:'Criar Ferramenta', link:'hacker.html',
    xp:200, money:320, diff:'Médio', color:'#f59e0b', time:240 },
  { id:'ca5', cat:'create', icon:'🌐', title:'Crie um App de Rede Social',
    desc:'Crie um app chamado "SocialNet" ou "FakeGram" ou similar no Playground.',
    action:'Criar App', link:'playground.html',
    xp:90, money:140, diff:'Fácil', color:'#22c55e', time:180 },
  { id:'ca6', cat:'create', icon:'🧬', title:'Crie um App Científico',
    desc:'Crie um app com tema científico — DNA, física quântica, laboratório fictício.',
    action:'Criar App', link:'playground.html',
    xp:180, money:300, diff:'Difícil', color:'#ef4444', time:300 },
  { id:'ca7', cat:'create', icon:'💰', title:'Crie um App Financeiro',
    desc:'Crie um app de banco, carteira ou investimento no Playground.',
    action:'Criar App', link:'playground.html',
    xp:120, money:200, diff:'Médio', color:'#f59e0b', time:240 },
  { id:'ca8', cat:'create', icon:'🎵', title:'Crie um App de Música',
    desc:'Crie um app relacionado a música, streaming ou produção musical.',
    action:'Criar App', link:'playground.html',
    xp:80, money:110, diff:'Fácil', color:'#22c55e', time:180 },
  { id:'ca9', cat:'create', icon:'🚀', title:'Crie um App Espacial',
    desc:'Crie um app com tema espacial — nave, planeta, galáxia.',
    action:'Criar App', link:'playground.html',
    xp:110, money:170, diff:'Fácil', color:'#22c55e', time:180 },
  { id:'ca10', cat:'create', icon:'⚡', title:'Crie 3 Apps em Sequência',
    desc:'Crie 3 apps diferentes no Playground. Categorias diferentes = bônus garantido!',
    action:'Criar Apps', link:'playground.html',
    xp:350, money:600, diff:'Lendário', color:'#a855f7', time:420 },

  // === COMPRAR ===
  { id:'co1', cat:'buy', icon:'🛒', title:'Compre um App da Loja',
    desc:'Vá à Loja e compre qualquer app disponível. Bons investimentos trazem lucro!',
    action:'Ir à Loja', link:'store.html',
    xp:60, money:80, diff:'Fácil', color:'#22c55e', time:120 },
  { id:'co2', cat:'buy', icon:'💎', title:'Compre 3 Apps Diferentes',
    desc:'Compre 3 apps na Loja. Diversifique seu portfólio fictício!',
    action:'Ir à Loja', link:'store.html',
    xp:180, money:250, diff:'Médio', color:'#f59e0b', time:300 },
  { id:'co3', cat:'buy', icon:'👑', title:'Compre o App Mais Caro',
    desc:'Encontre e compre o app com maior preço na Loja. Risco alto, recompensa alta!',
    action:'Ir à Loja', link:'store.html',
    xp:250, money:400, diff:'Difícil', color:'#ef4444', time:300 },
  { id:'co4', cat:'buy', icon:'🆓', title:'Colete Apps Grátis',
    desc:'Pegue todos os apps gratuítos disponíveis na Loja. Nada melhor do que de graça!',
    action:'Ir à Loja', link:'store.html',
    xp:70, money:90, diff:'Fácil', color:'#22c55e', time:120 },

  // === EXECUTAR SIMULADOR ===
  { id:'ex1', cat:'execute', icon:'🎬', title:'Renderize um Vídeo 8K',
    desc:'Vá aos Simuladores → aba Mídia e execute o Editor de Vídeo. Coloque um título épico!',
    action:'Executar', link:'simuladores.html',
    xp:50, money:70, diff:'Fácil', color:'#22c55e', time:60 },
  { id:'ex2', cat:'execute', icon:'🤖', title:'Converse com a IA Fake',
    desc:'Nos Simuladores → IA, envie uma mensagem para o chatbot GPT-Fake-∞.',
    action:'Executar', link:'simuladores.html',
    xp:40, money:50, diff:'Fácil', color:'#22c55e', time:60 },
  { id:'ex3', cat:'execute', icon:'☁️', title:'Lance uma VM na Cloud',
    desc:'Nos Simuladores → Cloud, provisione uma instância VM. Tipo t999.nano recomendado!',
    action:'Executar', link:'simuladores.html',
    xp:60, money:90, diff:'Fácil', color:'#22c55e', time:60 },
  { id:'ex4', cat:'execute', icon:'☠️', title:'Execute uma Ferramenta Hacker',
    desc:'No Hacker Lab, clique em Executar em qualquer ferramenta do arsenal.',
    action:'Executar', link:'hacker.html',
    xp:80, money:120, diff:'Fácil', color:'#22c55e', time:90 },
  { id:'ex5', cat:'execute', icon:'🔍', title:'Faça um Scan de Rede',
    desc:'Nos Simuladores → Redes, execute um Network Scan. Modo Agressivo = bônus!',
    action:'Executar', link:'simuladores.html',
    xp:90, money:130, diff:'Médio', color:'#f59e0b', time:120 },
  { id:'ex6', cat:'execute', icon:'🎮', title:'Complete uma Batalha RPG',
    desc:'Nos Simuladores → Jogos, crie um personagem RPG com classe Lendária.',
    action:'Executar', link:'simuladores.html',
    xp:100, money:150, diff:'Médio', color:'#f59e0b', time:120 },
  { id:'ex7', cat:'execute', icon:'🏎️', title:'Vença uma Corrida',
    desc:'Nos Simuladores → Jogos → Corrida, tente ficar em 1º lugar. Boa sorte!',
    action:'Executar', link:'simuladores.html',
    xp:120, money:200, diff:'Médio', color:'#f59e0b', time:120 },
  { id:'ex8', cat:'execute', icon:'🎵', title:'Produza uma Música Lo-Fi',
    desc:'Nos Simuladores → Mídia, crie uma faixa Lo-Fi com BPM entre 60-90.',
    action:'Executar', link:'simuladores.html',
    xp:55, money:75, diff:'Fácil', color:'#22c55e', time:60 },
  { id:'ex9', cat:'execute', icon:'🌍', title:'Configure DNS Global',
    desc:'Nos Simuladores → Redes, configure um registro DNS para seu domínio fictício.',
    action:'Executar', link:'simuladores.html',
    xp:70, money:100, diff:'Fácil', color:'#22c55e', time:90 },
  { id:'ex10', cat:'execute', icon:'🔴', title:'Faça uma Live ao Vivo',
    desc:'Nos Simuladores → Mídia → Streamer, inicie uma live. 1M de espectadores = BÔNUS!',
    action:'Executar', link:'simuladores.html',
    xp:130, money:220, diff:'Médio', color:'#f59e0b', time:150 },

  // === DESAFIOS ESPECIAIS ===
  { id:'sp1', cat:'special', icon:'🌟', title:'Marathon: 5 Simuladores',
    desc:'Execute pelo menos 1 ação em cada uma das 5 abas dos Simuladores (Mídia, IA, Cloud, Redes, Jogos).',
    action:'Maratona!', link:'simuladores.html',
    xp:500, money:800, diff:'Lendário', color:'#a855f7', time:600 },
  { id:'sp2', cat:'special', icon:'🧠', title:'Hackathon Relâmpago',
    desc:'Crie um app E execute uma ferramenta hacker em menos de 3 minutos. Velocidade máxima!',
    action:'Começar!', link:'playground.html',
    xp:400, money:650, diff:'Lendário', color:'#a855f7', time:180 },
  { id:'sp3', cat:'special', icon:'💼', title:'Empresário Virtual',
    desc:'Crie um app, publique na loja E compre outro app. Ciclo completo!',
    action:'Começar!', link:'playground.html',
    xp:300, money:500, diff:'Difícil', color:'#ef4444', time:360 },
  { id:'sp4', cat:'special', icon:'🎲', title:'Missão Aleatória',
    desc:'Execute 3 simulações ALEATÓRIAS em qualquer aba. Sem repetição!',
    action:'Sortear!', link:'simuladores.html',
    xp:200, money:300, diff:'Médio', color:'#f59e0b', time:240 },
  { id:'sp5', cat:'special', icon:'🔒', title:'Infiltração Total',
    desc:'No Hacker Lab, use o terminal e execute os comandos: scan, status e run.',
    action:'Terminal →', link:'hacker.html',
    xp:250, money:420, diff:'Difícil', color:'#ef4444', time:300 },
  { id:'sp6', cat:'special', icon:'📊', title:'Analista de Dados',
    desc:'Crie 2 usuários diferentes no Banco de Dados e depois acesse o leaderboard.',
    action:'Banco →', link:'database.html',
    xp:160, money:240, diff:'Médio', color:'#f59e0b', time:240 },
];

// ── State ──────────────────────────────────────────────────────
const MS = {
  get state() {
    try { return JSON.parse(localStorage.getItem('cp_missions') || '{}'); } catch { return {}; }
  },
  save(s) { localStorage.setItem('cp_missions', JSON.stringify(s)); },

  getPlayer() {
    // try real account first
    try {
      const u = JSON.parse(localStorage.getItem('cp_user') || 'null');
      if (u) return u;
    } catch {}
    // fallback: local user (database.js format)
    try {
      const cu = JSON.parse(localStorage.getItem('cp_currentUser') || 'null');
      if (cu) return { username: cu.username || cu.name || 'Jogador', wallet: cu.wallet || 1000, xp: cu.xp || 0, level: cu.level || 1, avatar: cu.avatar || '👤' };
    } catch {}
    // guest
    const g = this.state;
    return { username: 'Visitante', wallet: g.wallet || 1000, xp: g.xp || 0, level: g.level || 1, avatar: '👤' };
  },

  addReward(xp, money) {
    const s = this.state;
    s.xp = (s.xp || 0) + xp;
    s.wallet = (s.wallet || 1000) + money;
    s.level = 1 + Math.floor(s.xp / XP_PER_LEVEL);
    // also update local user if exists
    try {
      const cu = JSON.parse(localStorage.getItem('cp_currentUser') || 'null');
      if (cu) {
        cu.xp = (cu.xp || 0) + xp;
        cu.wallet = (cu.wallet || 1000) + money;
        cu.level = 1 + Math.floor(cu.xp / XP_PER_LEVEL);
        localStorage.setItem('cp_currentUser', JSON.stringify(cu));
      }
    } catch {}
    this.save(s);
  }
};

// ── Timer ──────────────────────────────────────────────────────
let timerInterval = null;

function startTimer() {
  const s = MS.state;
  if (!s.nextRefresh || Date.now() > s.nextRefresh) {
    generateMissions();
  }
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(tickTimer, 1000);
  tickTimer();
}

function tickTimer() {
  const s = MS.state;
  const remaining = Math.max(0, Math.floor((s.nextRefresh - Date.now()) / 1000));
  const total = MISSION_INTERVAL;
  const pct = ((total - remaining) / total) * 100;

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const el = document.getElementById('timerCount');
  const fill = document.getElementById('timerFill');
  if (el) el.textContent = `${mm}:${ss}`;
  if (fill) fill.style.width = pct + '%';

  if (remaining === 0) generateMissions();
}

// ── Mission Generation ─────────────────────────────────────────
function generateMissions() {
  const s = MS.state;
  s.nextRefresh = Date.now() + MISSION_INTERVAL * 1000;

  // Pick 4 random missions (no dups)
  const shuffled = [...MISSION_POOL].sort(() => Math.random() - 0.5);
  s.active = shuffled.slice(0, 4).map(m => ({
    ...m,
    instanceId: m.id + '_' + Date.now(),
    startedAt: Date.now(),
    deadline: Date.now() + m.time * 1000,
    status: 'active'
  }));

  MS.save(s);
  renderMissions();
  renderHUD();
}

// ── Render ─────────────────────────────────────────────────────
const Missions = {
  refreshNow() { generateMissions(); },
  closePopup() {
    document.getElementById('rewardPopup').classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
  },

  complete(instanceId) {
    const s = MS.state;
    const mission = (s.active || []).find(m => m.instanceId === instanceId);
    if (!mission || mission.status === 'done') return;

    // Bonus: time-based
    const elapsed = (Date.now() - mission.startedAt) / 1000;
    const bonus = elapsed < 60 ? 1.5 : elapsed < 120 ? 1.2 : 1.0;
    const finalXP = Math.round(mission.xp * bonus);
    const finalMoney = Math.round(mission.money * bonus);

    mission.status = 'done';
    mission.completedAt = Date.now();
    mission.earnedXP = finalXP;
    mission.earnedMoney = finalMoney;

    s.completed = s.completed || [];
    s.completed.unshift({ ...mission });
    if (s.completed.length > 50) s.completed = s.completed.slice(0, 50);

    MS.addReward(finalXP, finalMoney);
    MS.save(s);

    showRewardPopup(mission, finalXP, finalMoney, bonus > 1);
    renderMissions();
    renderHUD();
    renderCompleted();
    renderLeaderboard();
  },

  skip(instanceId) {
    const s = MS.state;
    const m = (s.active || []).find(x => x.instanceId === instanceId);
    if (m) { m.status = 'skipped'; MS.save(s); renderMissions(); }
  }
};

function renderMissions() {
  const s = MS.state;
  const active = (s.active || []).filter(m => m.status === 'active');
  const grid = document.getElementById('activeMissions');
  const badge = document.getElementById('activeBadge');
  if (badge) badge.textContent = active.length;

  if (!grid) return;
  if (!active.length) {
    grid.innerHTML = '<p class="empty-hint">⏳ Aguardando próximo ciclo de missões...</p>';
    return;
  }

  grid.innerHTML = active.map(m => {
    const timeLeft = Math.max(0, Math.floor((m.deadline - Date.now()) / 1000));
    const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const ss = String(timeLeft % 60).padStart(2, '0');
    const urgentClass = timeLeft < 30 ? 'mission-card--urgent' : timeLeft < 60 ? 'mission-card--warning' : '';
    return `
    <div class="mission-card ${urgentClass}" style="--m-color:${m.color}">
      <div class="mission-card__head">
        <span class="mission-icon">${m.icon}</span>
        <div class="mission-diff diff-${m.diff.toLowerCase()}">${m.diff}</div>
      </div>
      <h3 class="mission-title">${m.title}</h3>
      <p class="mission-desc">${m.desc}</p>
      <div class="mission-rewards">
        <span class="reward-xp">+${m.xp} XP</span>
        <span class="reward-money">+R$ ${m.money.toFixed(2)}</span>
      </div>
      <div class="mission-timer-mini">⏱️ ${mm}:${ss}</div>
      <div class="mission-actions">
        <a href="${m.link}" class="btn btn--primary btn--sm">🎯 ${m.action}</a>
        <button class="btn btn--sm btn--complete" onclick="Missions.complete('${m.instanceId}')">✅ Concluir</button>
        <button class="btn btn--sm btn--skip" onclick="Missions.skip('${m.instanceId}')">⏭️</button>
      </div>
    </div>`;
  }).join('');

  // Live countdown on mission cards
  setTimeout(() => {
    if (document.getElementById('activeMissions')) renderMissions();
  }, 1000);
}

function renderHUD() {
  const p = MS.getPlayer();
  const s = MS.state;
  const xp = s.xp || p.xp || 0;
  const wallet = s.wallet || p.wallet || 1000;
  const level = 1 + Math.floor(xp / XP_PER_LEVEL);

  document.getElementById('hudUsername').textContent = p.username || 'Visitante';
  document.getElementById('hudWallet').textContent = 'R$ ' + wallet.toFixed(2);
  document.getElementById('hudXP').textContent = xp + ' XP';
  document.getElementById('hudLevel').textContent = 'Nível ' + level;

  // XP bar
  const xpInLevel = xp % XP_PER_LEVEL;
  const pct = (xpInLevel / XP_PER_LEVEL) * 100;
  const xpFill = document.getElementById('xpFill');
  const xpProg = document.getElementById('xpProgress');
  if (xpFill) xpFill.style.width = pct + '%';
  if (xpProg) xpProg.textContent = `${xpInLevel} / ${XP_PER_LEVEL} XP para nível ${level + 1}`;
}

function renderCompleted() {
  const s = MS.state;
  const done = (s.completed || []).slice(0, 20);
  const log = document.getElementById('completedLog');
  const badge = document.getElementById('doneBadge');
  if (badge) badge.textContent = (s.completed || []).length;
  if (!log) return;
  if (!done.length) { log.innerHTML = '<p class="empty-hint">Nenhuma missão concluída ainda. Comece agora!</p>'; return; }
  log.innerHTML = done.map(m => {
    const when = new Date(m.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `<div class="log-row">
      <span class="log-icon">${m.icon}</span>
      <div class="log-info">
        <strong>${m.title}</strong>
        <small>${m.diff} · ${when}</small>
      </div>
      <div class="log-rewards">
        <span class="reward-xp">+${m.earnedXP} XP</span>
        <span class="reward-money">+R$ ${m.earnedMoney.toFixed(2)}</span>
      </div>
    </div>`;
  }).join('');
}

function renderLeaderboard() {
  const s = MS.state;
  const completed = s.completed || [];
  const total = completed.length;
  const totalXP = completed.reduce((a, m) => a + (m.earnedXP || 0), 0);
  const totalMoney = completed.reduce((a, m) => a + (m.earnedMoney || 0), 0);
  const p = MS.getPlayer();

  const el = document.getElementById('leaderboard');
  if (!el) return;

  // Build a local top-3 + player entry (since no backend)
  const fakeBoard = [
    { rank: 1, name: 'ByteWizard99', xp: totalXP + 4200, money: totalMoney + 7800, avatar: '🧙' },
    { rank: 2, name: 'NullPointer', xp: totalXP + 2100, money: totalMoney + 3900, avatar: '🤖' },
    { rank: 3, name: 'QuantumDev', xp: totalXP + 800, money: totalMoney + 1500, avatar: '🚀' },
    { rank: 4, name: p.username || 'Você', xp: totalXP, money: totalMoney, avatar: p.avatar || '👤', isPlayer: true },
  ];

  el.innerHTML = fakeBoard.map(e => `
    <div class="lb-row ${e.isPlayer ? 'lb-row--you' : ''}">
      <span class="lb-rank">${['🥇','🥈','🥉','🎯'][e.rank-1]}</span>
      <span class="lb-avatar">${e.avatar}</span>
      <span class="lb-name">${e.name}${e.isPlayer ? ' (você)' : ''}</span>
      <span class="lb-xp">${e.xp} XP</span>
      <span class="lb-money">R$ ${e.money.toFixed(2)}</span>
    </div>`).join('');
}

function showRewardPopup(mission, xp, money, bonus) {
  document.getElementById('popupIcon').textContent = mission.icon;
  document.getElementById('popupTitle').textContent = '🎉 Missão Concluída!';
  document.getElementById('popupDesc').textContent = mission.title;
  document.getElementById('popupRewards').innerHTML = `
    <div class="popup-reward-row">
      <span class="reward-xp big">+${xp} XP</span>
      <span class="reward-money big">+R$ ${money.toFixed(2)}</span>
      ${bonus ? '<span class="bonus-badge">⚡ BÔNUS VELOCIDADE!</span>' : ''}
    </div>`;
  document.getElementById('rewardPopup').classList.remove('hidden');
  document.getElementById('overlay').classList.remove('hidden');
}

// ── Boot ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderHUD();
  renderCompleted();
  renderLeaderboard();
  startTimer();
});
