/* ══════════════════════════════════════
   Free44 – Export (Copy, Download, ZIP, Share)
   ══════════════════════════════════════ */

window.Free44 = window.Free44 || {};

(function () {
  'use strict';

  function getCode() {
    return Free44.state.generatedCode || '';
  }

  Free44.export = {
    copyCode: function () {
      var code = getCode();
      if (!code) {
        if (Free44.ui) Free44.ui.toast('Nothing to copy yet.');
        return;
      }
      navigator.clipboard.writeText(code)
        .then(function () {
          if (Free44.ui) Free44.ui.toast('Copied to clipboard!');
        })
        .catch(function (err) {
          if (Free44.ui) Free44.ui.toast('Copy failed: ' + err.message);
        });
    },

    downloadHTML: function () {
      var code = getCode();
      if (!code) {
        if (Free44.ui) Free44.ui.toast('Nothing to download yet.');
        return;
      }
      var blob = new Blob([code], { type: 'text/html' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'free44-generated.html';
      a.click();
      URL.revokeObjectURL(a.href);
      if (Free44.ui) Free44.ui.toast('Download started!');
    },

    downloadZIP: function () {
      var code = getCode();
      if (!code) {
        if (Free44.ui) Free44.ui.toast('Nothing to export yet.');
        return;
      }

      if (typeof JSZip === 'undefined') {
        if (Free44.ui) Free44.ui.toast('ZIP library not loaded.');
        return;
      }

      var zip = new JSZip();
      zip.file('index.html', code);
      zip.file('README.md', '# Free44 Generated Project\n\nOpen `index.html` in your browser to view.\n');

      zip.generateAsync({ type: 'blob' })
        .then(function (blob) {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'free44-project.zip';
          a.click();
          URL.revokeObjectURL(a.href);
          if (Free44.ui) Free44.ui.toast('ZIP downloaded!');
        })
        .catch(function (err) {
          if (Free44.ui) Free44.ui.toast('ZIP export failed: ' + err.message);
        });
    },

    shareURL: function () {
      var code = getCode();
      if (!code) {
        if (Free44.ui) Free44.ui.toast('Nothing to share yet.');
        return;
      }

      try {
        var bytes = new TextEncoder().encode(code);
        var binary = '';
        for (var i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        var encoded = btoa(binary);
        var url = window.location.origin + window.location.pathname + '#code=' + encoded;

        if (url.length > 8000) {
          if (Free44.ui) Free44.ui.toast('Code too long for URL sharing. Use download instead.');
          return;
        }

        navigator.clipboard.writeText(url)
          .then(function () {
            if (Free44.ui) Free44.ui.toast('Share URL copied to clipboard!');
          })
          .catch(function () {
            if (Free44.ui) Free44.ui.toast('Could not copy URL');
          });
      } catch (e) {
        if (Free44.ui) Free44.ui.toast('Share failed: ' + e.message);
      }
    }
  };

  /* Load shared code from URL hash on boot */
  function loadSharedCode() {
    var hash = window.location.hash;
    if (hash.indexOf('#code=') === 0) {
      try {
        var encoded = hash.substring(6);
        var binary = atob(encoded);
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        var code = new TextDecoder().decode(bytes);
        Free44.state.generatedCode = code;

        document.addEventListener('DOMContentLoaded', function () {
          if (Free44.editor) {
            Free44.editor.showCode(code);
            Free44.editor.updatePreview(code);
          }
          if (Free44.ui) Free44.ui.toast('Loaded shared code!');
        });
      } catch (e) {
        console.warn('Failed to load shared code', e);
      }
    }
  }

  loadSharedCode();
})();
