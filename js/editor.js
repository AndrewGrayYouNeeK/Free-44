/* ══════════════════════════════════════
   Free44 – Code Editor & Syntax Highlight
   ══════════════════════════════════════ */

window.Free44 = window.Free44 || {};

(function () {
  'use strict';

  var KW_RE = '\\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|new|this|try|catch|throw|switch|case|break|continue|typeof|instanceof|void|null|undefined|true|false)\\b';

  function escapeHTML(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function highlight(code) {
    var s = escapeHTML(code);

    /* Comments */
    s = s.replace(/(\/\/.*)/g,                       '<span class="token-comment">$1</span>');
    s = s.replace(/(\/\*[\s\S]*?\*\/)/g,             '<span class="token-comment">$1</span>');
    s = s.replace(/(&lt;!--[\s\S]*?--&gt;)/g,        '<span class="token-comment">$1</span>');

    /* Strings */
    s = s.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g,    '<span class="token-string">$&</span>');

    /* HTML tags */
    s = s.replace(/(&lt;\/?)([\w-]+)/g,              '$1<span class="token-tag">$2</span>');
    s = s.replace(/([\w-]+)(=)/g,                    '<span class="token-attr-name">$1</span>$2');

    /* JS keywords */
    s = s.replace(new RegExp(KW_RE, 'g'),            '<span class="token-keyword">$1</span>');

    /* Numbers */
    s = s.replace(/\b(\d+\.?\d*)\b/g,                '<span class="token-number">$1</span>');

    return s;
  }

  function countLines(code) {
    return code.split('\n').length;
  }

  function renderLineNumbers(count) {
    var nums = [];
    for (var i = 1; i <= count; i++) {
      nums.push('<span class="line-number">' + i + '</span>');
    }
    return nums.join('');
  }

  Free44.editor = {
    init: function () {
      /* nothing to do at boot */
    },

    showCode: function (code) {
      var view = document.getElementById('code-view');
      if (!view) return;

      var lineCount = countLines(code);
      var highlighted = highlight(code);

      var html =
        '<div class="code-editor">' +
          '<div class="line-numbers">' + renderLineNumbers(lineCount) + '</div>' +
          '<div class="code-content"><code>' + highlighted + '</code></div>' +
        '</div>';

      view.innerHTML = html;
    },

    updatePreview: function (code) {
      var frame = document.getElementById('preview-frame');
      if (frame) frame.srcdoc = code;
    },

    highlight: highlight
  };
})();
