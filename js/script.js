console.log("JavaScript beteeeeeeeeee")

const currentSong = new Audio()
let songs = []
let currFolder = ""

// ✅ Manually define album folders (Vercel does NOT allow directory listing)
const albumFolders = [
    "ncs",
    "Angry_(mood)",
    "Bright_(mood)",
    "Chill_(mood)",
    "Dark_(mood)",
    "Diljit",
    "Funky_(mood)",
    "Love_(mood)",
    "cs",
    "karan aujla"
]

// getting songs from a folder
async function getSongs(folder) {
    currFolder = folder
    songs = []

    // ⚠️ Instead of scraping directory, we fetch info.json
    try {
        let response = await fetch(`/${folder}/info.json`)
        let data = await response.json()

        songs = data.songs  // songs array must exist inside info.json
    } catch (error) {
        console.error("Error loading songs:", error)
    }

    // showing all songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""

    for (const song of songs) {
        songUL.innerHTML += `<li>
                            <img class="invert" src="img/music.svg">
                            <div class="info">
                                <div>${song}</div>
                                <div>Mudit </div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg">
                            </div>
                        </li>`
    }

    // attached a event listener to songList 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/${track}`
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// display albums
async function displayAlbums() {

    let cardContainer = document.querySelector(".cardContainer")
    cardContainer.innerHTML = ""

    for (let folder of albumFolders) {

        try {
            let response = await fetch(`/songs/${folder}/info.json`)
            let data = await response.json()

            cardContainer.innerHTML += `
                <div data-folder="songs/${folder}" class="card">
                    <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            width="24" height="24">
                            <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" />
                        </svg>
                    </div>
                    <img src="songs/${folder}/cover.jpg" alt="cover">
                    <h2>${data.title}</h2>
                    <p>${data.description}</p>
                </div>
            `
        } catch (error) {
            console.error("Error loading album:", folder)
        }
    }

    // load playlist whenever card is played
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(item.currentTarget.dataset.folder)
            playMusic(songs[0])
        })
    })
}

async function main() {

    // getting list of all songs
    songs = await getSongs("songs/ncs")
    playMusic(songs[0], true)

    displayAlbums()

    // attached event listener to songbuttons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    // auto play next song when current ends
    currentSong.addEventListener("ended", () => {
        nextBtn.click()
    })

    // adding an eventlistener to previous and next
    const previousBtn = document.getElementById("previous")
    const nextBtn = document.getElementById("next")

    previousBtn.addEventListener("click", () => {
        let currentTrack = currentSong.src.split("/").pop()
        currentTrack = decodeURIComponent(currentTrack)

        let index = songs.indexOf(currentTrack)

        if (index > 0) {
            playMusic(songs[index - 1])
        }
    })
    nextBtn.addEventListener("click", () => {
        let currentTrack = currentSong.src.split("/").pop()
        currentTrack = decodeURIComponent(currentTrack)

        let index = songs.indexOf(currentTrack)

        if (index < songs.length - 1) {
            playMusic(songs[index + 1])
        }
    })

    // add an eventlistener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add an eventlistener to close left
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    // listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // add an eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    const volumeIcon = document.querySelector(".volume img")
    const volumeSlider = document.querySelector(".range input")

    let isMuted = false

    // volume slider change
    volumeSlider.addEventListener("input", (e) => {
        const value = parseInt(e.target.value)
        currentSong.volume = value / 100

        if (value === 0) {
            volumeIcon.src = "img/mute.svg"
            isMuted = true
        } else {
            volumeIcon.src = "img/volume.svg"
            isMuted = false
        }
    })

    // mute toggle
    volumeIcon.addEventListener("click", () => {

        if (!isMuted) {
            currentSong.volume = 0
            volumeSlider.value = 0
            volumeIcon.src = "img/mute.svg"
            isMuted = true
        } else {
            currentSong.volume = 0.5
            volumeSlider.value = 50
            volumeIcon.src = "img/volume.svg"
            isMuted = false
        }
    })
}

main()
