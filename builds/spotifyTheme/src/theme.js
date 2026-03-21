// ═══════════════════════════════════════════════════════
// oPlayer — Spotify Green Theme
// ═══════════════════════════════════════════════════════

const ICONS = {
  music: '<svg viewBox="0 0 24 24" fill="#1DB954"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>',
  album: '<svg viewBox="0 0 24 24" fill="#1DB954"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>',
  artist: '<svg viewBox="0 0 24 24" fill="#B3B3B3"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
  playlist: '<svg viewBox="0 0 24 24" fill="#B3B3B3"><path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="#B3B3B3"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>',
  podcast: '<svg viewBox="0 0 24 24" fill="#B3B3B3"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>',
  radio: '<svg viewBox="0 0 24 24" fill="#B3B3B3"><path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34-.75-1.85L3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="#1DB954"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
  recent: '<svg viewBox="0 0 24 24" fill="#B3B3B3"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>',
  fire: '<svg viewBox="0 0 24 24" fill="#FF6B35"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="#B3B3B3"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="#B3B3B3"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>',
  genre: '<svg viewBox="0 0 24 24" fill="#B3B3B3"><path d="M12 3l.01 10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4.01 4S14 19.21 14 17V7h4V3h-6z"/></svg>',
  lyrics: '<svg viewBox="0 0 24 24" fill="#B3B3B3"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>',
  eq: '<svg viewBox="0 0 24 24" fill="#B3B3B3"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>',
  sleep: '<svg viewBox="0 0 24 24" fill="#B3B3B3"><path d="M12.34 2.02C6.59 1.82 2 6.42 2 12c0 5.52 4.48 10 10 10 3.71 0 6.93-2.02 8.66-5.02-7.51-.25-12.09-8.43-8.32-14.96z"/></svg>',
  theme: '<svg viewBox="0 0 24 24" fill="#B3B3B3"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1-.01-.83.67-1.49 1.5-1.49H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>'
};

// ── Home Menu ─────────────────────────────────────────

const HOME_MENU = [
  { type: "action", name: "Shuffle All", key: "shuffle_all", icon: ICONS.music, iconClass: "green" },
  { type: "header", name: "QUICK ACCESS" },
  { type: "nav", name: "Recently Played", key: "recent", icon: ICONS.recent, iconClass: "dark" },
  { type: "nav", name: "Most Played", key: "mostplayed", icon: ICONS.fire, iconClass: "dark" },
  { type: "nav", name: "Favorites", key: "favorites", icon: ICONS.heart, iconClass: "dark" },
  { type: "header", name: "YOUR LIBRARY" },
  { type: "nav", name: "Playlists", key: "playlists", icon: ICONS.playlist, iconClass: "dark" },
  { type: "nav", name: "Albums", key: "albums", icon: ICONS.album, iconClass: "dark" },
  { type: "nav", name: "Artists", key: "artists", icon: ICONS.artist, iconClass: "dark" },
  { type: "nav", name: "Genres", key: "genres", icon: ICONS.genre, iconClass: "dark" },
  { type: "nav", name: "Folders", key: "folders", icon: ICONS.folder, iconClass: "dark" },
  { type: "header", name: "DISCOVER" },
  { type: "nav", name: "Podcasts", key: "podcasts", icon: ICONS.podcast, iconClass: "dark" },
  { type: "nav", name: "Radio", key: "radio", icon: ICONS.radio, iconClass: "dark" },
  { type: "header", name: "" },
  { type: "nav", name: "Search", key: "search", icon: ICONS.search, iconClass: "dark" },
  { type: "nav", name: "Settings", key: "settings", icon: ICONS.settings, iconClass: "dark" }
];

// Pre-compute selectable indices (skip headers)
const HOME_SELECTABLE = HOME_MENU.map((item, i) => item.type !== "header" ? i : -1).filter(i => i >= 0);

// ── State ─────────────────────────────────────────────

const state = {
  view: "HOME",
  homeIndex: 0,  // index into HOME_SELECTABLE

  list: { items: [], index: 0, stack: [], header: "", context: "" },
  grid: { items: [], index: 0, stack: [], header: "", context: "" },
  search: { query: "", results: [], index: 0 },
  settings: { mode: "ROOT", index: 0, options: [] },

  np: { playback: null, track: null, lyrics: null },
  npSource: null,  // view to return to from NP

  ticker: null,
  volTimer: null,
  lastVol: -1
};

function $(id) { return document.getElementById(id); }

// ── Init ──────────────────────────────────────────────

window.addEventListener("DOMContentLoaded", () => {
  renderHome();
  startClock();
  startTicker();
  startVolumeWatcher();
  refreshNP();
  $("search-query").addEventListener("input", (e) => handleSearchInput(e.target.value));
});

