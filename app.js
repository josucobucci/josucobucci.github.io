// Portfólio estilo catálogo: tudo é gerado a partir de data/projects.json.
// Para adicionar um projeto novo, basta incluir uma entrada em "projects".

const ICONS = {
  github: '<svg viewBox="0 0 24 24"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.2-3.1-.1-.4-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.1 0 4.6-2.8 5.6-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24"><path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.5V9h3.6v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M6 4l15 8-15 8z"/></svg>',
  info: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
};

const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tagsHtml = tags => `<div class="tags">${(tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>`;

let DATA;

init();

async function init() {
  try {
    const res = await fetch('data/projects.json', { cache: 'no-cache' });
    DATA = await res.json();
  } catch (err) {
    $('#hero').innerHTML = '<p style="padding:120px 24px">Não foi possível carregar os projetos. Abra via servidor local (veja o README).</p>';
    console.error(err);
    return;
  }
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  renderTopbar();
  renderHero([...DATA.projects].sort((x, y) => Boolean(y.featured) - Boolean(x.featured)));
  renderRows();
  renderFooter();
  setupModal();
  window.addEventListener('scroll', () => $('#topbar').classList.toggle('solid', scrollY > 40), { passive: true });
  if (!location.hash) scrollTo(0, 0);
  // Abre direto um projeto se a URL tiver #projeto/<id> (link compartilhável)
  const m = location.hash.match(/^#projeto\/(.+)$/);
  if (m) openProject(m[1]);
}

function renderTopbar() {
  const o = DATA.owner;
  $('#brand').innerHTML = `${esc(o.name.toUpperCase())}<span>.</span>`;
  $('#topbar-links').innerHTML = [
    o.github && `<a class="icon-link" href="${esc(o.github)}" target="_blank" rel="noopener" aria-label="GitHub">${ICONS.github}</a>`,
    o.linkedin && `<a class="icon-link" href="${esc(o.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn">${ICONS.linkedin}</a>`,
  ].filter(Boolean).join('');
}

const isRaster = src => /\.(png|webp|jpe?g)$/i.test(src || '');
const hasDemo = p => Boolean(p.prototype || p.demo);

function demoButton(p, label = 'Explorar o app') {
  return hasDemo(p)
    ? `<button class="btn btn-primary" data-demo="${esc(p.id)}">${ICONS.play} ${label}</button>`
    : `<span class="btn btn-primary" aria-disabled="true" title="A versão web interativa está sendo preparada">${ICONS.play} Demo em breve</span>`;
}

// Banner: carrossel automático com uma série (projeto) por slide.
// O tempo de cada slide (7 s) é a duração da animação "hero-fill" no styles.css.
let heroIdx = 0;
const heroPause = new Set();

function heroSlide(p, i, n) {
  return `<article class="hero-slide" style="--hero-accent:${esc(p.accent)}" aria-roledescription="slide" aria-label="${i + 1} de ${n}: ${esc(p.title)}">
    <div>
      <div class="hero-kicker"><b>●</b> Série em destaque</div>
      <h1 class="hero-title">${esc(p.title)}</h1>
      <div class="hero-meta">
        <span>${esc(p.year)}</span>
        <span class="badge ${hasDemo(p) ? 'live' : ''}">${p.prototype ? 'PROTÓTIPO INTERATIVO' : p.demo ? 'DEMO AO VIVO' : esc(p.status)}</span>
        <span>${esc(p.category)}</span>
        <span>${p.features?.length || 0} features</span>
      </div>
      <p class="hero-tagline">${esc(p.tagline)}</p>
      <p class="hero-desc">${esc(p.description)}</p>
      <div class="actions">
        ${demoButton(p)}
        <button class="btn btn-ghost" data-open="${esc(p.id)}">${ICONS.info} Mais informações</button>
      </div>
    </div>
    <div class="hero-visual ${isRaster(p.art) ? 'has-art' : ''}">${isRaster(p.art) ? `<img class="hero-art" src="${esc(p.art)}" alt="" loading="lazy">` : ''}${phoneHtml(p, false)}</div>
  </article>`;
}

function renderHero(list) {
  const hero = $('#hero'), n = list.length;
  hero.innerHTML = `
    <div class="hero-track">${list.map((p, i) => heroSlide(p, i, n)).join('')}</div>
    ${n > 1 ? `<button class="hero-arrow left" aria-label="Série anterior" data-hero="-1">‹</button>
    <button class="hero-arrow right" aria-label="Próxima série" data-hero="1">›</button>
    <div class="hero-dots" role="tablist" aria-label="Séries em destaque">${list.map((p, i) => `<button class="hero-dot" role="tab" data-hero-go="${i}"><span>${esc(p.title)}</span><i></i></button>`).join('')}</div>` : ''}`;
  mountProtos(hero);
  if (n < 2) return;
  heroGo(0);

  // Avança sozinho quando a barra de progresso do slide termina (CSS controla o tempo e a pausa)
  hero.addEventListener('animationend', e => { if (e.animationName === 'hero-fill') heroGo(heroIdx + 1); });
  hero.addEventListener('click', e => {
    const step = e.target.closest('[data-hero]'), go = e.target.closest('[data-hero-go]');
    if (step) heroGo(heroIdx + Number(step.dataset.hero));
    if (go) heroGo(Number(go.dataset.heroGo));
  });
  // Pausas: mouse/foco no banner, tour do protótipo rodando, toque no celular, aba escondida
  hero.addEventListener('mouseenter', () => setHeroPause('hover', true));
  hero.addEventListener('mouseleave', () => setHeroPause('hover', false));
  hero.addEventListener('focusin', () => setHeroPause('focus', true));
  hero.addEventListener('focusout', () => setHeroPause('focus', false));
  hero.querySelectorAll('[data-proto]').forEach(h => {
    h.addEventListener('tourstart', () => setHeroPause('tour', true));
    h.addEventListener('tourend', () => setHeroPause('tour', false));
  });
  let touchTimer;
  hero.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' || !e.target.closest('.hero-visual')) return;
    setHeroPause('touch', true); clearTimeout(touchTimer); touchTimer = setTimeout(() => setHeroPause('touch', false), 15000);
  });
  document.addEventListener('visibilitychange', () => setHeroPause('hidden', document.hidden));
  // Deslizar com o dedo no texto troca de série (dentro do celular, o gesto é do protótipo)
  let x0 = null;
  hero.addEventListener('touchstart', e => { x0 = e.target.closest('.hero-visual, .hero-dots') ? null : e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) heroGo(heroIdx + (dx < 0 ? 1 : -1));
  }, { passive: true });
}

