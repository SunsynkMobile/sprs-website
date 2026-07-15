(function () {
  var STORAGE_KEY = 'srp_cookie_consent';
  var CLARITY_ID = 'x3rw1l47ri';
  var CONSENT_VERSION = '1.0';

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      // Backward compatibility with old string values.
      if (raw === 'accept' || raw === 'reject') {
        return {
          version: CONSENT_VERSION,
          timestamp: new Date().toISOString(),
          source: 'legacy',
          categories: {
            necessary: true,
            analytics: raw === 'accept'
          }
        };
      }

      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.categories) return null;
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

  function buildConsent(analyticsEnabled, source) {
    return {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      source: source || 'banner',
      categories: {
        necessary: true,
        analytics: !!analyticsEnabled
      }
    };
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
      '  <p class="cookie-banner__text">We use cookies to improve site performance and understand usage patterns. You can accept analytics cookies or reject non-essential cookies. Read our <a href="/cookie-policy/">Cookie policy</a>.</p>' +
      '  <div class="cookie-banner__actions">' +
      '    <button type="button" class="cookie-btn" data-consent="customise">Customise</button>' +
      '    <button type="button" class="cookie-btn" data-consent="reject">Reject non-essential</button>' +
      '    <button type="button" class="cookie-btn primary" data-consent="accept">Accept all</button>' +
      '  </div>' +
      '</div>';

    return banner;
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
      '  <p class="cookie-modal__intro">Choose which cookies we can use. Necessary cookies are always enabled to keep the site secure and functional.</p>' +
      '  <div class="cookie-pref-list">' +
      '    <div class="cookie-pref-item">' +
      '      <div>' +
      '        <h3>Necessary cookies</h3>' +
      '        <p>Required for core site functions such as navigation and security.</p>' +
      '      </div>' +
      '      <label class="cookie-switch" aria-label="Necessary cookies enabled">' +
      '        <input type="checkbox" checked disabled />' +
      '        <span aria-hidden="true"></span>' +
      '      </label>' +
      '    </div>' +
      '    <div class="cookie-pref-item">' +
      '      <div>' +
      '        <h3>Analytics cookies</h3>' +
      '        <p>Help us understand page usage and improve platform performance.</p>' +
      '      </div>' +
      '      <label class="cookie-switch" for="cookieAnalyticsToggle">' +
      '        <input type="checkbox" id="cookieAnalyticsToggle" aria-label="Analytics cookies" />' +
      '        <span aria-hidden="true"></span>' +
      '      </label>' +
      '    </div>' +
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

  function openModal(modal, currentConsent) {
    if (!modal) return;
    var analyticsToggle = modal.querySelector('#cookieAnalyticsToggle');
    if (analyticsToggle) {
      analyticsToggle.checked = !!(currentConsent && currentConsent.categories && currentConsent.categories.analytics);
    }
    lastFocusBeforeModal = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.removeAttribute('hidden');
    document.body.classList.add('cookie-modal-open');
    if (removeFocusTrap) removeFocusTrap();
    removeFocusTrap = trapFocus(modal);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('hidden', 'hidden');
    document.body.classList.remove('cookie-modal-open');
    if (removeFocusTrap) {
      removeFocusTrap();
      removeFocusTrap = null;
    }
    if (lastFocusBeforeModal && typeof lastFocusBeforeModal.focus === 'function') {
      lastFocusBeforeModal.focus();
    }
    lastFocusBeforeModal = null;
  }

  function applyConsent(consent, banner, modal) {
    setConsent(consent);
    if (consent.categories.analytics) {
      loadClarity();
    }
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

    if (existing && existing.categories && existing.categories.analytics) {
      loadClarity();
    } else if (!existing) {
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
        applyConsent(buildConsent(true, 'banner'), banner, modal);
      } else if (value === 'reject') {
        applyConsent(buildConsent(false, 'banner'), banner, modal);
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
        applyConsent(buildConsent(true, 'preferences-modal'), banner, modal);
        return;
      }

      if (action === 'reject') {
        applyConsent(buildConsent(false, 'preferences-modal'), banner, modal);
        return;
      }

      if (action === 'save') {
        var analyticsToggle = modal.querySelector('#cookieAnalyticsToggle');
        var analyticsEnabled = analyticsToggle ? analyticsToggle.checked : false;
        applyConsent(buildConsent(analyticsEnabled, 'preferences-modal'), banner, modal);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
        closeModal(modal);
      }
    });
  });
})();
