
let board = [];
let openedSquares = [];
let flaggedSquares = [];
let bombCount = 0;
let squaresLeft = 0;
let firstClick = true;
let rowCount, colCount;

const bombProbability = 3;
const maxProbability = 15;


function startGameWithDifficulty(difficulty) {
    let boardSize;

    switch (difficulty) {
        case 'easy':
            boardSize = { rowCount: 9, colCount: 9 };
            break;
        case 'medium':
            boardSize = { rowCount: 16, colCount: 16 };
            break;
        case 'expert':
            boardSize = { rowCount: 16, colCount: 30 };
            break;
        default:
            boardSize = { rowCount: 9, colCount: 9 };
    }

    rowCount = boardSize.rowCount;
    colCount = boardSize.colCount;
    firstClick = true;

    document.getElementById('start-game-section').classList.add('hidden');
    document.querySelector('.board').classList.remove('hidden');
    document.getElementById('reset-button').classList.remove('hidden');

    generateEmptyBoard(boardSize);
}


function generateEmptyBoard(boardMetadata) {
    squaresLeft = boardMetadata.colCount * boardMetadata.rowCount;
    openedSquares = [];
    flaggedSquares = [];
    bombCount = 0;
    firstClick = true;

    board = [];
    for (let i = 0; i < boardMetadata.rowCount; i++) {
        board[i] = new Array(boardMetadata.colCount).fill(null).map(() => new BoardSquare(false, 0));
    }

    updateBoardDisplay();
}


function placeBombs(excludeX, excludeY) {
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            if ((i !== excludeX || j !== excludeY) && Math.random() * maxProbability < bombProbability) {
                board[i][j].hasBomb = true;
                bombCount++;
            }
        }
    }

    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            if (!board[i][j].hasBomb) {
                board[i][j].bombsAround = countBombsAround(i, j, rowCount, colCount);
            }
        }
    }
}


function countBombsAround(x, y, rowCount, colCount) {
    let bombCount = 0;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i >= 0 && i < rowCount && j >= 0 && j < colCount && !(i === x && j === y)) {
                if (board[i][j].hasBomb) {
                    bombCount++;
                }
            }
        }
    }
    return bombCount;
}


function openSquare(x, y) {
    if (firstClick) {
        placeBombs(x, y);
        firstClick = false;
    }

    if (board[x][y].hasBomb) {
        alert("Game Over! You hit a bomb!");
        document.querySelector('#reset-button').classList.remove('d-none');
        revealBombs();
        return;
    } else {
        openedSquares.push(new Pair(x, y));
        squaresLeft--;

        if (board[x][y].bombsAround === 0) {
            for (let i = x - 1; i <= x + 1; i++) {
                for (let j = y - 1; j <= y + 1; j++) {
                    if (i >= 0 && i < board.length && j >= 0 && j < board[0].length && !openedSquares.some(p => p.x === i && p.y === j)) {
                        openSquare(i, j);
                    }
                }
            }
        }

        if (squaresLeft === bombCount) {
            alert("You win! All non-bomb squares opened!");
            document.querySelector('#reset-button').classList.remove('d-none');
        }
    }

    updateBoardDisplay();
}


function revealBombs() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].hasBomb) {
                openedSquares.push(new Pair(i, j));
            }
        }
    }
    updateBoardDisplay();
}


function updateBoardDisplay() {
    const boardElement = document.querySelector('.board');
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${colCount}, 50px)`;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const square = board[i][j];
            const squareElement = document.createElement('div');
            squareElement.classList.add('board-square');

            if (openedSquares.some(p => p.x === i && p.y === j)) {
                if (square.hasBomb) {
                    squareElement.classList.add('bomb');
                } else {
                    squareElement.textContent = square.bombsAround > 0 ? square.bombsAround : '';
                    squareElement.classList.add('opened');
                }
            }

            if (flaggedSquares.some(p => p.x === i && p.y === j)) {
                squareElement.classList.add('flagged');
            }

            squareElement.addEventListener('click', () => openSquare(i, j));
            boardElement.appendChild(squareElement);
        }
    }
}


class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
    }
}

class Pair {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


function resetGame() {
    document.getElementById('reset-button').classList.add('hidden');
    document.getElementById('start-game-section').classList.remove('hidden');
    document.querySelector('.board').classList.add('hidden');
}


document.getElementById('start-game-button').addEventListener('click', () => {
    document.getElementById('start-game-button').classList.add('hidden');
    document.getElementById('difficulty-buttons').classList.remove('hidden');
});



document.getElementById('dark-mode-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    
    if (document.body.classList.contains('dark-mode')) {
        this.textContent = 'Disable Dark Mode';
        this.classList.remove('btn-dark');
        this.classList.add('btn-light');
    } else {
        this.textContent = 'Enable Dark Mode';
        this.classList.remove('btn-light');
        this.classList.add('btn-dark');
    }
});




resetGame();
