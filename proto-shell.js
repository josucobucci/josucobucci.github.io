// Casca compartilhada dos protótipos de celular (Clubix e HAL).
// Cuida de: tela 360x780 escalada, páginas com swipe horizontal, abas, toast,
// camadas (detalhe/chat/sheet), timers com limpeza e tour automático.
// O protótipo do ZIP4ZIP (prototype.js) é independente e continua como está.

const ProtoShell = (() => {
  const W = 360, H = 780;
  const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function create(host, cfg) {
    const { theme, tabs, layers = [], render, onClick, onInput, onSubmit, onLayerClose } = cfg;
    let destroyed = false, running = false, tourTimer = null, tab = 0, toastTimer = null;
    const timers = new Set(), intervals = new Set();

    host.innerHTML = `
      <div class="px t-${theme}" style="width:${W}px;height:${H}px">
        <div class="px-status"><span>9:41</span><span>●●● ▮</span></div>
        <div class="px-pages">${render.map((_, i) => `<section class="px-page" data-page="${i}"></section>`).join('')}</div>
        ${layers.map(n => `<div class="px-overlay" data-layer="${n}"></div>`).join('')}
        <nav class="px-tabs">${tabs.map((t, i) => `<button data-tab="${i}"><b>${t.icon}</b><span>${t.label}</span></button>`).join('')}</nav>
        <div class="px-toast" role="status"></div>
      </div>`;
    const root = host.firstElementChild;
    const pages = root.querySelector('.px-pages');
    const q = sel => root.querySelector(sel);
    const pageEl = i => pages.children[i];

    const fit = () => { root.style.transform = `scale(${host.clientWidth / W})`; };
    const ro = new ResizeObserver(fit); ro.observe(host); fit();

    const ctx = {
      root, host, q, pageEl, esc,
      get tab() { return tab; },
      get destroyed() { return destroyed; },
      later(fn, ms) { const id = setTimeout(() => { timers.delete(id); if (!destroyed) fn(); }, ms); timers.add(id); return id; },
      every(fn, ms) { const id = setInterval(() => { if (!destroyed) fn(); }, ms); intervals.add(id); return id; },
      clear(id) { clearTimeout(id); clearInterval(id); timers.delete(id); intervals.delete(id); },
      toast(msg) {
        const t = q('.px-toast'); t.textContent = msg; t.classList.add('on');
        clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 1900);
      },
      renderPage(i) {
        const el = pageEl(i), top = el.scrollTop;
        const focused = el.contains(document.activeElement) && document.activeElement.matches('input');
        const sel = focused ? document.activeElement.getAttribute('data-keep') : null;
        el.innerHTML = render[i]();
        el.scrollTop = top;
        if (sel) { const inp = el.querySelector(`[data-keep="${sel}"]`); if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); } }
      },
      renderAll() { render.forEach((_, i) => ctx.renderPage(i)); },
      go(i, smooth = true) { tab = i; pages.scrollTo({ left: i * W, behavior: smooth ? 'smooth' : 'auto' }); syncTabs(); },
      openLayer(name, html) { const l = q(`[data-layer="${name}"]`); if (html != null) l.innerHTML = html; l.classList.add('on'); return l; },
      closeLayer(name) { const l = q(`[data-layer="${name}"]`); if (l.classList.contains('on')) { l.classList.remove('on'); onLayerClose?.(name, ctx); } },
      closeLayers() { layers.forEach(n => ctx.closeLayer(n)); },
      layerEl: name => q(`[data-layer="${name}"]`),

      async tour(steps) {
        ctx.stopTour(); ctx.closeLayers(); ctx.go(0, false);
        running = true; host.dispatchEvent(new CustomEvent('tourstart'));
        for (let i = 0; i < steps.length && running && !destroyed; i += 2) {
          steps[i](ctx);
          if (steps[i + 1]) await new Promise(r => { tourTimer = setTimeout(r, steps[i + 1]); });
        }
        ctx.stopTour();
      },
      stopTour() { if (!running) return; running = false; clearTimeout(tourTimer); host.dispatchEvent(new CustomEvent('tourend')); },
      destroy() { destroyed = true; clearTimeout(tourTimer); timers.forEach(clearTimeout); intervals.forEach(clearInterval); ro.disconnect(); },
    };

    function syncTabs() { root.querySelectorAll('.px-tabs button').forEach((b, i) => b.classList.toggle('on', i === tab)); }
    let raf;
    pages.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { const i = Math.round(pages.scrollLeft / W); if (i !== tab) { tab = i; syncTabs(); } });
    }, { passive: true });

    root.addEventListener('click', e => {
      ctx.stopTour();
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.tab != null) { ctx.closeLayers(); ctx.go(+b.dataset.tab); return; }
      onClick?.(b, ctx, e);
    });
    root.addEventListener('input', e => onInput?.(e, ctx));
    root.addEventListener('submit', e => { e.preventDefault(); onSubmit?.(e, ctx); });
    root.addEventListener('wheel', () => ctx.stopTour(), { passive: true });
    root.addEventListener('touchstart', () => ctx.stopTour(), { passive: true });

    ctx.renderAll(); syncTabs();
    return ctx;
  }

  return { create, esc };
})();