function startClock() {
  const update = () => {
    const d = new Date();
    $("sb-clock").innerText = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const bat = Bridge.getBatteryLevel ? Bridge.getBatteryLevel() : "";
    const charging = Bridge.isCharging && Bridge.isCharging() ? "+" : "";
    $("sb-battery").innerText = bat ? `${charging}${bat}%` : "";
  };
  update();
  setInterval(update, 30000);
}

// ── Greeting ──────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// ── View Management ───────────────────────────────────

function showView(viewId) {
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  $("view-" + viewId).classList.remove("hidden");
}

function updateMiniPlayer() {
  const t = state.np.track;
  const p = state.np.playback;
  const mp = $("mini-player");
  if (!t || !t.title || state.view === "NP" || state.view === "LYRICS") {
    mp.classList.add("hidden");
    return;
  }
  mp.classList.remove("hidden");
  $("mp-title").innerText = t.title || "---";
  $("mp-artist").innerText = t.artist || "---";
  const art = $("mp-art");
  if (t.art) { art.src = t.art; art.style.visibility = "visible"; }
  else art.style.visibility = "hidden";

  if (p && p.duration) {
    const pct = Math.min(100, Math.max(0, (p.position / p.duration) * 100));
    $("mp-progress").style.width = pct + "%";
  }
  // Play/pause indicator
  const ind = $("mp-play-indicator");
  if (p && p.isPlaying) {
    ind.innerHTML = '<div class="playing-indicator"><span></span><span></span><span></span></div>';
  } else {
    ind.innerHTML = '<svg viewBox="0 0 24 24" fill="#1DB954"><path d="M8 5v14l11-7z"/></svg>';
  }
}

// ── Home ──────────────────────────────────────────────

function renderHome() {
  state.view = "HOME";
  showView("home");
  $("greeting").innerText = getGreeting();
  const ul = $("home-list");
  ul.innerHTML = "";

  const activeIdx = HOME_SELECTABLE[state.homeIndex];

  HOME_MENU.forEach((item, i) => {
    const li = document.createElement("li");
    if (item.type === "header") {
      li.className = "section-header";
      li.innerText = item.name;
    } else {
      li.innerHTML = `<span class="menu-icon ${item.iconClass}">${item.icon}</span>${item.name}<span class="menu-arrow">&rsaquo;</span>`;
      if (i === activeIdx) {
        li.classList.add("focused");
        setTimeout(() => li.scrollIntoView({ block: "nearest" }), 0);
      }
    }
    ul.appendChild(li);
  });
  updateMiniPlayer();
}

// ── List View (songs, artists, playlists, etc.) ──────

function showList(header, items, context) {
  state.view = "LIST";
  state.list.header = header;
  state.list.items = items;
  state.list.index = 0;
  state.list.context = context;
  showView("list");
  renderList();
}

function renderList() {
  $("list-header").innerText = state.list.header;
  const ul = $("list-items");
  ul.innerHTML = "";
  const items = state.list.items;
  if (!items.length) {
    $("list-hint").innerText = "No items found.";
    return;
  }
  $("list-hint").innerText = items.length + " items";

  items.forEach((item, i) => {
    const li = document.createElement("li");
    const ctx = state.list.context;
    let iconHtml;

    if (ctx === "radio") iconHtml = ICONS.radio;
    else if (ctx === "episodes") iconHtml = ICONS.podcast;
    else if (ctx === "artists") iconHtml = `<span style="color:#B3B3B3">${ICONS.artist}</span>`;
    else if (ctx === "genres" || ctx === "years") iconHtml = ICONS.genre;
    else if (ctx === "playlists") iconHtml = ICONS.playlist;
    else if (item.art) iconHtml = `<img class="list-art" src="${item.art}" />`;
    else iconHtml = ICONS.music;

    let text = item.name || item.title || "Untitled";
    let sub = item.artist || item.author || "";

    li.innerHTML = `<span class="item-icon">${iconHtml}</span><span class="item-text">${text}${sub ? ' <span class="item-sub">- ' + sub + '</span>' : ''}</span>`;

    if (i === state.list.index) {
      li.classList.add("focused");
      setTimeout(() => li.scrollIntoView({ block: "nearest" }), 0);
    }
    ul.appendChild(li);
  });
  updateMiniPlayer();
}

function updateListHighlight() {
  const ul = $("list-items");
  const items = ul.children;
  for (let i = 0; i < items.length; i++) {
    if (i === state.list.index) {
      items[i].classList.add("focused");
      items[i].scrollIntoView({ block: "nearest" });
    } else {
      items[i].classList.remove("focused");
    }
  }
}

