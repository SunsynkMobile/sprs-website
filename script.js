/* =====================================================
   SUNSYNK REPORT PLATFORM — script.js
   ===================================================== */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Scroll progress ── */
const scrollBar = document.querySelector('.scroll-bar');
const updateScrollBar = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollBar) scrollBar.style.width = max > 0 ? `${Math.min((window.scrollY / max) * 100, 100)}%` : '0%';
};

/* ── Sticky nav ── */
const nav = document.querySelector('.nav');
const updateNav = () => nav && nav.classList.toggle('scrolled', window.scrollY > 20);

/* ── Active nav links ── */
const navLinks = Array.from(document.querySelectorAll('.nav-menu a'));
const sections = navLinks.map(l => {
  const id = l.getAttribute('href');
  return id && id.startsWith('#') ? document.getElementById(id.slice(1)) : null;
}).filter(Boolean);

const updateActiveLinks = () => {
  const offset = window.scrollY + 110;
  let cur = sections[0]?.id;
  sections.forEach(s => { if (s.offsetTop <= offset) cur = s.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${cur}`));
};

/* ── Throttled scroll ── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { updateScrollBar(); updateNav(); updateActiveLinks(); ticking = false; });
}, { passive: true });

updateScrollBar(); updateNav(); updateActiveLinks();

/* ── Mobile nav ── */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) { navMenu.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); }
  });
}

/* ── Scroll to top ── */
document.querySelectorAll('[href="#top"]').forEach(el => el.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  history.replaceState(null, '', location.pathname + location.search);
}));

/* ── Hero fade-in ── */
function initHeroFadeIn() {
  const items = document.querySelectorAll('.fade-in');
  if (reducedMotion) { items.forEach(i => i.classList.add('ready')); return; }
  items.forEach((el, idx) => {
    const delay = Number(el.dataset.delay || 0) + idx * 50;
    setTimeout(() => el.classList.add('ready'), delay);
  });
}

/* ── Reveal on scroll ── */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (reducedMotion) { items.forEach(i => i.classList.add('visible')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(i => io.observe(i));
}

/* ── SVG score ring ── */
function initRing() {
  const ring = document.querySelector('.ring-progress');
  if (!ring) return;
  const target = Number(ring.dataset.targetOffset || 0);
  if (reducedMotion) { ring.style.strokeDashoffset = target; return; }
  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    requestAnimationFrame(() => { ring.style.strokeDashoffset = target; });
    io.disconnect();
  }, { threshold: 0.3 });
  const container = document.querySelector('.score-card') || ring;
  io.observe(container);
}

/* ── Score bars ── */
function initScoreBars() {
  const fills = document.querySelectorAll('.score-fill');
  if (!fills.length) return;
  const animate = () => fills.forEach(f => { f.style.width = `${Number(f.dataset.val || 0)}%`; });
  if (reducedMotion) { animate(); return; }
  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    setTimeout(animate, 320);
    io.disconnect();
  }, { threshold: 0.3 });
  const list = document.querySelector('.score-list') || fills[0];
  io.observe(list);
}

/* ── CountUp ── */
function countUp(el, target, duration) {
  const start = performance.now();
  const large = target > 999;
  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    const v = Math.round((1 - Math.pow(1 - p, 3)) * target);
    el.textContent = large ? v.toLocaleString() : String(v);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
function initCountUp() {
  const items = document.querySelectorAll('.countup');
  if (!items.length) return;
  if (reducedMotion) {
    items.forEach(el => { const t = Number(el.dataset.target || 0); el.textContent = t > 999 ? t.toLocaleString() : String(t); });
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      countUp(entry.target, Number(entry.target.dataset.target || 0), 1600);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  items.forEach(el => io.observe(el));
}

/* ── Benchmark distribution bars ── */
function initDistBars() {
  const bars = document.querySelectorAll('.db');
  if (!bars.length) return;
  bars.forEach(bar => { bar.style.setProperty('--bh', String(Number(bar.dataset.h || 0) * 1.18)); });
  if (reducedMotion) { bars.forEach(b => b.classList.add('anim')); return; }
  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    bars.forEach((bar, i) => setTimeout(() => bar.classList.add('anim'), i * 65));
    io.disconnect();
  }, { threshold: 0.2 });
  const container = document.querySelector('.dist-bars-row');
  if (container) io.observe(container);
}

/* ── Steps line ── */
function initStepsLine() {
  const fill = document.querySelector('.steps-line-fill');
  if (!fill) return;
  if (reducedMotion) { fill.style.width = '100%'; return; }
  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    fill.style.width = '100%';
    io.disconnect();
  }, { threshold: 0.3 });
  const steps = document.querySelector('.steps-wrap');
  if (steps) io.observe(steps);
}

/* ── Lit step numbers ── */
function initStepLit() {
  const steps = document.querySelectorAll('.step');
  if (reducedMotion) { steps.forEach(s => s.classList.add('lit')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('lit');
    });
  }, { threshold: 0.5 });
  steps.forEach(s => io.observe(s));
}

/* ── Subtle card tilt ── */
function initTilt() {
  if (reducedMotion || !window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.feat-card,.insight,.tq,.pci,.audience-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-y * 2.5}deg) rotateY(${x * 2.5}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  initHeroFadeIn();
  initReveal();
  initRing();
  initScoreBars();
  initCountUp();
  initDistBars();
  initStepsLine();
  initStepLit();
  initTilt();
});
