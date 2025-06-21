// Get the form element
const form = document.getElementById('raffle-form');

// Get the text input field
const nameInput = document.getElementById('participant-name');

// Get the element where participants will be listed
const participantsList = document.getElementById('participants-list');

// Get the draw button
const drawButton = document.getElementById('draw-winner');

// Get the winner display element
const winnerDisplay = document.getElementById('winner-display');

// Get the reset button
const resetButton = document.getElementById('reset-button');

// Create an array to hold participant names
let participants = [];

// When the form is submitted (someone enters their name)
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Stop the page from refreshing

  const name = nameInput.value.trim(); // Get the input and remove extra spaces

  if (name) {
    participants.push(name); // Add the name to our participants array

    // Create a new list item in the HTML
    const li = document.createElement('li');
    li.textContent = name;
    participantsList.appendChild(li); // Add it to the list on the page

    nameInput.value = ''; // Clear the input field
  }
});

// When the draw button is clicked
drawButton.addEventListener('click', function() {
  if (participants.length === 0) {
    // If no one has entered yet, show a message
    winnerDisplay.textContent = "No participants yet! 😢";
    return;
  }

  // Pick a random index from the participants array
  const randomIndex = Math.floor(Math.random() * participants.length);

  // Get the name of the winner
  const winner = participants[randomIndex];

  // Display the winner with emojis
  winnerDisplay.textContent = `🎂🎉 The winner is: ${winner}! 🎉🎂`;
});

// When the reset button is clicked
resetButton.addEventListener('click', function() {
  // Clear the participants array
  participants = [];

  // Clear the HTML list of participants
  participantsList.innerHTML = '';

  // Reset the winner message
  winnerDisplay.textContent = 'Who will win the cake? 🍰';
});