// ── Grid View (albums, podcasts) ─────────────────────

function showGrid(header, items, context) {
  state.view = "GRID";
  state.grid.header = header;
  state.grid.items = items;
  state.grid.index = 0;
  state.grid.context = context;
  showView("grid");
  renderGrid();
}

function renderGrid() {
  $("grid-header").innerText = state.grid.header;
  const ul = $("grid-items");
  ul.innerHTML = "";
  const items = state.grid.items;
  if (!items.length) {
    $("grid-hint").innerText = "No items found.";
    return;
  }
  $("grid-hint").innerText = items.length + " items";

  items.forEach((item, i) => {
    const li = document.createElement("li");
    const ctx = state.grid.context;
    let icon;
    if (ctx === "albums") {
      icon = item.art ? `<img class="grid-art" src="${item.art}" />` : ICONS.album;
    } else if (ctx === "podcasts") {
      icon = item.art ? `<img class="grid-art" src="${item.art}" />` : ICONS.podcast;
    } else if (ctx === "folders") {
      icon = item.isDirectory ? ICONS.folder : ICONS.music;
    } else {
      icon = ICONS.folder;
    }
    li.innerHTML = `<div class="grid-icon">${icon}</div><div class="grid-name">${item.name || item.title || "Untitled"}</div>`;
    if (i === state.grid.index) {
      li.classList.add("focused");
      setTimeout(() => li.scrollIntoView({ block: "nearest" }), 0);
    }
    ul.appendChild(li);
  });
  updateMiniPlayer();
}

function updateGridHighlight() {
  const ul = $("grid-items");
  const items = ul.children;
  for (let i = 0; i < items.length; i++) {
    if (i === state.grid.index) {
      items[i].classList.add("focused");
      items[i].scrollIntoView({ block: "nearest" });
    } else {
      items[i].classList.remove("focused");
    }
  }
}

// ── Data Fetching ─────────────────────────────────────

function normalize(payload) {
  const rows = Array.isArray(payload) ? payload : (payload && Array.isArray(payload.items) ? payload.items : []);
  return rows.map(r => {
    if (typeof r === 'string') return { name: r, isDirectory: false, _original: r };
    let name = r.name || r.title || r.album || r.artist || r.genre;
    if (!name && r.path) { const p = r.path.split("/"); name = p.pop() || p.pop(); }
    return { ...r, name: name || "Untitled", isDirectory: r.type === "folder" || r.isDirectory === true };
  });
}

async function openCategory(key) {
  try {
    let rows, header, ctx;
    switch (key) {
      case "recent":
        rows = await Bridge.getRecentSongsAsync(); header = "Recently Played"; ctx = "songs"; break;
      case "mostplayed":
        rows = await Bridge.getMostPlayedAsync(); header = "Most Played"; ctx = "songs"; break;
      case "favorites":
        rows = await Bridge.getFavoritesAsync(); header = "Favorites"; ctx = "songs"; break;
      case "playlists":
        rows = await Bridge.getPlaylistsAsync(); header = "Playlists"; ctx = "playlists"; break;
      case "albums":
        rows = await Bridge.getAlbumsPaginatedAsync(0, 200, null); header = "Albums"; ctx = "albums"; break;
      case "artists":
        rows = await Bridge.getArtistsPaginatedAsync(0, 200); header = "Artists"; ctx = "artists"; break;
      case "genres":
        rows = await Bridge.getGenresAsync(); header = "Genres"; ctx = "genres"; break;
      case "folders":
        state.list.stack = ["ROOT"];
        rows = await Bridge.getFolderListingAsync("ROOT"); header = "Folders"; ctx = "folders"; break;
      case "podcasts":
        rows = await Bridge.getPodcastsAsync(); header = "Podcasts"; ctx = "podcasts"; break;
      case "radio":
        rows = await Bridge.getRadioStationsAsync(); header = "Radio Stations"; ctx = "radio"; break;
      default: return;
    }
    const items = normalize(rows);
    // Grid for albums, podcasts, folders (dirs only)
    if (ctx === "albums" || ctx === "podcasts" || (ctx === "folders" && !items.some(i => !i.isDirectory))) {
      state.grid.stack = state.list.stack.slice(); // share stack for folders
      showGrid(header, items, ctx);
    } else {
      showList(header, items, ctx);
    }
  } catch (e) {
    console.error("Failed to load " + key, e);
  }
}

