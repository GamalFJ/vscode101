# Lunch Break Poll App



### Prompts



\## Project set up

Create the HTML, CSS, and JavaScript files for a project named "LunchVote". 

It needs a simple form where users can add places for lunch breaks. Each place

gets displayed in a list, and team members can vote on their preferred choice. 

It should have a modern and exciting design. 



\## Add places to Firebase, display them, and let users vote

I'm building an app called "LunchVote" to add lunch places, display them, and 

allow users to vote.



Store each lunch place in Firebase. Users cast a vote by clicking on a lunch place. 

Vote counts should be updated in real-time using Firebase's Realtime Database.



Use my Firebase configuration and existing project code as a reference to get started:



```

<!DOCTYPE html>

<html lang="en">

<head>

&nbsp; <meta charset="UTF-8">

&nbsp; <meta name="viewport" content="width=device-width, initial-scale=1.0">

&nbsp; <title>LunchVote</title>

&nbsp; <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700\&display=swap" rel="stylesheet">

&nbsp; <style>

&nbsp;   \* {

&nbsp;     box-sizing: border-box;

&nbsp;     margin: 0;

&nbsp;     padding: 0;

&nbsp;   }



&nbsp;   body {

&nbsp;     font-family: 'Inter', sans-serif;

&nbsp;     background: linear-gradient(to right, #ffecd2, #fcb69f);

&nbsp;     min-height: 100vh;

&nbsp;     display: flex;

&nbsp;     justify-content: center;

&nbsp;     align-items: center;

&nbsp;     padding: 20px;

&nbsp;     color: #333;

&nbsp;   }



&nbsp;   .container {

&nbsp;     background: white;

&nbsp;     border-radius: 10px;

&nbsp;     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

&nbsp;     padding: 2rem;

&nbsp;     width: 100%;

&nbsp;     max-width: 500px;

&nbsp;   }



&nbsp;   h1 {

&nbsp;     text-align: center;

&nbsp;     margin-bottom: 1rem;

&nbsp;     font-size: 2rem;

&nbsp;   }



&nbsp;   form {

&nbsp;     display: flex;

&nbsp;     gap: 0.5rem;

&nbsp;     margin-bottom: 1rem;

&nbsp;   }



&nbsp;   input\[type="text"] {

&nbsp;     flex: 1;

&nbsp;     padding: 0.75rem;

&nbsp;     border: 2px solid #fcb69f;

&nbsp;     border-radius: 6px;

&nbsp;     font-size: 1rem;

&nbsp;   }



&nbsp;   button {

&nbsp;     background-color: #ff7e5f;

&nbsp;     color: white;

&nbsp;     border: none;

&nbsp;     padding: 0.75rem 1rem;

&nbsp;     border-radius: 6px;

&nbsp;     font-size: 1rem;

&nbsp;     cursor: pointer;

&nbsp;     transition: background-color 0.2s ease;

&nbsp;   }



&nbsp;   button:hover {

&nbsp;     background-color: #eb5e40;

&nbsp;   }



&nbsp;   ul {

&nbsp;     list-style: none;

&nbsp;     padding: 0;

&nbsp;   }



&nbsp;   li {

&nbsp;     background: #fff0e6;

&nbsp;     border-radius: 6px;

&nbsp;     margin-bottom: 0.5rem;

&nbsp;     padding: 0.75rem 1rem;

&nbsp;     display: flex;

&nbsp;     justify-content: space-between;

&nbsp;     align-items: center;

&nbsp;   }



&nbsp;   .vote-btn {

&nbsp;     background-color: #ff9770;

&nbsp;     border: none;

&nbsp;     color: white;

&nbsp;     border-radius: 50px;

&nbsp;     padding: 0.4rem 0.8rem;

&nbsp;     cursor: pointer;

&nbsp;     font-weight: bold;

&nbsp;     font-size: 1rem;

&nbsp;   }

&nbsp; </style>

</head>

<body>

&nbsp; <div class="container">

&nbsp;   <h1>🍽️ LunchVote</h1>

&nbsp;   <form id="lunch-form">

&nbsp;     <input type="text" id="place-input" placeholder="Suggest a lunch spot..." required>

&nbsp;     <button type="submit">Add</button>

&nbsp;   </form>

&nbsp;   <ul id="places-list"></ul>

&nbsp; </div>



&nbsp; <script type="module">

&nbsp;   const form = document.getElementById("lunch-form");

&nbsp;   const input = document.getElementById("place-input");

&nbsp;   const list = document.getElementById("places-list");



&nbsp;   const places = \[];



&nbsp;   // Add place to list

&nbsp;   form.addEventListener("submit", (e) => {

&nbsp;     e.preventDefault();

&nbsp;     const placeName = input.value.trim();

&nbsp;     if (!placeName) return;



&nbsp;     places.push({ name: placeName, votes: 0 });

&nbsp;     input.value = "";

&nbsp;     renderList();

&nbsp;   });



&nbsp;   // Render list with voting buttons

&nbsp;   function renderList() {

&nbsp;     list.innerHTML = "";

&nbsp;     places.forEach((place, index) => {

&nbsp;       const li = document.createElement("li");

&nbsp;       li.innerHTML = `

