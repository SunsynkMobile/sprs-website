/* =====================================================
   SUNSYNK REPORT PLATFORM - script.js
   ===================================================== */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.addEventListener('visibilitychange', () => {
  document.documentElement.classList.toggle('is-hidden', document.hidden);
});

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

/* ── Sticky nav ── */
const nav = document.querySelector('.nav');
const updateNav = () => nav && nav.classList.toggle('scrolled', window.scrollY > 20);

/* ── Active nav links ── */
const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
const sections = navLinks.map(l => {
  const id = l.getAttribute('href');
  return id && id.startsWith('#') ? document.getElementById(id.slice(1)) : null;
}).filter(Boolean);

function getAnchorOffset() {
  if (nav) return nav.offsetHeight + 12;
  const fromCss = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset'));
  return Number.isFinite(fromCss) ? fromCss : 80;
}

const updateActiveLinks = () => {
  const marker = getAnchorOffset() + 8;
  let cur = sections[0]?.id;
  sections.forEach(s => {
    if (s.getBoundingClientRect().top <= marker) cur = s.id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${cur}`));
};

/* ── Throttled scroll ── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { updateNav(); updateActiveLinks(); ticking = false; });
}, { passive: true });

updateNav(); updateActiveLinks();

/* ── Mobile nav ── */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

function setNavOpen(open) {
  if (!navToggle || !navMenu) return;
  navMenu.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('nav-open', open);
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    setNavOpen(!navMenu.classList.contains('open'));
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    setNavOpen(false);
  }));
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) setNavOpen(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setNavOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setNavOpen(false);
  });
}

/* ── Smooth in-page anchors ── */
function scrollToHash(hash, updateHistory) {
  if (!hash || hash === '#') return false;
  if (hash === '#top') {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    if (updateHistory) history.replaceState(null, '', location.pathname + location.search);
    return true;
  }
  const id = decodeURIComponent(hash.startsWith('#') ? hash.slice(1) : hash);
  if (!id) return false;
  const target = document.getElementById(id);
  if (!target) return false;

  const run = () => {
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - getAnchorOffset());
    window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    if (updateHistory) history.replaceState(null, '', `#${id}`);
    updateActiveLinks();
  };

  // Close mobile menu first so overflow/layout do not skew the scroll target
  if (document.body.classList.contains('nav-open')) {
    setNavOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(run));
  } else {
    run();
  }
  return true;
}

document.querySelectorAll('a[href^="#"]').forEach(el => {
  el.addEventListener('click', e => {
    const hash = el.getAttribute('href');
    if (!hash || hash === '#' || el.target === '_blank') return;
    if (scrollToHash(hash, true)) e.preventDefault();
  });
});

window.addEventListener('hashchange', () => {
  if (location.hash) scrollToHash(location.hash, false);
});

/* ── Hero fade-in (opacity cascade only) ── */
function initHeroFadeIn() {
  const items = document.querySelectorAll('.fade-in');
  if (reducedMotion) { items.forEach(i => i.classList.add('ready')); return; }
  items.forEach((el, idx) => {
    const delay = Number(el.dataset.delay || 0) + idx * 40;
    setTimeout(() => el.classList.add('ready'), delay);
  });
}

/* ── Quiet section accents (eyebrow underline only — no content hide) ── */
function initSectionInview() {
  const items = document.querySelectorAll('.section-header, .cta-body');
  if (!items.length) return;
  if (reducedMotion) { items.forEach(i => i.classList.add('inview')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('inview');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.12 });
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
  const animate = () => fills.forEach((f, i) => {
    setTimeout(() => { f.style.width = `${Number(f.dataset.val || 0)}%`; }, i * 50);
  });
  if (reducedMotion) {
    fills.forEach(f => { f.style.width = `${Number(f.dataset.val || 0)}%`; });
    return;
  }
  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    animate();
    io.disconnect();
  }, { threshold: 0.3 });
  const list = document.querySelector('.score-list') || fills[0];
  io.observe(list);
}

