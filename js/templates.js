/* ══════════════════════════════════════
   Free44 – Template Definitions
   ══════════════════════════════════════ */

window.Free44 = window.Free44 || {};

(function () {
  'use strict';

  var TEMPLATES = [
    { icon: '\u{1F3E0}', label: 'Landing Page',  prompt: 'Create a modern, responsive SaaS landing page with a hero section, feature cards, pricing table with 3 tiers, testimonials, and a footer. Use a professional blue/white color scheme.' },
    { icon: '\u2705',    label: 'Todo App',       prompt: 'Build a fully functional todo app with add, edit, delete, and mark-complete features. Include categories, priority levels, local storage persistence, and a clean minimal UI.' },
    { icon: '\u{1F9EE}', label: 'Calculator',     prompt: 'Create a scientific calculator with a sleek dark UI. Support basic arithmetic, parentheses, percentage, square root, power, and memory functions (M+, M-, MR, MC). Add full keyboard support, a calculation history panel, and smooth button press animations. Display should show both the expression and result.' },
    { icon: '\u{1F3A8}', label: 'Portfolio',      prompt: 'Build a creative developer portfolio page with an animated hero section, project showcase grid with hover effects, skills section with progress bars, and a contact form.' },
    { icon: '\u{1F4CA}', label: 'Dashboard',      prompt: 'Create an analytics dashboard with sidebar navigation, stat cards at the top, a line chart and bar chart (use inline SVG or canvas), a recent activity table, and a dark professional theme.' },
    { icon: '\u{1F6D2}', label: 'E-Commerce',     prompt: 'Build a product listing page for an e-commerce store with a search bar, filter sidebar, product cards with images/prices/ratings, a shopping cart drawer, and responsive grid layout.' },
    { icon: '\u{1F4AC}', label: 'Chat UI',        prompt: 'Create a modern chat interface with a sidebar showing conversations, a main chat area with message bubbles, a text input with emoji button, and online status indicators.' },
    { icon: '\u{1F3AE}', label: 'Snake Game',     prompt: 'Build a classic Snake game using HTML canvas. Include score tracking, high score with localStorage, speed increase on eating food, game-over screen, and restart button.' },
    { icon: '\u{1F324}', label: 'Weather App',    prompt: 'Create a weather dashboard with a search bar, current weather display (temperature, humidity, wind), a 5-day forecast row, and animated weather icons. Use a clean gradient design.' },
    { icon: '\u{1F4DD}', label: 'Blog',           prompt: 'Build a minimalist blog page with a featured post hero, article cards in a grid, categories sidebar, reading time estimates, and a newsletter signup. Use clean typography.' },
    { icon: '\u{1F510}', label: 'Login Form',     prompt: 'Create a modern authentication page with login and signup forms that toggle between each other. Include email/password validation, social login buttons (Google, GitHub), and smooth animated transitions.' },
    { icon: '\u{1F3B5}', label: 'Music Player',   prompt: 'Build a music player UI with album art, play/pause/skip controls, a progress bar, volume slider, playlist sidebar, and a now-playing bar at the bottom. Use a sleek dark theme.' }
  ];

  Free44.templates = {
    list: TEMPLATES,

    init: function () {
      var container = document.getElementById('templates');
      if (!container) return;

      TEMPLATES.forEach(function (t) {
        var btn = document.createElement('button');
        btn.className = 'template-pill';
        btn.innerHTML = '<span class="pill-icon">' + t.icon + '</span>';
        btn.appendChild(document.createTextNode(t.label));
        btn.onclick = function () {
          var prompt = document.getElementById('prompt');
          if (prompt) {
            prompt.value = t.prompt;
            prompt.focus();
          }
        };
        container.appendChild(btn);
      });
    }
  };
})();
