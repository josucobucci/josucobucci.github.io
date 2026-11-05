// Protótipo interativo e fictício do ZIP4ZIP, desenhado em HTML/CSS/JS puro.
// Não usa banco nem rede: tudo roda no navegador, com dados de exemplo.
// Idioma: segue SITE_LANG (i18n.js); textos e dados de exemplo ficam em I18N abaixo.
// Uso: ZipPrototype.mount(elementoDentroDoCelular) → devolve { tour, stop, destroy }

const ZipPrototype = (() => {
  const W = 360, H = 780; // tamanho lógico da tela; é escalado para caber na moldura

  // Campos que não mudam com o idioma
  const BASE = [
    { id: 1, preco: 890, estoque: 40, modo: 'venda', empresa: 'Distribuidora Sul', cidade: 'São Paulo', km: 2.4, emoji: '☕', cor: ['#a16207', '#451a03'], pin: [38, 34] },
    { id: 2, preco: 2.1, estoque: 8000, modo: 'venda', empresa: 'EmbalaMais', cidade: 'Guarulhos', km: 5.1, emoji: '📦', cor: ['#0e7490', '#082f49'], pin: [66, 22] },
    { id: 3, preco: 210, estoque: 300, modo: 'venda', empresa: 'Moinho Real', cidade: 'Campinas', km: 8.7, emoji: '🌾', cor: ['#7c3aed', '#2e1065'], pin: [24, 62] },
    { id: 4, preco: 165, estoque: 120, modo: 'venda', empresa: 'Distribuidora Sul', cidade: 'São Paulo', km: 2.9, emoji: '🍬', cor: ['#db2777', '#500724'], pin: [52, 56] },
    { id: 5, preco: 0.09, estoque: 20000, modo: 'procura', empresa: 'Cafeteria Central', cidade: 'São Paulo', km: 3.3, emoji: '🥤', cor: ['#16A34A', '#052e16'], pin: [74, 66] },
    { id: 6, preco: 35, estoque: 200, modo: 'procura', empresa: 'Logística Norte', cidade: 'Guarulhos', km: 6.0, emoji: '🪵', cor: ['#b45309', '#431407'], pin: [82, 40] },
    { id: 7, preco: 1450, estoque: 50, modo: 'procura', empresa: 'Panificadora Lar', cidade: 'Campinas', km: 9.2, emoji: '🌽', cor: ['#ca8a04', '#422006'], pin: [14, 30] },
  ];

  const I18N = {
    pt: {
      locale: 'pt-BR', dec: ',', thou: '.',
      products: [
        ['Café em grão arábica 30kg', 'saca', 'Café torrado, safra 2026. Entrega em até 48h na Grande São Paulo.'],
        ['Caixas de papelão 40x30x20', 'un', 'Papelão de parede dupla. Lote mínimo de 500 unidades.'],
        ['Farinha de trigo tipo 1 50kg', 'saco', 'Sacos para panificação industrial, validade de 6 meses.'],
        ['Açúcar cristal 50kg', 'fardo', 'Fardo industrial de açúcar cristal. Nota fiscal e entrega inclusas.'],
        ['Copos descartáveis 200ml', 'un', 'Procuramos fornecedor recorrente: 20 mil unidades por mês.'],
        ['Pallets de madeira PBR', 'un', 'Precisamos de 200 pallets usados em bom estado.'],
        ['Trigo em grão (tonelada)', 't', 'Compramos direto de produtores da região, pagamento em 15 dias.'],
      ],
      tabs: ['Início', 'Mapa', 'Conversas', 'Pedidos', 'Perfil'],
      hello: 'Olá, Atacadão Horizonte', search: 'Buscar produtos, cidades…', buy: 'Comprar', seek: 'Procurar',
      chips: ['Perto de mim', 'Menor preço', 'Recentes', 'Cidade'], empty: 'Nenhum anúncio encontrado.', fab: '+ Anunciar',
      radius: 'Raio de 10 km', tapPin: 'Toque num pino para ver o anúncio',
      chats: 'Conversas', orders: 'Pedidos', profile: 'Perfil', from: 'de {who}', sentByYou: 'enviado por você', you: 'Você',
      status: { pendente: 'Pendente', aceito: 'Aceito', recusado: 'Recusado' }, accept: 'Aceitar', refuse: 'Recusar',
      company: 'Atacadão Horizonte', companySub: 'Ribeirão Preto · empresa demo', stats: ['anúncios', 'pedidos', 'conversas'],
      menu: [['Painel Admin', '', 'Painel administrativo: estatísticas e moderação'], ['Idioma', 'PT', 'O app tem interface em português e inglês'], ['Notificações', 'Ativas', 'Notificações push ativadas'], ['Sair', '', 'Você saiu (é só uma demo 🙂)']],
      talkSeller: 'Falar com o vendedor', order: 'Fazer pedido', talkBuyer: 'Falar com o comprador', offer: 'Oferecer produto',
      forSale: 'À VENDA', wanted: 'PROCURA-SE', stock: 'Estoque', distance: 'Distância', city: 'Cidade', verified: 'Empresa verificada',
      write: 'Escreva uma mensagem…',
      replies: ['Perfeito! Posso fechar nesse valor.', 'Ótimo, já separo o lote pra você.', 'Entrego em até 48h. Pode fazer o pedido pelo app.'],
      orderSent: 'Pedido enviado! ✓', offerSent: 'Oferta enviada! ✓', accepted: 'Pedido aceito ✓', refused: 'Pedido recusado',
      newAd: 'Criar anúncio: foto, preço, estoque e localização automática',
      buyer: 'Mercado Bom Preço',
      seedChats: [['Olá! O café ainda está disponível?', 'Sim, temos 40 sacas em estoque.'], ['Conseguem entregar 2.000 caixas?']],
      tourMsg: 'Fechado! Vou fazer o pedido agora.',
    },
    en: {
      locale: 'en-US', dec: '.', thou: ',',
      products: [
        ['Arabica coffee beans 30kg', 'bag', 'Roasted coffee, 2026 harvest. Delivery within 48h in Greater São Paulo.'],
        ['Cardboard boxes 40x30x20', 'unit', 'Double-wall cardboard. Minimum lot of 500 units.'],
        ['Wheat flour type 1 50kg', 'sack', 'Sacks for industrial baking, 6-month shelf life.'],
        ['Granulated sugar 50kg', 'bale', 'Industrial bale of granulated sugar. Invoice and delivery included.'],
        ['Disposable cups 200ml', 'unit', 'Looking for a recurring supplier: 20,000 units per month.'],
        ['PBR wooden pallets', 'unit', 'We need 200 used pallets in good condition.'],
        ['Wheat grain (ton)', 't', 'We buy straight from local growers, payment in 15 days.'],
      ],
      tabs: ['Home', 'Map', 'Chats', 'Orders', 'Profile'],
      hello: 'Hi, Atacadão Horizonte', search: 'Search products, cities…', buy: 'Buy', seek: 'Seek',
      chips: ['Near me', 'Lowest price', 'Recent', 'City'], empty: 'No listings found.', fab: '+ Post listing',
      radius: '10 km radius', tapPin: 'Tap a pin to see the listing',
      chats: 'Chats', orders: 'Orders', profile: 'Profile', from: 'from {who}', sentByYou: 'sent by you', you: 'You',
      status: { pendente: 'Pending', aceito: 'Accepted', recusado: 'Declined' }, accept: 'Accept', refuse: 'Decline',
      company: 'Atacadão Horizonte', companySub: 'Ribeirão Preto · demo company', stats: ['listings', 'orders', 'chats'],
      menu: [['Admin panel', '', 'Admin panel: stats and moderation'], ['Language', 'EN', 'The app interface is in Portuguese and English'], ['Notifications', 'On', 'Push notifications enabled'], ['Sign out', '', 'You signed out (it\'s just a demo 🙂)']],
      talkSeller: 'Message the seller', order: 'Place order', talkBuyer: 'Message the buyer', offer: 'Offer product',
      forSale: 'FOR SALE', wanted: 'WANTED', stock: 'Stock', distance: 'Distance', city: 'City', verified: 'Verified company',
      write: 'Write a message…',
      replies: ['Perfect! I can close at that price.', 'Great, I\'ll set the lot aside for you.', 'I deliver within 48h. You can place the order in the app.'],
      orderSent: 'Order sent! ✓', offerSent: 'Offer sent! ✓', accepted: 'Order accepted ✓', refused: 'Order declined',
      newAd: 'New listing: photo, price, stock and automatic location',
      buyer: 'Mercado Bom Preço',
      seedChats: [['Hi! Is the coffee still available?', 'Yes, we have 40 bags in stock.'], ['Can you deliver 2,000 boxes?']],
      tourMsg: 'Deal! I\'ll place the order now.',
    },
    es: {
      locale: 'es-ES', dec: ',', thou: '.',
      products: [
        ['Café en grano arábica 30kg', 'saco', 'Café tostado, cosecha 2026. Entrega en hasta 48h en el Gran São Paulo.'],
        ['Cajas de cartón 40x30x20', 'ud.', 'Cartón de doble pared. Lote mínimo de 500 unidades.'],
        ['Harina de trigo tipo 1 50kg', 'saco', 'Sacos para panificación industrial, vida útil de 6 meses.'],
        ['Azúcar cristal 50kg', 'fardo', 'Fardo industrial de azúcar cristal. Factura y entrega incluidas.'],
        ['Vasos desechables 200ml', 'ud.', 'Buscamos proveedor recurrente: 20 mil unidades al mes.'],
        ['Pallets de madera PBR', 'ud.', 'Necesitamos 200 pallets usados en buen estado.'],
        ['Trigo en grano (tonelada)', 't', 'Compramos directo a productores de la región, pago a 15 días.'],
      ],
      tabs: ['Inicio', 'Mapa', 'Chats', 'Pedidos', 'Perfil'],
      hello: 'Hola, Atacadão Horizonte', search: 'Buscar productos, ciudades…', buy: 'Comprar', seek: 'Buscar',
      chips: ['Cerca de mí', 'Menor precio', 'Recientes', 'Ciudad'], empty: 'No se encontraron anuncios.', fab: '+ Publicar',
      radius: 'Radio de 10 km', tapPin: 'Toca un pin para ver el anuncio',
      chats: 'Chats', orders: 'Pedidos', profile: 'Perfil', from: 'de {who}', sentByYou: 'enviado por ti', you: 'Tú',
      status: { pendente: 'Pendiente', aceito: 'Aceptado', recusado: 'Rechazado' }, accept: 'Aceptar', refuse: 'Rechazar',
      company: 'Atacadão Horizonte', companySub: 'Ribeirão Preto · empresa demo', stats: ['anuncios', 'pedidos', 'chats'],
      menu: [['Panel admin', '', 'Panel administrativo: estadísticas y moderación'], ['Idioma', 'ES', 'La app tiene interfaz en portugués e inglés'], ['Notificaciones', 'Activas', 'Notificaciones push activadas'], ['Salir', '', 'Cerraste sesión (es solo una demo 🙂)']],
      talkSeller: 'Hablar con el vendedor', order: 'Hacer pedido', talkBuyer: 'Hablar con el comprador', offer: 'Ofrecer producto',
      forSale: 'EN VENTA', wanted: 'SE BUSCA', stock: 'Stock', distance: 'Distancia', city: 'Ciudad', verified: 'Empresa verificada',
      write: 'Escribe un mensaje…',
      replies: ['¡Perfecto! Puedo cerrar a ese precio.', 'Genial, te separo el lote.', 'Entrego en hasta 48h. Puedes hacer el pedido en la app.'],
      orderSent: '¡Pedido enviado! ✓', offerSent: '¡Oferta enviada! ✓', accepted: 'Pedido aceptado ✓', refused: 'Pedido rechazado',
      newAd: 'Nuevo anuncio: foto, precio, stock y ubicación automática',
      buyer: 'Mercado Bom Preço',
      seedChats: [['¡Hola! ¿El café sigue disponible?', 'Sí, tenemos 40 sacos en stock.'], ['¿Pueden entregar 2.000 cajas?']],
      tourMsg: '¡Trato hecho! Hago el pedido ahora.',
    },
  };

  const TAB_ICONS = ['⌂', '◎', '✉', '☰', '☻'];
  const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const thumb = (p, size = 56) => `<div class="px-thumb" style="width:${size}px;height:${size}px;background:linear-gradient(135deg,${p.cor[0]},${p.cor[1]});font-size:${size * 0.5}px">${p.emoji}</div>`;
  const pickLang = () => (typeof SITE_LANG !== 'undefined' && I18N[SITE_LANG]) ? SITE_LANG : 'pt';

  function mount(host) {
    const T = I18N[pickLang()];
    const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k]);
    // Preço em reais no formato do idioma (R$ 1.450,00 / R$ 1,450.00)
    const money = v => { const [i, d] = v.toFixed(2).split('.'); return `R$ ${i.replace(/\B(?=(\d{3})+(?!\d))/g, T.thou)}${T.dec}${d}`; };
    const km = v => String(v).replace('.', T.dec) + ' km';
    const PRODUCTS = BASE.map((b, i) => ({ ...b, nome: T.products[i][0], un: T.products[i][1], desc: T.products[i][2], preco: money(b.preco) }));

    const state = {
      modo: 'venda', tab: 0, query: '', selectedPin: null,
      orders: [
        { id: 1, produto: PRODUCTS[0], qtd: 5, status: 'pendente', quem: T.buyer, recebido: true },
        { id: 2, produto: PRODUCTS[2], qtd: 20, status: 'aceito', quem: T.you, recebido: false },
      ],
      chats: [
        { id: 1, produto: PRODUCTS[0], com: 'Distribuidora Sul', msgs: [['them', T.seedChats[0][0]], ['me', T.seedChats[0][1]]] },
        { id: 2, produto: PRODUCTS[1], com: 'EmbalaMais', msgs: [['them', T.seedChats[1][0]]] },
      ],
      openChat: null, openProduct: null,
    };
    let tourTimer = null, tourRunning = false, destroyed = false;

    host.innerHTML = `
      <div class="px" style="width:${W}px;height:${H}px">
        <div class="px-sysbar"><span>9:41</span><span>●●● ▮</span></div>
        <div class="px-pages"></div>
        <div class="px-overlay" data-layer="product"></div>
        <div class="px-overlay" data-layer="chat"></div>
        <nav class="px-tabs">${T.tabs.map((label, i) => `<button data-tab="${i}"><b>${TAB_ICONS[i]}</b><span>${esc(label)}</span></button>`).join('')}</nav>
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
    const emptyHtml = () => `<p class="px-empty">${esc(T.empty)}</p>`;

    function cardHtml(p) {
      return `<button class="px-card" data-product="${p.id}">${thumb(p)}
        <div class="px-card-body"><b>${esc(p.nome)}</b><small>${esc(p.empresa)} · ${esc(p.cidade)}</small>
        <div class="px-card-foot"><span class="px-price">${p.preco}<i>/${esc(p.un)}</i></span><span class="px-km">${km(p.km)}</span></div></div></button>`;
    }

    function homeHtml() {
      const list = filtered();
      return `<header class="px-head"><div><small>${esc(T.hello)}</small><h1>ZIP4ZIP</h1></div><div class="px-avatar">AH</div></header>
        <div class="px-search"><span>⌕</span><input data-search placeholder="${esc(T.search)}" value="${esc(state.query)}"></div>
        <div class="px-seg"><button class="${state.modo === 'venda' ? 'on' : ''}" data-modo="venda">${esc(T.buy)}</button><button class="${state.modo === 'procura' ? 'on' : ''}" data-modo="procura">${esc(T.seek)}</button></div>
        <div class="px-chips">${T.chips.map((c, i) => `<span class="${i ? '' : 'on'}">${esc(c)}</span>`).join('')}</div>
        <div class="px-list" data-list>${list.length ? list.map(cardHtml).join('') : emptyHtml()}</div>
        <button class="px-fab" data-new>${esc(T.fab)}</button>`;
    }

    function mapHtml() {
      const sel = PRODUCTS.find(p => p.id === state.selectedPin);
      return `<div class="px-map">
        <div class="px-roads"></div>
        <div class="px-you" style="left:46%;top:46%"><i></i></div>
        ${PRODUCTS.map(p => `<button class="px-pin ${p.modo} ${sel?.id === p.id ? 'on' : ''}" style="left:${p.pin[0]}%;top:${p.pin[1]}%" data-pin="${p.id}">${p.emoji}</button>`).join('')}
        <div class="px-map-top"><div class="px-search"><span>⌕</span><input disabled placeholder="${esc(T.radius)}"></div></div>
        ${sel ? `<button class="px-sheet" data-product="${sel.id}">${thumb(sel, 52)}<div><b>${esc(sel.nome)}</b><small>${esc(sel.empresa)} · ${km(sel.km)}</small><span class="px-price">${sel.preco}</span></div></button>` : `<div class="px-sheet hint">${esc(T.tapPin)}</div>`}
      </div>`;
    }

    function chatListHtml() {
      return `<header class="px-head"><h1>${esc(T.chats)}</h1></header><div class="px-list">
        ${state.chats.map(c => { const last = c.msgs[c.msgs.length - 1]; return `<button class="px-row" data-chat="${c.id}"><div class="px-avatar">${esc(c.com[0])}</div>
          <div class="px-row-body"><b>${esc(c.com)}</b><small>${esc(c.produto.nome)}</small><span>${esc(last ? last[1] : '')}</span></div>${last && last[0] === 'them' ? '<i class="px-dot"></i>' : ''}</button>`; }).join('')}
      </div>`;
    }

    function ordersHtml() {
      return `<header class="px-head"><h1>${esc(T.orders)}</h1></header><div class="px-list">
        ${state.orders.map(o => `<div class="px-order">${thumb(o.produto, 48)}
          <div class="px-order-body"><b>${esc(o.produto.nome)}</b><small>${o.qtd} ${esc(o.produto.un)} · ${o.recebido ? esc(fill(T.from, { who: o.quem })) : esc(T.sentByYou)}</small>
          <span class="px-status ${o.status}">${esc(T.status[o.status])}</span></div>
          ${o.recebido && o.status === 'pendente' ? `<div class="px-order-actions"><button data-accept="${o.id}">${esc(T.accept)}</button><button class="no" data-refuse="${o.id}">${esc(T.refuse)}</button></div>` : ''}</div>`).join('')}
      </div>`;
    }

    function meHtml() {
      return `<header class="px-head"><h1>${esc(T.profile)}</h1></header>
        <div class="px-profile"><div class="px-avatar big">AH</div><b>${esc(T.company)}</b><small>${esc(T.companySub)}</small></div>
        <div class="px-stats">${[12, 34, 8].map((n, i) => `<div><b>${n}</b><small>${esc(T.stats[i])}</small></div>`).join('')}</div>
        <div class="px-menu">${T.menu.map(([label, val, msg]) => `<button data-toast="${esc(msg)}">${esc(label)} <i>${val ? esc(val) + ' ' : ''}›</i></button>`).join('')}</div>`;
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
      const verb = p.modo === 'venda' ? [T.talkSeller, T.order] : [T.talkBuyer, T.offer];
      const layer = q('[data-layer="product"]');
      layer.innerHTML = `<div class="px-detail">
        <div class="px-detail-hero" style="background:linear-gradient(135deg,${p.cor[0]},${p.cor[1]})"><button class="px-back" data-close="product">‹</button><span>${p.emoji}</span></div>
        <div class="px-detail-body">
          <span class="px-badge ${p.modo}">${esc(p.modo === 'venda' ? T.forSale : T.wanted)}</span>
          <h2>${esc(p.nome)}</h2>
          <div class="px-price big">${p.preco}<i>/${esc(p.un)}</i></div>
          <div class="px-facts"><div><small>${esc(T.stock)}</small><b>${p.estoque.toLocaleString(T.locale)} ${esc(p.un)}</b></div><div><small>${esc(T.distance)}</small><b>${km(p.km)}</b></div><div><small>${esc(T.city)}</small><b>${esc(p.cidade)}</b></div></div>
          <p>${esc(p.desc)}</p>
          <div class="px-company"><div class="px-avatar">${esc(p.empresa[0])}</div><div><b>${esc(p.empresa)}</b><small>${esc(T.verified)}</small></div></div>
        </div>
        <div class="px-detail-actions"><button class="ghost" data-talk="${p.id}">${esc(verb[0])}</button><button data-order="${p.id}">${esc(verb[1])}</button></div>
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
        <form class="px-compose" data-compose><input placeholder="${esc(T.write)}" autocomplete="off"><button>➤</button></form></div>`;
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
      setTimeout(() => { if (destroyed) return; c.msgs.push(['them', T.replies[c.msgs.length % T.replies.length]]); if (state.openChat === c) paintMsgs(); }, 1100);
    }

    function placeOrder(id) {
      const p = PRODUCTS.find(x => x.id === id);
      if (!state.orders.some(o => o.produto.id === id && !o.recebido)) state.orders.unshift({ id: Date.now(), produto: p, qtd: 1, status: 'pendente', quem: T.you, recebido: false });
      renderPage(3); closeProduct(); toast(p.modo === 'venda' ? T.orderSent : T.offerSent);
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
      else if (d.accept || d.refuse) { const o = state.orders.find(x => x.id === +(d.accept || d.refuse)); o.status = d.accept ? 'aceito' : 'recusado'; renderPage(3); toast(d.accept ? T.accepted : T.refused); }
      else if (d.toast) toast(d.toast);
      else if ('new' in d) toast(T.newAd);
    });
    root.addEventListener('input', e => { if (e.target.matches('[data-search]')) { state.query = e.target.value; const list = pageEl(0).querySelector('[data-list]'); const items = filtered(); list.innerHTML = items.length ? items.map(cardHtml).join('') : emptyHtml(); } });
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
        () => sendMessage(T.tourMsg), 2600,
        () => closeChat(), 400,
        () => go(3), 1400,
        () => { const o = state.orders.find(x => x.recebido && x.status === 'pendente'); if (o) { o.status = 'aceito'; renderPage(3); toast(T.accepted); } }, 2000,
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
