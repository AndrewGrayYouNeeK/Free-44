/* ══════════════════════════════════════
   Free44 – API Communication
   ══════════════════════════════════════ */

window.Free44 = window.Free44 || {};

(function () {
  'use strict';

  var MODELS = [
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B' },
    { id: 'llama-3.1-8b-instant',    label: 'Llama 3.1 8B' },
    { id: 'mixtral-8x7b-32768',      label: 'Mixtral 8x7B' },
    { id: 'gemma2-9b-it',            label: 'Gemma 2 9B' }
  ];

  var SYSTEM_PROMPT =
    'You are Free44, an expert front-end developer. Generate a complete, single-file HTML page for the user\'s request. Rules:\n' +
    '- Output ONLY the raw HTML code (starting with <!DOCTYPE html>). No markdown, no explanation, no code fences.\n' +
    '- Include all CSS in a <style> tag and all JS in a <script> tag inside the HTML file.\n' +
    '- Use modern, clean, responsive design. Make it visually polished.\n' +
    '- The page must be fully self-contained and work when opened directly in a browser.\n' +
    '- Use professional color schemes and smooth transitions/animations where appropriate.';

  function getApiKey() {
    var input = document.getElementById('api-key');
    return input ? input.value.trim() : '';
  }

  function getModel() {
    var select = document.getElementById('model-select');
    return select ? select.value : MODELS[0].id;
  }

  function cleanResponse(text) {
    return text
      .replace(/^```[a-z]*\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
  }

  Free44.api = {
    models: MODELS,

    generate: function (promptText, callback) {
      var apiKey = getApiKey();
      if (!apiKey) {
        callback(new Error('Please enter your Groq API key first.'));

        /* auto-open settings panel */
        var group = document.getElementById('api-key-group');
        if (group) {
          group.classList.add('visible');
          var input = document.getElementById('api-key');
          if (input) input.focus();
        }
        return;
      }

      if (!promptText) {
        callback(new Error('Please enter a prompt.'));
        return;
      }

      Free44.state.isGenerating = true;

      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.groq.com/openai/v1/chat/completions');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', 'Bearer ' + apiKey);

      xhr.onload = function () {
        Free44.state.isGenerating = false;

        if (xhr.status !== 200) {
          var errMsg = 'API error ' + xhr.status;
          try {
            var errData = JSON.parse(xhr.responseText);
            if (errData.error && errData.error.message) {
              errMsg = errData.error.message;
            }
          } catch (e) { /* ignore parse error */ }
          callback(new Error(errMsg));
          return;
        }

        try {
          var data = JSON.parse(xhr.responseText);
          var content = '';
          if (data.choices && data.choices[0] && data.choices[0].message) {
            content = data.choices[0].message.content || '';
          }
          content = cleanResponse(content);
          var tokens = (data.usage && data.usage.total_tokens) || '?';
          callback(null, content, tokens);
        } catch (e) {
          callback(new Error('Failed to parse API response'));
        }
      };

      xhr.onerror = function () {
        Free44.state.isGenerating = false;
        callback(new Error('Network error – check your connection'));
      };

      xhr.send(JSON.stringify({
        model: getModel(),
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: promptText }
        ],
        temperature: 0.6,
        max_tokens: 8000
      }));
    }
  };
})();
