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

// Listen for clicks on the 'Give Love' button and give health
const LOVE_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const lastLoveTime = localStorage.getItem('lastLoveTime');

function updateLoveBtnState() {
  const now = Date.now();
  const last = parseInt(localStorage.getItem('lastLoveTime')) || 0;
  if (now - last < LOVE_COOLDOWN_MS) {
    waterBtn.disabled = true;
    const mins = Math.ceil((LOVE_COOLDOWN_MS - (now - last)) / 60000);
    waterBtn.innerText = `Give Love 🧡 (wait ${mins} min)`;
  } else {
    waterBtn.disabled = false;
    waterBtn.innerText = 'Give Love 💙';
  }
}

waterBtn.addEventListener('click', function() {
  // Check if cooldown is over
  const now = Date.now();
  const last = parseInt(localStorage.getItem('lastLoveTime')) || 0;
  if (now - last < LOVE_COOLDOWN_MS) {
    wolfMessage.innerText = "You can only give love once every hour!";
    return;
  }
  // Increase health if not already at max
  if (health < MAX_HEALTH) {
    health++;
    localStorage.setItem('health', health); // Save new health value
    wolfMessage.innerText = "The wolf feels your love! 🧡";
    renderBars(); // Update the bars
  } else {
    wolfMessage.innerText = "The wolf already feels great! 🧡";
  }
  // Set cooldown
  localStorage.setItem('lastLoveTime', now);
  updateLoveBtnState();
});

// Check cooldown every minute to re-enable button if needed
setInterval(updateLoveBtnState, 60000);
// Also check on page load
updateLoveBtnState();

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
let leftoverOunces = parseInt(localStorage.getItem('leftoverOunces')) || 0; // Track leftover ounces for stored water
if (savedWaterDate === getToday() && savedWaterTotal) {
  waterLog = parseInt(savedWaterTotal);
  // leftoverOunces stays as loaded
} else {
  waterLog = 0;
  leftoverOunces = 0; // Reset leftover ounces if new day
  localStorage.setItem('waterDate', getToday());
  localStorage.setItem('waterTotal', waterLog);
  localStorage.setItem('leftoverOunces', leftoverOunces);
}

// Function to update the water total display
function renderWaterTotal() {
  waterTotalDiv.innerText = `Total today: ${waterLog} oz`;
}

// --- Stored Water Section Logic ---
// Get references to stored water bar and button
const storedWaterBar = document.getElementById('stored-water-bar');
const giveStoredWaterBtn = document.getElementById('give-stored-water-btn');
const resetWaterBtn = document.getElementById('reset-water-btn');
const STORED_WATER_MAX = 10; // 10 spots for stored water
const OZ_PER_STORED_WATER = 24; // 24oz fills one spot

// Load stored water from localStorage or start at 0
let storedWater = parseInt(localStorage.getItem('storedWater')) || 0;

// Function to render the stored water bar
function renderStoredWaterBar() {
  // Show filled spots as water drops, empty as boxes
  let filled = '💧'.repeat(storedWater);
  let empty = '⬜️'.repeat(STORED_WATER_MAX - storedWater);
  storedWaterBar.innerText = filled + empty;
  // Disable button if no stored water or hydration is max
  giveStoredWaterBtn.disabled = storedWater === 0 || hydration >= MAX_HYDRATION;
}

// When user logs water, check if enough for stored water
function addOunces(oz) {
  waterLog += oz;
  // Add to leftover ounces
  leftoverOunces += oz;
  // While enough for a stored water spot and not at max
  while (leftoverOunces >= OZ_PER_STORED_WATER && storedWater < STORED_WATER_MAX) {
    storedWater++;
    leftoverOunces -= OZ_PER_STORED_WATER;
  }
  // Save to localStorage
  localStorage.setItem('waterTotal', waterLog);
  localStorage.setItem('waterDate', getToday());
  localStorage.setItem('storedWater', storedWater);
  localStorage.setItem('leftoverOunces', leftoverOunces);
  renderWaterTotal();
  renderStoredWaterBar();
}

// When user clicks give stored water button
// Give 1 hydration if not at max, use 1 stored water
giveStoredWaterBtn.addEventListener('click', function() {
  if (storedWater > 0 && hydration < MAX_HYDRATION) {
    storedWater--;
    hydration++;
    if (hydration > MAX_HYDRATION) {
      hydration = MAX_HYDRATION;
    }
    // Save changes
    localStorage.setItem('storedWater', storedWater);
    localStorage.setItem('hydration', hydration);
    wolfMessage.innerText = "The wolf drank your stored water! 🐺💧";
    renderBars();
    renderStoredWaterBar();
  }
});

// Add event listener for the reset button
resetWaterBtn.addEventListener('click', function() {
  // Reset water log and leftover ounces to zero
  waterLog = 0;
  leftoverOunces = 0;
  localStorage.setItem('waterTotal', waterLog);
  localStorage.setItem('leftoverOunces', leftoverOunces);
  // Optionally, do not reset stored water (students can change this if they want)
  renderWaterTotal();
  renderStoredWaterBar(); // Make sure stored water bar is up to date
  // Now users can add ounces again as normal!
});

// Add event listeners for each ounce button
add8ozBtn.addEventListener('click', function() {
  addOunces(8);
});
add16ozBtn.addEventListener('click', function() {
  addOunces(16);
});
add24ozBtn.addEventListener('click', function() {
  addOunces(24);
});

// Update stored water bar on page load
renderStoredWaterBar();

// Show the current water total on page load
renderWaterTotal();

