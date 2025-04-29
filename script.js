let players = [];
let turnLimit = 0;
let scores = {};
let intervalId;
let currentSeconds = 22;

function startGame() {
  const namesText = document.getElementById('namesInput').value.trim();
  players = namesText.split('\n').map(name => name.trim()).filter(name => name !== "");
  turnLimit = parseInt(document.getElementById('turnsInput').value);

  if (players.length === 0 || players.length > 21 || isNaN(turnLimit) || turnLimit < 1) {
    alert('Please enter between 1 and 21 names and a valid number of turns.');
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
  // Check if game is done
  if (Object.values(scores).every(score => score >= turnLimit)) {
    document.getElementById('currentPlayer').innerText = "Game Over!";
    clearInterval(intervalId);
    return;
  }

  // Pick a random player who still needs turns
  let eligiblePlayers = players.filter(p => scores[p] < turnLimit);
  let randomPlayer = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];

  // Update UI
  document.getElementById('currentPlayer').innerText = `${randomPlayer}'s Turn!`;
  scores[randomPlayer]++;
  updateScoreBoard();

  // Reset and start 22-second timer
  currentSeconds = 22;
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
  currentSeconds--;
  document.getElementById('timer').innerText = `Time left: ${currentSeconds}s`;

  if (currentSeconds <= 0) {
    nextTurn();
  }
}

// Attach start button event
document.getElementById('startButton').addEventListener('click', () => {
  startGame();
  intervalId = setInterval(updateTimer, 1000);
});
