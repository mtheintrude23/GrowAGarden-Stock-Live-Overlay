// == GrowAGarden Stock Live Overlay ==

const API_URL = "https://api.joshlei.com/v2/growagarden/stock";
const WS_URL = "wss://websocket.joshlei.com/growagarden/";

const overlay = document.createElement("div");
overlay.id = "gag-stock-overlay";
overlay.style.position = "absolute";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "420px";
overlay.style.maxWidth = "100vw";
overlay.style.maxHeight = "80vh";
overlay.style.minHeight = "320px";
overlay.style.background = "rgba(24, 28, 40, 0.95)";
overlay.style.backdropFilter = "blur(16px)";
overlay.style.borderRadius = "18px";
overlay.style.boxShadow = "0 8px 32px 0 rgba(0,0,0,0.18)";
overlay.style.overflowY = "auto";
overlay.style.overflowX = "hidden";
overlay.style.padding = "24px 24px 16px 24px";
overlay.style.display = "flex";
overlay.style.flexDirection = "column";
overlay.style.gap = "8px";
overlay.style.transition = "opacity 0.3s";
overlay.style.userSelect = "none";
overlay.style.cursor = "default";
overlay.style.zIndex = "999999";
// Electron drag region
overlay.style['-webkit-app-region'] = 'no-drag';
overlay.style.boxSizing = "border-box";

document.getElementById("gag-overlay-root").appendChild(overlay);

// Add a title bar to the overlay
const titleBar = document.createElement("div");
titleBar.style.display = "flex";
titleBar.style.alignItems = "center";
titleBar.style.justifyContent = "space-between";
titleBar.style.fontWeight = "bold";
titleBar.style.fontSize = "1.1rem";
titleBar.style.color = "#fff";
titleBar.style.marginBottom = "10px";
titleBar.style.letterSpacing = "0.01em";
titleBar.style.userSelect = "none";
titleBar.style.cursor = "move";
titleBar.style['-webkit-app-region'] = 'drag';
titleBar.innerHTML = `<span>GrowAGarden Stock Live</span>`;
overlay.appendChild(titleBar);

// Remove old drag logic (handled by Electron drag region)

// Close button
const closeBtn = document.createElement("button");
closeBtn.id = "gag-close-btn";
closeBtn.innerHTML = "×";
closeBtn.style.position = "absolute";
closeBtn.style.top = "12px";
closeBtn.style.right = "18px";
closeBtn.style.fontSize = "1.7rem";
closeBtn.style.background = "none";
closeBtn.style.border = "none";
closeBtn.style.color = "#fff";
closeBtn.style.cursor = "pointer";
closeBtn.style.zIndex = "2";
closeBtn.style.fontWeight = "bold";
closeBtn.style.opacity = "0.7";
closeBtn.style['-webkit-app-region'] = 'no-drag';
closeBtn.addEventListener("mouseenter", () => closeBtn.style.opacity = "1");
closeBtn.addEventListener("mouseleave", () => closeBtn.style.opacity = "0.7");
closeBtn.addEventListener("click", () => {
  window.close();
});
overlay.appendChild(closeBtn);

// Content
const content = document.createElement("div");
content.style.marginTop = "8px";
content.style.marginBottom = "12px";
content.style.width = "100%";
content.style.display = "flex";
content.style.flexDirection = "column";
content.style.gap = "16px";
content.style['-webkit-app-region'] = 'no-drag';
overlay.appendChild(content);

// Credits
const credits = document.createElement("div");
credits.style.textAlign = "center";
credits.style.fontSize = "13px";
credits.style.color = "#b5e0b5";
credits.style.marginTop = "8px";
credits.style['-webkit-app-region'] = 'no-drag';
credits.innerHTML = "Made with ❤️ by Ryuzii | Powered by JoshLei API";
overlay.appendChild(credits);

