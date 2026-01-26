console.log("JavaScript beteeeeeeeeee")

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href).split("\\").pop());
        }
    }
    return songs
} 


async function main() {
    // getting list of all songs
    let songs = await getSongs()
    console.log(songs)


    // showing all songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="img/music.svg">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Mudit </div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg">
                            </div>
                        </li>`
    }

    // Playing the first song
    var audio = new Audio(songs[0]);
    audio.play();     

    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration,audio.currentSrc,audio.currentTime)
    })
}

main()