&nbsp;         <span>${place.name}</span>

&nbsp;         <button class="vote-btn" data-index="${index}">${place.votes} 👍</button>

&nbsp;       `;

&nbsp;       const voteBtn = li.querySelector(".vote-btn");

&nbsp;       voteBtn.addEventListener("click", () => {

&nbsp;         places\[index].votes++;

&nbsp;         renderList();

&nbsp;       });

&nbsp;       list.appendChild(li);

&nbsp;     });

&nbsp;   }

&nbsp; </script>

</body>

</html>

```



Please add detailed comments to the new code to help me understand it.



\## Allow only 1 vote

Add the code to allow a user only to vote once. Users should also be able to change their vote.



\## Delete poll

Add a "Delete poll" button at the bottom, which clears the database and resets the poll. Display the delete button only after a poll gets created.



-----



### index.html



<!doctype html>

<html>

&nbsp;   <head>

&nbsp;       <meta name="viewport" content="width=device-width, initial-scale=1.0">

&nbsp;       <title>Lunch Break Poll</title>

&nbsp;       <link rel="preconnect" href="https://fonts.googleapis.com">

&nbsp;       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

&nbsp;       <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@700\&display=swap" rel="stylesheet">

&nbsp;       <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

&nbsp;       <link rel="stylesheet" href="index.css">

&nbsp;   </head>

&nbsp;   <body>

&nbsp;       <div class="container">

&nbsp;           <h1>

&nbsp;               <span class="icon material-symbols-outlined">lunch\_dining</span>

&nbsp;               LunchVote

&nbsp;           </h1>

&nbsp;           <form id="placeForm">

&nbsp;               <input type="text" id="placeInput" placeholder="Add a lunch place">

&nbsp;               <button type="submit">

&nbsp;                 <span class="icn-add material-symbols-outlined">add</span>

&nbsp;               </button>

&nbsp;           </form>

&nbsp;           <div id="leadingPlace"></div>

&nbsp;           <ul id="placesList"></ul>

&nbsp;           <button id="deletePoll" style="display: none;">Delete Poll</button>

&nbsp;       </div>

&nbsp;       <script src="index.js" type="module"></script>

&nbsp;   </body>

</html>

-------



### index.css



\* {

&nbsp;   box-sizing: border-box;    

}



body {

&nbsp;   font-family: 'Arial', sans-serif;

&nbsp;   text-align: center;

&nbsp;   background-color: #f4f4f4;

&nbsp;   margin: 0;

&nbsp;   padding: 10px;

&nbsp;   color: #333;

}



h1 {

&nbsp;   font-size: 38px;

&nbsp;   letter-spacing: -1px;

&nbsp;   font-family: 'Quicksand', sans-serif;

&nbsp;   display: flex;

&nbsp;   gap: 8px;

&nbsp;   justify-content: center;

&nbsp;   align-items: center;

&nbsp;   margin: 10px 0 20px;

}



