// ═══════════════════════════════════════════════════════
// oPlayer — 8-Bit iPod Classic Theme
// ═══════════════════════════════════════════════════════

const $ = id => document.getElementById(id);
const VISIBLE = 11;

// ── State ─────────────────────────────────────────────

const S = {
    stack: [],        // [{title, items, index, offset}]
    view: "LIST",     // LIST | NP
    npTrack: null,
    npState: null,
    playing: false,
    volTimer: null
};

// ── Init ──────────────────────────────────────────────

window.onload = function () {
    push("oPlayer", mainMenu());
    updateBattery();
    setInterval(updateBattery, 60000);
    // Try to get initial playback state
    try {
        var ps = Bridge.getPlaybackState();
        var ct = Bridge.getCurrentTrack();
        var playback = typeof ps === "string" ? JSON.parse(ps) : ps;
        var track = typeof ct === "string" ? JSON.parse(ct) : ct;
        if (playback) S.npState = playback;
        if (track) S.npTrack = track;
        S.playing = playback && playback.isPlaying;
    } catch (e) {}
};

// ── Battery ───────────────────────────────────────────

function updateBattery() {
    try {
        var lvl = Bridge.getBatteryLevel();
        var chr = Bridge.isCharging();
        $("battery").textContent = (chr ? "+" : "") + lvl + "%";
    } catch (e) {}
}

// ── Navigation Stack ──────────────────────────────────

function push(title, items) {
    S.stack.push({ title: title, items: items, index: 0, offset: 0 });
    S.view = "LIST";
    render();
}

function pop() {
    if (S.stack.length > 1) {
        S.stack.pop();
        S.view = "LIST";
        render();
    }
}

function cur() {
    return S.stack[S.stack.length - 1];
}

// ── Menu Definitions ──────────────────────────────────

function mainMenu() {
    return [
        { label: "Music", arrow: true, action: function () { push("Music", musicMenu()); } },
        { label: "Podcasts", arrow: true, action: loadPodcasts },
        { label: "Radio", arrow: true, action: loadRadio },
        { label: "Now Playing", action: openNP },
        { label: "Shuffle Songs", action: function () { Bridge.shuffleAll(); openNP(); } },
        { label: "Settings", arrow: true, action: function () { push("Settings", settingsMenu()); } }
    ];
}

function musicMenu() {
    return [
        { label: "All Songs", arrow: true, action: loadSongs },
        { label: "Albums", arrow: true, action: loadAlbums },
        { label: "Artists", arrow: true, action: loadArtists },
        { label: "Playlists", arrow: true, action: loadPlaylists },
        { label: "Genres", arrow: true, action: loadGenres },
        { label: "Recently Played", arrow: true, action: loadRecent },
        { label: "Most Played", arrow: true, action: loadMostPlayed },
        { label: "Favorites", arrow: true, action: loadFavorites }
    ];
}

function settingsMenu() {
    var shuf = false;
    try { shuf = Bridge.isShuffle(); } catch (e) {}
    var shufOn = (shuf === true || shuf === "true");

    var rep = "OFF";
    try { rep = Bridge.getRepeatMode(); } catch (e) {}

    var sleepMin = 0;
    try { sleepMin = Bridge.getSleepTimerMinutes(); } catch (e) {}

    return [
        { label: "Shuffle", value: shufOn ? "On" : "Off", action: toggleShuffle },
        { label: "Repeat", value: rep, action: toggleRepeat },
        { label: "Equalizer", arrow: true, action: loadEQ },
        { label: "Sleep Timer", arrow: true, value: sleepMin > 0 ? sleepMin + "m" : "Off", action: loadSleepTimer },
        { label: "Themes", arrow: true, action: loadThemes },
        { label: "Refresh Library", action: function () { Bridge.refreshLibrary(); Bridge.showToast("Refreshing..."); } },
        { label: "Import Theme", action: function () { Bridge.requestImportTheme(); } },
        { label: "About", arrow: true, action: showAbout }
    ];
}

