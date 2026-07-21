/* =====================================================
   SUNSYNK REPORT PLATFORM - script.js
   ===================================================== */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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

/* ── Health category bars ── */
function initHealthBars() {
  const panel = document.querySelector('.health-panel');
  const fills = document.querySelectorAll('.health-fill');
  if (!panel || !fills.length) return;
  const animate = () => fills.forEach(f => { f.style.width = `${Number(f.dataset.healthVal || 0)}%`; });
  if (reducedMotion) { animate(); return; }
  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    setTimeout(animate, 180);
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
  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    const v = target * eased;
    el.textContent = formatCountValue(v, opts);
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
      countUp(el, Number(el.dataset.target || 0), 1800);
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


/* ── Sitewide cursor atmosphere ── */
function initPointerAtmosphere() {
  if (reducedMotion || !finePointer) return;
  document.body.classList.add('ix-pointer');
  let x = window.innerWidth * 0.5;
  let y = window.innerHeight * 0.4;
  let tx = x;
  let ty = y;
  let raf = 0;
  let pointing = false;

  const tick = () => {
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    document.documentElement.style.setProperty('--pointer-x', `${x}px`);
    document.documentElement.style.setProperty('--pointer-y', `${y}px`);
    if (Math.abs(tx - x) > 0.15 || Math.abs(ty - y) > 0.15) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  };

  window.addEventListener('pointermove', e => {
    tx = e.clientX;
    ty = e.clientY;
    if (!pointing) {
      pointing = true;
      document.body.classList.add('is-pointing');
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    pointing = false;
    document.body.classList.remove('is-pointing');
  });
}

/* ── Surface tilt + local spotlight ── */
function initSurfaceMotion() {
  if (reducedMotion || !finePointer) return;
  const surfaces = document.querySelectorAll(
    '.insight, .pci, .hero-window, .health-panel, .savings-panel, .trust-panel, .inside-grid, .actions-board, .sample-panel, .faq-item, .ix-interactive'
  );

  surfaces.forEach(card => {
    card.classList.add('ix-tilt', 'ix-spot');
    const strength = card.classList.contains('pci') || card.classList.contains('hero-product')
      ? 2.4
      : card.classList.contains('metrics-item')
        ? 0
        : card.classList.contains('faq-item')
          ? 0.9
          : 1.4;
    const lift = card.classList.contains('pci') || card.classList.contains('hero-product') ? -3 : -1.5;
    let sx = 50;
    let sy = 40;
    let tsx = 50;
    let tsy = 40;
    let raf = 0;
    let hovering = false;

    const tick = () => {
      rx += (tx - rx) * 0.12;
      ry += (ty - ry) * 0.12;
      rz += (tz - rz) * 0.12;
      sx += (tsx - sx) * 0.14;
      sy += (tsy - sy) * 0.14;
      card.style.setProperty('--spot-x', `${sx.toFixed(2)}%`);
      card.style.setProperty('--spot-y', `${sy.toFixed(2)}%`);
      if (strength > 0) {
        card.style.transform = `perspective(1200px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) translateY(${rz.toFixed(3)}px)`;
      }
      const moving = Math.abs(tx - rx) > 0.02 || Math.abs(ty - ry) > 0.02 || Math.abs(tz - rz) > 0.02 || Math.abs(tsx - sx) > 0.05 || Math.abs(tsy - sy) > 0.05;
      if (hovering || moving) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        if (!hovering) card.style.transform = '';
      }
    };

    card.addEventListener('pointermove', e => {
      if (card.classList.contains('is-pressed')) return;
      const r = card.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width);
      const py = ((e.clientY - r.top) / r.height);
      const x = px - 0.5;
      const y = py - 0.5;
      tsx = px * 100;
      tsy = py * 100;
      card.classList.add('is-lit', 'is-tracking');
      hovering = true;
      if (strength > 0) {
        tx = -y * strength;
        ty = x * strength;
        tz = lift;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    });

    card.addEventListener('pointerleave', () => {
      hovering = false;
      tx = 0;
      ty = 0;
      tz = 0;
      card.classList.remove('is-lit', 'is-tracking');
      if (!raf) raf = requestAnimationFrame(tick);
    });
  });
}

/* ── Hero cursor spotlight ── */
function initHeroCursor() {
  if (reducedMotion || !finePointer) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    hero.style.setProperty('--hero-spot-x', x.toFixed(1));
    hero.style.setProperty('--hero-spot-y', y.toFixed(1));
  }, { passive: true });
}

