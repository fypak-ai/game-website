// ── Hacker Lab ──────────────────────────────
const HACK_PRESETS = {
  password: { name: 'ShadowBreaker 9000', type: 'password', power: 95, emoji: '🔓',
    code: 'function crack(hash){\n  const chars="abcdefghijklmnopqrstuvwxyz0123456789";\n  let found="";\n  for(let i=0;i<8;i++) found+=chars[Math.floor(Math.random()*chars.length)];\n  return "🔓 Senha fictícia descoberta: "+found;\n}' },
  scanner: { name: 'NetSweeper Pro', type: 'scanner', power: 80, emoji: '📡',
    code: 'function scan(cidr){\n  const hosts=[];\n  for(let i=1;i<=254;i++) hosts.push("10.0.0."+i);\n  return hosts.slice(0,5).map(h=>"✅ "+h+" aberto").join("\\n");\n}' },
  grabber: { name: 'IPGrabber Ultra', type: 'grabber', power: 70, emoji: '🎯',
    code: 'function grab(){\n  const parts=()=>Math.floor(Math.random()*255);\n  return "🎯 IP fictício capturado: "+[parts(),parts(),parts(),parts()].join(".");\n}' },
  ddos: { name: 'FloodMaster X', type: 'ddos', power: 99, emoji: '⚔️',
    code: 'function flood(target){\n  const pps=Math.floor(Math.random()*9999999)+1000000;\n  return "⚔️ Simulando "+pps.toLocaleString()+" pacotes/s para "+target+" (fictício)";\n}' },
  phishing: { name: 'HookLine Pro', type: 'phishing', power: 85, emoji: '🎣',
    code: 'function phish(domain){\n  const clones=["banco","paypal","netflix","amazon"].map(s=>s+"-secure.ficticio.xyz");\n  return "🎣 Domínios fictícios gerados:\\n"+clones.join("\\n");\n}' }
};

const HK_KEY = 'cp_hack_tools';

