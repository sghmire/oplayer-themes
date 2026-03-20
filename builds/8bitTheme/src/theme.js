
const VIEW_MENU = 0
const VIEW_SONGS = 1
const VIEW_NP = 2

let currentView = VIEW_MENU
let menuIndex = 0
let menuItems = []

let songIndex = 0
let songs = []

window.onload = function() {
    menuItems = document.querySelectorAll("#menu li")
    updateUI()
}

function updateUI() {
    // Hide all views first
    document.getElementById("menu").classList.add("hidden")
    document.getElementById("songlist").classList.add("hidden")
    document.getElementById("nowplaying").classList.add("hidden")

    if (currentView === VIEW_MENU) {
        document.getElementById("menu").classList.remove("hidden")
        menuItems.forEach((item, i) => {
            item.classList.toggle("selected", i === menuIndex)
        })
    } 
    else if (currentView === VIEW_SONGS) {
        document.getElementById("songlist").classList.remove("hidden")
        renderSongList()
    } 
    else if (currentView === VIEW_NP) {
        document.getElementById("nowplaying").classList.remove("hidden")
    }
}

async function fetchSongs() {
    try {
        songs = await Bridge.getSongsPaginatedAsync(0, 50)
        currentView = VIEW_SONGS
        songIndex = 0
        updateUI()
    } catch (e) {
        console.error("Failed to fetch songs", e)
    }
}

function renderSongList() {
    const list = document.getElementById("songlist-items")
    list.innerHTML = ""
    
    if (!songs || songs.length === 0) {
        const li = document.createElement("li")
        li.innerText = "(No songs found)"
        list.appendChild(li)
        return
    }

    songs.forEach((song, i) => {
        const li = document.createElement("li")
        li.innerText = song.title
        if (i === songIndex) li.classList.add("selected")
        list.appendChild(li)
    })
}

function handleScroll(delta) {
    if (currentView === VIEW_MENU) {
        menuIndex = (menuIndex + delta + menuItems.length) % menuItems.length
    } 
    else if (currentView === VIEW_SONGS) {
        songIndex = (songIndex + delta + songs.length) % songs.length
    }
    
    if (currentView !== VIEW_NP) {
        Bridge.triggerHaptic("tick")
        updateUI()
    }
}

function handleSelect() {
    Bridge.triggerHaptic("heavy")

    if (currentView === VIEW_MENU) {
        let option = menuItems[menuIndex].innerText.trim()
        if (option === "Music") {
            fetchSongs()
        } else if (option === "Exit") {
            Bridge.setTheme("ipod")
        }
    } 
    else if (currentView === VIEW_SONGS) {
        const song = songs[songIndex]
        if (song) {
            Bridge.playSong(song.id)
            currentView = VIEW_NP
            updateUI()
        }
    }
}

function handleBack() {
    if (currentView === VIEW_NP) {
        currentView = VIEW_SONGS
    } else if (currentView === VIEW_SONGS) {
        currentView = VIEW_MENU
    }
    updateUI()
}

function format(ms) {
    let s = Math.floor(ms / 1000)
    let m = Math.floor(s / 60)
    s = s % 60
    return m + ":" + (s < 10 ? "0" + s : s)
}

function onPlaybackUpdate(state, track) {
    if (!track) return

    document.getElementById("trackTitle").innerText = track.title
    document.getElementById("trackArtist").innerText = track.artist

    let percent = (state.position / state.duration) * 100
    document.getElementById("bar").style.width = percent + "%"
    document.getElementById("time").innerText = format(state.position) + " / " + format(state.duration)
}