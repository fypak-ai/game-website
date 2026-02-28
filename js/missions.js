// ── CodePlay Missions System v2 ─────────────────────────────────
// Real completion: XP/money only awarded after the actual action is detected

const MISSION_INTERVAL = 5 * 60;
const XP_PER_LEVEL = 500;

// ── Mission pool ───────────────────────────────────────────────
// verifyType: what action to detect
//   'app_created'      → playground created a new app (cp_last_app_created timestamp)
//   'hack_tool_created'→ hacker lab created a tool    (cp_last_tool_created)
//   'sim_run'          → simuladores ran something     (cp_last_sim_run)
//   'store_buy'        → store purchased an app        (cp_last_store_buy)
//   'terminal_cmd'     → hacker terminal command used  (cp_last_terminal_cmd)
//   'db_user_created'  → database page created a user  (cp_last_db_user)
const MISSION_POOL = [
  { id:'ca1',  cat:'create', icon:'📱', title:'Crie um App de Calculadora',
    desc:'Vá ao Playground, crie um app e nomeie-o com "Calculadora" (qualquer tipo).',
    action:'Ir ao Playground', link:'playground.html',
    verifyType:'app_created', verifyHint:'Crie qualquer app no Playground',
    xp:80,  money:120,  diff:'Fácil',   color:'#22c55e', time:180 },
  { id:'ca2',  cat:'create', icon:'🎮', title:'Crie um App de Jogo',
    desc:'Crie um app com a categoria "Jogo" no Playground.',
    action:'Ir ao Playground', link:'playground.html',
    verifyType:'app_created', verifyHint:'Crie um app no Playground',
    xp:100, money:180,  diff:'Fácil',   color:'#22c55e', time:180 },
  { id:'ca3',  cat:'create', icon:'🤖', title:'Crie um App de IA',
    desc:'Crie um app com "IA" ou "Bot" no nome no Playground.',
    action:'Ir ao Playground', link:'playground.html',
    verifyType:'app_created', verifyHint:'Crie um app no Playground',
    xp:150, money:250,  diff:'Médio',   color:'#f59e0b', time:240 },
  { id:'ca4',  cat:'create', icon:'🛡️', title:'Crie uma Ferramenta Hacker',
    desc:'Vá ao Hacker Lab e crie uma nova ferramenta com poder acima de 70.',
    action:'Hacker Lab', link:'hacker.html',
    verifyType:'hack_tool_created', verifyHint:'Crie uma ferramenta no Hacker Lab',
    xp:200, money:320,  diff:'Médio',   color:'#f59e0b', time:240 },
  { id:'ca5',  cat:'create', icon:'🌐', title:'Crie um App de Rede Social',
    desc:'Crie um app com tema de rede social no Playground.',
    action:'Ir ao Playground', link:'playground.html',
    verifyType:'app_created', verifyHint:'Crie um app no Playground',
    xp:90,  money:140,  diff:'Fácil',   color:'#22c55e', time:180 },
  { id:'ca6',  cat:'create', icon:'🧬', title:'Crie um App Científico',
    desc:'Crie um app com tema científico no Playground.',
    action:'Ir ao Playground', link:'playground.html',
    verifyType:'app_created', verifyHint:'Crie um app no Playground',
    xp:180, money:300,  diff:'Difícil', color:'#ef4444', time:300 },
  { id:'ca7',  cat:'create', icon:'💰', title:'Crie um App Financeiro',
    desc:'Crie um app de banco ou carteira no Playground.',
    action:'Ir ao Playground', link:'playground.html',
    verifyType:'app_created', verifyHint:'Crie um app no Playground',
    xp:120, money:200,  diff:'Médio',   color:'#f59e0b', time:240 },
  { id:'ca8',  cat:'create', icon:'🎵', title:'Crie um App de Música',
    desc:'Crie um app de streaming ou produção musical no Playground.',
    action:'Ir ao Playground', link:'playground.html',
    verifyType:'app_created', verifyHint:'Crie um app no Playground',
    xp:80,  money:110,  diff:'Fácil',   color:'#22c55e', time:180 },
  { id:'ca9',  cat:'create', icon:'🚀', title:'Crie um App Espacial',
    desc:'Crie um app com tema espacial — nave, planeta, galáxia.',
    action:'Ir ao Playground', link:'playground.html',
    verifyType:'app_created', verifyHint:'Crie um app no Playground',
    xp:110, money:170,  diff:'Fácil',   color:'#22c55e', time:180 },
  { id:'ca10', cat:'create', icon:'⚡', title:'Maratona: 3 Apps Seguidos',
    desc:'Crie 3 apps diferentes no Playground antes do tempo acabar.',
    action:'Ir ao Playground', link:'playground.html',
    verifyType:'app_created', verifyHint:'Crie 3 apps no Playground',
    xp:350, money:600,  diff:'Lendário',color:'#a855f7', time:420 },
  // BUY
  { id:'co1', cat:'buy', icon:'🛒', title:'Compre um App da Loja',
    desc:'Vá à Loja e compre qualquer app disponível.',
    action:'Ir à Loja', link:'store.html',
    verifyType:'store_buy', verifyHint:'Compre um app na Loja',
    xp:60,  money:80,  diff:'Fácil',   color:'#22c55e', time:120 },
  { id:'co2', cat:'buy', icon:'💎', title:'Compre 3 Apps Diferentes',
    desc:'Compre 3 apps distintos na Loja.',
    action:'Ir à Loja', link:'store.html',
    verifyType:'store_buy', verifyHint:'Compre apps na Loja',
    xp:180, money:250, diff:'Médio',   color:'#f59e0b', time:300 },
  { id:'co3', cat:'buy', icon:'👑', title:'Compre o App Mais Caro',
    desc:'Encontre e compre o app com maior preço na Loja.',
    action:'Ir à Loja', link:'store.html',
    verifyType:'store_buy', verifyHint:'Compre um app na Loja',
    xp:250, money:400, diff:'Difícil', color:'#ef4444', time:300 },
  { id:'co4', cat:'buy', icon:'🆓', title:'Pegue Apps Grátis',
    desc:'Adquira qualquer app gratuito disponível na Loja.',
    action:'Ir à Loja', link:'store.html',
    verifyType:'store_buy', verifyHint:'Adquira um app gratuito na Loja',
    xp:70,  money:90,  diff:'Fácil',   color:'#22c55e', time:120 },
  // SIMULATE
  { id:'ex1', cat:'execute', icon:'🎬', title:'Renderize um Vídeo 8K',
    desc:'Nos Simuladores → Mídia, execute o Editor de Vídeo.',
    action:'Simuladores', link:'simuladores.html',
    verifyType:'sim_run', verifyHint:'Execute qualquer simulador',
    xp:50,  money:70,  diff:'Fácil',   color:'#22c55e', time:60 },
  { id:'ex2', cat:'execute', icon:'🤖', title:'Converse com a IA Fake',
    desc:'Nos Simuladores → IA, envie uma mensagem ao chatbot GPT-Fake-∞.',
    action:'Simuladores', link:'simuladores.html',
    verifyType:'sim_run', verifyHint:'Execute qualquer simulador',
    xp:40,  money:50,  diff:'Fácil',   color:'#22c55e', time:60 },
  { id:'ex3', cat:'execute', icon:'☁️', title:'Lance uma VM na Cloud',
    desc:'Nos Simuladores → Cloud, provisione uma instância VM.',
    action:'Simuladores', link:'simuladores.html',
    verifyType:'sim_run', verifyHint:'Execute qualquer simulador',
    xp:60,  money:90,  diff:'Fácil',   color:'#22c55e', time:60 },
  { id:'ex4', cat:'execute', icon:'☠️', title:'Execute uma Ferramenta Hacker',
    desc:'No Hacker Lab, clique em Executar em qualquer ferramenta.',
    action:'Hacker Lab', link:'hacker.html',
    verifyType:'hack_tool_created', verifyHint:'Crie ou execute ferramenta no Hacker Lab',
    xp:80,  money:120, diff:'Fácil',   color:'#22c55e', time:90 },
  { id:'ex5', cat:'execute', icon:'🔍', title:'Faça um Scan de Rede',
    desc:'Nos Simuladores → Redes, execute um Network Scan.',
    action:'Simuladores', link:'simuladores.html',
    verifyType:'sim_run', verifyHint:'Execute qualquer simulador',
    xp:90,  money:130, diff:'Médio',   color:'#f59e0b', time:120 },
  { id:'ex6', cat:'execute', icon:'🎮', title:'Batalha RPG',
    desc:'Nos Simuladores → Jogos, crie um personagem RPG com classe Lendária.',
    action:'Simuladores', link:'simuladores.html',
    verifyType:'sim_run', verifyHint:'Execute qualquer simulador',
    xp:100, money:150, diff:'Médio',   color:'#f59e0b', time:120 },
  { id:'ex7', cat:'execute', icon:'🏎️', title:'Vença uma Corrida',
    desc:'Nos Simuladores → Jogos → Corrida, participe de uma corrida.',
    action:'Simuladores', link:'simuladores.html',
    verifyType:'sim_run', verifyHint:'Execute qualquer simulador',
    xp:120, money:200, diff:'Médio',   color:'#f59e0b', time:120 },
  { id:'ex8', cat:'execute', icon:'🎵', title:'Produza uma Música',
    desc:'Nos Simuladores → Mídia → Música, crie uma faixa.',
    action:'Simuladores', link:'simuladores.html',
    verifyType:'sim_run', verifyHint:'Execute qualquer simulador',
    xp:55,  money:75,  diff:'Fácil',   color:'#22c55e', time:60 },
  { id:'ex9', cat:'execute', icon:'🌍', title:'Configure DNS Global',
    desc:'Nos Simuladores → Redes, configure um registro DNS.',
    action:'Simuladores', link:'simuladores.html',
    verifyType:'sim_run', verifyHint:'Execute qualquer simulador',
    xp:70,  money:100, diff:'Fácil',   color:'#22c55e', time:90 },
  { id:'ex10', cat:'execute', icon:'🔴', title:'Faça uma Live ao Vivo',
    desc:'Nos Simuladores → Mídia → Streamer, inicie uma live.',
    action:'Simuladores', link:'simuladores.html',
    verifyType:'sim_run', verifyHint:'Execute qualquer simulador',
    xp:130, money:220, diff:'Médio',   color:'#f59e0b', time:150 },
  // SPECIAL
  { id:'sp1', cat:'special', icon:'🌟', title:'Marathon: 5 Simuladores',
    desc:'Execute pelo menos 1 ação em cada uma das 5 abas dos Simuladores.',
    action:'Maratona!', link:'simuladores.html',
    verifyType:'sim_run', verifyHint:'Execute simuladores em todas as abas',
    xp:500, money:800, diff:'Lendário',color:'#a855f7', time:600 },
  { id:'sp2', cat:'special', icon:'🧠', title:'Hackathon Relâmpago',
    desc:'Crie um app E crie uma ferramenta hacker em menos de 3 minutos.',
    action:'Começar!', link:'playground.html',
    verifyType:'app_created', verifyHint:'Crie um app no Playground',
    xp:400, money:650, diff:'Lendário',color:'#a855f7', time:180 },
  { id:'sp3', cat:'special', icon:'💼', title:'Empresário Virtual',
    desc:'Crie um app no Playground e depois compre outro na Loja.',
    action:'Começar!', link:'playground.html',
    verifyType:'app_created', verifyHint:'Crie um app no Playground',
    xp:300, money:500, diff:'Difícil', color:'#ef4444', time:360 },
  { id:'sp4', cat:'special', icon:'🔒', title:'Infiltração Total',
    desc:'No Hacker Lab, use o terminal e execute os comandos: scan, status e run.',
    action:'Terminal →', link:'hacker.html',
    verifyType:'terminal_cmd', verifyHint:'Use o terminal no Hacker Lab',
    xp:250, money:420, diff:'Difícil', color:'#ef4444', time:300 },
  { id:'sp5', cat:'special', icon:'📊', title:'Analista de Dados',
    desc:'Crie um usuário na página Banco de Dados.',
    action:'Banco →', link:'database.html',
    verifyType:'db_user_created', verifyHint:'Crie um usuário no Banco de Dados',
    xp:160, money:240, diff:'Médio',   color:'#f59e0b', time:240 },
];

