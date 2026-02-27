// ── App Detector ─────────────────────────────
const AppDetector = {
  // Patterns to detect what kind of real program was pasted
  SIGNATURES: [
    { pattern: /calc|calcul|soma|subtr|multiplica|divis|math\.|arithmetic/i,         name: 'CalcMaster Pro',     emoji: '🧮', category: 'Utilitário',    desc: 'Calculadora avançada com suporte a operações complexas e histórico inteligente.' },
    { pattern: /weather|clima|temperatura|forecast|wind|rain|humidity/i,             name: 'WeatherSphere',      emoji: '🌦️', category: 'Utilitário',    desc: 'Previsão do tempo em tempo real com mapas interativos e alertas personalizados.' },
    { pattern: /todo|task|tarefa|checklist|reminder|lembrete|agenda/i,               name: 'TaskFlow',           emoji: '✅', category: 'Produtividade', desc: 'Gerenciador de tarefas inteligente com IA, sincronização e lembretes automáticos.' },
    { pattern: /chat|message|mensagem|socket|websocket|real.?time|conversation/i,    name: 'ChatNova',           emoji: '💬', category: 'Social',         desc: 'Plataforma de mensagens instantâneas com criptografia fictícia de ponta.' },
    { pattern: /game|jogo|player|score|pontos|level|fase|enemy|inimigo|sprite/i,     name: 'GameForge',          emoji: '🕹️', category: 'Jogo',          desc: 'Motor de jogos fictício com física realista e suporte a multiplayer online.' },
    { pattern: /music|audio|sound|som|playlist|spotify|song|canção|mp3/i,            name: 'SoundWave',          emoji: '🎵', category: 'Utilitário',    desc: 'Player de música com equalizer, playlists inteligentes e letras sincronizadas.' },
    { pattern: /image|imagem|photo|foto|canvas|pixel|draw|desenho|filter/i,          name: 'PixelStudio',        emoji: '🖼️', category: 'Utilitário',    desc: 'Editor de imagens profissional com filtros IA e exportação multi-formato.' },
    { pattern: /login|auth|password|senha|token|jwt|session|usuario|user/i,          name: 'AuthGuard',          emoji: '🔐', category: 'Utilitário',    desc: 'Sistema de autenticação segura com 2FA fictício e gerenciamento de sessões.' },
    { pattern: /finance|financ|money|dinheiro|budget|orcamento|invest|stock|bolsa/i, name: 'FinEdge',            emoji: '📈', category: 'Finanças',      desc: 'Plataforma de gestão financeira com análise preditiva e simulação de investimentos.' },
    { pattern: /map|mapa|location|localizacao|gps|coordinate|latitude|longitude/i,   name: 'MapQuest X',         emoji: '🗺️', category: 'Utilitário',    desc: 'Navegador GPS fictício com rotas otimizadas por IA e pontos de interesse.' },
    { pattern: /sort|search|busca|filter|algorithm|algoritmo|binary|tree|graph/i,    name: 'AlgoViz',            emoji: '⚙️', category: 'Educação',      desc: 'Visualizador de algoritmos com animações interativas e desafios de código.' },
    { pattern: /shop|loja|cart|carrinho|product|produto|ecommerce|checkout|price/i,  name: 'ShopFlow',           emoji: '🛒', category: 'Utilitário',    desc: 'Plataforma de e-commerce fictício com recomendações personalizadas por IA.' },
    { pattern: /quiz|question|pergunta|test|exame|exam|study|estudo|learn|aprender/i,name: 'QuizMind',           emoji: '🧠', category: 'Educação',      desc: 'App de aprendizado adaptativo com flashcards, quizzes e trilhas personalizadas.' },
    { pattern: /ai|machine.?learn|neural|model|predict|classif|train|dataset/i,      name: 'NeuralKit',          emoji: '🤖', category: 'Utilitário',    desc: 'Framework de IA fictício para treinar modelos e fazer predições em tempo real.' },
    { pattern: /api|fetch|http|request|endpoint|rest|graphql|json|server|servidor/i, name: 'APIForge',           emoji: '🔌', category: 'Produtividade', desc: 'Cliente REST/GraphQL fictício com testes automatizados e documentação gerada.' },
    { pattern: /blog|post|article|artigo|cms|content|conteudo|markdown|editor/i,     name: 'BlogCraft',          emoji: '✍️', category: 'Produtividade', desc: 'CMS fictício com editor rico, SEO automático e publicação agendada.' },
    { pattern: /encrypt|decrypt|hash|crypto|cipher|secret|segredo|chave|key/i,       name: 'CryptoVault',        emoji: '🔒', category: 'Utilitário',    desc: 'Suite de criptografia fictícia com suporte a AES, RSA e algoritmos quânticos.' },
    { pattern: /timer|clock|relogio|countdown|cronometro|stopwatch|alarm|alarme/i,   name: 'TimePulse',          emoji: '⏱️', category: 'Utilitário',    desc: 'App de gestão de tempo com Pomodoro, alarmes inteligentes e análise de foco.' },
    { pattern: /translate|traducao|language|idioma|word|palavra|dictionary|dicionario/i, name: 'LinguaAI',       emoji: '🌐', category: 'Educação',      desc: 'Tradutor fictício com 200+ idiomas, detecção automática e modo offline.' },
    { pattern: /robot|bot|automat|script|crawl|scrape|selenium|playwright/i,         name: 'BotFactory',         emoji: '🦾', category: 'Produtividade', desc: 'Plataforma de automação fictícia com bots inteligentes e agendamento visual.' },
  ],
  DEFAULT: { name: 'AppGenesis',  emoji: '✨', category: 'Utilitário', desc: 'Aplicativo multifuncional criado automaticamente a partir de código real detectado.' },

  detect(code) {
    for (const sig of this.SIGNATURES) {
      if (sig.pattern.test(code)) {
        // Add a unique suffix to avoid exact name collisions
        const suffix = ['Plus', 'Pro', 'X', 'Ultra', 'Nova', 'Go', 'AI', 'Max'][Math.floor(Math.random() * 8)];
        return {
          name: sig.name + (Math.random() > 0.5 ? ' ' + suffix : ''),
          emoji: sig.emoji,
          category: sig.category,
          desc: sig.desc,
          detected: true
        };
      }
    }
    return { ...this.DEFAULT, detected: false };
  },

  // Detect if pasted code looks like "real" code (not placeholder)
  isRealCode(code) {
    if (!code || code.trim().length < 30) return false;
    const realIndicators = [
      /function\s+\w+\s*\(.*\)\s*\{/,  // named function
      /class\s+\w+/,                    // class declaration
      /import\s+.+from/,                // ES module import
      /require\s*\(/,                   // CommonJS require
      /const\s+\w+\s*=\s*\(/,          // const assignment
      /\.addEventListener\s*\(/,        // DOM event
      /document\.\w+/,                  // DOM access
      /fetch\s*\(/,                     // fetch API
      /async\s+function/,               // async function
      /=>\s*\{/,                        // arrow function with body
    ];
    return realIndicators.some(rx => rx.test(code));
  }
};

// ── App Playground Renderer ──────────────────
function renderCreatedApps() {
  const grid = document.getElementById('createdAppsGrid');
  const empty = document.getElementById('createdEmpty');
  if (!grid) return;
  const apps = State.getApps();
  const mine = apps.filter(a => a.createdByUser);
  if (!mine.length) { grid.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
  if (empty) empty.style.display = 'none';
  grid.innerHTML = mine.map(app => `
    <div class="app-card" onclick="UI.openModal(${JSON.stringify(app).replace(/"/g, '&quot;')})">
      <div class="app-card__logo" style="background:${app.logo.color}20;border:1px solid ${app.logo.color}40">${app.logo.emoji}</div>
      <div class="app-card__name">${app.name}</div>
      <div class="app-card__desc">${app.desc}</div>
      <div class="app-card__meta">
        <span class="app-card__price">${app.price === 0 ? 'Grátis' : 'R$ ' + app.price.toFixed(2)}</span>
        <span class="app-card__cat">${app.category}</span>
      </div>
      ${app.autoDetected ? '<div class="detected-badge">🔍 Auto-detectado</div>' : ''}
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('appName');
  const preview = document.getElementById('appLogoPreview');
  const codeInput = document.getElementById('appCode');
  const detectBanner = document.getElementById('detectBanner');

  // Auto-detect on code paste/input
  if (codeInput) {
    codeInput.addEventListener('input', () => {
      const code = codeInput.value;
      if (!AppDetector.isRealCode(code)) {
        if (detectBanner) detectBanner.classList.add('hidden');
        return;
      }
      const detected = AppDetector.detect(code);

      // Auto-fill name if field is still default/empty
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal === 'MeuApp') {
        if (nameInput) {
          nameInput.value = detected.name;
          // Trigger logo preview update
          nameInput.dispatchEvent(new Event('input'));
        }
        // Auto-fill description
        const descInput = document.getElementById('appDesc');
        if (descInput && !descInput.value.trim()) descInput.value = detected.desc;
        // Auto-fill category
        const catSel = document.getElementById('appCategory');
        if (catSel) catSel.value = detected.category;
      }

      // Show detection banner
      if (detectBanner) {
        detectBanner.innerHTML = `🔍 <strong>Código real detectado!</strong> App configurado como <strong>${detected.name}</strong> (${detected.category}) automaticamente.`;
        detectBanner.classList.remove('hidden');
      }
    });
  }

  // Logo preview on name input
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

  // Bind AppStore.createApp
  const form = document.getElementById('appForm');
  if (form) form.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('appName').value.trim();
    const desc = document.getElementById('appDesc').value.trim();
    const price = parseFloat(document.getElementById('appPrice').value);
    const category = document.getElementById('appCategory').value;
    const code = document.getElementById('appCode').value.trim();
    if (!name || !desc || !code) return;

    // Check if this was auto-detected from real code
    const autoDetected = AppDetector.isRealCode(code);
    const detected = autoDetected ? AppDetector.detect(code) : null;

    const logo = LogoGen.generate(name);
    // Use detected emoji if auto-detected and name wasn't manually changed
    if (detected && detected.detected) {
      logo.emoji = detected.emoji;
    }

    const app = {
      id: 'app_' + Date.now(),
      name, desc, price, category, code, logo,
      createdAt: Date.now(),
      createdByUser: true,
      autoDetected
    };
    const apps = State.getApps();
    apps.unshift(app);
    State.setApps(apps);

    const result = document.getElementById('createResult');
    if (result) {
      const msg = autoDetected
        ? `✅ App "<strong>${name}</strong>" publicado! 🔍 Código real detectado e identidade fictícia gerada automaticamente.`
        : `✅ App "<strong>${name}</strong>" publicado na loja!`;
      result.innerHTML = msg;
      result.className = 'result-msg success';
      result.classList.remove('hidden');
    }

    form.reset();
    if (preview) { preview.textContent = '?'; preview.style.background = ''; }
    if (detectBanner) detectBanner.classList.add('hidden');
    renderCreatedApps();
    if (typeof Store !== 'undefined') Store.render();
  };
});
