(function () {
  var proxyKey = "blueberryub.static-proxy-settings";
  var sab = false;
  try {
    sab = typeof SharedArrayBuffer === "function" && new SharedArrayBuffer(8).byteLength === 8;
  } catch (error) {
    sab = false;
  }
  if (sab && self.crossOriginIsolated !== false) return;

  var reason = sab
    ? "This host is not cross-origin isolated, so SharedArrayBuffer is unavailable."
    : "Browser environment does not support SharedArrayBuffer.";

  try {
    var getItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function (key) {
      if (key === proxyKey) return '{"engine":"ultraviolet","transport":"epoxy"}';
      return getItem.apply(this, arguments);
    };
  } catch (error) {
    console.warn("Blueberry could not install the proxy fallback:", error);
  }

  var notice = null;
  function showNotice() {
    if (notice) return;
    var card = document.querySelector("#startup-screen .boot-card");
    if (!card) return;
    var screen = document.querySelector("#startup-screen");
    screen.dataset.state = "error";
    notice = document.createElement("div");
    notice.setAttribute("role", "alert");
    notice.setAttribute("data-blueberry-guard", "no-shared-array-buffer");
    notice.style.cssText = "margin-top:16px;padding:12px 13px;border:1px solid #e6b6b6;border-radius:8px;background:#fff5f4;color:#7d3030;font:11px/1.55 system-ui,sans-serif;text-align:left";
    var title = document.createElement("strong");
    title.style.cssText = "display:block;margin-bottom:5px;font-size:12px";
    title.textContent = "Proxy fallback active";
    var body = document.createElement("span");
    body.textContent = reason + " Please deploy locally or use a compatible host. Switched to the WebSocket (Wisp) transport automatically.";
    notice.appendChild(title);
    notice.appendChild(body);
    card.appendChild(notice);
    var retry = document.querySelector("#startup-retry");
    var offline = document.querySelector("#startup-continue");
    if (retry) retry.hidden = false;
    if (offline) offline.hidden = false;
  }

  if ("MutationObserver" in window) {
    var observer = new MutationObserver(function () {
      if (document.querySelector("#startup-screen .boot-card")) {
        observer.disconnect();
        showNotice();
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  document.addEventListener("DOMContentLoaded", showNotice, { once: true });
  setTimeout(function () {
    showNotice();
    var screen = document.querySelector("#startup-screen");
    if (screen && !screen.hidden) {
      var message = document.querySelector("#startup-message");
      if (message && message.textContent.indexOf("SharedArrayBuffer") === -1) {
        screen.dataset.state = "error";
        message.textContent = reason + " Please deploy locally or use a compatible host.";
      }
    }
  }, 60000);
})();
