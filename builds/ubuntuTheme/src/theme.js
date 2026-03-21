const ICONS = {
  music: '<svg viewBox="0 0 24 24" fill="#E95420"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>',
  radio: '<svg viewBox="0 0 24 24" fill="#772953"><path d="M20 6H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2 2v2H6V8h12zm-8.5 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM21 4V2h-1.92L14 5H4v2h16V4z"/></svg>',
  podcasts: '<svg viewBox="0 0 24 24" fill="#dfdfdf"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>',
  nowplaying: '<svg viewBox="0 0 24 24" fill="#f05e2f"><circle cx="12" cy="12" r="10"/><path fill="#fff" d="M10 8l6 4-6 4z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="#a0a0a0"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
  folder: '<svg viewBox="0 0 24 24"><path fill="#E95420" d="M20 18H4V8h16v10z"/><path fill="#F47421" d="M4 6h6l2 2h8v10H4V6z"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="#666"><path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/></svg>'
};

const APPS = [
  { id: "music", name: "Music", icon: ICONS.music, window: "window-music" },
  { id: "radio", name: "Radio", icon: ICONS.radio, window: "window-radio" },
  { id: "podcasts", name: "Podcasts", icon: ICONS.podcasts, window: "window-podcasts" },
  { id: "nowplaying", name: "Now Playing", icon: ICONS.nowplaying, window: "window-rhythmbox" },
  { id: "settings", name: "Settings", icon: ICONS.settings, window: "window-settings" }
];

const state = {
  focus: "DOCK", // DOCK, NAUTILUS_SIDEBAR, NAUTILUS_MAIN, SETTINGS, RHYTHMBOX
  dockIndex: 0,
  activeWindowId: null,
  openedWindowIds: [], // Track all windows that should have a dock dot

  // Independent explorer states
  explorer: {
    music: { sidebarIndex: 0, mainIndex: 0, items: [], stack: [], header: "Folders" },
    radio: { sidebarIndex: 0, mainIndex: 0, items: [], stack: [], header: "Stations" },
    podcasts: { sidebarIndex: 0, mainIndex: 0, items: [], stack: [], header: "Podcasts" }
  },
  currentAppId: "music", // The app currently being viewed/focused

  lastEqName: null,

  settingsMode: "ROOT", // ROOT, THEMES, EQ
  settingsIndex: 0,
  settingsOptions: [],
  
  nowPlayback: null,
  nowTrack: null,
  ticker: null
};

function $(id) { return document.getElementById(id); }
function show(id) { $(id).classList.remove("hidden"); }
function hide(id) { $(id).classList.add("hidden"); }

function showLoading(text) {
  $("loading-status").innerText = text || "Loading...";
  document.querySelector(".topbar-center").classList.add("loading-active");
}
function hideLoading() {
  document.querySelector(".topbar-center").classList.remove("loading-active");
}

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
  startVolumeWatcher();
  refreshNowPlayingFromBridge();
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
    // Glow dot if window is opened
    if (state.openedWindowIds.includes(app.window)) li.classList.add("active");
    // Pulse/Outline if focused
    if (app.window === state.activeWindowId) li.classList.add("focused-app");
    ul.appendChild(li);
  });
}

function openWindow(appId) {
  const app = APPS.find(a => a.id === appId);
  if (!app) return;

  // Add to opened list
  if (!state.openedWindowIds.includes(app.window)) {
    state.openedWindowIds.push(app.window);
  }

  // De-focus all windows
  document.querySelectorAll(".window").forEach(w => w.classList.remove("focused-window"));
  
  const win = $(app.window);
  win.classList.remove("hidden");
  win.classList.add("focused-window");
  
  state.activeWindowId = app.window;
  state.currentAppId = app.id;

  if (app.id === "music" || app.id === "radio" || app.id === "podcasts") {
    state.focus = "NAUTILUS_MAIN";
    initializeExplorer(app.id);
  } else if (app.id === "nowplaying") {
    state.focus = "RHYTHMBOX";
    refreshNowPlayingFromBridge();
  } else if (app.id === "settings") {
    state.focus = "SETTINGS";
    loadSettingsMenu("ROOT");
  }
  
  renderDock();
}

function closeWindow(appId) {
  const targetId = appId || state.currentAppId;
  const app = APPS.find(a => a.id === targetId);
  if (!app) return;

  const win = $(app.window);
  if (win) {
    win.classList.add("hidden");
    win.classList.remove("focused-window");
  }

  state.openedWindowIds = state.openedWindowIds.filter(id => id !== app.window);
  
  if (state.activeWindowId === app.window) {
    state.activeWindowId = null;
    state.focus = "DOCK";
  }
  
  renderDock();
}

