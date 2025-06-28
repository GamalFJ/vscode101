# Compliment Generator essentials 



### Firebase



Kudos Realtime Database : https://kudos-scrimba-default-rtdb.firebaseio.com/



### Prompts.md



\## Save compliments to Firebase

I'd like to build a Compliment Generator that randomly selects compliments from a Firebase Realtime Database and displays them to users.



First, program the submission form to let users add new compliments to the database. Use my Firebase config and existing project code as a reference:



```

### index.html





<!doctype html>

<html>

&nbsp;   <head>

&nbsp;       <title>Compliment Generator</title>

&nbsp;       <meta name="viewport" content="width=device-width, initial-scale=1.0">

&nbsp;       <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

&nbsp;       <link rel="preconnect" href="https://fonts.googleapis.com">

&nbsp;       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

&nbsp;       <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500\&display=swap" rel="stylesheet">

&nbsp;       <link rel="stylesheet" href="index.css">

&nbsp;   </head>

&nbsp;   <body>

&nbsp;       <div class="container">

&nbsp;           <h1>

&nbsp;               <span class="icon material-symbols-outlined">person\_celebrate</span>

&nbsp;               KudosDelight

&nbsp;           </h1>

&nbsp;           <p class="display" id="compliment-display"></p>

&nbsp;           <button id="generateButton">Generate a Kudo</button>

&nbsp;           <button class="btn-secondary" id="toggleFormButton">Add Kudos</button>

&nbsp;           <p id="successMessage" style="display: none">Kudo added successfully!</p>

&nbsp;           <form id="complimentForm" class="hidden">

&nbsp;               <label for="complimentInput">Write a Kudo:</label>

&nbsp;               <input type="text" id="complimentInput">

&nbsp;               <button type="submit">Submit</button>

&nbsp;           </form>

&nbsp;       </div>

&nbsp;       <script src="index.js" type="module"></script>

&nbsp;   </body>

</html>



----



### index.js



import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js"

import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js"



// Firebase configuration

const firebaseConfig = {

&nbsp; databaseURL: process.env.KUDOS\_DB

}

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

const complimentsRef = ref(database, "compliments");



// Select page elements

const generateButton = document.getElementById('generateButton');

const complimentDisplay = document.getElementById('compliment-display');

const complimentForm = document.getElementById('complimentForm');

const complimentInput = document.getElementById('complimentInput');



// Function to show/hide the submission form

toggleFormButton.addEventListener('click', () => {

&nbsp; complimentForm.classList.toggle('hidden');

&nbsp; complimentForm.classList.contains('hidden') ? toggleFormButton.textContent = 'Add Kudos' : toggleFormButton.textContent = 'Hide Form';

});



// Function to handle form submission

complimentForm.addEventListener('submit', (e) => {

&nbsp;   e.preventDefault(); // Prevent the default form submission behavior



&nbsp;   const newCompliment = complimentInput.value.trim(); // Get the value from the input field and trim any leading/trailing whitespace



&nbsp;   if (newCompliment !== '') {

&nbsp;       // Check if the input is not empty

&nbsp;       push(complimentsRef, newCompliment) // Push the new compliment to the Firebase database

&nbsp;           .then(() => {

&nbsp;               complimentInput.value = ''; // Clear the input field

&nbsp;               complimentForm.classList.add('hidden'); // Hide the form after submission

&nbsp;               toggleFormButton.textContent = 'Add Kudos'; // Update the button text

&nbsp;           })

&nbsp;           .catch((error) => {

&nbsp;               console.error('Error adding compliment:', error);

&nbsp;           });

&nbsp;   }

});



-------



### index.css



\* {

&nbsp;   box-sizing: border-box;

}



body {

&nbsp;   font-family: Arial, sans-serif;

&nbsp;   text-align: center;

&nbsp;   background-color: #f0f0f0;

&nbsp;   margin: 0;

&nbsp;   color: #22223b;

&nbsp;   padding: 12px;

}



h1 {

&nbsp;   color: #03045e;

&nbsp;   font-size: 38px;

&nbsp;   font-family: 'Roboto Slab', serif;

&nbsp;   margin: 0;

&nbsp;   display: flex;

&nbsp;   flex-direction: column;

}



.icon {

&nbsp;   font-size: 38px;

}



.container {

&nbsp;   background-color: white;

&nbsp;   margin: auto;

&nbsp;   padding: 20px;

&nbsp;   max-width: 600px;

&nbsp;   min-height: 95vh;

&nbsp;   border-radius: 6px;

&nbsp;   box-shadow: 0 4px 8px rgba(0,0,0,0.15);

}



.display {

&nbsp;   background-color: #caf0f8;

&nbsp;   display: flex;

&nbsp;   justify-content: center;

&nbsp;   align-items: center;

&nbsp;   min-height: 80px;

&nbsp;   font-size: 20px;

&nbsp;   border-radius: 6px;

&nbsp;   margin-bottom: 8px;

}



form {

&nbsp;   margin-top: 26px;

}



button {

&nbsp;   background-color: #0077b6;

&nbsp;   font-size: 18px;

&nbsp;   color: white;

&nbsp;   padding: 10px 20px;

&nbsp;   margin: 10px 0;

&nbsp;   border: none;

&nbsp;   border-radius: 4px;

&nbsp;   cursor: pointer;

}



button:hover {

&nbsp;   background-color: #026498;

}



.btn-secondary {

&nbsp;   background-color: #00b4d8;

}



.btn-secondary:hover {

&nbsp;   background-color: #019bba;

}



label {

&nbsp;   font-size: 18px;

&nbsp;   font-weight: bold;

}



input\[type="text"] {

&nbsp;   padding: 12px 10px;

&nbsp;   margin: 10px 0;

&nbsp;   width: 100%;

&nbsp;   border-radius: 4px;

&nbsp;   border: solid 1px #03045e;

}



.hidden {

&nbsp;   display: none;

}



&nbsp;	

```