.icon {

&nbsp;   font-size: 1em;

}



.container {

&nbsp;   background-color: white;

&nbsp;   margin: auto;

&nbsp;   min-height: 95vh;

&nbsp;   max-width: 600px;

&nbsp;   padding: 20px;

&nbsp;   box-shadow: 0 4px 15px rgba(0,0,0,0.1);

&nbsp;   border-radius: 10px;

&nbsp;   background-image: linear-gradient(to right top, #a267ac, #8c6bad, #7670ae, #5f75af, #487ab0);

&nbsp;   color: white;

}



form {

&nbsp;   width: 80%;

&nbsp;   margin: 0 auto 36px;

&nbsp;   display: flex;

&nbsp;   flex-wrap: wrap;

&nbsp;   overflow: hidden;

&nbsp;   border-radius: 5px;

&nbsp;   box-shadow: 0 2px 5px rgba(0,0,0,0.2);

}



input\[type="text"] {

&nbsp;   padding: 10px;

&nbsp;   flex-grow: 1;

&nbsp;   border: none;

}



button {

&nbsp;   background-color: #ff8a65; /\* A warm, inviting color \*/

&nbsp;   color: white;

&nbsp;   padding: 10px 15px;

&nbsp;   margin-left: auto;

&nbsp;   border: none;

&nbsp;   cursor: pointer;

&nbsp;   line-height: 0;

&nbsp;   transition: background-color 0.3s, transform 0.2s;

}



button:hover {

&nbsp;   background-color: #ff7043; /\* Slightly darker shade for hover state \*/

}





@media (max-width: 400px) {

&nbsp;   button {

&nbsp;       flex-grow: 1;

&nbsp;   }

}



.icn-add {

&nbsp;   font-weight: bold;

}



ul {

&nbsp;   list-style-type: none;

&nbsp;   padding: 0;

&nbsp;   margin-bottom: 0;

}



li {

&nbsp;   background-color: #fff;

&nbsp;   color: #333;

&nbsp;   margin-top: 8px;

&nbsp;   padding: 10px;

&nbsp;   cursor: pointer;

&nbsp;   border-radius: 5px;

&nbsp;   box-shadow: 0 2px 5px rgba(0,0,0,0.1);

&nbsp;   transition: transform 0.2s;

}



li:hover {

&nbsp;   transform: translateY(-2px);

}



\#leadingPlace {

&nbsp;   font-size: 18px;

&nbsp;   margin-top: 20px;

&nbsp;   font-weight: bold;

}



\#deletePoll {

&nbsp;   color: white;

&nbsp;   padding: 15px 20px;

&nbsp;   border: none;

&nbsp;   border-radius: 5px;

&nbsp;   cursor: pointer;

&nbsp;   transition: background-color 0.3s, transform 0.2s;

&nbsp;   box-shadow: 0 2px 5px rgba(0,0,0,0.2);

&nbsp;   margin: 20px auto 0; /\* Add some space above the button \*/

}



\#deletePoll:hover {

&nbsp;   transform: translateY(-2px);

}



----



### index.js



import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";

import { getDatabase, ref, push, onValue, update, set } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";



// Firebase configuration 

const firebaseConfig = {

&nbsp; databaseURL: "https://lunch-break-poll---scrimba-default-rtdb.firebaseio.com/"

};



// Initialize Firebase app

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

const placesRef = ref(database, "places");



// Page Elements

const placeForm = document.getElementById('placeForm');

const placesList = document.getElementById('placesList');

const placeInput = document.getElementById('placeInput');

const leadingPlaceDisplay = document.getElementById('leadingPlace');

const deletePollButton = document.getElementById('deletePoll');



// Function to reset the poll