// ── Data Loaders ──────────────────────────────────────

function emptyList(title) {
    push(title, [{ label: "(Empty)" }]);
}

function makeSongItems(data, playFn) {
    return data.map(function (s, i) {
        return {
            label: s.title || s.name || "Untitled",
            action: function () { playFn(s, i); openNP(); }
        };
    });
}

async function loadSongs() {
    try {
        var data = await Bridge.getSongsPaginatedAsync(0, 500);
        if (!data || !data.length) return emptyList("All Songs");
        push("All Songs", makeSongItems(data, function (s) { Bridge.playSong(s.id); }));
    } catch (e) { emptyList("All Songs"); }
}

async function loadAlbums() {
    try {
        var data = await Bridge.getAlbumsPaginatedAsync(0, 200);
        if (!data || !data.length) return emptyList("Albums");
        push("Albums", data.map(function (a) {
            return {
                label: (a.name || a.title) + (a.artist ? "  [" + a.artist + "]" : ""),
                arrow: true,
                action: function () { loadAlbumTracks(a); }
            };
        }));
    } catch (e) { emptyList("Albums"); }
}

async function loadAlbumTracks(album) {
    try {
        var data = await Bridge.getSongsByAlbumAsync(album.id || album);
        var title = album.name || album.title;
        if (!data || !data.length) return emptyList(title);
        push(title, makeSongItems(data, function (s, i) {
            Bridge.playAlbum(album.id || album, i, false);
        }));
    } catch (e) { emptyList(album.name || album.title); }
}

async function loadArtists() {
    try {
        var data = await Bridge.getArtistsPaginatedAsync(0, 200);
        if (!data || !data.length) return emptyList("Artists");
        push("Artists", data.map(function (a) {
            return {
                label: a.name,
                arrow: true,
                action: function () { loadArtistSongs(a.name); }
            };
        }));
    } catch (e) { emptyList("Artists"); }
}

async function loadArtistSongs(artist) {
    try {
        var data = Bridge.getSongsByArtistAsync ? await Bridge.getSongsByArtistAsync(artist) : [];
        if (!data || !data.length) return emptyList(artist);
        push(artist, makeSongItems(data, function (s, i) {
            Bridge.playArtist(artist, i, false);
        }));
    } catch (e) { emptyList(artist); }
}

async function loadPlaylists() {
    try {
        var data = await Bridge.getPlaylistsAsync();
        if (!data || !data.length) return emptyList("Playlists");
        push("Playlists", data.map(function (p) {
            return {
                label: p.name + (p.songCount ? "  (" + p.songCount + ")" : ""),
                arrow: true,
                action: function () { loadPlaylistSongs(p); }
            };
        }));
    } catch (e) { emptyList("Playlists"); }
}

async function loadPlaylistSongs(pl) {
    try {
        var data = await Bridge.getPlaylistSongsAsync(pl.id);
        if (!data || !data.length) return emptyList(pl.name);
        push(pl.name, makeSongItems(data, function (s, i) {
            Bridge.playPlaylist(pl.id, i, false);
        }));
    } catch (e) { emptyList(pl.name); }
}

async function loadGenres() {
    try {
        var data = await Bridge.getGenresAsync();
        if (!data || !data.length) return emptyList("Genres");
        push("Genres", data.map(function (g) {
            return {
                label: g.name,
                arrow: true,
                action: function () { loadGenreSongs(g.name); }
            };
        }));
    } catch (e) { emptyList("Genres"); }
}

async function loadGenreSongs(genre) {
    try {
        var data = await Bridge.getSongsByGenreAsync(genre);
        if (!data || !data.length) return emptyList(genre);
        push(genre, makeSongItems(data, function (s, i) {
            Bridge.playGenre(genre, i);
        }));
    } catch (e) { emptyList(genre); }
}

