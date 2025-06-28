// 🔥 Import required Firebase modules from CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

// 🔐 Firebase config object from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDmGwuSXjc599qTysbcoX9lsS7jaxefnaA",
  authDomain: "test-andro-36ce4.firebaseapp.com",
  databaseURL: "https://test-andro-36ce4-default-rtdb.firebaseio.com",
  projectId: "test-andro-36ce4",
  storageBucket: "test-andro-36ce4.firebasestorage.app",
  messagingSenderId: "616998046737",
  appId: "1:616998046737:web:d60cb83146ce1094c0b5b0"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// 🔌 Connect to the Realtime Database
const database = getDatabase(app);

// 📍 Reference a location in the database (like a folder)
const messagesInDB = ref(database, 'messages');

// 🌱 Get DOM elements
const inputEl = document.getElementById('input-field');
const addButtonEl = document.getElementById('add-button');
const messagesListEl = document.getElementById('messages-list');

// ➕ Add new message to DB on button click
addButtonEl.addEventListener('click', () => {
  const inputValue = inputEl.value;

  if (inputValue.trim() !== "") {
    // ⬆️ Push sends a new value into the 'messages' list
    push(messagesInDB, inputValue);
    inputEl.value = ""; // Clear the input
  }
});

// 🔁 Listen for data changes in realtime
onValue(messagesInDB, (snapshot) => {
  // 🧼 Clear existing list
  messagesListEl.innerHTML = "";

  if (snapshot.exists()) {
    const messagesArray = Object.entries(snapshot.val());

    messagesArray.forEach(([id, value]) => {
      const newEl = document.createElement('li');
      newEl.textContent = value;
      messagesListEl.appendChild(newEl);
    });
  } else {
    messagesListEl.innerHTML = "<li>No messages yet 😴</li>";
  }
});