async function drillItem(view) {
  const s = view === "GRID" ? state.grid : state.list;
  const item = s.items[s.index];
  if (!item) return;
  const ctx = s.context;

  // Navigable items
  if (ctx === "playlists") {
    const rows = await Bridge.getPlaylistSongsAsync(item.id);
    showList("Playlist: " + item.name, normalize(rows), "playlist_songs");
    state.list.stack = [ctx, item.id];
    return;
  }
  if (ctx === "albums") {
    const rows = await Bridge.getSongsByAlbumAsync(item.id || item.name);
    showList("Album: " + item.name, normalize(rows), "album_songs");
    state.list.stack = [ctx, item.id || item.name];
    return;
  }
  if (ctx === "artists") {
    const rows = await Bridge.getAlbumsByArtist(item.name || item.title);
    const items = normalize(rows);
    showGrid("Artist: " + (item.name || item.title), items, "artist_albums");
    state.grid.stack = [ctx, item.name || item.title];
    return;
  }
  if (ctx === "artist_albums") {
    const rows = await Bridge.getSongsByAlbumAsync(item.id || item.name);
    showList("Album: " + item.name, normalize(rows), "album_songs");
    state.list.stack = state.grid.stack.concat(item.id || item.name);
    return;
  }
  if (ctx === "genres") {
    const rows = await Bridge.getSongsByGenreAsync(item.name || item.title);
    showList("Genre: " + (item.name || item.title), normalize(rows), "genre_songs");
    state.list.stack = [ctx];
    return;
  }
  if (ctx === "podcasts") {
    const rows = await Bridge.getPodcastEpisodesAsync(item.id);
    showList("Podcast: " + item.name, normalize(rows), "episodes");
    state.list.stack = [ctx, item.id];
    return;
  }
  if (ctx === "folders" && item.isDirectory) {
    const path = item.path || item.name;
    const stack = (view === "GRID" ? state.grid.stack : state.list.stack);
    stack.push(path);
    const rows = await Bridge.getFolderListingAsync(path);
    const items = normalize(rows);
    const hasFiles = items.some(i => !i.isDirectory);
    if (hasFiles) {
      state.list.stack = stack.slice();
      showList("Folder: " + path, items, "folders");
    } else {
      state.grid.stack = stack.slice();
      showGrid("Folder: " + path, items, "folders");
    }
    return;
  }

  // Playable items — play then show Now Playing
  if (ctx === "radio") {
    Bridge.playRadio(item.id);
  } else if (ctx === "episodes") {
    Bridge.playEpisode(item.id);
  } else if (ctx === "album_songs" || ctx === "playlist_songs") {
    const albumOrPlaylist = s.stack[1];
    if (ctx === "album_songs") Bridge.playAlbum(albumOrPlaylist, s.index, false);
    else Bridge.playPlaylist(albumOrPlaylist, s.index, false);
  } else if (ctx === "genre_songs") {
    Bridge.playGenre(item.genre || s.header.replace("Genre: ", ""), s.index);
  } else {
    Bridge.playSong(item.id);
  }
  state.npSource = state.view;
  openNowPlaying();
}

// ── Search ────────────────────────────────────────────

function openSearch() {
  state.view = "SEARCH";
  state.search.query = "";
  state.search.results = [];
  state.search.index = 0;
  showView("search");
  $("search-query").value = "";
  $("search-results").innerHTML = "";
  $("search-hint").innerText = "Type to search your library";
  $("search-bar").classList.add("active");
  updateMiniPlayer();
  $("search-query").focus();
  if (Bridge.setInputMode) Bridge.setInputMode(true);
  if (Bridge.showKeyboard) Bridge.showKeyboard();
}

function handleSearchInput(text) {
  state.search.query = text;
  if (!text || text.length < 2) {
    state.search.results = [];
    $("search-results").innerHTML = "";
    $("search-hint").innerText = "Type to search your library";
    return;
  }
  try {
    const raw = Bridge.searchSongs ? Bridge.searchSongs(text) : (Bridge.searchAll ? Bridge.searchAll(text) : "[]");
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    let flat = [];
    if (Array.isArray(parsed)) {
      // Bridge.searchSongs returns an array
      flat = parsed.map(s => ({ ...s, _type: "song" }));
    } else if (parsed && parsed.songs) {
      // Bridge.searchAll returns {songs: [...]}
      flat = parsed.songs.map(s => ({ ...s, _type: "song" }));
    }
    state.search.results = flat;
    state.search.index = 0;
    renderSearchResults();
  } catch (e) {
    console.error("Search error", e);
  }
}