// ── Verify signal keys (set by other pages) ────────────────────
const VERIFY_KEYS = {
  app_created:      'cp_last_app_created',
  hack_tool_created:'cp_last_tool_created',
  sim_run:          'cp_last_sim_run',
  store_buy:        'cp_last_store_buy',
  terminal_cmd:     'cp_last_terminal_cmd',
  db_user_created:  'cp_last_db_user',
};

function getSignalTs(type) {
  return parseInt(localStorage.getItem(VERIFY_KEYS[type]) || '0', 10);
}

function checkVerified(mission) {
  const ts = getSignalTs(mission.verifyType);
  return ts >= mission.startedAt; // action happened AFTER mission was activated
}

// ── State ──────────────────────────────────────────────────────
const XP_PER_LVL = 500;
const MS = {
  get s() { try { return JSON.parse(localStorage.getItem('cp_missions')||'{}'); } catch { return {}; } },
  save(s) { localStorage.setItem('cp_missions', JSON.stringify(s)); },

  getPlayer() {
    try { const u = JSON.parse(localStorage.getItem('cp_user')||'null'); if(u) return u; } catch{}
    try {
      const cu = JSON.parse(localStorage.getItem('cp_currentUser')||'null');
      if(cu) return {username:cu.username||cu.name||'Jogador',wallet:cu.wallet||1000,xp:cu.xp||0,level:cu.level||1,avatar:cu.avatar||'👤'};
    } catch{}
    const s = this.s;
    return {username:'Visitante',wallet:s.wallet||1000,xp:s.xp||0,level:s.level||1,avatar:'👤'};
  },

  applyReward(xp, money) {
    const s = this.s;
    s.xp     = (s.xp||0)     + xp;
    s.wallet = (s.wallet||1000) + money;
    s.level  = 1 + Math.floor(s.xp / XP_PER_LVL);
    // propagate to local user if present
    try {
      const cu = JSON.parse(localStorage.getItem('cp_currentUser')||'null');
      if(cu){ cu.xp=(cu.xp||0)+xp; cu.wallet=(cu.wallet||1000)+money; cu.level=1+Math.floor(cu.xp/XP_PER_LVL); localStorage.setItem('cp_currentUser',JSON.stringify(cu)); }
    } catch{}
    this.save(s);
  },
  isLoggedIn() { return !!(localStorage.getItem('cp_token') && localStorage.getItem('cp_user')); }
};

