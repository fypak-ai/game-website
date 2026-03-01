// ── Shared State (localStorage) ─────────────
const State = {
  WALLET_KEY: 'cp_wallet',
  USERS_KEY: 'cp_users',
  APPS_KEY: 'cp_apps',
  OWNED_KEY: 'cp_owned',
  SEEDED_KEY: 'cp_seeded',

  getWallet() { return parseFloat(localStorage.getItem(this.WALLET_KEY) ?? '1000'); },
  setWallet(v) { localStorage.setItem(this.WALLET_KEY, v); State.updateWalletUI(); },
  addBalance(v) { State.setWallet(State.getWallet() + v); },
  deductBalance(v) { State.setWallet(State.getWallet() - v); },

  getUsers() { try { return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]'); } catch { return []; } },
  setUsers(arr) { localStorage.setItem(this.USERS_KEY, JSON.stringify(arr)); },

  getApps() { try { return JSON.parse(localStorage.getItem(this.APPS_KEY) || '[]'); } catch { return []; } },
  setApps(arr) { localStorage.setItem(this.APPS_KEY, JSON.stringify(arr)); },

  getOwned() { try { return JSON.parse(localStorage.getItem(this.OWNED_KEY) || '[]'); } catch { return []; } },
  setOwned(arr) { localStorage.setItem(this.OWNED_KEY, JSON.stringify(arr)); },
  isOwned(id) { return State.getOwned().includes(id); },
  addOwned(id) { const o = State.getOwned(); if (!o.includes(id)) { o.push(id); State.setOwned(o); } },

  updateWalletUI() {
    document.querySelectorAll('.wallet-amount').forEach(el => {
      el.textContent = 'R$ ' + State.getWallet().toFixed(2).replace('.', ',');
    });
    const wd = document.getElementById('walletDisplay');
    if (wd) wd.textContent = 'R$ ' + State.getWallet().toFixed(2).replace('.', ',');
  },

  seedApps() {
    if (localStorage.getItem(this.SEEDED_KEY) === '5') return;
    const seed = [
      { id: 'seed_tracker', name: 'Rastreador de Credenciais', 
        desc: 'App hacker fictício — rastreie logins e senhas fictícias de qualquer usuário do CodePlay.',
        price: 520, category: 'Segurança',
        code: '// App especial — abre o Rastreador de Credenciais',
        logo: { emoji: '🔍', color: '#7c3aed' },
        launchUrl: 'tracker.html',
        createdAt: Date.now() - 86400000 * 30 },
      { id: 'seed_1', name: 'SuperCalc', desc: 'Calculadora fictícia com suporte a operações avançadas e histórico de cálculos.', price: 9.90, category: 'Utilitário', code: 'function main() {\n  const ops = [2+2, 10*5, 100/4];\n  return ops.map(r => "= " + r).join("\\n");\n}', logo: { emoji: "🚀", color: "#7c3aed" }, createdAt: Date.now() - 86400000 * 5 },
      { id: 'seed_2', name: 'MegaQuiz', desc: 'Jogo de perguntas e respostas com 100 categorias fictícias e ranking online.', price: 19.90, category: 'Jogo', code: 'function main() {\n  const perguntas = ["Qual a capital da França?", "Quanto é 7x8?"];\n  return "Quiz iniciado com " + perguntas.length + " perguntas!";\n}', logo: { emoji: "🎮", color: "#2563eb" }, createdAt: Date.now() - 86400000 * 4 },
      { id: 'seed_3', name: 'SocialHub', desc: 'Rede social fictícia para conectar personagens imaginários do seu universo.', price: 0, category: 'Social', code: 'function main() {\n  return "Bem-vindo ao SocialHub! 42 amigos online.";\n}', logo: { emoji: "💡", color: "#059669" }, createdAt: Date.now() - 86400000 * 3 },
      { id: 'seed_4', name: 'FinanceiroX', desc: 'Gerencie finanças fictícias, crie orçamentos e simule investimentos virtuais.', price: 29.90, category: 'Finanças', code: 'function main() {\n  const saldo = 1500.00;\n  const rendimento = saldo * 0.012;\n  return "Rendimento mensal: R$ " + rendimento.toFixed(2);\n}', logo: { emoji: "💰", color: "#d97706" }, createdAt: Date.now() - 86400000 * 2 },
      { id: 'seed_5', name: 'EduLearn', desc: 'Plataforma de aprendizado fictício com cursos, certificados e gamificação.', price: 14.90, category: 'Educação', code: 'function main() {\n  const cursos = ["JS Básico", "CSS Avançado", "React Fictício"];\n  return cursos.map((c,i) => (i+1)+". "+c).join("\\n");\n}', logo: { emoji: "🎯", color: "#9333ea" }, createdAt: Date.now() - 86400000 },
      { id: 'seed_6', name: 'TaskMaster', desc: 'Gerenciador de tarefas fictício com IA integrada e sincronização em nuvem imaginária.', price: 4.90, category: 'Produtividade', code: 'function main() {\n  const tarefas = ["Comprar leite", "Estudar JS", "Dormir cedo"];\n  return "Tarefas pendentes: " + tarefas.length;\n}', logo: { emoji: "⚡", color: "#dc2626" }, createdAt: Date.now() - 3600000 },
      { id: 'seed_7', name: 'PixelArt Pro', desc: 'Editor de pixel art fictício com paleta de 16M de cores e exportação em NFT imaginário.', price: 39.90, category: 'Utilitário', code: 'function main() {\n  const canvas = Array(8).fill(null).map(() => Array(8).fill("⬛"));\n  canvas[3][3] = "🟥"; canvas[3][4] = "🟥";\n  return canvas.map(r => r.join("")).join("\\n");\n}', logo: { emoji: "🎨", color: "#0891b2" }, createdAt: Date.now() - 7200000 },
      { id: 'seed_8', name: 'ChatBot AI', desc: 'IA conversacional fictícia que responde perguntas sobre o universo imaginário do CodePlay.', price: 49.90, category: 'Utilitário', code: 'function main() {\n  const respostas = ["Olá! Sou uma IA fictícia.", "Posso ajudar com tudo que não existe!", "Meu conhecimento vai até 2099."];\n  return respostas[Math.floor(Math.random()*respostas.length)];\n}', logo: { emoji: "🤖", color: "#7c3aed" }, createdAt: Date.now() - 10800000 },
      { id: 'seed_cloak', name: 'Manto Invisível',
        desc: 'Ativa um escudo de anonimato por 10 minutos — seus apps ficam ocultos no Rastreador de Credenciais. Para renovar, execute novamente.',
        price: 1000, category: 'Segurança',
        code: '// App especial — ativa cloaking no rastreador por 10 minutos',
        logo: { emoji: '🔒', color: '#ef4444' },
        cloakAction: true,
        createdAt: Date.now() - 86400000 * 7 },
,
    { id: 'seed_cloner', name: 'Clonador de App',
      desc: '⚠️ USO ÚNICO — Clona um dos seus apps, gerando uma cópia idêntica com novo ID. Após o uso, o Clonador desaparece permanentemente da sua conta.',
      price: 1500, category: 'Utilitários',
      code: '// App especial — uso único. Clona um app da sua conta.',
      logo: { emoji: '🧬', color: '#0891b2' },
      cloneAction: true,
      oneUse: true,
      createdAt: Date.now() - 86400000 * 3 }
    ];
    // Merge: keep user-created apps, just add missing seed apps
    const existing = State.getApps();
    const existingIds = existing.map(a => a.id);
    const toAdd = seed.filter(a => !existingIds.includes(a.id));
    State.setApps([...toAdd, ...existing]);
    localStorage.setItem(this.SEEDED_KEY, '5'); // v5: cloner app (1-use, 1500 moedas) // v4: cloak app + R$1000 create cost
  }
};

// ── Logo Generator ───────────────────────────
const LogoGen = {
  EMOJIS: ['🚀','💡','⚡','🔥','🎮','🛠️','📊','🔐','🎯','💎','🌐','🤖','📱','🎨','💰'],
  COLORS: ['#7c3aed','#2563eb','#059669','#d97706','#dc2626','#7c3aed','#0891b2','#9333ea'],
  // Detect language/theme from code and return a matching emoji + color
  detectFromCode(code) {
    if (!code) return null;
    const c = code.toLowerCase();
    // Java
    if (/import\s+javax?\./.test(c) || /public\s+class\s+\w+/.test(c) || /system\.out\.print/.test(c)) {
      if (/swing|jframe|jbutton|jpanel|awt/.test(c)) return { emoji: '🖥️', color: '#f59e0b' };
      if (/random|math\.random/.test(c))            return { emoji: '🎲', color: '#8b5cf6' };
      if (/thread|runnable|executor/.test(c))        return { emoji: '⚙️', color: '#6366f1' };
      if (/socket|http|url|network/.test(c))         return { emoji: '🌐', color: '#0891b2' };
      if (/file|stream|io\./.test(c))               return { emoji: '📁', color: '#059669' };
      return { emoji: '☕', color: '#f59e0b' }; // generic Java
    }
    // Python
    if (/^\s*def |^\s*import |^\s*from .+ import/m.test(c)) {
      if (/pygame|tkinter|wx/.test(c))   return { emoji: '🐍', color: '#3b82f6' };
      if (/flask|django|fastapi/.test(c)) return { emoji: '🌐', color: '#10b981' };
      if (/numpy|pandas|sklearn/.test(c)) return { emoji: '📊', color: '#8b5cf6' };
      return { emoji: '🐍', color: '#f59e0b' };
    }
    // C / C++
    if (/#include\s*</.test(c) || /int\s+main\s*\(/.test(c)) {
      return { emoji: '⚡', color: '#dc2626' };
    }
    // Game keywords
    if (/jogo|game|play|score|level|player/.test(c)) return { emoji: '🎮', color: '#2563eb' };
    // AI/ML
    if (/ia|ai|neural|model|predict|train/.test(c)) return { emoji: '🤖', color: '#7c3aed' };
    // Finance
    if (/money|wallet|bank|invest|saldo|financ/.test(c)) return { emoji: '💰', color: '#d97706' };
    // Video/media
    if (/video|image|audio|frame|pixel|buffered/.test(c)) return { emoji: '🎬', color: '#0891b2' };
    return null;
  },
  generate(name, code) {
    const fromCode = code ? this.detectFromCode(code) : null;
    if (fromCode) return fromCode;
    const idx = name.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
    return {
      emoji: this.EMOJIS[idx % this.EMOJIS.length],
      color: this.COLORS[idx % this.COLORS.length]
    };
  }
};

// ── UI Helpers ───────────────────────────────
const UI = {
  showTab(id) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    const content = document.getElementById(id);
    if (content) content.classList.add('active');
    document.querySelectorAll('.tab').forEach(el => {
      if (el.getAttribute('data-tab') === id) el.classList.add('active');
    });
  },
  closeModal() { document.getElementById('appModal')?.classList.add('hidden'); },
  openModal(app) {
    const modal = document.getElementById('appModal');
    if (!modal) return;
    document.getElementById('modalTitle').textContent = app.logo.emoji + ' ' + app.name;
    const codeEl = document.getElementById('modalCode');
    const outEl  = document.getElementById('appOutput');
    const frameEl = document.getElementById('appFrame');
    const btnEl  = document.getElementById('runAppBtn');
    // Reset state
    if (outEl)   { outEl.classList.add('hidden'); outEl.textContent = ''; }
    if (frameEl) { frameEl.classList.add('hidden'); frameEl.src = ''; }
    if (app.launchUrl) {
      // Special app: launches a full page inside modal
      if (codeEl) { codeEl.textContent = ''; codeEl.style.display = 'none'; }
      if (btnEl)  { btnEl.textContent = '🚀 Abrir App'; }
    } else {
      if (codeEl) { codeEl.textContent = app.code || ''; codeEl.style.display = ''; }
      if (btnEl)  { btnEl.textContent = '▶ Executar'; }
    }
    modal._currentApp = app;
    // ── One-use warning ──
    const oneUseWarn = document.getElementById('oneUseWarning');
    if (oneUseWarn) oneUseWarn.style.display = (app.oneUse || app.cloneAction) ? 'block' : 'none';
    modal.classList.remove('hidden');
  }
};

