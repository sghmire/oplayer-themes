// === oPlayer Theme Logic (shared across all themes) ===
const VIEW = { MENU: 0, LIST: 1, NP: 2, SETTINGS: 3 };

const MENU_ITEMS = [
  { name: 'Music', action: 'music' },
  { name: 'Radio', action: 'radio' },
  { name: 'Podcasts', action: 'podcasts' },
  { name: 'Settings', action: 'settings' },
  { name: 'Exit', action: 'exit' }
];

const SETTINGS_ITEMS = [
  { name: 'Toggle Shuffle', action: 'shuffle' },
  { name: 'Switch Theme', action: 'theme' },
  { name: 'Equalizer', action: 'eq' },
  { name: 'Refresh Library', action: 'refresh' }
];

let view = VIEW.MENU;
let menuIdx = 0;
let listIdx = 0;
let settingsIdx = 0;
let items = [];
let listType = '';
let playbackState = null;

function $(id) { return document.getElementById(id); }
function clamp(v, max) { return Math.max(0, Math.min(v, max - 1)); }

function ensureVisible(container, idx) {
  const el = container.children[idx];
  if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// === INIT ===
window.addEventListener('DOMContentLoaded', function() {
  renderMenu();
  startPlaybackTicker();
});

// === VIEW MANAGEMENT ===
function showView(v) {
  document.querySelectorAll('.view').forEach(function(el) { el.classList.add('hidden'); });
  if (v === VIEW.MENU) $('menu').classList.remove('hidden');
  else if (v === VIEW.LIST) $('songlist').classList.remove('hidden');
  else if (v === VIEW.NP) $('nowplaying').classList.remove('hidden');
  else if (v === VIEW.SETTINGS) $('settings-view').classList.remove('hidden');
  view = v;
}

// === RENDER ===
function renderMenu() {
  var ul = $('menu-list');
  ul.innerHTML = '';
  MENU_ITEMS.forEach(function(item, i) {
    var li = document.createElement('li');
    li.textContent = item.name;
    if (i === menuIdx) li.classList.add('selected');
    ul.appendChild(li);
  });
  showView(VIEW.MENU);
}

function renderList() {
  var ul = $('song-list');
  ul.innerHTML = '';
  if (!items.length) {
    var li = document.createElement('li');
    li.textContent = '(Empty)';
    li.classList.add('empty');
    ul.appendChild(li);
    return;
  }
  items.forEach(function(item, i) {
    var li = document.createElement('li');
    var html = '<span class="item-name">' + (item.name || item.title || 'Untitled') + '</span>';
    if (item.artist) html += '<span class="item-artist">' + item.artist + '</span>';
    li.innerHTML = html;
    if (i === listIdx) {
      li.classList.add('selected');
      setTimeout(function() { ensureVisible(ul, i); }, 0);
    }
    ul.appendChild(li);
  });
}

function renderSettings() {
  var ul = $('settings-list');
  ul.innerHTML = '';
  SETTINGS_ITEMS.forEach(function(item, i) {
    var li = document.createElement('li');
    li.textContent = item.name;
    if (i === settingsIdx) li.classList.add('selected');
    ul.appendChild(li);
  });
  showView(VIEW.SETTINGS);
}

// === DATA ===
function normalizeItems(data) {
  var arr = Array.isArray(data) ? data : (data && data.items ? data.items : []);
  return arr.map(function(r) {
    return {
      id: r.id,
      name: r.name || r.title || 'Untitled',
      title: r.title || r.name,
      artist: r.artist || '',
      art: r.art || r.albumArt || '',
      duration: r.duration || 0
    };
  });
}

async function loadList(type, label, fetchFn) {
  listType = type;
  $('list-header').textContent = label;
  listIdx = 0;
  items = [];
  showView(VIEW.LIST);
  renderList();
  try {
    var data = await fetchFn();
    items = normalizeItems(data);
    renderList();
  } catch (e) { console.error('Load error:', e); }
}

function loadMusic() {
  loadList('music', 'Music', function() { return Bridge.getSongsPaginatedAsync(0, 100); });
}
function loadRadio() {
  loadList('radio', 'Radio Stations', function() { return Bridge.getRadioStationsAsync(); });
}
function loadPodcasts() {
  loadList('podcasts', 'Podcasts', function() { return Bridge.getPodcastsAsync(); });
}

// === PLAYBACK ===
function playItem(item) {
  if (listType === 'music') Bridge.playSong(item.id);
  else if (listType === 'radio') Bridge.playRadio(item.id);
  else if (listType === 'podcasts') Bridge.playEpisode(item.id);
  showView(VIEW.NP);
}

function updateNowPlaying(pb, track) {
  if (track) {
    $('np-title').textContent = track.title || 'Unknown';
    $('np-artist').textContent = track.artist || '';
    var art = $('np-art');
    var placeholder = $('np-art-placeholder');
    if (track.art) {
      art.src = track.art;
      art.classList.remove('hidden');
      if (placeholder) placeholder.classList.add('hidden');
    } else {
      art.classList.add('hidden');
      if (placeholder) placeholder.classList.remove('hidden');
    }
  }
  if (pb) {
    playbackState = pb;
    if (pb.duration) {
      var pct = Math.min(100, (pb.position / pb.duration) * 100);
      $('np-bar').style.width = pct + '%';
      $('np-time').textContent = fmt(pb.position) + ' / ' + fmt(pb.duration);
    }
  }
}

function fmt(ms) {
  var s = Math.floor((ms || 0) / 1000);
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function startPlaybackTicker() {
  setInterval(function() {
    try {
      if (typeof Bridge === 'undefined') return;
      var pb = Bridge.getPlaybackState();
      var tr = Bridge.getCurrentTrack();
      if (pb) updateNowPlaying(typeof pb === 'string' ? JSON.parse(pb) : pb, null);
      if (tr) updateNowPlaying(null, typeof tr === 'string' ? JSON.parse(tr) : tr);
    } catch(e) {}
  }, 1000);
}

// === INPUT ===
function handleScroll(delta) {
  if (typeof Bridge !== 'undefined') Bridge.triggerHaptic('tick');
  if (view === VIEW.MENU) {
    menuIdx = clamp(menuIdx + delta, MENU_ITEMS.length);
    renderMenu();
  } else if (view === VIEW.LIST) {
    listIdx = clamp(listIdx + delta, items.length);
    renderList();
  } else if (view === VIEW.SETTINGS) {
    settingsIdx = clamp(settingsIdx + delta, SETTINGS_ITEMS.length);
    renderSettings();
  }
}

function handleSelect() {
  if (typeof Bridge !== 'undefined') Bridge.triggerHaptic('heavy');
  if (view === VIEW.MENU) {
    var action = MENU_ITEMS[menuIdx].action;
    if (action === 'music') loadMusic();
    else if (action === 'radio') loadRadio();
    else if (action === 'podcasts') loadPodcasts();
    else if (action === 'settings') { settingsIdx = 0; renderSettings(); }
    else if (action === 'exit' && typeof Bridge !== 'undefined') Bridge.setTheme('ipod');
  } else if (view === VIEW.LIST) {
    var item = items[listIdx];
    if (item) playItem(item);
  } else if (view === VIEW.NP) {
    if (typeof Bridge !== 'undefined') Bridge.togglePlayPause();
  } else if (view === VIEW.SETTINGS) {
    var sa = SETTINGS_ITEMS[settingsIdx].action;
    if (typeof Bridge !== 'undefined') {
      if (sa === 'shuffle') Bridge.toggleShuffle();
      else if (sa === 'theme' && Bridge.requestImportTheme) Bridge.requestImportTheme();
      else if (sa === 'refresh' && Bridge.refreshLibrary) Bridge.refreshLibrary();
    }
  }
}

function handleBack() {
  if (view === VIEW.NP) { showView(VIEW.LIST); renderList(); }
  else if (view === VIEW.LIST) renderMenu();
  else if (view === VIEW.SETTINGS) renderMenu();
}

function handleLeft() { if (typeof Bridge !== 'undefined') Bridge.previous(); }
function handleRight() { if (typeof Bridge !== 'undefined') Bridge.next(); }

window.handleScroll = handleScroll;
window.handleSelect = handleSelect;
window.handleBack = handleBack;
window.handleLeft = handleLeft;
window.handleRight = handleRight;
window.onPlaybackUpdate = updateNowPlaying;