async function loadRecent() {
    try {
        var data = await Bridge.getRecentSongsAsync();
        if (!data || !data.length) return emptyList("Recently Played");
        push("Recently Played", makeSongItems(data, function (s, i) {
            Bridge.playRecent(i);
        }));
    } catch (e) { emptyList("Recently Played"); }
}

async function loadMostPlayed() {
    try {
        var data = await Bridge.getMostPlayedAsync();
        if (!data || !data.length) return emptyList("Most Played");
        push("Most Played", makeSongItems(data, function (s) {
            Bridge.playSong(s.id);
        }));
    } catch (e) { emptyList("Most Played"); }
}

async function loadFavorites() {
    try {
        var data = await Bridge.getFavoritesAsync();
        if (!data || !data.length) return emptyList("Favorites");
        push("Favorites", makeSongItems(data, function (s, i) {
            Bridge.playFavorites(i);
        }));
    } catch (e) { emptyList("Favorites"); }
}

async function loadPodcasts() {
    try {
        var data = await Bridge.getPodcastsAsync();
        if (!data || !data.length) return emptyList("Podcasts");
        push("Podcasts", data.map(function (p) {
            return {
                label: p.title || p.name,
                arrow: true,
                action: function () { loadEpisodes(p); }
            };
        }));
    } catch (e) { emptyList("Podcasts"); }
}

async function loadEpisodes(podcast) {
    try {
        var data = await Bridge.getPodcastEpisodesAsync(podcast.id);
        var title = podcast.title || podcast.name;
        if (!data || !data.length) return emptyList(title);
        push(title, data.map(function (e) {
            return {
                label: e.title || e.name || "Episode",
                action: function () { Bridge.playEpisode(e.id); openNP(); }
            };
        }));
    } catch (e) { emptyList(podcast.title || podcast.name); }
}

async function loadRadio() {
    try {
        var data = await Bridge.getRadioStationsAsync();
        if (!data || !data.length) return emptyList("Radio");
        push("Radio", data.map(function (r) {
            return {
                label: r.name || r.title,
                action: function () { Bridge.playRadio(r.id); openNP(); }
            };
        }));
    } catch (e) { emptyList("Radio"); }
}

// ── Settings Helpers ──────────────────────────────────

function toggleShuffle() {
    Bridge.toggleShuffle();
    rebuildSettings();
}

function toggleRepeat() {
    Bridge.toggleRepeat();
    rebuildSettings();
}

function rebuildSettings() {
    var st = S.stack[S.stack.length - 1];
    var idx = st.index;
    var off = st.offset;
    st.items = settingsMenu();
    st.index = idx;
    st.offset = off;
    render();
}

async function loadEQ() {
    try {
        var data = await Bridge.getEqPresetsAsync();
        if (!data || !data.length) {
            // Fallback: try sync version
            try {
                var raw = Bridge.getEqPresets();
                data = typeof raw === "string" ? JSON.parse(raw) : raw;
            } catch (e2) {}
        }
        if (!data || !data.length) return emptyList("Equalizer");
        push("Equalizer", data.map(function (p, i) {
            var name = typeof p === "string" ? p : (p.name || "Preset " + (i + 1));
            return {
                label: name,
                action: function () {
                    Bridge.useEqPreset(i);
                    Bridge.showToast("EQ: " + name);
                    pop();
                }
            };
        }));
    } catch (e) { emptyList("Equalizer"); }
}

function loadSleepTimer() {
    var opts = [
        { min: 0, label: "Off" },
        { min: 15, label: "15 minutes" },
        { min: 30, label: "30 minutes" },
        { min: 45, label: "45 minutes" },
        { min: 60, label: "1 hour" },
        { min: 90, label: "1.5 hours" },
        { min: 120, label: "2 hours" }
    ];
    push("Sleep Timer", opts.map(function (o) {
        return {
            label: o.label,
            action: function () {
                Bridge.setSleepTimer(o.min);
                Bridge.showToast(o.min ? "Sleep: " + o.min + "min" : "Sleep timer off");
                pop();
            }
        };
    }));
}