// --- Flip Card Study Section ---
// Get references to flip card elements
const createFlipBtn = document.getElementById('create-flip-btn');
const flipQuestionInput = document.getElementById('flip-question');
const flipAnswerInput = document.getElementById('flip-answer');
const flipCardStack = document.getElementById('flip-card-stack');
const flipStackFeedback = document.getElementById('flip-stack-feedback');

// Store all flip cards in an array
let flipCards = [];
const FLIP_CARD_LIMIT = 100;

// --- Login and Flip Card Save/Load ---
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username-input');
const loginStatus = document.getElementById('login-status');
let currentUser = '';

// Function to save flip cards for the current user
function saveFlipCards() {
  if (currentUser) {
    localStorage.setItem('flipCards_' + currentUser, JSON.stringify(flipCards));
  }
}
// Function to load flip cards for the current user
function loadFlipCards() {
  if (currentUser) {
    const saved = localStorage.getItem('flipCards_' + currentUser);
    if (saved) {
      flipCards = JSON.parse(saved);
    } else {
      flipCards = [];
    }
    renderFlipCardStack();
  }
}
// Login button event
loginBtn.addEventListener('click', function() {
  const username = usernameInput.value.trim();
  if (username) {
    currentUser = username;
    loginStatus.innerText = `Logged in as ${currentUser}`;
    loginStatus.style.color = '#2e9df7';
    loadFlipCards();
  } else {
    loginStatus.innerText = 'Please enter a username.';
    loginStatus.style.color = '#e53935';
  }
});

// Log out button event
const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', function() {
  currentUser = '';
  loginStatus.innerText = 'Logged out.';
  loginStatus.style.color = '#e53935';
  flipCardStack.innerHTML = '';
  waterLog = 0;
  leftoverOunces = 0;
  storedWater = 0;
  hydration = 5; // Reset to starting value
  health = 6;    // Reset to starting value
  renderWaterTotal();
  renderStoredWaterBar();
  renderBars();
  wolfMessage.innerText = 'Hi friend! Study and stay hydrated 💛';
  // Optionally, clear flip card input fields
  flipQuestionInput.value = '';
  flipAnswerInput.value = '';
});

// Function to render all flip cards in the stack
function renderFlipCardStack() {
  flipCardStack.innerHTML = '';
  flipCards.forEach((card, idx) => {
    // Create card container
    const cardDiv = document.createElement('div');
    cardDiv.className = 'flip-card-single';
    // Inner card for flipping
    const innerDiv = document.createElement('div');
    innerDiv.className = 'flip-card-inner';
    // Front and back
    const frontDiv = document.createElement('div');
    frontDiv.className = 'flip-card-front';
    frontDiv.innerText = card.question;
    const backDiv = document.createElement('div');
    backDiv.className = 'flip-card-back';
    backDiv.innerText = card.answer;
    // Flip on click
    innerDiv.addEventListener('click', function() {
      innerDiv.classList.toggle('flipped');
    });
    innerDiv.appendChild(frontDiv);
    innerDiv.appendChild(backDiv);
    cardDiv.appendChild(innerDiv);
    // Answer section
    const answerSection = document.createElement('div');
    answerSection.className = 'flip-card-answer-section';
    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.placeholder = 'Type your answer...';
    const checkBtn = document.createElement('button');
    checkBtn.innerText = 'Check Answer';
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'flip-card-feedback';
    // Check answer logic
    checkBtn.addEventListener('click', function() {
      if (answerInput.value.trim().toLowerCase() === card.answer.toLowerCase()) {
        feedbackDiv.innerText = 'Correct! 🎉';
        feedbackDiv.style.color = '#2e9df7';
      } else {
        feedbackDiv.innerText = 'Oops! The wolf lost health and hydration.';
        feedbackDiv.style.color = '#e53935';
        // Wolf loses 1 health and 1 hydration, but not below 0
        if (health > 0) health--;
        if (hydration > 0) hydration--;
        localStorage.setItem('health', health);
        localStorage.setItem('hydration', hydration);
        renderBars();
      }
    });
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.style.marginLeft = '0.5rem';
    deleteBtn.style.background = '#e53935';
    deleteBtn.style.color = '#fff';
    deleteBtn.style.border = 'none';
    deleteBtn.style.borderRadius = '4px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent flip on delete
      flipCards.splice(idx, 1); // Remove this card
      renderFlipCardStack(); // Re-render stack
    });
    answerSection.appendChild(answerInput);
    answerSection.appendChild(checkBtn);
    answerSection.appendChild(deleteBtn);
    answerSection.appendChild(feedbackDiv);
    cardDiv.appendChild(answerSection);
    flipCardStack.appendChild(cardDiv);
  });
  saveFlipCards(); // Save after rendering (adding/removing cards)
}

// Create a new flip card when the button is clicked
createFlipBtn.addEventListener('click', function() {
  if (!currentUser) {
    flipStackFeedback.innerText = 'Please log in to save your cards.';
    flipStackFeedback.style.color = '#e53935';
    return;
  }
  const question = flipQuestionInput.value.trim();
  const answer = flipAnswerInput.value.trim();
  if (question && answer) {
    if (flipCards.length >= FLIP_CARD_LIMIT) {
      flipStackFeedback.innerText = 'You can only have 100 flip cards.';
      flipStackFeedback.style.color = '#e53935';
      return;
    }
    flipCards.push({ question, answer });
    renderFlipCardStack();
    flipStackFeedback.innerText = `Card added! (${flipCards.length}/100)`;
    flipStackFeedback.style.color = '#2e9df7';
    flipQuestionInput.value = '';
    flipAnswerInput.value = '';
  }
});

// ---