function resetPoll() {

&nbsp; set(placesRef, {}); // Clear the 'places' node in the database

&nbsp; leadingPlaceDisplay.textContent = ''; // Clear the leading place display

&nbsp; placesList.innerHTML = ''; // Clear the list of places

&nbsp; deletePollButton.style.display = 'none'; // Hide the delete button

}



// Function to update the user's vote in Firebase and Local Storage

function updateUserVote(newVoteKey) {

&nbsp; const currentVoteKey = localStorage.getItem('userVote');

&nbsp; if (currentVoteKey) {

&nbsp;   // Decrement vote count for the old vote

&nbsp;   const oldVoteRef = ref(database, `places/${currentVoteKey}`);

&nbsp;   onValue(oldVoteRef, (snapshot) => {

&nbsp;     if (snapshot.exists()) {

&nbsp;       const votes = snapshot.val().votes;

&nbsp;       update(oldVoteRef, { votes: votes > 0 ? votes - 1 : 0 });

&nbsp;     }

&nbsp;   }, { onlyOnce: true });

&nbsp; }



&nbsp; // Increment vote count for the new vote

&nbsp; const newVoteRef = ref(database, `places/${newVoteKey}`);

&nbsp; onValue(newVoteRef, (snapshot) => {

&nbsp;   if (snapshot.exists()) {

&nbsp;     const votes = snapshot.val().votes;

&nbsp;     update(newVoteRef, { votes: votes + 1 });

&nbsp;   }

&nbsp; }, { onlyOnce: true });



&nbsp; // Update local storage

&nbsp; localStorage.setItem('userVote', newVoteKey);

}



// Event listener for form submission

placeForm.addEventListener('submit', (e) => {

&nbsp; e.preventDefault();

&nbsp; const placeName = placeInput.value.trim();

&nbsp; if (placeName) {

&nbsp;   push(placesRef, { name: placeName, votes: 0 });

&nbsp; }

&nbsp; placeInput.value = '';

});



// Listen for real-time updates from Firebase

onValue(placesRef, (snapshot) => {

&nbsp; if (snapshot.exists() \&\& snapshot.hasChildren()) {

&nbsp;   deletePollButton.style.display = 'block'; // Show the delete button

&nbsp; } else {

&nbsp;   deletePollButton.style.display = 'none'; // Hide the delete button if no polls

&nbsp; }

&nbsp; 

&nbsp; placesList.innerHTML = '';

&nbsp; let leadingPlace = { name: '', votes: -1 };



&nbsp; snapshot.forEach((childSnapshot) => {

&nbsp;   const place = childSnapshot.val();

&nbsp;   const placeKey = childSnapshot.key;



&nbsp;   // Create list item for each place

&nbsp;   const listItem = document.createElement('li');

&nbsp;   listItem.textContent = `${place.name} - Votes: ${place.votes}`;

&nbsp;   listItem.style.cursor = 'pointer';

&nbsp;   listItem.addEventListener('click', () => {

&nbsp;     const userVote = localStorage.getItem('userVote');

&nbsp;     if (userVote !== placeKey) {

&nbsp;       updateUserVote(placeKey); // Update the user's vote

&nbsp;     }

&nbsp;   });



&nbsp;   placesList.appendChild(listItem);



&nbsp;   // Update leading place

&nbsp;   if (place.votes > leadingPlace.votes) {

&nbsp;     leadingPlace = { name: place.name, votes: place.votes };

&nbsp;   }

&nbsp; });



&nbsp; // Display the leading place

&nbsp; if (leadingPlace.votes > -1) {

&nbsp;   leadingPlaceDisplay.textContent = `Leading Place: ${leadingPlace.name} with ${leadingPlace.votes} votes`;

&nbsp; }

});



// Event listener for the delete button

deletePollButton.addEventListener('click', resetPoll);





----



ChatGPT Code (Andro)



<!DOCTYPE html>

<html lang="en">

<head>

&nbsp; <meta charset="UTF-8">

&nbsp; <meta name="viewport" content="width=device-width, initial-scale=1.0">

&nbsp; <title>LunchVote</title>

&nbsp; <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700\&display=swap" rel="stylesheet">

