const ICONS = {
  music: '<svg viewBox="0 0 24 24" fill="#E95420"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>',
  radio: '<svg viewBox="0 0 24 24" fill="#772953"><path d="M20 6H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2 2v2H6V8h12zm-8.5 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM21 4V2h-1.92L14 5H4v2h16V4z"/></svg>',
  podcasts: '<svg viewBox="0 0 24 24" fill="#dfdfdf"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>',
  nowplaying: '<svg viewBox="0 0 24 24" fill="#f05e2f"><circle cx="12" cy="12" r="10"/><path fill="#fff" d="M10 8l6 4-6 4z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="#a0a0a0"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="#E95420"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="#666"><path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/></svg>'
};

const APPS = [
  { id: "music", name: "Music", icon: ICONS.music, window: "window-nautilus" },
  { id: "radio", name: "Radio", icon: ICONS.radio, window: "window-nautilus" },
  { id: "podcasts", name: "Podcasts", icon: ICONS.podcasts, window: "window-nautilus" },
  { id: "nowplaying", name: "Now Playing", icon: ICONS.nowplaying, window: "window-rhythmbox" },
  { id: "settings", name: "Settings", icon: ICONS.settings, window: "window-settings" }
];

const state = {
  focus: "DOCK", // DOCK, NAUTILUS_SIDEBAR, NAUTILUS_MAIN, SETTINGS, RHYTHMBOX
  dockIndex: 0,
  activeWindowId: null,

  nautilusType: "music",
  nautilusSidebarIndex: 0,
  nautilusMainIndex: 0,
  nautilusItems: [],
  nautilusStack: [],

  settingsMode: "ROOT", // ROOT, THEMES, EQ
  settingsIndex: 0,
  settingsOptions: [],
  
  nowPlayback: null,
  nowTrack: null,
  ticker: null
};

function $(id) { return document.getElementById(id); }

function ensureVisible(li, container) {
  if (!li || !container) return;
  const liTop = li.offsetTop;
  const liBottom = liTop + li.offsetHeight;
  const cTop = container.scrollTop;
  const cBottom = cTop + container.clientHeight;

  if (liTop < cTop) {
    container.scrollTop = liTop;
  } else if (liBottom > cBottom) {
    container.scrollTop = liBottom - container.clientHeight;
  }
}

function clamp(val, max) {
  if (max <= 0) return 0;
  if (val < 0) return 0;
  if (val >= max) return max - 1;
  return val;
}

// === INIT ===
window.addEventListener("DOMContentLoaded", () => {
  renderDock();
  startClock();
  startNowPlayingTicker();
  refreshNowPlayingFromBridge();
  
  // Default Nautilus sidebar items depending on type
  renderNautilusSidebar();
});

function startClock() {
  setInterval(() => {
    const d = new Date();
    const str = d.toLocaleDateString("en-US", { weekday: 'short' }) + " " +
                d.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' });
    $("clock").innerText = str;
  }, 1000);
}

// === RENDERING ===
function renderDock() {
  const ul = $("dock-list");
  ul.innerHTML = "";
  APPS.forEach((app, i) => {
    const li = document.createElement("li");
    li.innerHTML = app.icon;
    li.title = app.name;
    if (i === state.dockIndex && state.focus === "DOCK") li.classList.add("focused");
    if (app.window === state.activeWindowId) li.classList.add("active");
    ul.appendChild(li);
  });
}

function openWindow(appId) {
  const app = APPS.find(a => a.id === appId);
  if (!app) return;

  // Hide all windows
  document.querySelectorAll(".window").forEach(w => w.classList.add("hidden"));
  document.querySelectorAll(".window").forEach(w => w.classList.remove("focused-window"));
  
  const win = $(app.window);
  win.classList.remove("hidden");
  win.classList.add("focused-window");
  
  state.activeWindowId = app.window;

  if (app.id === "music") {
    $("nautilus-title").innerText = "Music Explorer";
    state.nautilusType = "music";
    state.nautilusSidebarIndex = 0;
    state.focus = "NAUTILUS_SIDEBAR";
    renderNautilusSidebar();
  } else if (app.id === "radio") {
    $("nautilus-title").innerText = "Radio Stations";
    state.nautilusType = "radio";
    state.nautilusSidebarIndex = 3; // Radio
    state.focus = "NAUTILUS_SIDEBAR";
    renderNautilusSidebar();
    openNautilusSidebarItem();
  } else if (app.id === "podcasts") {
    $("nautilus-title").innerText = "Podcasts";
    state.nautilusType = "podcasts";
    state.nautilusSidebarIndex = 4; // Podcasts
    state.focus = "NAUTILUS_SIDEBAR";
    renderNautilusSidebar();
    openNautilusSidebarItem();
  } else if (app.id === "nowplaying") {
    state.focus = "RHYTHMBOX";
    refreshNowPlayingFromBridge();
  } else if (app.id === "settings") {
    state.focus = "SETTINGS";
    loadSettingsMenu("ROOT");
  }
  
  renderDock();
}

