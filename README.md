# DzynCode — Pocket Coding Lab

A mobile-friendly browser coding playground for learning HTML, CSS and JavaScript.

## Features
- Three editable files: `index.html`, `style.css`, `script.js`
- Syntax highlighting via CodeMirror 5 CDN
- Live preview in a sandboxed iframe
- Local auto-save in the browser
- Reset starter code
- Download individual project files
- Responsive mobile and desktop layout

## Run locally
Open `index.html` in a modern browser with an internet connection (CodeMirror is loaded from CDN).

## Publish
1. Create a public GitHub repository named `dzyncode`.
2. Upload all files in this folder to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Your site will be published at `https://YOUR-USERNAME.github.io/dzyncode/`.

## Important limitations in this first version
- Code is saved only in the same browser on the same device (localStorage).
- It does not yet have student accounts, cloud sync, teacher dashboard, or GitHub login.
- HTML/CSS/JavaScript run in a sandboxed preview. This is not a general-purpose secure server for running Python, PHP, Java, C or C++.
- CodeMirror is loaded from a CDN, so an internet connection is needed to load the editor library.
