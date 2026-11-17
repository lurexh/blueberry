const hub = document.querySelector(".hub");
const logoFrame = document.querySelector(".logo-frame");
const privateToggle = document.querySelector("#private-default-toggle");
const browserLink = document.querySelector(".browser-option");
const privateDefaultKey = "blueberryub.private-default";

if (privateToggle && browserLink) {
  privateToggle.checked = localStorage.getItem(privateDefaultKey) === "true";

  const updateBrowserLink = () => {
    browserLink.href = privateToggle.checked ? "/browser.html?private=1" : "/browser.html";
  };

  privateToggle.addEventListener("change", () => {
    localStorage.setItem(privateDefaultKey, String(privateToggle.checked));
    updateBrowserLink();
  });

  updateBrowserLink();
}

const countdown = document.querySelector("#christmas-countdown");
if (countdown) {
  const now = new Date();
  if (now.getMonth() === 11 && now.getDate() === 25) {
    countdown.textContent = "Merry Christmas!";
  } else {
    const christmas = new Date(now.getFullYear(), 11, 25);
    if (now > christmas) christmas.setFullYear(now.getFullYear() + 1);
    const days = Math.ceil((christmas - now) / 86400000);
    countdown.textContent = days === 1 ? "1 day until Christmas" : `${days} days until Christmas`;
  }
  countdown.hidden = false;
}

function berryParty() {
  if (document.querySelector(".berry-party")) return;
  const layer = document.createElement("div");
  layer.className = "berry-party";
  layer.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 36; i++) {
    const hat = document.createElement("span");
    hat.style.left = `${Math.random() * 100}vw`;
    hat.style.animationDuration = `${2.4 + Math.random() * 2.4}s`;
    hat.style.animationDelay = `${Math.random() * 1.8}s`;
    hat.style.width = hat.style.height = `${18 + Math.random() * 22}px`;
    layer.append(hat);
  }
  document.body.append(layer);
  window.setTimeout(() => layer.remove(), 6500);
}

const konamiSequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiIndex = 0;
document.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  konamiIndex = key === konamiSequence[konamiIndex] ? konamiIndex + 1 : key === konamiSequence[0] ? 1 : 0;
  if (konamiIndex === konamiSequence.length) {
    konamiIndex = 0;
    berryParty();
  }
});

let logoClicks = 0;
let logoClickTimer = 0;
if (logoFrame) {
  logoFrame.addEventListener("click", () => {
    const now = Date.now();
    logoClicks = now - logoClickTimer < 1600 ? logoClicks + 1 : 1;
    logoClickTimer = now;
    if (logoClicks >= 7) {
      logoClicks = 0;
      berryParty();
    }
  });
}

if (hub && logoFrame && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  hub.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;

    const bounds = hub.getBoundingClientRect();
    const offsetX = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
    const offsetY = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);
    logoFrame.style.setProperty("--logo-x", `${Math.max(-10, Math.min(10, offsetX * 10))}px`);
    logoFrame.style.setProperty("--logo-y", `${Math.max(-10, Math.min(10, offsetY * 10))}px`);
  });

  hub.addEventListener("pointerleave", () => {
    logoFrame.style.setProperty("--logo-x", "0px");
    logoFrame.style.setProperty("--logo-y", "0px");
  });
}