/* ── Health category bars ── */
function initHealthBars() {
  const panel = document.querySelector('.health-panel');
  const fills = document.querySelectorAll('.health-fill');
  if (!panel || !fills.length) return;
  const animate = () => fills.forEach((f, i) => {
    setTimeout(() => { f.style.width = `${Number(f.dataset.healthVal || 0)}%`; }, i * 50);
  });
  if (reducedMotion) {
    fills.forEach(f => { f.style.width = `${Number(f.dataset.healthVal || 0)}%`; });
    return;
  }
  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    animate();
    io.disconnect();
  }, { threshold: 0.28 });
  io.observe(panel);
}

/* ── CountUp ── */
function formatCountValue(value, { decimals, prefix, suffix, large }) {
  const rounded = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  const body = large && decimals === 0 ? Math.round(value).toLocaleString() : rounded;
  return `${prefix}${body}${suffix}`;
}

function countUp(el, target, duration) {
  const start = performance.now();
  const decimals = Number(el.dataset.decimals || 0);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const large = target > 999 && decimals === 0;
  const opts = { decimals, prefix, suffix, large };
  const overshoot = target === 0 ? 1 : 1.035;
  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    // Ease out, slight overshoot past midpoint, settle to target
    const rise = 1 - Math.pow(1 - Math.min(p / 0.82, 1), 3);
    const settle = p < 0.82 ? rise * overshoot : overshoot + (1 - overshoot) * ((p - 0.82) / 0.18);
    const v = target * Math.min(settle, overshoot);
    el.textContent = formatCountValue(p >= 1 ? target : v, opts);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = formatCountValue(target, opts);
  };
  requestAnimationFrame(tick);
}
function initCountUp() {
  const items = document.querySelectorAll('.countup');
  if (!items.length) return;
  if (reducedMotion) {
    items.forEach(el => {
      const t = Number(el.dataset.target || 0);
      el.textContent = formatCountValue(t, {
        decimals: Number(el.dataset.decimals || 0),
        prefix: el.dataset.prefix || '',
        suffix: el.dataset.suffix || '',
        large: t > 999
      });
    });
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-counting');
      countUp(el, Number(el.dataset.target || 0), 1600);
      io.unobserve(el);
    });
  }, { threshold: 0.45 });
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
  const chartHint = finePointer ? 'hover or drag' : 'tap or drag';
  distLive.textContent = `Live: ${chartHint} across bars to inspect distribution.`;
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
      distLive.textContent = `Live: ${chartHint} across bars to inspect distribution.`;
      hideTip();
    });
    bar.addEventListener('focus', () => {
      const r = bar.getBoundingClientRect();
      setActiveDistBar(bar, r.left + r.width / 2, r.top);
    });
    bar.addEventListener('blur', () => {
      if (distRow?.classList.contains('is-scrubbing')) return;
      bar.classList.remove('is-active');
      distLive.textContent = `Live: ${chartHint} across bars to inspect distribution.`;
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
      distLive.textContent = `Live: ${chartHint} across bars to inspect distribution.`;
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
      clipLive.textContent = `Live: ${chartHint} chart bars to inspect clipping windows.`;
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
      if (clipLive) clipLive.textContent = `Live: ${chartHint} chart bars to inspect clipping windows.`;
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
      if (clipLive) clipLive.textContent = `Live: ${chartHint} chart bars to inspect clipping windows.`;
      crosshair?.classList.remove('show');
      yLabel?.classList.remove('show');
    });
  }

  if (ringWrap && !reducedMotion) {
    ringWrap.classList.add('interactive');
    const canTilt = window.matchMedia('(hover: hover)').matches;
    if (canTilt) {
      ringWrap.addEventListener('pointermove', e => {
        const r = ringWrap.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width - 0.5) * 8;
        const ny = ((e.clientY - r.top) / r.height - 0.5) * 8;
        ringWrap.style.transform = `translate(${nx * 0.25}px, ${ny * 0.25}px)`;
      });
      ringWrap.addEventListener('pointerleave', () => { ringWrap.style.transform = ''; });
    } else {
      ringWrap.addEventListener('pointerdown', () => {
        ringWrap.classList.add('is-tapped');
        ringWrap.style.transform = 'scale(.97)';
      });
      const clearTap = () => {
        ringWrap.classList.remove('is-tapped');
        ringWrap.style.transform = '';
      };
      ringWrap.addEventListener('pointerup', clearTap);
      ringWrap.addEventListener('pointercancel', clearTap);
      ringWrap.addEventListener('pointerleave', clearTap);
    }
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


