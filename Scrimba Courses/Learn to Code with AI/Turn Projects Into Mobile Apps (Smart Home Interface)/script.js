// Get temperature display element
const temperatureDisplay = document.getElementById('temperatureDisplay');

// Initial temperature value
let temperature = 21;

// Get song name display element
const songNameDisplay = document.getElementById('songName');

// List of funny song names
const funnySongNames = [
    "Charming Fall Cafe Jazz",
    "Chill Beats for Coding & Mental Clarity",
    "SUMMER AFRO HOUSE Sunset Mix 2025",
    "Deep Focus & Maximum Productivity"
];

let isPlaying = false;
let currentSongIndex = 0;

// Play/Pause button click event
document.getElementById('playPause').addEventListener('click', () => {
    const musicSection = document.getElementById('music'); // get music section

    if (!isPlaying) {
        isPlaying = true;
        const newSong = getRandomSongName();
        songNameDisplay.textContent = newSong;
        playYouTubeSong(newSong);
        document.getElementById('playPause').innerHTML = '<i class="fas fa-pause"></i> Pause';

        // ✅ Change music background to your chosen color here
        musicSection.style.background = 'linear-gradient(to bottom, green,rgb(52, 185, 59))';
        // Example: 'linear-gradient(to bottom, #ff6f61, #28074a)'
    } else {
        isPlaying = false;
        player.pauseVideo();
        document.getElementById('playPause').innerHTML = '<i class="fas fa-play"></i> Play';

        // ✅ Revert to default purple background when paused
        musicSection.style.background = 'linear-gradient(to bottom, #6c1dd0, #28074a)';
    }
});



// Stop button click event
document.getElementById('stop').addEventListener('click', () => {
    isPlaying = false;
    player.stopVideo();
    document.getElementById('playPause').innerHTML = '<i class="fas fa-play"></i> Play';
    songNameDisplay.textContent = "Press Play to Get Groovy!";

    // ✅ Revert background on stop
    document.getElementById('music').style.background = 'linear-gradient(to bottom, #6c1dd0, #28074a)';
});


// Next button click event
document.getElementById('nextTrack').addEventListener('click', () => {
    if (isPlaying) {
        const newSong = getRandomSongName();
        songNameDisplay.textContent = newSong;
        playYouTubeSong(newSong); // play next video
    }
});


// Function to get a random song name
const getRandomSongName = () => {
    const randomIndex = Math.floor(Math.random() * funnySongNames.length);
    return funnySongNames[randomIndex];
};

// Update temperature display function
const updateTemperatureDisplay = () => {
    temperatureDisplay.textContent = `${temperature}°c`;

     // Handle gradient background (already implemented, leave that here)

    // Handle emoji and thermometer animation
    const statusEl = document.getElementById('temperatureStatus');
    statusEl.className = 'temperature-status'; // Reset classes

    if (temperature <= 16) {
        // ❄️ Freezing
        statusEl.innerHTML = '❄️ <i class="fas fa-thermometer-empty"></i>';
        statusEl.classList.add('freeze-thermometer');
    } else if (temperature >= 30) {
        // ☀️ Hot
        statusEl.innerHTML = '☀️ <i class="fas fa-thermometer-full"></i>';
        statusEl.classList.add('hot-thermometer');
    } else {
        // No extreme temperature — clear status
        statusEl.innerHTML = '';
    }


    const minTemp = 10;   // Coldest allowed temp (fully blue)
    const maxTemp = 32;   // Hottest allowed temp (fully red)
    const neutralTemp = 21;

    const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temperature));

    let ratio;
    let gradientColor;

    if (clampedTemp < neutralTemp) {
        // From purple to blue as it gets colder
        ratio = (neutralTemp - clampedTemp) / (neutralTemp - minTemp);
        const blended = interpolateColor('#6c1dd0', '#1d8dff', ratio);
        gradientColor = `linear-gradient(to bottom, ${blended}, #28074a)`;
    } else if (clampedTemp > neutralTemp) {
        // From purple to red as it gets hotter
        ratio = (clampedTemp - neutralTemp) / (maxTemp - neutralTemp);
        const blended = interpolateColor('#6c1dd0', '#ff1d1d', ratio);
        gradientColor = `linear-gradient(to bottom, ${blended}, #28074a)`;
    } else {
        // Neutral purple
        gradientColor = `linear-gradient(to bottom, #6c1dd0, #28074a)`;
    }


    // Apply gradient background
    document.getElementById('temperature').style.background = gradientColor;
};


// Helper function to interpolate between two hex colors
function interpolateColor(color1, color2, factor) {
    let c1 = hexToRgb(color1);
    let c2 = hexToRgb(color2);
    let result = {
        r: Math.round(c1.r + (c2.r - c1.r) * factor),
        g: Math.round(c1.g + (c2.g - c1.g) * factor),
        b: Math.round(c1.b + (c2.b - c1.b) * factor)
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
}

// Convert hex color to RGB object
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}


// Increase temperature button click event
document.getElementById('increaseTemp').addEventListener('click', () => {
    temperature++;
    updateTemperatureDisplay();
});

// Decrease temperature button click event
document.getElementById('decreaseTemp').addEventListener('click', () => {
    temperature--;
    updateTemperatureDisplay();
});

// Initialize temperature display
updateTemperatureDisplay();

// Step 1: Map funny song names to YouTube video IDs
const youtubeSongs = {
    // example: Happy - Pharrell
    "Charming Fall Cafe Jazz": "UiQyHa5rD7I",
    "Chill Beats for Coding & Mental Clarity": "6RZmTkDRwc0",
    "SUMMER AFRO HOUSE Sunset Mix 2025": "WWFCJgdIW-Q",
    "Deep Focus & Maximum Productivity": "4JxBKrr1H4w"
};

// Step 2: Load YouTube IFrame API script dynamically
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Step 3: Set up YouTube player instance
let player;

// Required by YouTube API: this must be a global function on window
window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('youtubePlayer', {
        height: '315',  // Show video player visibly
        width: '560',
        videoId: '',
        events: {
            'onReady': onPlayerReady
        }
    });
};


function onPlayerReady(event) {
    console.log('YouTube Player Ready');
}

// Step 4: Function to play a selected YouTube video
function playYouTubeSong(songTitle) {
    const videoId = youtubeSongs[songTitle];
    if (videoId && player && typeof player.loadVideoById === 'function') {
        player.loadVideoById(videoId);
        document.getElementById('youtubePlayer').style.display = 'block';

    }
}

// Lighting toggle behavior
const lightingSection = document.getElementById('lighting');
const toggleLightsCheckbox = document.getElementById('toggleLights');

toggleLightsCheckbox.addEventListener('change', () => {
    if (toggleLightsCheckbox.checked) {
        // Lights ON → apply glowing blue theme
        lightingSection.classList.add('lighting-on');
    } else {
        // Lights OFF → revert to default purple theme
        lightingSection.classList.remove('lighting-on');
    }
});

