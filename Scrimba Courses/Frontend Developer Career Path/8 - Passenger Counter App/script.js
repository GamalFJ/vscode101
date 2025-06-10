// Fetch "count" and "save" as text
let countEl = document.getElementById("count-el")
let saveEl = document.getElementById("save-el")
let resetEl = document.getElementById("newset-el")

// Initialize count to 0
let count = 0

// Create function to increment

function increment() {
    count += 1
    countEl.textContent = count
}
    // You need to count

    // And then it needs to appear as text

// Create function to save 
function save() {
    let countStr = count + " - "
    saveEl.textContent += countStr
    countEl.textContent = 0
    count = 0
}
    // Make sure the save is made and appears (i.e : "12 - ")

    // Make it a text so it know where to appear. Remember the variable you just declared

    // Whenever the "Save" button is clicked, the counter needs to reset to 0

    // Make sure the count is reset to 0


// Bob's your uncle!

// This function was added by myself for the "New Set" button. It already resets the counter to zero, but I want it to add a new set and increment the number i.e "Set 2", "Set 3", etc....
function newset() {
    let newsetStr = "Set 2: "
    saveEl.textContent +=  newsetStr 
    countEl.textContent = 0
}

// TO DO !!!
// Create a function for the Reset Button so that when clicked, it either reloads the page or resets everything as if reloading i.e (counter back to "0", erases all sets and reverts to "Set 1")


// Try and make it so that the reset button resets everything to original loading and that the New set button increment the number of sets with every new set and goes to the next line