// ── Timer ──────────────────────────────────────────────────────
let _timerInt = null;
function startTimer() {
  const s = MS.s;
  if (!s.nextRefresh || Date.now() > s.nextRefresh) generateMissions();
  if (_timerInt) clearInterval(_timerInt);
  _timerInt = setInterval(tick, 1000);
  tick();
}
function tick() {
  const s = MS.s;
  const rem = Math.max(0, Math.floor((s.nextRefresh - Date.now()) / 1000));
  const pct = ((MISSION_INTERVAL - rem) / MISSION_INTERVAL) * 100;
  const mm = String(Math.floor(rem/60)).padStart(2,'0');
  const ss = String(rem%60).padStart(2,'0');
  const el = document.getElementById('timerCount');
  const fill = document.getElementById('timerFill');
  if(el)   el.textContent = `${mm}:${ss}`;
  if(fill) fill.style.width = pct+'%';
  if(rem === 0) generateMissions();
  // Poll for real completions
  checkPendingCompletions();
}

// ── Generate ───────────────────────────────────────────────────
function generateMissions() {
  const s = MS.s;
  s.nextRefresh = Date.now() + MISSION_INTERVAL * 1000;
  const shuffled = [...MISSION_POOL].sort(()=>Math.random()-.5);
  s.active = shuffled.slice(0,4).map(m=>({
    ...m, instanceId: m.id+'_'+Date.now(),
    startedAt: Date.now(), deadline: Date.now()+m.time*1000, status:'active', notified:false
  }));
  MS.save(s); renderAll();
}

