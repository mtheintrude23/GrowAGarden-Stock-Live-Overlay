# GrowAGarden Stock Live Overlay (Electron)

A beautiful, always-on-top, draggable overlay for GrowAGarden stock tracking. Powered by Electron and the JoshLei API.

## Features
- **Live Stock Updates:** Real-time updates via WebSocket, with fallback to polling.
- **Grouped Stocks:** Seed, Gear, Egg, Cosmetic, and Event stocks, each with icons and quantities.
- **Modern Overlay UI:** Glassmorphism, rounded corners, smooth animations, and a draggable title bar.
- **Always-on-Top:** Stays above other windows, perfect for streamers or multitasking.
- **Click-Through Mode:** (If enabled in main.js) Overlay can be made click-through for true HUD experience.
- **Responsive & Polished:** Handles errors, loading, and connection issues gracefully.

## Setup & Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the overlay:**
   ```bash
   npm start
   ```
   This will launch the overlay window. You can drag it by the title bar. Use the close (×) button to exit.

3. **Build for distribution:**
   (Optional, for packaging)
   ```bash
   npm run build
   ```
   *(You may need to add a build script and electron-builder config to package.json for this step.)*

## File Structure
- `main.js` — Electron main process, creates the overlay window.
- `overlay.html` — The overlay's HTML shell.
- `overlay.js` — All overlay UI logic, DOM, and live updates.
- `overlay.css` — (Optional) Additional styles for the overlay.
- `package.json` — Project metadata and dependencies.

## Customization
- **Overlay Size/Style:** Edit `overlay.js` for width, colors, or UI tweaks.
- **API Endpoints:** Change `API_URL` and `WS_URL` in `overlay.js` if the API moves.
- **Click-Through:** Uncomment or add click-through logic in `main.js` for a HUD overlay.

## Troubleshooting
- **Stocks not updating?**
  - Check your internet connection.
  - The API or WebSocket may be temporarily down.
  - Try closing and reopening the overlay.
- **Overlay not draggable?**
  - Only the title bar is draggable (Electron drag region).
- **Window disappears or is behind other apps?**
  - The overlay is set to always-on-top, but some fullscreen apps may cover it.

## Credits
- Overlay by [Ryuzii](https://github.com/Ryuzii)
- Powered by [JoshLei API](https://api.joshlei.com/)

---

*For issues or suggestions, open an issue on GitHub or contact Ryuzii.*
