// Get references to DOM elements
const startButton = document.getElementById('start-timer');
const cookingLevelSelect = document.getElementById('cooking-level');
const timeLeftDisplay = document.getElementById('time-left');
const animationDiv = document.getElementById('animation');

// Function to start the timer
startButton.addEventListener('click', () => {
    const selectedLevel = cookingLevelSelect.value;
    let timeLeft;

    // Set time based on cooking level
    switch (selectedLevel) {
        case 'soft':
            timeLeft = 240; // 4 minutes
            animationDiv.className = 'animation soft';
            break;
        case 'medium':
            timeLeft = 420; // 7 minutes
            animationDiv.className = 'animation medium';
            break;
        case 'hard':
            timeLeft = 600; // 10 minutes
            animationDiv.className = 'animation hard';
            break;
    }

    // Update the timer display
    timeLeftDisplay.textContent = timeLeft;

    // Start countdown
    const timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;

        // Stop the timer when it reaches zero
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Egg is ready!');
            animationDiv.className = 'animation'; // Reset animation
        }
    }, 1000);
});
