let players = [];
let turnLimit = 0;
let scores = {};
let intervalId;
let currentSeconds = secondsPerTurn;

function startGame() {
  const namesText = document.getElementById('namesInput').value.trim();
  players = namesText.split('\n').map(name => name.trim()).filter(name => name !== "");
  turnLimit = parseInt(document.getElementById('turnsInput').value);
  secondsPerTurn = parseInt(document.getElementById('secondsInput').value);

  if (players.length === 0 || players.length > 25 || isNaN(turnLimit) || turnLimit < 1 || isNaN(secondsPerTurn) || secondsPerTurn < 1) {
    alert('Please enter between 1 and 25 names, a valid number of turns, and valid seconds per turn.');
    return;
  }

  // Initialize scores
  players.forEach(player => {
    scores[player] = 0;
  });

  // Hide setup, show game
  document.getElementById('setup').style.display = 'none';
  document.getElementById('game').style.display = 'block';

  updateScoreBoard();
  nextTurn();
}

function nextTurn() {
  // Check if the game is done
  if (Object.values(scores).every(score => score >= turnLimit)) {
    document.getElementById('currentPlayer').innerText = "Game Over!";
    clearInterval(intervalId);
    return;
  }

  // Pick a random eligible player
  let eligiblePlayers = players.filter(p => scores[p] < turnLimit);
  let randomPlayer = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];

  // Update current player UI
  document.getElementById('currentPlayer').innerText = `${randomPlayer}'s Turn!`;
  scores[randomPlayer]++;
  updateScoreBoard();

  // Reset timer values here
  currentSeconds = secondsPerTurn;
  document.getElementById('timerText').innerText = `${currentSeconds}s`;

  // Reset circle to full
  const circle = document.getElementById('timerCircle');
  circle.style.strokeDashoffset = 0;
}


function updateScoreBoard() {
  const scoreBoard = document.getElementById('scoreBoard');
  scoreBoard.innerHTML = "";
  players.forEach(player => {
    const li = document.createElement('li');
    li.textContent = `${player}: ${scores[player]} / ${turnLimit}`;
    scoreBoard.appendChild(li);
  });
}

function updateTimer() {
  currentSeconds -= 1;
  if (currentSeconds < 0) {
    nextTurn();
    return;
  }

  // Update text
  document.getElementById('timerText').innerText = `${currentSeconds}s`;

  // Update circle
  const circle = document.getElementById('timerCircle');
  const circumference = 2 * Math.PI * 45; // 2πr
  const offset = circumference * (1 - currentSeconds / secondsPerTurn);
  circle.style.strokeDashoffset = offset;
}

// Attach start button event
document.getElementById('startButton').addEventListener('click', () => {
  startGame();
  intervalId = setInterval(updateTimer, 1000);
});
