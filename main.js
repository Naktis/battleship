var isGameOn = true;
var currentPlayer = "user";
const playerName = document.getElementById("player-name");

const userGrid = document.querySelector('.grid-user');
const computerGrid = document.querySelector('.grid-computer');
const ships = document.getElementsByClassName("ship");
const turnDisplay = document.querySelector('#turn');
const resultDisplay = document.querySelector('#result');

createBoard(userGrid, "user");
createBoard(computerGrid, "computer");

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
    index: 4
  },
  {
    name: "two-size-ship",
    size: 2,
    index: 5
  },
  {
    name: "two-size-ship",
    size: 2,
    index: 6
  },
  {
    name: "three-size-ship",
    size: 3,
    index: 7
  },
  {
    name: "three-size-ship",
    size: 3,
    index: 8
  },
  {
    name: "four-size-ship",
    size: 4,
    index: 9
  }
]

let userBoard = Array(11).fill(0).map(() => Array(11).fill(0));
let computerBoard = Array(11).fill(0).map(() => Array(11).fill(0));
let userShips = [];
let computerShips = [];

// randomly place opponent's ships
for (let i = shipArray.length-1; i >= 0; i --) { // reverse loop
  generate(shipArray[i].size, shipArray[i].name, computerBoard, "computer", computerShips, shipArray[i].index);
}

// create user pickable ships
var unplacedShips = [];
const displayGrid = document.querySelector('.grid-display');
shipArray.forEach(ship => createUnplacedShip(ship));

// make user pickable ships movable
unplacedShips.forEach(ship => ship.addEventListener("click", function() {
  for (let row = 1; row <= 10; row ++) {
    for (let col = 1; col <= 10; col ++) {
      let square = document.getElementById("user,"+row+","+col);
      square.ship = ship;
      square.isVertical = ship.classList.contains(shipArray[ship.id].name+"-vertical");
      square.shipSize = shipArray[ship.id].size;
      square.addEventListener("mouseover", handleDivMouseOver);
      square.addEventListener("mouseout", handleDivMouseOut);
      square.addEventListener("click", handleDivClick);
    }
  }
}));

// placeable ship rotation
let isHorizontal = true;
const rotateButton = document.querySelector('#rotate-ships');
rotateButton.addEventListener('click', rotateShips);

// game start
const startButton = document.querySelector('#start-game-button');
startButton.addEventListener('click', play);

// restart
const restartButton = document.querySelector('#restart');
restartButton.addEventListener('click', function () {
  location.reload();
});

// randomize user ships
const randomizeButton = document.getElementById("randomize");
randomizeButton.addEventListener('click', function () {
  // don't randomize if any ships are already placed
  if (document.getElementsByClassName("ship").length !== 10) {
    return;
  }

  for (let i = shipArray.length-1; i >= 0; i --) {
    generate(shipArray[i].size, shipArray[i].name, userBoard, "user", userShips, shipArray[i].index);
  }

  document.querySelectorAll('.ship').forEach(function(a){
    a.remove()
    })
})

// generate computer shooting pattern
var computerShots = [];
var computerShotIndex = 0;
for (let row = 1; row <= 10; row ++) {
  for (let col = 1; col <= 10; col ++) {
    computerShots.push([row, col]);
  }
}
computerShots = shuffle(computerShots);

// create chat
let chat = document.getElementById("chat-text");
document.getElementById("msg-button").addEventListener('click', function() {
  let text = document.getElementById("msg-text");
  if (text.value !== "") {
    addMessage(text.value, "user");
    text.value = "";
  }
});

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

function createUnplacedShip(ship) {
  const shipDiv = document.createElement("div");
  shipDiv.classList.add("ship", ship.name);
  shipDiv.id = ship.index;
  displayGrid.appendChild(shipDiv);
  unplacedShips.push(shipDiv);
}

