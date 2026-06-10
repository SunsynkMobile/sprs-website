/* =====================================================
   SUNSYNK REPORT PLATFORM — script.js
   ===================================================== */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Page Loader ── */
const pageLoader = document.getElementById('pageLoader');
const hidePageLoader = () => {
  if (pageLoader) {
    pageLoader.classList.add('hidden');
    setTimeout(() => pageLoader.remove(), 500);
  }
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hidePageLoader);
} else {
  hidePageLoader();
}
window.addEventListener('load', hidePageLoader);

/* ── Scroll progress ── */
const scrollBar = document.querySelector('.scroll-bar');
const updateScrollBar = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? Math.min((window.scrollY / max) * 100, 100) : 0;
  if (scrollBar) scrollBar.style.width = `${pct}%`;
  document.documentElement.style.setProperty('--scroll-pct', `${pct}`);
  document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}`);
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
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }));
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    }
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

/* ── Rich chart interactions (tooltips, hover/focus states) ── */
function initChartInteractions() {
  const distBars = Array.from(document.querySelectorAll('.dist-bars-row .db'));
  const distRow = document.querySelector('.dist-bars-row');
  const distLegend = document.querySelector('.dist-legend');
  const clipChart = document.querySelector('.clip-chart');
  const clipBars = Array.from(document.querySelectorAll('.clip-bar'));
  const ringWrap = document.querySelector('.ring-wrap');

  if (!distBars.length && !clipBars.length && !ringWrap) return;

  const tip = document.createElement('div');
  tip.className = 'chart-tooltip';
  tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);

  const showTip = (x, y, title, value) => {
    tip.innerHTML = `<strong>${title}</strong>${value}`;
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
    tip.classList.add('show');
  };
  const moveTip = (x, y) => {
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
  };
  const hideTip = () => tip.classList.remove('show');

  const distLive = document.createElement('p');
  distLive.className = 'dist-live-legend';
  distLive.textContent = 'Live: hover or drag across bars to inspect distribution.';
  if (distLegend?.parentElement) distLegend.parentElement.appendChild(distLive);

  const setActiveDistBar = (activeBar, x, y) => {
    distBars.forEach(b => b.classList.toggle('is-active', b === activeBar));
    if (!activeBar) return;
    const range = activeBar.querySelector('span')?.textContent?.trim() || 'Range';
    const score = Number(activeBar.dataset.h || 0);
    const percentile = Math.min(Math.round(score), 100);
    distLive.textContent = `Live: ${range} -> ${percentile}% comparative density.`;
    showTip(x, y, range, `${percentile}% comparative density`);
  };

  distBars.forEach(bar => {
    bar.tabIndex = 0;
    bar.addEventListener('pointerenter', e => setActiveDistBar(bar, e.clientX, e.clientY));
    bar.addEventListener('pointermove', e => moveTip(e.clientX, e.clientY));
    bar.addEventListener('pointerleave', () => {
      if (distRow?.classList.contains('is-scrubbing')) return;
      bar.classList.remove('is-active');
      distLive.textContent = 'Live: hover or drag across bars to inspect distribution.';
      hideTip();
    });
    bar.addEventListener('focus', () => {
      const r = bar.getBoundingClientRect();
      setActiveDistBar(bar, r.left + r.width / 2, r.top);
    });
    bar.addEventListener('blur', () => {
      if (distRow?.classList.contains('is-scrubbing')) return;
      bar.classList.remove('is-active');
      distLive.textContent = 'Live: hover or drag across bars to inspect distribution.';
      hideTip();
    });
  });

  if (distRow) {
    const getNearestDistBar = clientX => {
      let nearest = null;
      let nearestDist = Infinity;
      distBars.forEach(bar => {
        const r = bar.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const d = Math.abs(cx - clientX);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = bar;
        }
      });
      return nearest;
    };

    const scrubUpdate = e => {
      if (!distRow.classList.contains('is-scrubbing')) return;
      const bar = getNearestDistBar(e.clientX);
      if (!bar) return;
      setActiveDistBar(bar, e.clientX, e.clientY);
    };

    distRow.addEventListener('pointerdown', e => {
      distRow.classList.add('is-scrubbing');
      distRow.setPointerCapture(e.pointerId);
      scrubUpdate(e);
    });
    distRow.addEventListener('pointermove', scrubUpdate);
    const endScrub = () => {
      distRow.classList.remove('is-scrubbing');
      hideTip();
    };
    distRow.addEventListener('pointerup', endScrub);
    distRow.addEventListener('pointercancel', endScrub);
    distRow.addEventListener('pointerleave', () => {
      if (distRow.classList.contains('is-scrubbing')) return;
      hideTip();
      distBars.forEach(b => b.classList.remove('is-active'));
      distLive.textContent = 'Live: hover or drag across bars to inspect distribution.';
    });
  }

  const clipSlots = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
  const clipIntensity = [42, 58, 86, 88, 83, 66, 47];

  let clipLive = null;
  if (clipChart?.closest('.feat-card')) {
    const target = clipChart.closest('.feat-card').querySelector('.feat-body');
    if (target) {
      clipLive = document.createElement('p');
      clipLive.className = 'clip-live-legend';
      clipLive.textContent = 'Live: hover chart bars to inspect clipping windows.';
      target.appendChild(clipLive);
    }
  }

  let crosshair = null;
  let yLabel = null;
  if (clipChart) {
    crosshair = document.createElement('div');
    crosshair.className = 'clip-crosshair';
    yLabel = document.createElement('div');
    yLabel.className = 'clip-y-label';
    clipChart.appendChild(crosshair);
    clipChart.appendChild(yLabel);
  }

  const setActiveClipBar = (bar, clientX, clientY) => {
    clipBars.forEach(b => b.classList.toggle('is-active', b === bar));
    if (!bar) return;
    const i = clipBars.indexOf(bar);
    const time = clipSlots[i] || `Slot ${i + 1}`;
    const intensity = clipIntensity[i] || 50;
    showTip(clientX, clientY, `Inverter Window ${time}`, `${intensity}% clipping risk`);
    if (clipLive) clipLive.textContent = `Live: ${time} -> ${intensity}% clipping risk.`;

    if (clipChart && crosshair && yLabel) {
      const chartRect = clipChart.getBoundingClientRect();
      const barRect = bar.getBoundingClientRect();
      const x = barRect.left + barRect.width / 2 - chartRect.left;
      const y = Math.max(6, barRect.top - chartRect.top - 8);
      crosshair.style.left = `${x}px`;
      crosshair.classList.add('show');
      yLabel.textContent = `${intensity}%`;
      yLabel.style.left = `${x}px`;
      yLabel.style.top = `${y}px`;
      yLabel.classList.add('show');
    }
  };

  clipBars.forEach((bar, i) => {
    bar.style.cursor = 'pointer';
    bar.addEventListener('pointerenter', e => setActiveClipBar(bar, e.clientX, e.clientY));
    bar.addEventListener('pointermove', e => moveTip(e.clientX, e.clientY));
    bar.addEventListener('pointerleave', () => {
      bar.classList.remove('is-active');
      hideTip();
      if (clipLive) clipLive.textContent = 'Live: hover chart bars to inspect clipping windows.';
      crosshair?.classList.remove('show');
      yLabel?.classList.remove('show');
    });
    bar.setAttribute('aria-label', `Clipping window ${clipSlots[i] || i + 1}`);
  });

  if (clipChart) {
    clipChart.addEventListener('pointermove', e => {
      if (!clipBars.length) return;
      const chartRect = clipChart.getBoundingClientRect();
      const localX = e.clientX - chartRect.left;
      let nearest = clipBars[0];
      let nearestDist = Infinity;
      clipBars.forEach(bar => {
        const r = bar.getBoundingClientRect();
        const cx = r.left + r.width / 2 - chartRect.left;
        const d = Math.abs(cx - localX);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = bar;
        }
      });
      setActiveClipBar(nearest, e.clientX, e.clientY);
    });
    clipChart.addEventListener('pointerleave', () => {
      hideTip();
      clipBars.forEach(b => b.classList.remove('is-active'));
      if (clipLive) clipLive.textContent = 'Live: hover chart bars to inspect clipping windows.';
      crosshair?.classList.remove('show');
      yLabel?.classList.remove('show');
    });
  }

  if (ringWrap && !reducedMotion && window.matchMedia('(hover: hover)').matches) {
    ringWrap.classList.add('interactive');
    ringWrap.addEventListener('pointermove', e => {
      const r = ringWrap.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 8;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 8;
      ringWrap.style.transform = `translate(${nx * 0.25}px, ${ny * 0.25}px)`;
    });
    ringWrap.addEventListener('pointerleave', () => { ringWrap.style.transform = ''; });
  }
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
      card.style.transform = `perspective(900px) rotateX(${-y * 1.25}deg) rotateY(${x * 1.25}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

/* ── Magnetic buttons ── */
function initMagneticButtons() {
  if (reducedMotion || !window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 6;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
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
  initChartInteractions();
  initStepsLine();
  initStepLit();
  initTilt();
  initMagneticButtons();
});
