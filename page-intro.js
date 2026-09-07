// Start before first paint; always release the page even if an asset fails.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (location.hash || reduced.matches) return;
  const started = performance.now();
  let finished = false;
  let overlay;
  let content = [];
  let minimumTimer;
  let cleanupTimer;
  let heroResolved;
  const heroReady = new Promise((resolve) => { heroResolved = resolve; });
  const onHeroReady = () => heroResolved();
  window.addEventListener('portfolio:hero-ready', onHeroReady, { once: true });
  root.classList.add('is-loading');

  function removeOverlay() {
    overlay?.remove();
    root.classList.remove('intro-exiting');
  }

  function finish(immediate = false) {
    if (finished) {
      if (immediate) { clearTimeout(cleanupTimer); removeOverlay(); }
      return;
    }
    finished = true;
    clearTimeout(deadline);
    clearTimeout(minimumTimer);
    window.removeEventListener('portfolio:hero-ready', onHeroReady);
    content.forEach(([element, previous]) => { element.inert = previous; });
    root.classList.remove('is-loading');
    root.classList.add('site-entered');
    if (overlay?.contains(document.activeElement)) document.querySelector('.skip-link')?.focus({ preventScroll: true });
    if (immediate || reduced.matches || !overlay) {
      removeOverlay();
    } else {
      overlay.querySelector('.intro-status').textContent = 'Welcome';
      root.classList.add('intro-exiting');
      cleanupTimer = setTimeout(removeOverlay, 650);
    }
  }

  // No dependency, network connection, or failed WebGL scene can block entry.
  const deadline = setTimeout(() => finish(), 2400);
  document.addEventListener('DOMContentLoaded', () => {
    if (finished) return;
    overlay = document.querySelector('.page-intro');
    if (!overlay) { finish(true); return; }
    overlay.hidden = false;
    content = [...document.querySelectorAll('.skip-link, .site-header, main, footer')].map((element) => [element, element.inert]);
    content.forEach(([element]) => { element.inert = true; });
    overlay.querySelector('.intro-skip').addEventListener('click', () => finish());
    Promise.allSettled([document.fonts?.ready ?? Promise.resolve(), heroReady]).then(() => {
      if (finished) return;
      minimumTimer = setTimeout(() => finish(), Math.max(0, 700 - (performance.now() - started)));
    });
  }, { once: true });
  window.addEventListener('pageshow', (event) => { if (event.persisted) finish(true); });
  reduced.addEventListener('change', () => { if (reduced.matches) finish(true); });
})();
