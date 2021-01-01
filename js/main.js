document.addEventListener('DOMContentLoaded', () => {
  const userGrid = document.querySelector('.grid-user');
  const computerGrid = document.querySelector('.grid-computer');
  const displayGrid = document.querySelector('.grid-display');
  const ships = document.querySelectorAll('.ship');
  // todo: ships?
  const startButton = document.querySelector('#start-game-button');
  const rotateButton = document.querySelector('#rotate-ships');
  const turnDisplay = document.querySelector('#turn');
  const resultDisplay = document.querySelector('#result');
  const squareWidth = 10;
  let userBoard = Array(11).fill(0).map(() => Array(11).fill(0));
  let computerBoard = Array(11).fill(0).map(() => Array(11).fill(0));

  // create a board
  function createBoard(grid, boardName) {
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
        square.id = [boardName, row, column];
        grid.appendChild(square);
      }
    }
  }

  function generate(shipSize, shipName, boardName) {
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
    placeShip(computerBoard, shipObject, boardName);
  }
  
  function placeShip(board, ship, boardName) {
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
      
      document.getElementById(boardName + ',' + row + ',' + column).classList.remove("unavailable");
      document.getElementById(boardName + ',' + row + ',' + column).classList.add("taken", ship.name);

      if (row !== 1) markUnavailable(board, row-1, column, boardName);
      if (row !== 10) markUnavailable(board, row+1, column, boardName);
      if (column !== 1) markUnavailable(board, row, column-1, boardName);
      if (column !== 10) markUnavailable(board, row, column+1, boardName);
      if (row !== 1 && column !== 1) markUnavailable(board, row-1, column-1, boardName);
      if (row !== 1 && column !== 10) markUnavailable(board, row-1, column+1, boardName);
      if (row !== 10 && column !== 10) markUnavailable(board, row+1, column+1, boardName);
      if (row !== 10 && column !== 1) markUnavailable(board, row+1, column-1, boardName);
    }
  }

  function markUnavailable(board, row, column, boardName) {
    let square = document.getElementById(boardName + ',' + row + ',' + column);
      if (!square.classList.contains("taken")) {
        square.classList.add("unavailable");
        board[row][column] = 2;
      }
  }

  createBoard(userGrid, "user");
  createBoard(computerGrid, "computer");

  generate(4, "four-size-ship", "computer");
  generate(3, "three-size-ship", "computer");
  generate(3, "three-size-ship", "computer");
  generate(2, "two-size-ship", "computer");
  generate(2, "two-size-ship", "computer");
  generate(2, "two-size-ship", "computer");
  generate(1, "one-size-ship", "computer");
  generate(1, "one-size-ship", "computer");
  generate(1, "one-size-ship", "computer");
  generate(1, "one-size-ship", "computer");

  console.log(computerBoard);

  //--------------------------------------------------

  function createDraggableShip(ship) {
    const shipDiv = document.createElement('div');
    shipDiv.classList.add("ship", ship.name);
    shipDiv.setAttribute("draggable", "true");
    shipDiv.id = ship.name + '-' + ship.index;
    
    for (let i = 0; i < ship.size; i ++) {
      const squareDiv = document.createElement('div');
      squareDiv.classList.add(ship.name + "-" + ship.index + "-" + i);
      shipDiv.appendChild(squareDiv);
    }
    displayGrid.appendChild(shipDiv);
  }

  const shipArray = [
    {
      name: "one-size-ship",
      size: 1,
      index: 0
    },
    {
      name: "one-size-ship",
      size: 1,
      index: 1
    },
    {
      name: "one-size-ship",
      size: 1,
      index: 2
    },
    {
      name: "one-size-ship",
      size: 1,
      index: 3
    },
    {
      name: "two-size-ship",
      size: 2,
      index: 0
    },
    {
      name: "two-size-ship",
      size: 2,
      index: 1
    },
    {
      name: "two-size-ship",
      size: 2,
      index: 2
    },
    {
      name: "three-size-ship",
      size: 3,
      index: 0
    },
    {
      name: "three-size-ship",
      size: 3,
      index: 1
    },
    {
      name: "four-size-ship",
      size: 4,
      index: 1
    }
  ]

  shipArray.forEach(ship => createDraggableShip(ship));

  // -------------------------------------------------
  // todo: assign styles to elements through js instead of css
  let isHorizontal = true;
  function rotateShips() {
    if (isHorizontal) {
      shipArray.forEach(ship => {
        const shipObject = document.getElementById(ship.name + '-' + ship.index);
        shipObject.classList.toggle(ship.name + "-vertical");
      })
      isHorizontal = false;
    } else {
      shipArray.forEach(ship => {
        const shipObject = document.getElementById(ship.name + '-' + ship.index);
        shipObject.classList.remove(ship.name + "-vertical");
      })
      isHorizontal = true;
    }
  }

  rotateButton.addEventListener('click', rotateShips);
})

// 0 - available
// 1 - taken
// 2 - unavailable
// 3 - hit
// 4 - missed