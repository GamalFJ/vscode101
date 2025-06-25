// ✅ Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// ✅ Firebase Configuration
const appSettings = {
  databaseURL: "https://gif-gala---scrimba-default-rtdb.firebaseio.com/" 
};

// ✅ Initialize Firebase App and Database
const app = initializeApp(appSettings);
const database = getDatabase(app);

// ✅ Reference to the "messages" path in the database
const messagesInDB = ref(database, "messages");

// ✅ DOM Elements
const rsvpForm = document.getElementById('rsvp-form');
const confirmationMessage = document.getElementById('confirmation-message');
const body = document.body;
const messagesList = document.getElementById('messages-list'); // 🆕 A <ul> or <ol> to display messages

// ✅ Submit Handler
rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form reload

  // 🎯 Get the attendance value from the form
  const attendance = document.getElementById('attendance').value;

  // 🎯 Get the name input (optional but recommended)
  const nameInput = document.getElementById('name'); // Make sure you have <input id="name" />
  const name = nameInput.value.trim();

  // 🎉 Display confirmation + set background based on RSVP
  if (attendance === 'yes') {
    confirmationMessage.innerHTML = '🎉 Party on! We look forward to seeing you at the GIF Gala!';
    body.style.backgroundImage = 'url("https://media.giphy.com/media/l2JHPB58MjfV8W3K0/giphy.gif")';
    console.log("Attending:", name);
    push(messagesInDB, name);


    // ✅ Only push to Firebase if attending
    if (name !== "") {
      // Push the name as a new message in the database
      push(messagesInDB, name);
    }

  } else if (attendance === 'no') {
    confirmationMessage.innerHTML = '😔 We will miss you at the GIF Gala!';
    body.style.backgroundImage = 'url("https://media.giphy.com/media/JER2en0ZRiGUE/giphy.gif")';
  }

  // ✅ Show confirmation text
  confirmationMessage.style.display = 'block';

  // ✅ Reset form fields
  rsvpForm.reset();
});


// ✅ Listen for data changes in Firebase (real-time)
onValue(messagesInDB, (snapshot) => {
  // 🧹 Clear the list to avoid duplication
  messagesList.innerHTML = "";

  // Loop through each item in the snapshot
  snapshot.forEach((childSnapshot) => {
    const message = childSnapshot.val(); // Each child's value (the name)
    
    // ✅ Create and append a new <li> with the message
    const li = document.createElement("li");
    li.textContent = message;
    messagesList.appendChild(li);
  });
});
