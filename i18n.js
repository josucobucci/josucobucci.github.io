// Idiomas do site: português (padrão), inglês e espanhol.
// Ordem de escolha: ?lang= na URL → escolha salva → idioma do navegador → português.
// Os textos dos projetos ficam em data/projects.json (pt), projects.en.json e projects.es.json;
// os textos da interface ficam aqui; os dos protótipos ficam em cada prototype/proto-*.js.

const LANGS = { pt: 'Português', en: 'English', es: 'Español' };
const HTML_LANG = { pt: 'pt-BR', en: 'en', es: 'es' };

const SITE_LANG = (() => {
  const q = new URLSearchParams(location.search).get('lang');
  if (q && LANGS[q]) { try { localStorage.setItem('lang', q); } catch {} return q; }
  try { const saved = localStorage.getItem('lang'); if (saved && LANGS[saved]) return saved; } catch {}
  const nav = (navigator.language || 'pt').slice(0, 2).toLowerCase();
  return LANGS[nav] ? nav : 'pt';
})();
document.documentElement.lang = HTML_LANG[SITE_LANG];

const UI = {
  pt: {
    title: 'Josué · Portfólio',
    metaDesc: 'Portfólio interativo de projetos mobile e full-stack.',
    loadError: 'Não foi possível carregar os projetos. Abra via servidor local (veja o README).',
    'nav.projects': 'Projetos', 'nav.features': 'Features', 'nav.soon': 'Em breve',
    language: 'Idioma', close: 'Fechar',
    explore: 'Explorar o app', demoSoon: 'Demo em breve', demoSoonTitle: 'A versão web interativa está sendo preparada',
    moreInfo: 'Mais informações', featuredSeries: 'Série em destaque',
    badgeProto: 'PROTÓTIPO INTERATIVO', badgeLive: 'DEMO AO VIVO', featuresCount: '{n} features',
    slideLabel: '{i} de {n}: {title}', prevSeries: 'Série anterior', nextSeries: 'Próxima série', seriesNav: 'Séries em destaque',
    tour: '▶ Tour automático', stopTour: '■ Parar tour', demoOf: 'Demo de {title}',
    rowProjects: 'Projetos', rowFeatures: '{title}: feature por feature', rowSoon: 'Em breve', rowStack: 'Por tecnologia',
    back: 'Voltar', next: 'Avançar', ribbonInteractive: '▶ Interativo', featureN: 'Feature {n}',
    soonRibbon: 'Em breve', soonKicker: 'Em breve no catálogo', projOne: '1 projeto', projMany: '{n} projetos',
    footerMade: 'Feito com HTML, CSS e JavaScript puro · Hospedado no GitHub Pages',
    codeGithub: 'Código no GitHub', codePrivate: '🔒 Código privado', codePrivateTitle: 'O código deste projeto é privado',
    stack: 'Stack', category: 'Categoria', gallery: 'Telas do sistema',
    galleryNote: 'Capturas do sistema real rodando com dados fictícios. Toque para ampliar.',
    worksWith: 'Funciona junto com', seeProject: 'Ver projeto ›', featuresTitle: 'Features',
    protoTitle: 'protótipo interativo', liveTitle: 'demo ao vivo',
    protoNote: 'Protótipo com dados fictícios: toque nos cards, nas abas e no chat, ou arraste para os lados para trocar de tela.',
    liveNote: 'Versão web real do app, rodando no seu navegador.', openFull: 'Abrir em tela cheia ↗',
  },
  en: {
    title: 'Josué · Portfolio',
    metaDesc: 'Interactive portfolio of mobile and full-stack projects.',
    loadError: 'Could not load the projects. Open it through a local server (see the README).',
    'nav.projects': 'Projects', 'nav.features': 'Features', 'nav.soon': 'Coming soon',
    language: 'Language', close: 'Close',
    explore: 'Explore the app', demoSoon: 'Demo coming soon', demoSoonTitle: 'The interactive web version is being prepared',
    moreInfo: 'More info', featuredSeries: 'Featured series',
    badgeProto: 'INTERACTIVE PROTOTYPE', badgeLive: 'LIVE DEMO', featuresCount: '{n} features',
    slideLabel: '{i} of {n}: {title}', prevSeries: 'Previous series', nextSeries: 'Next series', seriesNav: 'Featured series',
    tour: '▶ Auto tour', stopTour: '■ Stop tour', demoOf: '{title} demo',
    rowProjects: 'Projects', rowFeatures: '{title}: feature by feature', rowSoon: 'Coming soon', rowStack: 'By technology',
    back: 'Back', next: 'Next', ribbonInteractive: '▶ Interactive', featureN: 'Feature {n}',
    soonRibbon: 'Coming soon', soonKicker: 'Coming to the catalog', projOne: '1 project', projMany: '{n} projects',
    footerMade: 'Built with plain HTML, CSS and JavaScript · Hosted on GitHub Pages',
    codeGithub: 'Code on GitHub', codePrivate: '🔒 Private code', codePrivateTitle: 'The code for this project is private',
    stack: 'Stack', category: 'Category', gallery: 'System screens',
    galleryNote: 'Screenshots of the real system running with fictitious data. Tap to enlarge.',
    worksWith: 'Works together with', seeProject: 'See project ›', featuresTitle: 'Features',
    protoTitle: 'interactive prototype', liveTitle: 'live demo',
    protoNote: 'Prototype with fictitious data: tap the cards, tabs and chat, or swipe sideways to switch screens.',
    liveNote: 'Real web version of the app, running in your browser.', openFull: 'Open full screen ↗',
  },
  es: {
    title: 'Josué · Portafolio',
    metaDesc: 'Portafolio interactivo de proyectos móviles y full-stack.',
    loadError: 'No se pudieron cargar los proyectos. Ábrelo desde un servidor local (consulta el README).',
    'nav.projects': 'Proyectos', 'nav.features': 'Funcionalidades', 'nav.soon': 'Próximamente',
    language: 'Idioma', close: 'Cerrar',
    explore: 'Explorar la app', demoSoon: 'Demo próximamente', demoSoonTitle: 'La versión web interactiva se está preparando',
    moreInfo: 'Más información', featuredSeries: 'Serie destacada',
    badgeProto: 'PROTOTIPO INTERACTIVO', badgeLive: 'DEMO EN VIVO', featuresCount: '{n} funcionalidades',
    slideLabel: '{i} de {n}: {title}', prevSeries: 'Serie anterior', nextSeries: 'Serie siguiente', seriesNav: 'Series destacadas',
    tour: '▶ Tour automático', stopTour: '■ Detener tour', demoOf: 'Demo de {title}',
    rowProjects: 'Proyectos', rowFeatures: '{title}: funcionalidad por funcionalidad', rowSoon: 'Próximamente', rowStack: 'Por tecnología',
    back: 'Atrás', next: 'Siguiente', ribbonInteractive: '▶ Interactivo', featureN: 'Funcionalidad {n}',
    soonRibbon: 'Próximamente', soonKicker: 'Próximamente en el catálogo', projOne: '1 proyecto', projMany: '{n} proyectos',
    footerMade: 'Hecho con HTML, CSS y JavaScript puro · Alojado en GitHub Pages',
    codeGithub: 'Código en GitHub', codePrivate: '🔒 Código privado', codePrivateTitle: 'El código de este proyecto es privado',
    stack: 'Stack', category: 'Categoría', gallery: 'Pantallas del sistema',
    galleryNote: 'Capturas del sistema real funcionando con datos ficticios. Toca para ampliar.',
    worksWith: 'Funciona junto con', seeProject: 'Ver proyecto ›', featuresTitle: 'Funcionalidades',
    protoTitle: 'prototipo interactivo', liveTitle: 'demo en vivo',
    protoNote: 'Prototipo con datos ficticios: toca las tarjetas, las pestañas y el chat, o desliza hacia los lados para cambiar de pantalla.',
    liveNote: 'Versión web real de la app, funcionando en tu navegador.', openFull: 'Abrir en pantalla completa ↗',
  },
};

// t('chave', { n: 3 }) → texto no idioma atual (cai para o português se faltar)
function t(key, vars) {
  let s = UI[SITE_LANG]?.[key] ?? UI.pt[key] ?? key;
  if (vars) for (const k in vars) s = s.split(`{${k}}`).join(vars[k]);
  return s;
}

// Link para outro idioma, mantendo o projeto aberto (#projeto/...)
const langHref = lang => `?lang=${lang}${location.hash}`;
