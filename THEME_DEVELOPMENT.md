# oPlayer Theme Development Guide

This guide is a comprehensive reference for creating, packaging, and importing custom skins for oPlayer.

## 1. Theme Architecture

oPlayer uses a hybrid architecture:
- **Native Kotlin**: Handles media playback, file scanning, and database management.
- **WebView (HTML/CSS/JS)**: Renders the interface and handles user interaction.

---

## 2. Mandatory File Structure
Your ZIP package must contain these files at the **root**:
- `manifest.json`: Metadata (id, name, version).
- `index.html`: The entry point.
- `style.css`: Visual styling.
- `theme.js`: Your logic and Bridge integration.

---

## 3. The Communication Bridge

The `Bridge` object is injected into your global JavaScript environment by `oplayer-bridge.js`. It is the only way to talk to Android.

### Script Inclusion
Add this to your `index.html` *before* your `theme.js`:

```html
<script src="https://app-theme.local/assets/core/oplayer-bridge.js"></script>
```

### Bridge API Reference

Most data methods have an `Async` version (e.g., `getSongsPaginatedAsync`) which is recommended for better performance as it uses a virtual API layer.

#### ── System & Settings ──
| Method | Description |
| :--- | :--- |
| `Bridge.getAppVersion()` | Returns the app version string. |
| `Bridge.getSongCount()` | Returns total number of songs in the library. |
| `Bridge.getBatteryLevel()` | Returns current battery percentage (0-100). |
| `Bridge.isCharging()` | Returns boolean charging status. |
| `Bridge.triggerClick()` | Triggers a click sound/haptic. |
| `Bridge.triggerHaptic(style)` | Vibrates device (`"tick"`, `"heavy"`). |
| `Bridge.getSettings()` | Returns all app settings as a JSON object. |
| `Bridge.setSetting(key, val)` | Updates a specific setting. |
| `Bridge.getDeviceModels()` | Returns available device model skins. |
| `Bridge.getFrameColors()` | Returns available frame color options. |
| `Bridge.setInputMode(mode)` | Sets input surface mode (`"WHEEL"`, `"DPAD"`). |
| `Bridge.showToast(msg)` | Shows a native Android toast message. |
| `Bridge.openBrowser(url)` | Opens a URL in the device's browser. |
| `Bridge.formatDuration(ms)` | Formats milliseconds into `m:ss` or `h:mm:ss` string. |

#### ── Volume Control ──
| Method | Description |
| :--- | :--- |
| `Bridge.getVolume()` | Returns current volume as a percentage (0-100). |
| `Bridge.setVolume(level)` | Sets volume to a percentage (0-100). |
| `Bridge.adjustVolume(delta)` | Adjusts volume by a delta (e.g., `+5` or `-5`). |

#### ── Data Discovery (Async Recommended) ──
| Method | Description |
| :--- | :--- |
| `Bridge.getSongsPaginatedAsync(off, lim)` | Fetches a page of songs. |
| `Bridge.getAlbumsPaginatedAsync(off, lim, artist)` | Fetches albums (optional artist filter). |
| `Bridge.getArtistsPaginatedAsync(off, lim)` | Fetches list of artists. |
| `Bridge.getPlaylistsAsync()` | Fetches all user playlists. |
| `Bridge.getPlaylistSongsAsync(id)` | Fetches songs within a playlist. |
| `Bridge.getRecentSongsAsync()` | Fetches recently played tracks. |
| `Bridge.getMostPlayedAsync()` | Fetches most played tracks. |
| `Bridge.getFavoritesAsync()` | Fetches favorited songs. |
| `Bridge.getGenresAsync()` | Fetches all available music genres. |
| `Bridge.getYearsAsync()` | Fetches all available years. |
| `Bridge.getFolderListingAsync(path)` | Returns files/folders at specified path. |
| `Bridge.getCoverFlowData()` | Returns album art data for cover flow display. |

#### ── Search ──
| Method | Description |
| :--- | :--- |
| `Bridge.searchSongs(query)` | Searches songs by title/artist/album (max 50 results). |
| `Bridge.searchAll(query)` | Unified search across songs, artists, albums, podcasts. |

#### ── Filtered Lists (Async Recommended) ──
| Method | Description |
| :--- | :--- |
| `Bridge.getSongsByArtistAsync(artist)` | Songs by a specific artist. |
| `Bridge.getSongsByAlbumAsync(albumOrId)` | Songs in an album (accepts object or ID). |
| `Bridge.getSongsByGenreAsync(genre)` | Songs for a specific genre. |
| `Bridge.getSongsByYear(year)` | Songs from a specific year. |
| `Bridge.getAlbumsByArtist(artist)` | Albums by a specific artist. |