function handleDivMouseOver(e) {
  let squareId = e.target.id.split(',');
  let squareRow = parseInt(squareId[1]);
  let squareCol = parseInt(squareId[2]);
  let shipSquare = 0;
  while (shipSquare < e.target.shipSize) {
    if (e.target.isVertical) {
      if (squareRow+shipSquare > 10) {
        break;
      } else if (userBoard[squareRow+shipSquare][squareCol] !== 0) {
        break;
      }
    } else if (squareCol+shipSquare > 10) { // goes down here when the ship is horizontal
        break;
    } else if (userBoard[squareRow][squareCol+shipSquare] !== 0) {
      break;
    }
    shipSquare ++;
  }

  if (shipSquare === e.target.shipSize) {
    let hoverShipSquare = 0;
    while (hoverShipSquare < e.target.shipSize) {
      if (e.target.isVertical) {
        let hoverRow = squareRow+hoverShipSquare;
        document.getElementById("user,"+hoverRow+","+squareCol)
                .classList.add(shipArray[e.target.ship.id].name, "eligible");
      }
      else if (!e.target.isVertical) {
        let hoverCol = squareCol+hoverShipSquare;
        document.getElementById("user,"+squareRow+","+hoverCol)
                  .classList.add(shipArray[e.target.ship.id].name, "eligible");
      }
      hoverShipSquare ++;
    }
  }
}

function handleDivMouseOut(e) {
  let squareId = e.target.id.split(',');
  let squareRow = parseInt(squareId[1]);
  let squareCol = parseInt(squareId[2]);
  let hoverShipSquare = 0;
  
  if (userBoard[squareRow][squareCol] !== 0)
    return;

    while (hoverShipSquare < e.target.shipSize) {
      if (e.target.isVertical) {
        let hoverRow = squareRow+hoverShipSquare;
        if (hoverRow > 10) break;
        document.getElementById("user,"+hoverRow+","+squareCol)
                .classList.remove(shipArray[e.target.ship.id].name, "eligible");
      }
      else if (!e.target.isVertical) {
        let hoverCol = squareCol+hoverShipSquare;
        if (hoverCol > 10) break;
        document.getElementById("user,"+squareRow+","+hoverCol)
                  .classList.remove(shipArray[e.target.ship.id].name, "eligible");
      }
      hoverShipSquare ++;
    }
}

function handleDivClick(e) {
  if (e.target.classList.contains("eligible")) {
    let squareId = e.target.id.split(',');

    let shipObject = {
      name: shipArray[e.target.ship.id].name, 
      row: parseInt(squareId[1]), 
      column: parseInt(squareId[2]), 
      size: e.target.shipSize,  
      direction: e.target.isVertical? 0 : 1,
      id: e.target.ship.id,
      owner: userShips
    };
    placeShip(userBoard, shipObject, "user");
    for (let row = 1; row <= 10; row ++) {
      for (let col = 1; col <= 10; col ++) {
        let trash = document.getElementById("user,"+row+","+col);
        trash.removeEventListener("mouseover", handleDivMouseOver);
        trash.removeEventListener("mouseout", handleDivMouseOut);
        trash.removeEventListener("click", handleDivClick);
      }
    }
    document.getElementById(e.target.ship.id).remove();
  }
}


function rotateShips() {
  for (let i = 0; i < 10; i ++) {
    const ship = document.getElementById(i);
    if (!ship) continue;
    let classList = ship.classList;
    let classIndex = 0;
    while (classIndex < classList.length) {
      if (classList[classIndex].includes('-')) {
        var name = classList[classIndex];
        break;
      }
      classIndex ++;
    }

    if (isHorizontal) {
      ship.classList.toggle(name + "-vertical")
    } else {
      ship.classList.remove(name + "-vertical");
    }
  }
  isHorizontal = !isHorizontal;
}

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
  const leftoverShips = document.getElementsByClassName("ship");
  if (leftoverShips.length) {
    return;
  }

  hideStartButtons();
  changeUserShipColors();

  // sort ships to match the primary ship array indexes
  userShips.sort((a, b) => (a.size > b.size) ? 1 : -1);
  computerShips.sort((a, b) => (a.size > b.size) ? 1 : -1);

  generateHealthyShips("user");
  generateHealthyShips("opponent");

  let row = document.createElement("div");
  row.innerHTML = "Game has started";
  chat.appendChild(row);

  turnDisplay.innerHTML = playerName.value + " turn to shoot";
  for (let row = 1; row <= 10; row ++) {
    for (let col = 1; col <= 10; col ++) {
      let square = document.getElementById("computer,"+row+","+col);
      square.addEventListener('click', userTurn);
    }
  }
}

