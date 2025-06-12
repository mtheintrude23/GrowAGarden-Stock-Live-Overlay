// Inject overlay only once
if (!window.__GAG_OVERLAY__) {
    window.__GAG_OVERLAY__ = true;
  
    // Create iframe overlay
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('overlay.html');
    iframe.style.position = 'fixed';
    iframe.style.top = '40px';
    iframe.style.right = '40px';
    iframe.style.width = '440px';
    iframe.style.height = '80vh';
    iframe.style.zIndex = '999999';
    iframe.style.border = 'none';
    iframe.style.background = 'transparent';
    iframe.style.pointerEvents = 'auto';
    iframe.style.transition = 'opacity 0.3s';
    iframe.id = 'gag-stock-overlay-iframe';
  
    document.body.appendChild(iframe);
  
    // Listen for close event from overlay
    window.addEventListener('message', (event) => {
      if (event.data === 'GAG_OVERLAY_CLOSE') {
        iframe.remove();
      }
      if (event.data === 'GAG_OVERLAY_BLUR') {
        iframe.style.opacity = '0.5';
      }
      if (event.data === 'GAG_OVERLAY_FOCUS') {
        iframe.style.opacity = '1';
      }
    });
  }