#### ── Playback Controls ──
| Method | Description |
| :--- | :--- |
| `Bridge.playSong(id)` | Plays a specific song by ID. |
| `Bridge.playAlbum(albumOrId, index, shuffle)` | Plays an album starting at index. Accepts object or ID. |
| `Bridge.playArtist(artist, index, shuffle)` | Plays an artist's songs. |
| `Bridge.playPlaylist(id, index, shuffle)` | Plays a playlist starting at index. |
| `Bridge.playGenre(genre, index)` | Plays songs from a genre. |
| `Bridge.playYear(year, index)` | Plays songs from a year. |
| `Bridge.playRecent(index)` | Plays from recently played. |
| `Bridge.playFavorites(index)` | Plays from favorites. |
| `Bridge.playFolder(path, index)` | Plays songs from a folder. |
| `Bridge.play()` / `Bridge.pause()` | Explicit play/pause. |
| `Bridge.togglePlayPause()` | Toggles playback state. |
| `Bridge.next()` / `Bridge.previous()` | Skips to next/previous track. |
| `Bridge.seekTo(ms)` | Jumps to position in milliseconds. |
| `Bridge.seekRelative(deltaMs)` | Seeks forward/backward by delta milliseconds. |
| `Bridge.stop()` | Stops playback. |
| `Bridge.shuffleAll()` | Shuffles and plays entire library. |
| `Bridge.toggleShuffle()` / `Bridge.toggleRepeat()` | Toggles playback modes. |
| `Bridge.isShuffle()` | Returns boolean (or string "true"/"false") shuffle state. |
| `Bridge.getRepeatMode()` | Returns string ("OFF", "ONE", "ALL"). |
| `Bridge.setShuffle(bool)` / `Bridge.setRepeatMode(mode)` | Sets shuffle/repeat state explicitly. |
| `Bridge.sortSongs(criteria)` | Sorts current song list by criteria. |

#### ── Podcasts & Radio ──
| Method | Description |
| :--- | :--- |
| `Bridge.getPodcastsAsync()` | Fetches subscribed podcasts. |
| `Bridge.getPodcastEpisodesAsync(id)` | Fetches episodes for a podcast. |
| `Bridge.getRecentEpisodes()` | Fetches recently played episodes. |
| `Bridge.addPodcastAsync(url)` | Subscribes to a podcast by URL. |
| `Bridge.refreshPodcast(id)` | Refreshes a podcast's episode list. |
| `Bridge.downloadEpisode(id)` | Downloads a podcast episode. |
| `Bridge.markEpisodePlayed(id, played)` | Marks an episode as played/unplayed. |
| `Bridge.playEpisode(id)` | Plays a podcast episode. |
| `Bridge.getRadioStationsAsync()` | Fetches saved radio stations. |
| `Bridge.searchRadioAsync(query)` | Searches for radio stations online. |
| `Bridge.searchPodcastAsync(query)` | Searches for podcasts online. |
| `Bridge.addRadioStationAsync(url)` | Adds a radio station by URL. |
| `Bridge.renameRadioStation(id, name)` | Renames a radio station. |
| `Bridge.playRadio(id)` | Starts a radio stream. |

#### ── Videos ──
| Method | Description |
| :--- | :--- |
| `Bridge.getVideosAsync()` | Fetches video library. |
| `Bridge.playVideo(id)` | Plays a video. |
| `Bridge.refreshVideoLibrary()` | Refreshes the video library. |

#### ── Favorites & Playlists ──
| Method | Description |
| :--- | :--- |
| `Bridge.toggleFavoriteAsync(id)` | Toggles favorite status for a song. |
| `Bridge.isFavorite(id)` | Returns whether a song is favorited. |
| `Bridge.addCurrentToFavorites()` | Adds currently playing track to favorites. |
| `Bridge.addToPlaylist(playlistId, songId)` | Adds a song to a playlist. |
| `Bridge.createPlaylistAsync(name)` | Creates a new playlist. |
| `Bridge.renamePlaylistAsync(id, name)` | Renames a playlist. |

#### ── Lyrics ──
| Method | Description |
| :--- | :--- |
| `Bridge.fetchLyricsAsync(title, artist)` | Fetches lyrics from online (result via `onLyricsLoaded` callback). |
| `Bridge.refetchLyrics(title, artist)` | Forces a fresh lyrics fetch, clearing cache. |

#### ── Equalizer ──
| Method | Description |
| :--- | :--- |
| `Bridge.getEqPresetsAsync()` | Fetches available EQ presets. |
| `Bridge.useEqPreset(index)` | Applies an EQ preset by index. |
| `Bridge.getEqBandsAsync()` | Fetches current EQ band levels. |
| `Bridge.setEqBand(index, level)` | Sets a specific EQ band level. |

