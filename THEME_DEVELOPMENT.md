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
| `Bridge.getBatteryLevel()` | Returns current battery percentage (0-100). |
| `Bridge.isCharging()` | Returns boolean status. |
| `Bridge.triggerHaptic(style)` | Vibrates device (`"tick"`, `"heavy"`). |
| `Bridge.getSettings()` | Returns all app settings as a JSON object. |
| `Bridge.setSetting(key, val)` | Updates a specific setting. |
| `Bridge.getAvailableThemes()` | Returns list of installed themes. |
| `Bridge.setTheme(id)` | Switches the active theme. |
| `Bridge.setInputMode(mode)` | Sets input surface mode (`"WHEEL"`, `"DPAD"`). |

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
| `Bridge.getSongsByGenreAsync(name)` | Fetches songs for a specific genre. |
| `Bridge.getFolderListingAsync(path)` | Returns files/folders at specified path. |

#### ── Playback Controls ──
| Method | Description |
| :--- | :--- |
| `Bridge.playSong(id)` | Plays a specific song by ID. |
| `Bridge.playAlbum(id, index, shuffle)` | Plays an album starting at index. |
| `Bridge.playPlaylist(id, index, shuffle)` | Plays a playlist starting at index. |
| `Bridge.togglePlayPause()` | Toggles playback state. |
| `Bridge.next()` / `Bridge.previous()` | Skips to next/previous track. |
| `Bridge.seekTo(ms)` | Jumps to position in milliseconds. |
| `Bridge.toggleShuffle()` / `Bridge.toggleRepeat()` | Toggles playback modes. |

#### ── Podcasts & Radio ──
| Method | Description |
| :--- | :--- |
| `Bridge.getPodcastsAsync()` | Fetches subscribed podcasts. |
| `Bridge.getPodcastEpisodesAsync(id)` | Fetches episodes for a podcast. |
| `Bridge.getRadioStationsAsync()` | Fetches saved radio stations. |
| `Bridge.playEpisode(id)` | Plays a podcast episode. |
| `Bridge.playRadio(id)` | Starts a radio stream. |

#### ── State & Metadata ──
| Method | Description |
| :--- | :--- |
| `Bridge.getPlaybackState()` | Returns `{isPlaying, position, duration}`. |
| `Bridge.getCurrentTrack()` | Returns `{title, artist, album, art}`. |
| `Bridge.getQueueInfo()` | Returns list of songs in current queue. |

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
    Bridge.triggerHaptic("tick");
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