// === EXPLORER LOGIC ===
const MUSIC_CATEGORIES = [
  { name: "Folders", key: "folders", type: "category" },
  { name: "Albums", key: "albums", type: "category" },
  { name: "All Songs", key: "songs", type: "category" }
];

function initializeExplorer(appId) {
  const exp = state.explorer[appId];
  exp.stack = ["ROOT"];
  exp.mainIndex = 0;
  
  if (appId === "music") {
    exp.items = MUSIC_CATEGORIES;
    exp.header = "Music";
    renderNautilusMainContent(appId);
  } else if (appId === "radio") {
    exp.header = "Radio Stations";
    fetchExplorerData(appId, "radio");
  } else if (appId === "podcasts") {
    exp.header = "Podcasts";
    fetchExplorerData(appId, "podcasts");
  }
}

async function fetchExplorerData(appId, type, path) {
  const exp = state.explorer[appId];
  exp.mainIndex = 0;
  $(appId + "-hint").innerText = "Loading...";
  renderNautilusMainContent(appId);
  
  try {
    let rows = [];
    if (type === "folders") rows = await Bridge.getFolderListingAsync(path || "ROOT");
    else if (type === "albums") rows = await Bridge.getAlbumsPaginatedAsync(0, 200, null);
    else if (type === "songs") rows = await Bridge.getSongsPaginatedAsync(0, 200);
    else if (type === "radio") rows = await Bridge.getRadioStationsAsync();
    else if (type === "podcasts") rows = await Bridge.getPodcastsAsync();
    
    exp.items = normalizeRows(rows);
    $(appId + "-hint").innerText = exp.items.length + (type === "songs" ? " tracks" : " items");
  } catch (e) {
    $(appId + "-hint").innerText = "Error loading";
  }
  renderNautilusMainContent(appId);
}

function updateNautilusHighlight(appId) {
  const id = appId || state.currentAppId;
  const exp = state.explorer[id];
  const ul = $(id + "-list");
  if (!ul) return;
  const items = ul.children;
  for (let i = 0; i < items.length; i++) {
    if (i === exp.mainIndex) {
      items[i].classList.add("focused-item");
      ensureVisible(items[i], ul);
    } else {
      items[i].classList.remove("focused-item");
    }
  }
}

function renderNautilusMainContent(appId) {
  const id = appId || state.currentAppId;
  const exp = state.explorer[id];
  const ul = $(id + "-list");
  if (!ul) return;
  ul.innerHTML = "";

  const context = exp.stack[1] || (id === "radio" ? "radio" : (id === "podcasts" ? "podcasts" : "folders"));

  // Grid for: root categories, folders (directories only), albums, podcasts top-level
  // List for: songs, songs_by_album, radio, episodes_by_podcast, mixed folder contents
  const isRootCategories = exp.stack.length === 1 && id === "music";
  const hasFiles = exp.items.some(item => !item.isDirectory && item.type !== "category");
  const isGridView = isRootCategories
    || (context === "folders" && !hasFiles)
    || (context === "albums" && exp.stack.length === 2)
    || (id === "podcasts" && exp.stack.length === 1);

  if (isGridView) ul.classList.add("grid-view");
  else ul.classList.remove("grid-view");

  exp.items.forEach((item, i) => {
    const li = document.createElement("li");

    if (isGridView) {
      let icon;
      if (item.type === "category") {
        if (item.key === "folders") icon = ICONS.folder;
        else if (item.key === "albums") icon = ICONS.music;
        else icon = ICONS.music; // "All Songs" category
      } else if (context === "folders") {
        icon = ICONS.folder;
      } else if (context === "albums") {
        icon = (item.art) ? `<img src="${item.art}" class="grid-art" />` : ICONS.music;
      } else if (id === "podcasts") {
        icon = (item.art) ? `<img src="${item.art}" class="grid-art" />` : ICONS.podcasts;
      } else {
        icon = ICONS.folder;
      }
      li.innerHTML = `<div class="item-icon">${icon}</div><div class="item-name" title="${item.name}">${item.name}</div>`;
    } else {
      let iconStr;
      if (id === "radio") {
        iconStr = ICONS.radio;
      } else if (id === "podcasts") {
        iconStr = ICONS.podcasts;
      } else if (context === "folders") {
        iconStr = item.isDirectory ? ICONS.folder : ICONS.music;
      } else {
        // songs, songs_by_album, and any other music list
        iconStr = ICONS.music;
      }
      let html = `<span class="list-icon">${iconStr}</span> <span class="list-text" title="${item.name}">${item.name}`;
      if (item.artist) html += ` — <span class="list-artist">${item.artist}</span>`;
      html += `</span>`;
      li.innerHTML = html;
    }

    if (i === exp.mainIndex && state.focus === "NAUTILUS_MAIN" && state.currentAppId === id) {
      li.classList.add("focused-item");
      setTimeout(() => ensureVisible(li, ul), 0);
    }
    ul.appendChild(li);
  });
  $(id + "-header").innerText = exp.header || "Explorer";
}

