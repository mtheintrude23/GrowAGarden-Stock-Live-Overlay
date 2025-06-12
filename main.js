const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
app.disableHardwareAcceleration();

let win, tray;
const iconPath = path.join(__dirname, 'icon.png');

function createWindow() {
  win = new BrowserWindow({
    width: 440,
    height: 600,
    x: undefined,
    y: undefined,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadFile('overlay.html');
  // win.setIgnoreMouseEvents(false); // Start interactive

  // Remove click-through logic so overlay is always interactive
  // win.on('blur', () => {
  //   win.setOpacity(0.5);
  //   win.setIgnoreMouseEvents(true, { forward: true });
  // });
  // win.on('focus', () => {
  //   win.setOpacity(1);
  //   win.setIgnoreMouseEvents(false);
  // });

  // Hide instead of close
  win.on('close', (e) => {
    if (!app.isQuiting) {
      e.preventDefault();
      win.hide();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Tray icon
  tray = new Tray(nativeImage.createFromPath(iconPath));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Overlay', click: () => win.show() },
    { label: 'Quit', click: () => { app.isQuiting = true; app.quit(); } }
  ]);
  tray.setToolTip('GrowAGarden Stock Live Overlay');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => win.show());
});

app.on('window-all-closed', (e) => {
  // Prevent app from quitting when window is closed
  e.preventDefault();
});