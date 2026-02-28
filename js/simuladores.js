// ── Simuladores (Mídia, IA, Cloud, Redes, Jogos) ────────────

function out(id, text){ const el=document.getElementById(id); if(!el) return; el.textContent=text; el.classList.add('show'); localStorage.setItem('cp_last_sim_run', Date.now()); }
function rnd(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function ms(){ return (Math.random()*999+1).toFixed(0)+'ms'; }
function ip(){ return [rnd(1,254),rnd(0,255),rnd(0,255),rnd(1,254)].join('.'); }
function uuid(){ return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:r&0x3|0x8).toString(16);}); }

const Sim = {
  switchTab(tab, btn){
    document.querySelectorAll('.sim-panel').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('.sim-tab').forEach(b=>b.classList.remove('active'));
    const p = document.getElementById('tab-'+tab);
    if(p) p.classList.add('active');
    if(btn) btn.classList.add('active');
  },

  // ── MÍDIA ────────────────────────────────────
  media: {
    editVideo(){
      const effect = document.getElementById('videoEffect')?.value || 'Filtro';
      const title = document.getElementById('videoTitle')?.value.trim() || 'Vídeo sem título';
      const dur = rnd(1,120)+'min '+rnd(0,59)+'s';
      const fps = pick([24,30,60,120,240,8000]);
      out('out-video',
        `🎬 Projeto: "${title}"\n` +
        `🎞️ Efeito aplicado: ${effect}\n` +
        `⏱️ Duração: ${dur}\n` +
        `🔢 FPS: ${fps}\n` +
        `📦 Renderizando em 8K Ultra HDR...\n` +
        `✅ Export concluído em ${ms()}!\n` +
        `📁 Salvo em: /exports/${title.replace(/ /g,'_')}_8K.mp4 (${rnd(1,50)}GB fictício)`
      );
    },
    produceMusic(){
      const genre = document.getElementById('musicGenre')?.value || 'Lo-Fi';
      const bpm = document.getElementById('musicBpm')?.value || '128';
      const instruments = pick([['Piano','Baixo','Bateria'],['Sintetizador','Violino','Handpan'],['Guitarra Elétrica','Djembe','Theremin']]);
      out('out-music',
        `🎵 Gênero: ${genre} @ ${bpm} BPM\n` +
        `🎸 Instrumentos gerados: ${instruments.join(', ')}\n` +
        `🎛️ Mixagem fictícia em andamento...\n` +
        `🔊 Masterização com IA completada\n` +
        `✅ Faixa pronta: "${genre}_track_${rnd(1,999)}.wav"\n` +
        `🎧 Duração: ${rnd(2,6)}min ${rnd(0,59)}s | Bitrate: ${pick([320,512,1024,9999])}kbps fictício`
      );
    },
    genImage(){
      const prompt = document.getElementById('imgPrompt')?.value.trim() || 'paisagem abstrata';
      const style = document.getElementById('imgStyle')?.value || 'Realista';
      const w = pick([1024,2048,4096,8192]);
      const h = pick([1024,2048,4096,8192]);
      out('out-img',
        `🖼️ Prompt: "${prompt}"\n` +
        `🎨 Estilo: ${style}\n` +
        `📐 Resolução: ${w}×${h}px\n` +
        `⚙️ Gerando com Stable-Fake-XL...\n` +
        `✅ Imagem gerada em ${ms()}!\n` +
        `🔗 URL fictícia: https://img.codeplay.fake/${uuid()}.png`
      );
    },
    recordPodcast(){
      const title = document.getElementById('podcastTitle')?.value.trim() || 'Episódio fictício';
      const cat = document.getElementById('podcastCat')?.value || 'Tecnologia';
      const ep = rnd(1,500);
      out('out-podcast',
        `🎙️ Título: "${title}"\n` +
        `📂 Categoria: ${cat} | Episódio #${ep}\n` +
        `⏺️ Gravando com microfone fictício Neumann U87-X...\n` +
        `🎵 Trilha de abertura adicionada\n` +
        `✅ Episódio gravado e editado!\n` +
        `📡 Distribuído para: SpotifyFake, ApplePodcastsFake, Amazon MusicFake\n` +
        `👥 Ouvintes estimados: ${rnd(100,999999).toLocaleString()}`
      );
    },
    renderVfx(){
      const type = document.getElementById('vfxType')?.value || 'Explosão';
      const frames = document.getElementById('vfxFrames')?.value || '240';
      out('out-vfx',
        `✨ Efeito: ${type}\n` +
        `🎞️ Frames: ${frames} @ 120fps\n` +
        `🖥️ Renderizando em ${rnd(4,64)} GPUs fictícias...\n` +
        `💻 VRAM usada: ${rnd(8,512)}GB (fictício)\n` +
        `✅ VFX renderizado em ${(Math.random()*59+1).toFixed(1)}s!\n` +
        `📁 Output: /vfx/${type.replace(/ /g,'_')}_${frames}f.mov`
      );
    },
    goLive(){
      const title = document.getElementById('streamTitle')?.value.trim() || 'Live CodePlay';
      const platform = document.getElementById('streamPlatform')?.value || 'TwitchFake';
      const viewers = rnd(1,999999);
      out('out-stream',
        `🔴 AO VIVO em ${platform}!\n` +
        `📺 Título: "${title}"\n` +
        `👁️ Espectadores: ${viewers.toLocaleString()}\n` +
        `💰 Doações recebidas: R$ ${(Math.random()*99999).toFixed(2)} (fictício)\n` +
        `📊 Uptime: ${rnd(0,5)}h ${rnd(0,59)}min\n` +
        `🏆 Peak: ${(viewers*rnd(1,5)).toLocaleString()} espectadores simultâneos`
      );
    }
  },

  // ── IA ───────────────────────────────────────
  ia: {
    chat(){
      const msg = document.getElementById('chatMsg')?.value.trim() || 'Olá';
      const model = document.getElementById('chatModel')?.value || 'GPT-Fake';
      const responses = [
        'Com certeza! Com base nos meus '+rnd(10,999)+'T parâmetros fictícios, posso afirmar que a resposta envolve ' +pick(['quantum computing','redes neurais de 5ª geração','algoritmos não-determinísticos'])+'. 🤖',
        'Interessante pergunta! Minha análise fictícia indica '+rnd(42,9999)+'% de probabilidade de que a solução seja baseada em '+pick(['blockchain quântico','DNA computing','photonic processors'])+'. 🧠',
        'Processando em '+rnd(1,9999)+' dimensões paralelas... Resposta: '+pick(['42','A simulação é real','Tudo é dados','Recursão infinita detectada'])+'. ✨',
        'Segundo meus dados fictícios até '+rnd(2024,2199)+': '+pick(['os robôs já nos governam secretamente','a IA atingiu singularidade em 2031','todo código já existe, só precisa ser descoberto'])+'. 🌐'
      ];
      out('out-chat', `💬 Você: ${msg}\n\n🤖 ${model}:\n${pick(responses)}\n\n⚡ Tokens: ${rnd(50,4096)} | Latência: ${ms()}`);
    },
    genImg(){
      const prompt = document.getElementById('aiImgPrompt')?.value.trim() || 'abstrato colorido';
      const model = document.getElementById('aiImgModel')?.value || 'Stable-Fake-XL';
      out('out-aiimg',
        `🎨 Modelo: ${model}\n` +
        `📝 Prompt: "${prompt}"\n` +
        `🔢 Seed: ${rnd(1,9999999)} | Steps: ${rnd(20,150)}\n` +
        `⚡ Gerado em ${ms()}!\n` +
        `📐 ${pick([512,768,1024,2048])}×${pick([512,768,1024,2048])}px\n` +
        `🔗 https://ai-img.codeplay.fake/${uuid().slice(0,8)}.webp`
      );
    },
    genCode(){
      const req = document.getElementById('codeRequest')?.value.trim() || 'hello world';
      const lang = document.getElementById('codeLang')?.value || 'JavaScript';
      const snippets = {
        'JavaScript': `// ${req}\nasync function main() {\n  const result = await fictionalAI.process("${req}");\n  console.log(result); // → '✅ Concluído'\n}`,
        'Python': `# ${req}\nimport fictional_ai as ai\n\ndef main():\n    result = ai.run("${req}", power=9999)\n    print(f"✅ {result}")\n\nmain()`,
        'Rust': `// ${req}\nuse fictional_ai::Engine;\n\nfn main() {\n    let engine = Engine::quantum();\n    println!("{}", engine.run("${req}"));\n}`,
        'COBOL Quântico': `IDENTIFICATION DIVISION.\nPROGRAM-ID. FICTIONAL-AI.\nPROCEDURE DIVISION.\n    CALL "QUANTUM-${req.toUpperCase().replace(/ /g,'-')}" END-CALL.\n    STOP RUN.`,
        'BrainFuck++': `+[-->-[>>+>-----<<]<--<---]>-.>>>+.>>..+++[.>]<<<<.+++.------.<<-.>>>>+.`
      };
      out('out-code', `👨‍💻 ${lang} | Tarefa: "${req}"\n\n${snippets[lang]||snippets['JavaScript']}\n\n✅ Código gerado em ${ms()} com 0 bugs (fictícios)`);
    },
    tts(){
      const text = document.getElementById('ttsText')?.value.trim() || 'Olá mundo';
      const voice = document.getElementById('ttsVoice')?.value || 'Robô';
      const dur = (text.length * 0.05).toFixed(1);
      out('out-tts',
        `🔊 Voz: ${voice}\n` +
        `📝 Texto: "${text.slice(0,60)}${text.length>60?'...':''}"\n` +
        `⏱️ Duração estimada: ${dur}s\n` +
        `🎵 Frequência: ${rnd(100,300)}Hz | Sample Rate: ${pick([22050,44100,48000,192000])}Hz\n` +
        `✅ Áudio sintetizado!\n` +
        `📁 /tts/output_${Date.now()}.wav (${(dur*0.1).toFixed(1)}MB fictício)`
      );
    },
    translate(){
      const text = document.getElementById('translateText')?.value.trim() || 'Olá';
      const pair = document.getElementById('translateLang')?.value || 'Inglês';
      const translations = {
        'Português → Inglês': text.replace(/olá/gi,'Hello').replace(/obrigado/gi,'Thank you').replace(/bom dia/gi,'Good morning') + ' [translated]',
        'Português → Japonês': text.split('').map(c=>String.fromCharCode(c.charCodeAt(0)+0x30A0-0x41)).join('')+'。',
        'Português → Klingon': text.split(' ').map(()=>pick(['nuqneH','majQa','Qapla','tlhIngan','bortaS'])).join(' ')+"'",
        'Português → Élfico': text.split(' ').map(()=>pick(['mellon','namárië','aiya','lúmenn','galad'])).join(' ')+'.',
        'Português → Emoji': text.split(' ').map(()=>pick(['🌟','🚀','💡','⚡','🔥','🎯','✨','🌊','🎭','🤖'])).join(''),
        'Português → Bináro': text.split('').map(c=>c.charCodeAt(0).toString(2).padStart(8,'0')).join(' ')
      };
      const t = translations[pair] || text.split('').reverse().join('');
      out('out-translate', `🌍 ${pair}\n📝 Original: "${text}"\n\n✍️ Tradução:\n${t}\n\n⚡ ${rnd(99,9999)} idiomas disponíveis | Latência: ${ms()}`);
    },
    write(){
      const prompt = document.getElementById('writePrompt')?.value.trim() || 'aventura';
      const style = document.getElementById('writeStyle')?.value || 'Conto';
      const lengths = {Conto:rnd(500,2000), 'Artigo Científico':rnd(3000,8000), 'Roteiro de Filme':rnd(8000,20000), Poesia:rnd(50,300), 'Manifesto Fictício':rnd(1000,5000)};
      const openers = {
        Conto: `Era uma vez, em um mundo onde ${prompt} era a única certeza, `,
        'Artigo Científico': `Abstract: Este trabalho apresenta uma análise fictícia sobre ${prompt}, `,
        'Roteiro de Filme': `FADE IN:\nEXT. UNIVERSO FICTÍCIO – DIA\n\nNARRATOR (V.O.)\n"${prompt}... isso mudou tudo."`,
        Poesia: `No ${prompt} que habita o impossível,\ncada byte, um verso incorruptível,\nas linhas de código dançam livres,\nas funções cantam, os loops vibram...`,
        'Manifesto Fictício': `Nós, os habitantes do ${prompt}, declaramos que toda realidade é opcional!`
      };
      out('out-write',
        `✍️ ${style} sobre: "${prompt}"\n` +
        `📏 Palavras: ~${lengths[style]||rnd(200,1000)}\n\n` +
        `${openers[style]||openers['Conto']}\n[...continua por mais ${(lengths[style]||500)-50} palavras fictícias...]\n\n` +
        `✅ Texto gerado em ${ms()}!`
      );
    }
  },

  // ── CLOUD ────────────────────────────────────
  cloud: {
    launchVM(){
      const type = document.getElementById('vmType')?.value || 't999.nano';
      const name = document.getElementById('vmName')?.value.trim() || 'instance-'+rnd(1,9999);
      out('out-vm',
        `🖥️ VM "${name}" provisionada!\n` +
        `📦 Tipo: ${type}\n` +
        `🌍 Região: sa-east-1 (São Paulo Fictício)\n` +
        `🔑 Key Pair: ${uuid().slice(0,16)}\n` +
        `🌐 IP público: ${ip()}\n` +
        `🔒 IP privado: 10.${rnd(0,255)}.${rnd(0,255)}.${rnd(1,254)}\n` +
        `✅ Status: RUNNING | Boot: ${ms()}`
      );
    },
    createBucket(){
      const name = document.getElementById('bucketName')?.value.trim() || 'my-bucket-'+rnd(1000,9999);
      const region = document.getElementById('bucketRegion')?.value || 'sa-east-1';
      out('out-bucket',
        `💾 Bucket "${name}" criado!\n` +
        `🌍 Região: ${region}\n` +
        `📦 Capacidade: ∞ Exabytes\n` +
        `🔒 Criptografia: AES-9999-GCM (fictício)\n` +
        `🌐 Endpoint: https://${name}.s3.codeplay.fake\n` +
        `✅ Bucket ativo e pronto para uso!`
      );
    },
    createDB(){
      const engine = document.getElementById('dbEngine')?.value || 'PostgreSQL-Fake';
      const name = document.getElementById('dbName')?.value.trim() || 'db-'+rnd(100,9999);
      out('out-db',
        `🗄️ DB "${name}" criado!\n` +
        `⚙️ Engine: ${engine}\n` +
        `💾 Armazenamento: ${rnd(100,10000)}GB SSD NVMe Quântico\n` +
        `🔗 Endpoint: ${name}.db.codeplay.fake:${pick([5432,3306,27017,6379])}\n` +
        `👤 Usuário: admin | Senha: ******* (fictícia)\n` +
        `✅ Banco online! Latência: <${rnd(1,5)}ms`
      );
    },
    deployCDN(){
      const domain = document.getElementById('cdnDomain')?.value.trim() || 'meusite.ficticio.io';
      const edge = document.getElementById('cdnEdge')?.value || '500 PoPs';
      out('out-cdn',
        `🌐 CDN ativada para ${domain}!\n` +
        `📡 Edge: ${edge}\n` +
        `⚡ Latência global: <${rnd(1,5)}ms\n` +
        `📊 Bandwidth: ${rnd(100,9999)} Tbps disponível\n` +
        `🔒 SSL/TLS Quântico ativado\n` +
        `✅ Cache propagado em todos os PoPs!`
      );
    },
    scheduleBackup(){
      const source = document.getElementById('backupSource')?.value.trim() || '/dados';
      const freq = document.getElementById('backupFreq')?.value || 'Contínuo';
      out('out-backup',
        `🔒 Backup agendado para "${source}"\n` +
        `⏰ Frequência: ${freq}\n` +
        `🔐 Criptografia: AES-99999-Quantum\n` +
        `🌊 Destino: Bunkers submarinos fictícios (3 continentes)\n` +
        `📦 Estimativa: ${rnd(1,500)}TB/backup\n` +
        `✅ Primeira execução em ${rnd(1,60)}s!`
      );
    },
    deployFn(){
      const name = document.getElementById('fnName')?.value.trim() || 'my-function';
      const code = document.getElementById('fnCode')?.value.trim() || "exports.handler = async () => 'ok';";
      const arn = 'arn:codeplay:lambda:fake:'+rnd(100000000,999999999)+':function:'+name;
      out('out-fn',
        `⚡ Função "${name}" deployada!\n` +
        `🔑 ARN: ${arn}\n` +
        `🏃 Runtime: Node.js-Fake 99.x\n` +
        `💾 Memória: ${pick([128,256,512,1024,10240])}MB\n` +
        `⏱️ Timeout: ${rnd(1,900)}s\n` +
        `📡 Endpoint: https://lambda.codeplay.fake/${uuid().slice(0,8)}\n` +
        `✅ Cold start: ${rnd(1,10)}ms (quântico!)`
      );
    }
  },

  // ── REDES ────────────────────────────────────
  redes: {
    _monitorIv: null,
    configRouter(){
      const ssid = document.getElementById('routerSSID')?.value.trim() || 'CodePlay-Net';
      const std = document.getElementById('routerStd')?.value || 'Wi-Fi 9';
      out('out-router',
        `📡 Roteador configurado!\n` +
        `📶 SSID: "${ssid}"\n` +
        `⚡ Padrão: ${std}\n` +
        `🔒 Segurança: WPA4-Quantum\n` +
        `📍 Alcance: ${rnd(100,10000)}m\n` +
        `🌐 IP Gateway: 192.168.${rnd(0,255)}.1\n` +
        `✅ Rede ativa! ${rnd(0,999)} dispositivos conectáveis`
      );
    },
    addFwRule(){
      const ipAddr = document.getElementById('fwIp')?.value.trim() || ip();
      const action = document.getElementById('fwAction')?.value || 'Bloquear';
      out('out-fw',
        `🛡️ Regra adicionada!\n` +
        `🎯 IP: ${ipAddr}\n` +
        `🔴 Ação: ${action}\n` +
        `📋 Regra #${rnd(1000,9999)}: DROP src ${ipAddr} dst any\n` +
        `✅ Firewall atualizado em ${ms()}`
      );
    },
    connectVPN(){
      const server = document.getElementById('vpnServer')?.value || 'Brasil';
      out('out-vpn',
        `🔐 VPN Conectada!\n` +
        `🌍 Servidor: ${server}\n` +
        `🔒 Protocolo: QuantumTunnel v9\n` +
        `🌐 Novo IP fictício: ${ip()}\n` +
        `⚡ Criptografia: AES-99999 + RSA-99999\n` +
        `📊 Velocidade: ${rnd(100,10000)} Mbps\n` +
        `✅ Conexão estável! Latência: ${rnd(1,20)}ms`
      );
    },
    manageDNS(){
      const zone = document.getElementById('dnsZone')?.value.trim() || 'exemplo.ficticio.io';
      const type = document.getElementById('dnsType')?.value || 'A';
      out('out-dns',
        `🌍 Zona DNS atualizada!\n` +
        `📂 Zona: ${zone}\n` +
        `📋 Tipo: ${type} | TTL: 0s (instantâneo!)\n` +
        `🔢 Registros: ${rnd(1,50)} ativos\n` +
        `🌐 NS Fictícios: ns1.codeplay.fake, ns2.codeplay.fake\n` +
        `✅ Propagado globalmente em ${ms()}`
      );
    },
    startMonitor(){
      const iface = document.getElementById('monitorIface')?.value.trim() || 'eth0';
      const el = document.getElementById('out-monitor');
      if(!el) return;
      el.classList.add('show');
      let tick=0;
      if(this._monitorIv) clearInterval(this._monitorIv);
      this._monitorIv = setInterval(()=>{
        tick++;
        const rx = rnd(1,9999); const tx = rnd(1,9999);
        el.textContent =
          `📊 Monitor: ${iface} (tick #${tick})\n` +
          `⬇️  RX: ${rx} Mbps | Pacotes: ${rnd(1000,99999)}\n` +
          `⬆️  TX: ${tx} Mbps | Pacotes: ${rnd(1000,99999)}\n` +
          `🔴 Erros: ${rnd(0,3)} | Drops: ${rnd(0,1)}\n` +
          `📡 Conexões ativas: ${rnd(10,9999)}\n` +
          `🕒 ${new Date().toLocaleTimeString('pt-BR')}`;
      }, 1000);
      el.textContent = `📊 Monitorando ${iface}...`;
    },
    stopMonitor(){
      if(this._monitorIv){ clearInterval(this._monitorIv); this._monitorIv=null; }
      const el = document.getElementById('out-monitor');
      if(el){ el.textContent='⏹ Monitor parado.'; el.classList.add('show'); }
    },
    scan(){
      const target = document.getElementById('scanTarget')?.value.trim() || '192.168.0.0/24';
      const type = document.getElementById('scanType')?.value || 'Básico';
      const vulns = rnd(0,15);
      const ports = Array.from({length:rnd(3,8)},()=>pick([21,22,23,25,80,443,3306,5432,6379,8080,27017]));
      out('out-scan',
        `🔍 Scan ${type}: ${target}\n` +
        `📡 Portas abertas: ${ports.join(', ')}\n` +
        `⚠️ Vulnerabilidades fictícias: ${vulns}\n` +
        `${vulns>0?'🔴 CVE-FAKE-'+rnd(2020,2026)+'-'+rnd(10000,99999)+' detectada!\n':''}`+
        `✅ Scan concluído em ${(Math.random()*9+1).toFixed(1)}s`
      );
    }
  },

  // ── JOGOS ────────────────────────────────────
  jogos: {
    createRPG(){
      const name = document.getElementById('rpgName')?.value.trim() || 'Herói Anônimo';
      const cls = document.getElementById('rpgClass')?.value || 'Guerreiro';
      const stats = {HP:rnd(100,9999),MP:rnd(50,5000),ATK:rnd(10,999),DEF:rnd(5,500),SPD:rnd(1,300)};
      const skills = [pick(['Corte Quântico','Bola de Fogo de Dados','Teletransporte de Loop','Invocação de Array','Recursão Infinita']),pick(['Escudo de Cache','Buff de Garbage Collector','Debuff de Memory Leak','Cura de Refactor'])];
      out('out-rpg',
        `⚔️ Personagem criado!\n` +
        `👤 Nome: ${name}\n` +
        `🎭 Classe: ${cls} (Nível ${rnd(1,99)})\n` +
        `📊 Stats: HP:${stats.HP} | MP:${stats.MP} | ATK:${stats.ATK} | DEF:${stats.DEF} | SPD:${stats.SPD}\n` +
        `✨ Habilidades: ${skills.join(' / ')}\n` +
        `⭐ Raridade: ${pick(['Comum','Raro','Épico','Lendário','QUEBRADO OP'])}`
      );
    },
    playFPS(){
      const nick = document.getElementById('fpsNick')?.value.trim() || 'Player1';
      const weapon = document.getElementById('fpsWeapon')?.value || 'Railgun';
      const kills = rnd(0,50); const deaths = rnd(0,20); const kd = (kills/(deaths||1)).toFixed(2);
      out('out-fps',
        `🔫 Partida FPS finalizada!\n` +
        `👤 ${nick} com ${weapon}\n` +
        `💀 K/D/A: ${kills}/${deaths}/${rnd(0,20)}\n` +
        `⭐ KD Ratio: ${kd}\n` +
        `🏆 MVP: ${kills>15?'SIM! ':'NÃO '}| Rank: ${pick(['Ferro','Bronze','Prata','Ouro','Platina','Diamante','Mestre','Challeng'])}\n` +
        `🎯 Precisão fictícia: ${rnd(10,100)}%`
      );
    },
    race(){
      const racer = document.getElementById('racerName')?.value.trim() || 'Piloto';
      const car = document.getElementById('raceCar')?.value || 'Bugatti Quantum X';
      const pos = rnd(1,20);
      const time = `${rnd(0,2)}:${String(rnd(10,59)).padStart(2,'0')}.${rnd(100,999)}`;
      out('out-race',
        `🏎️ Corrida concluída!\n` +
        `👤 ${racer} no ${car}\n` +
        `🏁 Posição: ${pos}º de 20\n` +
        `⏱️ Melhor volta: ${time}\n` +
        `⚡ Velocidade máxima: ${rnd(200,9999)} km/h fictício\n` +
        `🏆 ${pos===1?'VITÓRIA! 🥇':pos<=3?'PÓDIO! 🏆':'Continue treinando!'}`
      );
    },
    rts(){
      const base = document.getElementById('stratBase')?.value.trim() || 'Base Alpha';
      const faction = document.getElementById('stratFaction')?.value || 'Aliança';
      const units = rnd(100,9999);
      const won = Math.random()>0.4;
      out('out-rts',
        `♟️ Batalha RTS!\n` +
        `🏰 Base: ${base} (${faction})\n` +
        `⚔️ Unidades deployadas: ${units.toLocaleString()}\n` +
        `💥 Inimigos derrotados: ${rnd(50,units)}\n` +
        `⏱️ Duração: ${rnd(5,120)}min\n` +
        `🏆 Resultado: ${won?'VITÓRIA! ✅':'DERROTA... 💀 Reagrupe e tente novamente!'}`
      );
    },
    moba(){
      const player = document.getElementById('mobaPlayer')?.value.trim() || 'Summoner';
      const hero = document.getElementById('mobaHero')?.value || 'CodeMaster';
      const kda = `${rnd(0,20)}/${rnd(0,10)}/${rnd(0,30)}`;
      const cs = rnd(50,400);
      const won = Math.random()>0.45;
      out('out-moba',
        `🏰 Partida MOBA!\n` +
        `👤 ${player} → ${hero}\n` +
        `⚔️ KDA: ${kda} | CS: ${cs}\n` +
        `🏆 ${won?'Nexus destruído! VITÓRIA! ✅':'Nexus caiu... DERROTA 💀'}\n` +
        `🎯 Dano total: ${(rnd(10000,999999)).toLocaleString()}\n` +
        `⭐ Avaliação: ${pick(['S+','S','A','B','C','D (não fez nada)'])}`
      );
    },
    sandbox(){
      const seed = document.getElementById('sandboxSeed')?.value.trim() || ''+rnd(1,99999);
      const mode = document.getElementById('sandboxMode')?.value || 'Criativo';
      out('out-sandbox',
        `🎲 Mundo criado!\n` +
        `🌱 Semente: ${seed}\n` +
        `🎮 Modo: ${mode}\n` +
        `🌍 Tamanho: ${rnd(10,10000)}km²\n` +
        `🏔️ Biomas: ${pick(['Floresta Quântica','Deserto de Pixels','Oceano de Dados','Montanhas de Código'])}\n` +
        `👾 Entidades geradas: ${rnd(1000,999999).toLocaleString()}\n` +
        `✅ Mundo "${seed}" pronto para explorar!`
      );
    }
  }
};

document.addEventListener('DOMContentLoaded', ()=>{
  // Already handled by tab buttons
});