// ── App Store Core ───────────────────────────
const AppStore = {
  createApp(e) {
    e.preventDefault();
    const name = document.getElementById('appName').value.trim();
    const desc = document.getElementById('appDesc').value.trim();
    const price = parseFloat(document.getElementById('appPrice').value);
    const category = document.getElementById('appCategory').value;
    const code = document.getElementById('appCode').value.trim();
    if (!name || !desc || !code) return;
    // ── Custo de publicação: R$1.000 ──
    const CREATE_COST = 1000;
    if (State.getWallet() < CREATE_COST) {
      const result = document.getElementById('createResult');
      if (result) {
        result.textContent = '❌ Saldo insuficiente! Publicar um app custa R$ 1.000,00.';
        result.className = 'result-msg error';
        result.classList.remove('hidden');
      }
      return;
    }
    State.deductBalance(CREATE_COST);
    const logo = LogoGen.generate(name, code);
    const app = { id: 'app_' + Date.now(), name, desc, price, category, code, logo, createdAt: Date.now() };
    const apps = State.getApps();
    apps.unshift(app);
    State.setApps(apps);
    const result = document.getElementById('createResult');
    if (result) {
      result.textContent = '✅ App "' + name + '" publicado! R$ 1.000,00 descontados da carteira.';
      result.className = 'result-msg success';
      result.classList.remove('hidden');
    }
    e.target.reset();
    const preview = document.getElementById('appLogoPreview');
    if (preview) { preview.textContent = '?'; preview.style.background = ''; }
    if (typeof renderCreatedApps === 'function') renderCreatedApps();
    if (typeof Store !== 'undefined') Store.render();
  },
  runApp() {
    const modal = document.getElementById('appModal');
    const app = modal?._currentApp;
    if (!app) return;
    // ── Special launch-URL apps ──
    if (app.launchUrl) {
      const frameEl = document.getElementById('appFrame');
      const outEl   = document.getElementById('appOutput');
      const codeEl  = document.getElementById('modalCode');
      if (outEl)   outEl.classList.add('hidden');
      if (codeEl)  codeEl.style.display = 'none';
      if (frameEl) {
        frameEl.src = app.launchUrl;
        frameEl.classList.remove('hidden');
        frameEl.style.cssText = 'width:100%;height:70vh;border:none;border-radius:12px;margin-top:.75rem;';
      }
      return;
    }
    // ── Cloak Action apps ──
    if (app.cloakAction) {
      const currentUser = (() => { try { return JSON.parse(localStorage.getItem('cp_currentUser') || 'null'); } catch { return null; } })();
      if (!currentUser) { alert('Faça login para usar o Manto Invisível.'); return; }
      const cloak = { until: Date.now() + 10 * 60 * 1000, appName: app.name };
      localStorage.setItem('cp_cloak_' + currentUser.username.toLowerCase(), JSON.stringify(cloak));
      // Show activation confirmation in app modal output
      const output = document.getElementById('appOutput');
      const frameEl = document.getElementById('appFrame');
      if (frameEl) frameEl.classList.add('hidden');
      if (output) {
        output.classList.remove('hidden');
        const until = new Date(cloak.until).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
        output.innerHTML = `<div style="padding:1.5rem;text-align:center;line-height:2">
          <div style="font-size:3rem">🔒</div>
          <div style="font-size:1.1rem;font-weight:700;color:#ef4444;margin:.5rem 0">MANTO INVISÍVEL ATIVADO</div>
          <div style="color:#aaa;font-size:.85rem">Seus apps estão ocultos no Rastreador de Credenciais.</div>
          <div style="color:#aaa;font-size:.85rem;margin-top:.5rem">Expira às <strong style="color:#fff">${until}</strong> (10 minutos)</div>
          <div style="color:#555;font-size:.75rem;margin-top:1rem">Execute novamente para renovar o tempo.</div>
        </div>`;
      }
      return;
    }
    // ── Clone Action apps (1 uso) ──
    if (app.cloneAction) {
      const currentUser = (() => { try { return JSON.parse(localStorage.getItem('cp_currentUser') || 'null'); } catch { return null; } })();
      if (!currentUser) { alert('Faça login para usar o Clonador.'); return; }
      // Gather user's owned apps (excluding seed_cloner itself and other special apps)
      const allApps = State.getApps();
      const owned = State.getOwned();
      const clonable = allApps.filter(a => a.id !== 'seed_cloner' && !a.cloneAction && !a.cloakAction);
      const output = document.getElementById('appOutput');
      const frameEl = document.getElementById('appFrame');
      if (frameEl) frameEl.classList.add('hidden');
      if (!output) return;
      output.classList.remove('hidden');
      if (clonable.length === 0) {
        output.innerHTML = `<div style="padding:1.5rem;text-align:center;line-height:2">
          <div style="font-size:3rem">🧬</div>
          <div style="font-size:1rem;font-weight:700;color:#f59e0b;margin:.5rem 0">NENHUM APP PARA CLONAR</div>
          <div style="color:#aaa;font-size:.85rem">Você não possui apps elegíveis na sua conta.<br>Compre apps na loja primeiro.</div>
        </div>`;
        return;
      }
      // Build selection UI
      const optionsHtml = clonable.map(a =>
        `<button onclick="window._doCloneApp('${a.id}')" style="display:block;width:100%;margin:.35rem 0;padding:.6rem 1rem;background:#1e293b;border:1px solid #334155;border-radius:8px;color:#f1f5f9;cursor:pointer;text-align:left;font-size:.9rem;">
          ${(a.logo && a.logo.emoji) ? a.logo.emoji : '📦'} ${a.name}
        </button>`
      ).join('');
      output.innerHTML = `<div style="padding:1.25rem">
        <div style="font-size:1.8rem;text-align:center;margin-bottom:.5rem">🧬</div>
        <div style="font-weight:700;color:#38bdf8;text-align:center;margin-bottom:.25rem">CLONADOR DE APP</div>
        <div style="color:#f59e0b;font-size:.8rem;text-align:center;margin-bottom:1rem">⚠️ USO ÚNICO — Escolha o app a ser clonado:</div>
        ${optionsHtml}
      </div>`;
      // One-use executor
      window._doCloneApp = function(sourceId) {
        const src = State.getApps().find(a => a.id === sourceId);
        if (!src) return;
        // Create clone
        const clone = Object.assign({}, src, {
          id: 'clone_' + Date.now(),
          name: 'Clone de ' + src.name,
          desc: '[CLONADO] ' + (src.desc || ''),
          createdAt: Date.now()
        });
        // Add clone to apps list and to owned
        const apps = State.getApps();
        apps.unshift(clone);
        State.setApps(apps);
        State.addOwned(clone.id);
        // Remove seed_cloner from owned and from apps (1-use: gone after use)
        const newOwned = State.getOwned().filter(id => id !== 'seed_cloner');
        State.setOwned(newOwned);
        const appsAfter = State.getApps().filter(a => a.id !== 'seed_cloner');
        State.setApps(appsAfter);
        // Show success
        output.innerHTML = `<div style="padding:1.5rem;text-align:center;line-height:2">
          <div style="font-size:3rem">✅</div>
          <div style="font-size:1rem;font-weight:700;color:#22c55e;margin:.5rem 0">APP CLONADO COM SUCESSO!</div>
          <div style="color:#aaa;font-size:.85rem">"${clone.name}" foi adicionado à sua conta.</div>
          <div style="color:#ef4444;font-size:.78rem;margin-top:.75rem">O Clonador foi consumido e removido permanentemente.</div>
        </div>`;
        delete window._doCloneApp;
        // refresh store/dashboard if open
        if (typeof Store !== 'undefined' && Store.render) Store.render();
      };
      return;
    }
    // ── Regular JS apps — sandbox iframe approach ──
    const output = document.getElementById('appOutput');
    const frameEl = document.getElementById('appFrame');
    if (!output) return;

    const code = app.code || '';

        // ── Detect Java / Python / C++ compiled languages ──
    const trimmed = code.trim();
    const isJava   = /import\s+javax?\./.test(code) || /public\s+class\s+\w+/.test(code) || /System\.out\.print/.test(code);
    const isPython = /^\s*def |^\s*import |^\s*from .+ import/m.test(code) && !/^\s*(const|let|var|function)/.test(code);
    const isCpp    = /#include\s*</.test(code) && /int\s+main\s*\(/.test(code);

    if (isJava || isPython || isCpp) {
      const lang = isJava ? 'Java' : isPython ? 'Python' : 'C++';
      const classMatch = code.match(/public\s+class\s+(\w+)/) || code.match(/class\s+(\w+)/);
      const className  = classMatch ? classMatch[1] : (app.name || 'Programa');
      const lc = code.toLowerCase();

      // ── Smart UI: detect functional pattern and render real interactive app ──
      let interactiveHtml = null;

      // ── CALCULADORA ── (Scanner + switch on operacao + soma/subtração/multiplicação/divisão)
      if (/scanner|nextint|nextdouble/.test(lc) && /soma|subtra|multipl|divis|calculad|operacao|switch/.test(lc)) {
        interactiveHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0d1117; color: #c9d1d9; font-family: 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1rem; }
  .calc { background: #161b22; border: 1px solid #30363d; border-radius: 14px; padding: 1.5rem; width: 320px; }
  h2 { color: #f0883e; font-size: 1rem; text-align: center; margin-bottom: 1.25rem; letter-spacing: 1px; }
  .row { display: flex; gap: .5rem; margin-bottom: .75rem; }
  input[type=number] { flex: 1; background: #0d1117; border: 1px solid #30363d; color: #c9d1d9; border-radius: 8px; padding: .5rem .75rem; font-size: 1rem; width: 100%; outline: none; }
  input[type=number]:focus { border-color: #f0883e; }
  .ops { display: grid; grid-template-columns: repeat(4,1fr); gap: .4rem; margin-bottom: 1rem; }
  .op { background: #21262d; border: 1px solid #30363d; color: #c9d1d9; border-radius: 8px; padding: .5rem; font-size: 1.1rem; cursor: pointer; transition: background .15s; }
  .op:hover, .op.active { background: #f0883e; color: #0d1117; border-color: #f0883e; }
  .result { background: #0d1117; border-radius: 8px; padding: .75rem 1rem; font-size: 1.4rem; text-align: center; color: #4ade80; min-height: 2.5rem; border: 1px solid #30363d; word-break: break-all; }
  .error { color: #f85149; font-size: .85rem; }
  .log { margin-top: .75rem; background: #0d1117; border-radius: 6px; padding: .5rem .75rem; font-size: .72rem; color: #8b949e; max-height: 80px; overflow-y: auto; font-family: monospace; }
</style></head><body>
<div class="calc">
  <h2>☕ ${className}</h2>
  <div class="row">
    <input type="number" id="n1" placeholder="Número 1" step="any" />
    <input type="number" id="n2" placeholder="Número 2" step="any" />
  </div>
  <div class="ops">
    <button class="op active" data-op="+" onclick="setOp(this)">+</button>
    <button class="op" data-op="-" onclick="setOp(this)">−</button>
    <button class="op" data-op="*" onclick="setOp(this)">×</button>
    <button class="op" data-op="/" onclick="setOp(this)">÷</button>
  </div>
  <div class="result" id="res">—</div>
  <div class="log" id="log">[JVM] ${className} iniciado ✓</div>
</div>
<script>
  let op = '+';
  const opNames = { '+': 'Soma', '-': 'Subtração', '*': 'Multiplicação', '/': 'Divisão' };
  function setOp(btn) {
    document.querySelectorAll('.op').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    op = btn.dataset.op;
    calc();
  }
  function addLog(msg) {
    const l = document.getElementById('log');
    l.innerHTML += '<br>' + msg;
    l.scrollTop = l.scrollHeight;
  }
  function calc() {
    const n1 = parseFloat(document.getElementById('n1').value);
    const n2 = parseFloat(document.getElementById('n2').value);
    const res = document.getElementById('res');
    if (isNaN(n1) || isNaN(n2)) { res.innerHTML = '—'; return; }
    let r;
    if (op === '+') r = n1 + n2;
    else if (op === '-') r = n1 - n2;
    else if (op === '*') r = n1 * n2;
    else if (op === '/') {
      if (n2 === 0) { res.innerHTML = '<span class="error">Erro: Divisão por zero!</span>'; addLog('[ERR] ArithmeticException: / by zero'); return; }
      r = n1 / n2;
    }
    const disp = Number.isInteger(r) ? r : parseFloat(r.toFixed(8));
    res.textContent = 'Resultado da ' + opNames[op].toLowerCase() + ': ' + disp;
    addLog('[Log] ' + n1 + ' ' + op + ' ' + n2 + ' = ' + disp);
  }
  document.querySelectorAll('input').forEach(i => i.addEventListener('input', calc));
</script></body></html>`;
      }


      // ── LUZES PISCANTES / ANIMAÇÃO SWING ──
      else if (/jframe|jwindow|swing|awt/.test(lc) && (/timer|pisca|blink|flash|ligad|apagad|oval|filloval|animation|anima|light|luz/.test(lc))) {
        interactiveHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:#0d1117; color:#c9d1d9; font-family:'Segoe UI',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; gap:1rem; }
  .panel { background:#161b22; border:1px solid #30363d; border-radius:16px; padding:1.5rem 2rem; text-align:center; min-width:340px; }
  h2 { color:#58a6ff; font-size:.95rem; margin-bottom:1.25rem; letter-spacing:1px; }
  canvas { border-radius:12px; background:#1a1a2e; display:block; margin:0 auto; }
  .controls { display:flex; gap:.75rem; justify-content:center; margin-top:1rem; flex-wrap:wrap; }
  .btn { background:#21262d; border:1px solid #30363d; color:#c9d1d9; border-radius:8px; padding:.45rem 1rem; cursor:pointer; font-size:.82rem; transition:all .15s; }
  .btn:hover { background:#30363d; }
  .btn.active { background:#58a6ff; color:#0d1117; border-color:#58a6ff; }
  .log { font-family:monospace; font-size:.72rem; color:#8b949e; margin-top:.75rem; min-height:1.2rem; }
  .speed-row { display:flex; align-items:center; gap:.5rem; margin-top:.6rem; font-size:.8rem; color:#8b949e; }
  input[type=range] { width:120px; accent-color:#58a6ff; }
  .status { font-size:.75rem; color:#4ade80; margin-top:.4rem; }
</style></head><body>
<div class="panel">
  <h2>☕ ${className}</h2>
  <canvas id="cv" width="300" height="120"></canvas>
  <div class="controls">
    <button class="btn active" id="toggleBtn" onclick="toggle()">⏸ Pausar</button>
    <button class="btn" onclick="setMode('sync')">🔁 Sincronizado</button>
    <button class="btn" onclick="setMode('chase')">🌀 Sequencial</button>
    <button class="btn" onclick="setMode('rainbow')">🌈 Rainbow</button>
  </div>
  <div class="speed-row">
    <span>Velocidade:</span>
    <input type="range" min="100" max="2000" value="500" id="spd" oninput="setSpeed(this.value)">
    <span id="spdVal">500ms</span>
  </div>
  <div class="status" id="status">🟢 Timer ativo — 500ms</div>
  <div class="log" id="log">[JVM] LuzesPiscantes iniciado ✓</div>
</div>
<script>
  const cv = document.getElementById('cv');
  const ctx = cv.getContext('2d');
  const COLORS = ['#ef4444','#22c55e','#3b82f6'];
  const OFF = '#374151';
  let on = true, running = true, mode = 'sync', speed = 500, chase = 0;
  let interval = null;

  function draw() {
    ctx.clearRect(0,0,cv.width,cv.height);
    const cx = [75,150,225], cy = 60, r = 40;
    cx.forEach((x,i) => {
      let color;
      if (!on) { color = OFF; }
      else if (mode === 'sync') { color = COLORS[i]; }
      else if (mode === 'chase') { color = (i === chase % 3) ? COLORS[i] : OFF; }
      else { // rainbow
        const h = (chase*40 + i*120) % 360;
        color = \`hsl(\${h},90%,55%)\`;
      }
      // Glow effect
      if (on && (mode !== 'chase' || i === chase % 3)) {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 22;
        ctx.beginPath(); ctx.arc(x,cy,r,0,Math.PI*2);
        ctx.fillStyle = color + '44'; ctx.fill();
        ctx.restore();
      }
      // Circle
      ctx.beginPath(); ctx.arc(x,cy,r,0,Math.PI*2);
      const grad = ctx.createRadialGradient(x-r*.25,cy-r*.25,r*.1,x,cy,r);
      grad.addColorStop(0, on && (mode !== 'chase' || i === chase%3) ? lighten(color) : '#4b5563');
      grad.addColorStop(1, on && (mode !== 'chase' || i === chase%3) ? color : OFF);
      ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 2; ctx.stroke();
    });
  }

  function lighten(hex) {
    try {
      const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
      return \`rgb(\${Math.min(r+80,255)},\${Math.min(g+80,255)},\${Math.min(b+80,255)})\`;
    } catch { return hex; }
  }

  function addLog(msg) {
    const l = document.getElementById('log');
    l.textContent = msg;
  }

  function tick() {
    on = !on;
    if (mode === 'chase') { if (on) chase++; }
    else if (mode === 'rainbow') { chase++; on = true; }
    draw();
    addLog(\`[Timer] Estado: \${on?'LIGADA':'APAGADA'} | Modo: \${mode} | \${speed}ms\`);
  }

  function startInterval() {
    if (interval) clearInterval(interval);
    interval = setInterval(tick, speed);
  }

  function toggle() {
    running = !running;
    const btn = document.getElementById('toggleBtn');
    if (running) { startInterval(); btn.textContent='⏸ Pausar'; btn.classList.add('active'); }
    else { clearInterval(interval); btn.textContent='▶ Continuar'; btn.classList.remove('active'); }
    document.getElementById('status').textContent = running ? \`🟢 Timer ativo — \${speed}ms\` : '🔴 Pausado';
  }

  function setMode(m) {
    mode = m; chase = 0; on = true;
    document.querySelectorAll('.btn').forEach(b => { if (['🔁 Sincronizado','🌀 Sequencial','🌈 Rainbow'].some(t=>b.textContent.includes(t.split(' ')[1]))) b.classList.remove('active'); });
    event.target.classList.add('active');
    startInterval(); draw();
  }

  function setSpeed(v) {
    speed = parseInt(v);
    document.getElementById('spdVal').textContent = speed + 'ms';
    document.getElementById('status').textContent = running ? \`🟢 Timer ativo — \${speed}ms\` : '🔴 Pausado';
    if (running) startInterval();
  }

  draw();
  startInterval();
</script></body></html>\`;
      }

      // ── QUIZ / PERGUNTAS ──
      else if (/quiz|pergunta|resposta|alternativa|questao|question|answer/.test(lc)) {
        const questions = [
          { q: 'Qual a capital do Brasil?', opts: ['São Paulo','Rio de Janeiro','Brasília','Salvador'], a: 2 },
          { q: 'Quanto é 7 × 8?', opts: ['54','56','58','64'], a: 1 },
          { q: 'Qual linguagem roda na JVM?', opts: ['Python','C++','Java','Ruby'], a: 2 },
          { q: 'Quanto é √144?', opts: ['11','12','13','14'], a: 1 },
        ];
        interactiveHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:#0d1117; color:#c9d1d9; font-family:'Segoe UI',sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:1rem; }
  .quiz { background:#161b22; border:1px solid #30363d; border-radius:14px; padding:1.5rem; width:340px; }
  h2 { color:#58a6ff; font-size:1rem; text-align:center; margin-bottom:1rem; }
  .q { font-size:1rem; margin-bottom:1rem; color:#e6edf3; line-height:1.5; }
  .opts { display:flex; flex-direction:column; gap:.5rem; }
  .opt { background:#21262d; border:1px solid #30363d; color:#c9d1d9; border-radius:8px; padding:.6rem 1rem; cursor:pointer; text-align:left; transition:background .15s; }
  .opt:hover { background:#30363d; }
  .opt.correct { background:#1a4731; border-color:#238636; color:#3fb950; }
  .opt.wrong { background:#3d1c1c; border-color:#f85149; color:#f85149; }
  .score { text-align:center; color:#4ade80; font-size:1.2rem; margin-top:1rem; }
  .progress { font-size:.75rem; color:#8b949e; text-align:right; margin-bottom:.5rem; }
</style></head><body>
<div class="quiz">
  <h2>🎮 ${className}</h2>
  <div class="progress" id="prog">1 / ${questions.length}</div>
  <div class="q" id="qtext"></div>
  <div class="opts" id="opts"></div>
  <div class="score hidden" id="score"></div>
</div>
<script>
  const qs = ${JSON.stringify(questions)};
  let cur = 0, score = 0;
  function render() {
    if (cur >= qs.length) {
      document.getElementById('qtext').style.display='none';
      document.getElementById('opts').style.display='none';
      document.getElementById('prog').style.display='none';
      const s = document.getElementById('score');
      s.classList.remove('hidden');
      s.textContent = '✅ Fim! Acertos: ' + score + '/' + qs.length;
      return;
    }
    document.getElementById('prog').textContent = (cur+1) + ' / ' + qs.length;
    document.getElementById('qtext').textContent = qs[cur].q;
    document.getElementById('opts').innerHTML = qs[cur].opts.map((o,i) =>
      '<button class="opt" onclick="pick('+i+')">'+o+'</button>').join('');
  }
  function pick(i) {
    const btns = document.querySelectorAll('.opt');
    btns.forEach(b=>b.disabled=true);
    btns[qs[cur].a].classList.add('correct');
    if (i !== qs[cur].a) btns[i].classList.add('wrong'); else score++;
    setTimeout(() => { cur++; render(); }, 900);
  }
  render();
</script></body></html>`;
      }

      // ── LISTA / TODO ──
      else if (/list|arraylist|linkedlist|tarefa|todo|task|item|add|remove/.test(lc) && !/random|sort/.test(lc)) {
        interactiveHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:#0d1117; color:#c9d1d9; font-family:'Segoe UI',sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:1rem; }
  .app { background:#161b22; border:1px solid #30363d; border-radius:14px; padding:1.5rem; width:320px; }
  h2 { color:#3fb950; font-size:1rem; margin-bottom:1rem; }
  .row { display:flex; gap:.5rem; margin-bottom:1rem; }
  input { flex:1; background:#0d1117; border:1px solid #30363d; color:#c9d1d9; border-radius:8px; padding:.5rem .75rem; font-size:.9rem; outline:none; }
  input:focus { border-color:#3fb950; }
  button { background:#238636; border:none; color:#fff; border-radius:8px; padding:.5rem .9rem; cursor:pointer; font-size:.85rem; }
  button:hover { background:#2ea043; }
  ul { list-style:none; display:flex; flex-direction:column; gap:.4rem; max-height:200px; overflow-y:auto; }
  li { background:#21262d; border-radius:8px; padding:.5rem .75rem; display:flex; align-items:center; gap:.5rem; font-size:.9rem; }
  li.done span { text-decoration:line-through; color:#8b949e; }
  li input[type=checkbox] { accent-color:#3fb950; cursor:pointer; }
  .del { background:#f85149; padding:.2rem .5rem; margin-left:auto; border-radius:6px; font-size:.75rem; }
  .empty { color:#8b949e; font-size:.85rem; text-align:center; padding:1rem; }
</style></head><body>
<div class="app">
  <h2>📋 ${className}</h2>
  <div class="row">
    <input id="inp" placeholder="Nova tarefa..." onkeydown="if(event.key==='Enter')add()" />
    <button onclick="add()">+ Add</button>
  </div>
  <ul id="list"><li class="empty">Nenhuma tarefa ainda.</li></ul>
</div>
<script>
  let items = [];
  function render() {
    const ul = document.getElementById('list');
    if (!items.length) { ul.innerHTML = '<li class="empty">Nenhuma tarefa ainda.</li>'; return; }
    ul.innerHTML = items.map((t,i) => '<li class="'+(t.done?'done':'')+'"><input type="checkbox" '+(t.done?'checked':'')+" onchange='toggle("+i+")'>"+
      '<span>'+t.text+'</span><button class="del" onclick="del('+i+')">✕</button></li>').join('');
  }
  function add() {
    const v = document.getElementById('inp').value.trim();
    if (!v) return;
    items.push({ text: v, done: false });
    document.getElementById('inp').value = '';
    render();
  }
  function toggle(i) { items[i].done = !items[i].done; render(); }
  function del(i) { items.splice(i,1); render(); }
</script></body></html>`;
      }

      // ── JOGO / GAME ──
      else if (/jogo|game|score|pontuacao|player|nivel|level|placar/.test(lc)) {
        interactiveHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:#0d1117; color:#c9d1d9; font-family:'Segoe UI',sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; }
  .game { background:#161b22; border:1px solid #30363d; border-radius:14px; padding:1.5rem; width:320px; text-align:center; }
  h2 { color:#f0883e; margin-bottom:1rem; font-size:1rem; }
  .score { font-size:2.5rem; font-weight:700; color:#4ade80; margin:.5rem 0; }
  .level { color:#8b949e; font-size:.85rem; margin-bottom:1rem; }
  .target { font-size:4rem; cursor:pointer; display:inline-block; transition:transform .1s; user-select:none; margin:1rem 0; }
  .target:active { transform:scale(.85); }
  .btn { background:#238636; border:none; color:#fff; border-radius:8px; padding:.6rem 1.4rem; cursor:pointer; font-size:.9rem; margin-top:.75rem; }
  .miss { color:#f85149; font-size:.8rem; margin-top:.25rem; }
  .timer { font-size:.85rem; color:#8b949e; margin-top:.5rem; }
</style></head><body>
<div class="game">
  <h2>🎮 ${className}</h2>
  <div class="score" id="sc">0</div>
  <div class="level" id="lvl">Nível 1</div>
  <div class="target" id="tgt" onclick="hit()">🎯</div>
  <div class="miss" id="miss"></div>
  <div class="timer" id="tmr">⏱ 30s</div>
  <button class="btn" id="btn" onclick="start()">▶ Iniciar</button>
</div>
<script>
  let score=0, misses=0, running=false, timeLeft=30, interval, targets=['🎯','⭐','💎','🔥','⚡','🚀'];
  function start() {
    score=0; misses=0; timeLeft=30; running=true;
    document.getElementById('sc').textContent=0;
    document.getElementById('miss').textContent='';
    document.getElementById('btn').style.display='none';
    moveTgt();
    interval = setInterval(() => {
      timeLeft--;
      document.getElementById('tmr').textContent='⏱ '+timeLeft+'s';
      document.getElementById('lvl').textContent='Nível '+Math.floor(score/5+1);
      if (timeLeft<=0) { clearInterval(interval); running=false; end(); }
    }, 1000);
  }
  function moveTgt() {
    const t=document.getElementById('tgt');
    t.textContent=targets[Math.floor(Math.random()*targets.length)];
  }
  function hit() {
    if (!running) return;
    score++;
    document.getElementById('sc').textContent=score;
    moveTgt();
  }
  function end() {
    document.getElementById('tgt').textContent='🏆';
    document.getElementById('miss').textContent='Fim! Pontuação: '+score;
    document.getElementById('btn').style.display='';
    document.getElementById('btn').textContent='↺ Jogar de novo';
  }
</script></body></html>`;
      }

      // If we have an interactive UI, render it in iframe
      if (interactiveHtml) {
        const blob = new Blob([interactiveHtml], { type: 'text/html' });
        const url  = URL.createObjectURL(blob);
        if (output)  output.classList.add('hidden');
        if (frameEl) {
          frameEl.src = url;
          frameEl.classList.remove('hidden');
          frameEl.style.cssText = 'width:100%;height:420px;border:none;border-radius:12px;margin-top:.75rem;';
        }
        return;
      }

      // ── Fallback: typed fictitious terminal output ──
      let fakeLines = [];
      if (/jframe|swing|awt|window|panel/.test(lc)) {
        fakeLines = [`[${lang}] Compilando ${className}...`, `[javac] 0 erros`, `[JVM] JVM v21.0.2 iniciada`, `[Swing] Look & Feel carregado`, `[GUI] Janela criada (640×480)`, `✅ Interface gráfica em execução`];
      } else if (/video|frame|image|bufferedimage|pixel/.test(lc)) {
        fakeLines = [`[${lang}] Compilando ${className}...`, `[Build] OK`, `[Media] Pipeline de vídeo iniciado`, `[Codec] 640×480 @ 10FPS`, `[Frame 1] 307.200 pixels gerados`, `✅ Stream de vídeo em execução`];
      } else if (/socket|http|url|connect/.test(lc)) {
        fakeLines = [`[${lang}] Compilando ${className}...`, `[Net] Conectando 192.168.1.1:8080`, `[Net] Handshake OK — 12ms`, `[RX] 1.024 bytes`, `✅ Conexão ativa`];
      } else if (/random|sort|array/.test(lc)) {
        fakeLines = [`[${lang}] Compilando ${className}...`, `[Run] 1.000 valores gerados`, `[Sort] Ordenado em 0.003ms`, `[Result] Máx:998 Mín:2 Média:501.3`, `✅ Concluído`];
      } else {
        fakeLines = [`[${lang}] Compilando ${className}...`, `[Build] 0 erros`, `[Run] Iniciando...`, `[Log] Processamento concluído`, `[Exit] Código: 0`, `✅ Finalizado`];
      }

      // Animate lines one by one
      output.textContent = '';
      output.classList.remove('hidden');
      if (frameEl) frameEl.classList.add('hidden');
      let i = 0;
      const tick = setInterval(() => {
        if (i < fakeLines.length) {
          output.textContent += (i > 0 ? '\n' : '') + fakeLines[i++];
        } else {
          clearInterval(tick);
        }
      }, 120);
      return;
    }


    // Detect non-JS content
    if (trimmed.startsWith('<') || /<\/(html|head|body|div|script)/i.test(trimmed)) {
      output.textContent = '⚠️ Este app contém HTML — apenas JavaScript pode ser executado aqui.';
      output.classList.remove('hidden');
      return;
    }
    if (/^\s*import\s+/m.test(code) || /^\s*export\s+/m.test(code)) {
      output.textContent = '⚠️ Este app usa módulos ES (import/export) que não são suportados no sandbox. Remova as instruções import/export para executar.';
      output.classList.remove('hidden');
      return;
    }

    // Use sandboxed blob iframe for safe execution
    const logs = [];
    const html = `<!DOCTYPE html><html><body><script>
const _logs = [];
const _console = {
  log: (...a) => _logs.push(a.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ')),
  error: (...a) => _logs.push('[ERR] ' + a.join(' ')),
  warn: (...a) => _logs.push('[WARN] ' + a.join(' ')),
};
try {
  (function(console) {
${code}
const _ret = typeof main === 'function' ? main() : undefined;
if (_ret !== undefined) _logs.push('→ ' + JSON.stringify(_ret));
  })(_console);
} catch(e) {
  _logs.push('❌ Erro: ' + e.message);
}
window.parent.postMessage({ type: 'cp_run_result', logs: _logs }, '*');
<\/script></body></html>`;

    // Listen for result
    const onMsg = (e) => {
      if (!e.data || e.data.type !== 'cp_run_result') return;
      window.removeEventListener('message', onMsg);
      output.textContent = e.data.logs.join('\n') || '(sem saída)';
      output.classList.remove('hidden');
      if (frameEl) { frameEl.classList.add('hidden'); frameEl.src = ''; }
    };
    window.addEventListener('message', onMsg);

    // Cleanup listener after 5s in case message never arrives
    setTimeout(() => { window.removeEventListener('message', onMsg); }, 5000);

    if (frameEl) {
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      frameEl.classList.remove('hidden');
      frameEl.style.cssText = 'display:none;';
      frameEl.src = url;
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } else {
      // Fallback: new Function
      try {
        const fn = new Function('console', code + '\nreturn typeof main === "function" ? main() : undefined;');
        const fake = { log: (...a) => logs.push(a.join(' ')), error: (...a) => logs.push('[ERR] ' + a.join(' ')) };
        const ret = fn(fake);
        if (ret !== undefined) logs.push('→ ' + JSON.stringify(ret));
        output.textContent = logs.join('\n') || '(sem saída)';
      } catch (err) {
        output.textContent = '❌ Erro: ' + err.message;
      }
      output.classList.remove('hidden');
    }
  }
};

// ── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  State.seedApps();
  State.updateWalletUI();
});
