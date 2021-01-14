document.addEventListener('DOMContentLoaded', () => {
  const userGrid = document.querySelector('.grid-user');
  const computerGrid = document.querySelector('.grid-computer');
  const displayGrid = document.querySelector('.grid-display');
  const ships = document.getElementsByClassName("ship");
  const startButton = document.querySelector('#start-game-button');
  const rotateButton = document.querySelector('#rotate-ships');
  const turnDisplay = document.querySelector('#turn');
  const resultDisplay = document.querySelector('#result');
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

  function generate(shipSize, shipName, board, boardName, shipOwner, id) {
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
            if (randomDirection === 0 && board[row+shipSquare][column] !== 0)
              break;
            else if (randomDirection === 1 && board[row][column+shipSquare] !== 0)
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

    let shipObject = {
      name: shipName, 
      row: startPos[0], 
      column: startPos[1], 
      size: shipSize,  
      direction: randomDirection,
      id: id,
      owner: shipOwner
    };
    placeShip(board, shipObject, boardName);
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
      document.getElementById(boardName + ',' + row + ',' + column).classList.add("taken", ship.name, "ship"+ship.id);

      if (row !== 1) markUnavailable(board, row-1, column, boardName);
      if (row !== 10) markUnavailable(board, row+1, column, boardName);
      if (column !== 1) markUnavailable(board, row, column-1, boardName);
      if (column !== 10) markUnavailable(board, row, column+1, boardName);
      if (row !== 1 && column !== 1) markUnavailable(board, row-1, column-1, boardName);
      if (row !== 1 && column !== 10) markUnavailable(board, row-1, column+1, boardName);
      if (row !== 10 && column !== 10) markUnavailable(board, row+1, column+1, boardName);
      if (row !== 10 && column !== 1) markUnavailable(board, row+1, column-1, boardName);
    }
    ship.owner.push({size: ship.size, blocksLeft: ship.size, sunk: false});
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

  let userShips = [];
  let computerShips = [];

  function randomizeBoard(player, ships, board) {
    generate(4, "four-size-ship", board, player, ships, 0);
    generate(3, "three-size-ship", board, player, ships, 1);
    generate(3, "three-size-ship", board, player, ships, 2);
    generate(2, "two-size-ship", board, player, ships, 3);
    generate(2, "two-size-ship", board, player, ships, 4);
    generate(2, "two-size-ship", board, player, ships, 5);
    generate(1, "one-size-ship", board, player, ships, 6);
    generate(1, "one-size-ship", board, player, ships, 7);
    generate(1, "one-size-ship", board, player, ships, 8);
    generate(1, "one-size-ship", board, player, ships, 9);
  }

  randomizeBoard("computer", computerShips, computerBoard);
  randomizeBoard("user", userShips, userBoard);
  //console.log(computerShips);

  //console.log(computerBoard);

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
      return;
    } else {
      shipArray.forEach(ship => {
        const shipObject = document.getElementById(ship.name + '-' + ship.index);
        shipObject.classList.remove(ship.name + "-vertical");
      })
      isHorizontal = true;
    }
  }

  rotateButton.addEventListener('click', rotateShips);

  let isGameOn = false;
  var currentPlayer = "user";
  const playerName = document.getElementById("player-name");

  let computerShots = [];
  let computerShotIndex = 0;
  for (let row = 1; row <= 10; row ++) {
    for (let col = 1; col <= 10; col ++) {
      computerShots.push([row, col]);
    }
  }
  computerShots = shuffle(computerShots);

  // Fisher-Yates (aka Knuth) Shuffle
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  function play() {
    console.log("zaidzia useris");
    turnDisplay.innerHTML = playerName.value + " turn to shoot";
    for (let row = 1; row <= 10; row ++) {
      for (let col = 1; col <= 10; col ++) {
        let square = document.getElementById("computer,"+row+","+col);
        square.addEventListener('click', function() { 
          if (currentPlayer !== "user")
            return;
          currentPlayer = "computer";
          turnDisplay.innerHTML = "Opponent's turn to shoot";
          
          shoot(square);
          if (square.classList.contains("hit")) {
            handleHit(computerShips, square);
          }
          
          //console.log("jau turejo pasikeist");
          //play();
          //computerTurn();
          
          setTimeout(computerTurn, 1000);
          console.log("zaidzia useris");
          
          
          console.log("pala ka");
        });
      }
    }
  }

  function computerTurn() {
    //setTimeout(() => { }, 1000);
    console.log("Zaidzia kompas");
    turnDisplay.innerHTML = "Opponent's turn to shoot";
    let square = document.getElementById(
      "user,"+computerShots[computerShotIndex][0]+","+computerShots[computerShotIndex][1]
    );
    console.log(square);
    shoot(square);
    if (square.classList.contains("hit")) {
      handleHit(userShips, square);
    }
    computerShotIndex++;
    currentPlayer = "user";
    turnDisplay.innerHTML = playerName.value + " turn to shoot";
    //play();
  }

  function handleHit(ships, square) {
    console.log("hitinam");
    const classes = square.classList;
    for (let i = 0; i < classes.length; i ++)
      if (classes[i].substring(0,4) === "ship") {
        var id = parseInt(classes[i].slice(-1));
        break;
      }

    ships[id].blocksLeft --;

    if (ships[id].blocksLeft === 0) {
      ships[id].sunk = true;
      checkIfWon(ships);
    }
  }

  startButton.addEventListener('click', play);

  function shoot(square) {
    if (square.classList.contains("taken")) {
      square.classList.remove("taken");
      square.classList.add("hit");
    } else if (!square.classList.contains("hit")){
      square.classList.add("missed");
    }
  }

  function checkIfWon(playerShips) {
    if (playerShips.every(ship => ship.sunk)) {
      console.log("laimejoooooooooooo");
      resultDisplay.innerHTML = "won";
      isGameOn = false;
    };
  }
})

// 0 - available
// 1 - taken
// 2 - unavailable
// 3 - hit
// 4 - missed