const board = document.getElementById("board");
const statusText = document.querySelector(".status");
const popup = document.getElementById("popup");
const winnerMessage = document.getElementById("winnerMessage");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

let playerXWins = 0;  // Track Player X's wins
let playerOWins = 0;  // Track Player O's wins

let deferredPrompt;
let installButton = document.createElement("button");
installButton.innerText = "Install App";
installButton.style.position = "absolute";
installButton.style.bottom = "20px";
installButton.style.right = "20px";
installButton.style.padding = "10px 20px";
installButton.style.backgroundColor = "#4CAF50";
installButton.style.color = "white";
installButton.style.border = "none";
installButton.style.borderRadius = "5px";
installButton.style.display = "none";  // Initially hidden

document.body.appendChild(installButton);

// Listen for the 'beforeinstallprompt' event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default prompt
    e.preventDefault();
    // Save the event for later
    deferredPrompt = e;
    
    // Show the install button
    installButton.style.display = 'block';

    // When the user clicks the install button, show the install prompt
    installButton.addEventListener('click', () => {
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null; // Reset the prompt after the user has made a choice
            installButton.style.display = 'none'; // Hide the install button
        });
    });
});


// Create Board
function createBoard() {
    board.innerHTML = "";
    gameBoard.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.index = index;
        cellDiv.innerText = cell;
        cellDiv.addEventListener("click", handleCellClick);
        board.appendChild(cellDiv);
    });
}

// Handle Cell Click
function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (gameBoard[index] !== "" || !gameActive) return;

    gameBoard[index] = currentPlayer;
    event.target.innerText = currentPlayer;
    checkWinner();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = `Player ${currentPlayer}'s Turn`;
}

// Check for Winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]  // Diagonals
    ];
    
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            showPopup(`Player ${gameBoard[a]} Wins!`);
            updateScore(gameBoard[a]);  // Update the score
            gameActive = false;
            return;
        }
    }

    if (!gameBoard.includes("")) {
        showPopup("It's a Draw!");
        gameActive = false;
    }
}

// Update Score
function updateScore(winner) {
    if (winner === "X") {
        playerXWins++;
        scoreX.innerText = playerXWins;
    } else if (winner === "O") {
        playerOWins++;
        scoreO.innerText = playerOWins;
    }
}

// Show Popup
function showPopup(message) {
    winnerMessage.innerText = message;
    popup.style.display = "flex";
}

// Close Popup and Restart Game
function closePopup() {
    popup.style.display = "none";
    resetGame();
}

// Restart Game
function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusText.innerText = `Player X's Turn`;
    createBoard();
}

// Toggle Theme (Dark/Light)
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

// Initialize Game
createBoard();
