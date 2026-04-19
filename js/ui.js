/* ══════════════════════════════════════
   Free44 – UI Controller
   ══════════════════════════════════════ */

window.Free44 = window.Free44 || {};

(function () {
  'use strict';

  /* ── Helpers ── */

  function setStatus(state, text) {
    var dot = document.getElementById('status-dot');
    if (dot) {
      dot.className = 'status-dot';
      if (state === 'error')   dot.classList.add('error');
      if (state === 'loading') dot.classList.add('loading');
    }
    var el = document.getElementById('status-text');
    if (el) el.textContent = text;
  }

  function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  function toggleSettings() {
    var group = document.getElementById('api-key-group');
    if (!group) return;
    group.classList.toggle('visible');
    if (group.classList.contains('visible')) {
      var input = document.getElementById('api-key');
      if (input) input.focus();
    }
  }

  function switchTab(tab) {
    Free44.state.currentTab = tab;

    var tabs = document.querySelectorAll('.output-tab');
    for (var i = 0; i < tabs.length; i++) {
      var t = tabs[i];
      if (t.getAttribute('data-tab') === tab) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    }

    var codeView = document.getElementById('code-view');
    var previewView = document.getElementById('preview-view');
    if (codeView)    codeView.style.display    = (tab === 'code')    ? 'block' : 'none';
    if (previewView) previewView.style.display = (tab === 'preview') ? 'block' : 'none';
  }

  function toggleFullscreen() {
    var panel = document.querySelector('.output-panel');
    if (panel) panel.classList.toggle('fullscreen');
  }

  /* ── Generate Logic ── */

  function doGenerate() {
    var promptEl = document.getElementById('prompt');
    var promptText = promptEl ? promptEl.value.trim() : '';

    var btn = document.getElementById('generate-btn');

    if (!promptText) {
      showToast('Please enter a prompt.');
      if (promptEl) promptEl.focus();
      return;
    }

    /* UI: loading state */
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<div class="spinner"></div> Generating\u2026';
    }
    setStatus('loading', 'Generating code\u2026');

    Free44.api.generate(promptText, function (err, code, tokens) {
      /* restore button */
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '\u{1F680} Generate Code';
      }

      if (err) {
        setStatus('error', err.message);
        showToast('Error: ' + err.message);
        return;
      }

      Free44.state.generatedCode = code;

      if (Free44.editor) {
        Free44.editor.showCode(code);
        Free44.editor.updatePreview(code);
      }

      /* save to history */
      var modelSelect = document.getElementById('model-select');
      var modelLabel = '';
      if (modelSelect) {
        modelLabel = modelSelect.options[modelSelect.selectedIndex].text;
      }
      if (Free44.history) {
        Free44.history.add(promptText, code, modelLabel);
      }

      setStatus('ready', 'Done \u2014 ' + tokens + ' tokens used');
      showToast('Code generated successfully!');
    });
  }

  /* ── Bind All Event Handlers ── */

  function bindEvents() {
    /* Settings toggle */
    var settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) settingsBtn.onclick = toggleSettings;

    /* Theme toggle */
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.onclick = function () {
      if (Free44.theme) Free44.theme.toggle();
    };

    /* Generate */
    var genBtn = document.getElementById('generate-btn');
    if (genBtn) genBtn.onclick = doGenerate;

    /* Tab buttons */
    var tabs = document.querySelectorAll('.output-tab');
    for (var i = 0; i < tabs.length; i++) {
      (function (tab) {
        tab.onclick = function () {
          switchTab(tab.getAttribute('data-tab'));
        };
      })(tabs[i]);
    }

    /* Action buttons */
    var copyBtn = document.getElementById('btn-copy');
    if (copyBtn) copyBtn.onclick = function () {
      if (Free44.export) Free44.export.copyCode();
    };

    var dlBtn = document.getElementById('btn-download');
    if (dlBtn) dlBtn.onclick = function () {
      if (Free44.export) Free44.export.downloadHTML();
    };

    var zipBtn = document.getElementById('btn-zip');
    if (zipBtn) zipBtn.onclick = function () {
      if (Free44.export) Free44.export.downloadZIP();
    };

    var shareBtn = document.getElementById('btn-share');
    if (shareBtn) shareBtn.onclick = function () {
      if (Free44.export) Free44.export.shareURL();
    };

    var fsBtn = document.getElementById('btn-fullscreen');
    if (fsBtn) fsBtn.onclick = toggleFullscreen;

    /* History toggle */
    var histBtn = document.getElementById('btn-history');
    if (histBtn) histBtn.onclick = function () {
      if (Free44.history) Free44.history.toggle();
    };

    /* API key persistence */
    var apiInput = document.getElementById('api-key');
    if (apiInput) {
      apiInput.value = localStorage.getItem('free44_api_key') || '';
      apiInput.addEventListener('input', function () {
        localStorage.setItem('free44_api_key', apiInput.value.trim());
      });
    }

    /* Populate model selector */
    var modelSelect = document.getElementById('model-select');
    if (modelSelect && Free44.api && Free44.api.models) {
      Free44.api.models.forEach(function (m) {
        var opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.label;
        modelSelect.appendChild(opt);
      });
    }
  }

  /* ── Public API ── */

  Free44.ui = {
    init: function () {
      bindEvents();
    },

    toast: showToast,
    setStatus: setStatus,
    switchTab: switchTab,
    doGenerate: doGenerate,
    toggleFullscreen: toggleFullscreen,
    toggleSettings: toggleSettings
  };
})();
