(function () {
  var STORAGE_KEY = 'srp_cookie_consent';
  var CLARITY_ID = 'x3rw1l47ri';
  var CONSENT_VERSION = '2.0';

  var DEFAULT_OPTIONAL = {
    analytics: false,
    sessionReplay: false,
    diagnostics: false,
    productAnalytics: false,
    productSessionReplay: false
  };

  function emptyCategories(overrides) {
    return Object.assign({ necessary: true }, DEFAULT_OPTIONAL, overrides || {});
  }

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      // Backward compatibility with old string values.
      if (raw === 'accept' || raw === 'reject') {
        var accepted = raw === 'accept';
        return {
          version: CONSENT_VERSION,
          timestamp: new Date().toISOString(),
          source: 'legacy',
          categories: emptyCategories({
            analytics: accepted,
            sessionReplay: accepted
          })
        };
      }

      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.categories) return null;

      // Migrate v1 binary "analytics" (which gated Clarity) into sessionReplay.
      if (parsed.categories.sessionReplay === undefined && parsed.categories.analytics !== undefined) {
        parsed.categories.sessionReplay = !!parsed.categories.analytics;
      }

      parsed.categories = emptyCategories(parsed.categories);
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      return;
    }
  }

  function buildConsent(categories, source) {
    return {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      source: source || 'banner',
      categories: emptyCategories(categories)
    };
  }

  function acceptAllCategories() {
    return emptyCategories({
      analytics: true,
      sessionReplay: true,
      diagnostics: true,
      productAnalytics: true,
      productSessionReplay: true
    });
  }

  function rejectOptionalCategories() {
    return emptyCategories();
  }

  function isCurrentVersion(consent) {
    return !!(consent && consent.version === CONSENT_VERSION);
  }

  function hideBanner(banner) {
    if (!banner) return;
    banner.setAttribute('hidden', 'hidden');
  }

  function showBanner(banner) {
    if (!banner) return;
    banner.removeAttribute('hidden');
  }

  function buildBanner() {
    var banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.id = 'cookieBanner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.setAttribute('hidden', 'hidden');

    banner.innerHTML = '' +
      '<div class="cookie-banner__inner">' +
      '  <p class="cookie-banner__text">We use strictly necessary cookies to run and secure this site. With your permission, we would also like to use optional analytics and session-replay technologies. These may process identifiers and on-screen content. You can accept all, reject non-essential, or manage preferences. Accepting our Terms or Privacy Policy does not turn on optional cookies. Read our <a href="/cookie-policy/">Cookie Policy</a> and <a href="/privacy-policy/">Privacy Policy</a>.</p>' +
      '  <div class="cookie-banner__actions">' +
      '    <button type="button" class="cookie-btn" data-consent="reject">Reject non-essential</button>' +
      '    <button type="button" class="cookie-btn" data-consent="customise">Manage preferences</button>' +
      '    <button type="button" class="cookie-btn primary" data-consent="accept">Accept all</button>' +
      '  </div>' +
      '</div>';

    return banner;
  }

  function prefItem(id, title, description, locked) {
    if (locked) {
      return '' +
        '<div class="cookie-pref-item">' +
        '  <div>' +
        '    <h3>' + title + '</h3>' +
        '    <p>' + description + '</p>' +
        '  </div>' +
        '  <label class="cookie-switch" aria-label="' + title + ' enabled">' +
        '    <input type="checkbox" checked disabled />' +
        '    <span aria-hidden="true"></span>' +
        '  </label>' +
        '</div>';
    }

    return '' +
      '<div class="cookie-pref-item">' +
      '  <div>' +
      '    <h3>' + title + '</h3>' +
      '    <p>' + description + '</p>' +
      '  </div>' +
      '  <label class="cookie-switch" for="' + id + '">' +
      '    <input type="checkbox" id="' + id + '" aria-label="' + title + '" />' +
      '    <span aria-hidden="true"></span>' +
      '  </label>' +
      '</div>';
  }

  function buildModal() {
    var modal = document.createElement('div');
    modal.className = 'cookie-modal';
    modal.id = 'cookiePreferencesModal';
    modal.setAttribute('hidden', 'hidden');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'cookieModalTitle');

    modal.innerHTML = '' +
      '<div class="cookie-modal__backdrop" data-cookie-close="true"></div>' +
      '<div class="cookie-modal__panel" role="document">' +
      '  <button type="button" class="cookie-modal__close" aria-label="Close cookie preferences" data-cookie-close="true">&times;</button>' +
      '  <h2 class="cookie-modal__title" id="cookieModalTitle">Cookie preferences</h2>' +
      '  <p class="cookie-modal__intro">Choose which optional technologies to allow. Strictly necessary cookies are always on. Optional categories are off until you enable them. No optional boxes are pre-ticked. Accepting our Terms or Privacy Policy does not enable these options.</p>' +
      '  <div class="cookie-pref-list">' +
      prefItem(null, 'Strictly necessary', 'Authentication, security, consent storage and core functionality.', true) +
      prefItem('cookieAnalyticsToggle', 'Analytics (GA4)', 'Usage statistics and product events. May include device or transaction identifiers. Loads only when configured and consented.', false) +
      prefItem('cookieSessionReplayToggle', 'Session replay (Microsoft Clarity)', 'Session recordings, heatmaps and interaction data; may capture on-screen content.', false) +
      prefItem('cookieDiagnosticsToggle', 'Error monitoring (Sentry)', 'Diagnostic error reporting when configured on the Service.', false) +
      prefItem('cookieProductAnalyticsToggle', 'Product analytics (PostHog)', 'Product usage analytics when configured on the Service.', false) +
      prefItem('cookieProductReplayToggle', 'Product session replay (PostHog)', 'Product session recordings when configured on the Service.', false) +
      '  </div>' +
      '  <div class="cookie-modal__actions">' +
      '    <button type="button" class="cookie-btn" data-cookie-action="reject">Reject non-essential</button>' +
      '    <button type="button" class="cookie-btn" data-cookie-action="save">Save preferences</button>' +
      '    <button type="button" class="cookie-btn primary" data-cookie-action="accept">Accept all</button>' +
      '  </div>' +
      '</div>';

    return modal;
  }

  function loadClarity() {
    if (window.__srpClarityLoaded) return;
    window.__srpClarityLoaded = true;

    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.clarity.ms/tag/' + CLARITY_ID;
    var firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  var lastFocusBeforeModal = null;
  var removeFocusTrap = null;

  function getFocusable(container) {
    if (!container) return [];
    return Array.prototype.slice.call(container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (el) {
      return !el.hasAttribute('hidden') && el.offsetParent !== null;
    });
  }

  function trapFocus(modal) {
    var panel = modal.querySelector('.cookie-modal__panel') || modal;
    var focusable = getFocusable(panel);
    if (!focusable.length) return function () {};

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    first.focus();

    function onKeyDown(event) {
      if (event.key !== 'Tab') return;
      focusable = getFocusable(panel);
      if (!focusable.length) return;
      first = focusable[0];
      last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    modal.addEventListener('keydown', onKeyDown);
    return function () {
      modal.removeEventListener('keydown', onKeyDown);
    };
  }

  function readToggle(modal, id) {
    var el = modal.querySelector('#' + id);
    return !!(el && el.checked);
  }

  function setToggle(modal, id, value) {
    var el = modal.querySelector('#' + id);
    if (el) el.checked = !!value;
  }

  function syncToggles(modal, consent) {
    var cats = (consent && consent.categories) || emptyCategories();
    setToggle(modal, 'cookieAnalyticsToggle', cats.analytics);
    setToggle(modal, 'cookieSessionReplayToggle', cats.sessionReplay);
    setToggle(modal, 'cookieDiagnosticsToggle', cats.diagnostics);
    setToggle(modal, 'cookieProductAnalyticsToggle', cats.productAnalytics);
    setToggle(modal, 'cookieProductReplayToggle', cats.productSessionReplay);
  }

  function categoriesFromToggles(modal) {
    return emptyCategories({
      analytics: readToggle(modal, 'cookieAnalyticsToggle'),
      sessionReplay: readToggle(modal, 'cookieSessionReplayToggle'),
      diagnostics: readToggle(modal, 'cookieDiagnosticsToggle'),
      productAnalytics: readToggle(modal, 'cookieProductAnalyticsToggle'),
      productSessionReplay: readToggle(modal, 'cookieProductReplayToggle')
    });
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function openModal(modal, currentConsent) {
    if (!modal) return;
    syncToggles(modal, currentConsent);
    lastFocusBeforeModal = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.removeAttribute('hidden');
    document.body.classList.add('cookie-modal-open');
    // Force reflow so the enter transition runs from the closed state.
    void modal.offsetWidth;
    modal.classList.add('is-open');
    if (removeFocusTrap) removeFocusTrap();
    removeFocusTrap = trapFocus(modal);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('cookie-modal-open');
    if (removeFocusTrap) {
      removeFocusTrap();
      removeFocusTrap = null;
    }

    var finish = function () {
      modal.setAttribute('hidden', 'hidden');
      if (lastFocusBeforeModal && typeof lastFocusBeforeModal.focus === 'function') {
        lastFocusBeforeModal.focus();
      }
      lastFocusBeforeModal = null;
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    var panel = modal.querySelector('.cookie-modal__panel');
    var done = false;
    var complete = function () {
      if (done) return;
      done = true;
      finish();
    };
    if (panel) {
      panel.addEventListener('transitionend', complete, { once: true });
    }
    window.setTimeout(complete, 320);
  }

  function applyConsent(consent, banner, modal) {
    setConsent(consent);
    if (consent.categories.sessionReplay) {
      loadClarity();
    }
    // Analytics / Sentry / PostHog loaders belong in the app when those tools are configured.
    // This marketing site must not load them without dedicated, consent-gated integrations.
    hideBanner(banner);
    closeModal(modal);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var existing = getConsent();
    var banner = buildBanner();
    var modal = buildModal();
    document.body.appendChild(banner);
    document.body.appendChild(modal);

    window.openCookiePreferences = function () {
      openModal(modal, getConsent());
    };

    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;

      var manageButton = target.closest('[data-open-cookie-preferences="true"]');
      if (manageButton) {
        event.preventDefault();
        openModal(modal, getConsent());
      }
    });

    if (existing && isCurrentVersion(existing) && existing.categories) {
      if (existing.categories.sessionReplay) {
        loadClarity();
      }
    } else {
      // Missing consent or outdated consent version → re-prompt (PECR material change / granularity).
      showBanner(banner);
    }

    banner.addEventListener('click', function (event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;
      var value = target.getAttribute('data-consent');
      if (!value) return;

      if (value === 'customise') {
        openModal(modal, getConsent());
        return;
      }

      if (value === 'accept') {
        applyConsent(buildConsent(acceptAllCategories(), 'banner'), banner, modal);
      } else if (value === 'reject') {
        applyConsent(buildConsent(rejectOptionalCategories(), 'banner'), banner, modal);
      }
    });

    modal.addEventListener('click', function (event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.closest('[data-cookie-close="true"]')) {
        closeModal(modal);
        return;
      }

      var action = target.getAttribute('data-cookie-action');
      if (!action) return;

      if (action === 'accept') {
        applyConsent(buildConsent(acceptAllCategories(), 'preferences-modal'), banner, modal);
        return;
      }

      if (action === 'reject') {
        applyConsent(buildConsent(rejectOptionalCategories(), 'preferences-modal'), banner, modal);
        return;
      }

      if (action === 'save') {
        applyConsent(buildConsent(categoriesFromToggles(modal), 'preferences-modal'), banner, modal);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
        closeModal(modal);
      }
    });
  });
})();
