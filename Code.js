const board = document.getElementById("board");
const statusText = document.querySelector(".status");
const popup = document.getElementById("popup");
const winnerMessage = document.getElementById("winnerMessage");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

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
    event.target.classList.add(currentPlayer); // Add the class to style X or O
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
            gameActive = false;
            return;
        }
    }

    if (!gameBoard.includes("")) {
        showPopup("It's a Draw!");
        gameActive = false;
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

// Initialize Game
createBoard();
