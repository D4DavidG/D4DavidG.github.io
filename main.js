/* Shared behavior for all pages.
   Loaded with `defer`, so the DOM is ready when this runs.

   Note: the initial light/dark choice is applied by a tiny inline script in
   each <head>, not here. It has to run before the first paint or the page
   flashes dark before switching to light. */
(function () {
  'use strict';

  var root = document.documentElement;

  // Current year in the footer.
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---- Light / dark switch ---- */
  var toggle = document.querySelector('.navbar-toggle');
  if (toggle) {
    var label = toggle.querySelector('.navbar-label');

    // The button advertises what it will switch TO, not the current mode.
    function syncToggle() {
      var isLight = root.dataset.mode === 'light';
      toggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
      if (label) label.textContent = isLight ? 'Dark' : 'Light';
    }

    syncToggle();

    toggle.addEventListener('click', function () {
      root.dataset.mode = root.dataset.mode === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('mode', root.dataset.mode); } catch (e) { /* private mode */ }
      syncToggle();
    });
  }

  /* ---- Nav bar collapse ----
     Scrolling down shrinks the bar to icons only; scrolling back up restores
     the labels. Runs regardless of prefers-reduced-motion because it is
     navigation, not decoration — the stylesheet drops the transition instead. */
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    var lastY = window.scrollY;
    var pending = false;
    var DEADZONE = 6;   // ignore sub-pixel jitter and rubber-banding
    var TOP_ZONE = 48;  // always expanded near the top of the page

    function syncNavbar() {
      var y = window.scrollY;

      if (y < TOP_ZONE) {
        navbar.classList.remove('is-collapsed');
      } else if (y > lastY + DEADZONE) {
        navbar.classList.add('is-collapsed');
      } else if (y < lastY - DEADZONE) {
        navbar.classList.remove('is-collapsed');
      }

      lastY = y;
      pending = false;
    }

    window.addEventListener('scroll', function () {
      if (!pending) {
        pending = true;
        requestAnimationFrame(syncNavbar);
      }
    }, { passive: true });
  }

  /* ---- Cursor-tracked glow ----
     The .mouse-glow layer reads --mx/--my. */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var raf = 0;
  var x = 0;
  var y = 0;

  function apply() {
    root.style.setProperty('--mx', x + 'px');
    root.style.setProperty('--my', y + 'px');
    raf = 0;
  }

  window.addEventListener('mousemove', function (e) {
    x = e.clientX;
    y = e.clientY;
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });

  /* ---- Email dropdown ----
     Show/hide dropdown on button hover, stay open when hovering dropdown. */
  var emailBtn = document.querySelector('.hero-btn-wrapper .hero-btn');
  var emailDropdown = document.querySelector('.hero-dropdown');
  if (emailBtn && emailDropdown) {
    var dropdownTimeout;

    function showDropdown() {
      clearTimeout(dropdownTimeout);
      emailDropdown.style.display = 'flex';
      emailBtn.setAttribute('aria-expanded', 'true');
    }

    function hideDropdown() {
      dropdownTimeout = setTimeout(function() {
        emailDropdown.style.display = 'none';
        emailBtn.setAttribute('aria-expanded', 'false');
      }, 100);
    }

    emailBtn.addEventListener('mouseenter', showDropdown);
    emailBtn.addEventListener('mouseleave', hideDropdown);
    emailDropdown.addEventListener('mouseenter', showDropdown);
    emailDropdown.addEventListener('mouseleave', hideDropdown);
  }
})();