async function loadThemes() {
    try {
        var raw = Bridge.getAvailableThemes();
        var themes = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (!themes || !themes.length) return emptyList("Themes");
        push("Themes", themes.map(function (t) {
            var id = typeof t === "string" ? t : t.id;
            var name = typeof t === "string" ? t : (t.name || t.id);
            return {
                label: name,
                action: function () { Bridge.setTheme(id); }
            };
        }));
    } catch (e) { emptyList("Themes"); }
}

function showAbout() {
    var ver = "?", count = "?";
    try { ver = Bridge.getAppVersion(); } catch (e) {}
    try { count = Bridge.getSongCount(); } catch (e) {}
    push("About", [
        { label: "oPlayer v" + ver },
        { label: count + " songs in library" },
        { label: "Theme: 8-Bit iPod v1.1.0" },
        { label: "Built for retro lovers" }
    ]);
}

// ── Now Playing ───────────────────────────────────────

function openNP() {
    S.view = "NP";
    render();
}

// ── Render ────────────────────────────────────────────

function render() {
    if (S.view === "LIST") {
        $("list-view").classList.remove("hidden");
        $("np-view").classList.add("hidden");
        renderList();
    } else {
        $("list-view").classList.add("hidden");
        $("np-view").classList.remove("hidden");
        renderNP();
    }
    $("play-icon").classList.toggle("hidden", !S.playing);
}

function renderList() {
    var list = cur();
    $("header-title").textContent = list.title;

    var ul = $("list-items");
    ul.innerHTML = "";
    var items = list.items;
    if (!items.length) return;

    var start = list.offset;
    var end = Math.min(start + VISIBLE, items.length);

    for (var i = start; i < end; i++) {
        var item = items[i];
        var li = document.createElement("li");
        if (i === list.index) li.className = "selected";

        var label = document.createElement("span");
        label.className = "item-label";
        label.textContent = item.label;
        li.appendChild(label);

        if (item.value) {
            var val = document.createElement("span");
            val.className = "item-value";
            val.textContent = item.value;
            li.appendChild(val);
        }

        if (item.arrow) {
            var arrow = document.createElement("span");
            arrow.className = "item-arrow";
            arrow.textContent = "\u25BA";
            li.appendChild(arrow);
        }

        ul.appendChild(li);
    }

    // Scrollbar
    var sb = $("scrollbar");
    var thumb = $("scrollbar-thumb");
    if (items.length > VISIBLE) {
        sb.classList.remove("hidden");
        var ratio = VISIBLE / items.length;
        var thumbH = Math.max(ratio * sb.clientHeight, 14);
        var maxOffset = items.length - VISIBLE;
        var thumbTop = maxOffset > 0 ? (list.offset / maxOffset) * (sb.clientHeight - thumbH) : 0;
        thumb.style.height = thumbH + "px";
        thumb.style.top = thumbTop + "px";
    } else {
        sb.classList.add("hidden");
    }
}

function renderNP() {
    $("header-title").textContent = "Now Playing";

    var t = S.npTrack;
    if (t) {
        $("np-title").textContent = t.title || "---";
        $("np-artist").textContent = t.artist || "";
        $("np-album").textContent = t.album || "";

        if (t.art) {
            $("np-art-img").src = t.art;
            $("np-art-img").classList.remove("hidden");
            $("np-art-icon").classList.add("hidden");
        } else {
            $("np-art-img").classList.add("hidden");
            $("np-art-icon").classList.remove("hidden");
        }
    } else {
        $("np-title").textContent = "No track playing";
        $("np-artist").textContent = "";
        $("np-album").textContent = "";
        $("np-art-img").classList.add("hidden");
        $("np-art-icon").classList.remove("hidden");
    }

    var s = S.npState;
    if (s) {
        var pct = s.duration > 0 ? (s.position / s.duration * 100) : 0;
        $("np-bar-fill").style.width = pct + "%";
        $("np-time-cur").textContent = fmt(s.position);
        $("np-time-tot").textContent = fmt(s.duration);
        $("np-play").innerHTML = s.isPlaying ? "&#10074;&#10074;" : "&#9654;";

        var shuf = s.shuffle === true || s.shuffle === "true";
        var rep = s.repeat || "OFF";
        $("np-shuffle").textContent = "Shuffle:" + (shuf ? "On" : "Off");
        $("np-shuffle").className = shuf ? "mode-active" : "";
        $("np-repeat").textContent = "Repeat:" + rep;
        $("np-repeat").className = rep !== "OFF" ? "mode-active" : "";
    }
}

