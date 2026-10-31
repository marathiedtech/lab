# DzynCode — Pocket Coding Lab (v3)

Mobile-friendly browser coding playground for HTML, CSS and JavaScript.

## Features
- Project workspace with file/folder tree
- Create folders and files
- HTML, CSS and JavaScript syntax highlighting
- Code suggestions/autocomplete for HTML, CSS and JavaScript
- Trigger suggestions while typing or use Ctrl+Space / Cmd+Space
- Live preview for HTML/CSS/JS
- Auto-save in the same browser using localStorage
- Download project as ZIP
- Responsive mobile layout

## Publish on GitHub Pages
Replace the existing `index.html`, `style.css`, `app.js`, and `README.md` in your repository with these files and commit the changes.

## Notes
- Autocomplete uses CodeMirror 5 hint add-ons and is a starter-level completion experience, not the full VS Code IntelliSense/AI completion system.
- Projects are stored locally in the current browser/device; there is no cloud sync or teacher dashboard yet.
- Preview supports HTML/CSS/JavaScript only. Do not run untrusted server-side code.
- CodeMirror and JSZip are loaded from CDNs, so internet access is required.
