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
    if (localStorage.getItem(this.SEEDED_KEY) === '3') return; // re-seed if v1/v2
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
    ];
    State.setApps(seed);
    localStorage.setItem(this.SEEDED_KEY, '3'); // v3: tracker price 520
  }
};

// ── Logo Generator ───────────────────────────
const LogoGen = {
  EMOJIS: ['🚀','💡','⚡','🔥','🎮','🛠️','📊','🔐','🎯','💎','🌐','🤖','📱','🎨','💰'],
  COLORS: ['#7c3aed','#2563eb','#059669','#d97706','#dc2626','#7c3aed','#0891b2','#9333ea'],
  generate(name) {
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
    const logo = LogoGen.generate(name);
    const app = { id: 'app_' + Date.now(), name, desc, price, category, code, logo, createdAt: Date.now() };
    const apps = State.getApps();
    apps.unshift(app);
    State.setApps(apps);
    const result = document.getElementById('createResult');
    if (result) {
      result.textContent = '✅ App "' + name + '" publicado na loja!';
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
    // ── Regular JS apps — sandbox iframe approach ──
    const output = document.getElementById('appOutput');
    const frameEl = document.getElementById('appFrame');
    if (!output) return;

    const code = app.code || '';

    // Detect non-JS content
    const trimmed = code.trim();
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
