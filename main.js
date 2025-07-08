const express = require('express');
const path = require('path');
const open = require('open'); // Dùng để mở trình duyệt tự động
const app = express();
const port = process.env.PORT || 80;

let isHidden = false;
let isQuiting = false;

// Dùng để mô phỏng "loadFile('overlay.html')"
app.get('/', (req, res) => {
  if (isHidden) {
    return res.send(`<h1>🔒 Overlay is hidden</h1><a href="/show">Show again</a>`);
  }
  res.sendFile(path.join(__dirname, 'overlay.html'));
});

// Mô phỏng win.hide()
app.get('/hide', (req, res) => {
  isHidden = true;
  res.send('<h1>✅ Overlay has been hidden</h1><a href="/">Back</a>');
});

// Mô phỏng win.show()
app.get('/show', (req, res) => {
  isHidden = false;
  res.redirect('/');
});

// Mô phỏng app.quit()
app.get('/quit', (req, res) => {
  isQuiting = true;
  res.send('<h1>👋 Quitting...</h1>');
  console.log('Quitting server...');
  setTimeout(() => process.exit(), 1000);
});

// Static files (icon, CSS, JS, etc.)
app.use(express.static(__dirname));

// Mô phỏng "app.whenReady()" trong Electron
app.listen(port, async () => {
  console.log(`🚀 Overlay server is running at http://localhost:${port}`);
  console.log(`💡 Use /hide, /show, /quit to simulate Electron behavior`);
});