// ── Poll for real actions ──────────────────────────────────────
function checkPendingCompletions() {
  const s = MS.s;
  let changed = false;
  (s.active||[]).forEach(m => {
    if(m.status !== 'active') return;
    if(checkVerified(m)) { autoComplete(m, s); changed = true; }
    else if(Date.now() > m.deadline) { m.status='expired'; changed = true; }
  });
  if(changed){ MS.save(s); renderAll(); }
}

function autoComplete(m, s) {
  const elapsed = (Date.now() - m.startedAt) / 1000;
  const bonus = elapsed < 60 ? 1.5 : elapsed < 120 ? 1.2 : 1.0;
  const finalXP    = Math.round(m.xp    * bonus);
  const finalMoney = Math.round(m.money * bonus);
  m.status = 'done'; m.completedAt = Date.now(); m.earnedXP = finalXP; m.earnedMoney = finalMoney;
  s.completed = s.completed || [];
  s.completed.unshift({...m});
  if(s.completed.length > 50) s.completed = s.completed.slice(0,50);
  MS.applyReward(finalXP, finalMoney);
  showPopup(m, finalXP, finalMoney, bonus > 1);
  // Try to sync to backend
  syncRewardToBackend(finalXP, finalMoney);
}

async function syncRewardToBackend(xp, money) {
  const token = localStorage.getItem('cp_token');
  const base  = localStorage.getItem('cp_api_url') || 'https://codeplay-api.up.railway.app';
  if(!token) return;
  try {
    await fetch(base+'/api/missions/reward', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
      body: JSON.stringify({xp, money})
    });
    // refresh user from server
    const r = await fetch(base+'/api/auth/me',{headers:{'Authorization':'Bearer '+token}});
    if(r.ok){ const u = await r.json(); localStorage.setItem('cp_user', JSON.stringify(u)); renderHUD(); }
  } catch {}
}

