const number = generateRandomNumber();
const attemptsLimit = 6; 
let attempts = 0;

//generate number
function generateRandomNumber() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

//create gameboard
function createGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    for (let i = 0; i < attemptsLimit * 5; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        gameBoard.appendChild(cell);
    }
}

//update board
function updateGameBoard(guess, feedback) {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < guess.length; i++) {
        const cellIndex = attempts * 5 + i;
        cells[cellIndex].textContent = guess[i];
        cells[cellIndex].classList.add(feedback[i]);
    }
}

//board feedback
function provideFeedback(guess, answer) {
    let feedback = [];
    let answerArr = answer.split('');
    let guessArr = guess.split('');

    // Mark correct positions first
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === answer[i]) {
            feedback[i] = 'correct';
            answerArr[i] = null; // Remove from answer array to avoid duplicate matches
            guessArr[i] = null; // Remove from guess array to avoid duplicate matches
        }
    }

    // Mark present digits
    for (let i = 0; i < guess.length; i++) {
        if (guessArr[i] && answerArr.includes(guessArr[i])) {
            feedback[i] = 'present';
            answerArr[answerArr.indexOf(guessArr[i])] = null; // Remove from answer array
        } else if (!feedback[i]) {
            feedback[i] = 'wrong';
        }
    }

    return feedback;
}

function submitGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value;

    if (guess.length !== 5 || !/^\d+$/.test(guess)) {
        alert('Please enter a valid 5-digit number.');
        return;
    }

    if (attempts >= attemptsLimit) {
        alert('Game over! No more attempts left.');
        return;
    }

    const feedback = provideFeedback(guess, number);
    updateGameBoard(guess, feedback);

    attempts++;
    guessInput.value = '';
    let result = document.getElementById('result');
    if (guess === number) {
        result.innerHTML=`Congratulations! You've guessed the number ${number} correctly!`;
        return;
    }

    if (attempts === attemptsLimit) {
        result.innerHTML=`Sorry! You've used all your attempts. The number was: ${number}`;
    }
}

// Initialize the game board
createGameBoard();