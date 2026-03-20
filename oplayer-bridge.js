/**
 * oplayer-bridge.js
 * Complete 1:1 mapping of WebAppInterface.kt
 * Fixed for ID-based Lookups and Shuffle Support
 */
const Bridge = {
    call(method, ...args) {
        if (typeof AndroidHost === 'undefined') return null;
        try {
            let result;
            // Handle different argument lengths explicitly to ensure correct method signature matching in Android
            if (args.length === 0) result = AndroidHost[method]();
            else if (args.length === 1) result = AndroidHost[method](args[0]);
            else if (args.length === 2) result = AndroidHost[method](args[0], args[1]);
            else if (args.length === 3) result = AndroidHost[method](args[0], args[1], args[2]);
            else result = AndroidHost[method](...args);

            if (typeof result === 'string') {
                const trimmed = result.trim();
                if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                    try { return JSON.parse(trimmed); } catch (e) { return result; }
                }
            }
            return result;
        } catch (e) {
            console.error(`[Bridge] Error ${method}:`, e);
            return null;
        }
    },

    // ─── SYSTEM ───
    getSettings: () => Bridge.call('getSettings'),
    setSetting: (key, val) => Bridge.call('setSetting', key, String(val)),
    getDeviceModels: () => Bridge.call('getDeviceModels'),
    getFrameColors: () => Bridge.call('getFrameColors'),
    getAppVersion: () => Bridge.call('getAppVersion'),
    getSongCount: () => Bridge.call('getSongCount'),
    getBatteryLevel: () => Bridge.call('getBatteryLevel'),
    isCharging: () => Bridge.call('isCharging'),
    triggerClick: () => Bridge.call('triggerClick'),
    triggerHaptic: (style) => Bridge.call('triggerHaptic', style),
    setInputMode: (mode) => Bridge.call('setInputMode', mode),

    // ─── VOLUME ───
    getVolume: () => Bridge.call('getVolume'),
    setVolume: (level) => Bridge.call('setVolume', level),
    adjustVolume: (delta) => Bridge.call('adjustVolume', delta),

    // ─── MUSIC DATA ───
    getSongsPaginated: (off, lim) => Bridge.call('getSongsPaginated', off, lim),
    getSongsPaginatedAsync: async (off, lim) => {
        try {
            // Hit the virtual Local API created in MainActivity.kt
            const url = `https://app-theme.local/api/songs?offset=${off}&limit=${lim}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error("HTTP error " + response.status);
            return await response.json();

        } catch (error) {
            console.warn("[Bridge] Local API fetch failed, falling back to JNI:", error);
            // Safe fallback: If the Kotlin interceptor fails, use the old synchronous method
            return Bridge.getSongsPaginated(off, lim);
        }
    },
    getAllSongs: () => Bridge.call('getSongList'),

    // [FIX] Pass null if artist is undefined to prevent mismatch
    getAlbumsPaginated: (off, lim, artist) => Bridge.call('getAlbumsPaginated', off, lim, artist || null),
    getAlbumsPaginatedAsync: async (off, lim, artist) => {
        try {
            // Note: you will need to add this route to your Kotlin shouldInterceptRequest!
            const url = `https://app-theme.local/api/albums?offset=${off}&limit=${lim}&artist=${artist || ''}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return await response.json();
        } catch (error) {
            console.warn("[Bridge] Local API fetch failed for Albums:", error);
            return Bridge.getAlbumsPaginated(off, lim, artist);
        }
    },

    getArtistsPaginated: (off, lim) => Bridge.call('getArtistsPaginated', off, lim),
    getArtistsPaginatedAsync: async (off, lim) => {
        try {
            // Note: you will need to add this route to your Kotlin shouldInterceptRequest!
            const url = `https://app-theme.local/api/artists?offset=${off}&limit=${lim}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return await response.json();
        } catch (error) {
            console.warn("[Bridge] Local API fetch failed for Artists:", error);
            return Bridge.getArtistsPaginated(off, lim);
        }
    },

    // Legacy wrappers
    getArtists: () => Bridge.call('getArtistList'),
    getAlbums: () => Bridge.call('getAlbumList', null),

    getGenres: () => Bridge.call('getGenreList'),
    getGenresAsync: async () => {
        try {
            const response = await fetch(`https://app-theme.local/api/genres`);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return await response.json();
        } catch (e) { return Bridge.getGenres(); }
    },

    getSongsByGenreAsync: async (genre) => {
        try {
            const response = await fetch(`https://app-theme.local/api/genreSongs?genre=${encodeURIComponent(genre)}`);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return await response.json();
        } catch (e) {
            return Bridge.getSongsByGenre(genre); // Fallback
        }
    },
    getYears: () => Bridge.call('getYearList'),
    getYearsAsync: async () => {
        try {
            const response = await fetch(`https://app-theme.local/api/years`);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return await response.json();
        } catch (e) { return Bridge.getYears(); }
    },
    getPlaylists: () => Bridge.call('getPlaylists'),
    getPlaylistsAsync: async () => {
        try {
            const ts = new Date().getTime();
            const response = await fetch(`https://app-theme.local/api/playlists?_t=${ts}`, { cache: 'no-store' });
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return await response.json();
        } catch (e) { return Bridge.getPlaylists(); }
    },
    getPlaylistSongsAsync: async (id) => {
        try {
            const response = await fetch(`https://app-theme.local/api/playlistSongs?id=${id}`);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return await response.json();
        } catch (e) {
            // Fallback: ask native layer to emit a callback, then resolve once it arrives
            return await Bridge.getPlaylistSongsSafe(id);
        }
    },
    getPlaylistSongsSafe: (id) => new Promise(resolve => {
        // Prepare one-time callback hook
        window.onPlaylistSongsLoaded = (jsonStr) => {
            try { resolve(JSON.parse(jsonStr)); }
            catch (_) { resolve([]); }
            delete window.onPlaylistSongsLoaded;
        };
        // Kick off async load on native side (returns cached data immediately if present)
        const cached = Bridge.getPlaylistSongs(id);
        if (cached && cached !== "[]") {
            // If cache hit, resolve synchronously and clean up hook
            try { resolve(JSON.parse(cached)); } catch (_) { resolve([]); }
            delete window.onPlaylistSongsLoaded;
        }
    }),
    getRecentSongs: () => Bridge.call('getRecentSongs'),
    getRecentSongsAsync: async () => {
        try {
            // Append timestamp to break Chromium cache
            const ts = new Date().getTime();
            const res = await fetch(`https://app-theme.local/api/recentSongs?_t=${ts}`, { cache: 'no-store' });
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return await res.json();
        } catch (e) {
            console.warn("[Bridge] Local API fetch failed for Recent Songs:", e);
            return Bridge.getRecentSongs();
        }
    },
    getMostPlayed: () => Bridge.call('getMostPlayed'),
    getMostPlayedAsync: async () => {
        try {
            // Append timestamp to break Chromium cache
            const ts = new Date().getTime();
            const res = await fetch(`https://app-theme.local/api/mostPlayed?_t=${ts}`, { cache: 'no-store' });
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return await res.json();
        } catch (e) {
            console.warn("[Bridge] Local API fetch failed for Most Played:", e);
            return Bridge.getMostPlayed();
        }
    },
    getFavorites: () => Bridge.call('getFavorites'),
    getFavoritesAsync: async () => {
        try {
            const ts = new Date().getTime();
            const res = await fetch(`https://app-theme.local/api/favorites?_t=${ts}`, { cache: 'no-store' });
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return await res.json();
        } catch (e) {
            console.warn("[Bridge] Local API fetch failed for Favorites:", e);
            return Bridge.getFavorites();
        }
    },
    getFolderListing: (path) => Bridge.call('getFolderListing', path),
    excludeFolder: (path) => Bridge.call('excludeFolder', path),
    includeFolder: (path) => Bridge.call('includeFolder', path),
    getExcludedFoldersAsync: async () => {
        try {
            const url = `https://app-theme.local/api/excludedFolders`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return await response.json();
        } catch (error) {
            console.warn("[Bridge] Local API fetch failed for Excluded Folders:", error);
            const str = Bridge.call('getExcludedFolders');
            if (typeof str === 'string') return JSON.parse(str);
            return str;
        }
    },
    getFolderListingAsync: async (path) => {
        try {
            const url = `https://app-theme.local/api/folderView?path=${encodeURIComponent(path)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return await response.json();
        } catch (error) {
            console.warn("[Bridge] Local API fetch failed for Folders:", error);
            return Bridge.getFolderListing(path); // Fallback
        }
    },
    playFolder: (path, idx) => Bridge.call('playFolder', path, idx),

    // ─── FILTERED LISTS ───
    getSongsByArtist: (artist) => Bridge.call('getSongsByArtist', artist),
    getSongsByArtistAsync: async (artist) => {
        try {
            const url = `https://app-theme.local/api/artistSongs?artist=${encodeURIComponent(artist)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return await response.json();
        } catch (error) {
            console.warn("[Bridge] Local API fetch failed for Artist Songs:", error);
            return Bridge.getSongsByArtist(artist); // Fallback
        }
    },
    getAlbumsByArtist: (artist) => Bridge.call('getAlbumsByArtist', artist),

    // [CRITICAL FIX] ID Extraction
    // If the theme passes an Album Object (which contains {id: 123, title: "..."}),
    // we must extract the 'id' to send to Android.
    getSongsByAlbum: (albumOrId) => {
        // If it's an object (from getAlbumList), use the ID.
        // If it's a string (legacy), pass it as is.
        const id = (typeof albumOrId === 'object' && albumOrId !== null)
            ? (albumOrId.id || albumOrId.title)
            : albumOrId;
        return Bridge.call('getSongsByAlbum', String(id)); // Convert to String for the @JavascriptInterface
    },
    getSongsByAlbumAsync: async (albumOrId) => {
        // ID Extraction logic just like the original
        const id = (typeof albumOrId === 'object' && albumOrId !== null)
            ? (albumOrId.id || albumOrId.title)
            : albumOrId;

        try {
            const url = `https://app-theme.local/api/albumSongs?album=${encodeURIComponent(String(id))}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return await response.json();
        } catch (error) {
            console.warn("[Bridge] Local API fetch failed for Album Songs:", error);
            return Bridge.getSongsByAlbum(albumOrId); // Fallback
        }
    },

    getSongsByGenre: (genre) => Bridge.call('getSongsByGenre', genre),
    getSongsByYear: (year) => Bridge.call('getSongsByYear', year),
    getPlaylistSongs: (id) => Bridge.call('getPlaylistSongs', id),

    // ─── PODCASTS & RADIO ───
    getPodcasts: () => Bridge.call('getPodcastList'),
    getPodcastsAsync: async () => {
        try {
            const ts = new Date().getTime();
            const res = await fetch(`https://app-theme.local/api/podcasts?_t=${ts}`, { cache: 'no-store' });
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return await res.json();
        } catch (e) { return Bridge.getPodcasts(); }
    },
    getPodcastEpisodes: (id) => Bridge.call('getPodcastEpisodes', id),
    getPodcastEpisodesAsync: async (id) => {
        try {
            // [FIX] Append a timestamp & no-store so Chromium NEVER caches this JSON response
            const ts = new Date().getTime();
            const response = await fetch(`https://app-theme.local/api/podcastEpisodes?id=${id}&_t=${ts}`, { cache: 'no-store' });
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return await response.json();
        } catch (error) {
            console.warn("[Bridge] Local API fetch failed for Podcast Episodes:", error);
            return Bridge.getPodcastEpisodes(id); // Fallback
        }
    },
    getRecentEpisodes: () => Bridge.call('getRecentEpisodes'),
    addPodcastAsync: (url) => Bridge.call('addPodcastAsync', url),
    removePodcast: (id) => Bridge.call('removePodcast', id),
    refreshPodcast: (id) => Bridge.call('refreshPodcast', id),
    downloadEpisode: (id) => Bridge.call('downloadEpisode', id),
    deleteEpisodeDownload: (id) => Bridge.call('deleteEpisodeDownload', id),
    markEpisodePlayed: (id, played) => Bridge.call('markEpisodePlayed', id, played),

    getRadioStations: () => Bridge.call('getRadioStations') || [],
    getRadioStationsAsync: async () => {
        try {
            const ts = new Date().getTime();
            const res = await fetch(`https://app-theme.local/api/radios?_t=${ts}`, { cache: 'no-store' });
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return await res.json();
        } catch (e) { return Bridge.getRadioStations(); }
    },
    searchRadioOnline: (query) => Bridge.call('searchRadioOnline', query),
    searchRadioAsync: (query) => Bridge.call('searchRadioAsync', query),
    searchPodcastAsync: (query) => Bridge.call('searchPodcastAsync', query),
    getCoverFlowData: () => Bridge.call('getCoverFlowData'),
    addRadioStationAsync: (url) => Bridge.call('addRadioStationFromUrlAsync', url),
    removeRadioStation: (id) => Bridge.call('removeRadioStation', id),
    renameRadioStation: (id, name) => Bridge.call('renameRadioStation', id, name),

    // ─── VIDEOS ───
    getVideos: () => Bridge.call('getVideoList'),
    getVideosAsync: async () => {
        try {
            // Videos might change slightly based on filesystem, break cache
            const ts = new Date().getTime();
            const res = await fetch(`https://app-theme.local/api/videos?_t=${ts}`, { cache: 'no-store' });
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return await res.json();
        } catch (e) {
            console.warn("[Bridge] Local API fetch failed for Videos:", e);
            return Bridge.getVideos();
        }
    },
    requestVideoPermissions: () => Bridge.call('requestVideoPermissions'),
    refreshVideoLibrary: () => Bridge.call('refreshVideoLibrary'),
    playVideo: (id) => Bridge.call('playVideo', id),

    // ─── PLAYBACK CONTROLS ───
    playSong: (id) => Bridge.call('playSong', id),

    // [CRITICAL FIX] Added 'shuffle' parameter & Object handling
    playAlbum: (albumOrId, idx, shuffle) => {
        const target = (typeof albumOrId === 'object' && albumOrId !== null)
            ? (albumOrId.id || albumOrId.title)
            : albumOrId;
        return Bridge.call('playAlbum', String(target), idx, shuffle || false);
    },

    // [FIX] Route to playArtistAt when a numeric index is provided
    playArtist: (artist, idx, shuffle) => {
        // Handle cases where 'shuffle' is passed as the 2nd arg (idx)
        if (typeof idx === 'boolean') {
            shuffle = idx;
            idx = 0;
        }
        // If a numeric index is given, use playArtistAt for positional playback
        if (typeof idx === 'number' && idx > 0) {
            return Bridge.call('playArtistAt', artist, idx);
        }
        return Bridge.call('playArtist', artist, shuffle || false);
    },

    playPlaylist: (id, idx, shuffle) => Bridge.call('playPlaylist', id, idx, shuffle || false),
    playArtistAt: (artist, idx) => Bridge.call('playArtistAt', artist, idx),
    playGenre: (g, idx) => Bridge.call('playGenre', g, idx),
    playYear: (y, idx) => Bridge.call('playYear', y, idx),
    playRecent: (idx) => Bridge.call('playRecent', idx),
    playFavorites: (idx) => Bridge.call('playFavorites', idx),
    playEpisode: (id) => Bridge.call('playEpisode', id),
    playRadio: (id) => Bridge.call('playRadio', id),

    play: () => Bridge.call('play'),
    pause: () => Bridge.call('pause'),
    togglePlayPause: () => Bridge.call('togglePlayPause'),
    next: () => Bridge.call('next'),
    previous: () => Bridge.call('previous'),
    seekTo: (ms) => Bridge.call('seekTo', ms),
    stop: () => Bridge.call('stop'),
    sortSongs: (criteria) => Bridge.call('sortSongs', criteria),
    shuffleAll: () => Bridge.call('shuffleAll'),
    toggleShuffle: () => Bridge.call('toggleShuffle'),
    toggleRepeat: () => Bridge.call('toggleRepeat'),

    // ─── STATE ───
    getPlaybackState: () => Bridge.call('getPlaybackState'),
    getCurrentTrack: () => Bridge.call('getCurrentTrack'),
    getQueueInfo: () => Bridge.call('getQueueInfo'),

    // ─── ACTIONS ───
    toggleFavoriteAsync: (id) => Bridge.call('toggleFavoriteAsync', id),
    isFavorite: (id) => Bridge.call('isFavorite', id),
    addCurrentToFavorites: () => Bridge.call('addCurrentToFavorites'),
    addToPlaylist: (pid, sid) => Bridge.call('addToPlaylist', pid, sid),
    removeSongFromPlaylist: (pid, sid) => Bridge.call('removeSongFromPlaylist', pid, sid),
    createPlaylistAsync: (name) => Bridge.call('createPlaylistAsync', name),
    renamePlaylist: (id, name) => Bridge.call('renamePlaylist', id, name),
    renamePlaylistAsync: (id, name) => Bridge.call('renamePlaylistAsync', id, name),
    deletePlaylist: (id) => Bridge.call('deletePlaylist', id),

    // ─── LYRICS ───
    getLyrics: (title, artist) => Bridge.call('getLyrics', title, artist),
    fetchLyricsAsync: (title, artist) => Bridge.call('fetchLyricsAsync', title, artist),
    refetchLyrics: (title, artist) => Bridge.call('refetchLyrics', title, artist),

    // ─── THEMES ───
    getAvailableThemes: () => Bridge.call('getAvailableThemes'),
    setTheme: (t) => Bridge.call('setTheme', t),
    deleteTheme: (id) => Bridge.call('deleteTheme', id),
    refreshLibrary: () => Bridge.call('refreshMusicLibrary'),
    requestImportTheme: () => Bridge.call('requestImportTheme'),

    // ─── EQUALIZER ───
    getEqPresets: () => Bridge.call('getEqPresets'),
    useEqPreset: (index) => Bridge.call('useEqPreset', index),
    getEqBands: () => Bridge.call('getEqBands'),
    setEqBand: (index, level) => Bridge.call('setEqBand', index, level),
    resetEqBands: () => Bridge.call('resetEqBands'),
    saveEqCustom: (name) => Bridge.call('saveEqCustom', name),
    applyEqCustom: (name) => Bridge.call('applyEqCustom', name),
    getSavedEqCustom: () => Bridge.call('getSavedEqCustom'),
    deleteEqCustom: (name) => Bridge.call('deleteEqCustom', name),
    getEqPresetsAsync: async () => {
        try {
            const res = await fetch(`https://app-theme.local/api/eqPresets`);
            return await res.json();
        } catch (e) { return Bridge.getEqPresets(); } // Fallback
    },
    getEqBandsAsync: async () => {
        try {
            const res = await fetch(`https://app-theme.local/api/eqBands`);
            return await res.json();
        } catch (e) { return Bridge.getEqBands(); } // Fallback
    },

    // ─── SLEEP TIMER ───
    setSleepTimer: (minutes) => Bridge.call('setSleepTimer', minutes),
    getSleepTimerMinutes: () => Bridge.call('getSleepTimerMinutes'),

    // -----input-----
    showKeyboard: () => Bridge.call('showKeyboard'),
    hideKeyboard: () => Bridge.call('hideKeyboard'),
    setInputMode: (enabled) => Bridge.call('setInputMode', enabled),

    // ------Review----
    requestAppReview: () => Bridge.call('requestAppReview'),
    openPlayStoreListing: () => Bridge.call('openPlayStoreListing'),
    contactDeveloper: () => Bridge.call('contactDeveloper'),

    // ─── UTILS ───
    showToast: (msg) => Bridge.call('showToast', msg),
    openBrowser: (url) => Bridge.call('openBrowser', url)

};