/* ── Shared motion helpers ── */
const MOTION_LERP = 0.16; // Apple-like settle (not too sticky, not laggy)

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function nearlyEqual(a, b, eps = 0.08) {
  return Math.abs(a - b) < eps;
}

/* ── Sitewide cursor glow (single RAF, transform-only) ── */
function initPointerAtmosphere() {
  if (reducedMotion || !finePointer) return;

  const glow = document.createElement('div');
  glow.className = 'pointer-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);
  document.body.classList.add('ix-pointer');

  const hero = document.querySelector('.hero');
  let x = window.innerWidth * 0.5;
  let y = window.innerHeight * 0.4;
  let tx = x;
  let ty = y;
  let scale = 1;
  let tScale = 1;
  let raf = 0;
  let pointing = false;
  let heroActive = false;

  const tick = () => {
    x = lerp(x, tx, MOTION_LERP);
    y = lerp(y, ty, MOTION_LERP);
    scale = lerp(scale, tScale, 0.12);
    glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;

    if (hero && heroActive) {
      const hx = ((tx - heroRect.left) / heroRect.width) * 100;
      const hy = ((ty - heroRect.top) / heroRect.height) * 100;
      if (Number.isFinite(hx) && Number.isFinite(hy)) {
        hero.style.setProperty('--hero-spot-x', hx.toFixed(1));
        hero.style.setProperty('--hero-spot-y', hy.toFixed(1));
      }
    }

    const settling = !nearlyEqual(x, tx) || !nearlyEqual(y, ty) || !nearlyEqual(scale, tScale, 0.004);
    if (settling) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
      glow.style.willChange = 'auto';
    }
  };

  const start = () => {
    glow.style.willChange = 'transform';
    if (!raf) raf = requestAnimationFrame(tick);
  };

  let heroRect = { left: 0, top: 0, width: 1, height: 1 };
  const refreshHeroRect = () => {
    if (!hero) return;
    heroRect = hero.getBoundingClientRect();
  };
  refreshHeroRect();
  window.addEventListener('resize', refreshHeroRect, { passive: true });
  window.addEventListener('scroll', () => {
    if (heroActive) refreshHeroRect();
  }, { passive: true });

  window.addEventListener('pointermove', e => {
    tx = e.clientX;
    ty = e.clientY;
    if (!pointing) {
      pointing = true;
      document.body.classList.add('is-pointing');
    }
    const overMedia = e.target instanceof Element && !!e.target.closest(
      'img, picture, figure, video, .hero-product, .hero-preview'
    );
    glow.classList.toggle('is-over-media', overMedia);
    if (hero) {
      const inside = e.target instanceof Element && (e.target === hero || hero.contains(e.target));
      if (inside && !heroActive) refreshHeroRect();
      heroActive = inside;
    }
    start();
  }, { passive: true });

  document.addEventListener('pointerover', e => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    tScale = t.closest('a, button, .btn, summary, [role="button"], .feature-tab, .pci') ? 1.35 : 1;
    start();
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    pointing = false;
    heroActive = false;
    tScale = 1;
    glow.classList.remove('is-over-media');
    document.body.classList.remove('is-pointing');
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      glow.style.willChange = 'auto';
    }
  });
}

