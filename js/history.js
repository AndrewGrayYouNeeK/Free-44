/* ══════════════════════════════════════
   Free44 – Generation History
   ══════════════════════════════════════ */

window.Free44 = window.Free44 || {};

(function () {
  'use strict';

  var STORAGE_KEY = 'free44_history';
  var MAX_ITEMS = 50;
  var items = [];

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      items = raw ? JSON.parse(raw) : [];
    } catch (e) {
      items = [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) { /* quota exceeded – silently ignore */ }
  }

  function makeTitle(prompt) {
    var text = prompt.length > 60 ? prompt.substring(0, 60) + '…' : prompt;
    return text;
  }

  function timeAgo(ts) {
    var diff = Date.now() - ts;
    var sec = Math.floor(diff / 1000);
    if (sec < 60)   return 'just now';
    var min = Math.floor(sec / 60);
    if (min < 60)   return min + 'm ago';
    var hr = Math.floor(min / 60);
    if (hr < 24)    return hr + 'h ago';
    var days = Math.floor(hr / 24);
    return days + 'd ago';
  }

  function renderList(filterText) {
    var list = document.getElementById('history-list');
    if (!list) return;

    var filtered = items;
    if (filterText) {
      var lower = filterText.toLowerCase();
      filtered = items.filter(function (item) {
        return item.prompt.toLowerCase().indexOf(lower) !== -1;
      });
    }

    if (filtered.length === 0) {
      list.innerHTML =
        '<div class="history-empty">' +
          '<div class="history-empty-icon">\u{1F4CB}</div>' +
          '<p class="history-empty-text">' +
            (filterText ? 'No matching results' : 'No history yet') +
          '</p>' +
          '<p class="history-empty-text">Generated code will appear here</p>' +
        '</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < filtered.length; i++) {
      var item = filtered[i];
      html +=
        '<div class="history-item" data-idx="' + i + '">' +
          '<div class="history-item-title">' + escapeText(makeTitle(item.prompt)) + '</div>' +
          '<div class="history-item-meta">' +
            '<span class="history-item-tag">' + timeAgo(item.ts) + '</span>' +
            '<span class="history-item-tag">' + escapeText(item.model || 'AI') + '</span>' +
          '</div>' +
          '<button class="history-item-delete" data-idx="' + i + '" title="Delete">\u2715</button>' +
        '</div>';
    }
    list.innerHTML = html;

    /* bind clicks */
    var cards = list.querySelectorAll('.history-item');
    for (var j = 0; j < cards.length; j++) {
      (function (card) {
        card.onclick = function (e) {
          if (e.target.classList.contains('history-item-delete')) return;
          var idx = parseInt(card.getAttribute('data-idx'), 10);
          loadItem(idx);
        };
      })(cards[j]);
    }

    var delBtns = list.querySelectorAll('.history-item-delete');
    for (var k = 0; k < delBtns.length; k++) {
      (function (btn) {
        btn.onclick = function (e) {
          e.stopPropagation();
          var idx = parseInt(btn.getAttribute('data-idx'), 10);
          deleteItem(idx);
        };
      })(delBtns[k]);
    }
  }

  function escapeText(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function loadItem(idx) {
    var item = items[idx];
    if (!item) return;

    var prompt = document.getElementById('prompt');
    if (prompt) prompt.value = item.prompt;

    Free44.state.generatedCode = item.code;
    if (Free44.editor) {
      Free44.editor.showCode(item.code);
      Free44.editor.updatePreview(item.code);
    }

    /* switch to code tab */
    if (Free44.ui) Free44.ui.switchTab('code');

    /* close sidebar */
    toggleSidebar(false);

    if (Free44.ui) Free44.ui.toast('Loaded from history');
  }

  function deleteItem(idx) {
    items.splice(idx, 1);
    save();
    renderList();
  }

  function toggleSidebar(forceState) {
    var sidebar = document.getElementById('history-sidebar');
    var overlay = document.getElementById('history-overlay');
    if (!sidebar) return;

    var open = typeof forceState === 'boolean' ? forceState : !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('open', open);
  }

  Free44.history = {
    init: function () {
      load();

      /* search handler */
      var searchInput = document.getElementById('history-search');
      if (searchInput) {
        searchInput.oninput = function () {
          renderList(searchInput.value);
        };
      }

      /* close btn */
      var closeBtn = document.getElementById('history-close');
      if (closeBtn) {
        closeBtn.onclick = function () { toggleSidebar(false); };
      }

      /* overlay click */
      var overlay = document.getElementById('history-overlay');
      if (overlay) {
        overlay.onclick = function () { toggleSidebar(false); };
      }

      /* clear all */
      var clearBtn = document.getElementById('history-clear');
      if (clearBtn) {
        clearBtn.onclick = function () {
          items = [];
          save();
          renderList();
          if (Free44.ui) Free44.ui.toast('History cleared');
        };
      }

      renderList();
    },

    add: function (prompt, code, model) {
      items.unshift({
        prompt: prompt,
        code: code,
        model: model || '',
        ts: Date.now()
      });
      if (items.length > MAX_ITEMS) items.pop();
      save();
      renderList();
    },

    toggle: function () {
      toggleSidebar();
    },

    renderList: renderList
  };
})();
