// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// Get references to HTML elements by their IDs
const waterBtn = document.getElementById('water-btn'); // The button to give water
const hydrationBar = document.getElementById('hydration-bar'); // Shows hydration level
const healthBar = document.getElementById('health-bar'); // Shows health level
const wolfMessage = document.getElementById('wolf-message'); // Shows random messages

// Set the maximum values for hydration and health
const MAX_HYDRATION = 9;
const MAX_HEALTH = 6;

// Try to load saved hydration and health from localStorage, or use default values
let hydration = parseInt(localStorage.getItem('hydration')) || 5; // Start at 5 if not saved
let health = parseInt(localStorage.getItem('health')) || 6; // Start at 6 if not saved

// This function updates the emoji bars to show current hydration and health
function renderBars() {
  // Show water drops for hydration, empty boxes for missing hydration
  hydrationBar.innerText = '💧'.repeat(hydration) + '⬜️'.repeat(MAX_HYDRATION - hydration);
  // Show hearts for health, black hearts for missing health
  healthBar.innerText = '❤️'.repeat(health) + '🖤'.repeat(MAX_HEALTH - health);
}

// This function picks a random encouragement message for the user
function randomMessage() {
  const messages = [
    "You're doing amazing! 🌟",
    "Keep it up, hydrate warrior! 💪",
    "Water is life! 💧",
    "Proud of you 🧡",
    "You've got this!"
  ];
  // Pick a random index from the messages array
  const index = Math.floor(Math.random() * messages.length);
  // Show the message in the wolfMessage element
  wolfMessage.innerText = messages[index];
}

// This function is called when the user clicks the water button
function waterWolf() {
  // Increase hydration if not already at max
  if (hydration < MAX_HYDRATION) {
    hydration++;
    localStorage.setItem('hydration', hydration); // Save new hydration value
  }
  // Increase health if not already at max
  if (health < MAX_HEALTH) {
    health++;
    localStorage.setItem('health', health); // Save new health value
  }
  randomMessage(); // Show a random encouragement
  renderBars(); // Update the bars
}

// This function simulates daily dehydration (losing hydration each day)
function dailyDehydration() {
  const lastDate = localStorage.getItem('lastDate'); // Get last date checked
  const today = new Date().toLocaleDateString(); // Get today's date as a string

  // If the date has changed since last check
  if (lastDate !== today) {
    hydration = Math.max(0, hydration - 1); // Lose 1 hydration, but not below 0
    if (hydration === 0) {
      health = Math.max(0, health - 1); // Lose 1 health if fully dehydrated
    }
    // Save updated values and today's date
    localStorage.setItem('hydration', hydration);
    localStorage.setItem('health', health);
    localStorage.setItem('lastDate', today);
  }
}

// --- Initial setup when the page loads ---
dailyDehydration(); // Check if a day has passed and update hydration/health
renderBars(); // Show the current bars

// Listen for clicks on the water button and call waterWolf when clicked
waterBtn.addEventListener('click', waterWolf);

// --- Water Intake Logger Code ---
// Get references to the new water log buttons and total display
const add8ozBtn = document.getElementById('add-8oz');
const add16ozBtn = document.getElementById('add-16oz');
const add24ozBtn = document.getElementById('add-24oz');
const waterTotalDiv = document.getElementById('water-total');

// Function to get today's date as a string
function getToday() {
  return new Date().toLocaleDateString();
}

// Load saved water log or start at 0 if new day
let waterLog = 0;
const savedWaterDate = localStorage.getItem('waterDate');
const savedWaterTotal = localStorage.getItem('waterTotal');
if (savedWaterDate === getToday() && savedWaterTotal) {
  waterLog = parseInt(savedWaterTotal);
} else {
  waterLog = 0;
  localStorage.setItem('waterDate', getToday());
  localStorage.setItem('waterTotal', waterLog);
}

// Function to update the water total display
function renderWaterTotal() {
  waterTotalDiv.innerText = `Total today: ${waterLog} oz`;
}

// Functions to add ounces and update storage/display
function addOunces(oz) {
  waterLog += oz;
  localStorage.setItem('waterTotal', waterLog);
  localStorage.setItem('waterDate', getToday());
  renderWaterTotal();
}

// Add event listeners for each button
add8ozBtn.addEventListener('click', function() {
  addOunces(8);
});
add16ozBtn.addEventListener('click', function() {
  addOunces(16);
});
add24ozBtn.addEventListener('click', function() {
  addOunces(24);
});

// Show the current water total on page load
renderWaterTotal();

