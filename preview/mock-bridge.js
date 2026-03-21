// Minimal Bridge mock for screenshot previews
window.AndroidHost = {};
window.Bridge = {
  call: function() { return ""; },
  getAppVersion: function() { return "2.1.2"; },
  getBatteryLevel: function() { return 85; },
  isCharging: function() { return false; },
  getSongCount: function() { return 2847; },
  triggerHaptic: function() {},
  triggerClick: function() {},
  getSettings: function() { return "{}"; },
  setSetting: function() {},
  getVolume: function() { return 65; },
  setVolume: function() {},
  adjustVolume: function() {},
  getPlaybackState: function() { return JSON.stringify({ isPlaying: true, position: 94000, duration: 247000, shuffle: true, repeat: "OFF" }); },
  getCurrentTrack: function() { return JSON.stringify({ title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", art: "", duration: 247000 }); },
  isShuffle: function() { return true; },
  getRepeatMode: function() { return "OFF"; },
  togglePlayPause: function() {},
  toggleShuffle: function() {},
  toggleRepeat: function() {},
  next: function() {},
  previous: function() {},
  seekTo: function() {},
  playSong: function() {},
  playAlbum: function() {},
  shuffleAll: function() {},
  showKeyboard: function() {},
  hideKeyboard: function() {},
  getAvailableThemes: function() { return '["iPod Classic","Aurora","Midnight","Vinyl","Spotify Green"]'; },
  setTheme: function() {},
  getEqPresets: function() { return '["Flat","Bass Boost","Rock","Pop","Jazz","Classical"]'; },
  useEqPreset: function() {},
  getSleepTimerMinutes: function() { return 0; },
  setSleepTimer: function() {},
  refreshLibrary: function() {},
  requestImportTheme: function() {},
  fetchLyricsAsync: function() {},
  searchAll: function() { return '{"songs":[],"albums":[],"artists":[],"podcasts":[]}'; },
  formatDuration: function(ms) { var s = Math.floor(ms/1000); var m = Math.floor(s/60); s = s%60; return m+":"+(s<10?"0"+s:s); },
  getDeviceModels: function() { return "[]"; },
  getFrameColors: function() { return "[]"; },
  setInputMode: function() {},
  showToast: function() {},
  openBrowser: function() {},
  getQueueInfo: function() { return '{"position":3,"length":12}'; },
  isPlaying: function() { return true; },
  isBuffering: function() { return false; },
  getPosition: function() { return 94000; },
  getDuration: function() { return 247000; },
  getThemeInfo: function() { return '{}'; },

  // Async methods that return promises
  getSongsPaginatedAsync: function() { return Promise.resolve([
    {id:1, title:"Bohemian Rhapsody", artist:"Queen", album:"A Night at the Opera", art:""},
    {id:2, title:"Stairway to Heaven", artist:"Led Zeppelin", album:"Led Zeppelin IV", art:""},
    {id:3, title:"Hotel California", artist:"Eagles", album:"Hotel California", art:""},
    {id:4, title:"Comfortably Numb", artist:"Pink Floyd", album:"The Wall", art:""},
    {id:5, title:"Imagine", artist:"John Lennon", album:"Imagine", art:""},
    {id:6, title:"Yesterday", artist:"The Beatles", album:"Help!", art:""},
    {id:7, title:"Smells Like Teen Spirit", artist:"Nirvana", album:"Nevermind", art:""}
  ]); },
  getAlbumsPaginatedAsync: function() { return Promise.resolve([
    {id:1, title:"A Night at the Opera", name:"A Night at the Opera", artist:"Queen", art:"", type:"album"},
    {id:2, title:"Led Zeppelin IV", name:"Led Zeppelin IV", artist:"Led Zeppelin", art:"", type:"album"},
    {id:3, title:"Hotel California", name:"Hotel California", artist:"Eagles", art:"", type:"album"},
    {id:4, title:"The Wall", name:"The Wall", artist:"Pink Floyd", art:"", type:"album"},
    {id:5, title:"Abbey Road", name:"Abbey Road", artist:"The Beatles", art:"", type:"album"},
    {id:6, title:"Nevermind", name:"Nevermind", artist:"Nirvana", art:"", type:"album"},
    {id:7, title:"Thriller", name:"Thriller", artist:"Michael Jackson", art:"", type:"album"},
    {id:8, title:"Back in Black", name:"Back in Black", artist:"AC/DC", art:"", type:"album"}
  ]); },
  getArtistsPaginatedAsync: function() { return Promise.resolve([
    {name:"Queen"},{name:"Led Zeppelin"},{name:"Eagles"},{name:"Pink Floyd"},{name:"The Beatles"},{name:"Nirvana"}
  ]); },
  getPlaylistsAsync: function() { return Promise.resolve([
    {id:1, name:"Road Trip Mix", songCount:24},
    {id:2, name:"Chill Vibes", songCount:18},
    {id:3, name:"Workout", songCount:32}
  ]); },
  getRecentSongsAsync: function() { return Promise.resolve([
    {id:1, title:"Bohemian Rhapsody", artist:"Queen"},
    {id:3, title:"Hotel California", artist:"Eagles"},
    {id:5, title:"Imagine", artist:"John Lennon"}
  ]); },
  getMostPlayedAsync: function() { return Promise.resolve([
    {id:2, title:"Stairway to Heaven", artist:"Led Zeppelin"},
    {id:1, title:"Bohemian Rhapsody", artist:"Queen"}
  ]); },
  getFavoritesAsync: function() { return Promise.resolve([
    {id:4, title:"Comfortably Numb", artist:"Pink Floyd"},
    {id:6, title:"Yesterday", artist:"The Beatles"}
  ]); },
  getGenresAsync: function() { return Promise.resolve([{name:"Rock"},{name:"Pop"},{name:"Jazz"},{name:"Classical"}]); },
  getPodcastsAsync: function() { return Promise.resolve([
    {id:1, title:"The Daily", author:"NYT", art:"", type:"podcast"},
    {id:2, title:"Science Friday", author:"NPR", art:"", type:"podcast"}
  ]); },
  getRadioStationsAsync: function() { return Promise.resolve([
    {id:1, name:"Jazz FM", title:"Jazz FM"},
    {id:2, name:"Classic Rock Radio", title:"Classic Rock Radio"}
  ]); },
  getFolderListingAsync: function() { return Promise.resolve([
    {name:"Music", path:"/Music", type:"folder", isDirectory:true},
    {name:"Downloads", path:"/Downloads", type:"folder", isDirectory:true},
    {name:"Podcasts", path:"/Podcasts", type:"folder", isDirectory:true}
  ]); },
  getPlaylistSongsAsync: function() { return Promise.resolve([]); },
  getPodcastEpisodesAsync: function() { return Promise.resolve([]); },
  getSongsByAlbumAsync: function() { return Promise.resolve([]); },
  getSongsByGenreAsync: function() { return Promise.resolve([]); },
  getAlbumsByArtist: function() { return Promise.resolve([]); },
  getYearsAsync: function() { return Promise.resolve([]); },
  getEqPresetsAsync: function() { return Promise.resolve([]); },
  getEqBandsAsync: function() { return Promise.resolve([]); },
  getCoverFlowData: function() { return "[]"; },
  playRadio: function() {},
  playEpisode: function() {},
  playPlaylist: function() {},
  playArtist: function() {},
  playGenre: function() {},
  playYear: function() {},
  playFolder: function() {},
  playRecent: function() {},
  playFavorites: function() {}
};
