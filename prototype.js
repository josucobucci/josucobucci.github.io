// Protótipo interativo e fictício do ZIP4ZIP, desenhado em HTML/CSS/JS puro.
// Não usa banco nem rede: tudo roda no navegador, com dados de exemplo.
// Uso: ZipPrototype.mount(elementoDentroDoCelular) → devolve { tour, stop, destroy }

const ZipPrototype = (() => {
  const W = 360, H = 780; // tamanho lógico da tela; é escalado para caber na moldura

  const PRODUCTS = [
    { id: 1, nome: 'Café em grão arábica 30kg', preco: 'R$ 890,00', un: 'saca', estoque: 40, modo: 'venda', empresa: 'Distribuidora Sul', cidade: 'São Paulo', km: 2.4, emoji: '☕', cor: ['#a16207', '#451a03'], pin: [38, 34], desc: 'Café torrado, safra 2026. Entrega em até 48h na Grande São Paulo.' },
    { id: 2, nome: 'Caixas de papelão 40x30x20', preco: 'R$ 2,10', un: 'un', estoque: 8000, modo: 'venda', empresa: 'EmbalaMais', cidade: 'Guarulhos', km: 5.1, emoji: '📦', cor: ['#0e7490', '#082f49'], pin: [66, 22], desc: 'Papelão de parede dupla. Lote mínimo de 500 unidades.' },
    { id: 3, nome: 'Farinha de trigo tipo 1 50kg', preco: 'R$ 210,00', un: 'saco', estoque: 300, modo: 'venda', empresa: 'Moinho Real', cidade: 'Campinas', km: 8.7, emoji: '🌾', cor: ['#7c3aed', '#2e1065'], pin: [24, 62], desc: 'Sacos para panificação industrial, validade de 6 meses.' },
    { id: 4, nome: 'Açúcar cristal 50kg', preco: 'R$ 165,00', un: 'fardo', estoque: 120, modo: 'venda', empresa: 'Distribuidora Sul', cidade: 'São Paulo', km: 2.9, emoji: '🍬', cor: ['#db2777', '#500724'], pin: [52, 56], desc: 'Fardo industrial de açúcar cristal. Nota fiscal e entrega inclusas.' },
    { id: 5, nome: 'Copos descartáveis 200ml', preco: 'R$ 0,09', un: 'un', estoque: 20000, modo: 'procura', empresa: 'Cafeteria Central', cidade: 'São Paulo', km: 3.3, emoji: '🥤', cor: ['#16A34A', '#052e16'], pin: [74, 66], desc: 'Procuramos fornecedor recorrente: 20 mil unidades por mês.' },
    { id: 6, nome: 'Pallets de madeira PBR', preco: 'R$ 35,00', un: 'un', estoque: 200, modo: 'procura', empresa: 'Logística Norte', cidade: 'Guarulhos', km: 6.0, emoji: '🪵', cor: ['#b45309', '#431407'], pin: [82, 40], desc: 'Precisamos de 200 pallets usados em bom estado.' },
    { id: 7, nome: 'Trigo em grão (tonelada)', preco: 'R$ 1.450,00', un: 't', estoque: 50, modo: 'procura', empresa: 'Panificadora Lar', cidade: 'Campinas', km: 9.2, emoji: '🌽', cor: ['#ca8a04', '#422006'], pin: [14, 30], desc: 'Compramos direto de produtores da região, pagamento em 15 dias.' },
  ];

  const TABS = [
    { id: 'home', label: 'Início', icon: '⌂' },
    { id: 'map', label: 'Mapa', icon: '◎' },
    { id: 'chat', label: 'Conversas', icon: '✉' },
    { id: 'orders', label: 'Pedidos', icon: '☰' },
    { id: 'me', label: 'Perfil', icon: '☻' },
  ];

  const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const thumb = (p, size = 56) => `<div class="px-thumb" style="width:${size}px;height:${size}px;background:linear-gradient(135deg,${p.cor[0]},${p.cor[1]});font-size:${size * 0.5}px">${p.emoji}</div>`;

  function mount(host) {
    const state = {
      modo: 'venda', tab: 0, query: '', selectedPin: null,
      orders: [
        { id: 1, produto: PRODUCTS[0], qtd: 5, status: 'pendente', quem: 'Mercado Bom Preço', recebido: true },
        { id: 2, produto: PRODUCTS[2], qtd: 20, status: 'aceito', quem: 'Você', recebido: false },
      ],
      chats: [
        { id: 1, produto: PRODUCTS[0], com: 'Distribuidora Sul', msgs: [['them', 'Olá! O café ainda está disponível?'], ['me', 'Sim, temos 40 sacas em estoque.']] },
        { id: 2, produto: PRODUCTS[1], com: 'EmbalaMais', msgs: [['them', 'Conseguem entregar 2.000 caixas?']] },
      ],
      openChat: null, openProduct: null,
    };
    let tourTimer = null, tourRunning = false, destroyed = false;

    host.innerHTML = `
      <div class="px" style="width:${W}px;height:${H}px">
        <div class="px-status"><span>9:41</span><span>●●● ▮</span></div>
        <div class="px-pages"></div>
        <div class="px-overlay" data-layer="product"></div>
        <div class="px-overlay" data-layer="chat"></div>
        <nav class="px-tabs">${TABS.map((t, i) => `<button data-tab="${i}"><b>${t.icon}</b><span>${t.label}</span></button>`).join('')}</nav>
        <div class="px-toast" role="status"></div>
      </div>`;
    const root = host.firstElementChild;
    const pages = root.querySelector('.px-pages');
    const q = sel => root.querySelector(sel);

    // Escala o protótipo para a largura disponível na moldura
    const fit = () => { root.style.transform = `scale(${host.clientWidth / W})`; };
    const ro = new ResizeObserver(fit); ro.observe(host); fit();

    function toast(msg) {
      const t = q('.px-toast'); t.textContent = msg; t.classList.add('on');
      clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 1800);
    }

    /* ---------- Telas ---------- */
    const filtered = () => PRODUCTS.filter(p => p.modo === state.modo && p.nome.toLowerCase().includes(state.query.toLowerCase()));

    function cardHtml(p) {
      return `<button class="px-card" data-product="${p.id}">${thumb(p)}
        <div class="px-card-body"><b>${esc(p.nome)}</b><small>${esc(p.empresa)} · ${esc(p.cidade)}</small>
        <div class="px-card-foot"><span class="px-price">${p.preco}<i>/${p.un}</i></span><span class="px-km">${String(p.km).replace('.', ',')} km</span></div></div></button>`;
    }

    function homeHtml() {
      const list = filtered();
      return `<header class="px-head"><div><small>Olá, Atacadão Horizonte</small><h1>ZIP4ZIP</h1></div><div class="px-avatar">AH</div></header>
        <div class="px-search"><span>⌕</span><input data-search placeholder="Buscar produtos, cidades…" value="${esc(state.query)}"></div>
        <div class="px-seg"><button class="${state.modo === 'venda' ? 'on' : ''}" data-modo="venda">Comprar</button><button class="${state.modo === 'procura' ? 'on' : ''}" data-modo="procura">Procurar</button></div>
        <div class="px-chips"><span class="on">Perto de mim</span><span>Menor preço</span><span>Recentes</span><span>Cidade</span></div>
        <div class="px-list" data-list>${list.length ? list.map(cardHtml).join('') : '<p class="px-empty">Nenhum anúncio encontrado.</p>'}</div>
        <button class="px-fab" data-new>+ Anunciar</button>`;
    }

    function mapHtml() {
      const sel = PRODUCTS.find(p => p.id === state.selectedPin);
      return `<div class="px-map">
        <div class="px-roads"></div>
        <div class="px-you" style="left:46%;top:46%"><i></i></div>
        ${PRODUCTS.map(p => `<button class="px-pin ${p.modo} ${sel?.id === p.id ? 'on' : ''}" style="left:${p.pin[0]}%;top:${p.pin[1]}%" data-pin="${p.id}">${p.emoji}</button>`).join('')}
        <div class="px-map-top"><div class="px-search"><span>⌕</span><input disabled placeholder="Raio de 10 km"></div></div>
        ${sel ? `<button class="px-sheet" data-product="${sel.id}">${thumb(sel, 52)}<div><b>${esc(sel.nome)}</b><small>${esc(sel.empresa)} · ${String(sel.km).replace('.', ',')} km</small><span class="px-price">${sel.preco}</span></div></button>` : '<div class="px-sheet hint">Toque num pino para ver o anúncio</div>'}
      </div>`;
    }

    function chatListHtml() {
      return `<header class="px-head"><h1>Conversas</h1></header><div class="px-list">
        ${state.chats.map(c => { const last = c.msgs[c.msgs.length - 1]; return `<button class="px-row" data-chat="${c.id}"><div class="px-avatar">${esc(c.com[0])}</div>
          <div class="px-row-body"><b>${esc(c.com)}</b><small>${esc(c.produto.nome)}</small><span>${esc(last[1])}</span></div>${last[0] === 'them' ? '<i class="px-dot"></i>' : ''}</button>`; }).join('')}
      </div>`;
    }

    function ordersHtml() {
      return `<header class="px-head"><h1>Pedidos</h1></header><div class="px-list">
        ${state.orders.map(o => `<div class="px-order">${thumb(o.produto, 48)}
          <div class="px-order-body"><b>${esc(o.produto.nome)}</b><small>${o.qtd} ${o.produto.un} · ${o.recebido ? 'de ' + esc(o.quem) : 'enviado por você'}</small>
          <span class="px-status ${o.status}">${{ pendente: 'Pendente', aceito: 'Aceito', recusado: 'Recusado' }[o.status]}</span></div>
          ${o.recebido && o.status === 'pendente' ? `<div class="px-order-actions"><button data-accept="${o.id}">Aceitar</button><button class="no" data-refuse="${o.id}">Recusar</button></div>` : ''}</div>`).join('')}
      </div>`;
    }

    function meHtml() {
      return `<header class="px-head"><h1>Perfil</h1></header>
        <div class="px-profile"><div class="px-avatar big">AH</div><b>Atacadão Horizonte</b><small>Ribeirão Preto · empresa demo</small></div>
        <div class="px-stats"><div><b>12</b><small>anúncios</small></div><div><b>34</b><small>pedidos</small></div><div><b>8</b><small>conversas</small></div></div>
        <div class="px-menu"><button data-toast="Painel administrativo: estatísticas e moderação">Painel Admin <i>›</i></button><button data-toast="Idioma: Português / English">Idioma <i>PT ›</i></button><button data-toast="Notificações push ativadas">Notificações <i>Ativas ›</i></button><button data-toast="Você saiu (é só uma demo 🙂)">Sair <i>›</i></button></div>`;
    }

    const RENDER = [homeHtml, mapHtml, chatListHtml, ordersHtml, meHtml];
    pages.innerHTML = RENDER.map((_, i) => `<section class="px-page" data-page="${i}"></section>`).join('');
    const pageEl = i => pages.children[i];
    const renderPage = i => {
      const el = pageEl(i), scroll = el.scrollTop;
      const focused = el.contains(document.activeElement) && document.activeElement.matches('[data-search]');
      el.innerHTML = RENDER[i]();
      el.scrollTop = scroll;
      if (focused) { const inp = el.querySelector('[data-search]'); inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
    };
    RENDER.forEach((_, i) => renderPage(i));

    /* ---------- Navegação entre páginas (rolagem horizontal com snap) ---------- */
    function go(i, smooth = true) {
      state.tab = i;
      pages.scrollTo({ left: i * W, behavior: smooth ? 'smooth' : 'auto' });
      syncTabs();
    }
    function syncTabs() {
      root.querySelectorAll('.px-tabs button').forEach((b, i) => b.classList.toggle('on', i === state.tab));
    }
    let scrollRaf;
    pages.addEventListener('scroll', () => {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => { const i = Math.round(pages.scrollLeft / W); if (i !== state.tab) { state.tab = i; syncTabs(); } });
    }, { passive: true });
    syncTabs();

    /* ---------- Overlays: detalhe do produto e chat ---------- */
    function showProduct(id) {
      const p = PRODUCTS.find(x => x.id === id); state.openProduct = p;
      const verb = p.modo === 'venda' ? ['Falar com o vendedor', 'Fazer pedido'] : ['Falar com o comprador', 'Oferecer produto'];
      const layer = q('[data-layer="product"]');
      layer.innerHTML = `<div class="px-detail">
        <div class="px-detail-hero" style="background:linear-gradient(135deg,${p.cor[0]},${p.cor[1]})"><button class="px-back" data-close="product">‹</button><span>${p.emoji}</span></div>
        <div class="px-detail-body">
          <span class="px-badge ${p.modo}">${p.modo === 'venda' ? 'À VENDA' : 'PROCURA-SE'}</span>
          <h2>${esc(p.nome)}</h2>
          <div class="px-price big">${p.preco}<i>/${p.un}</i></div>
          <div class="px-facts"><div><small>Estoque</small><b>${p.estoque.toLocaleString('pt-BR')} ${p.un}</b></div><div><small>Distância</small><b>${String(p.km).replace('.', ',')} km</b></div><div><small>Cidade</small><b>${esc(p.cidade)}</b></div></div>
          <p>${esc(p.desc)}</p>
          <div class="px-company">${'<div class="px-avatar">' + esc(p.empresa[0]) + '</div>'}<div><b>${esc(p.empresa)}</b><small>Empresa verificada</small></div></div>
        </div>
        <div class="px-detail-actions"><button class="ghost" data-talk="${p.id}">${verb[0]}</button><button data-order="${p.id}">${verb[1]}</button></div>
      </div>`;
      layer.classList.add('on');
    }
    const closeProduct = () => q('[data-layer="product"]').classList.remove('on');

    function showChat(id) {
      const c = state.chats.find(x => x.id === id); state.openChat = c;
      const layer = q('[data-layer="chat"]');
      layer.innerHTML = `<div class="px-chat">
        <header class="px-chat-head"><button class="px-back dark" data-close="chat">‹</button><div class="px-avatar">${esc(c.com[0])}</div><div><b>${esc(c.com)}</b><small>${esc(c.produto.nome)}</small></div></header>
        <div class="px-msgs" data-msgs></div>
        <form class="px-compose" data-compose><input placeholder="Escreva uma mensagem…" autocomplete="off"><button>➤</button></form></div>`;
      layer.classList.add('on'); paintMsgs();
    }
    function paintMsgs(typing) {
      const box = q('[data-msgs]'); if (!box || !state.openChat) return;
      box.innerHTML = state.openChat.msgs.map(([w, t]) => `<div class="px-msg ${w}">${esc(t)}</div>`).join('') + (typing ? '<div class="px-msg them typing"><i></i><i></i><i></i></div>' : '');
      box.scrollTop = box.scrollHeight;
    }
    const closeChat = () => { q('[data-layer="chat"]').classList.remove('on'); state.openChat = null; renderPage(2); };

    function sendMessage(text) {
      const c = state.openChat; if (!c || !text.trim()) return;
      c.msgs.push(['me', text.trim()]); paintMsgs(true);
      const replies = ['Perfeito! Posso fechar nesse valor.', 'Ótimo, já separo o lote pra você.', 'Entrego em até 48h. Pode fazer o pedido pelo app.'];
      setTimeout(() => { if (destroyed) return; c.msgs.push(['them', replies[c.msgs.length % replies.length]]); if (state.openChat === c) paintMsgs(); }, 1100);
    }

    function placeOrder(id) {
      const p = PRODUCTS.find(x => x.id === id);
      if (!state.orders.some(o => o.produto.id === id && !o.recebido)) state.orders.unshift({ id: Date.now(), produto: p, qtd: 1, status: 'pendente', quem: 'Você', recebido: false });
      renderPage(3); closeProduct(); toast(p.modo === 'venda' ? 'Pedido enviado! ✓' : 'Oferta enviada! ✓');
    }
    function talkTo(id) {
      const p = PRODUCTS.find(x => x.id === id);
      let c = state.chats.find(x => x.produto.id === id);
      if (!c) { c = { id: Date.now(), produto: p, com: p.empresa, msgs: [] }; state.chats.unshift(c); renderPage(2); }
      closeProduct(); showChat(c.id);
    }

    /* ---------- Eventos ---------- */
    root.addEventListener('click', e => {
      stopTour();
      const t = e.target.closest('button'); if (!t) return;
      const d = t.dataset;
      if (d.tab != null) { closeProduct(); closeChat(); go(+d.tab); }
      else if (d.modo) { state.modo = d.modo; renderPage(0); }
      else if (d.product) showProduct(+d.product);
      else if (d.pin) { state.selectedPin = +d.pin; renderPage(1); }
      else if (d.chat) showChat(+d.chat);
      else if (d.close === 'product') closeProduct();
      else if (d.close === 'chat') closeChat();
      else if (d.talk) talkTo(+d.talk);
      else if (d.order) placeOrder(+d.order);
      else if (d.accept || d.refuse) { const o = state.orders.find(x => x.id === +(d.accept || d.refuse)); o.status = d.accept ? 'aceito' : 'recusado'; renderPage(3); toast(d.accept ? 'Pedido aceito ✓' : 'Pedido recusado'); }
      else if (d.toast) toast(d.toast);
      else if ('new' in d) toast('Criar anúncio: foto, preço, estoque e localização automática');
    });
    root.addEventListener('input', e => { if (e.target.matches('[data-search]')) { state.query = e.target.value; const list = pageEl(0).querySelector('[data-list]'); const items = filtered(); list.innerHTML = items.length ? items.map(cardHtml).join('') : '<p class="px-empty">Nenhum anúncio encontrado.</p>'; } });
    root.addEventListener('submit', e => { if (e.target.matches('[data-compose]')) { e.preventDefault(); const i = e.target.querySelector('input'); sendMessage(i.value); i.value = ''; } });
    root.addEventListener('wheel', stopTour, { passive: true });
    root.addEventListener('touchstart', stopTour, { passive: true });

    /* ---------- Tour automático ---------- */
    const wait = ms => new Promise(r => { tourTimer = setTimeout(r, ms); });
    function stopTour() { if (!tourRunning) return; tourRunning = false; clearTimeout(tourTimer); host.dispatchEvent(new CustomEvent('tourend')); }
    async function tour() {
      stopTour(); closeProduct(); closeChat(); go(0, false); state.modo = 'venda'; renderPage(0);
      tourRunning = true; host.dispatchEvent(new CustomEvent('tourstart'));
      const steps = [
        () => go(0), 1400,
        () => pageEl(0).scrollTo({ top: 220, behavior: 'smooth' }), 1300,
        () => pageEl(0).scrollTo({ top: 0, behavior: 'smooth' }), 700,
        () => showProduct(1), 2200,
        () => closeProduct(), 500,
        () => { state.modo = 'procura'; renderPage(0); }, 1500,
        () => { state.modo = 'venda'; renderPage(0); go(1); }, 1300,
        () => { state.selectedPin = 2; renderPage(1); }, 1800,
        () => go(2), 1300,
        () => showChat(1), 900,
        () => sendMessage('Fechado! Vou fazer o pedido agora.'), 2600,
        () => closeChat(), 400,
        () => go(3), 1400,
        () => { const o = state.orders.find(x => x.recebido && x.status === 'pendente'); if (o) { o.status = 'aceito'; renderPage(3); toast('Pedido aceito ✓'); } }, 2000,
        () => go(4), 1800,
        () => go(0),
      ];
      for (let i = 0; i < steps.length && tourRunning && !destroyed; i += 2) { steps[i](); if (steps[i + 1]) await wait(steps[i + 1]); }
      stopTour();
    }

    return { tour, stop: stopTour, go, destroy() { destroyed = true; clearTimeout(tourTimer); ro.disconnect(); } };
  }

  return { mount };
})();