function renderSearchResults() {
  const ul = $("search-results");
  ul.innerHTML = "";
  const items = state.search.results;
  $("search-hint").innerText = items.length ? items.length + " results" : "No results";

  items.forEach((item, i) => {
    const li = document.createElement("li");
    const name = item.title || item.name || "Untitled";
    const sub = item.artist || item.author || item._type || "";
    let icon = ICONS.music;
    if (item._type === "album") icon = ICONS.album;
    else if (item._type === "artist") icon = ICONS.artist;
    else if (item._type === "podcast") icon = ICONS.podcast;

    li.innerHTML = `<span class="item-icon">${icon}</span><span class="item-text">${name}${sub ? ' <span class="item-sub">- ' + sub + '</span>' : ''}</span>`;
    if (i === state.search.index) {
      li.classList.add("focused");
      setTimeout(() => li.scrollIntoView({ block: "nearest" }), 0);
    }
    ul.appendChild(li);
  });
}

function selectSearchResult() {
  const item = state.search.results[state.search.index];
  if (!item) return;
  if (Bridge.hideKeyboard) Bridge.hideKeyboard();
  if (Bridge.setInputMode) Bridge.setInputMode(false);

  if (item._type === "song") {
    Bridge.playSong(item.id);
    state.npSource = "SEARCH";
    openNowPlaying();
  } else if (item._type === "album") {
    drillAlbumFromSearch(item);
  } else if (item._type === "artist") {
    drillArtistFromSearch(item);
  } else if (item._type === "podcast") {
    drillPodcastFromSearch(item);
  }
}

async function drillAlbumFromSearch(item) {
  const rows = await Bridge.getSongsByAlbumAsync(item.id || item.name || item.title);
  showList("Album: " + (item.name || item.title), normalize(rows), "album_songs");
  state.list.stack = ["search_album", item.id || item.name];
}

async function drillArtistFromSearch(item) {
  const rows = await Bridge.getAlbumsByArtist(item.name || item.title);
  showGrid("Artist: " + (item.name || item.title), normalize(rows), "artist_albums");
  state.grid.stack = ["search_artist", item.name || item.title];
}

async function drillPodcastFromSearch(item) {
  const rows = await Bridge.getPodcastEpisodesAsync(item.id);
  showList("Podcast: " + (item.name || item.title), normalize(rows), "episodes");
  state.list.stack = ["search_podcast", item.id];
}

// ── Now Playing ───────────────────────────────────────

function openNowPlaying() {
  state.view = "NP";
  showView("np");
  refreshNP();
  updateMiniPlayer();
}

function refreshNP() {
  if (!Bridge.getPlaybackState || !Bridge.getCurrentTrack) return;
  try {
    const ps = Bridge.getPlaybackState();
    const ct = Bridge.getCurrentTrack();
    const playback = typeof ps === "string" ? JSON.parse(ps) : ps;
    const track = typeof ct === "string" ? JSON.parse(ct) : ct;
    if (playback) state.np.playback = playback;
    if (track) state.np.track = track;
  } catch (e) {}
  renderNP();
}

function renderNP() {
  const t = state.np.track;
  const p = state.np.playback;

  if (t) {
    $("np-title").innerText = t.title || "Not Playing";
    $("np-artist").innerText = t.artist || "---";
    const art = $("np-art");
    const placeholder = document.querySelector(".np-art-placeholder");
    if (t.art) {
      art.src = t.art; art.style.display = "block";
      placeholder.style.display = "none";
    } else {
      art.style.display = "none";
      placeholder.style.display = "flex";
    }
  }
  if (p) {
    if (p.duration) {
      const pct = Math.min(100, Math.max(0, (p.position / p.duration) * 100));
      $("np-progress").style.width = pct + "%";
      $("np-elapsed").innerText = msToClock(p.position);
      $("np-duration").innerText = msToClock(p.duration);
    }
    // Shuffle/Repeat indicators
    const shuffleOn = Bridge.isShuffle ? (Bridge.isShuffle() === true || Bridge.isShuffle() === "true") : false;
    const repeatMode = Bridge.getRepeatMode ? Bridge.getRepeatMode() : "OFF";
    $("np-shuffle").className = "np-ctrl" + (shuffleOn ? " active" : "");
    $("np-repeat").className = "np-ctrl" + (repeatMode !== "OFF" ? " active" : "");
  }
  updateMiniPlayer();
}