&nbsp; <style>

&nbsp;   \* {

&nbsp;     box-sizing: border-box;

&nbsp;     margin: 0;

&nbsp;     padding: 0;

&nbsp;   }

&nbsp;   body {

&nbsp;     font-family: 'Inter', sans-serif;

&nbsp;     background: linear-gradient(to right, #ffecd2, #fcb69f);

&nbsp;     min-height: 100vh;

&nbsp;     display: flex;

&nbsp;     justify-content: center;

&nbsp;     align-items: center;

&nbsp;     padding: 20px;

&nbsp;     color: #333;

&nbsp;   }

&nbsp;   .container {

&nbsp;     background: white;

&nbsp;     border-radius: 10px;

&nbsp;     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

&nbsp;     padding: 2rem;

&nbsp;     width: 100%;

&nbsp;     max-width: 500px;

&nbsp;   }

&nbsp;   h1 {

&nbsp;     text-align: center;

&nbsp;     margin-bottom: 1rem;

&nbsp;     font-size: 2rem;

&nbsp;   }

&nbsp;   form {

&nbsp;     display: flex;

&nbsp;     gap: 0.5rem;

&nbsp;     margin-bottom: 1rem;

&nbsp;   }

&nbsp;   input\[type="text"] {

&nbsp;     flex: 1;

&nbsp;     padding: 0.75rem;

&nbsp;     border: 2px solid #fcb69f;

&nbsp;     border-radius: 6px;

&nbsp;     font-size: 1rem;

&nbsp;   }

&nbsp;   button {

&nbsp;     background-color: #ff7e5f;

&nbsp;     color: white;

&nbsp;     border: none;

&nbsp;     padding: 0.75rem 1rem;

&nbsp;     border-radius: 6px;

&nbsp;     font-size: 1rem;

&nbsp;     cursor: pointer;

&nbsp;     transition: background-color 0.2s ease;

&nbsp;   }

&nbsp;   button:hover {

&nbsp;     background-color: #eb5e40;

&nbsp;   }

&nbsp;   ul {

&nbsp;     list-style: none;

&nbsp;     padding: 0;

&nbsp;   }

&nbsp;   li {

&nbsp;     background: #fff0e6;

&nbsp;     border-radius: 6px;

&nbsp;     margin-bottom: 0.5rem;

&nbsp;     padding: 0.75rem 1rem;

&nbsp;     display: flex;

&nbsp;     justify-content: space-between;

&nbsp;     align-items: center;

&nbsp;     flex-direction: column;

&nbsp;     text-align: center;

&nbsp;   }

&nbsp;   .vote-btn {

&nbsp;     background-color: #ff9770;

&nbsp;     border: none;

&nbsp;     color: white;

&nbsp;     border-radius: 50px;

&nbsp;     padding: 0.4rem 0.8rem;

&nbsp;     cursor: pointer;

&nbsp;     font-weight: bold;

&nbsp;     font-size: 1rem;

&nbsp;     margin-top: 0.5rem;

&nbsp;   }

&nbsp;   .thank-you {

&nbsp;     font-size: 0.9rem;

&nbsp;     color: green;

&nbsp;     margin-top: 0.25rem;

&nbsp;   }

&nbsp;   .bar-container {

&nbsp;     height: 10px;

&nbsp;     background-color: #ffe5d0;

&nbsp;     border-radius: 5px;

&nbsp;     width: 100%;

&nbsp;     margin-top: 0.4rem;

&nbsp;   }

&nbsp;   .bar {

&nbsp;     height: 100%;

&nbsp;     background-color: #ff7e5f;

&nbsp;     border-radius: 5px;

&nbsp;   }

&nbsp;   #delete-btn {

&nbsp;     display: none;

&nbsp;     margin-top: 1rem;

&nbsp;     width: 100%;

&nbsp;     background-color: #d9534f;

&nbsp;   }

&nbsp;   #delete-btn:hover {

&nbsp;     background-color: #c9302c;

&nbsp;   }

