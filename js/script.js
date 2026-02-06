console.log("JavaScript beteeeeeeeeee")

const currentSong = new Audio()

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

const playMusic = (track , pause = false) => {
    currentSong.src = "/songs/" + track
    if(!pause){
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


async function main() {
    // getting list of all songs
    let songs = await getSongs()

    playMusic(songs[0],true)

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
 
    // attached a event listener to songList 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    // attached event listener to songbuttons
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "img/play.svg"
        } 
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}` 
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%"
    })

    //add an eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        console.log(e)
        const percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })

    //add an eventlistener to hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0" 
    })
    
    //add an eventlistener to close left
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%" 
    })

}

main()