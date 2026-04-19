/* ══════════════════════════════════════
   Free44 – Theme System
   ══════════════════════════════════════ */

window.Free44 = window.Free44 || {};

(function () {
  'use strict';

  var STORAGE_KEY = 'free44_theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateIcon(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) { /* ignore */ }
  }

  function updateIcon(theme) {
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\u{1F319}';
  }

  Free44.theme = {
    init: function () {
      var stored = getStoredTheme();
      applyTheme(stored || getSystemTheme());

      /* Listen for system changes */
      if (window.matchMedia) {
        var mql = window.matchMedia('(prefers-color-scheme: light)');
        if (mql.addEventListener) {
          mql.addEventListener('change', function () {
            if (!getStoredTheme()) applyTheme(getSystemTheme());
          });
        }
      }
    },

    toggle: function () {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    },

    get: function () {
      return document.documentElement.getAttribute('data-theme') || 'dark';
    }
  };
})();