function closeWindow() {
  if (state.activeWindowId) {
    const win = $(state.activeWindowId);
    if (win) win.classList.add("hidden");
  }
  state.activeWindowId = null;
  state.focus = "DOCK";
  renderDock();
}

// === NAUTILUS LOGIC ===
const SIDEBAR_ITEMS = [
  { name: "Folders", key: "folders" },
  { name: "Albums", key: "albums" },
  { name: "All Songs", key: "songs" },
  { name: "Radio", key: "radio" },
  { name: "Podcasts", key: "podcasts" }
];

function renderNautilusSidebar() {
  const ul = $("nautilus-sidebar");
  ul.innerHTML = "";
  SIDEBAR_ITEMS.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerText = item.name;
    if (i === state.nautilusSidebarIndex && state.focus === "NAUTILUS_SIDEBAR") {
      li.classList.add("selected-sidebar");
      setTimeout(() => ensureVisible(li, ul), 0);
    }
    ul.appendChild(li);
  });
}

async function openNautilusSidebarItem() {
  const item = SIDEBAR_ITEMS[state.nautilusSidebarIndex];
  $("nautilus-header").innerText = item.name;
  state.nautilusMainIndex = 0;
  state.nautilusItems = [];
  state.nautilusStack = ["ROOT"];
  state.focus = "NAUTILUS_MAIN";
  
  $("nautilus-hint").innerText = "Loading...";
  renderNautilusList();
  renderNautilusSidebar();

  try {
    if (item.key === "folders") {
      const rows = await Bridge.getFolderListingAsync("ROOT");
      state.nautilusItems = normalizeRows(rows);
    } else if (item.key === "albums") {
      const rows = await Bridge.getAlbumsPaginatedAsync(0, 200, null);
      state.nautilusItems = normalizeRows(rows);
    } else if (item.key === "songs") {
      const rows = await Bridge.getSongsPaginatedAsync(0, 200);
      state.nautilusItems = normalizeRows(rows);
    } else if (item.key === "radio") {
      const rows = await Bridge.getRadioStationsAsync();
      state.nautilusItems = normalizeRows(rows);
    } else if (item.key === "podcasts") {
      const rows = await Bridge.getPodcastsAsync();
      state.nautilusItems = normalizeRows(rows);
    }
    $("nautilus-hint").innerText = state.nautilusItems.length + " items";
  } catch (e) {
    $("nautilus-hint").innerText = "Error loading";
  }
  renderNautilusList();
}

function normalizeRows(payload) {
  const rows = Array.isArray(payload) ? payload : (payload && Array.isArray(payload.items) ? payload.items : []);
  return rows.map((row) => ({
    ...row,
    isDirectory: row.type === "folder" || row.isDirectory === true,
    name: row.name || row.title || row.path || "Untitled"
  }));
}

function renderNautilusList() {
  const ul = $("nautilus-list");
  ul.innerHTML = "";
  if (!state.nautilusItems || state.nautilusItems.length === 0) {
    return;
  }
  
  state.nautilusItems.forEach((item, i) => {
    const li = document.createElement("li");
    const iconStr = item.isDirectory ? ICONS.folder : (item.artist ? ICONS.music : ICONS.file);
    let html = `<span class="list-icon">${iconStr}</span> <span class="list-text">${item.name}`;
    if (item.artist) html += ` — <span class="list-artist">${item.artist}</span>`;
    html += `</span>`;
    li.innerHTML = html;
    
    if (i === state.nautilusMainIndex && state.focus === "NAUTILUS_MAIN") {
      li.classList.add("focused-item");
      setTimeout(() => ensureVisible(li, ul), 0);
    }
    ul.appendChild(li);
  });
}

async function selectNautilusMainContent() {
  const item = state.nautilusItems[state.nautilusMainIndex];
  if (!item) return;

  const key = SIDEBAR_ITEMS[state.nautilusSidebarIndex].key;
  
  if (item.isDirectory && key === "folders") {
    // Navigate into folder
    const path = item.path || item.name;
    state.nautilusStack.push(path);
    $("nautilus-header").innerText = "Folders: " + path;
    $("nautilus-hint").innerText = "Loading...";
    state.nautilusItems = [];
    state.nautilusMainIndex = 0;
    renderNautilusList();
    
    try {
      const rows = await Bridge.getFolderListingAsync(path);
      state.nautilusItems = normalizeRows(rows);
      $("nautilus-hint").innerText = state.nautilusItems.length + " items";
    } catch (e) { $("nautilus-hint").innerText = "Error"; }
    renderNautilusList();
    return;
  }
  
  // Play item
  if (key === "albums") Bridge.playAlbum(item.id || item.name, 0, false);
  else if (key === "songs" || key === "folders") Bridge.playSong(item.id);
  else if (key === "radio") Bridge.playRadio(item.id);
  else if (key === "podcasts") Bridge.playEpisode(item.id); // Or podcast? Just a demo.
  
  // Open Rhythmbox after play
  openWindow("nowplaying");
}

