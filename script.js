const siteHeader = document.querySelector('.site-header');
const scrollProgress = document.querySelector('.scroll-progress');
const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');
const navLinks = primaryNav ? Array.from(primaryNav.querySelectorAll('a')) : [];
const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const sections = navLinks
  .map((link) => {
    const id = link.getAttribute('href');
    return id ? document.querySelector(id) : null;
  })
  .filter(Boolean);

const parallaxNodes = shouldReduceMotion
  ? []
  : Array.from(document.querySelectorAll('.parallax-node'));

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;

    if (!primaryNav.contains(target) && !menuToggle.contains(target)) {
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const updateActiveNav = () => {
  if (sections.length === 0) return;

  const offset = window.scrollY + 140;
  let currentSectionId = sections[0].id;
  sections.forEach((section) => {
    if (section.offsetTop <= offset) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${currentSectionId}`);
  });
};

const updateScrollUI = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
  }

  if (siteHeader) {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 16);
  }
};

const updateParallax = () => {
  if (parallaxNodes.length === 0) return;

  const y = window.scrollY;
  parallaxNodes.forEach((node) => {
    const speed = Number(node.getAttribute('data-parallax-speed') || 12);
    const shift = Math.min(y / speed, 20);
    node.style.transform = `translate3d(0, ${shift}px, 0)`;
  });
};

let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;

  window.requestAnimationFrame(() => {
    updateActiveNav();
    updateScrollUI();
    updateParallax();
    ticking = false;
  });
};

updateActiveNav();
updateScrollUI();
updateParallax();
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);

const revealItems = Array.from(document.querySelectorAll('.reveal-up'));

if (shouldReduceMotion) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const delay = Number(entry.target.getAttribute('data-reveal-delay') || 0);
        window.setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);

        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.1,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const supportsHover = window.matchMedia('(hover: hover)').matches;
const tiltTargets = Array.from(
  document.querySelectorAll('.feature-card, .impact-card, .insight-card, .testimonial, .process-step, .audience-card')
);

if (!shouldReduceMotion && supportsHover) {
  tiltTargets.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;

      card.style.transform = `translateY(-4px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

document.querySelectorAll('.btn, .text-link').forEach((el) => {
  el.addEventListener('click', () => {
    const label = el.textContent ? el.textContent.trim() : 'cta';
    el.setAttribute('data-last-clicked', label);
  });
});