// ── Missions object (page controls) ───────────────────────────
const Missions = {
  refreshNow() { generateMissions(); },
  closePopup() {
    document.getElementById('rewardPopup').classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
  },
  manualComplete(instanceId) {
    // Manual "confirm" button — only works if action was actually performed
    const s = MS.s;
    const m = (s.active||[]).find(x=>x.instanceId===instanceId);
    if(!m || m.status!=='active') return;
    if(!checkVerified(m)) {
      showToast('⚠️ '+m.verifyHint+' primeiro!', 'warn');
      return;
    }
    autoComplete(m, s); MS.save(s); renderAll();
  },
  skip(instanceId) {
    const s = MS.s;
    const m = (s.active||[]).find(x=>x.instanceId===instanceId);
    if(m){ m.status='skipped'; MS.save(s); renderAll(); }
  }
};

// ── Render ─────────────────────────────────────────────────────
function renderAll() { renderMissions(); renderHUD(); renderCompleted(); renderLeaderboard(); }

function renderMissions() {
  const s = MS.s;
  const active = (s.active||[]).filter(m=>m.status==='active');
  const badge  = document.getElementById('activeBadge');
  if(badge) badge.textContent = active.length;
  const grid = document.getElementById('activeMissions');
  if(!grid) return;
  if(!active.length){ grid.innerHTML='<p class="empty-hint">⏳ Aguardando próximo ciclo...</p>'; return; }
  grid.innerHTML = active.map(m=>{
    const rem = Math.max(0, Math.floor((m.deadline - Date.now())/1000));
    const mm = String(Math.floor(rem/60)).padStart(2,'0');
    const ss = String(rem%60).padStart(2,'0');
    const urg = rem < 30 ? 'mission-card--urgent' : rem < 60 ? 'mission-card--warning' : '';
    const verified = checkVerified(m);
    return `<div class="mission-card ${urg}" style="--m-color:${m.color}">
      <div class="mission-card__head">
        <span class="mission-icon">${m.icon}</span>
        <div class="mission-diff diff-${m.diff.toLowerCase()}">${m.diff}</div>
      </div>
      <h3 class="mission-title">${m.title}</h3>
      <p class="mission-desc">${m.desc}</p>
      <div class="mission-verify ${verified?'verified':'pending'}">
        ${verified ? '✅ Ação detectada — clique Confirmar para receber' : '🔴 Ação pendente: '+m.verifyHint}
      </div>
      <div class="mission-rewards">
        <span class="reward-xp">+${m.xp} XP</span>
        <span class="reward-money">+R$ ${m.money.toFixed(2)}</span>
      </div>
      <div class="mission-timer-mini">⏱️ ${mm}:${ss}</div>
      <div class="mission-actions">
        <a href="${m.link}" class="btn btn--primary btn--sm">🎯 ${m.action}</a>
        <button class="btn btn--sm btn--complete ${verified?'':'btn--locked'}" onclick="Missions.manualComplete('${m.instanceId}')">
          ${verified?'✅ Confirmar':'🔒 Complete a tarefa'}
        </button>
        <button class="btn btn--sm btn--skip" onclick="Missions.skip('${m.instanceId}')">⏭️</button>
      </div>
    </div>`;
  }).join('');
}

