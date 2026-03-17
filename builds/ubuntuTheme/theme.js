const VIEW_MENU = 0;
const VIEW_LIST = 1;
const VIEW_NOW = 2;

const MENU = {
  FOLDERS: 0,
  ALBUMS: 1,
  SONGS: 2,
  NOW: 3,
  SHUFFLE: 4,
  BACK_TO_IPOD: 5
};

const state = {
  view: VIEW_MENU,
  menuIndex: 0,
  listIndex: 0,
  listType: "songs", // songs | albums | folders
  listItems: [],
  shuffle: false,
  folderStack: ["ROOT"],
  ticker: null,
  nowPlayback: null,
  nowTrack: null
};

function $(id) { return document.getElementById(id); }

function setView(next) {
  state.view = next;
  $("menu-view").classList.toggle("hidden", next !== VIEW_MENU);
  $("songs-view").classList.toggle("hidden", next !== VIEW_LIST);
  $("now-view").classList.toggle("hidden", next !== VIEW_NOW);
  render();
}

function render() {
  renderMenu();
  if (state.view === VIEW_LIST) renderList();
}

function keepItemVisible(containerSelector, itemSelector) {
  const list = document.querySelector(containerSelector);
  const item = document.querySelector(itemSelector);
  if (!list || !item) return;
  item.scrollIntoView({ block: "nearest" });
}

function renderMenu() {
  const items = Array.from(document.querySelectorAll("#menu-list li"));
  if (items[MENU.SHUFFLE]) items[MENU.SHUFFLE].innerText = `Shuffle: ${state.shuffle ? "On" : "Off"}`;
  items.forEach((li, i) => li.classList.toggle("selected", i === state.menuIndex));
  keepItemVisible("#menu-list", `#menu-list li:nth-child(${state.menuIndex + 1})`);
}

function normalizeFolderRows(payload) {
  const rows = Array.isArray(payload) ? payload : (payload && Array.isArray(payload.items) ? payload.items : []);

  return rows.map((row) => {
    const isFolder = row.type === "folder" || row.isDirectory === true;
    return {
      ...row,
      isDirectory: isFolder,
      name: row.name || row.title || row.path || "Untitled"
    };
  });
}

function listTitle() {
  if (state.listType === "songs") return "All Songs";
  if (state.listType === "albums") return "Albums";
  if (state.listType === "folders") {
    const path = state.folderStack[state.folderStack.length - 1] || "ROOT";
    return path === "ROOT" ? "Folders" : `Folders: ${path}`;
  }
  return "Library";
}

function renderList() {
  $("songs-title").innerText = listTitle();

  const list = $("songs-list");
  const hint = $("songs-hint");
  list.innerHTML = "";

  if (!state.listItems.length) {
    hint.innerText = "No items found.";
    return;
  }

  hint.innerText = `${state.listItems.length} items loaded`;

  state.listItems.forEach((item, idx) => {
    const li = document.createElement("li");
    if (state.listType === "songs") {
      li.innerText = `${item.title || "Unknown Title"} — ${item.artist || "Unknown Artist"}`;
    } else if (state.listType === "albums") {
      li.innerText = `${item.title || item.name || "Unknown Album"} — ${item.artist || "Unknown Artist"}`;
    } else {
      const icon = item.isDirectory ? "📁" : "🎵";
      const label = item.name || item.title || "Untitled";
      li.innerText = `${icon} ${label}`;
    }

    li.classList.toggle("selected", idx === state.listIndex);
    list.appendChild(li);
  });

  keepItemVisible("#songs-list", `#songs-list li:nth-child(${state.listIndex + 1})`);
}

async function loadAllSongs() {
  state.listType = "songs";
  state.listIndex = 0;
  state.listItems = [];
  setView(VIEW_LIST);
  $("songs-hint").innerText = "Loading songs…";
  try {
    const rows = await Bridge.getSongsPaginatedAsync(0, 200);
    state.listItems = Array.isArray(rows) ? rows : [];
  } catch (e) {
    console.error("Failed to load songs", e);
    state.listItems = [];
  }
  renderList();
}

async function loadAlbums() {
  state.listType = "albums";
  state.listIndex = 0;
  state.listItems = [];
  setView(VIEW_LIST);
  $("songs-hint").innerText = "Loading albums…";
  try {
    const rows = await Bridge.getAlbumsPaginatedAsync(0, 200, null);
    state.listItems = Array.isArray(rows) ? rows : [];
  } catch (e) {
    console.error("Failed to load albums", e);
    state.listItems = [];
  }
  renderList();
}

async function loadFolders(path = "ROOT") {
  state.listType = "folders";
  state.listIndex = 0;
  state.listItems = [];
  setView(VIEW_LIST);
  $("songs-hint").innerText = "Loading folders…";
  try {
    const rows = await Bridge.getFolderListingAsync(path);
    state.listItems = normalizeFolderRows(rows);
  } catch (e) {
    console.error("Failed to load folders", e);
    state.listItems = [];
  }
  renderList();
}

function clampIndex(index, length) {
  if (length <= 0) return 0;
  if (index < 0) return 0;
  if (index >= length) return length - 1;
  return index;
}

function msToClock(ms = 0) {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  return `${min}:${String(rem).padStart(2, "0")}`;
}

function toggleShuffle() {
  state.shuffle = !state.shuffle;
  Bridge.toggleShuffle();
  renderMenu();
}