function normalizeRows(payload) {
  const rows = Array.isArray(payload) ? payload : (payload && Array.isArray(payload.items) ? payload.items : []);
  return rows.map((row) => {
    let name = row.name || row.title || row.album;
    if (!name && row.path) {
      const parts = row.path.split("/");
      name = parts.pop() || parts.pop(); // handle trailing slash
    }
    return {
      ...row,
      isDirectory: row.type === "folder" || row.isDirectory === true || row.type === "album" || row.type === "podcast",
      name: name || "Untitled"
    };
  });
}

async function fetchExplorerData(appId, type, path) {
  const exp = state.explorer[appId];
  exp.mainIndex = 0;
  $(appId + "-hint").innerText = "Loading...";
  renderNautilusMainContent(appId);
  
  try {
    let rows = [];
    if (type === "folders") rows = await Bridge.getFolderListingAsync(path || "ROOT");
    else if (type === "albums") rows = await Bridge.getAlbumsPaginatedAsync(0, 200, null);
    else if (type === "songs") rows = await Bridge.getSongsPaginatedAsync(0, 200);
    else if (type === "radio") rows = await Bridge.getRadioStationsAsync();
    else if (type === "podcasts") rows = await Bridge.getPodcastsAsync();
    else if (type === "songs_by_album") rows = await Bridge.getSongsByAlbumAsync(path);
    else if (type === "episodes_by_podcast") rows = await Bridge.getPodcastEpisodesAsync(path);
    
    exp.items = normalizeRows(rows);
    let unit = "items";
    if (type === "songs" || type === "songs_by_album") unit = "tracks";
    else if (type === "episodes_by_podcast") unit = "episodes";
    $(appId + "-hint").innerText = exp.items.length + " " + unit;
  } catch (e) {
    $(appId + "-hint").innerText = "Error loading";
  }
  renderNautilusMainContent(appId);
}

async function selectNautilusMainContent(appId) {
  const id = appId || state.currentAppId;
  const exp = state.explorer[id];
  const item = exp.items[exp.mainIndex];
  if (!item) return;

  // 1. Root Category Selection
  if (item.type === "category") {
    exp.stack.push(item.key);
    exp.header = item.name;
    fetchExplorerData(id, item.key);
    return;
  }

  // 2. Identify current context from stack
  const context = exp.stack[1] || (id === "radio" ? "radio" : (id === "podcasts" ? "podcasts" : "folders"));

  // 3. Navigation (Folders)
  if (item.isDirectory && context === "folders") {
    const path = item.path || item.name;
    exp.stack.push(path);
    exp.header = "Folders: " + path;
    fetchExplorerData(id, "folders", path);
    return;
  }
  
  // 4. Navigation (Albums)
  if (exp.stack.length === 2 && context === "albums") {
    const albumId = item.id || item.name;
    exp.stack.push(albumId);
    exp.header = "Album: " + item.name;
    fetchExplorerData(id, "songs_by_album", albumId);
    return;
  }

  // 5. Navigation (Podcasts — top-level list drills into episodes)
  if (id === "podcasts" && exp.stack.length === 1) {
    const podId = item.id || item.name;
    exp.stack.push(podId);
    exp.header = "Podcast: " + item.name;
    fetchExplorerData(id, "episodes_by_podcast", podId);
    return;
  }

  // 5. Playback — then open Now Playing
  if (id === "radio") {
    Bridge.playRadio(item.id);
  } else if (item.path || item.id) {
    if (context === "albums" || context === "songs_by_album") {
      const albumContext = exp.stack[2] || item.id;
      Bridge.playAlbum(albumContext, exp.mainIndex, false);
    } else if (id === "podcasts") {
      Bridge.playEpisode(item.id);
    } else {
      Bridge.playSong(item.id);
    }
  }
  // Hide source explorer but preserve its state for back navigation
  const sourceApp = APPS.find(a => a.id === id);
  if (sourceApp) {
    const win = $(sourceApp.window);
    if (win) { win.classList.add("hidden"); win.classList.remove("focused-window"); }
  }
  state.rhythmboxSource = id;
  openWindow("nowplaying");
}

