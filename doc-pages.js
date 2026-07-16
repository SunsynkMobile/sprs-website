/* Shared behaviour for legal and documentation pages */
(function () {
  const backToTop = document.getElementById('backToTop');
  const nav = document.getElementById('nav');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 320);
    }, { passive: true });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  const mobileToc = document.getElementById('kbMobileToc') || document.getElementById('docMobileToc');
  if (mobileToc) {
    mobileToc.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileToc.open = false;
      });
    });
  }
})();
