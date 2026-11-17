const profileForm = document.querySelector("#profile-form");
const displayNameInput = document.querySelector("#profile-display-name");
const accountName = document.querySelector("#account-name");
const historyEnabledInput = document.querySelector("#history-enabled");
const historyStatus = document.querySelector("#history-status");
const historyList = document.querySelector("#history-list");
const clearHistoryButton = document.querySelector("#clear-history-button");

const displayNameKey = "blueberryub.display-name";
const localHistoryKey = "blueberryub.local-history";
const historyPreferenceKey = "blueberryub.history-enabled";

function readHistory() {
  try {
    const value = JSON.parse(localStorage.getItem(localHistoryKey) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeHistory(entries) {
  try {
    localStorage.setItem(localHistoryKey, JSON.stringify(entries.slice(0, 100)));
  } catch (error) {
    historyStatus.textContent = "Could not save history: " + error.message;
  }
}

function renderHistory() {
  historyList.replaceChildren();
  const entries = readHistory();
  if (!entries.length) {
    historyStatus.textContent = "No saved visits yet.";
    return;
  }
  historyStatus.textContent = `${entries.length} recent visits`;
  for (const visit of entries) {
    const item = document.createElement("a");
    item.className = "history-item";
    item.href = `/browser.html?goto=${encodeURIComponent(visit.url)}`;
    const details = document.createElement("span");
    details.className = "history-item-details";
    const title = document.createElement("strong");
    title.textContent = visit.title || new URL(visit.url).hostname;
    const url = document.createElement("span");
    url.textContent = visit.url;
    details.append(title, url);
    const time = document.createElement("time");
    time.dateTime = visit.visited_at;
    time.textContent = new Date(visit.visited_at).toLocaleString();
    item.append(details, time);
    historyList.append(item);
  }
}

function renderProfile() {
  const name = localStorage.getItem(displayNameKey) || "Blueberry member";
  accountName.textContent = name;
  displayNameInput.value = localStorage.getItem(displayNameKey) || "";
  historyEnabledInput.checked = localStorage.getItem(historyPreferenceKey) !== "false";
  renderHistory();
}

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = displayNameInput.value.trim().slice(0, 40);
  if (name) localStorage.setItem(displayNameKey, name);
  else localStorage.removeItem(displayNameKey);
  accountName.textContent = name || "Blueberry member";
});

historyEnabledInput.addEventListener("change", () => {
  localStorage.setItem(historyPreferenceKey, String(historyEnabledInput.checked));
  historyStatus.textContent = historyEnabledInput.checked
    ? "History saving is on."
    : "History saving is paused.";
});

clearHistoryButton.addEventListener("click", () => {
  writeHistory([]);
  renderHistory();
});

window.addEventListener("storage", (event) => {
  if (event.key === localHistoryKey) renderHistory();
});

void renderProfile();