function backNautilusMainContent() {
  const key = SIDEBAR_ITEMS[state.nautilusSidebarIndex].key;
  if (key === "folders" && state.nautilusStack.length > 1) {
    state.nautilusStack.pop();
    const path = state.nautilusStack[state.nautilusStack.length - 1];
    $("nautilus-header").innerText = path === "ROOT" ? "Folders" : "Folders: " + path;
    Bridge.getFolderListingAsync(path).then(rows => {
      state.nautilusItems = normalizeRows(rows);
      state.nautilusMainIndex = 0;
      $("nautilus-hint").innerText = state.nautilusItems.length + " items";
      renderNautilusList();
    });
    return;
  }
  // Otherwise switch back to sidebar
  state.focus = "NAUTILUS_SIDEBAR";
  renderNautilusSidebar();
  renderNautilusList(); // removes focus highlight from list
}

// === SETTINGS LOGIC ===
const SETTINGS_ROOT = [
  { name: "Toggle Shuffle", action: "shuffle" },
  { name: "Switch Theme", action: "themes" },
  { name: "Equalizer Presets", action: "eq" },
  { name: "Refresh Library", action: "refresh" },
  { name: "Import Theme", action: "import" },
  { name: "Set Sleep Timer", action: "sleep" },
  { name: "System Info", action: "info" }
];

async function loadSettingsMenu(mode) {
  state.settingsMode = mode;
  state.settingsIndex = 0;
  state.settingsOptions = [];
  
  if (mode === "ROOT") {
    $("settings-header").innerText = "Settings";
    state.settingsOptions = SETTINGS_ROOT;
  } else if (mode === "THEMES") {
    $("settings-header").innerText = "Settings > Themes";
    try {
      const themesRaw = typeof Bridge.getAvailableThemes === "function" ? Bridge.getAvailableThemes() : [];
      const parsed = typeof themesRaw === 'string' ? JSON.parse(themesRaw) : themesRaw;
      const themesArray = Array.isArray(parsed) ? parsed : [];
      state.settingsOptions = themesArray.map(t => ({ name: t, action: "apply_theme" }));
    } catch(e) { state.settingsOptions = []; }
  } else if (mode === "EQ") {
    $("settings-header").innerText = "Settings > Equalizer";
    try {
      const eqRaw = typeof Bridge.getEqPresets === "function" ? Bridge.getEqPresets() : [];
      let parsed = typeof eqRaw === 'string' ? JSON.parse(eqRaw) : eqRaw;
      // Fallback if empty array (simulator uses Async)
      if ((!parsed || parsed.length === 0) && typeof Bridge.getEqPresetsAsync === "function") {
          const asyncRaw = await Bridge.getEqPresetsAsync();
          parsed = typeof asyncRaw === 'string' ? JSON.parse(asyncRaw) : asyncRaw;
      }
      const eqArray = Array.isArray(parsed) ? parsed : [];
      state.settingsOptions = eqArray.map((pre, i) => ({ name: pre, action: "apply_eq", index: i }));
    } catch(e) { state.settingsOptions = []; }
  }
  
  renderSettings();
}

function renderSettings() {
  const ul = $("settings-list");
  ul.innerHTML = "";
  if (!state.settingsOptions) return;
  state.settingsOptions.forEach((opt, i) => {
    const li = document.createElement("li");
    li.innerText = opt.name;
    if (i === state.settingsIndex && state.focus === "SETTINGS") {
      li.classList.add("focused-item");
      setTimeout(() => ensureVisible(li, ul), 0);
    }
    ul.appendChild(li);
  });
}

function selectSettings() {
  const opt = state.settingsOptions[state.settingsIndex];
  if (!opt) return;

  if (state.settingsMode === "ROOT") {
    if (opt.action === "shuffle") { Bridge.toggleShuffle(); }
    else if (opt.action === "themes") { loadSettingsMenu("THEMES"); }
    else if (opt.action === "eq") { loadSettingsMenu("EQ"); }
    else if (opt.action === "refresh") { if(Bridge.refreshLibrary) Bridge.refreshLibrary(); }
    else if (opt.action === "import") { if(Bridge.requestImportTheme) Bridge.requestImportTheme(); }
    else if (opt.action === "sleep") {
      const min = prompt("Enter sleep timer minutes:", "30");
      if (min && !isNaN(min) && Bridge.setSleepTimer) Bridge.setSleepTimer(parseInt(min));
    }
    else if (opt.action === "info") {
      const v = typeof Bridge.getAppVersion === 'function' ? Bridge.getAppVersion() : "Unknown";
      alert("oPlayer Version: " + v);
    }
  } else if (state.settingsMode === "THEMES") {
    if (opt.action === "apply_theme" && Bridge.setTheme) {
      Bridge.setTheme(opt.name);
    }
  } else if (state.settingsMode === "EQ") {
    if (opt.action === "apply_eq" && Bridge.useEqPreset) {
      Bridge.useEqPreset(opt.index);
    }
  }
}