#### ── Themes ──
| Method | Description |
| :--- | :--- |
| `Bridge.getAvailableThemes()` | Returns list of installed themes. |
| `Bridge.setTheme(id)` | Switches the active theme. |
| `Bridge.getThemeInfo()` | Returns metadata for the current theme (title, author, version). |
| `Bridge.requestImportTheme()` | Opens the theme import dialog. |
| `Bridge.refreshLibrary()` | Refreshes the music library. |

#### ── Sleep Timer ──
| Method | Description |
| :--- | :--- |
| `Bridge.setSleepTimer(minutes)` | Sets a sleep timer in minutes (0 to cancel). |
| `Bridge.getSleepTimerMinutes()` | Gets remaining sleep timer minutes. |

#### ── Input ──
| Method | Description |
| :--- | :--- |
| `Bridge.showKeyboard()` | Shows the on-screen keyboard. |
| `Bridge.hideKeyboard()` | Hides the on-screen keyboard. |

#### ── State & Metadata ──
| Method | Description |
| :--- | :--- |
| `Bridge.getPlaybackState()` | Returns `{isPlaying, position, duration, isBuffering, shuffle, repeat, mediaType}`. |
| `Bridge.getCurrentTrack()` | Returns `{type, id, title, artist, album, art, duration, format, bitrate, sampleRate}`. |
| `Bridge.getQueueInfo()` | Returns `{position, length}` of the current playback queue. |
| `Bridge.isPlaying()` / `Bridge.isBuffering()` | Direct boolean state checks. |
| `Bridge.getPosition()` / `Bridge.getDuration()` | Direct position/duration in ms. |

---

## 4. Incoming Hardware Events

You **must** define these global functions in your `theme.js` to respond to the iPod-style scroll wheel and buttons:

```javascript
/**
 * Called when the scroll wheel is rotated.
 * @param {number} delta - Either 1 (clockwise) or -1 (counter-clockwise).
 */
function handleScroll(delta) { 
    // Example: update menu index
}

/** Called when the center select button is pressed. */
function handleSelect() { }

/** Called when the center select button is long-pressed. */
function handleLongSelect() { }

/** Called when the Menu/Back button is pressed. */
function handleBack() { }

/** Called when Play/Pause button is pressed. */
function handlePlayPause() { 
    Bridge.togglePlayPause();
}

/** Called when Next/Previous hardware buttons are pressed. */
function handleNext() { }
function handlePrevious() { }

/** 
 * Called when DPAD input mode is active.
 * Only fired for Ring/Surface taps in DPAD mode.
 */
function handleUp() { }
function handleDown() { }
function handleLeft() { }
function handleRight() { }

/**
 * Called by Native when playback state or track changes.
 * @param {object} state - {isPlaying, position, duration}
 * @param {object} track - {title, artist, album, art}
 */
function onPlaybackUpdate(state, track) { }
```

### Async Callbacks

Some async methods deliver results via global callback functions. Define these to receive data:

```javascript
/** Called when lyrics are fetched. */
function onLyricsLoaded(lyricsText) { }

/** Called when a favorite is toggled. */
function onFavoriteToggled(jsonStr) { }

/** Called when a playlist is created. */
function onPlaylistCreated(jsonStr) { }

/** Called when radio search results arrive. */
function onRadioSearchResults(jsonStr) { }

/** Called when podcast search results arrive. */
function onPodcastSearchResults(jsonStr) { }

/** Called when a podcast is added. */
function onPodcastAdded(jsonStr) { }

/** Called when a radio station is added. */
function onRadioAdded(jsonStr) { }
```

---

## 5. Boilerplate Example (The "Hello World" Theme)

### `manifest.json`
```json
{
  "id": "hello_world",
  "name": "Hello World",
  "version": "1.0.0",
  "author": "Developer"
}
```

### `index.html`
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
    <script src="https://app-theme.local/assets/core/oplayer-bridge.js"></script>
    <script src="theme.js" defer></script>
</head>
<body>
    <div id="app">
        <h1 id="now-title">Not Playing</h1>
        <p id="now-artist"></p>
    </div>
</body>
</html>
```

### `theme.js`
```javascript
function handleScroll(delta) {
    console.log("Scrolled " + delta);
}

function handleSelect() {
    Bridge.togglePlayPause();
}

function onPlaybackUpdate(state, track) {
    if (track) {
        document.getElementById('now-title').innerText = track.title;
        document.getElementById('now-artist').innerText = track.artist;
    }
}
```

---

## 6. Debugging with Chrome
1.  Connect phone via USB and enable **USB Debugging**.
2.  Open Chrome and go to `chrome://inspect`.
3.  Click **inspect** under "oPlayer" to see console logs, network requests, and the DOM.
