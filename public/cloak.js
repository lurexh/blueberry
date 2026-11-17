const cloakPrefix = "blueberryub.cloak.";

const CLOAK_PRESETS = {
  none: { name: "No cloak" },
  google: { name: "Google", title: "Google", icon: "https://www.google.com/s2/favicons?domain=google.com&sz=64" },
  gdocs: { name: "Google Docs", title: "Untitled document - Google Docs", icon: "https://www.google.com/s2/favicons?domain=docs.google.com&sz=64" },
  gslides: { name: "Google Slides", title: "Untitled presentation - Google Slides", icon: "https://www.google.com/s2/favicons?domain=docs.google.com&sz=64" },
  gsheets: { name: "Google Sheets", title: "Untitled spreadsheet - Google Sheets", icon: "https://www.google.com/s2/favicons?domain=docs.google.com&sz=64" },
  classroom: { name: "Google Classroom", title: "Home - Google Classroom", icon: "https://www.google.com/s2/favicons?domain=classroom.google.com&sz=64" },
  drive: { name: "Google Drive", title: "My Drive - Google Drive", icon: "https://www.google.com/s2/favicons?domain=drive.google.com&sz=64" },
  gmail: { name: "Gmail", title: "Inbox (1) - Gmail", icon: "https://www.google.com/s2/favicons?domain=gmail.com&sz=64" },
  canvas: { name: "Canvas", title: "Dashboard", icon: "https://www.google.com/s2/favicons?domain=instructure.com&sz=64" },
  clever: { name: "Clever", title: "Clever | Portal", icon: "https://www.google.com/s2/favicons?domain=clever.com&sz=64" },
  khan: { name: "Khan Academy", title: "Dashboard | Khan Academy", icon: "https://www.google.com/s2/favicons?domain=khanacademy.org&sz=64" },
  desmos: { name: "Desmos", title: "Desmos | Graphing Calculator", icon: "https://www.google.com/s2/favicons?domain=desmos.com&sz=64" },
  wikipedia: { name: "Wikipedia", title: "Wikipedia, the free encyclopedia", icon: "https://www.google.com/s2/favicons?domain=wikipedia.org&sz=64" },
  quizlet: { name: "Quizlet", title: "Flashcards - Quizlet", icon: "https://www.google.com/s2/favicons?domain=quizlet.com&sz=64" },
  powerschool: { name: "PowerSchool", title: "PowerSchool SIS", icon: "https://www.google.com/s2/favicons?domain=powerschool.com&sz=64" },
  discord: { name: "Discord", title: "Discord", icon: "https://www.google.com/s2/favicons?domain=discord.com&sz=64" },
  youtube: { name: "YouTube", title: "YouTube", icon: "https://www.google.com/s2/favicons?domain=youtube.com&sz=64" },
  spotify: { name: "Spotify", title: "Spotify - Web Player: Music for everyone", icon: "https://www.google.com/s2/favicons?domain=spotify.com&sz=64" },
  netflix: { name: "Netflix", title: "Netflix", icon: "https://www.google.com/s2/favicons?domain=netflix.com&sz=64" },
  coolmath: { name: "Coolmath Games", title: "Coolmath Games", icon: "https://www.google.com/s2/favicons?domain=coolmathgames.com&sz=64" },
  chatgpt: { name: "ChatGPT", title: "ChatGPT", icon: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=64" },
  canva: { name: "Canva", title: "Canva", icon: "https://www.google.com/s2/favicons?domain=canva.com&sz=64" },
  duolingo: { name: "Duolingo", title: "Duolingo - Learn a language for free", icon: "https://www.google.com/s2/favicons?domain=duolingo.com&sz=64" },
  newtab: { name: "Blank tab", title: "New Tab", icon: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" },
  custom: { name: "Custom" },
};

const cloak = {
  get enabled() { return localStorage.getItem(cloakPrefix + "enabled") === "true"; },
  set enabled(value) { localStorage.setItem(cloakPrefix + "enabled", String(Boolean(value))); },
  get preset() { return localStorage.getItem(cloakPrefix + "preset") || "none"; },
  set preset(value) { localStorage.setItem(cloakPrefix + "preset", value); },
  get swallow() { return localStorage.getItem(cloakPrefix + "swallow") === "true"; },
  set swallow(value) { localStorage.setItem(cloakPrefix + "swallow", String(Boolean(value))); },
  get panicKey() { return localStorage.getItem(cloakPrefix + "panic-key") || "`"; },
  set panicKey(value) { localStorage.setItem(cloakPrefix + "panic-key", value.slice(0, 1) || "`"); },
  get panicUrl() { return localStorage.getItem(cloakPrefix + "panic-url") || "https://www.google.com"; },
  set panicUrl(value) { localStorage.setItem(cloakPrefix + "panic-url", value.trim() || "https://www.google.com"); },
  get customTitle() { return localStorage.getItem(cloakPrefix + "custom-title") || ""; },
  set customTitle(value) { localStorage.setItem(cloakPrefix + "custom-title", value); },
  get customIcon() { return localStorage.getItem(cloakPrefix + "custom-icon") || ""; },
  set customIcon(value) { localStorage.setItem(cloakPrefix + "custom-icon", value.trim()); },
};

function cloakResolvePreset(id = cloak.preset) {
  const preset = CLOAK_PRESETS[id] || CLOAK_PRESETS.none;
  if (id === "custom") {
    return {
      name: "Custom",
      title: cloak.customTitle || "Google",
      icon: cloak.customIcon || "https://www.google.com/s2/favicons?domain=google.com&sz=64",
    };
  }
  return preset;
}

const cloakWindows = new Set();

function cloakPageScript(panicKey) {
  const apply = () => {
    const closeAt = Number(localStorage.getItem("blueberryub.cloak.closeAt")) || 0;
    if (closeAt && Date.now() >= closeAt) {
      localStorage.setItem("blueberryub.cloak.closeAt", "0");
      window.close();
      window.setTimeout(() => window.location.replace(localStorage.getItem("blueberryub.cloak.panic-url") || "https://www.google.com"), 150);
    }
  };
  setInterval(apply, 400);
  window.addEventListener("keydown", (event) => {
    if (event.key === panicKey) {
      localStorage.setItem("blueberryub.cloak.closeAt", String(Date.now()));
    }
  });
}

function cloakOpen(targetUrl = window.location.href) {
  if (window.top !== window.self) return null;
  const preset = cloakResolvePreset();
  if (!preset.title) return null;
  const win = window.open("about:blank", "_blank");
  if (!win) return null;
  const panicKey = cloak.panicKey.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const frameUrl = new URL(targetUrl, window.location.href).href;
  win.document.write(
    "<!doctype html><html><head><title>" + preset.title.replace(/</g, "&lt;") + "</title>" +
    '<link rel="icon" href="' + preset.icon.replace(/"/g, "&quot;") + '" />' +
    '<style>html,body{margin:0;height:100%;overflow:hidden;background:#fff}iframe{border:0;width:100%;height:100%;display:block}</style>' +
    "</head><body><iframe src=\"" + frameUrl.replace(/"/g, "&quot;") + '" allow="fullscreen"></iframe><script>(' +
    cloakPageScript.toString() + ')("' + panicKey + '")<' + "/script></body></html>"
  );
  win.document.close();
  cloakWindows.add(win);
  try { win.focus(); } catch {}
  return win;
}

function cloakApplyTab() {
  const preset = cloakResolvePreset();
  if (!preset.title) return;
  document.title = preset.title;
  const icon = preset.icon;
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.append(link);
  }
  link.href = icon;
}

function cloakPanic() {
  localStorage.setItem(cloakPrefix + "closeAt", String(Date.now()));
  for (const win of cloakWindows) {
    try { win.close(); } catch {}
  }
  cloakWindows.clear();
  window.location.replace(cloak.panicUrl);
}

function cloakSetup() {
  if (window.top !== window.self) return;

  document.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    if (event.key === cloak.panicKey) cloakPanic();
  });

  cloakApplyTab();

  const toggle = document.querySelector("#private-default-toggle");
  if (toggle) {
    toggle.checked = cloak.enabled;
    toggle.addEventListener("change", () => {
      cloak.enabled = toggle.checked;
      if (toggle.checked) {
        const win = cloakOpen();
        if (win && cloak.swallow) window.location.replace(cloak.panicUrl);
        if (!win) {
          const openOnce = () => {
            cloakOpen();
            if (cloak.swallow) window.location.replace(cloak.panicUrl);
          };
          window.addEventListener("pointerdown", openOnce, { once: true });
          window.addEventListener("keydown", openOnce, { once: true });
        }
      }
    });
  }

  if (!cloak.enabled || cloak.preset === "none") return;

  const win = cloakOpen();
  if (win) {
    if (cloak.swallow) window.location.replace(cloak.panicUrl);
  } else {
    let opened = false;
    const openOnce = () => {
      if (opened) return;
      opened = true;
      cloakOpen();
      if (cloak.swallow) window.location.replace(cloak.panicUrl);
    };
    window.addEventListener("pointerdown", openOnce, { once: true });
    window.addEventListener("keydown", openOnce, { once: true });
  }
}

window.BLUEBERRY_CLOAK = { cloak, presets: CLOAK_PRESETS, open: cloakOpen, applyTab: cloakApplyTab, panic: cloakPanic, resolve: cloakResolvePreset };

window.addEventListener("DOMContentLoaded", cloakSetup, { once: true });