function fmt(ms) {
    if (!ms || ms < 0) return "0:00";
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return m + ":" + (sec < 10 ? "0" + sec : sec);
}

// ── Volume OSD ────────────────────────────────────────

function showVolume() {
    var vol = Bridge.getVolume();
    $("vol-bar-fill").style.width = vol + "%";
    $("vol-pct").textContent = vol + "%";
    $("volume-osd").classList.remove("hidden");
    clearTimeout(S.volTimer);
    S.volTimer = setTimeout(function () {
        $("volume-osd").classList.add("hidden");
    }, 1500);
}

// ── Playback Ticker ───────────────────────────────────

setInterval(function () {
    if (S.npState && S.npState.isPlaying && S.npState.duration) {
        S.npState.position = Math.min(S.npState.duration, (S.npState.position || 0) + 1000);
        if (S.view === "NP") renderNP();
    }
}, 1000);

// Sync with bridge periodically
setInterval(function () {
    try {
        var ps = Bridge.getPlaybackState();
        var ct = Bridge.getCurrentTrack();
        var playback = typeof ps === "string" ? JSON.parse(ps) : ps;
        var track = typeof ct === "string" ? JSON.parse(ct) : ct;
        if (playback) S.npState = playback;
        if (track) S.npTrack = track;
        S.playing = playback && playback.isPlaying;
        $("play-icon").classList.toggle("hidden", !S.playing);
    } catch (e) {}
}, 5000);

// ── Input Handlers ────────────────────────────────────

function handleScroll(delta) {
    if (S.view === "LIST") {
        var list = cur();
        var len = list.items.length;
        if (!len) return;

        var next = list.index + delta;
        if (next < 0 || next >= len) return;
        list.index = next;

        // Adjust visible window
        if (list.index < list.offset) list.offset = list.index;
        if (list.index >= list.offset + VISIBLE) list.offset = list.index - VISIBLE + 1;

        Bridge.triggerHaptic("tick");
        render();
    } else if (S.view === "NP") {
        // Scroll adjusts volume in NP view
        Bridge.adjustVolume(delta * 5);
        showVolume();
    }
}

function handleSelect() {
    Bridge.triggerHaptic("heavy");

    if (S.view === "LIST") {
        var list = cur();
        var item = list.items[list.index];
        if (item && item.action) item.action();
    } else if (S.view === "NP") {
        Bridge.togglePlayPause();
    }
}

function handleBack() {
    if (S.view === "NP") {
        S.view = "LIST";
        render();
    } else {
        pop();
    }
}

function handlePlayPause() {
    Bridge.togglePlayPause();
}

function handleNext() {
    Bridge.next();
}

function handlePrevious() {
    Bridge.previous();
}

function handleLongSelect() {
    // Long press opens Now Playing from any list
    if (S.view === "LIST" && S.npTrack) {
        openNP();
    }
}

function handleUp() { handleScroll(-1); }
function handleDown() { handleScroll(1); }
function handleLeft() { handleBack(); }
function handleRight() { handleSelect(); }

// ── Playback Callback ─────────────────────────────────

function onPlaybackUpdate(state, track) {
    if (state) S.npState = state;
    if (track) S.npTrack = track;
    S.playing = state && state.isPlaying;

    if (S.view === "NP") renderNP();
    $("play-icon").classList.toggle("hidden", !S.playing);
}

// ── Global Exports ────────────────────────────────────

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