function msToClock(ms) {
  const sec = Math.floor((ms || 0) / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m + ":" + String(s).padStart(2, "0");
}

// ── Lyrics ────────────────────────────────────────────

function openLyrics() {
  const t = state.np.track;
  if (!t) return;
  state.view = "LYRICS";
  showView("lyrics");
  $("lyrics-text").innerText = state.np.lyrics || "Loading lyrics...";
  updateMiniPlayer();
  if (Bridge.fetchLyricsAsync) Bridge.fetchLyricsAsync(t.title, t.artist);
}

window.onLyricsLoaded = function(text) {
  state.np.lyrics = text || "No lyrics found.";
  if (state.view === "LYRICS") $("lyrics-text").innerText = state.np.lyrics;
};

// ── Settings ──────────────────────────────────────────

function openSettings() {
  state.view = "SETTINGS";
  showView("settings");
  loadSettingsMenu("ROOT");
}

const SETTINGS_ROOT = [
  { name: "Shuffle", action: "shuffle" },
  { name: "Repeat", action: "repeat" },
  { name: "Equalizer", action: "eq" },
  { name: "Sleep Timer", action: "sleep" },
  { name: "Themes", action: "themes" },
  { name: "Refresh Library", action: "refresh" },
  { name: "Import Theme", action: "import" },
  { name: "About", action: "about" }
];

async function loadSettingsMenu(mode, preserveIndex) {
  state.settings.mode = mode;
  if (!preserveIndex) state.settings.index = 0;
  state.settings.options = [];

  if (mode === "ROOT") {
    $("settings-header").innerText = "Settings";
    const rawShuffle = Bridge.isShuffle ? Bridge.isShuffle() : false;
    const isShuffle = (rawShuffle === true || rawShuffle === "true") ? "On" : "Off";
    let repeatLabel = "Off";
    const rep = Bridge.getRepeatMode ? Bridge.getRepeatMode() : "OFF";
    if (rep === "ONE" || rep === 1) repeatLabel = "One";
    else if (rep === "ALL" || rep === 2) repeatLabel = "All";
    const sleepMin = Bridge.getSleepTimerMinutes ? Bridge.getSleepTimerMinutes() : 0;
    let eqLabel = "";
    try {
      const rawEq = Bridge.getEqPresets ? Bridge.getEqPresets() : "[]";
      const eqPresets = typeof rawEq === "string" ? JSON.parse(rawEq) : rawEq;
      const activeEq = Bridge.getActiveEqPreset ? Bridge.getActiveEqPreset() : -1;
      if (activeEq >= 0 && eqPresets[activeEq]) {
        eqLabel = typeof eqPresets[activeEq] === "object" ? (eqPresets[activeEq].name || "") : eqPresets[activeEq];
      }
    } catch (e) {}

    state.settings.options = SETTINGS_ROOT.map(o => {
      if (o.action === "shuffle") return { ...o, subValue: isShuffle };
      if (o.action === "repeat") return { ...o, subValue: repeatLabel };
      if (o.action === "eq") return { ...o, subValue: eqLabel || "Default" };
      if (o.action === "sleep") return { ...o, subValue: sleepMin > 0 ? sleepMin + "m" : "Off" };
      return o;
    });
  } else if (mode === "EQ") {
    $("settings-header").innerText = "Equalizer";
    try {
      const raw = Bridge.getEqPresets ? Bridge.getEqPresets() : "[]";
      const presets = typeof raw === "string" ? JSON.parse(raw) : raw;
      state.settings.options = presets.map((p, i) => ({
        name: typeof p === "object" ? (p.name || "Preset " + (i+1)) : p,
        action: "apply_eq", index: i
      }));
    } catch (e) { state.settings.options = []; }
  } else if (mode === "THEMES") {
    $("settings-header").innerText = "Themes";
    try {
      const raw = Bridge.getAvailableThemes ? Bridge.getAvailableThemes() : "[]";
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      state.settings.options = (Array.isArray(parsed) ? parsed : []).map(t => ({ name: t, action: "apply_theme" }));
    } catch (e) { state.settings.options = []; }
  } else if (mode === "SLEEP") {
    $("settings-header").innerText = "Sleep Timer";
    state.settings.options = [
      { name: "Off", action: "set_sleep", value: 0 },
      { name: "15 Minutes", action: "set_sleep", value: 15 },
      { name: "30 Minutes", action: "set_sleep", value: 30 },
      { name: "45 Minutes", action: "set_sleep", value: 45 },
      { name: "1 Hour", action: "set_sleep", value: 60 },
      { name: "2 Hours", action: "set_sleep", value: 120 }
    ];
  } else if (mode === "ABOUT") {
    $("settings-header").innerText = "About";
    const ver = Bridge.getAppVersion ? Bridge.getAppVersion() : "?";
    const songs = Bridge.getSongCount ? Bridge.getSongCount() : "?";
    const bat = Bridge.getBatteryLevel ? Bridge.getBatteryLevel() : "?";
    const charging = Bridge.isCharging && Bridge.isCharging() ? " +" : "";
    const device = Bridge.getDeviceModel ? Bridge.getDeviceModel() : "?";
    const osVer = Bridge.getOSVersion ? Bridge.getOSVersion() : "?";
    state.settings.options = [
      { name: "Device", subValue: device },
      { name: "OS Version", subValue: osVer },
      { name: "oPlayer Version", subValue: ver },
      { name: "Theme", subValue: "Spotify Green 1.0.0" },
      { name: "Library", subValue: songs + " songs" },
      { name: "Battery", subValue: bat + "%" + charging }
    ];
  }
  renderSettings();
}

function renderSettings() {
  const ul = $("settings-list");
  ul.innerHTML = "";
  state.settings.options.forEach((opt, i) => {
    const li = document.createElement("li");
    let html = `<span class="item-text">${opt.name}</span>`;
    if (opt.subValue) html += `<span class="opt-value">${opt.subValue}</span>`;
    li.innerHTML = html;
    if (i === state.settings.index) {
      li.classList.add("focused");
      setTimeout(() => li.scrollIntoView({ block: "nearest" }), 0);
    }
    ul.appendChild(li);
  });
  updateMiniPlayer();
}

function selectSettings() {
  const opt = state.settings.options[state.settings.index];
  if (!opt || !opt.action) return;
  const mode = state.settings.mode;

  if (mode === "ROOT") {
    if (opt.action === "shuffle") { Bridge.toggleShuffle(); loadSettingsMenu("ROOT", true); }
    else if (opt.action === "repeat") { Bridge.toggleRepeat(); loadSettingsMenu("ROOT", true); }
    else if (opt.action === "eq") loadSettingsMenu("EQ");
    else if (opt.action === "themes") loadSettingsMenu("THEMES");
    else if (opt.action === "sleep") loadSettingsMenu("SLEEP");
    else if (opt.action === "refresh") { if (Bridge.refreshLibrary) Bridge.refreshLibrary(); }
    else if (opt.action === "import") { if (Bridge.requestImportTheme) Bridge.requestImportTheme(); }
    else if (opt.action === "about") loadSettingsMenu("ABOUT");
  } else if (mode === "EQ") {
    if (Bridge.useEqPreset) Bridge.useEqPreset(opt.index);
    loadSettingsMenu("ROOT");
  } else if (mode === "THEMES") {
    if (Bridge.setTheme) Bridge.setTheme(opt.name);
  } else if (mode === "SLEEP") {
    if (Bridge.setSleepTimer) Bridge.setSleepTimer(opt.value);
    loadSettingsMenu("ROOT");
  }
}

// ── Ticker & Volume ───────────────────────────────────

function startTicker() {
  setInterval(() => {
    if (state.np.playback && state.np.playback.isPlaying) {
      state.np.playback.position = Math.min(
        state.np.playback.duration || 0,
        (state.np.playback.position || 0) + 1000
      );
      if (state.view === "NP") renderNP();
      else updateMiniPlayer();
    }
  }, 1000);
  // Sync with bridge every 5s
  setInterval(refreshNP, 5000);
}

function startVolumeWatcher() {
  if (Bridge.getVolume) state.lastVol = Bridge.getVolume();
  setInterval(() => {
    if (!Bridge.getVolume) return;
    const v = Bridge.getVolume();
    if (v !== state.lastVol) {
      state.lastVol = v;
      showVolumeOSD(v);
    }
  }, 300);
}

function showVolumeOSD(vol) {
  const el = $("volume-osd");
  $("vol-fill").style.width = vol + "%";
  $("vol-pct").innerText = vol + "%";
  el.classList.remove("hidden");
  clearTimeout(state.volTimer);
  state.volTimer = setTimeout(() => el.classList.add("hidden"), 1200);
}

// ── Playback Update Callback ──────────────────────────

function onPlaybackUpdate(playback, track) {
  if (playback) state.np.playback = playback;
  if (track) { state.np.track = track; state.np.lyrics = null; }
  if (state.view === "NP") renderNP();
  else updateMiniPlayer();
}

// ── Input Handlers ────────────────────────────────────

function clamp(val, max) {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(max - 1, val));
}

