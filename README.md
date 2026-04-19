# Free44 – AI Code Generator

> **100% Free. No credits. No limits. Build as much as you want.**

Free44 is a free, unlimited AI code generator that creates complete web applications from natural language prompts. Powered by Groq's lightning-fast inference API.

## ✨ Features

- 🆓 **Completely Free** – No credits, no subscriptions, no limits
- 🤖 **4 AI Models** – Llama 3.3 70B, Llama 3.1 8B, Mixtral 8x7B, Gemma 2 9B
- 🎨 **Dark/Light Theme** – Toggle with system preference detection
- 📂 **Generation History** – Auto-saved to localStorage with search
- 📦 **ZIP Export** – Download your project as a zip file
- 🔗 **Share via URL** – Share generated code via base64 URL
- ⌨️ **Keyboard Shortcuts** – Ctrl+Enter, Ctrl+S, Ctrl+H, and more
- 📱 **PWA Ready** – Installable on any device, works offline
- 👁 **Live Preview** – See your code rendered in real-time
- ✨ **Syntax Highlighting** – With line numbers
- 📋 **12 Templates** – Landing page, Todo app, Calculator, Portfolio, and more
- ⛶ **Fullscreen Mode** – Focus on your preview

## 🏗️ Project Structure

```
Free44/
├── index.html          # Main app shell
├── progress.html       # Project progress tracker
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── css/
│   ├── variables.css   # Design tokens & themes
│   ├── base.css        # Reset & utilities
│   ├── animations.css  # Keyframe animations
│   ├── header.css      # Header & navigation
│   ├── panels.css      # Input/output panels
│   ├── components.css  # Buttons, toast, modal
│   ├── editor.css      # Code editor & syntax tokens
│   ├── history.css     # History sidebar
│   └── responsive.css  # Responsive breakpoints
├── js/
│   ├── app.js          # Bootstrap & init
│   ├── templates.js    # Template definitions
│   ├── api.js          # Groq API communication
│   ├── editor.js       # Syntax highlighting
│   ├── history.js      # Generation history
│   ├── export.js       # Copy/download/ZIP/share
│   ├── theme.js        # Dark/light theme
│   ├── shortcuts.js    # Keyboard shortcuts
│   └── ui.js           # UI controller
├── icons/
│   └── icon.svg        # App icon
├── package.json
├── vercel.json
└── README.md
```

## 🚀 Getting Started

1. Open `index.html` in a browser, or run `npx serve .`
2. Click ⚙️ to enter your free [Groq API key](https://console.groq.com/)
3. Type a prompt or pick a template
4. Click **Generate Code**

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Enter` | Generate code |
| `Ctrl+S` | Download HTML |
| `Ctrl+Shift+C` | Copy code |
| `Ctrl+H` | Toggle history |
| `Ctrl+K` | Focus prompt |
| `Escape` | Close panels |

## 📄 License

Free to use. No restrictions.