function renderHUD() {
  const p = MS.getPlayer();
  const s = MS.s;
  const xp     = s.xp     || p.xp     || 0;
  const wallet = s.wallet || p.wallet || 1000;
  const level  = 1 + Math.floor(xp / XP_PER_LVL);
  const set = (id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=v; };
  set('hudUsername', p.username||'Visitante');
  set('hudWallet',   'R$ '+wallet.toFixed(2));
  set('hudXP',       xp+' XP');
  set('hudLevel',    'Nível '+level);
  const xpInLvl = xp % XP_PER_LVL;
  const fill = document.getElementById('xpFill');
  const prog = document.getElementById('xpProgress');
  if(fill) fill.style.width = (xpInLvl/XP_PER_LVL*100)+'%';
  if(prog) prog.textContent = `${xpInLvl} / ${XP_PER_LVL} XP para nível ${level+1}`;
}

function renderCompleted() {
  const s = MS.s;
  const done = (s.completed||[]).slice(0,20);
  const badge = document.getElementById('doneBadge');
  if(badge) badge.textContent = (s.completed||[]).length;
  const log = document.getElementById('completedLog');
  if(!log) return;
  if(!done.length){ log.innerHTML='<p class="empty-hint">Nenhuma missão concluída ainda. Comece!</p>'; return; }
  log.innerHTML = done.map(m=>{
    const when = new Date(m.completedAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    return `<div class="log-row">
      <span class="log-icon">${m.icon}</span>
      <div class="log-info"><strong>${m.title}</strong><small>${m.diff} · ${when}</small></div>
      <div class="log-rewards">
        <span class="reward-xp">+${m.earnedXP} XP</span>
        <span class="reward-money">+R$ ${m.earnedMoney.toFixed(2)}</span>
      </div>
    </div>`;
  }).join('');
}

function renderLeaderboard() {
  const s = MS.s;
  const done = s.completed||[];
  const totalXP = done.reduce((a,m)=>a+(m.earnedXP||0),0);
  const totalM  = done.reduce((a,m)=>a+(m.earnedMoney||0),0);
  const p = MS.getPlayer();
  const board = [
    {rank:1,name:'ByteWizard99', xp:totalXP+4200, money:totalM+7800, avatar:'🧙'},
    {rank:2,name:'NullPointer',  xp:totalXP+2100, money:totalM+3900, avatar:'🤖'},
    {rank:3,name:'QuantumDev',   xp:totalXP+800,  money:totalM+1500, avatar:'🚀'},
    {rank:4,name:p.username||'Você', xp:totalXP, money:totalM, avatar:p.avatar||'👤', isPlayer:true},
  ];
  const el = document.getElementById('leaderboard');
  if(!el) return;
  el.innerHTML = board.map(e=>`
    <div class="lb-row ${e.isPlayer?'lb-row--you':''}">
      <span class="lb-rank">${['🥇','🥈','🥉','🎯'][e.rank-1]}</span>
      <span class="lb-avatar">${e.avatar}</span>
      <span class="lb-name">${e.name}${e.isPlayer?' (você)':''}</span>
      <span class="lb-xp">${e.xp} XP</span>
      <span class="lb-money">R$ ${e.money.toFixed(2)}</span>
    </div>`).join('');
}

function showPopup(m, xp, money, bonus) {
  document.getElementById('popupIcon').textContent  = m.icon;
  document.getElementById('popupDesc').textContent  = m.title;
  document.getElementById('popupRewards').innerHTML = `
    <div class="popup-reward-row">
      <span class="reward-xp big">+${xp} XP</span>
      <span class="reward-money big">+R$ ${money.toFixed(2)}</span>
      ${bonus?'<span class="bonus-badge">⚡ BÔNUS!</span>':''}
    </div>`;
  document.getElementById('rewardPopup').classList.remove('hidden');
  document.getElementById('overlay').classList.remove('hidden');
}

function showToast(msg, type='info') {
  let t = document.getElementById('toast');
  if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent=msg; t.className='toast toast--'+type+' toast--show';
  setTimeout(()=>t.classList.remove('toast--show'),3000);
}

// ── Boot ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{ renderAll(); startTimer(); });