function heroGo(i) {
  const hero = $('#hero'), slides = [...hero.querySelectorAll('.hero-slide')], dots = [...hero.querySelectorAll('.hero-dot')];
  const n = slides.length; heroIdx = ((i % n) + n) % n;
  $('.hero-track', hero).style.transform = `translateX(-${heroIdx * 100}%)`;
  slides.forEach((s, k) => { s.toggleAttribute('inert', k !== heroIdx); s.setAttribute('aria-hidden', String(k !== heroIdx)); });
  dots.forEach((d, k) => { d.classList.remove('active'); d.classList.toggle('done', k < heroIdx); d.setAttribute('aria-selected', String(k === heroIdx)); });
  void hero.offsetWidth; // reinicia a animação da barra de progresso
  dots[heroIdx].classList.add('active');
}

function setHeroPause(key, on) {
  on ? heroPause.add(key) : heroPause.delete(key);
  $('#hero').classList.toggle('paused', heroPause.size > 0);
}

// Protótipos interativos montados na página (ver prototype.js). Um por área (banner e modal).
const protoInstances = new WeakMap();
const PROTOTYPES = () => ({ zip4zip: typeof ZipPrototype !== 'undefined' && ZipPrototype, clubix: typeof ClubixPrototype !== 'undefined' && ClubixPrototype, hal: typeof HalPrototype !== 'undefined' && HalPrototype });
function mountProtos(scope) {
  scope.querySelectorAll('[data-proto]').forEach(host => {
    const proto = PROTOTYPES()[host.dataset.proto];
    if (!proto || protoInstances.has(host)) return;
    const inst = proto.mount(host);
    protoInstances.set(host, inst);
    const btn = host.closest('.proto-wrap, .hero-visual')?.querySelector('[data-tour]');
    host.addEventListener('tourstart', () => { if (btn) btn.textContent = '■ Parar tour'; });
    host.addEventListener('tourend', () => { if (btn) btn.textContent = '▶ Tour automático'; });
  });
}
function unmountProtos(scope) {
  scope.querySelectorAll('[data-proto]').forEach(host => { protoInstances.get(host)?.destroy(); protoInstances.delete(host); });
}