// Helper: Render stocks
function renderStocks(data) {
  content.innerHTML = "";
  const groups = [
    { key: "seed_stock", label: "Seed Stocks" },
    { key: "gear_stock", label: "Gear Stocks" },
    { key: "egg_stock", label: "Egg Stocks" },
    { key: "cosmetic_stock", label: "Cosmetic Stocks" },
    { key: "eventshop_stock", label: "Event Stocks" },
  ];
  let hasAny = false;
  groups.forEach(group => {
    const items = data[group.key] || [];
    if (!items.length) return;
    hasAny = true;
    const groupDiv = document.createElement("div");
    groupDiv.style.marginBottom = "10px";
    const groupTitle = document.createElement("div");
    groupTitle.textContent = group.label;
    groupTitle.style.fontWeight = "bold";
    groupTitle.style.fontSize = "1.1rem";
    groupTitle.style.marginBottom = "6px";
    groupDiv.appendChild(groupTitle);
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(3, 1fr)";
    grid.style.gap = "8px";
    grid.style.boxSizing = "border-box";
    items.forEach(item => {
      const card = document.createElement("div");
      card.style.background = "rgba(255,255,255,0.08)";
      card.style.borderRadius = "10px";
      card.style.display = "flex";
      card.style.alignItems = "center";
      card.style.gap = "7px";
      card.style.padding = "7px 8px";
      card.style.minWidth = "0";
      card.style.overflow = "hidden";
      card.style.whiteSpace = "nowrap";
      card.style.textOverflow = "ellipsis";
      card.title = item.display_name;
      card.style['-webkit-app-region'] = 'no-drag';
      card.style.boxSizing = "border-box";
      const img = document.createElement("img");
      img.src = item.icon;
      img.alt = item.display_name;
      img.style.width = "28px";
      img.style.height = "28px";
      img.style.objectFit = "contain";
      img.style.borderRadius = "6px";
      const name = document.createElement("span");
      name.textContent = item.display_name;
      name.style.fontWeight = "600";
      name.style.fontSize = "1rem";
      name.style.overflow = "hidden";
      name.style.textOverflow = "ellipsis";
      name.style.maxWidth = "80px";
      const qty = document.createElement("span");
      qty.textContent = `x${item.quantity}`;
      qty.style.fontSize = "0.9rem";
      qty.style.color = "#b5e0b5";
      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(qty);
      grid.appendChild(card);
    });
    groupDiv.appendChild(grid);
    content.appendChild(groupDiv);
  });
  if (!hasAny) {
    // Vertically center and add retry button
    content.innerHTML = '';
    const emptyDiv = document.createElement('div');
    emptyDiv.style.color = '#b5e0b5';
    emptyDiv.style.textAlign = 'center';
    emptyDiv.style.padding = '32px 0';
    emptyDiv.style.fontSize = '1.1rem';
    emptyDiv.style.display = 'flex';
    emptyDiv.style.flexDirection = 'column';
    emptyDiv.style.alignItems = 'center';
    emptyDiv.style.justifyContent = 'center';
    emptyDiv.style.height = '180px';
    emptyDiv.innerHTML = 'No stocks available.<br><span style="font-size:0.95rem;color:#b5e0b5;">Try again later or check your connection.</span>';
    const retryBtn = document.createElement('button');
    retryBtn.textContent = 'Retry';
    retryBtn.style.marginTop = '18px';
    retryBtn.style.background = 'linear-gradient(90deg,#4ade80,#22c55e)';
    retryBtn.style.color = '#222';
    retryBtn.style.fontWeight = 'bold';
    retryBtn.style.fontSize = '1rem';
    retryBtn.style.border = 'none';
    retryBtn.style.borderRadius = '999px';
    retryBtn.style.padding = '8px 28px';
    retryBtn.style.cursor = 'pointer';
    retryBtn.style.boxShadow = '0 2px 8px 0 rgba(34,197,94,0.10)';
    retryBtn.addEventListener('click', fetchAndRenderStocks);
    emptyDiv.appendChild(retryBtn);
    content.appendChild(emptyDiv);
  }
}

// Loading spinner
content.innerHTML = '<div style="text-align:center;padding:32px 0;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div style="width:32px;height:32px;border:4px solid #b5e0b5;border-top:4px solid transparent;border-radius:50%;margin:0 auto;animation:spin 1s linear infinite"></div><div style="margin-top:8px;color:#b5e0b5;font-weight:bold;">Loading stocks...</div></div>';
const style = document.createElement('style');
style.textContent = `@keyframes spin{to{transform:rotate(360deg)}}`;
document.head.appendChild(style);

// Fetch and update stocks
function fetchAndRenderStocks() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      renderStocks(data);
    })
    .catch((err) => {
      console.error('Failed to load stocks:', err);
      // Vertically center and add retry button
      content.innerHTML = '';
      const errorDiv = document.createElement('div');
      errorDiv.style.color = '#e57373';
      errorDiv.style.textAlign = 'center';
      errorDiv.style.padding = '32px 0';
      errorDiv.style.fontSize = '1.1rem';
      errorDiv.style.display = 'flex';
      errorDiv.style.flexDirection = 'column';
      errorDiv.style.alignItems = 'center';
      errorDiv.style.justifyContent = 'center';
      errorDiv.style.height = '180px';
      errorDiv.innerHTML = 'Failed to load stocks.<br><span style="font-size:0.95rem;color:#b5e0b5;">Check your internet connection or try again later.</span>';
      const retryBtn = document.createElement('button');
      retryBtn.textContent = 'Retry';
      retryBtn.style.marginTop = '18px';
      retryBtn.style.background = 'linear-gradient(90deg,#4ade80,#22c55e)';
      retryBtn.style.color = '#222';
      retryBtn.style.fontWeight = 'bold';
      retryBtn.style.fontSize = '1rem';
      retryBtn.style.border = 'none';
      retryBtn.style.borderRadius = '999px';
      retryBtn.style.padding = '8px 28px';
      retryBtn.style.cursor = 'pointer';
      retryBtn.style.boxShadow = '0 2px 8px 0 rgba(34,197,94,0.10)';
      retryBtn.addEventListener('click', fetchAndRenderStocks);
      errorDiv.appendChild(retryBtn);
      content.appendChild(errorDiv);
    });
}
fetchAndRenderStocks();

// WebSocket for real-time updates
const ws = new window.WebSocket(WS_URL);
ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    renderStocks(data);
  } catch (err) {
    console.error('WebSocket message parse error:', err);
  }
};
ws.onerror = (err) => {
  console.error('WebSocket error:', err);
  // fallback to polling if needed
  setTimeout(fetchAndRenderStocks, 10000);
};
ws.onclose = () => {
  setTimeout(fetchAndRenderStocks, 10000);
};