// ── CodePlay World Chat + Mission Broadcast System ───────────────
// Anything engine: generates missions every 5 min, narrates the world in real-time

const CHAT_MISSION_INTERVAL = 5 * 60 * 1000; // 5 minutes in ms
const XP_PER_LVL = 500;

// ── World narration templates ────────────────────────────────
const WORLD_EVENTS = [
  // server events
  { type:'server', icon:'🖥️',  texts: [
    'Os servidores do CodePlay estão processando {N} apps fictícios em paralelo.',
    'O datacenter virtual registrou {N} transações nos últimos 60 segundos.',
    'Sistema de monitoramento: uptime em {N}% nas últimas 24h.',
    'Cache do servidor foi renovado — {N} sessões ativas detectadas.',
    'Balanceador de carga distribuiu {N} requisições agora há pouco.',
  ]},
  // market events
  { type:'market', icon:'📈', texts: [
    'App "{APP}" disparou +{N}% de popularidade na loja!',
    'Nova tendência: apps de {CAT} estão bombando hoje.',
    'Marketplace registrou R$ {N} em transações nas últimas horas.',
    'App "{APP}" acabou de bater {N} downloads fictícios.',
    'Analistas preveem boom em apps de {CAT} para os próximos dias.',
  ]},
  // user activity
  { type:'user', icon:'👾', texts: [
    'Um desenvolvedor no Playground acabou de criar "{APP}".',
    '{USER} subiu para o Nível {N} no ranking!',
    '{USER} completou uma missão Lendária e ganhou {N} XP.',
    'Novo usuário "{USER}" entrou na plataforma pela primeira vez.',
    '{USER} comprou "{APP}" na loja por R$ {N}.',
  ]},
  // hacker events
  { type:'hacker', icon:'💀', texts: [
    'Atividade suspeita detectada: {N} tentativas de acesso ao servidor.',
    'Alerta: ferramenta "{HACK}" executada com poder {N} no Hacker Lab.',
    'Firewall virtual bloqueou {N} pacotes nos últimos 30s.',
    'Infiltração simulada detectada — origem: IP {IP}.',
    'Scanner de vulnerabilidades encontrou {N} portas abertas.',
  ]},
  // world alerts
  { type:'alert', icon:'⚡', texts: [
    'ALERTA: Pico de tráfego! {N} usuários simultâneos agora.',
    'Sistema de missões gerou {N} novas tarefas para a comunidade.',
    'Leaderboard atualizado — líder atual com {N} XP total.',
    'Evento especial em {N} minutos: missão lendária disponível!',
    'Banco de dados sincronizado: {N} usuários registrados.',
  ]},
];