function updateNowPlaying(playback, track) {
  if (track) {
    state.nowTrack = track;
    $("track-title").innerText = track.title || "Unknown Title";
    $("track-artist").innerText = track.artist || "Unknown Artist";

    const artEl = $("album-art");
    if (track.art) {
      artEl.src = track.art;
      artEl.style.visibility = "visible";
    } else {
      artEl.removeAttribute("src");
      artEl.style.visibility = "hidden";
    }
  }

  if (playback) state.nowPlayback = playback;
  const p = state.nowPlayback;
  if (!p || !p.duration) return;

  const percent = Math.min(100, Math.max(0, (p.position / p.duration) * 100));
  $("progress-bar").style.width = `${percent}%`;
  $("time").innerText = `${msToClock(p.position)} / ${msToClock(p.duration)}`;
}

function refreshNowPlayingFromBridge() {
  const playback = Bridge.getPlaybackState ? Bridge.getPlaybackState() : null;
  const track = Bridge.getCurrentTrack ? Bridge.getCurrentTrack() : null;
  updateNowPlaying(playback, track);
}

function tickNowPlaying() {
  if (state.nowPlayback && state.nowPlayback.isPlaying) {
    state.nowPlayback = {
      ...state.nowPlayback,
      position: Math.min(state.nowPlayback.duration || 0, (state.nowPlayback.position || 0) + 1000)
    };
    updateNowPlaying(state.nowPlayback, null);
  }

  refreshNowPlayingFromBridge();
}

function startNowPlayingTicker() {
  if (state.ticker) return;
  state.ticker = setInterval(tickNowPlaying, 1000);
}

function openMenuAction() {
  switch (state.menuIndex) {
    case MENU.FOLDERS:
      state.folderStack = ["ROOT"];
      loadFolders("ROOT");
      break;
    case MENU.ALBUMS:
      loadAlbums();
      break;
    case MENU.SONGS:
      loadAllSongs();
      break;
    case MENU.NOW:
      setView(VIEW_NOW);
      refreshNowPlayingFromBridge();
      break;
    case MENU.SHUFFLE:
      toggleShuffle();
      break;
    case MENU.BACK_TO_IPOD:
      Bridge.setTheme("ipod");
      break;
  }
}

function openListSelection() {
  const item = state.listItems[state.listIndex];
  if (!item) return;

  if (state.listType === "songs") {
    Bridge.playSong(item.id);
    setView(VIEW_NOW);
    refreshNowPlayingFromBridge();
    return;
  }

  if (state.listType === "albums") {
    const albumId = item.id || item.title || item.name;
    Bridge.playAlbum(albumId, 0, state.shuffle);
    setView(VIEW_NOW);
    refreshNowPlayingFromBridge();
    return;
  }

  if (state.listType === "folders") {
    if (item.isDirectory) {
      const next = item.path || item.fullPath || item.name;
      if (!next) return;
      state.folderStack.push(next);
      loadFolders(next);
      return;
    }

    if (item.id) {
      Bridge.playSong(item.id);
      setView(VIEW_NOW);
      refreshNowPlayingFromBridge();
    }
  }
}

function handleScroll(delta) {
  Bridge.triggerHaptic("tick");

  if (state.view === VIEW_MENU) {
    state.menuIndex = clampIndex(state.menuIndex + delta, 6);
    renderMenu();
    return;
  }

  if (state.view === VIEW_LIST) {
    state.listIndex = clampIndex(state.listIndex + delta, state.listItems.length);
    renderList();
  }
}

function handleSelect() {
  Bridge.triggerHaptic("heavy");

  if (state.view === VIEW_MENU) {
    openMenuAction();
    return;
  }

  if (state.view === VIEW_LIST) {
    openListSelection();
  }
}

function handleLongSelect() {
  if (state.view === VIEW_NOW) Bridge.togglePlayPause();
}

function handleBack() {
  if (state.view === VIEW_NOW) {
    setView(VIEW_MENU);
    return;
  }

  if (state.view === VIEW_LIST) {
    if (state.listType === "folders" && state.folderStack.length > 1) {
      state.folderStack.pop();
      loadFolders(state.folderStack[state.folderStack.length - 1]);
      return;
    }
    setView(VIEW_MENU);
  }
}

function handlePlayPause() { Bridge.togglePlayPause(); refreshNowPlayingFromBridge(); }
function handleNext() { Bridge.next(); refreshNowPlayingFromBridge(); }
function handlePrevious() { Bridge.previous(); refreshNowPlayingFromBridge(); }
function handleUp() { handleScroll(-1); }
function handleDown() { handleScroll(1); }
function handleLeft() { handlePrevious(); }
function handleRight() { handleNext(); }
function onPlaybackUpdate(playback, track) { updateNowPlaying(playback, track); }

window.handleScroll = handleScroll;
window.handleSelect = handleSelect;
window.handleLongSelect = handleLongSelect;
window.handleBack = handleBack;
window.handlePlayPause = handlePlayPause;
window.handleNext = handleNext;
window.handlePrevious = handlePrevious;
window.handleUp = handleUp;
window.handleDown = handleDown;
window.handleLeft = handleLeft;
window.handleRight = handleRight;
window.onPlaybackUpdate = onPlaybackUpdate;

window.addEventListener("DOMContentLoaded", () => {
  render();
  startNowPlayingTicker();
  refreshNowPlayingFromBridge();
});