/* ── Soft local spotlight (no 3D tilt — GPU-cheap) ── */
function initSurfaceMotion() {
  if (reducedMotion || !finePointer) return;
  const surfaces = document.querySelectorAll(
    '.pci, .metrics-item, .feature-panel, .health-panel'
  );

  surfaces.forEach(card => {
    card.classList.add('ix-spot');
    let sx = 50;
    let sy = 40;
    let tsx = 50;
    let tsy = 40;
    let raf = 0;
    let hovering = false;

    const tick = () => {
      sx = lerp(sx, tsx, 0.18);
      sy = lerp(sy, tsy, 0.18);
      card.style.setProperty('--spot-x', `${sx.toFixed(1)}%`);
      card.style.setProperty('--spot-y', `${sy.toFixed(1)}%`);
      if (hovering || !nearlyEqual(sx, tsx, 0.2) || !nearlyEqual(sy, tsy, 0.2)) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    card.addEventListener('pointerenter', () => {
      hovering = true;
      card.classList.add('is-lit');
    });

    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      if (!r.width || !r.height) return;
      tsx = ((e.clientX - r.left) / r.width) * 100;
      tsy = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      hovering = false;
      tsx = 50;
      tsy = 40;
      card.classList.remove('is-lit');
      if (!raf) raf = requestAnimationFrame(tick);
    });
  });
}