function handleScroll(delta) {
  if (state.view === "HOME") {
    state.homeIndex = clamp(state.homeIndex + delta, HOME_SELECTABLE.length);
    renderHome();
  } else if (state.view === "LIST") {
    state.list.index = clamp(state.list.index + delta, state.list.items.length);
    updateListHighlight();
  } else if (state.view === "GRID") {
    state.grid.index = clamp(state.grid.index + delta, state.grid.items.length);
    updateGridHighlight();
  } else if (state.view === "SEARCH") {
    state.search.index = clamp(state.search.index + delta, state.search.results.length);
    renderSearchResults();
  } else if (state.view === "SETTINGS") {
    state.settings.index = clamp(state.settings.index + delta, state.settings.options.length);
    renderSettings();
  } else if (state.view === "NP") {
    // Seek with scroll
    if (state.np.playback && state.np.playback.duration) {
      state.np.playback.position = clamp(
        state.np.playback.position + delta * 5000,
        state.np.playback.duration
      );
      if (Bridge.seekTo) Bridge.seekTo(state.np.playback.position);
      renderNP();
    }
  } else if (state.view === "LYRICS") {
    // Scroll lyrics
    const body = $("lyrics-body");
    body.scrollTop += delta * 40;
  }
}

function handleSelect() {
  Bridge.triggerHaptic("click");

  if (state.view === "HOME") {
    const item = HOME_MENU[HOME_SELECTABLE[state.homeIndex]];
    if (!item) return;
    if (item.key === "shuffle_all") { Bridge.shuffleAll(); state.npSource = "HOME"; openNowPlaying(); }
    else if (item.key === "search") openSearch();
    else if (item.key === "settings") openSettings();
    else { state.npSource = "HOME"; openCategory(item.key); }
  } else if (state.view === "LIST") {
    drillItem("LIST");
  } else if (state.view === "GRID") {
    drillItem("GRID");
  } else if (state.view === "SEARCH") {
    selectSearchResult();
  } else if (state.view === "SETTINGS") {
    selectSettings();
  } else if (state.view === "NP") {
    if (state.np && state.np.playback && state.np.playback.isPlaying) {
      if (Bridge.pause) Bridge.pause(); else Bridge.togglePlayPause();
    } else {
      if (Bridge.play) Bridge.play(); else Bridge.togglePlayPause();
    }
    refreshNP();
  } else if (state.view === "LYRICS") {
    // Back to NP
    openNowPlaying();
  }
}

