var AudioController = (function (my) {
    let currentAudio = null;

    my.setupAudio = function(genre) {
        

        const playButton = document.getElementById("play-button");
        const pauseButton = document.getElementById("pause-button");
        const volumeControl = document.getElementById("volume-control");

        playButton.style.display = "block";
        pauseButton.style.display = "none";
        volumeControl.value = 0.5; // Reset volume to max

        // Stop the currently playing audio if it exists
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0; // Reset time to start
        }
    
        // Create audio object for the selected genre
        const audioFilePath = `mp3_downloads/${genre}.mp3`;
        currentAudio = new Audio(audioFilePath);
        currentAudio.volume = volumeControl.value; // Set initial volume
    
        // Play button event listener
        playButton.onclick = () => {
            currentAudio.play().then(() => {
                playButton.style.display = "none";
                pauseButton.style.display = "block";
            }).catch(error => {
                console.error("Playback error:", error);
            });
        };
    
        // Pause button event listener
        pauseButton.onclick = () => {
            currentAudio.pause();
            playButton.style.display = "block";
            pauseButton.style.display = "none";
        };
    
        // Volume control event listener
        volumeControl.oninput = () => {
            if (currentAudio) {
                currentAudio.volume = volumeControl.value;
            }
        };
    
        document.getElementById("sidebar").style.display = "block"; // Show the sidebar
    };

    return my;
}(AudioController || {}));