async function backNautilusMainContent(appId) {
  const id = appId || state.currentAppId;
  const exp = state.explorer[id];
  
  if (exp.stack.length > 1) {
    exp.stack.pop();
    const parent = exp.stack[exp.stack.length - 1];
    
    if (parent === "ROOT") {
       initializeExplorer(id);
       return;
    }

    // Determine type for fetch
    const context = exp.stack[1];
    
    // Refresh view
    if (context === "folders") {
       const bridgePath = (parent === "folders") ? "ROOT" : parent;
       exp.header = (parent === "folders") ? "Folders" : "Folders: " + parent;
       fetchExplorerData(id, "folders", bridgePath);
    } else {
       // Back to top level of the category (Albums or Podcasts)
       exp.header = context === "albums" ? "Albums" : "Podcasts";
       fetchExplorerData(id, context);
    }
  } else {
    closeWindow(id);
  }
}

// === SETTINGS LOGIC ===
const SETTINGS_ROOT = [
  { name: "Shuffle", action: "shuffle" },
  { name: "Repeat", action: "repeat" },
  { name: "Switch Theme", action: "themes" },
  { name: "Equalizer Presets", action: "eq" },
  { name: "Refresh Library", action: "refresh" },
  { name: "Import Theme", action: "import" },
  { name: "Set Sleep Timer", action: "sleep" },
  { name: "System Info", action: "info" }
];

async function loadSettingsMenu(mode, preserveIndex) {
  state.settingsMode = mode;
  if (!preserveIndex) state.settingsIndex = 0;
  state.settingsOptions = [];
  
  if (mode === "ROOT") {
    $("settings-header").innerText = "Settings";
    
    // Direct Bridge.call to bypass wrapper name mismatches or stale properties
    const rawShuffle = Bridge.call('isShuffle');
    const isShuffle = (rawShuffle === true || rawShuffle === "true") ? "On" : "Off";
    
    const sleepActive = Bridge.getSleepTimerMinutes ? Bridge.getSleepTimerMinutes() : 0;
    
    let repeatLabel = "Off";
    const rep = typeof Bridge.getRepeatMode === 'function' ? Bridge.getRepeatMode() : Bridge.call('getRepeatMode');
    if (rep === "ONE" || rep === 1) repeatLabel = "One";
    else if (rep === "ALL" || rep === 2) repeatLabel = "All";

    let eqName = state.lastEqName || "Auto";
    if (Bridge.getSettings) {
      let s = Bridge.getSettings();
      if (typeof s === 'string') try { s = JSON.parse(s); } catch(e) {}
      if (s && s.eq_preset) eqName = s.eq_preset;
    }
    
    state.settingsOptions = SETTINGS_ROOT.map(opt => {
      if (opt.action === "shuffle") return { ...opt, subValue: isShuffle };
      if (opt.action === "repeat") return { ...opt, subValue: repeatLabel };
      if (opt.action === "sleep") return { ...opt, subValue: sleepActive > 0 ? `${sleepActive}m` : "Off" };
      if (opt.action === "eq") return { ...opt, subValue: eqName };
      return opt;
    });
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
      const eqRaw = Bridge.getEqPresets ? Bridge.getEqPresets() : "[]";
      const presets = typeof eqRaw === 'string' ? JSON.parse(eqRaw) : eqRaw;
      state.settingsOptions = presets.map((p, i) => {
        const name = (typeof p === 'object' && p !== null) ? (p.name || p.title || "Preset " + (i+1)) : p;
        return { name: name, action: "apply_eq", index: i };
      });
    } catch(e) { state.settingsOptions = []; }
  } else if (mode === "INFO") {
    $("settings-header").innerText = "Settings > System Info";
    const ver = Bridge.getAppVersion ? Bridge.getAppVersion() : "1.0.3";
    const model = Bridge.getDeviceModel ? Bridge.getDeviceModel() : "Linux Device";
    const battery = Bridge.getBatteryLevel ? Bridge.getBatteryLevel() + "%" : "100%";
    const isCharging = Bridge.isCharging && Bridge.isCharging() ? " (Charging)" : "";
    const songs = Bridge.getSongCount ? Bridge.getSongCount() : "0";
    
    state.settingsOptions = [
      { name: "Device Model", subValue: model },
      { name: "OS Version", subValue: "Android 13 (Ubuntu Edition)" },
      { name: "oPlayer Version", subValue: ver },
      { name: "Theme Version", subValue: "1.0.4" },
      { name: "Battery", subValue: battery + isCharging },
      { name: "Library Size", subValue: songs + " songs" }
    ];
  } else if (mode === "SLEEP") {
    $("settings-header").innerText = "Settings > Sleep Timer";
    state.settingsOptions = [
      { name: "Off", action: "set_sleep", value: 0 },
      { name: "15 Minutes", action: "set_sleep", value: 15 },
      { name: "30 Minutes", action: "set_sleep", value: 30 },
      { name: "45 Minutes", action: "set_sleep", value: 45 },
      { name: "1 Hour", action: "set_sleep", value: 60 },
      { name: "2 Hours", action: "set_sleep", value: 120 }
    ];
  }
  
  renderSettings();
}

