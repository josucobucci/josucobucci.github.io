// Protótipo fictício do Clubix: painel do atendente em versão mobile.
// Dados de exemplo; nada aqui conversa com servidor.
// Idioma: segue SITE_LANG (i18n.js); textos e dados de exemplo ficam em I18N abaixo.

const ClubixPrototype = (() => {
  const LIMIT = 5;
  const ICON = { start: '▶', msg: '✉', menu: '☰', cond: '◇', ia: '✦', fila: '⇥', fim: '■' };
  const ROLE_KEYS = ['att', 'ed', 'adm'];

  const I18N = {
    pt: {
      tabs: ['Fila', 'Conversas', 'Fluxos', 'Ramais', 'Admin'], appSub: 'CENTRAL DE ATENDIMENTO', theme: 'Alternar tema',
      you: 'Você', convs: '{n}/{max} conversas', distribute: '⚡ Distribuir automaticamente', waiting: 'Aguardando ({n})',
      queueKicker: 'Central de atendimento', queueTitle: 'Fila', member: 'Associado logado', visitor: 'Visitante', viaHal: 'via HAL',
      take: 'Assumir', emptyQueue: 'Fila vazia 🎉', chatsTitle: 'Conversas', active: '{n} ativas', noMsgs: 'Sem mensagens',
      noChats: 'Nenhuma conversa ativa. Assuma alguém da fila.', flowKicker: 'Editor visual', flowsTitle: 'Fluxos', testFlow: '▶ Testar fluxo',
      phoneKicker: 'Telefonia VoIP SIP', extTitle: 'Ramais', extSearch: 'Buscar setor ou ramal…', ext: 'ramal {n}', call: 'Ligar', noContacts: 'Nenhum contato.',
      adminKicker: 'Controle de acesso', team: 'Equipe e níveis', teamHint: 'Toque para alternar o nível de acesso.',
      roles: { att: 'Atendente', ed: 'Editor', adm: 'Administrador' },
      archTitle: 'Arquivamento de conversas', archHint: 'Compressor em Rust com verificação de integridade antes de apagar.',
      archConvs: 'conversas', archAfter: 'após compressão', archNum: '1.284', compressing: 'Comprimindo…', verifying: 'Verificando integridade…',
      archDone: '✓ Integridade verificada (hash conferido). Originais apagados com segurança.', archLast: 'Último arquivamento: hoje, 03:00 ✓',
      running: 'Executando…', runArch: 'Rodar arquivamento', illustrative: 'Dados ilustrativos.',
      transfer: '⇄ Transferir', attach: 'Anexar imagem', composer: 'Mensagem ou /atalho…',
      calling: 'Chamando ramal {n}…', inCall: 'Em ligação · {t}', mute: 'Mudo', hangup: 'Encerrar',
      callEnded: 'Chamada encerrada · {t}', callCanceled: 'Chamada cancelada', limitYou: 'Você já está com {max} conversas (limite)',
      took: 'Você assumiu {name}', distributed: '{n} distribuídas por menor carga', noSlot: ' · {n} sem vaga', allFull: 'Todos no limite de conversas',
      flowDone: 'Fluxo concluído ✓', archToast: 'Arquivamento concluído ✓', imgSent: '📷 imagem enviada', imgToast: 'Imagem enviada',
      transferTo: 'Transferir para', atLimit: '{name} está no limite', transferred: 'Transferida para {name}', close: 'Fechar',
      micOff: 'Microfone desligado', micOn: 'Microfone ligado', roleNow: '{name} agora é {role}',
      replies: ['Entendi, muito obrigado!', 'Perfeito, aguardo então.', 'Ótimo, pode ser assim.'],
      quick: [['/ola', 'Olá! Sou a Marina, do atendimento do Clube. Como posso ajudar?'], ['/horario', 'A secretaria atende de segunda a sexta, das 8h às 18h.'], ['/obrigado', 'Obrigada pelo contato! Posso ajudar em mais alguma coisa?']],
      flows: [
        ['Boas-vindas', [['start', 'Início', 'Cliente abre o chat no portal'], ['msg', 'Mensagem', '"Olá! Sou o HAL, assistente do Clube. Como posso ajudar?"'], ['ia', 'HAL (IA)', 'Responde dúvidas sobre atividades, avisos e estatuto'], ['cond', 'Condição', 'Resolveu a dúvida? Se não, oferece um atendente'], ['fila', 'Fila de atendimento', 'Prioridade alta se for associado logado'], ['fim', 'Fim', 'Pesquisa de satisfação']]],
        ['Fora do expediente', [['start', 'Início', 'Chat aberto fora do horário'], ['cond', 'Condição', 'Horário comercial? (editável no painel)'], ['msg', 'Mensagem', '"Nosso atendimento humano volta amanhã às 8h."'], ['ia', 'HAL (IA)', 'Segue respondendo sozinho'], ['fim', 'Fim', 'Registra o contato para retorno']]],
        ['Segunda via', [['start', 'Início', 'Cliente escolhe "Financeiro"'], ['menu', 'Menu', '1 Boleto · 2 Mensalidade · 3 Falar com atendente'], ['msg', 'Mensagem', 'Envia o link seguro da segunda via'], ['fila', 'Fila de atendimento', 'Só se o cliente escolher a opção 3'], ['fim', 'Fim', 'Encerra e arquiva']]],
      ],
      contacts: [['Secretaria', 'Atendimento'], ['Financeiro', 'Cobrança'], ['Esportes', 'Coordenação'], ['Portaria', 'Segurança'], ['Eventos', 'Reservas'], ['TI', 'Suporte'], ['Diretoria', 'Gabinete']],
      queue: [
        ['Helena Prado', 'Segunda via da carteirinha', 'Preciso da segunda via da minha carteirinha, perdi na semana passada.', 'HAL não encontrou a regra de reemissão e transferiu.'],
        ['Visitante 4821', 'Horário da piscina', 'A piscina abre aos domingos?', 'HAL pediu confirmação de horário especial.'],
        ['Roberto Lima', 'Reserva de quadra', 'Quero reservar a quadra 2 para sábado à tarde.', 'Reserva exige atendente.'],
        ['Visitante 4825', 'Como me associar?', 'Quais documentos preciso para me associar?', 'Cliente pediu falar com humano.'],
      ],
      chats: [['Marcos Dias', 'Cancelamento de plano', ['Boa tarde, quero cancelar meu plano familiar.', 'Claro, Marcos. Vou verificar seu cadastro.']], ['Visitante 4790', 'Aulas de natação', ['Tem vaga para natação infantil?']]],
    },
    en: {
      tabs: ['Queue', 'Chats', 'Flows', 'Extensions', 'Admin'], appSub: 'CUSTOMER SERVICE HUB', theme: 'Toggle theme',
      you: 'You', convs: '{n}/{max} chats', distribute: '⚡ Distribute automatically', waiting: 'Waiting ({n})',
      queueKicker: 'Customer service hub', queueTitle: 'Queue', member: 'Logged-in member', visitor: 'Visitor', viaHal: 'via HAL',
      take: 'Take', emptyQueue: 'Queue is empty 🎉', chatsTitle: 'Chats', active: '{n} active', noMsgs: 'No messages',
      noChats: 'No active chats. Take someone from the queue.', flowKicker: 'Visual editor', flowsTitle: 'Flows', testFlow: '▶ Test flow',
      phoneKicker: 'VoIP SIP telephony', extTitle: 'Extensions', extSearch: 'Search department or extension…', ext: 'ext. {n}', call: 'Call', noContacts: 'No contacts.',
      adminKicker: 'Access control', team: 'Team and levels', teamHint: 'Tap to switch the access level.',
      roles: { att: 'Agent', ed: 'Editor', adm: 'Administrator' },
      archTitle: 'Conversation archiving', archHint: 'Rust compressor with an integrity check before deleting.',
      archConvs: 'conversations', archAfter: 'after compression', archNum: '1,284', compressing: 'Compressing…', verifying: 'Checking integrity…',
      archDone: '✓ Integrity verified (hash checked). Originals safely deleted.', archLast: 'Last archive run: today, 03:00 ✓',
      running: 'Running…', runArch: 'Run archiving', illustrative: 'Illustrative data.',
      transfer: '⇄ Transfer', attach: 'Attach image', composer: 'Message or /shortcut…',
      calling: 'Calling ext. {n}…', inCall: 'On call · {t}', mute: 'Mute', hangup: 'End',
      callEnded: 'Call ended · {t}', callCanceled: 'Call canceled', limitYou: 'You already have {max} chats (limit)',
      took: 'You took {name}', distributed: '{n} assigned by lowest load', noSlot: ' · {n} without a slot', allFull: 'Everyone is at the chat limit',
      flowDone: 'Flow completed ✓', archToast: 'Archiving completed ✓', imgSent: '📷 image sent', imgToast: 'Image sent',
      transferTo: 'Transfer to', atLimit: '{name} is at the limit', transferred: 'Transferred to {name}', close: 'Close',
      micOff: 'Microphone off', micOn: 'Microphone on', roleNow: '{name} is now {role}',
      replies: ['Got it, thank you so much!', 'Perfect, I\'ll wait then.', 'Great, that works.'],
      quick: [['/hello', 'Hi! I\'m Marina from the Club\'s customer service. How can I help?'], ['/hours', 'The front office is open Monday to Friday, 8am to 6pm.'], ['/thanks', 'Thanks for reaching out! Anything else I can help with?']],
      flows: [
        ['Welcome', [['start', 'Start', 'Customer opens the chat on the portal'], ['msg', 'Message', '"Hi! I\'m HAL, the Club\'s assistant. How can I help?"'], ['ia', 'HAL (AI)', 'Answers questions about activities, notices and bylaws'], ['cond', 'Condition', 'Question solved? If not, offers an agent'], ['fila', 'Service queue', 'High priority for logged-in members'], ['fim', 'End', 'Satisfaction survey']]],
        ['After hours', [['start', 'Start', 'Chat opened after hours'], ['cond', 'Condition', 'Business hours? (editable in the panel)'], ['msg', 'Message', '"Our human team is back tomorrow at 8am."'], ['ia', 'HAL (AI)', 'Keeps answering on its own'], ['fim', 'End', 'Logs the contact for a callback']]],
        ['Duplicate bill', [['start', 'Start', 'Customer picks "Billing"'], ['menu', 'Menu', '1 Bill · 2 Monthly fee · 3 Talk to an agent'], ['msg', 'Message', 'Sends the secure link to the duplicate bill'], ['fila', 'Service queue', 'Only if the customer picks option 3'], ['fim', 'End', 'Closes and archives']]],
      ],
      contacts: [['Front office', 'Customer service'], ['Billing', 'Collections'], ['Sports', 'Coordination'], ['Gatehouse', 'Security'], ['Events', 'Bookings'], ['IT', 'Support'], ['Board', 'Office']],
      queue: [
        ['Helena Prado', 'Replacement membership card', 'I need a replacement membership card, I lost mine last week.', 'HAL didn\'t find the reissue rule and handed over.'],
        ['Visitor 4821', 'Pool hours', 'Is the pool open on Sundays?', 'HAL asked to confirm special hours.'],
        ['Roberto Lima', 'Court booking', 'I\'d like to book court 2 for Saturday afternoon.', 'Bookings require an agent.'],
        ['Visitor 4825', 'How do I join?', 'What documents do I need to become a member?', 'Customer asked for a human.'],
      ],
      chats: [['Marcos Dias', 'Plan cancellation', ['Good afternoon, I\'d like to cancel my family plan.', 'Sure, Marcos. Let me check your record.']], ['Visitor 4790', 'Swimming lessons', ['Are there openings for kids\' swimming?']]],
    },
    es: {
      tabs: ['Cola', 'Chats', 'Flujos', 'Extensiones', 'Admin'], appSub: 'CENTRAL DE ATENCIÓN', theme: 'Cambiar tema',
      you: 'Tú', convs: '{n}/{max} chats', distribute: '⚡ Distribuir automáticamente', waiting: 'En espera ({n})',
      queueKicker: 'Central de atención', queueTitle: 'Cola', member: 'Socio con sesión', visitor: 'Visitante', viaHal: 'vía HAL',
      take: 'Atender', emptyQueue: 'Cola vacía 🎉', chatsTitle: 'Chats', active: '{n} activos', noMsgs: 'Sin mensajes',
      noChats: 'No hay chats activos. Atiende a alguien de la cola.', flowKicker: 'Editor visual', flowsTitle: 'Flujos', testFlow: '▶ Probar flujo',
      phoneKicker: 'Telefonía VoIP SIP', extTitle: 'Extensiones', extSearch: 'Buscar sector o extensión…', ext: 'ext. {n}', call: 'Llamar', noContacts: 'Ningún contacto.',
      adminKicker: 'Control de acceso', team: 'Equipo y niveles', teamHint: 'Toca para cambiar el nivel de acceso.',
      roles: { att: 'Agente', ed: 'Editor', adm: 'Administrador' },
      archTitle: 'Archivado de conversaciones', archHint: 'Compresor en Rust con verificación de integridad antes de borrar.',
      archConvs: 'conversaciones', archAfter: 'tras la compresión', archNum: '1.284', compressing: 'Comprimiendo…', verifying: 'Verificando integridad…',
      archDone: '✓ Integridad verificada (hash comprobado). Originales borrados con seguridad.', archLast: 'Último archivado: hoy, 03:00 ✓',
      running: 'Ejecutando…', runArch: 'Ejecutar archivado', illustrative: 'Datos ilustrativos.',
      transfer: '⇄ Transferir', attach: 'Adjuntar imagen', composer: 'Mensaje o /atajo…',
      calling: 'Llamando a la ext. {n}…', inCall: 'En llamada · {t}', mute: 'Silencio', hangup: 'Colgar',
      callEnded: 'Llamada finalizada · {t}', callCanceled: 'Llamada cancelada', limitYou: 'Ya tienes {max} chats (límite)',
      took: 'Atendiste a {name}', distributed: '{n} asignados por menor carga', noSlot: ' · {n} sin lugar', allFull: 'Todos están en el límite de chats',
      flowDone: 'Flujo completado ✓', archToast: 'Archivado completado ✓', imgSent: '📷 imagen enviada', imgToast: 'Imagen enviada',
      transferTo: 'Transferir a', atLimit: '{name} está en el límite', transferred: 'Transferido a {name}', close: 'Cerrar',
      micOff: 'Micrófono apagado', micOn: 'Micrófono encendido', roleNow: '{name} ahora es {role}',
      replies: ['¡Entendido, muchas gracias!', 'Perfecto, entonces espero.', 'Genial, así está bien.'],
      quick: [['/hola', '¡Hola! Soy Marina, de la atención del Club. ¿En qué puedo ayudarte?'], ['/horario', 'La secretaría atiende de lunes a viernes, de 8 a 18 h.'], ['/gracias', '¡Gracias por contactarnos! ¿Te ayudo con algo más?']],
      flows: [
        ['Bienvenida', [['start', 'Inicio', 'El cliente abre el chat en el portal'], ['msg', 'Mensaje', '"¡Hola! Soy HAL, el asistente del Club. ¿En qué puedo ayudarte?"'], ['ia', 'HAL (IA)', 'Responde dudas sobre actividades, avisos y estatutos'], ['cond', 'Condición', '¿Resolvió la duda? Si no, ofrece un agente'], ['fila', 'Cola de atención', 'Prioridad alta para socios con sesión'], ['fim', 'Fin', 'Encuesta de satisfacción']]],
        ['Fuera de horario', [['start', 'Inicio', 'Chat abierto fuera de horario'], ['cond', 'Condición', '¿Horario comercial? (editable en el panel)'], ['msg', 'Mensaje', '"Nuestro equipo humano vuelve mañana a las 8 h."'], ['ia', 'HAL (IA)', 'Sigue respondiendo solo'], ['fim', 'Fin', 'Registra el contacto para devolver la llamada']]],
        ['Segunda vía', [['start', 'Inicio', 'El cliente elige "Finanzas"'], ['menu', 'Menú', '1 Boleta · 2 Cuota mensual · 3 Hablar con un agente'], ['msg', 'Mensaje', 'Envía el enlace seguro de la segunda vía'], ['fila', 'Cola de atención', 'Solo si el cliente elige la opción 3'], ['fim', 'Fin', 'Cierra y archiva']]],
      ],
      contacts: [['Secretaría', 'Atención'], ['Finanzas', 'Cobranza'], ['Deportes', 'Coordinación'], ['Portería', 'Seguridad'], ['Eventos', 'Reservas'], ['TI', 'Soporte'], ['Directiva', 'Gabinete']],
      queue: [
        ['Helena Prado', 'Duplicado del carné', 'Necesito un duplicado de mi carné, lo perdí la semana pasada.', 'HAL no encontró la regla de reemisión y transfirió.'],
        ['Visitante 4821', 'Horario de la piscina', '¿La piscina abre los domingos?', 'HAL pidió confirmar un horario especial.'],
        ['Roberto Lima', 'Reserva de cancha', 'Quiero reservar la cancha 2 el sábado por la tarde.', 'Las reservas requieren un agente.'],
        ['Visitante 4825', '¿Cómo me asocio?', '¿Qué documentos necesito para asociarme?', 'El cliente pidió hablar con una persona.'],
      ],
      chats: [['Marcos Dias', 'Cancelación de plan', ['Buenas tardes, quiero cancelar mi plan familiar.', 'Claro, Marcos. Voy a revisar tu registro.']], ['Visitante 4790', 'Clases de natación', ['¿Hay cupo para natación infantil?']]],
    },
  };

  const EXT = [['201', 1], ['214', 1], ['230', 0], ['100', 1], ['245', 1], ['299', 1], ['210', 0]];
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const pickLang = () => (typeof SITE_LANG !== 'undefined' && I18N[SITE_LANG]) ? SITE_LANG : 'pt';

  function mount(host) {
    const esc = ProtoShell.esc;
    const T = I18N[pickLang()];
    const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k]);
    const ATT = [{ id: 'me', nome: 'Marina' }, { id: 'c', nome: 'Carlos' }, { id: 'b', nome: 'Beatriz' }];
    const FLOWS = T.flows.map(([nome, blocos]) => ({ nome, blocos }));
    const CONTATOS = T.contacts.map((c, i) => [c[0], c[1], EXT[i][0], EXT[i][1]]);
    const QUEUE_META = [[true, 148], [false, 95], [true, 62], [false, 30]];

    const S = {
      load: { me: 2, c: 4, b: 3 },
      queue: T.queue.map(([nome, assunto, pergunta, hal], i) => ({ id: i + 1, nome, assunto, assoc: QUEUE_META[i][0], espera: QUEUE_META[i][1], pergunta, hal })),
      chats: T.chats.map(([nome, assunto, msgs], i) => ({ id: 101 + i, nome, assunto, msgs: msgs.map((m, k) => [k % 2 ? 'me' : 'them', m]) })),
      open: null, flow: 0, step: -1,
      arch: { state: 'idle', pct: 0 },
      roles: [['Marina', 'att'], ['Carlos', 'ed'], ['Beatriz', 'att'], ['Diego', 'adm']],
      call: null, query: '',
    };
    let ctx;

    // Barra superior igual à do Clubix real: degradê grená + selo do balão
    const LOGO = '<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="11" fill="#fff"/><g transform="translate(7.2 7.2) scale(1.0333)" fill="#7a1230"><path d="M12 3.2c-5.1 0-9.2 3.4-9.2 7.8 0 2.1.9 4 2.5 5.4L4.4 20.6l4.2-2.1c1.1.3 2.2.5 3.4.5 5.1 0 9.2-3.4 9.2-7.8S17.1 3.2 12 3.2Z"/><circle cx="8" cy="11" r="1.2" fill="#fff"/><circle cx="12" cy="11" r="1.2" fill="#fff"/><circle cx="16" cy="11" r="1.2" fill="#fff"/></g></svg>';
    const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
    const appbar = () => `<div class="px-appbar"><span class="px-logo">${LOGO}</span><div class="px-apptitle"><b>Clubix</b><small>${esc(T.appSub)}</small></div><button class="px-moon" data-moon aria-label="${esc(T.theme)}">${MOON}</button></div>`;
    const wrap = f => () => appbar() + `<div class="px-body">${f()}</div>`;

    const sortedQueue = () => [...S.queue].sort((a, b) => (b.assoc - a.assoc) || (b.espera - a.espera));
    const convs = id => esc(fill(T.convs, { n: S.load[id], max: LIMIT }));

    /* ---------- Páginas ---------- */
    const filaHtml = () => `
      <header class="px-head"><div><small>${esc(T.queueKicker)}</small><h1>${esc(T.queueTitle)}</h1></div><div class="px-avatar">M</div></header>
      <div class="cx-team">${ATT.map(a => `<div class="cx-att"><b>${esc(a.id === 'me' ? T.you : a.nome)}</b>
        <div class="cx-bar"><i class="${S.load[a.id] >= LIMIT ? 'full' : ''}" style="width:${S.load[a.id] / LIMIT * 100}%"></i></div>
        <small>${convs(a.id)}</small></div>`).join('')}</div>
      <button class="cx-auto" data-auto>${esc(T.distribute)}</button>
      <h3 class="cx-h">${esc(fill(T.waiting, { n: S.queue.length }))}</h3>
      <div class="px-list">${S.queue.length ? sortedQueue().map(c => `
        <div class="cx-q"><div class="px-avatar">${esc(c.nome[0])}</div>
          <div class="cx-q-body"><b>${esc(c.nome)}</b><small>${esc(c.assunto)}</small>
            <div class="cx-badges">${c.assoc ? `<span class="gold">${esc(T.member)}</span>` : `<span>${esc(T.visitor)}</span>`}<span class="ia">${esc(T.viaHal)}</span><span class="wait">⏱ <em data-wait="${c.id}">${fmt(c.espera)}</em></span></div>
            <p>${esc(c.hal)}</p></div>
          <button class="cx-take" data-take="${c.id}">${esc(T.take)}</button></div>`).join('') : `<p class="px-empty">${esc(T.emptyQueue)}</p>`}</div>`;

    const conversasHtml = () => `
      <header class="px-head"><h1>${esc(T.chatsTitle)}</h1><span class="cx-count">${esc(fill(T.active, { n: S.chats.length }))}</span></header>
      <div class="px-list">${S.chats.length ? S.chats.map(c => { const l = c.msgs[c.msgs.length - 1]; return `
        <button class="px-row" data-chat="${c.id}"><div class="px-avatar">${esc(c.nome[0])}</div>
        <div class="px-row-body"><b>${esc(c.nome)}</b><small>${esc(c.assunto)}</small><span>${esc(l ? l[1] : T.noMsgs)}</span></div>${l && l[0] === 'them' ? '<i class="px-dot"></i>' : ''}</button>`; }).join('') : `<p class="px-empty">${esc(T.noChats)}</p>`}</div>`;

    const fluxosHtml = () => {
      const f = FLOWS[S.flow];
      return `<header class="px-head"><div><small>${esc(T.flowKicker)}</small><h1>${esc(T.flowsTitle)}</h1></div></header>
        <div class="px-chips">${FLOWS.map((x, i) => `<button class="cx-chip ${i === S.flow ? 'on' : ''}" data-flow="${i}">${esc(x.nome)}</button>`).join('')}</div>
        <button class="cx-auto" data-testflow>${esc(T.testFlow)}</button>
        <div class="cx-flow">${f.blocos.map((b, i) => `${i ? '<div class="cx-link"></div>' : ''}
          <button class="cx-block ${b[0]} ${S.step === i ? 'active' : ''} ${S.step > i ? 'done' : ''}" data-block="${i}"><span class="cx-ic">${ICON[b[0]]}</span><div><b>${esc(b[1])}</b><small>${esc(b[2])}</small></div></button>`).join('')}</div>`;
    };

    const contatosList = () => {
      const t = S.query.toLowerCase();
      const l = CONTATOS.map((c, i) => [c, i]).filter(([c]) => (c[0] + c[1] + c[2]).toLowerCase().includes(t));
      return l.length ? l.map(([c, i]) => `<div class="cx-contact"><div class="px-avatar">${esc(c[0][0])}</div>
        <div class="px-row-body"><b>${esc(c[0])}</b><small>${esc(c[1])} · ${esc(fill(T.ext, { n: c[2] }))}</small></div>
        <i class="cx-presence ${c[3] ? 'on' : ''}"></i><button class="cx-call" data-call="${i}" aria-label="${esc(T.call)}">📞</button></div>`).join('') : `<p class="px-empty">${esc(T.noContacts)}</p>`;
    };
    const ramaisHtml = () => `
      <header class="px-head"><div><small>${esc(T.phoneKicker)}</small><h1>${esc(T.extTitle)}</h1></div></header>
      <div class="px-search"><span>⌕</span><input data-keep="q" data-q placeholder="${esc(T.extSearch)}" value="${esc(S.query)}"></div>
      <div class="px-list" data-clist>${contatosList()}</div>`;

    const adminHtml = () => {
      const a = S.arch;
      return `<header class="px-head"><div><small>${esc(T.adminKicker)}</small><h1>Admin</h1></div></header>
        <div class="cx-card"><b>${esc(T.team)}</b><small>${esc(T.teamHint)}</small>
          ${S.roles.map((r, i) => `<button class="cx-role" data-role="${i}"><div class="px-avatar">${r[0][0]}</div><span>${r[0]}</span><em class="r-${r[1]}">${esc(T.roles[r[1]])}</em></button>`).join('')}</div>
        <div class="cx-card"><b>${esc(T.archTitle)}</b>
          <small>${esc(T.archHint)}</small>
          <div class="cx-arch"><div><strong>${T.archNum}</strong><small>${esc(T.archConvs)}</small></div><div><strong>412 → 38 MB</strong><small>${esc(T.archAfter)}</small></div></div>
          ${a.state === 'run' ? `<div class="cx-prog"><i style="width:${a.pct}%"></i></div><small>${esc(a.pct < 60 ? T.compressing : T.verifying)} ${a.pct}%</small>`
            : `<small class="${a.state === 'done' ? 'ok' : ''}">${esc(a.state === 'done' ? T.archDone : T.archLast)}</small>`}
          <button class="cx-auto" data-archive ${a.state === 'run' ? 'disabled' : ''}>${esc(a.state === 'run' ? T.running : T.runArch)}</button></div>
        <p class="cx-note">${esc(T.illustrative)}</p>`;
    };

    /* ---------- Camadas ---------- */
    function chatLayer() {
      const c = S.open;
      return `<div class="px-chat">
        <header class="px-chat-head"><button class="px-back dark" data-close="chat">‹</button><div class="px-avatar">${esc(c.nome[0])}</div>
          <div class="grow"><b>${esc(c.nome)}</b><small>${esc(c.assunto)}</small></div><button class="cx-xfer" data-transfer>${esc(T.transfer)}</button></header>
        <div class="px-msgs" data-msgs></div>
        <div class="cx-quick">${T.quick.map((qk, i) => `<button data-quick="${i}">${esc(qk[0])}</button>`).join('')}</div>
        <form class="px-compose" data-compose><button type="button" class="cx-attach" data-attach aria-label="${esc(T.attach)}">📎</button><input autocomplete="off" placeholder="${esc(T.composer)}"><button>➤</button></form></div>`;
    }
    function paintMsgs(typing) {
      const box = ctx.q('[data-msgs]'); if (!box || !S.open) return;
      box.innerHTML = S.open.msgs.map(([w, t]) => `<div class="px-msg ${w}">${esc(t)}</div>`).join('') + (typing ? '<div class="px-msg them typing"><i></i><i></i><i></i></div>' : '');
      box.scrollTop = box.scrollHeight;
    }
    function say(text) {
      const c = S.open; if (!c || !text.trim()) return;
      c.msgs.push(['me', text.trim()]); paintMsgs(true);
      ctx.later(() => { c.msgs.push(['them', T.replies[c.msgs.length % 3]]); if (S.open === c) paintMsgs(); ctx.renderPage(1); }, 1200);
    }
    const openChat = id => { S.open = S.chats.find(c => c.id === id); ctx.openLayer('chat', chatLayer()); paintMsgs(); };
    function sheet(title, body) { ctx.openLayer('sheet', `<div class="cx-sheet-bg" data-close="sheet"></div><div class="cx-sheet"><b>${title}</b>${body}</div>`); }

    function callLayer(i) {
      const c = CONTATOS[i];
      S.call = { i, secs: 0, on: false, timer: null };
      ctx.openLayer('call', `<div class="cx-call-screen"><div class="px-avatar big">${esc(c[0][0])}</div><h2>${esc(c[0])}</h2>
        <small data-callstate>${esc(fill(T.calling, { n: c[2] }))}</small><div class="cx-ring"></div>
        <div class="cx-call-actions"><button data-mute>🔇<span>${esc(T.mute)}</span></button><button class="end" data-hangup>✕<span>${esc(T.hangup)}</span></button></div></div>`);
      ctx.later(() => {
        if (!S.call) return; S.call.on = true;
        S.call.timer = ctx.every(() => { S.call.secs++; const el = ctx.q('[data-callstate]'); if (el) el.textContent = fill(T.inCall, { t: fmt(S.call.secs) }); }, 1000);
        const el = ctx.q('[data-callstate]'); if (el) el.textContent = fill(T.inCall, { t: '0:00' });
      }, 1300);
    }
    function hangup() {
      if (!S.call) return; const s = S.call; if (s.timer) ctx.clear(s.timer); S.call = null;
      ctx.closeLayer('call'); ctx.toast(s.on ? fill(T.callEnded, { t: fmt(s.secs) }) : T.callCanceled);
    }

    /* ---------- Ações ---------- */
    function take(id) {
      if (S.load.me >= LIMIT) return ctx.toast(fill(T.limitYou, { max: LIMIT }));
      const q = S.queue.find(x => x.id === id); if (!q) return;
      S.queue = S.queue.filter(x => x !== q); S.load.me++;
      S.chats.unshift({ id: q.id, nome: q.nome, assunto: q.assunto, msgs: [['them', q.pergunta]] });
      ctx.renderPage(0); ctx.renderPage(1); ctx.toast(fill(T.took, { name: q.nome }));
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
      ctx.toast(n ? fill(T.distributed, { n }) + (left.length ? fill(T.noSlot, { n: left.length }) : '') : T.allFull);
    }
    function testFlow() {
      const n = FLOWS[S.flow].blocos.length; S.step = 0; ctx.renderPage(2);
      const id = ctx.every(() => { S.step++; if (S.step >= n) { ctx.clear(id); S.step = -1; ctx.renderPage(2); ctx.toast(T.flowDone); } else ctx.renderPage(2); }, 650);
    }
    function archive() {
      if (S.arch.state === 'run') return; S.arch = { state: 'run', pct: 0 }; ctx.renderPage(4);
      const id = ctx.every(() => { S.arch.pct = Math.min(100, S.arch.pct + 10); if (S.arch.pct >= 100) { ctx.clear(id); S.arch.state = 'done'; ctx.toast(T.archToast); } ctx.renderPage(4); }, 260);
    }

    ctx = ProtoShell.create(host, {
      theme: 'clubix',
      tabs: T.tabs.map((label, i) => ({ label, icon: ['☰', '✉', '⑂', '☎', '⚙'][i] })),
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
        else if (d.quick != null) say(T.quick[+d.quick][1]);
        else if ('attach' in d) { S.open.msgs.push(['me', T.imgSent]); paintMsgs(); ctx.toast(T.imgToast); }
        else if ('transfer' in d) sheet(esc(T.transferTo), ATT.filter(a => a.id !== 'me').map(a => `<button class="cx-opt" data-to="${a.id}"><span>${esc(a.nome)}</span><small>${convs(a.id)}</small></button>`).join(''));
        else if (d.to) {
          const a = ATT.find(x => x.id === d.to);
          if (S.load[a.id] >= LIMIT) return ctx.toast(fill(T.atLimit, { name: a.nome }));
          S.load[a.id]++; S.load.me--; S.chats = S.chats.filter(x => x !== S.open);
          ctx.closeLayer('sheet'); ctx.closeLayer('chat'); ctx.renderPage(0); ctx.toast(fill(T.transferred, { name: a.nome }));
        }
        else if (d.flow != null) { S.flow = +d.flow; S.step = -1; ctx.renderPage(2); }
        else if ('testflow' in d) testFlow();
        else if (d.block != null) { const bl = FLOWS[S.flow].blocos[+d.block]; sheet(esc(bl[1]), `<p>${esc(bl[2])}</p><button class="cx-auto" data-close="sheet">${esc(T.close)}</button>`); }
        else if (d.call != null) callLayer(+d.call);
        else if ('hangup' in d) hangup();
        else if ('mute' in d) { b.classList.toggle('on'); ctx.toast(b.classList.contains('on') ? T.micOff : T.micOn); }
        else if (d.role != null) { const r = S.roles[+d.role]; r[1] = ROLE_KEYS[(ROLE_KEYS.indexOf(r[1]) + 1) % 3]; ctx.renderPage(4); ctx.toast(fill(T.roleNow, { name: r[0], role: T.roles[r[1]] })); }
        else if ('archive' in d) archive();
      },
      onInput(e, c) { if (e.target.matches('[data-q]')) { S.query = e.target.value; c.q('[data-clist]').innerHTML = contatosList(); } },
      onSubmit(e) { if (e.target.matches('[data-compose]')) { const i = e.target.querySelector('input'); const hit = T.quick.find(qk => qk[0] === i.value.trim()); say(hit ? hit[1] : i.value); i.value = ''; } },
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