const HackerLab = {
  getTools(){ try{ return JSON.parse(localStorage.getItem(HK_KEY)||'[]'); }catch{ return []; } },
  setTools(arr){ localStorage.setItem(HK_KEY, JSON.stringify(arr)); },

  addPreset(type){
    const p = HACK_PRESETS[type];
    if(!p) return;
    const tools = this.getTools();
    const tool = { id:'ht_'+Date.now(), name:p.name, type:p.type, power:p.power, emoji:p.emoji, code:p.code, preset:true };
    tools.unshift(tool);
    this.setTools(tools);
    this.renderTools();
    this.termLog('out', '✅ Ferramenta pré-definida "'+p.name+'" adicionada!');
  },

  renderTools(){
    const grid = document.getElementById('hackToolsGrid');
    const empty = document.getElementById('hackEmpty');
    if(!grid) return;
    const tools = this.getTools();
    if(!tools.length){ grid.innerHTML=''; if(empty) empty.style.display='block'; return; }
    if(empty) empty.style.display='none';
    grid.innerHTML = tools.map(t=>`
      <div class="hack-tool-card">
        <div class="hack-tool-card__name">${t.emoji||'☠️'} ${t.name}</div>
        <div class="hack-tool-card__type">${t.type} · Poder: ${t.power}/100</div>
        <div class="power-bar"><div class="power-bar__fill" style="width:${t.power}%"></div></div>
        <div class="hack-tool-card__btns">
          <button class="btn btn--danger btn--sm" onclick="HackerLab.runTool('${t.id}')">▶ Executar</button>
          <button class="btn btn--sm" style="background:#222;color:#aaa" onclick="HackerLab.deleteTool('${t.id}')">✕</button>
        </div>
      </div>`).join('');
  },

  runTool(id){
    const tools = this.getTools();
    const t = tools.find(x=>x.id===id);
    if(!t){ this.termLog('err','Ferramenta não encontrada.'); return; }
    this.termLog('cmd','run '+t.name);
    const lines = ['🔄 Iniciando '+t.name+'...','⚡ Carregando módulos fictícios...','🔐 Bypass de segurança simulado...'];
    let i=0;
    const iv = setInterval(()=>{ if(i<lines.length){ this.termLog('out',lines[i++]); } else { clearInterval(iv); this.execCode(t); } }, 400);
  },

  execCode(t){
    try {
      const logs=[];
      const fn=new Function('console',t.code+'\nconst _r=typeof main==="function"?main():(typeof crack==="function"?crack("hash"):(typeof scan==="function"?scan("10.0.0.0/24"):(typeof grab==="function"?grab():(typeof flood==="function"?flood("target.ficticio.io"):(typeof phish==="function"?phish("banco.com"):undefined)))));  return _r;');
      const fake={log:(...a)=>logs.push(a.join(' ')),error:(...a)=>logs.push('[ERR] '+a.join(' '))};
      const ret=fn(fake);
      if(ret!==undefined) logs.push(String(ret));
      logs.forEach(l=>this.termLog('out',l));
      this.termLog('out','✅ Execução concluída (simulada).');
    } catch(e){ this.termLog('err','Erro: '+e.message); }
  },

  deleteTool(id){
    const tools = this.getTools().filter(t=>t.id!==id);
    this.setTools(tools);
    this.renderTools();
    this.termLog('out','🗑️ Ferramenta removida.');
  },

  termLog(type, text){
    const term = document.getElementById('hackTerminal');
    if(!term) return;
    const line = document.createElement('div');
    line.className = 'terminal-line '+type;
    line.textContent = (type==='cmd'?'root@codeplay:~# ':'')+text;
    term.appendChild(line);
    term.scrollTop = term.scrollHeight;
  },

  execCmd(){
    const inp = document.getElementById('terminalInput');
    if(!inp) return;
    const cmd = inp.value.trim();
    inp.value='';
    if(!cmd) return;
    this.termLog('cmd', cmd);
    const parts = cmd.split(' ');
    switch(parts[0].toLowerCase()){
      case 'help':
        ['Comandos disponíveis:','  help    – mostra esta ajuda','  list    – lista ferramentas','  status  – status do sistema','  scan    – escaneia rede fictícia','  clear   – limpa terminal','  run [nome] – executa ferramenta'].forEach(l=>this.termLog('out',l));
        break;
      case 'list':
        const tools=this.getTools();
        if(!tools.length){ this.termLog('out','Nenhuma ferramenta cadastrada.'); break; }
        tools.forEach(t=>this.termLog('out',`[${t.power}%] ${t.emoji||'☠️'} ${t.name} (${t.type})`));
        break;
      case 'status':
        this.termLog('out','🟢 Sistema: ONLINE');
        this.termLog('out','🔐 Firewall fictício: ATIVO');
        this.termLog('out','💾 RAM: '+(Math.random()*16+4).toFixed(1)+'GB usada');
        this.termLog('out','📡 Conexões ativas: '+Math.floor(Math.random()*9999));
        break;
      case 'scan':
        const target = parts[1]||'192.168.0.0/24';
        this.termLog('out','📡 Escaneando '+target+' (fictício)...');
        setTimeout(()=>{
          for(let i=1;i<=5;i++) this.termLog('out',`  10.0.0.${Math.floor(Math.random()*254)+1} – porta ${[22,80,443,3306,27017][i-1]} ABERTA`);
          this.termLog('out','✅ Scan concluído. 5 hosts fictícios encontrados.');
        }, 800);
        break;
      case 'clear':
        document.getElementById('hackTerminal').innerHTML='';
        break;
      case 'run':
        const name=parts.slice(1).join(' ').toLowerCase();
        const t=this.getTools().find(x=>x.name.toLowerCase().includes(name));
        if(t){ this.runTool(t.id); } else { this.termLog('err','Ferramenta "'+name+'" não encontrada. Use "list" para ver as disponíveis.'); }
        break;
      case 'exit':
        this.termLog('out','👋 Encerrando sessão fictícia... até logo!');
        break;
      default:
        this.termLog('err','Comando desconhecido: '+parts[0]+'. Digite "help" para ajuda.');
    }
  }
};

document.addEventListener('DOMContentLoaded', ()=>{
  HackerLab.termLog('out', '☠️  CODEPLAY HACKER LAB v3.1.4 – SIMULAÇÃO FICTÍCIA');
  HackerLab.termLog('out', '⚠️  Todas as operações são 100% fictícias e seguras.');
  HackerLab.termLog('out', '💡 Digite "help" para ver os comandos disponíveis.\n');
  HackerLab.renderTools();

  const form = document.getElementById('hackForm');
  if(form) form.onsubmit = (e)=>{
    e.preventDefault();
    const name = document.getElementById('hackName').value.trim();
    const type = document.getElementById('hackType').value;
    const power = parseInt(document.getElementById('hackPower').value);
    const code = document.getElementById('hackCode').value.trim()||'function main(){ return "Ferramenta "+name+" executando..."; }';
    const EMOJIS={password:'🔓',scanner:'📡',grabber:'🎯',ddos:'⚔️',phishing:'🎣',keylogger:'⌨️',ransomware:'💀',backdoor:'🚪',sniffer:'👃',exploit:'💣'};
    const tool = { id:'ht_'+Date.now(), name, type, power, emoji: EMOJIS[type]||'☠️', code };
    const tools = HackerLab.getTools();
    tools.unshift(tool);
    HackerLab.setTools(tools);
    HackerLab.renderTools();
    HackerLab.termLog('out','✅ Ferramenta "'+name+'" forjada com sucesso!');
    form.reset();
    document.getElementById('powerVal').textContent='50';
  };

  const inp = document.getElementById('terminalInput');
  if(inp) inp.addEventListener('keydown', e=>{ if(e.key==='Enter') HackerLab.execCmd(); });
});
