# DzynCode v4.1 — Fixed folder picker and project workspace

- New file, rename, delete
- HTML/CSS/JavaScript editor with live preview
- Browser auto-save
- Export complete project as ZIP
- Choose a device folder and write project files on browsers supporting the File System Access API

## Publish update
Replace `index.html`, `style.css`, `app.js`, and `README.md` in the GitHub repository root. Commit the changes. After Pages deployment succeeds, hard-refresh the site (Ctrl+Shift+R).

## Compatibility
The device-folder picker requires a secure context and browser support for `showDirectoryPicker` (typically desktop Chromium browsers). It may not be supported on mobile browsers. Use Export ZIP where folder access is unavailable.