function changeUserShipColors() {
  let unavailables = document.getElementsByClassName("unavailable");
  for (let i = 0; i < unavailables.length; i ++)
    unavailables[i].classList.add("hide-unavailable");

  let taken = document.getElementsByClassName("taken");
  for (let i = 0; i < taken.length; i ++)
    taken[i].classList.add("hide-taken");
}

function userTurn(e) { 
  if (currentPlayer !== "user")
    return;

  shoot(e.target);
  if (e.target.classList.contains("hit")) {
    handleHit(computerShips, e.target);
  }

  currentPlayer = "computer";
  turnDisplay.innerHTML = "Opponent's turn to shoot";
  
  setTimeout(computerTurn, 1000);
}

function computerTurn() {
  if (!isGameOn)
    return;

  turnDisplay.innerHTML = "Opponent's turn to shoot";
  let square = document.getElementById(
    "user,"+computerShots[computerShotIndex][0]+","+computerShots[computerShotIndex][1]
  );

  shoot(square);
  if (square.classList.contains("hit")) {
    handleHit(userShips, square);
  }
  computerShotIndex++;
  currentPlayer = "user";
  turnDisplay.innerHTML = playerName.value + " turn to shoot";
}

function handleHit(ships, square) {
  const classes = square.classList;
  for (let i = 0; i < classes.length; i ++)
    if (classes[i].substring(0,4) === "ship") {
      var id = parseInt(classes[i].slice(-1));
      break;
    }

  ships[id].blocksLeft --;

  if (ships[id].blocksLeft === 0) {
    ships[id].sunk = true;
    
    if (currentPlayer === "user") {
      removeSunkShip(id, "opponent");
      addMessage("You have sunk your opponent's " + ships[id].size + " size ship.", "good");
    }
    else {
      removeSunkShip(id, "user");
      addMessage("The opponent has sunk your " + ships[id].size + " size ship.", "bad");
    }
    checkIfWon(ships);
  }
}

function removeSunkShip(id, player) {
  let container = document.getElementById(player+"-ships");
  for (let i = 0; i < container.childNodes.length; i ++) {
    if (container.childNodes[i].classList.contains("ship"+id)) {
      var shipToRemove = container.childNodes[i];
      break;
    }
  }
  
  container.removeChild(shipToRemove);
}

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
    if (currentPlayer === "user") {
      addMessage("YOU WON", "good");
      resultDisplay.innerHTML = "Game end. " + playerName.value + " has won";
    }
    else {
      resultDisplay.innerHTML = "Game end. Your opponent has won";
      addMessage("YOU LOST", "bad");
    }
    turnDisplay.remove();
    
    isGameOn = false;
    endGame();
  };
}


function addMessage(text, type) {
  let row = document.createElement("div");
  row.classList.add("msg-"+type);
  row.innerHTML = text;
  chat.insertBefore(row, chat.firstChild);
}

function endGame() {
  for (let row = 1; row <= 10; row ++) {
    for (let col = 1; col <= 10; col ++) {
      let square = document.getElementById("computer,"+row+","+col);
      square.removeEventListener('click', userTurn);
    }
  }
}

function generateHealthyShips(player) {
  const container = document.getElementById(player+"-ships");
  for (let i = 0; i < shipArray.length; i ++) {
    const shipDiv = document.createElement('div');
    shipDiv.classList.add(shipArray[i].name, "ship"+shipArray[i].index, "ship");
    container.appendChild(shipDiv);
  }
}

function hideStartButtons() {
  document.getElementById("name-div").style.display = "none";
  startButton.style.display = "none";
  randomizeButton.style.display = "none";
  rotateButton.style.display = "none";
}

// 0 - available
// 1 - taken
// 2 - unavailable
// 3 - hit
// 4 - missed