/* ── Magnetic primary CTAs only ── */
function initMagneticButtons() {
  if (reducedMotion || !finePointer) return;
  document.querySelectorAll('.hero-actions .btn, .section-cta .btn, .cta-actions .btn').forEach(btn => {
    btn.classList.add('magnetic');
    let raf = 0;
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;
    let hovering = false;

    const tick = () => {
      cx = lerp(cx, tx, MOTION_LERP);
      cy = lerp(cy, ty, MOTION_LERP);
      if (!btn.classList.contains('is-pressed')) {
        btn.style.transform = hovering
          ? `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`
          : '';
      }
      if (hovering || !nearlyEqual(cx, tx, 0.05) || !nearlyEqual(cy, ty, 0.05)) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        if (!hovering) btn.style.transform = '';
      }
    };

    btn.addEventListener('pointerenter', () => { hovering = true; });
    btn.addEventListener('pointermove', e => {
      if (btn.classList.contains('is-pressed')) return;
      const r = btn.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 6;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 4;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    btn.addEventListener('pointerleave', () => {
      hovering = false;
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  });
}

/* ── Pricing currency switcher ── */
const PRICING = {
  GBP: {
    label: 'British pounds',
    symbol: '£',
    plans: {
      starter: { amount: '2.99', unit: '£2.99', credits: '1 report credit', reports: '1 performance report' },
      classic: { amount: '7.49', unit: '£2.50', credits: '3 report credits', reports: '3 performance reports' },
      pro: { amount: '11.49', unit: '£1.92', credits: '6 report credits', reports: '6 performance reports' }
    }
  },
  ZAR: {
    label: 'South African rand',
    symbol: 'R\u00A0',
    plans: {
      starter: { amount: '69.99', unit: 'R\u00A069.99', credits: '1 report credit', reports: '1 performance report' },
      classic: { amount: '169.99', unit: 'R\u00A056.66', credits: '3 report credits', reports: '3 performance reports' },
      pro: { amount: '249.99', unit: 'R\u00A041.67', credits: '6 report credits', reports: '6 performance reports' }
    }
  },
  USD: {
    label: 'US dollars',
    symbol: '$',
    plans: {
      starter: { amount: '4.29', unit: '$4.29', credits: '1 report credit', reports: '1 performance report' },
      classic: { amount: '10.99', unit: '$3.66', credits: '3 report credits', reports: '3 performance reports' },
      pro: { amount: '15.99', unit: '$2.67', credits: '6 report credits', reports: '6 performance reports' }
    }
  }
};

function detectDefaultCurrency() {
  try {
    const saved = localStorage.getItem('sprs-currency');
    if (saved && PRICING[saved]) return saved;
  } catch (_) { /* ignore */ }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.startsWith('Africa/Johannesburg') || tz.startsWith('Africa/')) return 'ZAR';
    if (tz.startsWith('America/')) return 'USD';
  } catch (_) { /* ignore */ }
  try {
    const lang = (navigator.language || '').toUpperCase();
    if (lang.includes('ZA') || lang.endsWith('-ZA')) return 'ZAR';
    if (lang.includes('US') || lang.endsWith('-US')) return 'USD';
  } catch (_) { /* ignore */ }
  return 'GBP';
}

function applyPricingCurrency(code, animate) {
  const currency = PRICING[code] || PRICING.GBP;
  document.querySelectorAll('[data-plan]').forEach(card => {
    const planKey = card.getAttribute('data-plan');
    const plan = currency.plans[planKey];
    if (!plan) return;
    const symbol = card.querySelector('[data-price-symbol]');
    const amount = card.querySelector('[data-price-amount]');
    const unit = card.querySelector('[data-price-unit]');
    const credits = card.querySelector('[data-price-credits]');
    const reports = card.querySelector('[data-price-reports]');
    if (symbol) symbol.textContent = currency.symbol;
    if (amount) amount.textContent = plan.amount;
    if (unit) unit.textContent = plan.unit;
    if (credits) credits.textContent = plan.credits;
    if (reports) reports.textContent = plan.reports;
    if (animate && !reducedMotion) {
      [symbol, amount, unit, credits, reports].forEach((el, idx) => {
        if (!el) return;
        el.classList.remove('price-updating');
        void el.offsetWidth;
        el.style.animationDelay = `${idx * 30}ms`;
        el.classList.add('price-updating');
        el.addEventListener('animationend', () => {
          el.classList.remove('price-updating');
          el.style.animationDelay = '';
        }, { once: true });
      });
    }
  });
  document.querySelectorAll('[data-price-currency-label]').forEach(el => {
    el.textContent = currency.label;
  });

  const valuePanel = document.getElementById('value');
  if (valuePanel) {
    const starter = currency.plans.starter;
    if (starter) {
      valuePanel.querySelectorAll('[data-price-symbol]').forEach(el => { el.textContent = currency.symbol; });
      valuePanel.querySelectorAll('[data-price-amount]').forEach(el => { el.textContent = starter.amount; });
      valuePanel.querySelectorAll('[data-price-unit]').forEach(el => { el.textContent = starter.unit; });
      valuePanel.querySelectorAll('[data-value-per-credit]').forEach(el => { el.textContent = starter.unit; });
    }
    const compare = valuePanel.querySelector('[data-value-compare]');
    if (compare) compare.hidden = code !== 'GBP';
  }
}

function initPricingCurrency() {
  const select = document.getElementById('currencySelect');
  if (!select) return;
  let live = document.getElementById('currencyLive');
  if (!live) {
    live = document.createElement('p');
    live.id = 'currencyLive';
    live.className = 'sr-only';
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('aria-atomic', 'true');
    select.closest('.currency-picker')?.appendChild(live);
  }
  const initial = detectDefaultCurrency();
  select.value = initial;
  applyPricingCurrency(initial, false);
  select.addEventListener('change', () => {
    const code = select.value;
    applyPricingCurrency(code, true);
    const currency = PRICING[code] || PRICING.GBP;
    if (live) live.textContent = `Prices updated to ${currency.label}.`;
    if (!reducedMotion) {
      select.classList.remove('is-changing');
      void select.offsetWidth;
      select.classList.add('is-changing');
      select.addEventListener('animationend', () => select.classList.remove('is-changing'), { once: true });
    }
    try { localStorage.setItem('sprs-currency', code); } catch (_) { /* ignore */ }
  });
}

/* ── Button press + ripple feedback ── */
function initPressFeedback() {
  document.querySelectorAll('.btn').forEach(btn => {
    const release = () => {
      btn.classList.remove('is-pressed');
      if (!btn.matches(':hover')) btn.style.transform = '';
    };
    btn.addEventListener('pointerdown', e => {
      btn.classList.add('is-pressed');
      btn.style.transform = 'scale(.97)';
      if (reducedMotion || e.button !== 0) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointerleave', release);
    btn.addEventListener('pointercancel', release);
  });

  document.querySelectorAll('.sample-link, .cta-secondary-link, .footer nav a, .cookie-manage-link, .nav-brand, .faq-item summary, .inside-col, .trust-item, .actions-group, .price-card').forEach(el => {
    el.addEventListener('pointerdown', () => el.classList.add('is-pressed'));
    const clear = () => el.classList.remove('is-pressed');
    el.addEventListener('pointerup', clear);
    el.addEventListener('pointerleave', clear);
    el.addEventListener('pointercancel', clear);
  });
}

/* ── FAQ open feedback ── */
function initFaqFeedback() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const summary = item.querySelector('summary');
    if (summary) {
      summary.addEventListener('pointerdown', () => item.classList.add('is-pressing'));
      const clearPress = () => item.classList.remove('is-pressing');
      summary.addEventListener('pointerup', clearPress);
      summary.addEventListener('pointerleave', clearPress);
      summary.addEventListener('pointercancel', clearPress);
    }
    item.addEventListener('toggle', () => {
      if (!item.open || reducedMotion) return;
      const answer = item.querySelector('.faq-answer > *');
      if (!answer) return;
      answer.style.opacity = '0';
      answer.style.transform = 'translateY(-6px)';
      requestAnimationFrame(() => {
        answer.style.opacity = '';
        answer.style.transform = '';
      });
      item.animate?.(
        [{ transform: 'scale(0.995)' }, { transform: 'scale(1)' }],
        { duration: 320, easing: 'cubic-bezier(.25,.8,.25,1)' }
      );
    });
  });
}

