/* ══════════════════════════════════════
   Free44 – App Bootstrap
   ══════════════════════════════════════ */

window.Free44 = window.Free44 || {};

(function () {
  'use strict';

  Free44.state = {
    generatedCode: '',
    isGenerating: false,
    currentTab: 'code'
  };

  Free44.init = function () {
    /* order matters – templates before UI */
    if (Free44.theme)     Free44.theme.init();
    if (Free44.templates) Free44.templates.init();
    if (Free44.editor)    Free44.editor.init();
    if (Free44.history)   Free44.history.init();
    if (Free44.shortcuts) Free44.shortcuts.init();
    if (Free44.ui)        Free44.ui.init();

    console.log('Free44 initialized');
  };

  document.addEventListener('DOMContentLoaded', Free44.init);
})();