function handleLongSelect() {
  if (state.view === "NP") {
    openLyrics();
  } else if (state.view === "LIST" || state.view === "GRID" || state.view === "HOME") {
    // Quick access to Now Playing
    if (state.np.track) {
      state.npSource = state.view;
      openNowPlaying();
    }
  }
}

function handleBack() {
  if (state.view === "HOME") {
    if (state.np && state.np.track) {
      state.npSource = "HOME";
      openNowPlaying();
    }
    return;
  }

  if (state.view === "NP" || state.view === "LYRICS") {
    // Return to source view
    const src = state.npSource || "HOME";
    if (src === "HOME") renderHome();
    else if (src === "LIST") { state.view = "LIST"; showView("list"); updateMiniPlayer(); }
    else if (src === "GRID") { state.view = "GRID"; showView("grid"); updateMiniPlayer(); }
    else if (src === "SEARCH") { state.view = "SEARCH"; showView("search"); updateMiniPlayer(); }
    else renderHome();
    return;
  }

  if (state.view === "SEARCH") {
    if (Bridge.hideKeyboard) Bridge.hideKeyboard();
    if (Bridge.setInputMode) Bridge.setInputMode(false);
    renderHome();
    return;
  }

  if (state.view === "SETTINGS") {
    if (state.settings.mode !== "ROOT") { loadSettingsMenu("ROOT"); return; }
    renderHome();
    return;
  }

  if (state.view === "LIST") {
    if (state.list.stack.length > 1) {
      // Go back up in folder navigation
      state.list.stack.pop();
      const parent = state.list.stack[state.list.stack.length - 1];
      if (state.list.context === "folders") {
        Bridge.getFolderListingAsync(parent === "ROOT" ? "ROOT" : parent).then(rows => {
          const items = normalize(rows);
          showList(parent === "ROOT" ? "Folders" : "Folder: " + parent, items, "folders");
        });
        return;
      }
    }
    renderHome();
    return;
  }

  if (state.view === "GRID") {
    if (state.grid.stack.length > 1) {
      state.grid.stack.pop();
      // Artist albums back to artists list
      if (state.grid.context === "artist_albums") {
        openCategory("artists");
        return;
      }
    }
    renderHome();
    return;
  }

  renderHome();
}

function handleNext() { Bridge.next(); setTimeout(refreshNP, 300); }
function handlePrevious() { Bridge.previous(); setTimeout(refreshNP, 300); }
function handleUp() { handleScroll(-1); }
function handleDown() { handleScroll(1); }
function handleLeft() { handlePrevious(); }
function handleRight() { handleNext(); }

// ── Global Exports ────────────────────────────────────

window.handleScroll = handleScroll;
window.handleSelect = handleSelect;
window.handleLongSelect = handleLongSelect;
window.handleBack = handleBack;
window.handleNext = handleNext;
window.handlePrevious = handlePrevious;
window.handleUp = handleUp;
window.handleDown = handleDown;
window.handleLeft = handleLeft;
window.handleRight = handleRight;
window.onPlaybackUpdate = onPlaybackUpdate;

  
// Expose focus handling for native callbacks if needed
window.onKeyboardInput = function(text) { 
  $("search-query").value = text;
  handleSearchInput(text); 
};
