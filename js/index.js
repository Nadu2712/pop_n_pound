let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let leaderboard = [];
let gameTime = 0;
let moleInterval = 1000;
let plantInterval = 2000;
let moleIntervalID, plantIntervalID;
let plantClickCount = 0;
let lives = 3;
let gameStarted = false;

window.onload = function () {
  initializeGame();
  showStartPopup();
};

function initializeGame() {
  for (let i = 0; i < 12; i++) {
    let tile = document.createElement("div");
    tile.id = i.toString();
    tile.addEventListener("click", selectTile);
    document.getElementById("board").appendChild(tile);
  }
}

function startGame() {
  if (gameStarted) return;

  gameStarted = true;
  hideStartPopup();
  resetGame();

  moleIntervalID = setInterval(setMole, moleInterval);
  plantIntervalID = setInterval(setPlant, plantInterval);

  setInterval(updateGameTime, 1000);
}

function resetGame() {
  score = 0;
  plantClickCount = 0;
  lives = 3;
  updateLivesDisplay();
  gameTime = 0;
  currMoleTile = null;
  currPlantTile = null;
  gameOver = false;
  gameStarted = false;
  updateScore();
  hideGameOverPopup();
  showStartPopup();
  clearMoleAndPlant();
}

function getRandomTile() {
  return Math.floor(Math.random() * 12).toString();
}

function setMole() {
  if (gameOver) return;

  if (currMoleTile) currMoleTile.innerHTML = "";

  let mole = document.createElement("img");
  mole.src = "../images/banana.png";
  mole.classList.add("mole");

  let num = getRandomTile();
  if (currPlantTile && currPlantTile.id == num) return;

  currMoleTile = document.getElementById(num);
  currMoleTile.appendChild(mole);
}

function setPlant() {
  if (gameOver) return;

  if (currPlantTile) currPlantTile.innerHTML = "";

  let plant = document.createElement("img");
  plant.src = "../images/image.png";
  plant.classList.add("plant");

  let num = getRandomTile();
  if (currMoleTile && currMoleTile.id == num) return;

  currPlantTile = document.getElementById(num);
  currPlantTile.appendChild(plant);
}

function selectTile() {
  if (gameOver) return;

  if (this === currMoleTile) {
    score += 10;
    updateScore();
  } else if (this === currPlantTile) {
    plantClickCount++;
    lives--;

    updateLivesDisplay();

    if (lives <= 0) {
      endGame();
    }
  }
}

function updateScore() {
  document.getElementById("score").innerText = `Score: ${score}`;
}

function updateLivesDisplay() {
  for (let i = 1; i <= 3; i++) {
    const lifeIcon = document.getElementById(`life${i}`);
    if (i > lives) {
      lifeIcon.src = "../images/hearte.png";
    } else {
      lifeIcon.src = "../images/heart.png";
    }
  }
}

function endGame() {
  gameOver = true;
  resetIntervals();

  document.getElementById("score").innerText = `GAME OVER: ${score}`;
  addToLeaderboard(score);

  clearMoleAndPlant();
  showGameOverPopup();
}

function playAgain() {
  resetGame();
  document.getElementById("game-over-popup").classList.add("hidden");
  showStartPopup();
  resetIntervals();
  gameStarted = false;
}

function resetIntervals() {
  // Clear the intervals for mole and plant
  clearInterval(moleIntervalID);
  clearInterval(plantIntervalID);
}

// Add the score to the leaderboard
function addToLeaderboard(score) {
  leaderboard.push(score);
  leaderboard.sort((a, b) => b - a); // Sort in descending order
  leaderboard = leaderboard.slice(0, 5); // Keep top 5 scores
}

// Show the leaderboard popup
function showLeaderboard() {
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = leaderboard
    .map((entry, index) => `<li>${index + 1}. ${entry}</li>`)
    .join("");
  document.getElementById("leaderboard-popup").classList.remove("hidden");
}

// Toggle game rules
document.getElementById("toggle-rules-btn").addEventListener("click", () => {
  const rules = document.getElementById("game-rules");
  const toggleButton = document.getElementById("toggle-rules-btn");

  if (rules.classList.contains("hidden")) {
    rules.classList.remove("hidden");
    toggleButton.textContent = "Hide Rules";
  } else {
    rules.classList.add("hidden");
    toggleButton.textContent = "Show Rules";
  }
});

function clearMoleAndPlant() {
  if (currMoleTile) {
    currMoleTile.innerHTML = ""; // Remove mole image
    currMoleTile = null;         // Reset reference
  }
  if (currPlantTile) {
    currPlantTile.innerHTML = ""; // Remove plant image
    currPlantTile = null;         // Reset reference
  }
}

// Close the leaderboard popup
function closeLeaderboard() {
  document.getElementById("leaderboard-popup").classList.add("hidden");
}

// Show the game-over popup
function showGameOverPopup() {
  document.getElementById("game-over-popup").classList.remove("hidden");
}

// Hide the game-over popup
function hideGameOverPopup() {
  document.getElementById("game-over-popup").classList.add("hidden");
}

document.getElementById("play-again-btn").addEventListener("click", playAgain);

// Show the start game popup
function showStartPopup() {
  document.getElementById("start-popup").classList.remove("hidden");
}

// Hide the start game popup
function hideStartPopup() {
  // Add a small timeout to ensure any DOM manipulation is done
  setTimeout(() => {
    document.getElementById("start-popup").classList.add("hidden");
  }, 0); // 0 delay, but ensures the call happens after other events
}

// Toggle game rules
document.getElementById("toggle-rules-btn").addEventListener("click", () => {
  const rules = document.getElementById("game-rules");
  const toggleButton = document.getElementById("toggle-rules-btn");

  if (rules.classList.contains("hidden")) {
    rules.classList.remove("hidden");
    toggleButton.textContent = "Hide Rules";
  } else {
    rules.classList.add("hidden");
    toggleButton.textContent = "Show Rules";
  }
});

function updateGameTime() {
  gameTime++;

  // Increase speed every 30 seconds
  if (gameTime % 60 === 0) {
    moleInterval -= 100;
    plantInterval -= 100;

    // Clear existing intervals
    clearInterval(moleIntervalID);
    clearInterval(plantIntervalID);

    // Start new intervals with faster speeds
    moleIntervalID = setInterval(setMole, moleInterval);
    plantIntervalID = setInterval(setPlant, plantInterval);
  }
}