/* ── Magnetic buttons ── */
function initMagneticButtons() {
  if (reducedMotion || !finePointer) return;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.classList.add('magnetic');
    let raf = 0;
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;
    let hovering = false;

    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      if (!btn.classList.contains('is-pressed')) {
        btn.style.transform = hovering
          ? `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px) translateY(-2px)`
          : '';
      }
      if (hovering && (Math.abs(tx - cx) > 0.04 || Math.abs(ty - cy) > 0.04)) {
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
      tx = ((e.clientX - r.left) / r.width - 0.5) * 10;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 8;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    btn.addEventListener('pointerleave', () => {
      hovering = false;
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  });
}

/* ── Soft hero scroll drift + section parallax ── */
function initScrollDrift() {
  if (reducedMotion) return;
  const preview = document.querySelector('.hero-preview');
  const parallaxNodes = Array.from(document.querySelectorAll('.section-header, .cta-body, .assumptions-note, .feature-tabs, .metrics-grid'));
  let ticking = false;
  const update = () => {
    const y = Math.max(window.scrollY, 0);
    if (preview) {
      const drift = Math.min(y, 420) * 0.045;
      preview.style.setProperty('--drift-y', `${drift.toFixed(1)}px`);
    }
    parallaxNodes.forEach((node, i) => {
      const rect = node.getBoundingClientRect();
      const mid = rect.top + rect.height * 0.5 - window.innerHeight * 0.5;
      const shift = Math.max(-10, Math.min(10, -mid * 0.022 * (i % 2 === 0 ? 1 : 0.7)));
      node.style.setProperty('--parallax-y', `${shift.toFixed(2)}px`);
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
}

/* ── Image/icon micro-react on steps & tags ── */
function initHoverLiftExtras() {
  if (reducedMotion || !finePointer) return;
  document.querySelectorAll('.trust-item, .inside-col, .actions-group, .step, .metrics-item').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 4;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 3;
      el.style.setProperty('--lift-x', `${x.toFixed(2)}px`);
      el.style.setProperty('--lift-y', `${y.toFixed(2)}px`);
      el.classList.add('is-tracking');
    });
    el.addEventListener('pointerleave', () => {
      el.style.removeProperty('--lift-x');
      el.style.removeProperty('--lift-y');
      el.classList.remove('is-tracking');
    });
  });
}

/* ── Magnetic nav links ── */
function initMagneticNav() {
  if (reducedMotion || !finePointer) return;
  document.querySelectorAll('.nav-menu a:not(.btn)').forEach(link => {
    link.addEventListener('pointermove', e => {
      const r = link.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 4;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 3;
      link.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
    link.addEventListener('pointerleave', () => { link.style.transform = ''; });
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

/* ── Parallax-lite on hero score ring ── */
function initHeroReact() {
  const wrap = document.querySelector('.hero-score .ring-wrap');
  const issue = document.querySelector('.hero-score .exec-issue');
  if (!wrap || reducedMotion || !window.matchMedia('(hover: hover)').matches) return;
  const windowEl = document.querySelector('.hero-window');
  if (!windowEl) return;
  windowEl.addEventListener('pointermove', e => {
    const r = windowEl.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    wrap.style.transform = `translate(${x * 8}px, ${y * 6}px)`;
    if (issue) issue.style.transform = `translate(${x * -4}px, ${y * -3}px)`;
  });
  windowEl.addEventListener('pointerleave', () => {
    wrap.style.transform = '';
    if (issue) issue.style.transform = '';
  });
}

/* ── Feature tabs (click + scroll-driven) ── */
function initFeatureTabs() {
  const root = document.querySelector('[data-feature-tabs]');
  const track = document.querySelector('[data-feature-scroll]');
  if (!root) return;
  const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
  const progressFill = document.querySelector('[data-feature-progress]');
  if (!tabs.length || !panels.length) return;

  let activeIndex = Math.max(0, tabs.findIndex(t => t.getAttribute('aria-selected') === 'true'));
  let manualLockUntil = 0;
  let ticking = false;

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
    if (!track || reducedMotion) return;
    if (Date.now() < manualLockUntil) return;

    const rect = track.getBoundingClientRect();
    const view = window.innerHeight || 1;
    const stickyOffset = getAnchorOffset();
    const travel = Math.max(1, rect.height - view + stickyOffset);
    const raw = (-rect.top + stickyOffset) / travel;
    const progress = Math.min(1, Math.max(0, raw));
    const index = Math.min(tabs.length - 1, Math.floor(progress * tabs.length + 1e-6));

    if (progressFill) {
      progressFill.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
    }
    if (index !== activeIndex) activateIndex(index, { animate: true, syncProgress: false });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      manualLockUntil = Date.now() + 1200;
      activateTab(tab);
      if (track && !reducedMotion) {
        const rect = track.getBoundingClientRect();
        const view = window.innerHeight || 1;
        const stickyOffset = getAnchorOffset();
        const travel = Math.max(1, rect.height - view + stickyOffset);
        const targetProgress = (tabs.indexOf(tab) + 0.35) / tabs.length;
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

  if (track && !reducedMotion) {
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        syncFromScroll();
        ticking = false;
      });
    }, { passive: true });
    window.addEventListener('resize', syncFromScroll, { passive: true });
    syncFromScroll();
  }
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  initHeroFadeIn();
  initReveal();
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
  initHeroCursor();
  initSurfaceMotion();
  initMagneticButtons();
  initMagneticNav();
  initHoverLiftExtras();
  initScrollDrift();
  if (location.hash) {
    // Defer so sticky nav height and fonts settle before measuring
    requestAnimationFrame(() => scrollToHash(location.hash, false));
  }
});
