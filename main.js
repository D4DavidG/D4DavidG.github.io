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

  /* ---- Email dropdown ----
     Opens on hover, and stays open while the cursor is inside it so the copy
     button is reachable. */
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

  /* ---- Copy to clipboard ----
     execCommand is the fallback for insecure origins, where the async
     Clipboard API is not exposed at all. */
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  Array.prototype.forEach.call(document.querySelectorAll('.copy-btn'), function (btn) {
    var revert;

    function confirmCopy() {
      btn.classList.add('is-copied');
      btn.setAttribute('aria-label', 'Email address copied');
      clearTimeout(revert);
      revert = setTimeout(function () {
        btn.classList.remove('is-copied');
        btn.setAttribute('aria-label', 'Copy email address to clipboard');
      }, 1600);
    }

    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(confirmCopy, function () {
          if (legacyCopy(text)) confirmCopy();
        });
      } else if (legacyCopy(text)) {
        confirmCopy();
      }
    });
  });

  /* ---- Project card disclosure ----
     The summary is revealed on hover by CSS alone. This adds the tap path, so
     the cards are not hover-only on a touch screen. Clicks that land on a link
     are left alone — those are meant to navigate. */
  Array.prototype.forEach.call(document.querySelectorAll('.work-card'), function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      card.classList.toggle('is-open');
    });
  });
})();
