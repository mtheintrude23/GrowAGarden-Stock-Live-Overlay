// == GrowAGarden Stock Live Overlay ==

const API_URL = "https://api.joshlei.com/v2/growagarden/stock";
const WS_URL = "wss://websocket.joshlei.com/growagarden/";

const overlay = document.createElement("div");
overlay.id = "gag-stock-overlay";
overlay.style.position = "fixed";
overlay.style.top = "40px";
overlay.style.right = "40px";
overlay.style.width = "420px";
overlay.style.maxHeight = "80vh";
overlay.style.zIndex = "2147483647";
overlay.style.background = "rgba(24, 28, 40, 0.75)";
overlay.style.backdropFilter = "blur(16px)";
overlay.style.borderRadius = "18px";
overlay.style.boxShadow = "0 8px 32px 0 rgba(0,0,0,0.18)";
overlay.style.overflowY = "auto";
overlay.style.padding = "24px 24px 16px 24px";
overlay.style.display = "flex";
overlay.style.flexDirection = "column";
overlay.style.gap = "8px";
overlay.style.transition = "opacity 0.3s";
overlay.style.userSelect = "none";
overlay.style.cursor = "move";

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
titleBar.innerHTML = `<span>GrowAGarden Stock Live</span>`;
overlay.insertBefore(titleBar, overlay.firstChild);

// Focus/blur transparency
let focused = true;
function setOverlayOpacity(focus) {
  overlay.style.opacity = focus ? "1" : "0.5";
}
setOverlayOpacity(true);
overlay.addEventListener("mouseenter", () => {
  focused = true;
  setOverlayOpacity(true);
  window.parent.postMessage("GAG_OVERLAY_FOCUS", "*");
});
overlay.addEventListener("mouseleave", () => {
  focused = false;
  setOverlayOpacity(false);
  window.parent.postMessage("GAG_OVERLAY_BLUR", "*");
});

// Drag logic
let drag = false, offsetX = 0, offsetY = 0;
overlay.addEventListener("mousedown", (e) => {
  if (e.target.closest("#gag-close-btn")) return;
  drag = true;
  offsetX = e.clientX - overlay.getBoundingClientRect().left;
  offsetY = e.clientY - overlay.getBoundingClientRect().top;
  document.body.style.userSelect = "none";
});
document.addEventListener("mousemove", (e) => {
  if (!drag) return;
  overlay.style.top = Math.max(0, e.clientY - offsetY) + "px";
  overlay.style.right = Math.max(0, window.innerWidth - (e.clientX + (overlay.offsetWidth - offsetX))) + "px";
});
document.addEventListener("mouseup", () => {
  drag = false;
  document.body.style.userSelect = "";
});

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
closeBtn.addEventListener("mouseenter", () => closeBtn.style.opacity = "1");
closeBtn.addEventListener("mouseleave", () => closeBtn.style.opacity = "0.7");
closeBtn.addEventListener("click", () => {
  window.parent.postMessage("GAG_OVERLAY_CLOSE", "*");
});
document.getElementById("gag-overlay-root").appendChild(closeBtn);

// Content
const content = document.createElement("div");
content.style.marginTop = "8px";
content.style.marginBottom = "12px";
content.style.width = "100%";
content.style.display = "flex";
content.style.flexDirection = "column";
content.style.gap = "16px";
overlay.appendChild(content);

// Credits
const credits = document.createElement("div");
credits.style.textAlign = "center";
credits.style.fontSize = "13px";
credits.style.color = "#b5e0b5";
credits.style.marginTop = "8px";
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
  groups.forEach(group => {
    const items = data[group.key] || [];
    if (!items.length) return;
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
}

// Loading spinner
content.innerHTML = '<div style="text-align:center;padding:32px 0;"><div style="width:32px;height:32px;border:4px solid #b5e0b5;border-top:4px solid transparent;border-radius:50%;margin:0 auto;animation:spin 1s linear infinite"></div><div style="margin-top:8px;color:#b5e0b5;font-weight:bold;">Loading stocks...</div></div>';
const style = document.createElement('style');
style.textContent = `@keyframes spin{to{transform:rotate(360deg)}}`;
document.head.appendChild(style);

// Fetch and update stocks
function fetchAndRenderStocks() {
  fetch(API_URL)
    .then(res => res.json())
    .then(renderStocks)
    .catch(() => {
      content.innerHTML = '<div style="color:#e57373;text-align:center;padding:24px 0;">Failed to load stocks.</div>';
    });
}
fetchAndRenderStocks();

// WebSocket for real-time updates
const ws = new window.WebSocket(WS_URL);
ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    renderStocks(data);
  } catch {}
};
ws.onerror = () => {
  // fallback to polling if needed
  setTimeout(fetchAndRenderStocks, 10000);
};
ws.onclose = () => {
  setTimeout(fetchAndRenderStocks, 10000);
}; 