const FAKE_USERS = ['ByteWolf_99','N3onViper','GhostPixel','DataPhantom','CipherX','NullByte_7','QuantumDev','PixelHunter','DarkCode','SyntaxError'];
const FAKE_APPS  = ['MegaCalc Pro','VirusX Scanner','CryptoVault','DataBender','NetSpy','BotMaster','CloudRider','PhantomOS','GridBreaker','NeoLauncher'];
const FAKE_CATS  = ['segurança','IA','jogos','finanças','redes','mídia','utilitários','científicos'];
const FAKE_HACKS = ['ShadowCrawler','ZeroDay Kit','PacketStorm','BruteShield','DeepScan'];
const FAKE_IPS   = ['192.168.1.{N}','10.0.{N}.1','172.16.{N}.255','203.0.113.{N}'];

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randN(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function buildWorldMessage() {
  const category = rnd(WORLD_EVENTS);
  let text = rnd(category.texts);
  const n = randN(12, 9999);
  const ip = rnd(FAKE_IPS).replace('{N}', randN(1, 254));
  text = text
    .replace('{N}',    n)
    .replace('{APP}',  rnd(FAKE_APPS))
    .replace('{CAT}',  rnd(FAKE_CATS))
    .replace('{USER}', rnd(FAKE_USERS))
    .replace('{HACK}', rnd(FAKE_HACKS))
    .replace('{IP}',   ip);
  return { icon: category.icon, type: category.type, text };
}

// ── Mission pool (same as missions.js, kept independent) ────
const CHAT_MISSION_POOL = [
  { id:'cm1',  icon:'📱', title:'Crie um App Qualquer',      desc:'Vá ao Playground e crie um app.',             link:'playground.html', xp:80,  money:120, diff:'Fácil',    color:'#22c55e', verifyType:'app_created',       time:180 },
  { id:'cm2',  icon:'🛡️', title:'Crie uma Ferramenta Hacker',desc:'Hacker Lab → nova ferramenta.',               link:'hacker.html',     xp:200, money:320, diff:'Médio',    color:'#f59e0b', verifyType:'hack_tool_created', time:240 },
  { id:'cm3',  icon:'🛒', title:'Compre um App da Loja',     desc:'Vá à Loja e compre qualquer app.',            link:'store.html',      xp:60,  money:80,  diff:'Fácil',    color:'#22c55e', verifyType:'store_buy',         time:120 },
  { id:'cm4',  icon:'🎬', title:'Execute um Simulador',      desc:'Simuladores → execute qualquer ação.',        link:'simuladores.html',xp:50,  money:70,  diff:'Fácil',    color:'#22c55e', verifyType:'sim_run',           time:60  },
  { id:'cm5',  icon:'💻', title:'Use o Terminal Hacker',     desc:'Hacker Lab → Terminal → scan, run ou status.',link:'hacker.html',     xp:250, money:420, diff:'Difícil',  color:'#ef4444', verifyType:'terminal_cmd',      time:300 },
  { id:'cm6',  icon:'🗄️', title:'Crie um Usuário no Banco',  desc:'Banco de Dados → Novo Usuário.',              link:'database.html',   xp:160, money:240, diff:'Médio',    color:'#f59e0b', verifyType:'db_user_created',   time:240 },
  { id:'cm7',  icon:'🤖', title:'Converse com a IA Fake',    desc:'Simuladores → IA → envie uma mensagem.',      link:'simuladores.html',xp:40,  money:50,  diff:'Fácil',    color:'#22c55e', verifyType:'sim_run',           time:60  },
  { id:'cm8',  icon:'🌟', title:'Maratona: 3 Apps Seguidos', desc:'Crie 3 apps diferentes no Playground.',       link:'playground.html', xp:350, money:600, diff:'Lendário', color:'#a855f7', verifyType:'app_created',       time:420 },
  { id:'cm9',  icon:'💰', title:'Compre 3 Apps Diferentes',  desc:'Compre 3 apps distintos na Loja.',            link:'store.html',      xp:180, money:250, diff:'Médio',    color:'#f59e0b', verifyType:'store_buy',         time:300 },
  { id:'cm10', icon:'🔴', title:'Faça uma Live ao Vivo',     desc:'Simuladores → Mídia → Streamer → inicie.',   link:'simuladores.html',xp:130, money:220, diff:'Médio',    color:'#f59e0b', verifyType:'sim_run',           time:150 },
];

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
  return getSignalTs(mission.verifyType) >= mission.startedAt;
}

// ── State helpers ────────────────────────────────────────────
const CS = {
  get s() { try { return JSON.parse(localStorage.getItem('cp_chat')||'{}'); } catch { return {}; } },
  save(s) { localStorage.setItem('cp_chat', JSON.stringify(s)); },
  getPlayer() {
    try { const u = JSON.parse(localStorage.getItem('cp_user')||'null'); if(u) return u; } catch {}
    try {
      const cu = JSON.parse(localStorage.getItem('cp_currentUser')||'null');
      if(cu) return { username: cu.username||cu.name||'Jogador', wallet: cu.wallet||1000, xp: cu.xp||0, level: cu.level||1, avatar: cu.avatar||'👤' };
    } catch {}
    return { username:'Visitante', wallet:1000, xp:0, level:1, avatar:'👤' };
  },
  applyReward(xp, money) {
    const s = this.s;
    const ms = JSON.parse(localStorage.getItem('cp_missions')||'{}');
    ms.xp = (ms.xp||0) + xp;
    ms.level = 1 + Math.floor(ms.xp / XP_PER_LVL);
    const cpW = parseFloat(localStorage.getItem('cp_wallet') || '1000');
    const newW = cpW + money;
    localStorage.setItem('cp_wallet', String(newW));
    ms.wallet = newW;
    localStorage.setItem('cp_missions', JSON.stringify(ms));
    try {
      const cu = JSON.parse(localStorage.getItem('cp_currentUser')||'null');
      if(cu) { cu.xp=(cu.xp||0)+xp; cu.wallet=newW; cu.level=1+Math.floor(cu.xp/XP_PER_LVL); localStorage.setItem('cp_currentUser',JSON.stringify(cu)); }
    } catch {}
  }
};