function backSettings() {
  if (state.settingsMode !== "ROOT") {
    loadSettingsMenu("ROOT");
  } else {
    closeWindow();
  }
}

// === RHYTHMBOX LOGIC ===
function updateNowPlaying(playback, track) {
  if (track) {
    state.nowTrack = track;
    $("track-title").innerText = track.title || "Unknown Title";
    $("track-artist").innerText = track.artist || "Unknown Artist";
    const art = $("album-art");
    if (track.art) {
      art.src = track.art;
      art.classList.remove("hidden");
    } else {
      art.classList.add("hidden");
    }
  }
  if (playback) state.nowPlayback = playback;
  
  const p = state.nowPlayback;
  if (!p || !p.duration) return;
  const pct = Math.min(100, Math.max(0, (p.position / p.duration) * 100));
  $("progress-bar").style.width = pct + "%";
  
  const msToClock = ms => {
    const sec = Math.floor((ms || 0) / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };
  $("time").innerText = `${msToClock(p.position)} / ${msToClock(p.duration)}`;
}

function refreshNowPlayingFromBridge() {
  if (Bridge.getPlaybackState && Bridge.getCurrentTrack) {
    const stateStr = Bridge.getPlaybackState();
    const currStr = Bridge.getCurrentTrack();
    if (stateStr) updateNowPlaying(typeof stateStr === 'string' ? JSON.parse(stateStr) : stateStr, null);
    if (currStr) updateNowPlaying(null, typeof currStr === 'string' ? JSON.parse(currStr) : currStr);
  }
}

function startNowPlayingTicker() {
  setInterval(() => {
    if (state.nowPlayback && state.nowPlayback.isPlaying) {
      state.nowPlayback.position += 1000;
      updateNowPlaying(state.nowPlayback, null);
    }
    refreshNowPlayingFromBridge();
  }, 1000);
}

// === GLOBAL INPUT HOOKS ===
function handleScroll(d) {
  Bridge.triggerHaptic("tick");
  if (state.focus === "DOCK") {
    state.dockIndex = clamp(state.dockIndex + d, APPS.length);
    renderDock();
  } else if (state.focus === "NAUTILUS_SIDEBAR") {
    state.nautilusSidebarIndex = clamp(state.nautilusSidebarIndex + d, SIDEBAR_ITEMS.length);
    renderNautilusSidebar();
  } else if (state.focus === "NAUTILUS_MAIN") {
    state.nautilusMainIndex = clamp(state.nautilusMainIndex + d, state.nautilusItems.length);
    renderNautilusList();
  } else if (state.focus === "SETTINGS") {
    state.settingsIndex = clamp(state.settingsIndex + d, state.settingsOptions.length);
    renderSettings();
  }
}

function handleSelect() {
  Bridge.triggerHaptic("heavy");
  if (state.focus === "DOCK") {
    const app = APPS[state.dockIndex];
    openWindow(app.id);
  } else if (state.focus === "NAUTILUS_SIDEBAR") {
    openNautilusSidebarItem();
  } else if (state.focus === "NAUTILUS_MAIN") {
    selectNautilusMainContent();
  } else if (state.focus === "SETTINGS") {
    selectSettings();
  } else if (state.focus === "RHYTHMBOX") {
    Bridge.togglePlayPause();
  }
}

function handleBack() {
  if (state.focus === "DOCK") return;
  
  if (state.focus === "NAUTILUS_MAIN") {
    backNautilusMainContent();
  } else if (state.focus === "SETTINGS") {
    backSettings();
  } else if (state.focus === "NAUTILUS_SIDEBAR" || state.focus === "RHYTHMBOX") {
    closeWindow();
  }
}

function handleLeft() {
  if (state.focus === "NAUTILUS_MAIN") handleBack();
  else Bridge.previous();
}

function handleRight() {
  if (state.focus === "NAUTILUS_SIDEBAR") handleSelect();
  else Bridge.next();
}

window.handleScroll = handleScroll;
window.handleSelect = handleSelect;
window.handleBack = handleBack;
window.handleLeft = handleLeft;
window.handleRight = handleRight;
window.onPlaybackUpdate = (p, t) => updateNowPlaying(p, t);