/* ── Reactive health score pulse once counted ── */
function initHealthHotState() {
  const num = document.querySelector('.health-score-num');
  if (!num || reducedMotion) return;
  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    setTimeout(() => num.classList.add('is-hot'), 900);
    io.disconnect();
  }, { threshold: 0.6 });
  io.observe(num);
}

/* ── Currency select press feedback ── */
function initSelectFeedback() {
  const select = document.getElementById('currencySelect');
  if (!select) return;
  select.addEventListener('pointerdown', () => select.classList.add('is-pressed'));
  ['pointerup', 'pointerleave', 'blur', 'change'].forEach(evt => {
    select.addEventListener(evt, () => select.classList.remove('is-pressed'));
  });
}

/* ── Feature tabs (click + adaptive scroll scrub) ── */
function initFeatureTabs() {
  const root = document.querySelector('[data-feature-tabs]');
  const track = document.querySelector('[data-feature-scroll]');
  if (!root) return;
  const sticky = track?.querySelector('.feature-sticky');
  const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
  const progressFill = document.querySelector('[data-feature-progress]');
  if (!tabs.length || !panels.length) return;

  let activeIndex = Math.max(0, tabs.findIndex(t => t.getAttribute('aria-selected') === 'true'));
  let manualLockUntil = 0;
  let ticking = false;
  let scrubEnabled = false;

  function getViewHeight() {
    return (window.visualViewport && window.visualViewport.height) || window.innerHeight || 1;
  }

  function measureStickyContentHeight() {
    if (!sticky) return 0;
    const styles = getComputedStyle(sticky);
    const gap = parseFloat(styles.rowGap || styles.gap) || 0;
    const pad = (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0);
    const header = sticky.querySelector('.section-header');
    const tabsWrap = sticky.querySelector('.feature-tabs');
    if (!tabsWrap) return pad + (header?.offsetHeight || 0);

    const tabsStyles = getComputedStyle(tabsWrap);
    const tabsGap = parseFloat(tabsStyles.rowGap || tabsStyles.gap) || 0;
    const tablist = tabsWrap.querySelector('.feature-tablist');
    const activePanel = tabsWrap.querySelector('.feature-panel.is-active');

    // Buffer covers other chapters that may be slightly taller + progress bar
    const panelH = (activePanel?.offsetHeight || 0) + 48;
    const progressH = 8;
    const tabsH = (tablist?.offsetHeight || 0) + panelH + progressH + tabsGap * 2;

    return pad + (header?.offsetHeight || 0) + tabsH + gap;
  }

  function setScrubMode(enabled) {
    scrubEnabled = enabled;
    if (!track) return;
    track.classList.toggle('is-static', !enabled);
    track.dataset.featureMode = enabled ? 'scrub' : 'static';
  }

  function updateFeatureMode() {
    if (!track || !sticky || reducedMotion) {
      setScrubMode(false);
      return;
    }
    const contentH = measureStickyContentHeight();
    const available = getViewHeight() - getAnchorOffset() - 16;
    setScrubMode(contentH > 0 && contentH <= available);
  }

  function activateTab(tab, { focus = false, animate = true, syncProgress = true } = {}) {
    const nextIndex = tabs.indexOf(tab);
    if (nextIndex < 0) return;
    const changed = nextIndex !== activeIndex;
    activeIndex = nextIndex;

    tabs.forEach(t => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => {
      const match = panel.id === tab.getAttribute('aria-controls');
      panel.classList.toggle('is-active', match);
      if (match) {
        panel.removeAttribute('hidden');
        if (animate && changed && !reducedMotion) {
          panel.classList.remove('is-active');
          void panel.offsetWidth;
          panel.classList.add('is-active');
        }
      } else {
        panel.setAttribute('hidden', '');
      }
    });
    if (syncProgress && progressFill) {
      const pct = ((activeIndex + 1) / tabs.length) * 100;
      progressFill.style.width = `${pct}%`;
    }
    if (focus) tab.focus();
  }

  function activateIndex(index, opts) {
    const clamped = Math.max(0, Math.min(tabs.length - 1, index));
    activateTab(tabs[clamped], opts);
  }

  function syncFromScroll() {
    if (!track || !scrubEnabled || reducedMotion) return;
    if (Date.now() < manualLockUntil) return;

    const rect = track.getBoundingClientRect();
    const view = getViewHeight();
    const stickyOffset = getAnchorOffset();
    const travel = Math.max(1, rect.height - view + stickyOffset);
    const raw = (-rect.top + stickyOffset) / travel;
    const progress = Math.min(1, Math.max(0, raw));
    const count = tabs.length;
    const ideal = progress * count;

    // Hold each chapter longer; only switch after entering the next/prev segment
    let index = activeIndex;
    if (ideal >= activeIndex + 1.18) {
      index = Math.min(count - 1, Math.floor(ideal));
    } else if (ideal <= activeIndex - 0.18) {
      index = Math.max(0, Math.floor(ideal));
    }

    if (progressFill) {
      progressFill.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
    }
    if (index !== activeIndex) activateIndex(index, { animate: true, syncProgress: false });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      manualLockUntil = Date.now() + 1200;
      activateTab(tab);
      if (track && scrubEnabled && !reducedMotion) {
        const rect = track.getBoundingClientRect();
        const view = getViewHeight();
        const stickyOffset = getAnchorOffset();
        const travel = Math.max(1, rect.height - view + stickyOffset);
        const targetProgress = (tabs.indexOf(tab) + 0.55) / tabs.length;
        const top = window.scrollY + rect.top - stickyOffset + travel * targetProgress;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
    tab.addEventListener('keydown', e => {
      const i = tabs.indexOf(tab);
      let next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next < 0) return;
      e.preventDefault();
      manualLockUntil = Date.now() + 1200;
      activateTab(tabs[next], { focus: true });
    });
  });

  activateIndex(activeIndex, { animate: false });
  updateFeatureMode();

  if (track && !reducedMotion) {
    window.addEventListener('scroll', () => {
      if (!scrubEnabled) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        syncFromScroll();
        ticking = false;
      });
    }, { passive: true });

    let modeTick = 0;
    const onViewportChange = () => {
      if (modeTick) return;
      modeTick = requestAnimationFrame(() => {
        modeTick = 0;
        updateFeatureMode();
        if (scrubEnabled) syncFromScroll();
      });
    };
    window.addEventListener('resize', onViewportChange, { passive: true });
    window.addEventListener('orientationchange', onViewportChange, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onViewportChange, { passive: true });
    }
    // Fonts / late layout can change measured height
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => updateFeatureMode()).catch(() => {});
    }
    syncFromScroll();
    initFeatureScrollCue(track, () => scrubEnabled);
  }
}