// Moldura de celular: protótipo interativo, demo real (iframe) ou prévia ilustrativa, nessa ordem.
function phoneHtml(p, live) {
  if (p.prototype) {
    return `<div class="proto-wrap"><div class="phone ${live ? 'straight' : ''}"><div class="phone-screen"><div class="notch"></div><div class="px-host" data-proto="${esc(p.id)}"></div></div></div>
      <div class="proto-controls"><button class="primary" data-tour>▶ Tour automático</button></div></div>`;
  }
  const screen = live && p.demo
    ? `<iframe src="${esc(p.demo)}" title="Demo de ${esc(p.title)}" loading="lazy" allow="geolocation"></iframe>`
    : mockScreen(p);
  return `<div class="phone ${live ? 'straight' : ''}"><div class="phone-screen"><div class="notch"></div>${screen}</div></div>`;
}

function mockScreen(p) {
  const items = [
    ['Café em grão 30kg', 'Distribuidora Sul · 2,4 km', 'R$ 890', '#a16207'],
    ['Caixas de papelão', 'EmbalaMais · 5,1 km', 'R$ 2,10/un', '#0e7490'],
    ['Farinha de trigo 50kg', 'Moinho Real · 8,7 km', 'R$ 210', '#7c3aed'],
  ];
  return `<div class="mock" aria-hidden="true">
    <div class="mock-head"><span class="mock-logo">${esc(p.title)}</span><span class="mock-avatar"></span></div>
    <div class="mock-search">Buscar produtos, cidades…</div>
    <div class="mock-toggle"><span class="on">Venda</span><span>Procura</span></div>
    ${items.map(([n, s, pr, c]) => `<div class="mock-card"><div class="mock-thumb" style="background:linear-gradient(135deg,${c},#18181b)"></div><div><b>${n}</b><small>${s}</small><small class="price">${pr}</small></div></div>`).join('')}
    <div class="mock-tabs"><i class="on"></i><i></i><i></i><i></i><i></i></div>
  </div>`;
}

function renderRows() {
  const rows = [];
  rows.push(row('row-projetos', 'Projetos', DATA.projects.map(projectCard)));

  for (const p of DATA.projects.filter(p => p.features?.length)) {
    rows.push(row(p.featured ? 'row-features' : `row-ep-${p.id}`, `${p.title}: feature por feature`,
      p.features.map((ep, i) => featureCard(p, ep, i))));
  }

  if (DATA.comingSoon?.length) rows.push(row('row-embreve', 'Em breve', DATA.comingSoon.map(soonCard)));

  // Uma fileira por tecnologia: ajuda recrutadores que procuram uma stack específica
  const stack = [...new Set(DATA.projects.flatMap(p => p.tags))];
  rows.push(row('row-stack', 'Por tecnologia', stack.map(t => stackCard(t))));

  $('#rows').innerHTML = rows.join('');
  document.querySelectorAll('.row-track-wrap').forEach(wrap => {
    const track = $('.row-track', wrap);
    wrap.querySelectorAll('.row-arrow').forEach(btn => btn.addEventListener('click', () =>
      track.scrollBy({ left: (btn.classList.contains('left') ? -1 : 1) * track.clientWidth * 0.8, behavior: 'smooth' })));
  });
}

function row(id, title, cards) {
  return `<section class="row" id="${id}">
    <h2>${esc(title)}</h2>
    <div class="row-track-wrap">
      <button class="row-arrow left" aria-label="Voltar">‹</button>
      <div class="row-track">${cards.join('')}</div>
      <button class="row-arrow right" aria-label="Avançar">›</button>
    </div>
  </section>`;
}

