import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js"
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js"

// Firebase configuration
const firebaseConfig = {
  databaseURL: "https://kudos-scrimba-default-rtdb.firebaseio.com/"
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const complimentsRef = ref(database, "compliments");

// Select page elements
const generateButton = document.getElementById('generateButton');
const complimentDisplay = document.getElementById('compliment-display');
const complimentForm = document.getElementById('complimentForm');
const complimentInput = document.getElementById('complimentInput');
const successMessage = document.getElementById('successMessage');

// Function to show/hide the submission form
toggleFormButton.addEventListener('click', () => {
  complimentForm.classList.toggle('hidden');
  complimentForm.classList.contains('hidden') ? toggleFormButton.textContent = 'Add Kudos' : toggleFormButton.textContent = 'Hide Form';
});

// Function to show the success message for 3 seconds
function showSuccessMessage() {
    successMessage.style.display = 'block'; // Display the success message
    setTimeout(() => {
        successMessage.style.display = 'none'; // Hide the success message after 3 seconds
    }, 3000);
}

// Function to handle form submission
complimentForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const newCompliment = complimentInput.value.trim(); // Get the value from the input field and trim any leading/trailing whitespace

    if (newCompliment !== '') {
        // Check if the input is not empty
        push(complimentsRef, newCompliment) // Push the new compliment to the Firebase database
            .then(() => {
                complimentInput.value = ''; // Clear the input field
                complimentForm.classList.add('hidden'); // Hide the form after submission
                toggleFormButton.textContent = 'Add Kudos'; // Update the button text
                showSuccessMessage(); // Show the success message
            })
            .catch((error) => {
                console.error('Error adding compliment:', error);
            });
    }
});

// Function to fetch compliments data from Firebase
function fetchCompliments() {
    // Use the `get` function to retrieve data from the Firebase database
    get(complimentsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const complimentsData = snapshot.val(); // Get the data as an object
                const complimentsArray = Object.values(complimentsData); // Convert the object to an array

                // Display a random compliment from the array
                const randomIndex = Math.floor(Math.random() * complimentsArray.length);
                const randomCompliment = complimentsArray[randomIndex];
                complimentDisplay.textContent = randomCompliment;
            } else {
                complimentDisplay.textContent = "No kudos available."; // Handle case where no compliments exist
            }
        })
        .catch((error) => {
            console.error('Error fetching compliments:', error);
        });
}

// Add a click event listener to the generate button
generateButton.addEventListener('click', fetchCompliments);