// ── Chat message queue ───────────────────────────────────────
let _chatMessages = [];
let _worldTimer = null;
let _missionTimer = null;
let _sidebarTick = null;
let _verifyPoll = null;

function addMessage(msg) {
  _chatMessages.push(msg);
  if (_chatMessages.length > 200) _chatMessages = _chatMessages.slice(-200);
  renderFeed();
}

function renderFeed() {
  const feed = document.getElementById('chatFeed');
  if (!feed) return;
  const scrolledToBottom = feed.scrollHeight - feed.scrollTop - feed.clientHeight < 60;
  feed.innerHTML = _chatMessages.map(m => {
    const timeStr = new Date(m.ts).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
    if (m.kind === 'system') {
      return `<div class="chat-msg chat-msg--system">
        <span class="msg-icon">${m.icon||'🌐'}</span>
        <div class="msg-body">
          <span class="msg-text">${m.text}</span>
          <span class="msg-time">${timeStr}</span>
        </div>
      </div>`;
    }
    if (m.kind === 'mission_announce') {
      return `<div class="chat-msg chat-msg--mission">
        <span class="msg-icon">🎯</span>
        <div class="msg-body">
          <span class="msg-label">NOVA MISSÃO</span>
          <span class="msg-text"><strong>${m.icon} ${m.title}</strong> — ${m.desc} <span class="reward-tag">+${m.xp} XP · R$ ${m.money.toFixed(2)}</span></span>
          <span class="msg-time">${timeStr}</span>
        </div>
      </div>`;
    }
    if (m.kind === 'user') {
      return `<div class="chat-msg chat-msg--user ${m.isMe ? 'chat-msg--me' : ''}">
        <span class="msg-avatar">${m.avatar||'👤'}</span>
        <div class="msg-body">
          <span class="msg-username">${m.username}</span>
          <span class="msg-text">${escapeHtml(m.text)}</span>
          <span class="msg-time">${timeStr}</span>
        </div>
      </div>`;
    }
    if (m.kind === 'mission_complete') {
      return `<div class="chat-msg chat-msg--complete">
        <span class="msg-icon">🏆</span>
        <div class="msg-body">
          <span class="msg-text"><strong>${m.username}</strong> completou <strong>${m.missionTitle}</strong> e ganhou <span class="reward-tag">+${m.xp} XP · R$ ${m.money.toFixed(2)}</span>!</span>
          <span class="msg-time">${timeStr}</span>
        </div>
      </div>`;
    }
    return '';
  }).join('');
  if (scrolledToBottom) feed.scrollTop = feed.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── World narrator ───────────────────────────────────────────
let _narratorInterval = null;
const NARRATOR_DELAYS = [4000, 7000, 11000, 15000, 20000]; // varied intervals for feel

function scheduleNextNarration() {
  const delay = NARRATOR_DELAYS[Math.floor(Math.random() * NARRATOR_DELAYS.length)];
  _narratorInterval = setTimeout(() => {
    const msg = buildWorldMessage();
    addMessage({ kind:'system', icon: msg.icon, text: msg.text, ts: Date.now() });
    scheduleNextNarration();
  }, delay);
}

// ── Mission generation ────────────────────────────────────────
function generateChatMissions() {
  const s = CS.s;
  s.nextMission = Date.now() + CHAT_MISSION_INTERVAL;
  const shuffled = [...CHAT_MISSION_POOL].sort(() => Math.random() - 0.5);
  s.currentMissions = shuffled.slice(0, 3).map(m => ({
    ...m,
    instanceId: m.id + '_' + Date.now(),
    startedAt: Date.now(),
    deadline: Date.now() + 60 * 1000, // 1 min to accept
    status: 'available',
  }));
  s.accepted = s.accepted || [];
  CS.save(s);

  // Announce each new mission in chat
  s.currentMissions.forEach((m, i) => {
    setTimeout(() => {
      addMessage({ kind:'mission_announce', icon: m.icon, title: m.title, desc: m.desc, xp: m.xp, money: m.money, ts: Date.now() });
    }, i * 600);
  });

  addMessage({ kind:'system', icon:'⏰', text:`Sistema gerou ${s.currentMissions.length} novas missões! Aceite no painel ao lado.`, ts: Date.now() });
  renderSidebar();
}

// ── Sidebar render ────────────────────────────────────────────
function renderSidebar() {
  renderSidebarMissions();
  renderAccepted();
  updateSidebarTimer();
}

function renderSidebarMissions() {
  const s = CS.s;
  const missions = (s.currentMissions || []).filter(m => m.status === 'available' && m.deadline > Date.now());
  const el = document.getElementById('sidebarMissions');
  if (!el) return;
  if (!missions.length) {
    el.innerHTML = '<p class="empty-hint">⏳ Aguardando próximo ciclo...</p>';
    return;
  }
  el.innerHTML = missions.map(m => {
    const rem = Math.max(0, Math.floor((m.deadline - Date.now()) / 1000));
    const mm = String(Math.floor(rem/60)).padStart(2,'0');
    const ss = String(rem%60).padStart(2,'0');
    return `<div class="sidebar-mission-card" style="--m-color:${m.color}">
      <div class="smc-head">
        <span class="smc-icon">${m.icon}</span>
        <div class="smc-info">
          <strong>${m.title}</strong>
          <small>${m.desc}</small>
        </div>
      </div>
      <div class="smc-foot">
        <span class="smc-rewards">+${m.xp} XP · R$ ${m.money.toFixed(2)}</span>
        <span class="smc-timer">⏱ ${mm}:${ss}</span>
        <button class="btn btn--primary btn--xs" onclick="Chat.accept('${m.instanceId}')">Aceitar</button>
      </div>
    </div>`;
  }).join('');
}

function renderAccepted() {
  const s = CS.s;
  const accepted = (s.accepted || []).filter(m => m.status === 'accepted' || m.status === 'in_progress');
  const el = document.getElementById('acceptedList');
  if (!el) return;
  if (!accepted.length) { el.innerHTML = '<p class="empty-hint">Nenhuma missão aceita ainda.</p>'; return; }
  el.innerHTML = accepted.map(m => {
    const verified = checkVerified(m);
    return `<div class="accepted-card ${verified ? 'accepted-card--ready' : ''}">
      <div class="ac-head">
        <span>${m.icon} <strong>${m.title}</strong></span>
      </div>
      <div class="ac-foot">
        <a href="${m.link}" class="btn btn--sm btn--outline">Ir →</a>
        ${verified
          ? `<button class="btn btn--sm btn--primary" onclick="Chat.complete('${m.instanceId}')">✅ Confirmar</button>`
          : `<span class="verify-hint">🔴 ${getVerifyLabel(m.verifyType)}</span>`
        }
        <button class="btn btn--sm btn--danger-outline" onclick="Chat.reject('${m.instanceId}')" title="Rejeitar missão">✖ Rejeitar</button>
      </div>
    </div>`;
  }).join('');
}

function getVerifyLabel(vt) {
  const map = {
    app_created:'Crie um app no Playground',
    hack_tool_created:'Crie uma ferramenta no Hacker Lab',
    sim_run:'Execute um simulador',
    store_buy:'Compre um app na Loja',
    terminal_cmd:'Use o terminal no Hacker Lab',
    db_user_created:'Crie um usuário no Banco de Dados',
  };
  return map[vt] || 'Complete a tarefa';
}

function updateSidebarTimer() {
  const s = CS.s;
  const rem = Math.max(0, Math.floor(((s.nextMission || Date.now()) - Date.now()) / 1000));
  const mm = String(Math.floor(rem/60)).padStart(2,'0');
  const ss = String(rem%60).padStart(2,'0');
  const el = document.getElementById('sidebarTimer');
  if (el) el.textContent = `${mm}:${ss}`;
}

// ── Chat main object ──────────────────────────────────────────
const Chat = {
  accept(instanceId) {
    const s = CS.s;
    s.accepted = s.accepted || [];
    // ── Limite de 3 missões aceitas ──
    const activeCount = s.accepted.filter(m => m.status === 'accepted' || m.status === 'in_progress').length;
    if (activeCount >= 3) {
      addMessage({ kind:'system', icon:'⚠️', text:'Você já tem 3 missões ativas. Conclua ou rejeite uma antes de aceitar outra.', ts: Date.now() });
      return;
    }
    const idx = (s.currentMissions||[]).findIndex(m => m.instanceId === instanceId);
    if (idx === -1) return;
    const m = s.currentMissions[idx];
    m.status = 'accepted';
    // avoid duplicates
    if (!s.accepted.find(a => a.instanceId === instanceId)) {
      s.accepted.push({ ...m, status:'accepted' });
    }
    s.currentMissions.splice(idx, 1);
    CS.save(s);

    const p = CS.getPlayer();
    addMessage({ kind:'system', icon: m.icon, text:`${p.username||'Você'} aceitou a missão: "${m.title}". Boa sorte! ⚡`, ts: Date.now() });
    renderSidebar();
  },

  reject(instanceId) {
    const s = CS.s;
    s.accepted = (s.accepted || []).filter(m => m.instanceId !== instanceId);
    CS.save(s);
    renderSidebar();
  },

  complete(instanceId) {
    const s = CS.s;
    const acc = (s.accepted||[]);
    const m = acc.find(a => a.instanceId === instanceId);
    if (!m) return;
    if (!checkVerified(m)) {
      this._toast('⚠️ ' + getVerifyLabel(m.verifyType) + ' primeiro!', 'warn');
      return;
    }
    const elapsed = (Date.now() - m.startedAt) / 1000;
    const bonus = elapsed < 60 ? 1.5 : elapsed < 120 ? 1.2 : 1.0;
    const finalXP    = Math.round(m.xp    * bonus);
    const finalMoney = Math.round(m.money * bonus);
    m.status = 'done';
    CS.applyReward(finalXP, finalMoney);
    CS.save(s);

    const p = CS.getPlayer();
    addMessage({ kind:'mission_complete', username: p.username||'Você', missionTitle: m.title, xp: finalXP, money: finalMoney, ts: Date.now() });

    // Show popup
    document.getElementById('popupIcon').textContent = m.icon;
    document.getElementById('popupDesc').textContent = m.title;
    document.getElementById('popupRewards').innerHTML = `
      <div class="popup-reward-row">
        <span class="reward-xp big">+${finalXP} XP</span>
        <span class="reward-money big">+R$ ${finalMoney.toFixed(2)}</span>
        ${bonus > 1 ? '<span class="bonus-badge">⚡ BÔNUS!</span>' : ''}
      </div>`;
    document.getElementById('rewardPopup').classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');

    // Remove from accepted
    s.accepted = acc.filter(a => a.instanceId !== instanceId);
    CS.save(s);
    renderSidebar();
  },

  send() {
    const input = document.getElementById('chatInput');
    const text = (input.value || '').trim();
    if (!text) return;
    const p = CS.getPlayer();
    addMessage({ kind:'user', username: p.username||'Visitante', avatar: p.avatar||'👤', text, ts: Date.now(), isMe: true });
    input.value = '';
    input.focus();

    // Anything system replies after a short delay
    setTimeout(() => this._anythingReply(text, p), randN(1200, 3000));
  },

  _anythingReply(userText, player) {
    const replies = [
      `Interessante, ${player.username||'dev'}. O mundo CodePlay registrou sua mensagem.`,
      `Sinal recebido. ${randN(3,18)} outros usuários estão online agora.`,
      `O oráculo do servidor diz: "${rnd(['continue','explore','hack the planet','create more apps','trust the process'])}".`,
      `Transmissão captada. Algo grande está chegando em ${randN(1,9)} minutos.`,
      `O sistema Anything processou: "${userText.slice(0,30)}..." — relevância: ${randN(70,99)}%.`,
      `Nota registrada no log do mundo #${randN(1000,9999)}.`,
      `Eco do servidor: ${randN(2,8)} desenvolvedores leram sua mensagem.`,
      `O marketplace ficou ${randN(1,5)}% mais volátil com isso.`,
    ];
    addMessage({ kind:'system', icon:'🤖', text: `[Anything] ${rnd(replies)}`, ts: Date.now() });
  },

  closePopup() {
    document.getElementById('rewardPopup').classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
  },

  _toast(msg, type='info') {
    let t = document.getElementById('chatToast');
    if (!t) { t = document.createElement('div'); t.id='chatToast'; t.className='toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'toast toast--' + type + ' toast--show';
    setTimeout(() => t.classList.remove('toast--show'), 3000);
  }
};

// Enter key support
function handleChatKey(e) {
  if (e.key === 'Enter') Chat.send();
}

// ── Polling for accepted mission completions ──────────────────
function pollAcceptedMissions() {
  const s = CS.s;
  const accepted = (s.accepted||[]).filter(m => m.status === 'accepted');
  accepted.forEach(m => {
    if (checkVerified(m) && m.status !== 'in_progress') {
      m.status = 'in_progress';
      CS.save(s);
      addMessage({ kind:'system', icon:'✅', text:`Ação detectada para "${m.title}"! Volte ao Chat e clique Confirmar para receber a recompensa.`, ts: Date.now() });
      renderSidebar();
    }
    // Only expire missions still in the "available" pool, never accepted/in_progress
    if (Date.now() > m.deadline && m.status === 'available') {
      m.status = 'expired';
      CS.save(s);
      renderSidebar();
    }
  });
  // Remove expired only from the available pool (never touch accepted missions)
  const before = (s.currentMissions||[]).length;
  s.currentMissions = (s.currentMissions||[]).filter(m => m.status !== 'expired');
  if ((s.currentMissions||[]).length !== before) { CS.save(s); renderSidebar(); }
}

// ── Mission cycle timer ───────────────────────────────────────
function missionCycleTick() {
  const s = CS.s;
  updateSidebarTimer();
  if (!s.nextMission || Date.now() >= s.nextMission) {
    generateChatMissions();
  }
  renderSidebarMissions();
  renderAccepted();
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('chatInput');
  if (input) input.addEventListener('keydown', handleChatKey);

  // Set player avatar in input row
  const p = CS.getPlayer();
  const avatarEl = document.getElementById('inputAvatar');
  if (avatarEl) avatarEl.textContent = p.avatar || '👤';

  // Welcome messages
  setTimeout(() => {
    addMessage({ kind:'system', icon:'🌐', text:'Bem-vindo ao Chat Mundial do CodePlay. O sistema Anything está ativo.', ts: Date.now() });
  }, 300);
  setTimeout(() => {
    addMessage({ kind:'system', icon:'🤖', text:`[Anything] Olá, ${p.username||'visitante'}. Estou monitorando o mundo e gerando missões a cada 5 minutos.`, ts: Date.now() });
  }, 1200);
  setTimeout(() => {
    const msg = buildWorldMessage();
    addMessage({ kind:'system', icon: msg.icon, text: msg.text, ts: Date.now() });
  }, 2500);

  // Start world narrator (recurring random messages)
  scheduleNextNarration();

  // Mission cycle: check every second
  const s = CS.s;
  if (!s.nextMission || Date.now() >= s.nextMission) {
    setTimeout(() => generateChatMissions(), 3000); // generate after welcome msgs
  }
  setInterval(missionCycleTick, 1000);

  // Poll accepted missions every 2s
  setInterval(pollAcceptedMissions, 2000);

  // Pulse animation
  let pulse = true;
  setInterval(() => {
    const el = document.getElementById('chatPulse');
    if (el) { el.style.opacity = pulse ? '1' : '0.3'; pulse = !pulse; }
  }, 1000);

  renderSidebar();
});
