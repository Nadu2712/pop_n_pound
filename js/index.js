let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let gameTime = 0;
let moleInterval = 1000;
let plantInterval = 2000;
let moleIntervalID, plantIntervalID;
let plantClickCount = 0;
let lives = 3;
let gameStarted = false;
let remainingAttempts = 3;
let solution = null;
let questionImage = null;
let gameContinued = false;
let retry = 0;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return decodeURIComponent(parts.pop().split(";").shift());
}

const username = getCookie("username");
if (username) {
  console.log(`Welcome back, ${username}!`);
} else {
  console.log("No user found. Redirecting to login...");
  window.location.href = "../pages/login.html";
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function logout() {
  console.log("Logout triggered");
  deleteCookie("username");
  window.location.href = "../pages/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  } else {
    console.error("Logout button not found in DOM");
  }
});

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
  const username = getCookie("username");
  if (!username) {
    window.location.href = "../pages/login.html";
  }
}

function resetGame() {
  gameStarted = false;
  gameContinued = false;
  resetIntervals();
  score = 0;
  plantClickCount = 0;
  lives = 3;
  gameTime = 0;
  currMoleTile = null;
  currPlantTile = null;
  gameOver = false;
  remainingAttempts = 3;
  updateScore();
  updateLivesDisplay();
  hideGameOverPopup();
  hideContinuePopup();
  showStartPopup();
  clearMoleAndPlant();
}

function resetIntervals() {
  clearInterval(moleIntervalID);
  clearInterval(plantIntervalID);
}


function resetGame2() {
  plantClickCount = 0;
  lives = 3;
  updateLivesDisplay();
  gameOver = false;
  gameStarted = true;
  updateScore();
  hideGameOverPopup();
  hideContinuePopup();
  remainingAttempts = 0;
  gameContinued = true;
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

function saveScore(username, score) {
  fetch('http://localhost:3000/save-score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, score })
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error('Error saving score:', error);
    });
}

function endGame() {
  gameOver = true;
  resetIntervals();

  document.getElementById("score").innerText = `GAME OVER: ${score}`;

  clearMoleAndPlant();
  showGameOverPopup();
}

function playAgain() {
  const username = getCookie("username");
  saveScore(username, score);
  resetGame();
  document.getElementById("game-over-popup").classList.add("hidden");
  showStartPopup();
  resetIntervals();
  gameStarted = false;

  if (!username) {
    window.location.href = "../pages/login.html";
  }
}

function resetIntervals() {
  clearInterval(moleIntervalID);
  clearInterval(plantIntervalID);
}

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
    currMoleTile.innerHTML = "";
    currMoleTile = null;
  }
  if (currPlantTile) {
    currPlantTile.innerHTML = "";
    currPlantTile = null;
  }
}

function showGameOverPopup() {
  document.getElementById("game-over-popup").classList.remove("hidden");
  document.getElementById("final-score").innerText = `${score}`;
  if (retry >= 1) {
    document.getElementById("cont").classList.add("hidden");
  }
}

function hideGameOverPopup() {
  document.getElementById("game-over-popup").classList.add("hidden");
}

function hideContinuePopup() {
  document.getElementById("continue-popup").classList.add("hidden");
}

document.getElementById("play-again-btn").addEventListener("click", playAgain);

function showStartPopup() {
  document.getElementById("start-popup").classList.remove("hidden");
}

function hideStartPopup() {
  setTimeout(() => {
    document.getElementById("start-popup").classList.add("hidden");
  }, 0);
}

function updateGameTime() {
  if (!gameStarted || gameContinued) return;

  gameTime++;

  if (gameTime % 60 === 0) {
    moleInterval -= 100;
    plantInterval -= 100;

    clearInterval(moleIntervalID);
    clearInterval(plantIntervalID);

    moleIntervalID = setInterval(setMole, moleInterval);
    plantIntervalID = setInterval(setPlant, plantInterval);
  }
}

async function fetchQuestionData() {
  try {
    const response = await fetch("http://localhost:3000/game/question");
    const questionData = await response.json();
    questionImage = questionData.question;
    solution = questionData.solution;
    console.log("Question:", questionImage);
    console.log("Solution:", solution);
  } catch (error) {
    console.error("Error fetching question data:", error);
  }
}

async function continueGame() {
  if (gameContinued || gameStarted) return;

  gameContinued = true;  
  gameStarted = false; 

  if (!questionImage || !solution) {
    await fetchQuestionData();
  }

  const continuepopup = document.getElementById("continue-popup");

  if (!questionImage || !solution) {
    console.error("Question image or solution is still not available.");
    return;
  }

  const continueButton = document.createElement("button");
  continueButton.textContent = "Submit Answer";
  continueButton.addEventListener("click", handleAnswerSubmission);

  console.log("--------", questionImage, solution);

  continuepopup.innerHTML = `
    <h2>Game Over! Answer this question:</h2>
    <img src="${questionImage}" alt="Question" />
    <input type="number" id="user-answer" placeholder="Enter your answer" />
    <div id="attempts-left">Attempts left: ${remainingAttempts}</div>
  `;
  continuepopup.appendChild(continueButton);
  continuepopup.classList.remove("hidden");
  startIntervals();
}

function startIntervals() {
  moleIntervalID = setInterval(setMole, moleInterval);
  plantIntervalID = setInterval(setPlant, plantInterval);

  setInterval(updateGameTime, 1000);
}


function handleAnswerSubmission() {
  const userAnswer = document.getElementById("user-answer").value;
  const attemptsLeft = document.getElementById("attempts-left");

  if (parseInt(userAnswer) === solution) {
    showToast("Correct answer! You may continue the game.", "success");
    retry++;
    resetGame2();
    gameContinued = false;
  } else {
    remainingAttempts--;

    if (remainingAttempts <= 0) {
      const username = getCookie("username");
      saveScore(username, score);
      showToast("Incorrect answer! Game Over.", "error");
      resetGame();
    } else {
      attemptsLeft.textContent = `Attempts left: ${remainingAttempts}`;
    }
  }
}

function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