function projectCard(p) {
  return `<button class="card" style="--c:${esc(p.accent)}" data-open="${esc(p.id)}">
    <div class="card-art"></div>
    ${p.art ? `<img class="${isRaster(p.art) ? 'card-img' : 'card-logo'}" src="${esc(p.art)}" alt="" loading="lazy">` : ''}
    ${hasDemo(p) ? '<span class="ribbon">▶ Interativo</span>' : ''}
    <div class="card-body">
      <span class="card-kicker">${esc(p.category)}</span>
      <span class="card-title">${esc(p.title)}</span>
      <span class="card-sub">${esc(p.tagline)}</span>
    </div>
  </button>`;
}

function featureCard(p, ep, i) {
  return `<button class="card" style="--c:${esc(p.accent)}" data-open="${esc(p.id)}" data-ep="${i}">
    <div class="card-art"></div>
    <span class="card-num">${String(i + 1).padStart(2, '0')}</span>
    <div class="card-body">
      <span class="card-kicker">${esc(p.title)} · Feature ${i + 1}</span>
      <span class="card-title">${esc(ep.title)}</span>
      <span class="card-sub">${esc((ep.tags || []).join(' · '))}</span>
    </div>
  </button>`;
}

function soonCard(s) {
  return `<div class="card soon" style="--c:${esc(s.accent || '#52525b')}">
    <div class="card-art"></div>
    <span class="ribbon">Em breve</span>
    <div class="card-body">
      <span class="card-kicker">Em breve no catálogo</span>
      <span class="card-title">${esc(s.title)}</span>
    </div>
  </div>`;
}

function stackCard(tag) {
  const projs = DATA.projects.filter(p => p.tags.includes(tag));
  return `<button class="card" style="--c:${esc(projs[0].accent)};width:clamp(170px,16vw,210px)" data-open="${esc(projs[0].id)}">
    <div class="card-art" style="filter:saturate(.5)"></div>
    <div class="card-body">
      <span class="card-kicker">${projs.length} projeto${projs.length > 1 ? 's' : ''}</span>
      <span class="card-title" style="font-size:18px">${esc(tag)}</span>
    </div>
  </button>`;
}

function renderFooter() {
  const o = DATA.owner;
  $('#footer').innerHTML = `
    <p><b style="color:#e4e4e7">${esc(o.name)}</b>, ${esc(o.role)}</p>
    <p>${esc(o.bio)}</p>
    <p>Feito com HTML, CSS e JavaScript puro · Hospedado no GitHub Pages</p>`;
}