### Prompts



Please add detailed comments to the new code to help me understand it.



\## Retrieve compliments

Next, write the functionality that gets the compliments data from Firebase, then displays a random compliment to the user each time they click the generate button.

&nbsp;







### JS



import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js"

import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js"



// Firebase configuration

const firebaseConfig = {

&nbsp; databaseURL: process.env.KUDOS\_DB

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

&nbsp; complimentForm.classList.toggle('hidden');

&nbsp; complimentForm.classList.contains('hidden') ? toggleFormButton.textContent = 'Add Kudos' : toggleFormButton.textContent = 'Hide Form';

});



// Function to show the success message for 3 seconds

function showSuccessMessage() {

&nbsp;   successMessage.style.display = 'block'; // Display the success message

&nbsp;   setTimeout(() => {

&nbsp;       successMessage.style.display = 'none'; // Hide the success message after 3 seconds

&nbsp;   }, 3000);

}



// Function to handle form submission

complimentForm.addEventListener('submit', (e) => {

&nbsp;   e.preventDefault(); // Prevent the default form submission behavior



&nbsp;   const newCompliment = complimentInput.value.trim(); // Get the value from the input field and trim any leading/trailing whitespace



&nbsp;   if (newCompliment !== '') {

&nbsp;       // Check if the input is not empty

&nbsp;       push(complimentsRef, newCompliment) // Push the new compliment to the Firebase database

&nbsp;           .then(() => {

&nbsp;               complimentInput.value = ''; // Clear the input field

&nbsp;               complimentForm.classList.add('hidden'); // Hide the form after submission

&nbsp;               toggleFormButton.textContent = 'Add Kudos'; // Update the button text

&nbsp;               showSuccessMessage(); // Show the success message

&nbsp;           })

&nbsp;           .catch((error) => {

&nbsp;               console.error('Error adding compliment:', error);

&nbsp;           });

&nbsp;   }

});



// Function to fetch compliments data from Firebase

function fetchCompliments() {

&nbsp;   // Use the `get` function to retrieve data from the Firebase database

&nbsp;   get(complimentsRef)

&nbsp;       .then((snapshot) => {

&nbsp;           if (snapshot.exists()) {

&nbsp;               const complimentsData = snapshot.val(); // Get the data as an object

&nbsp;               const complimentsArray = Object.values(complimentsData); // Convert the object to an array



&nbsp;               // Display a random compliment from the array

&nbsp;               const randomIndex = Math.floor(Math.random() \* complimentsArray.length);

&nbsp;               const randomCompliment = complimentsArray\[randomIndex];

&nbsp;               complimentDisplay.textContent = randomCompliment;

&nbsp;           } else {

&nbsp;               complimentDisplay.textContent = "No kudos available."; // Handle case where no compliments exist

&nbsp;           }

&nbsp;       })

&nbsp;       .catch((error) => {

&nbsp;           console.error('Error fetching compliments:', error);

&nbsp;       });

}



// Add a click event listener to the generate button

generateButton.addEventListener('click', fetchCompliments);



-----



### HTML



<!doctype html>

<html>

&nbsp;   <head>

&nbsp;       <title>Compliment Generator</title>

&nbsp;       <meta name="viewport" content="width=device-width, initial-scale=1.0">

&nbsp;       <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

&nbsp;       <link rel="preconnect" href="https://fonts.googleapis.com">

&nbsp;       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

&nbsp;       <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500\&display=swap" rel="stylesheet">

&nbsp;       <link rel="stylesheet" href="index.css">

&nbsp;   </head>

&nbsp;   <body>

&nbsp;       <div class="container">

&nbsp;           <h1>

&nbsp;               <span class="icon material-symbols-outlined">person\_celebrate</span>

&nbsp;               KudosDelight

&nbsp;           </h1>

&nbsp;           <p class="display" id="compliment-display"></p>

&nbsp;           <button id="generateButton">Generate a Kudo</button>

&nbsp;           <button class="btn-secondary" id="toggleFormButton">Add Kudos</button>

&nbsp;           <p id="successMessage" style="display: none">Kudo added successfully!</p>

&nbsp;           <form id="complimentForm" class="hidden">

&nbsp;               <label for="complimentInput">Write a Kudo:</label>

&nbsp;               <input type="text" id="complimentInput">

&nbsp;               <button type="submit">Submit</button>

&nbsp;           </form>

&nbsp;       </div>

&nbsp;       <script src="index.js" type="module"></script>

&nbsp;   </body>

</html>