function renderSettings() {
  const ul = $("settings-list");
  ul.innerHTML = "";
  if (!state.settingsOptions) return;
  state.settingsOptions.forEach((opt, i) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    
    let html = `<span class="opt-name">${opt.name}</span>`;
    if (opt.subValue) {
      html += `<span class="opt-value">${opt.subValue}</span>`;
    }
    li.innerHTML = html;
    if (i === state.settingsIndex && state.focus === "SETTINGS") {
      li.classList.add("focused-item");
      setTimeout(() => ensureVisible(li, ul), 0);
    }
    ul.appendChild(li);
  });
}

function updateSettingsHighlight() {
  const ul = $("settings-list");
  const items = ul.children;
  for (let i = 0; i < items.length; i++) {
    if (i === state.settingsIndex) {
      items[i].classList.add("focused-item");
      ensureVisible(items[i], ul);
    } else {
      items[i].classList.remove("focused-item");
    }
  }
}

function selectSettings() {
  const opt = state.settingsOptions[state.settingsIndex];
  if (!opt) return;

  if (state.settingsMode === "ROOT") {
    if (opt.action === "shuffle") { 
      Bridge.call('toggleShuffle'); 
      loadSettingsMenu("ROOT", true);
    }
    else if (opt.action === "repeat") {
      Bridge.call('toggleRepeat');
      loadSettingsMenu("ROOT", true);
    }
    else if (opt.action === "themes") { loadSettingsMenu("THEMES"); }
    else if (opt.action === "eq") { loadSettingsMenu("EQ"); }
    else if (opt.action === "refresh") { 
      showLoading("Refreshing library...");
      if (Bridge.refreshLibrary) Bridge.refreshLibrary();
      setTimeout(hideLoading, 3000);
    }
    else if (opt.action === "import") { 
      showLoading("Preparing import...");
      if (Bridge.requestImportTheme) Bridge.requestImportTheme();
      setTimeout(hideLoading, 5000);
    }
    else if (opt.action === "sleep") { loadSettingsMenu("SLEEP"); }
    else if (opt.action === "info") { loadSettingsMenu("INFO"); }
  } else if (state.settingsMode === "THEMES") {
    if (opt.action === "apply_theme" && Bridge.setTheme) {
      showLoading("Switching theme...");
      Bridge.setTheme(opt.name);
    }
  } else if (state.settingsMode === "EQ") {
    if (opt.action === "apply_eq" && Bridge.useEqPreset) {
      Bridge.useEqPreset(opt.index);
      state.lastEqName = opt.name;
      loadSettingsMenu("ROOT");
    }
  } else if (state.settingsMode === "SLEEP") {
    if (opt.action === "set_sleep") {
      Bridge.setSleepTimer(opt.value);
      loadSettingsMenu("ROOT");
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
const DEFAULT_ALBUM_ART = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg viewBox="-4 -4 32 32" fill="#888" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>');

function updateNowPlaying(playback, track) {
  if (track) {
    state.nowTrack = track;
    $("track-title").innerText = track.title || "Unknown Title";
    $("track-artist").innerText = track.artist || "Unknown Artist";
    const art = $("album-art");
    art.src = track.art ? track.art : DEFAULT_ALBUM_ART;
    art.classList.remove("hidden");
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
  }, 1000);

  // Sync with bridge periodically (slower) to prevent drift without overriding the smooth ticker
  setInterval(() => {
    refreshNowPlayingFromBridge();
  }, 5000);
}

// === VOLUME OSD ===
let volumeOsdTimer = null;
let lastKnownVolume = -1;

function showVolumeOSD(vol) {
  const osd = $("volume-osd");
  const fill = $("volume-osd-fill");
  const pct = $("volume-osd-pct");
  if (!osd || !fill || !pct) return;
  fill.style.width = vol + "%";
  pct.innerText = vol + "%";
  osd.classList.remove("hidden");
  clearTimeout(volumeOsdTimer);
  volumeOsdTimer = setTimeout(() => osd.classList.add("hidden"), 1200);
}

function startVolumeWatcher() {
  if (Bridge.getVolume) lastKnownVolume = Bridge.getVolume();
  setInterval(() => {
    if (!Bridge.getVolume) return;
    const vol = Bridge.getVolume();
    if (vol !== lastKnownVolume) {
      lastKnownVolume = vol;
      showVolumeOSD(vol);
    }
  }, 300);
}

// === GLOBAL INPUT HOOKS ===
function handleScroll(d) {
  const id = state.currentAppId;
  const exp = state.explorer[id];
  
  if (state.focus === "DOCK") {
    state.dockIndex = clamp(state.dockIndex + d, APPS.length);
    renderDock();
  } else if (state.focus === "NAUTILUS_MAIN") {
    exp.mainIndex = clamp(exp.mainIndex + d, exp.items.length);
    updateNautilusHighlight(id);
  } else if (state.focus === "SETTINGS") {
    state.settingsIndex = clamp(state.settingsIndex + d, state.settingsOptions.length);
    updateSettingsHighlight();
  } else if (state.focus === "RHYTHMBOX") {
    if (state.nowPlayback && state.nowPlayback.duration) {
      const seekDelta = d * 5000;
      state.nowPlayback.position = clamp(state.nowPlayback.position + seekDelta, state.nowPlayback.duration);
      if (Bridge.seekTo) Bridge.seekTo(state.nowPlayback.position);
      updateNowPlaying(state.nowPlayback, null);
    }
  }
}

function handleSelect() {
  const id = state.currentAppId;
  Bridge.triggerHaptic("heavy");
  if (state.focus === "DOCK") {
    const app = APPS[state.dockIndex];
    openWindow(app.id);
  } else if (state.focus === "NAUTILUS_MAIN") {
    selectNautilusMainContent(id);
  } else if (state.focus === "SETTINGS") {
    selectSettings();
  } else if (state.focus === "RHYTHMBOX") {
    Bridge.togglePlayPause();
  }
}

function handleBack() {
  const id = state.currentAppId;
  if (state.focus === "DOCK") return;
  
  if (state.focus === "NAUTILUS_MAIN") {
    backNautilusMainContent(id);
  } else if (state.focus === "SETTINGS") {
    backSettings();
  } else if (state.focus === "RHYTHMBOX") {
    // Close Rhythmbox and return to source explorer
    const rbWin = $("window-rhythmbox");
    if (rbWin) { rbWin.classList.add("hidden"); rbWin.classList.remove("focused-window"); }
    state.openedWindowIds = state.openedWindowIds.filter(w => w !== "window-rhythmbox");

    const srcId = state.rhythmboxSource;
    if (srcId) {
      const srcApp = APPS.find(a => a.id === srcId);
      if (srcApp) {
        const win = $(srcApp.window);
        if (win) { win.classList.remove("hidden"); win.classList.add("focused-window"); }
        state.activeWindowId = srcApp.window;
        state.currentAppId = srcId;
        state.focus = "NAUTILUS_MAIN";
        state.rhythmboxSource = null;
        renderDock();
        return;
      }
    }
    state.activeWindowId = null;
    state.focus = "DOCK";
    state.rhythmboxSource = null;
    renderDock();
  }
}

function handleLeft() {
  if (state.focus === "NAUTILUS_MAIN") handleBack();
  else Bridge.previous();
}

function handleRight() {
  Bridge.next();
}

window.handleScroll = handleScroll;
window.handleSelect = handleSelect;
window.handleBack = handleBack;
window.handleLeft = handleLeft;
window.handleRight = handleRight;
window.onPlaybackUpdate = (p, t) => updateNowPlaying(p, t);