/* ---------- Modal ---------- */
function setupModal() {
  document.addEventListener('click', e => {
    const open = e.target.closest('[data-open]');
    const demo = e.target.closest('[data-demo]');
    const tour = e.target.closest('[data-tour]');
    const shot = e.target.closest('[data-shot]');
    if (shot) return openShot(Number(shot.dataset.shot));
    if (e.target.closest('.lightbox')) return closeShot();
    if (tour) {
      const host = tour.closest('.proto-wrap, .hero-visual').querySelector('[data-proto]');
      const inst = protoInstances.get(host);
      return tour.textContent.includes('Parar') ? inst?.stop() : inst?.tour();
    }
    if (demo) return openDemo(demo.dataset.demo);
    if (open) return openProject(open.dataset.open, open.dataset.ep);
    if (e.target.closest('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if ($('.lightbox')) closeShot(); else closeModal(); } });
}

let lastFocus;
function showModal(html, accent) {
  lastFocus = document.activeElement;
  $('#modal-body').innerHTML = html;
  $('.modal-card').style.setProperty('--c', accent);
  $('#modal').hidden = false;
  document.body.style.overflow = 'hidden';
  $('.modal-close').focus();
  setHeroPause('modal', true);
}
function closeModal() {
  if ($('#modal').hidden) return;
  $('#modal').hidden = true;
  unmountProtos($('#modal-body'));
  $('#modal-body').innerHTML = ''; // descarrega o iframe/protótipo
  document.body.style.overflow = '';
  setHeroPause('modal', false);
  if (location.hash.startsWith('#projeto/')) history.replaceState(null, '', location.pathname);
  lastFocus?.focus();
}

let currentProject = null;
function openProject(id, epIndex) {
  const p = DATA.projects.find(x => x.id === id);
  if (!p) return;
  currentProject = p;
  history.replaceState(null, '', `#projeto/${p.id}`);
  const eps = p.features || [];
  showModal(`
    <div class="modal-hero">
      <h3 id="modal-title">${esc(p.title)}</h3>
      <div class="actions">
        ${demoButton(p)}
        ${p.repo ? `<a class="btn btn-ghost" href="${esc(p.repo)}" target="_blank" rel="noopener">${ICONS.github} Código no GitHub</a>` : `<span class="btn btn-ghost" aria-disabled="true" title="O código deste projeto é privado">🔒 Código privado</span>`}
      </div>
    </div>
    <div class="modal-content">
      <div>
        <div class="hero-meta" style="margin-bottom:14px">
          <span>${esc(p.year)}</span><span class="badge">${esc(p.status)}</span><span>${eps.length} features</span>
        </div>
        <p><b style="color:#fff">${esc(p.tagline)}</b></p>
        <p>${esc(p.description)}</p>
      </div>
      <div class="modal-side">
        <div><span>Stack: </span><b>${esc(p.tags.join(', '))}</b></div>
        <div><span>Categoria: </span><b>${esc(p.category)}</b></div>
      </div>
    </div>
    ${p.gallery?.length ? `<div class="gallery"><h4>Telas do sistema</h4><small>Capturas do sistema real rodando com dados fictícios. Toque para ampliar.</small>
      <div class="gallery-track">${p.gallery.map((g, i) => `<button class="shot ${g.kind === 'mobile' ? 'mobile' : ''}" data-shot="${i}"><img src="${esc(g.src)}" alt="${esc(g.title)}" loading="lazy"><span>${esc(g.title)}</span></button>`).join('')}</div></div>` : ''}
    ${(p.related || []).map(rid => DATA.projects.find(x => x.id === rid)).filter(Boolean).map(r => `<div class="related">
      <small>Funciona junto com</small>
      <button class="related-card" style="--c:${esc(r.accent)}" data-open="${esc(r.id)}"><b>${esc(r.title)}</b><span>${esc(r.tagline)}</span><em>Ver projeto ›</em></button>
      ${p.relation ? `<p>${esc(p.relation)}</p>` : ''}</div>`).join('')}
    ${eps.length ? `<div class="features">
      <h4>Features</h4>
      ${eps.map((ep, i) => `<div class="feature" id="ep-${i}">
        <div class="feature-num">${i + 1}</div>
        <div><b>${esc(ep.title)}</b><p>${esc(ep.desc)}</p>${tagsHtml(ep.tags)}</div>
      </div>`).join('')}
    </div>` : ''}`, p.accent);

  if (epIndex != null) {
    const el = $(`#ep-${epIndex}`);
    el.style.background = '#26262e';
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
  }
}

function openDemo(id) {
  const p = DATA.projects.find(x => x.id === id);
  if (!p || !hasDemo(p)) return;
  const note = p.prototype
    ? 'Protótipo com dados fictícios: toque nos cards, nas abas e no chat, ou arraste para os lados para trocar de tela.'
    : `${esc(p.demoNote || 'Versão web real do app, rodando no seu navegador.')} <a href="${esc(p.demo)}" target="_blank" rel="noopener" style="text-decoration:underline">Abrir em tela cheia ↗</a>`;
  showModal(`
    <div class="demo-stage">
      <h3 id="modal-title" style="margin:0 0 20px">${esc(p.title)}: ${p.prototype ? 'protótipo interativo' : 'demo ao vivo'}</h3>
      ${phoneHtml(p, true)}
      <p class="demo-note">${note}</p>
    </div>`, p.accent);
  mountProtos($('#modal-body'));
  if (p.prototype) setTimeout(() => protoInstances.get($('#modal-body [data-proto]'))?.tour(), 600);
}

/* ---------- Ampliar tela (lightbox) ---------- */
function openShot(i) {
  const g = currentProject?.gallery?.[i]; if (!g) return;
  closeShot();
  const box = document.createElement('div');
  box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', g.title);
  box.innerHTML = `<figure><img src="${esc(g.src)}" alt="${esc(g.title)}"><figcaption>${esc(g.title)}</figcaption></figure>`;
  document.body.appendChild(box);
}
function closeShot() { document.querySelector('.lightbox')?.remove(); }