&nbsp; </style>

</head>

<body>

&nbsp; <div class="container">

&nbsp;   <h1>🍽️ LunchVote</h1>

&nbsp;   <form id="lunch-form">

&nbsp;     <input type="text" id="place-input" placeholder="Suggest a lunch spot..." required>

&nbsp;     <button type="submit">Add</button>

&nbsp;   </form>

&nbsp;   <ul id="places-list"></ul>

&nbsp;   <button id="delete-btn">Delete Poll</button>

&nbsp; </div>

&nbsp; <script type="module">

&nbsp;   import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';

&nbsp;   import { getDatabase, ref, push, onValue, update, remove } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';



&nbsp;   const firebaseConfig = {

&nbsp;     databaseURL: "https://your-project-id-default-rtdb.firebaseio.com/"

&nbsp;   };



&nbsp;   const app = initializeApp(firebaseConfig);

&nbsp;   const database = getDatabase(app);

&nbsp;   const placesRef = ref(database, 'places');



&nbsp;   const form = document.getElementById("lunch-form");

&nbsp;   const input = document.getElementById("place-input");

&nbsp;   const list = document.getElementById("places-list");

&nbsp;   const deleteBtn = document.getElementById("delete-btn");



&nbsp;   const userVoteKey = 'lunchVote\_choice';



&nbsp;   form.addEventListener("submit", (e) => {

&nbsp;     e.preventDefault();

&nbsp;     const placeName = input.value.trim();

&nbsp;     if (!placeName) return;

&nbsp;     push(placesRef, { name: placeName, votes: 0 });

&nbsp;     input.value = "";

&nbsp;   });



&nbsp;   deleteBtn.addEventListener("click", () => {

&nbsp;     if (confirm("Are you sure you want to delete the poll?")) {

&nbsp;       remove(placesRef);

&nbsp;       localStorage.removeItem(userVoteKey);

&nbsp;     }

&nbsp;   });



&nbsp;   onValue(placesRef, (snapshot) => {

&nbsp;     list.innerHTML = "";

&nbsp;     const data = snapshot.val();

&nbsp;     const userVotedId = localStorage.getItem(userVoteKey);

&nbsp;     if (!data) {

&nbsp;       deleteBtn.style.display = 'none';

&nbsp;       return;

&nbsp;     }



&nbsp;     deleteBtn.style.display = 'block';



&nbsp;     const totalVotes = Object.values(data).reduce((sum, item) => sum + item.votes, 0);



&nbsp;     Object.entries(data).forEach((\[id, place]) => {

&nbsp;       const li = document.createElement("li");

&nbsp;       const votePercent = totalVotes > 0 ? (place.votes / totalVotes) \* 100 : 0;



&nbsp;       li.innerHTML = `

&nbsp;         <div><strong>${place.name}</strong></div>

&nbsp;         <div class="bar-container">

&nbsp;           <div class="bar" style="width:${votePercent}%;"></div>

&nbsp;         </div>

&nbsp;         <button class="vote-btn" data-id="${id}">${place.votes} 👍</button>

&nbsp;         ${userVotedId === id ? '<div class="thank-you">Thanks for voting!</div>' : ''}

&nbsp;       `;



&nbsp;       const voteBtn = li.querySelector(".vote-btn");

&nbsp;       voteBtn.addEventListener("click", () => {

&nbsp;         if (userVotedId === id) return;



&nbsp;         if (userVotedId) {

&nbsp;           const oldVoteRef = ref(database, `places/${userVotedId}`);

&nbsp;           update(oldVoteRef, { votes: data\[userVotedId].votes - 1 });

&nbsp;         }



&nbsp;         const newVoteRef = ref(database, `places/${id}`);

&nbsp;         update(newVoteRef, { votes: place.votes + 1 });

&nbsp;         localStorage.setItem(userVoteKey, id);

&nbsp;       });



&nbsp;       list.appendChild(li);

&nbsp;     });

&nbsp;   });

&nbsp; </script>

</body>

</html>