/* ── “Scroll” ring around cursor during feature scrub ── */
function initFeatureScrollCue(track, isScrubEnabled) {
  if (!track || reducedMotion || !finePointer) return;

  const cue = document.createElement('div');
  cue.className = 'feature-scroll-cue';
  cue.setAttribute('aria-hidden', 'true');
  cue.innerHTML = `
    <div class="feature-scroll-cue__spin" aria-hidden="true">
      <svg viewBox="0 0 100 100" width="88" height="88">
        <defs>
          <path id="feature-scroll-cue-path" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" fill="none"></path>
        </defs>
        <text>
          <textPath href="#feature-scroll-cue-path" startOffset="0%">Scroll · Scroll · Scroll · </textPath>
        </text>
      </svg>
    </div>
  `;
  document.body.appendChild(cue);
  const spin = cue.querySelector('.feature-scroll-cue__spin');

  let x = -100;
  let y = -100;
  let tx = x;
  let ty = y;
  let angle = 0;
  let dir = 1; // 1 = clockwise (down), -1 = anti-clockwise (up)
  let lastScrollY = window.scrollY;
  let lastTs = 0;
  let raf = 0;
  let visible = false;
  const FOLLOW = 0.22;
  const DEG_PER_MS = 360 / 14000; // idle pace
  const DEG_PER_MS_ACTIVE = 360 / 7000; // faster while scrolling
  let boostUntil = 0;

  const tick = ts => {
    if (!lastTs) lastTs = ts;
    const dt = Math.min(33, ts - lastTs);
    lastTs = ts;

    if (visible) {
      const speed = ts < boostUntil ? DEG_PER_MS_ACTIVE : DEG_PER_MS;
      angle += speed * dt * dir;
      angle = ((angle % 360) + 360) % 360;
      spin.style.transform = `rotate(${angle.toFixed(2)}deg)`;
    }

    x = lerp(x, tx, FOLLOW);
    y = lerp(y, ty, FOLLOW);
    cue.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%)`;

    const settling = !nearlyEqual(x, tx, 0.15) || !nearlyEqual(y, ty, 0.15);
    if (settling || visible) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
      lastTs = 0;
    }
  };

  const start = () => {
    if (!raf) {
      lastTs = 0;
      raf = requestAnimationFrame(tick);
    }
  };

  const setVisible = on => {
    if (visible === on) return;
    visible = on;
    cue.classList.toggle('is-visible', on);
    if (on) start();
  };

  const insideTrack = target =>
    target instanceof Element && (target === track || track.contains(target));

  window.addEventListener('pointermove', e => {
    tx = e.clientX;
    ty = e.clientY;
    const show = isScrubEnabled() && insideTrack(e.target);
    setVisible(show);
    if (show) start();
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastScrollY + 0.5) dir = 1;
    else if (y < lastScrollY - 0.5) dir = -1;
    lastScrollY = y;
    if (visible && isScrubEnabled()) {
      boostUntil = performance.now() + 280;
      start();
    }
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    setVisible(false);
  });
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  initHeroFadeIn();
  initSectionInview();
  initRing();
  initScoreBars();
  initHealthBars();
  initCountUp();
  initFeatureTabs();
  initDistBars();
  initChartInteractions();
  initStepsLine();
  initStepLit();
  initPricingCurrency();
  initPressFeedback();
  initFaqFeedback();
  initHealthHotState();
  initSelectFeedback();
  initPointerAtmosphere();
  initSurfaceMotion();
  initMagneticButtons();
  if (location.hash) {
    // Defer so sticky nav height and fonts settle before measuring
    requestAnimationFrame(() => scrollToHash(location.hash, false));
  }
});
