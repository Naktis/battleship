document.addEventListener('DOMContentLoaded', () => {
  const userGrid = document.querySelector('.grid-user');
  const computerGrid = document.querySelector('.grid-computer');
  const displayGrid = document.querySelector('.grid-display');
  const ships = document.querySelectorAll('.ship');
  // todo: ships?
  const startButton = document.querySelectorAll('#start-game-button');
  const rotateButton = document.querySelectorAll('#rotate-ships');
  const turnDisplay = document.querySelectorAll('#turn');
  const resultDisplay = document.querySelectorAll('#result');
  const squareWidth = 10;
  let userBoard = Array(11).fill(0).map(() => Array(11).fill(0));
  let computerBoard = Array(11).fill(0).map(() => Array(11).fill(0));

  // create a board
  function createBoard(grid, board) {
    const emptyDiv = document.createElement('div');
    grid.appendChild(emptyDiv);

    for (let i = 65; i <= 74; i ++) {
      const letterDiv = document.createElement('div');
      const letterText = document.createTextNode(String.fromCharCode(i));
      letterDiv.appendChild(letterText);
      grid.appendChild(letterDiv);
    }

    for (let row = 1; row <= 10; row ++) {
      const numberDiv = document.createElement('div');
      const numberText = document.createTextNode(row);
      numberDiv.appendChild(numberText);
      grid.appendChild(numberDiv);

      for (let column = 1; column <= 10; column ++) {
        const square = document.createElement('div');
        square.id = [row, column];
        grid.appendChild(square);
      }
    }
  }

  function generate(shipSize, shipName) {
    let randomDirection = Math.floor(Math.random() * 2);

    const availableStartPos = (function() {
      let maxrow = 10, maxcol = 10;
      if (randomDirection === 0) // horizontal
        maxrow = 11 - shipSize;
      else maxcol = 11 - shipSize; // vertical

      let positions = [];
      for (let row = 1; row <= maxrow; row ++) {
        for (let column = 1; column <= maxcol; column ++) {
          var shipSquare = 0;
          while (shipSquare < shipSize) {
            if (randomDirection === 0 && computerBoard[row+shipSquare][column] !== 0)
              break;
            else if (randomDirection === 1 && computerBoard[row][column+shipSquare] !== 0)
              break;
            shipSquare ++;
          }

          if (shipSquare === shipSize)
            positions.push([row, column]);
        }
      }
      return positions;
    })();

    let startPosIndex = Math.floor(Math.random() * availableStartPos.length);
    let startPos = availableStartPos[startPosIndex];

    let shipObject = {name: shipName, row: startPos[0], column: startPos[1], size: shipSize,  direction: randomDirection};
    placeShip(computerBoard, shipObject);
  }
  
  function placeShip(board, ship) {
    let row, column;
    for (let i = 0; i < ship.size; i ++) {
      if (ship.direction === 0) {
        row = ship.row + i;
        column = ship.column;
      } else {
        row = ship.row;
        column = ship.column + i;
      }
      board[row][column] = 1;
      document.getElementById(row + ',' + column).classList.remove("unavailable");
      document.getElementById(row + ',' + column).classList.add("taken", ship.name);

      if (row !== 1) markUnavailable(board, row-1, column);
      if (row !== 10) markUnavailable(board, row+1, column);
      if (column !== 1) markUnavailable(board, row, column-1);
      if (column !== 10) markUnavailable(board, row, column+1);
      if (row !== 1 && column !== 1) markUnavailable(board, row-1, column-1);
      if (row !== 1 && column !== 10) markUnavailable(board, row-1, column+1);
      if (row !== 10 && column !== 10) markUnavailable(board, row+1, column+1);
      if (row !== 10 && column !== 1) markUnavailable(board, row+1, column-1);
    }
  }

  function markUnavailable(board, row, column) {
    let square = document.getElementById(row + ',' + column);
      if (!square.classList.contains("taken")) {
        square.classList.add("unavailable");
        board[row][column] = 2;
      }
  }

  createBoard(userGrid, userBoard);
  createBoard(computerGrid, computerBoard);

  generate(4, "four-size-ship");
  generate(3, "three-size-ship");
  generate(3, "three-size-ship");
  generate(2, "two-size-ship");
  generate(2, "two-size-ship");
  generate(2, "two-size-ship");
  generate(1, "one-size-ship");
  generate(1, "one-size-ship");
  generate(1, "one-size-ship");
  generate(1, "one-size-ship");

  console.log(computerBoard);
})

// 0 - available
// 1 - taken
// 2 - unavailable
// 3 - hit
// 4 - missed