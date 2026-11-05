// Protótipo fictício do Clubix: painel do atendente em versão mobile.
// Dados de exemplo; nada aqui conversa com servidor.

const ClubixPrototype = (() => {
  const LIMIT = 5;
  const ATT = [{ id: 'me', nome: 'Marina' }, { id: 'c', nome: 'Carlos' }, { id: 'b', nome: 'Beatriz' }];
  const QUICK = [
    ['/ola', 'Olá! Sou a Marina, do atendimento do Clube. Como posso ajudar?'],
    ['/horario', 'A secretaria atende de segunda a sexta, das 8h às 18h.'],
    ['/obrigado', 'Obrigada pelo contato! Posso ajudar em mais alguma coisa?'],
  ];
  const FLOWS = [
    { nome: 'Boas-vindas', blocos: [
      ['start', 'Início', 'Cliente abre o chat no portal'],
      ['msg', 'Mensagem', '"Olá! Sou o HAL, assistente do Clube. Como posso ajudar?"'],
      ['ia', 'HAL (IA)', 'Responde dúvidas sobre atividades, avisos e estatuto'],
      ['cond', 'Condição', 'Resolveu a dúvida? Se não, oferece um atendente'],
      ['fila', 'Fila de atendimento', 'Prioridade alta se for associado logado'],
      ['fim', 'Fim', 'Pesquisa de satisfação'],
    ] },
    { nome: 'Fora do expediente', blocos: [
      ['start', 'Início', 'Chat aberto fora do horário'],
      ['cond', 'Condição', 'Horário comercial? (editável no painel)'],
      ['msg', 'Mensagem', '"Nosso atendimento humano volta amanhã às 8h."'],
      ['ia', 'HAL (IA)', 'Segue respondendo sozinho'],
      ['fim', 'Fim', 'Registra o contato para retorno'],
    ] },
    { nome: 'Segunda via', blocos: [
      ['start', 'Início', 'Cliente escolhe "Financeiro"'],
      ['menu', 'Menu', '1 Boleto · 2 Mensalidade · 3 Falar com atendente'],
      ['msg', 'Mensagem', 'Envia o link seguro da segunda via'],
      ['fila', 'Fila de atendimento', 'Só se o cliente escolher a opção 3'],
      ['fim', 'Fim', 'Encerra e arquiva'],
    ] },
  ];
  const ICON = { start: '▶', msg: '✉', menu: '☰', cond: '◇', ia: '✦', fila: '⇥', fim: '■' };
  const CONTATOS = [
    ['Secretaria', 'Atendimento', '201', 1], ['Financeiro', 'Cobrança', '214', 1], ['Esportes', 'Coordenação', '230', 0],
    ['Portaria', 'Segurança', '100', 1], ['Eventos', 'Reservas', '245', 1], ['TI', 'Suporte', '299', 1], ['Diretoria', 'Gabinete', '210', 0],
  ];

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  function mount(host) {
    const esc = ProtoShell.esc;
    const S = {
      load: { me: 2, c: 4, b: 3 },
      queue: [
        { id: 1, nome: 'Helena Prado', assunto: 'Segunda via da carteirinha', assoc: true, espera: 148, pergunta: 'Preciso da segunda via da minha carteirinha, perdi na semana passada.', hal: 'HAL não encontrou a regra de reemissão e transferiu.' },
        { id: 2, nome: 'Visitante 4821', assunto: 'Horário da piscina', assoc: false, espera: 95, pergunta: 'A piscina abre aos domingos?', hal: 'HAL pediu confirmação de horário especial.' },
        { id: 3, nome: 'Roberto Lima', assunto: 'Reserva de quadra', assoc: true, espera: 62, pergunta: 'Quero reservar a quadra 2 para sábado à tarde.', hal: 'Reserva exige atendente.' },
        { id: 4, nome: 'Visitante 4825', assunto: 'Como me associar?', assoc: false, espera: 30, pergunta: 'Quais documentos preciso para me associar?', hal: 'Cliente pediu falar com humano.' },
      ],
      chats: [
        { id: 101, nome: 'Marcos Dias', assunto: 'Cancelamento de plano', msgs: [['them', 'Boa tarde, quero cancelar meu plano familiar.'], ['me', 'Claro, Marcos. Vou verificar seu cadastro.']] },
        { id: 102, nome: 'Visitante 4790', assunto: 'Aulas de natação', msgs: [['them', 'Tem vaga para natação infantil?']] },
      ],
      open: null, flow: 0, step: -1,
      arch: { state: 'idle', pct: 0 },
      roles: [['Marina', 'Atendente'], ['Carlos', 'Editor'], ['Beatriz', 'Atendente'], ['Diego', 'Administrador']],
      call: null, query: '',
    };
    const ROLES = ['Atendente', 'Editor', 'Administrador'];
    let ctx;

    // Barra superior igual à do Clubix real: degradê grená + selo do balão
    const LOGO = '<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="11" fill="#fff"/><g transform="translate(7.2 7.2) scale(1.0333)" fill="#7a1230"><path d="M12 3.2c-5.1 0-9.2 3.4-9.2 7.8 0 2.1.9 4 2.5 5.4L4.4 20.6l4.2-2.1c1.1.3 2.2.5 3.4.5 5.1 0 9.2-3.4 9.2-7.8S17.1 3.2 12 3.2Z"/><circle cx="8" cy="11" r="1.2" fill="#fff"/><circle cx="12" cy="11" r="1.2" fill="#fff"/><circle cx="16" cy="11" r="1.2" fill="#fff"/></g></svg>';
    const appbar = () => `<div class="px-appbar"><span class="px-logo">${LOGO}</span><div class="px-apptitle"><b>Clubix</b><small>CENTRAL DE ATENDIMENTO</small></div><button class="px-moon" data-moon aria-label="Alternar tema"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button></div>`;
    const wrap = f => () => appbar() + `<div class="px-body">${f()}</div>`;

    const sortedQueue = () => [...S.queue].sort((a, b) => (b.assoc - a.assoc) || (b.espera - a.espera));

    /* ---------- Páginas ---------- */
    const filaHtml = () => `
      <header class="px-head"><div><small>Central de atendimento</small><h1>Fila</h1></div><div class="px-avatar">M</div></header>
      <div class="cx-team">${ATT.map(a => `<div class="cx-att"><b>${a.id === 'me' ? 'Você' : a.nome}</b>
        <div class="cx-bar"><i class="${S.load[a.id] >= LIMIT ? 'full' : ''}" style="width:${S.load[a.id] / LIMIT * 100}%"></i></div>
        <small>${S.load[a.id]}/${LIMIT} conversas</small></div>`).join('')}</div>
      <button class="cx-auto" data-auto>⚡ Distribuir automaticamente</button>
      <h3 class="cx-h">Aguardando (${S.queue.length})</h3>
      <div class="px-list">${S.queue.length ? sortedQueue().map(c => `
        <div class="cx-q"><div class="px-avatar">${esc(c.nome[0])}</div>
          <div class="cx-q-body"><b>${esc(c.nome)}</b><small>${esc(c.assunto)}</small>
            <div class="cx-badges">${c.assoc ? '<span class="gold">Associado logado</span>' : '<span>Visitante</span>'}<span class="ia">via HAL</span><span class="wait">⏱ <em data-wait="${c.id}">${fmt(c.espera)}</em></span></div>
            <p>${esc(c.hal)}</p></div>
          <button class="cx-take" data-take="${c.id}">Assumir</button></div>`).join('') : '<p class="px-empty">Fila vazia 🎉</p>'}</div>`;

    const conversasHtml = () => `
      <header class="px-head"><h1>Conversas</h1><span class="cx-count">${S.chats.length} ativas</span></header>
      <div class="px-list">${S.chats.length ? S.chats.map(c => { const l = c.msgs[c.msgs.length - 1]; return `
        <button class="px-row" data-chat="${c.id}"><div class="px-avatar">${esc(c.nome[0])}</div>
        <div class="px-row-body"><b>${esc(c.nome)}</b><small>${esc(c.assunto)}</small><span>${esc(l ? l[1] : 'Sem mensagens')}</span></div>${l && l[0] === 'them' ? '<i class="px-dot"></i>' : ''}</button>`; }).join('') : '<p class="px-empty">Nenhuma conversa ativa. Assuma alguém da fila.</p>'}</div>`;

    const fluxosHtml = () => {
      const f = FLOWS[S.flow];
      return `<header class="px-head"><div><small>Editor visual</small><h1>Fluxos</h1></div></header>
        <div class="px-chips">${FLOWS.map((x, i) => `<button class="cx-chip ${i === S.flow ? 'on' : ''}" data-flow="${i}">${esc(x.nome)}</button>`).join('')}</div>
        <button class="cx-auto" data-testflow>▶ Testar fluxo</button>
        <div class="cx-flow">${f.blocos.map((b, i) => `${i ? '<div class="cx-link"></div>' : ''}
          <button class="cx-block ${b[0]} ${S.step === i ? 'active' : ''} ${S.step > i ? 'done' : ''}" data-block="${i}"><span class="cx-ic">${ICON[b[0]]}</span><div><b>${esc(b[1])}</b><small>${esc(b[2])}</small></div></button>`).join('')}</div>`;
    };

    const contatosList = () => {
      const t = S.query.toLowerCase();
      const l = CONTATOS.map((c, i) => [c, i]).filter(([c]) => (c[0] + c[1] + c[2]).toLowerCase().includes(t));
      return l.length ? l.map(([c, i]) => `<div class="cx-contact"><div class="px-avatar">${esc(c[0][0])}</div>
        <div class="px-row-body"><b>${esc(c[0])}</b><small>${esc(c[1])} · ramal ${c[2]}</small></div>
        <i class="cx-presence ${c[3] ? 'on' : ''}"></i><button class="cx-call" data-call="${i}" aria-label="Ligar">📞</button></div>`).join('') : '<p class="px-empty">Nenhum contato.</p>';
    };
    const ramaisHtml = () => `
      <header class="px-head"><div><small>Telefonia VoIP SIP</small><h1>Ramais</h1></div></header>
      <div class="px-search"><span>⌕</span><input data-keep="q" data-q placeholder="Buscar setor ou ramal…" value="${esc(S.query)}"></div>
      <div class="px-list" data-clist>${contatosList()}</div>`;

    const adminHtml = () => {
      const a = S.arch;
      return `<header class="px-head"><div><small>Controle de acesso</small><h1>Admin</h1></div></header>
        <div class="cx-card"><b>Equipe e níveis</b><small>Toque para alternar o nível de acesso.</small>
          ${S.roles.map((r, i) => `<button class="cx-role" data-role="${i}"><div class="px-avatar">${r[0][0]}</div><span>${r[0]}</span><em class="${r[1]}">${r[1]}</em></button>`).join('')}</div>
        <div class="cx-card"><b>Arquivamento de conversas</b>
          <small>Compressor em Rust com verificação de integridade antes de apagar.</small>
          <div class="cx-arch"><div><strong>1.284</strong><small>conversas</small></div><div><strong>412 → 38 MB</strong><small>após compressão</small></div></div>
          ${a.state === 'run' ? `<div class="cx-prog"><i style="width:${a.pct}%"></i></div><small>${a.pct < 60 ? 'Comprimindo…' : 'Verificando integridade…'} ${a.pct}%</small>`
            : `<small class="${a.state === 'done' ? 'ok' : ''}">${a.state === 'done' ? '✓ Integridade verificada (hash conferido). Originais apagados com segurança.' : 'Último arquivamento: hoje, 03:00 ✓'}</small>`}
          <button class="cx-auto" data-archive ${a.state === 'run' ? 'disabled' : ''}>${a.state === 'run' ? 'Executando…' : 'Rodar arquivamento'}</button></div>
        <p class="cx-note">Dados ilustrativos.</p>`;
    };

    /* ---------- Camadas ---------- */
    function chatLayer() {
      const c = S.open;
      return `<div class="px-chat">
        <header class="px-chat-head"><button class="px-back dark" data-close="chat">‹</button><div class="px-avatar">${esc(c.nome[0])}</div>
          <div class="grow"><b>${esc(c.nome)}</b><small>${esc(c.assunto)}</small></div><button class="cx-xfer" data-transfer>⇄ Transferir</button></header>
        <div class="px-msgs" data-msgs></div>
        <div class="cx-quick">${QUICK.map((qk, i) => `<button data-quick="${i}">${qk[0]}</button>`).join('')}</div>
        <form class="px-compose" data-compose><button type="button" class="cx-attach" data-attach aria-label="Anexar imagem">📎</button><input autocomplete="off" placeholder="Mensagem ou /atalho…"><button>➤</button></form></div>`;
    }
    function paintMsgs(typing) {
      const box = ctx.q('[data-msgs]'); if (!box || !S.open) return;
      box.innerHTML = S.open.msgs.map(([w, t]) => `<div class="px-msg ${w}">${esc(t)}</div>`).join('') + (typing ? '<div class="px-msg them typing"><i></i><i></i><i></i></div>' : '');
      box.scrollTop = box.scrollHeight;
    }
    function say(text) {
      const c = S.open; if (!c || !text.trim()) return;
      c.msgs.push(['me', text.trim()]); paintMsgs(true);
      ctx.later(() => { c.msgs.push(['them', ['Entendi, muito obrigado!', 'Perfeito, aguardo então.', 'Ótimo, pode ser assim.'][c.msgs.length % 3]]); if (S.open === c) paintMsgs(); ctx.renderPage(1); }, 1200);
    }
    const openChat = id => { S.open = S.chats.find(c => c.id === id); ctx.openLayer('chat', chatLayer()); paintMsgs(); };
    function sheet(title, body) { ctx.openLayer('sheet', `<div class="cx-sheet-bg" data-close="sheet"></div><div class="cx-sheet"><b>${title}</b>${body}</div>`); }

    function callLayer(i) {
      const c = CONTATOS[i];
      S.call = { i, secs: 0, on: false, timer: null };
      ctx.openLayer('call', `<div class="cx-call-screen"><div class="px-avatar big">${esc(c[0][0])}</div><h2>${esc(c[0])}</h2>
        <small data-callstate>Chamando ramal ${c[2]}…</small><div class="cx-ring"></div>
        <div class="cx-call-actions"><button data-mute>🔇<span>Mudo</span></button><button class="end" data-hangup>✕<span>Encerrar</span></button></div></div>`);
      ctx.later(() => {
        if (!S.call) return; S.call.on = true;
        S.call.timer = ctx.every(() => { S.call.secs++; const el = ctx.q('[data-callstate]'); if (el) el.textContent = `Em ligação · ${fmt(S.call.secs)}`; }, 1000);
        const el = ctx.q('[data-callstate]'); if (el) el.textContent = 'Em ligação · 0:00';
      }, 1300);
    }
    function hangup() {
      if (!S.call) return; const s = S.call; if (s.timer) ctx.clear(s.timer); S.call = null;
      ctx.closeLayer('call'); ctx.toast(s.on ? `Chamada encerrada · ${fmt(s.secs)}` : 'Chamada cancelada');
    }

    /* ---------- Ações ---------- */
    function take(id) {
      if (S.load.me >= LIMIT) return ctx.toast(`Você já está com ${LIMIT} conversas (limite)`);
      const q = S.queue.find(x => x.id === id); if (!q) return;
      S.queue = S.queue.filter(x => x !== q); S.load.me++;
      S.chats.unshift({ id: q.id, nome: q.nome, assunto: q.assunto, msgs: [['them', q.pergunta]] });
      ctx.renderPage(0); ctx.renderPage(1); ctx.toast(`Você assumiu ${q.nome}`);
    }
    function distribute() {
      let n = 0; const left = [];
      for (const q of sortedQueue()) {
        const cand = Object.keys(S.load).filter(k => S.load[k] < LIMIT).sort((a, b) => S.load[a] - S.load[b])[0];
        if (!cand) { left.push(q); continue; }
        S.load[cand]++; n++;
        if (cand === 'me') S.chats.unshift({ id: q.id, nome: q.nome, assunto: q.assunto, msgs: [['them', q.pergunta]] });
      }
      S.queue = left; ctx.renderPage(0); ctx.renderPage(1);
      ctx.toast(n ? `${n} distribuídas por menor carga${left.length ? ` · ${left.length} sem vaga` : ''}` : 'Todos no limite de conversas');
    }
    function testFlow() {
      const n = FLOWS[S.flow].blocos.length; S.step = 0; ctx.renderPage(2);
      const id = ctx.every(() => { S.step++; if (S.step >= n) { ctx.clear(id); S.step = -1; ctx.renderPage(2); ctx.toast('Fluxo concluído ✓'); } else ctx.renderPage(2); }, 650);
    }
    function archive() {
      if (S.arch.state === 'run') return; S.arch = { state: 'run', pct: 0 }; ctx.renderPage(4);
      const id = ctx.every(() => { S.arch.pct = Math.min(100, S.arch.pct + 10); if (S.arch.pct >= 100) { ctx.clear(id); S.arch.state = 'done'; ctx.toast('Arquivamento concluído ✓'); } ctx.renderPage(4); }, 260);
    }

    ctx = ProtoShell.create(host, {
      theme: 'clubix',
      tabs: [{ label: 'Fila', icon: '☰' }, { label: 'Conversas', icon: '✉' }, { label: 'Fluxos', icon: '⑂' }, { label: 'Ramais', icon: '☎' }, { label: 'Admin', icon: '⚙' }],
      layers: ['chat', 'sheet', 'call'],
      render: [filaHtml, conversasHtml, fluxosHtml, ramaisHtml, adminHtml].map(wrap),
      onLayerClose: name => { if (name === 'chat') { S.open = null; ctx.renderPage(1); } },
      onClick(b, c) {
        const d = b.dataset;
        if ('moon' in d) c.root.classList.toggle('dark');
        else if ('auto' in d) distribute();
        else if (d.take) take(+d.take);
        else if (d.chat) openChat(+d.chat);
        else if (d.close === 'chat') ctx.closeLayer('chat');
        else if (d.close === 'sheet') ctx.closeLayer('sheet');
        else if (d.quick != null) say(QUICK[+d.quick][1]);
        else if ('attach' in d) { S.open.msgs.push(['me', '📷 imagem enviada']); paintMsgs(); ctx.toast('Imagem enviada'); }
        else if ('transfer' in d) sheet('Transferir para', ATT.filter(a => a.id !== 'me').map(a => `<button class="cx-opt" data-to="${a.id}"><span>${a.nome}</span><small>${S.load[a.id]}/${LIMIT} conversas</small></button>`).join(''));
        else if (d.to) {
          const a = ATT.find(x => x.id === d.to);
          if (S.load[a.id] >= LIMIT) return ctx.toast(`${a.nome} está no limite`);
          S.load[a.id]++; S.load.me--; S.chats = S.chats.filter(x => x !== S.open);
          ctx.closeLayer('sheet'); ctx.closeLayer('chat'); ctx.renderPage(0); ctx.toast(`Transferida para ${a.nome}`);
        }
        else if (d.flow != null) { S.flow = +d.flow; S.step = -1; ctx.renderPage(2); }
        else if ('testflow' in d) testFlow();
        else if (d.block != null) { const bl = FLOWS[S.flow].blocos[+d.block]; sheet(esc(bl[1]), `<p>${esc(bl[2])}</p><button class="cx-auto" data-close="sheet">Fechar</button>`); }
        else if (d.call != null) callLayer(+d.call);
        else if ('hangup' in d) hangup();
        else if ('mute' in d) { b.classList.toggle('on'); ctx.toast(b.classList.contains('on') ? 'Microfone desligado' : 'Microfone ligado'); }
        else if (d.role != null) { const r = S.roles[+d.role]; r[1] = ROLES[(ROLES.indexOf(r[1]) + 1) % 3]; ctx.renderPage(4); ctx.toast(`${r[0]} agora é ${r[1]}`); }
        else if ('archive' in d) archive();
      },
      onInput(e, c) { if (e.target.matches('[data-q]')) { S.query = e.target.value; c.q('[data-clist]').innerHTML = contatosList(); } },
      onSubmit(e) { if (e.target.matches('[data-compose]')) { const i = e.target.querySelector('input'); const hit = QUICK.find(qk => qk[0] === i.value.trim()); say(hit ? hit[1] : i.value); i.value = ''; } },
    });

    // Cronômetro da fila: só atualiza os números, sem redesenhar a página
    ctx.every(() => { S.queue.forEach(q => { q.espera++; const el = ctx.q(`[data-wait="${q.id}"]`); if (el) el.textContent = fmt(q.espera); }); }, 1000);

    const click = sel => ctx.q(sel)?.click();
    const steps = [
      c => c.go(0), 1500,
      () => click('[data-auto]'), 2200,
      c => c.go(1), 1200,
      () => click('[data-chat]'), 900,
      () => click('[data-quick="1"]'), 2400,
      () => ctx.closeLayer('chat'), 500,
      c => c.go(2), 1000,
      () => click('[data-testflow]'), 4400,
      c => c.go(3), 1100,
      () => click('[data-call="1"]'), 3200,
      () => click('[data-hangup]'), 900,
      c => c.go(4), 1000,
      () => click('[data-archive]'), 3400,
      c => c.go(0),
    ];
    return { tour: () => ctx.tour(steps), stop: () => ctx.stopTour(), destroy: () => ctx.destroy(), _ctx: ctx };
  }

  return { mount };
})();
