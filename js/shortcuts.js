/* ══════════════════════════════════════
   Free44 – Keyboard Shortcuts
   ══════════════════════════════════════ */

window.Free44 = window.Free44 || {};

(function () {
  'use strict';

  var SHORTCUTS = [
    { keys: 'Ctrl+Enter',  desc: 'Generate code',     action: function () { if (Free44.ui) Free44.ui.doGenerate(); } },
    { keys: 'Ctrl+S',      desc: 'Download HTML',     action: function () { if (Free44.export) Free44.export.downloadHTML(); } },
    { keys: 'Ctrl+Shift+C', desc: 'Copy code',        action: function () { if (Free44.export) Free44.export.copyCode(); } },
    { keys: 'Ctrl+H',      desc: 'Toggle history',    action: function () { if (Free44.history) Free44.history.toggle(); } },
    { keys: 'Ctrl+K',      desc: 'Focus prompt',      action: function () { var p = document.getElementById('prompt'); if (p) p.focus(); } },
    { keys: 'Escape',      desc: 'Close panels',      action: function () {
      /* close the topmost element only */
      var modal = document.querySelector('.modal-overlay.open');
      if (modal) { modal.classList.remove('open'); return; }
      var sidebar = document.getElementById('history-sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        if (Free44.history) Free44.history.toggle();
      }
    }}
  ];

  function matchShortcut(e) {
    var key = e.key;
    for (var i = 0; i < SHORTCUTS.length; i++) {
      var sc = SHORTCUTS[i];
      var parts = sc.keys.split('+');
      var mainKey = parts[parts.length - 1];

      var needCtrl  = parts.indexOf('Ctrl') !== -1;
      var needShift = parts.indexOf('Shift') !== -1;
      var needAlt   = parts.indexOf('Alt') !== -1;

      if ((needCtrl && !(e.ctrlKey || e.metaKey)) || (!needCtrl && (e.ctrlKey || e.metaKey) && key !== 'Escape')) continue;
      if ((needShift && !e.shiftKey) || (!needShift && e.shiftKey && key !== 'Escape')) continue;
      if ((needAlt && !e.altKey) || (!needAlt && e.altKey)) continue;

      if (key === mainKey || key.toLowerCase() === mainKey.toLowerCase()) {
        return sc;
      }
    }
    return null;
  }

  Free44.shortcuts = {
    list: SHORTCUTS,

    init: function () {
      document.addEventListener('keydown', function (e) {
        var sc = matchShortcut(e);
        if (sc) {
          e.preventDefault();
          sc.action();
        }
      });
    }
  };
})();
